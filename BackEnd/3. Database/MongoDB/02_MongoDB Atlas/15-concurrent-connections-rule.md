# 15 — The Rule of Concurrent Connections

## The Three Things People Confuse

| Term | What it means |
|------|---------------|
| **Concurrent users** | People actively using the app at the same time — most are idle between clicks |
| **Concurrent requests** | HTTP requests hitting your app server at the same moment |
| **Concurrent DB connections** | Open TCP sockets to MongoDB being used right now |

These are **not the same number** and are not in a 1:1 ratio.
The chain is: `users → requests → DB operations → connections used`
Each step is a fraction of the previous one.

---

## How Connection Pooling Works

The MongoDB driver does **not** open a new connection per request.
It maintains a **connection pool** — a fixed set of reusable TCP sockets.

```
App Server Process
┌────────────────────────────────────┐
│  Incoming request                  │
│       │                            │
│       ▼                            │
│  Handler needs DB                  │
│       │                            │
│       ▼                            │
│  Borrow connection from pool ──────┼──► MongoDB Atlas
│  (takes ~0ms, pool is ready)       │
│       │                            │
│  Run query (takes 1–50ms)          │
│       │                            │
│  Return connection to pool         │
│  (available for the next request)  │
└────────────────────────────────────┘
```

- A connection is occupied **only while a query is running** (usually 1–50ms)
- After the query returns, the connection goes back to the pool immediately
- The same connection can serve hundreds of users per second

---

## The Formula That Actually Matters

```
Total connections Atlas sees = app_server_instances × maxPoolSize
```

This is what Atlas counts against your tier's connection limit — not your user count.

**Example:**
- 3 Node.js app servers
- maxPoolSize = 100 (the Mongoose/driver default)
- Total connections = 3 × 100 = **300 connections**

Atlas sees 300 open connections regardless of whether you have 10 or 10,000 active users.

---

## How Many Connections Are Actually *In Use* at Any Moment

Use **Little's Law** to estimate peak simultaneous connection usage:

```
Connections in use = DB queries per second × average query duration (in seconds)
```

**Example:**
- Your app receives 2,000 HTTP requests/second at peak
- 40% of requests hit MongoDB → 800 DB queries/second
- Average query takes 10ms (0.010s)

```
Connections in use = 800 × 0.010 = 8 connections in use simultaneously
```

**8 connections** handles **2,000 requests/second** with a **pool of 100**.
The pool has massive headroom. This is why 1 connection can serve many users.

---

## The Real Bottleneck: It Is Based on Requests, Not Users

The number of connections you need is driven by **concurrent DB operations**, which
comes from **requests**, not from **users sitting in the app**.

```
concurrent connections needed
    = (peak HTTP req/sec)
    × (fraction of requests that query DB)
    × (average query duration in seconds)
    × safety_factor (2×)
```

Users who are idle (reading a page, thinking, away from keyboard) consume zero connections.
A user generates a DB operation only at the exact moment they trigger a request that hits the DB.

---

## Practical Rules of Thumb

| Situation | Rule |
|-----------|------|
| Sizing your pool | Set maxPoolSize to: `(peak DB QPS × avg query ms / 1000) × 2` |
| Total Atlas connections | `app_instances × maxPoolSize` — keep well under tier limit |
| Headroom | Never let connections regularly exceed 70% of your tier's limit |
| Warning sign | `waitQueueSize > 0` means requests are waiting for a free connection — pool is too small or queries are too slow |

---

## Mapping Users to Connections (Rule of Thumb Ranges)

These are rough real-world ratios, not hard limits. Actual ratios depend heavily
on how DB-heavy your app is and how fast your queries run.

| Concurrent active users | Typical concurrent connections in use | Notes |
|-------------------------|---------------------------------------|-------|
| 100 | 1–5 | Simple CRUD app |
| 1,000 | 5–20 | Moderate query load |
| 10,000 | 20–100 | Heavy read app, good indexes |
| 50,000 | 100–500 | High-throughput, well-optimized |
| 200,000+ | 500–3,000 | Requires M40+, careful pool sizing |

**Key insight:** The ratio is so favorable because queries are fast.
If your queries are slow (100ms+), the ratio collapses — slow queries hold
connections longer, and you need far more of them.

---

## What Drives Connection Count Up (Red Flags)

1. **Slow queries** — a 500ms query holds a connection 50× longer than a 10ms query
2. **Missing indexes** — causes full collection scans, queries take much longer
3. **No connection pooling** — opening a new connection per request (never do this)
4. **Too many app instances** with a large maxPoolSize — Atlas sees `instances × pool` connections even when idle
5. **Long-running transactions** — hold connections for their entire duration

---

## Recommended maxPoolSize by Tier

| Atlas Tier | Max connections | Recommended maxPoolSize | Max app instances at that pool size |
|------------|-----------------|------------------------|-------------------------------------|
| M0 | 500 | 10 | ~50 instances |
| FLEX | ~500 | 10 | ~50 instances |
| M10 | 1,500 | 50 | ~30 instances |
| M20 | 3,000 | 100 | ~30 instances |
| M30 | 3,000 | 100 | ~30 instances |
| M40 | 6,000 | 100 | ~60 instances |
| M50+ | 16,000+ | 100 | ~160+ instances |

