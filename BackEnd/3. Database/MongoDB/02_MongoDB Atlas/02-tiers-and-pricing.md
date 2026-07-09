# 02 — MongoDB Atlas: Tiers & Pricing

## Available Tiers

### M0 — Free Forever

- **Storage:** 512MB
- **RAM/CPU:** Shared
- **Backups:** None
- **Max collections:** 500
- **Max databases:** 100
- **Max concurrent connections:** 500
- **Approximate concurrent users:** up to ~50–100 (shared infrastructure, not suitable for real load)
- **Pauses after:** 60 days of inactivity (auto-pauses, resumes on connect)
- **Cost:** $0/month forever
- **Best for:** Development, testing, learning, hobby projects
- **Best suitable when:**
  - You are learning MongoDB or building a proof of concept
  - You have zero real users or traffic
  - You need a free dev/staging cluster alongside a paid production cluster
  - Your data fits in 512 MB and you can tolerate shared, unpredictable performance

---

### FLEX — Pay As You Go

- **Storage:** Up to 5GB
- **RAM/CPU:** Shared, auto-scales
- **Backups:** Basic backups included
- **Pauses:** Never
- **Max concurrent connections:** ~500 (shared, scales with demand but not guaranteed)
- **Approximate concurrent users:** ~100–500 active users (light to moderate read/write workloads)
- **Cost:** ~$0–$30/month depending on usage (billed per operation)
- **Best for:** Early-stage startups, low/unpredictable traffic, pre-product-market-fit
- **Best suitable when:**
  - Traffic is sporadic and you don't want to pay for idle capacity
  - You have a small, growing user base (under ~500 active users at a time)
  - You are pre-product-market-fit and cost predictability matters less than low upfront spend
  - Your workload is read-light with occasional writes (RPU/WPU billing stays cheap)
  - You want to avoid the jump to a $57/month dedicated cluster until traffic justifies it

> FLEX replaced the old Serverless tier. You pay for reads, writes, and storage consumed
> rather than a fixed hourly rate.

---

### M10 — Dedicated Entry Level

- **Storage:** 10GB (expandable)
- **RAM:** 2GB dedicated
- **vCPUs:** 2 dedicated
- **Backups:** Cloud backup (daily snapshots, 2-day retention) included; continuous backup available as add-on
- **Max concurrent connections:** 1,500
- **Approximate concurrent users:** ~500–2,000 active users
- **Cost:** ~$57/month
- **Best for:** Production apps with consistent traffic, post-PMF startups
- **Key advantages:**
  - First tier with fully **dedicated** RAM and CPU — no noisy-neighbor issues
  - Guaranteed SLA of 99.995% uptime
  - VPC peering and private endpoints available (needed for secure production deployments)
  - Predictable flat monthly cost vs. FLEX per-operation billing
- **Best suitable when:**
  - You have consistent daily traffic and FLEX billing would exceed ~$57/month
  - You are launching a real production app and need a guaranteed SLA
  - Your team requires private networking (VPC peering / private endpoints)
  - You have up to ~2,000 concurrent active users and moderate query load

---

### M20

- **Storage:** 20GB
- **RAM:** 4GB dedicated
- **vCPUs:** 2 dedicated
- **Backups:** Cloud backup (daily snapshots, 2-day retention) included; continuous backup available as add-on
- **Max concurrent connections:** 3,000
- **Approximate concurrent users:** ~2,000–10,000 active users
- **Cost:** ~$114/month
- **Best for:** Growing production with moderate load
- **Key advantages:**
  - Double the RAM of M10 — handles larger working sets and more complex aggregations without spilling to disk
  - 3,000 connections supports multiple app server instances with connection pooling
  - Good headroom for traffic growth before needing M30
- **Best suitable when:**
  - Your app is scaling past M10 capacity (RAM pressure, slow queries, connection saturation)
  - You have a growing user base in the low-to-mid thousands of concurrent users
  - You run background jobs or analytics alongside your main app (needs spare RAM)
  - You have moderate read/write throughput with some complex queries

