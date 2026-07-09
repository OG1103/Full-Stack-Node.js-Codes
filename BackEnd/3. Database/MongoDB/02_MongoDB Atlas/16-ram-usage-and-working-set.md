# 16 — RAM Usage, WiredTiger Cache & Working Set

## Three Separate RAM Pools

In a production stack there are three distinct RAM pools on three different machines,
each solving a different problem. Never confuse them.

```
App Server RAM                Redis RAM                  MongoDB RAM
──────────────                ─────────────              ──────────────────
Node.js process heap          cached query results        WiredTiger cache
in-flight HTTP requests       user sessions               ├── indexes
connection pool state         rate limit counters         ├── hot documents
response data being built     cached computations         └── query result buffers
                                                          connection overhead (~1MB/conn)
                                                          write journals & buffers
```

They scale independently:
- Traffic spike → stresses **app server RAM**
- Cache miss rate rising → stresses **Redis RAM**
- Dataset growth → stresses **MongoDB RAM**

---

## How MongoDB Uses Its RAM — WiredTiger Cache

MongoDB's storage engine is **WiredTiger**. It uses a portion of the server's RAM
as an in-memory cache for indexes and documents.

```
MongoDB Server
┌──────────────────────────────────────────────────────┐
│  Total RAM (e.g. 8GB on M30)                         │
│                                                      │
│  ┌────────────────────────────────┐                  │
│  │     WiredTiger Cache (~3.5GB)  │                  │
│  │                                │                  │
│  │  indexes          (highest     │                  │
│  │  hot documents     priority)   │                  │
│  │  query buffers                 │                  │
│  └────────────────────────────────┘                  │
│                                                      │
│  OS + MongoDB process overhead (~1–2GB)              │
│  Connection memory (~1MB × connections)              │
└──────────────────────────────────────────────────────┘
```

**WiredTiger cache size formula (MongoDB default):**
```
cache size = max( (total RAM - 1GB) × 0.5,  256MB )
```

**Per Atlas tier:**

| Tier | Total RAM | WiredTiger Cache | OS + Overhead | Left for connections |
|------|-----------|-----------------|---------------|---------------------|
| M10 | 2GB | ~0.5GB | ~1GB | ~0.5GB |
| M20 | 4GB | ~1.5GB | ~1GB | ~1.5GB |
| M30 | 8GB | ~3.5GB | ~1.5GB | ~3GB |
| M40 | 16GB | ~7.5GB | ~2GB | ~6.5GB |
| M50 | 32GB | ~15.5GB | ~2.5GB | ~14GB |
| M60 | 64GB | ~31.5GB | ~3GB | ~29GB |

> M0 and FLEX are shared — WiredTiger cache is not dedicated or guaranteed.

---

## The Full Request Flow — All Three Layers

```
User request
→ hits App Server (uses app server RAM)
→ App checks Redis first
    → cache HIT  → returns data immediately → never touches MongoDB ✅
    → cache MISS → continues to MongoDB
                    → MongoDB checks WiredTiger cache
                        ├── found in cache → index/doc lookup in RAM → milliseconds
                        └── not in cache   → reads from disk → 10–100ms+ → loads into cache
                    → result returns to App Server
                    → App Server writes result to Redis for next time
                    → returns response to user
```

**Redis hit** = answered from Redis RAM → microseconds, MongoDB never involved
**MongoDB cache hit** = answered from WiredTiger RAM → milliseconds, no disk I/O
**MongoDB cache miss** = disk read required → slowest path, then cached for next request

---

## What Lives in the WiredTiger Cache

### Indexes — Always Prioritized

WiredTiger keeps indexes in RAM before documents. Indexes are small and give the
most benefit per byte of cache used.

```
Index on users.email (1M documents)     ≈ 20–50MB
Compound index (firstName + lastName)   ≈ 40–80MB
Text index on a description field       ≈ 200MB–1GB (text indexes are large)
Typical app: 10 collections × 3 indexes ≈ 300MB–800MB total
```

If all your indexes fit in the WiredTiger cache, every query will use in-memory
index lookups regardless of document count. This is the ideal state.

### Hot Documents — The Working Set

The **working set** is the subset of your data that gets read/written frequently.