> Keep total connections at 70% of tier max to leave room for spikes and admin operations.
> Formula: `max instances = (tier_limit × 0.70) / maxPoolSize`

---

## Setting maxPoolSize in Mongoose / Node.js Driver

```js
// Mongoose
mongoose.connect(MONGO_URI, {
  maxPoolSize: 50,       // max open connections per app instance (default: 100)
  minPoolSize: 5,        // keep at least 5 connections warm
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

// Native MongoDB driver
const client = new MongoClient(MONGO_URI, {
  maxPoolSize: 50,
  minPoolSize: 5,
});
```

---

## How Little's Law and the Atlas Limit Work Hand in Hand

These two formulas are two sides of the same constraint:

```
Little's Law  →  connections needed  =  concurrent requests × queries/request × query duration (s)
Atlas limit   →  connections available  =  app servers × maxPoolSize  (must be < tier limit)
```

They must satisfy:

```
connections needed  ≤  pool size  ≤  Atlas tier limit
```

**Healthy example** — fast queries, small need:
```
500 concurrent requests × 2 queries × 0.02s = 20 connections needed
Pool of 100 on M0 (limit 500) — plenty of headroom ✅
```

**Stressed example** — slow queries, need exceeds limit:
```
500 concurrent requests × 3 queries × 0.5s = 750 connections needed
M0 limit is 500 — you are in trouble ❌
```

Fix options, in order of preference:
1. **Optimize queries** → 500ms → 50ms → need drops to 75 ✅
2. **Fix N+1 problems** → fewer queries per request → need drops ✅
3. **Add caching** → fewer requests reach MongoDB at all ✅
4. **Upgrade Atlas tier** → raise the limit ✅

### The Key Insight

**Query duration is the strongest lever** — it multiplies everything else.
Cutting average query time in half cuts connection needs in half, with zero infrastructure change.

```
Slow queries → connections held longer → pool fills → requests queue → users see slowness
Fast queries → connections freed instantly → pool always available → scales far
```

This is why indexes and query optimization are not just about speed — they directly determine
how many concurrent users your existing tier can handle before connections become the bottleneck.

---

## Summary

```
Users        → many are idle at any moment
  ↓ fraction
Requests     → only some hit the DB
  ↓ fraction
DB queries   → fast (1–50ms), release connection immediately
  ↓ Little's Law
Connections  = QPS × avg_duration_sec  (usually a small number)

Total connections Atlas sees = app_instances × maxPoolSize
(regardless of user count)
```

**Rule:** Size your pool based on your peak DB QPS and query speed, not your user count.
Watch `waitQueueSize` in Atlas monitoring — that is the signal that tells you the pool is too small.

---

## The Complete Picture — Two Ceilings, Not One

"How many concurrent users can my system handle?" splits into two independent questions:

```
[User] → [App Server] → [MongoDB]
              ↑               ↑
     Can it handle N      Can it handle N
     concurrent HTTP      concurrent DB
     requests?            connections?
```

Whichever ceiling is lower is your actual limit. You must solve both.

---

### Ceiling 1 — Server Side: Can it handle N concurrent HTTP requests?

Determined by RAM, CPU cores, and runtime:

```
max concurrent requests ≈ available RAM / memory per request
```

| Resource | What it controls |
|----------|-----------------|
| **RAM** | **Capacity** — how many requests can exist in memory simultaneously |
| **CPU cores** | **Throughput** — how many requests are actively processed at the same time |
| **Runtime** | Node.js/Go handle thousands async; sync Python/Ruby cap much lower (1 thread/request) |

**Kitchen analogy:**
```
RAM   = counter space  → how many orders can sit waiting
Cores = number of chefs → how many orders are being cooked simultaneously
```

High RAM, low CPU → requests pile up waiting to be processed → high latency
High CPU, low RAM → processes fast but can't hold many in flight → OOM errors
Balanced → queue never builds, latency stays low

**Node.js specifically:** single-threaded by default — 1 core used unless you cluster.
```
1 process per core (PM2 / cluster module)
4-core server → 4 Node processes → all cores utilized
```

---

### Ceiling 2 — DB Side: Can it handle the resulting connections?

```
connections needed = concurrent requests × queries per request × query duration (s)
                     must be ≤ pool size ≤ Atlas tier limit
```

Covered in full above with Little's Law.

---

### Full Scaling Decision Tree

```
Hitting a limit? Ask:

Is latency high but server CPU/RAM is fine?
  → DB is the bottleneck → optimize queries, add indexes, upgrade Atlas tier

Is server CPU pegged at 100%?
  → Add more cores or app server instances

Are you seeing out-of-memory errors?
  → Reduce memory per request or add RAM

Is waitQueueSize > 0 in Atlas?
  → Pool is exhausted → reduce query duration or increase maxPoolSize

Are all metrics fine but users still slow?
  → Network latency, DNS, or CDN — outside the DB/server layer
```

Every scaling decision maps back to the same question: **which ceiling are you hitting first — server or DB?** Find it, raise it, repeat.