---

### M30

- **Storage:** 40GB
- **RAM:** 8GB dedicated
- **vCPUs:** 2 dedicated
- **Backups:** Cloud backup included; continuous backup available as add-on; point-in-time restore available
- **Max concurrent connections:** 3,000
- **Approximate concurrent users:** ~10,000–50,000 active users
- **Cost:** ~$200/month
- **Best for:** High-traffic production apps
- **Key advantages:**
  - 8GB RAM means your most-used collections likely fit entirely in the working set (very fast reads)
  - Point-in-time restore (PITR) available — you can recover to any second within the backup window
  - Scales well horizontally when paired with Atlas auto-scaling
  - Handles high-read throughput workloads with heavy indexing
- **Best suitable when:**
  - You have tens of thousands of concurrent users with frequent reads and writes
  - You need PITR for compliance, auditing, or sensitive data recovery
  - Your working set (hot data) is between 4–8GB and needs to stay fully in RAM
  - M20 is showing RAM pressure or query slowdowns under load

---

### M40

- **Storage:** 80GB
- **RAM:** 16GB dedicated
- **vCPUs:** 4 dedicated
- **Backups:** Full cloud backup + continuous backup + PITR included
- **Max concurrent connections:** 6,000
- **Approximate concurrent users:** ~50,000–200,000 active users
- **Cost:** ~$400/month
- **Best for:** High-scale production, data-heavy applications
- **Key advantages:**
  - 4 vCPUs allow true parallel query execution — ideal for write-heavy or mixed workloads
  - 6,000 connections supports large clusters of app servers
  - Full backup suite included at this tier
- **Best suitable when:**
  - You are scaling past M30 (CPU saturation, RAM pressure, or >3,000 connections)
  - Your app handles hundreds of thousands of users with heavy concurrent reads/writes
  - You need high write throughput with complex indexes

---

### M50 and above

- **Storage:** 160GB+ (fully configurable)
- **RAM:** 32GB+ dedicated
- **vCPUs:** 8+ dedicated
- **Backups:** Full cloud backup + continuous backup + PITR
- **Max concurrent connections:** 16,000+ (M50), 32,000+ (M60)
- **Approximate concurrent users:** 200,000–1,000,000+ active users
- **Cost:** ~$820/month (M50), ~$1,600/month (M60), higher for M80+
- **Auto-scaling:** Available
- **Best for:** Scale-ups, enterprise workloads, global applications
- **Key advantages:**
  - Sharding available at this level for horizontal scaling beyond a single node's limits
  - Massive RAM means entire working set fits in memory for microsecond-level reads
  - Can be combined with Atlas Global Clusters for multi-region, geo-distributed data
- **Best suitable when:**
  - You have millions of registered users and hundreds of thousands of concurrent active users
  - Single-node vertical scaling is no longer sufficient and sharding is required
  - You need enterprise SLAs, dedicated support, and global distribution
  - Regulatory requirements demand data residency in specific regions

---

## Tier Comparison Table