```
Total dataset: 50GB
  └── Last 30 days of orders (hot):  2GB  ← what you actually query constantly
  └── Historical orders (cold):     48GB  ← rarely touched, lives on disk

If WiredTiger cache ≥ 2GB → hot data always in RAM → fast
If WiredTiger cache < 2GB → hot data partially on disk → cache thrashing
```

**Cache thrashing:** when the cache is too small to hold the working set,
MongoDB constantly evicts recently loaded data to make room, then re-loads it.
Every query becomes a disk read. Performance degrades sharply.

---

## Average RAM Numbers by Use Case

### Small App (side project, internal tool)
```
Documents:   < 100K per collection
Indexes:     3–5 per collection, simple fields
Total index size: 10–50MB
Working set: < 200MB

Recommended tier: M10 (0.5GB cache)
→ entire working set + all indexes fit in cache easily
```

### Medium App (startup, SaaS with real users)
```
Documents:   500K–2M per collection
Indexes:     5–8 per collection, some compound
Total index size: 100–500MB
Working set: 500MB–2GB (recent records, active users)

Recommended tier: M20 (1.5GB cache) to M30 (3.5GB cache)
→ M20 fits indexes + light working set
→ M30 fits indexes + full working set comfortably
```

### High-Traffic App (100K+ users, heavy read/write)
```
Documents:   5M–50M per collection
Indexes:     8–15 per collection, compound + text
Total index size: 500MB–3GB
Working set: 2–8GB (last N days of activity)

Recommended tier: M30 (3.5GB) to M40 (7.5GB cache)
→ M30 fits if working set is well-bounded and queries are selective
→ M40 needed if working set exceeds 3GB or text indexes are heavy
```

### Enterprise / Data-Heavy App
```
Documents:   50M–500M+ per collection
Indexes:     complex, large, possibly geospatial or text heavy
Total index size: 3GB–20GB+
Working set: 10GB–50GB+

Recommended tier: M50+ (15.5GB+ cache) with sharding
→ sharding distributes the working set across nodes
→ each shard only needs to cache its own slice
```

---

## The Two Independent RAM Scaling Decisions

```
High traffic, small dataset
─────────────────────────────
App server RAM:  scale up (more concurrent requests)
MongoDB RAM:     stays small (indexes are tiny, working set is small)
→ Upgrade your EC2 instance, keep Atlas tier

Low traffic, huge dataset
─────────────────────────────
App server RAM:  stays small (few concurrent users)
MongoDB RAM:     scale up (large indexes + working set must fit in cache)
→ Keep your EC2 instance, upgrade Atlas tier

High traffic, huge dataset
─────────────────────────────
Both need scaling:
→ Upgrade EC2 instance + upgrade Atlas tier
→ Or go horizontal: more app servers + Atlas auto-scaling / sharding
```

---

## How Redis Reduces Pressure on Every Other Layer

Redis sits in front of MongoDB and absorbs repeated identical queries.
A typical cache hit rate of 80–90% means 80–90% of requests never reach MongoDB.

```
10,000 requests for the same product listing:

Without Redis:                         With Redis:
→ 10,000 queries hit MongoDB           → request #1 hits MongoDB → cached in Redis
→ 10,000 WiredTiger cache lookups      → requests #2–10,000 served from Redis
→ connection pool filling up           → MongoDB sees 1 query total
→ MongoDB RAM under heavy pressure     → connection pool barely touched
                                       → MongoDB RAM barely used
```

**What Redis does to each layer:**

| Layer | Without Redis | With Redis |
|-------|--------------|------------|
| App Server RAM | Requests hold memory longer waiting for MongoDB | Requests resolve faster from Redis → freed sooner → less RAM pressure |
| MongoDB RAM | Every request hits WiredTiger cache → needs to be large | 80–90% of queries never arrive → cache under far less pressure |
| MongoDB Disk | Cache misses hit disk frequently under load | Far fewer queries reach MongoDB → disk I/O drops |

### The Three Access Tiers by Speed

```
Layer 1 — Redis (fastest)
→ pure RAM, no query execution, no index traversal
→ key → value lookup
→ response time: microseconds (< 1ms)

Layer 2 — MongoDB WiredTiger Cache (fast)
→ index lookup + document fetch, all in RAM
→ response time: 1–20ms

Layer 3 — MongoDB Disk (slow)
→ data not in WiredTiger cache → physical disk read
→ response time: 10–200ms+
→ always the last resort
```

