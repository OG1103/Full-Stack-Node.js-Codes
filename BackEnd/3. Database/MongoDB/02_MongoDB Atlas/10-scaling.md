# 10 — MongoDB Atlas: Scaling

## When to Scale — Watch the Metrics First

Never scale preemptively based on guesses. Scale when metrics tell you to.

| Signal | What's happening | First step | If still needed |
|--------|-----------------|-----------|----------------|
| CPU > 75% sustained | Queries overloading server | Add missing indexes | Upgrade tier |
| Memory > 80% | Working set doesn't fit in RAM | Optimize queries | Upgrade tier |
| Slow queries (>100ms) | Bad query patterns | Add indexes, optimize | Upgrade tier |
| Connection errors | Too many concurrent connections | Add connection pooling | Upgrade tier |
| Disk > 75% | Running out of storage | Archive old data | Upgrade storage |
| Replication lag > 60s | Writes faster than replicas | Reduce write volume | Upgrade tier |

**Always optimize first, scale second.** A missing index can make a query
1,000x slower regardless of how powerful the server is.

---

## Types of Scaling

### Vertical Scaling (Scale Up)
Upgrade to a more powerful tier — more CPU, RAM, storage.

```
M0 → FLEX → M10 → M20 → M30 → M40 → M50 → M60 → M80
```

**Pros:** Simple, one-click, zero downtime
**Cons:** Has a ceiling, costs grow linearly

**How to do it:**
1. Cluster → **…** → **Edit Configuration**
2. Select new tier
3. Click **Apply**
4. Atlas rolls the upgrade across replica nodes — no downtime

---

### Storage Scaling
Add more disk space without changing the compute tier.

1. Cluster → **…** → **Edit Configuration**
2. Scroll to **Storage** slider
3. Increase the storage amount
4. Click **Apply**

> ⚠️ Storage can only increase, not decrease. Once increased, you cannot shrink it.

---

### Horizontal Scaling — Read Replicas
Add additional nodes dedicated to handling read traffic.

**When to use:** Read-heavy workload where reads vastly outnumber writes.

**How:**
1. Cluster → **…** → **Edit Configuration**
2. Add **Analytics Nodes** or configure **Electable Nodes** in additional regions
3. In your app, set `readPreference: "secondaryPreferred"` for read-heavy queries

```javascript
// In Mongoose — read from secondary for analytics queries
const reports = await Order.find({ status: "completed" })
  .read('secondaryPreferred')
  .exec();
```

---

### Horizontal Scaling — Sharding
Split your data across multiple shards (clusters) to distribute both read and write
load. Each shard holds a subset of the data.

**When to use:**
- Single cluster is at M60+ and still not keeping up
- Dataset exceeds hundreds of GB
- Write throughput is the bottleneck (replicas only help reads)

**Available on:** M30 and above

**Shard key selection is critical:**
```javascript
// ❌ Bad shard key — monotonically increasing, all writes go to one shard
{ _id: 1 }
{ createdAt: 1 }

// ✅ Good shard key — high cardinality, evenly distributed writes
{ userId: "hashed" }
{ region: 1, userId: 1 }
```

**How to enable sharding:**
1. Cluster → **…** → **Shard Cluster**
2. Follow the wizard to choose shard key per collection
3. MongoDB redistributes data automatically (takes time on large datasets)

---

## Auto-Scaling

Atlas can automatically scale your cluster tier and storage up (and optionally down)
based on actual load.

### Enable Auto-Scaling
1. Cluster → **…** → **Edit Configuration**
2. Enable **Cluster Auto-Scaling**
3. Set bounds:
   ```
   Minimum tier: M10  (never scale below this)
   Maximum tier: M30  (never scale above this — cost control)
   ```
4. Enable **Storage Auto-Scaling** separately
5. Click **Apply**

### How auto-scaling decides
- **Scale up:** CPU > 75% or memory > 90% for 1 hour → scales up one tier
- **Scale down:** CPU < 50% for 24 hours → scales down one tier (if enabled)
- **Storage scale up:** Disk > 90% used → increases storage automatically

### Scale-down behavior
Scale-down is optional and disabled by default. Enable only if you have highly
variable workloads (e.g. batch jobs, end-of-month spikes).

---

## Connection Pooling (Scale Without Upgrading)

Connection pooling is not a scaling trick — it is a requirement. Without it,
your app creates a new database connection for every request, which exhausts
the server's connection limit quickly.

### Maximum connections per tier
| Tier | Max connections |
|------|----------------|
| M0 | 500 |
| FLEX | 500 |
| M10 | 1,500 |
| M20 | 3,000 |
| M30 | 6,000 |

### Implement connection pooling
```javascript
// Node.js — Mongoose (pooling is built in, configure pool size)
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,   // Max 10 connections per app instance
  minPoolSize: 2,    // Keep 2 connections open always
});

// Node.js — Native driver
const client = new MongoClient(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 2,
});
await client.connect(); // Connect once, reuse for all requests
```

### In serverless environments (AWS Lambda, Vercel)
Each Lambda invocation can create a new connection. Use this pattern to reuse
connections across warm invocations:

```javascript
let cachedDb = null;

async function connectDB() {
  if (cachedDb) return cachedDb;  // Reuse existing connection
  
  const client = new MongoClient(process.env.MONGODB_URI, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  });
  await client.connect();
  cachedDb = client.db();
  return cachedDb;
}
```

---

## Scaling Checklist — Before Upgrading

Before spending more money on a tier upgrade, verify:

- [ ] Performance Advisor reviewed — all suggested indexes created
- [ ] Slow queries identified and optimized
- [ ] Projection used in queries (only fetching needed fields)
- [ ] Pagination implemented (no unbounded queries)
- [ ] Connection pooling implemented correctly
- [ ] No N+1 query patterns in application code
- [ ] Caching layer considered (Redis) for frequently read, rarely changed data

If all of the above are done and the cluster is still struggling → upgrade.