| Feature                   | M0      | FLEX      | M10     | M20     | M30      | M40       | M50+    |
| ------------------------- | ------- | --------- | ------- | ------- | -------- | --------- | ------- |
| Monthly cost              | Free    | $0–$30    | ~$57    | ~$114   | ~$200    | ~$400     | $820+   |
| Storage                   | 512MB   | Up to 5GB | 10GB    | 20GB    | 40GB     | 80GB      | 160GB+  |
| RAM                       | Shared  | Shared    | 2GB     | 4GB     | 8GB      | 16GB      | 32GB+   |
| vCPUs                     | Shared  | Shared    | 2       | 2       | 2        | 4         | 8+      |
| Max connections           | 500     | ~500      | 1,500   | 3,000   | 3,000    | 6,000     | 16,000+ |
| Concurrent users (approx) | ~50–100 | ~100–500  | ~500–2K | ~2K–10K | ~10K–50K | ~50K–200K | 200K+   |
| Dedicated resources       | ❌      | ❌        | ✅      | ✅      | ✅       | ✅        | ✅      |
| Daily snapshot backup     | ❌      | Basic     | ✅      | ✅      | ✅       | ✅        | ✅      |
| Continuous backup         | ❌      | ❌        | Add-on  | Add-on  | Add-on   | ✅        | ✅      |
| Point-in-time restore     | ❌      | ❌        | ❌      | ❌      | ✅       | ✅        | ✅      |
| Auto-scaling              | ❌      | ✅        | ✅      | ✅      | ✅       | ✅        | ✅      |
| VPC Peering               | ❌      | ❌        | ✅      | ✅      | ✅       | ✅        | ✅      |
| Private Endpoints         | ❌      | ❌        | ✅      | ✅      | ✅       | ✅        | ✅      |
| Sharding                  | ❌      | ❌        | ❌      | ❌      | ❌       | ❌        | ✅      |
| SLA                       | None    | 99.9%     | 99.995% | 99.995% | 99.995%  | 99.995%   | 99.995% |

---

## Scaling Path by Stage

```
Stage 1 — Building (0 users)
├── Production: M0 or FLEX
├── Dev: M0 (free)
├── Concurrent connections needed: <100
└── Cost: $0

Stage 2 — Early Users (<500 concurrent)
├── Production: FLEX
├── Dev: M0 (free)
├── Concurrent connections needed: ~100–500
└── Cost: $0–$30/mo

Stage 3 — Growing (500–2,000 concurrent)
├── Production: M10
├── Staging: M0 or FLEX
├── Dev: M0 (free)
├── Concurrent connections needed: up to 1,500
└── Cost: ~$57/mo

Stage 4 — Scaling (2,000–10,000 concurrent)
├── Production: M20
├── Staging: M10
├── Dev: M0 (free)
├── Concurrent connections needed: up to 3,000
└── Cost: ~$114/mo

Stage 5 — High Traffic (10,000–50,000 concurrent)
├── Production: M30 with auto-scaling
├── Staging: M10
├── Dev: M0 (free)
├── Concurrent connections needed: up to 3,000
└── Cost: ~$200/mo

Stage 6 — High Scale (50,000–200,000 concurrent)
├── Production: M40
├── Staging: M20
├── Dev: M0 (free)
├── Concurrent connections needed: up to 6,000
└── Cost: ~$400/mo

Stage 7 — Enterprise (200,000+ concurrent)
├── Production: M50+ with sharding
├── Staging: M30
├── Dev: M0 (free)
├── Concurrent connections needed: 16,000+
└── Cost: $820+/mo
```

---

## How to Upgrade Tier (Zero Downtime)

Atlas upgrades clusters live — your app stays running the entire time.

1. Go to your cluster in Atlas
2. Click **…** (three dots) → **Edit Configuration**
3. Select new tier
4. Review the new monthly cost
5. Click **Apply**

Atlas rolls the change across each replica set node one at a time.
The whole process typically takes 5–15 minutes with no downtime.

---

## Cost Optimization Tips

- Use **M0** for every non-production cluster — it is free forever
- Use **FLEX** for production until traffic is consistent enough to justify M10
- Enable **auto-scaling** so Atlas scales up during spikes and back down after
- **Storage auto-scaling** is cheaper than upgrading the whole tier
- Archive cold data with **Atlas Online Archive** to cheaper object storage
- Set a **billing alert** (Organization → Billing → Alerts) so you are never surprised
- Data transfer (egress) has a cost — keep your Atlas cluster in the same region as your app servers to minimize it

---

## What Drives Your Bill on FLEX

FLEX billing is based on:

- **Read Processing Units (RPUs)** — charged per read operation
- **Write Processing Units (WPUs)** — charged per write operation
- **Storage** — charged per GB stored per month
- **Data transfer** — charged for data leaving Atlas

Optimize by:

- Projecting only the fields you need (`{ field: 1 }`)
- Using indexes so queries scan fewer documents
- Avoiding large unbounded queries