### What Each Layer Protects

```
Redis        → protects MongoDB from repeated identical queries
MongoDB RAM  → protects disk from every query hitting storage
Disk         → last resort, always the slowest path
```

### When Redis Is Most Effective

Redis gives the biggest gains when the same data is read repeatedly:
```
Product listings       ✅ — thousands of users view the same products
User profile pages     ✅ — profile doesn't change per request
Config / feature flags ✅ — same for all users, rarely changes
Leaderboards           ✅ — read far more often than updated

Unique per-user data   ⚠️  — cache hit rate is lower, less benefit
Write-heavy data       ⚠️  — cache invalidation complexity grows
Highly dynamic data    ⚠️  — TTL must be short, reducing cache benefit
```

---

## Warning Signs That MongoDB RAM Is Too Small

Monitor these in the Atlas UI (Metrics tab):

| Metric | What it means | Action |
|--------|--------------|--------|
| **Cache Bytes Read from Disk** increasing | Working set exceeding cache — disk reads happening constantly | Upgrade tier or reduce working set |
| **Page Faults** > 0 consistently | Data not found in cache, going to disk | Same as above |
| **Cache Used %** consistently > 90% | Cache is full, evictions happening frequently | Upgrade tier |
| **Query Execution Time** spiking randomly | Intermittent cache misses on hot data | Check working set size vs cache size |
| **Disk IOPS** high | Too many disk reads to compensate for cache misses | Upgrade tier or archive cold data |

---

## How to Reduce RAM Pressure Without Upgrading

Before paying for a bigger tier, try these first:

1. **Archive cold data** — move old records to Atlas Online Archive (object storage, cheap)
   ```
   Archive orders older than 1 year → removes them from working set
   → working set shrinks → fits back in cache
   ```

2. **Project only needed fields** — don't load full documents when you only need 2 fields
   ```js
   // Bad — loads entire document into cache
   db.users.find({ active: true })

   // Good — loads only what you need, smaller cache footprint
   db.users.find({ active: true }, { name: 1, email: 1 })
   ```

3. **Add indexes for your hottest queries** — index lookups use far less cache than document scans
   ```
   Full collection scan: loads every document → massive cache pressure
   Index scan:           loads only the index → tiny cache footprint
   ```

4. **Avoid large text indexes if possible** — text indexes can be 5–10× larger than a regular index
   → Use Atlas Search (built on Lucene) for full-text search instead

5. **Paginate queries** — unbounded queries load everything into cache and evict hot data
   ```js
   // Bad — loads 100K documents
   db.orders.find({})

   // Good — loads 20 at a time
   db.orders.find({}).limit(20).skip(page * 20)
   ```

---

## Summary

```
Three separate RAM pools — each solves a different problem:

App Server RAM  → concurrency capacity
                  holds in-flight requests
                  scale when: traffic grows, more concurrent users
                  symptom when too small: OOM crashes

Redis RAM       → query result cache
                  absorbs repeated identical queries before they hit MongoDB
                  scale when: hit rate drops, cache evictions increase
                  symptom when too small: low hit rate, MongoDB load rises again

MongoDB RAM     → data access speed
(WiredTiger     holds indexes + hot working set
cache)          scale when: dataset grows, cache hit rate drops
                symptom when too small: slow queries, disk reads, page faults

WiredTiger cache ≈ (total RAM - 1GB) × 0.5

All three work together:
  Redis          → reduces MongoDB query load by 80–90%
  MongoDB RAM    → eliminates disk reads for hot data
  App Server RAM → handles the concurrent users in flight

Ideal state:
  Redis hit rate > 80%      → most requests never reach MongoDB
  All indexes in cache      → every query uses RAM-based index lookup
  Working set fits in cache → no disk I/O on hot data reads

Warning state:
  Redis hit rate dropping   → cache TTLs too short or dataset too unique
  Cache used % > 90%        → WiredTiger evicting hot data → disk reads spike
  Page faults > 0 steadily  → working set exceeds WiredTiger cache size
```
