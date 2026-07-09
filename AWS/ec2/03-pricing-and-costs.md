# 03 — EC2 Pricing & Costs

## The Core Rule

EC2 charges a **flat monthly rate** for the server being on. That's it.

```
Whether you get 100 requests or 1,000,000 requests that month → same EC2 bill.

AWS does not charge per:
  ✗ request
  ✗ concurrent user
  ✗ concurrent connection
  ✗ CPU usage (within the instance)
  ✗ RAM usage (within the instance)
```

---

## Instance Tiers

### t3.micro — ~$8/month
- **2 vCPU, 1GB RAM**
- OS alone takes 200–300MB. Node.js takes another 80–120MB. Add Redis and you're already at 600MB+ out of 1GB.
- Almost no headroom. Can run 1 Node process but it will be tight.
- **Not recommended for production.** Dev and testing only.

### t3.small — ~$17/month
- **2 vCPU, 2GB RAM**
- First tier actually usable for a small production app.
- Can run 1–2 Node processes + small Redis cache on the same server.
- Handles roughly **500–2,000 concurrent users** depending on query speed.
- Good for: side projects with real users, low-medium traffic APIs.

### t3.medium — ~$33/month
- **2 vCPU, 4GB RAM**
- The sweet spot for most apps.
- Comfortable room for OS + 2–3 Node processes + Redis + headroom to grow.
- Handles roughly **2,000–8,000 concurrent users**.
- Good for: most small to medium production apps — start here.

### t3.large — ~$67/month
- **2 vCPU, 8GB RAM**
- Note: still only 2 vCPUs — extra resource here is **RAM, not CPU parallelism**.
- Useful when you need a larger Redis cache or are running multiple services.
- If you need more CPU specifically, consider `c5.large` (compute-optimized) instead.
- Good for: high-traffic apps, large in-memory caches.

### t3.xlarge — ~$134/month
- **4 vCPU, 16GB RAM**
- First t3 tier with 4 cores. With PM2: run 3 processes (leave 1 core for OS).
- 16GB gives massive headroom for Redis or multiple services on one machine.
- Good for: very high traffic or running several services on one machine.

---

## What Actually Adds to Your Bill

### Fixed Costs (same every month regardless of traffic)

| Item | Cost | Notes |
|------|------|-------|
| EC2 instance | see tiers above | Flat rate — server being on |
| EBS storage (disk) | $0.08/GB/month | 20GB disk = $1.60/month — negligible |
| Load Balancer (ALB) | ~$16/month base | Only needed when running 2+ servers |
| Elastic IP | Free while running | $3.65/month if instance is stopped but IP reserved |
| ElastiCache Redis (AWS managed) | ~$12–25/month | Alternative: Upstash — pay-per-use, starts free |

### Variable Costs (grow with usage)

| Item | Cost | Free tier |
|------|------|-----------|
| **Outbound data transfer** | $0.09/GB | First 100GB/month free — resets monthly |
| Cross-region transfer | $0.02/GB | Keep all services in the same region to avoid this |
| ALB capacity units | $0.008/LCU | Negligible for small–medium apps |
| CloudWatch logs | $0.50/GB ingested | Use PM2 file-based logging to avoid this entirely |

### Completely Free

```
✅ All inbound data transfer       → every request coming IN is free, no limit, forever
✅ Traffic within same AZ          → EC2 ↔ Atlas, EC2 ↔ ElastiCache in same region = free
✅ CPU usage                       → no extra charge no matter how hard it works
✅ Number of requests              → AWS does not count or charge for requests
✅ Number of users / connections   → not measured
✅ RAM usage within the instance   → using 100MB or 3.9GB of 4GB = same price
```

---

## The Load Balancer Jump

Going from 1 to 2 servers adds a **flat ~$16/month** for the ALB on top of the second server cost.

```
1 server (t3.medium):              $33/month
2 servers (t3.medium × 2 + ALB):  $33 + $33 + $16 = $82/month
                                                      ↑
                                              +$49/month jump
```

This is why squeezing maximum performance out of 1 server with PM2 clustering
and Redis caching saves real money — it delays this jump.

---

## Outbound Data Transfer — The Sneaky Cost

Outbound = **the size of data your server sends back** to users. Not the number of requests — the data volume.

```
GET /products → server responds with 500KB JSON
→ that 500KB counts toward your outbound GB total
```

### How It Adds Up

```
1 request      × 500KB = 500KB outbound
1,000 requests × 500KB = 500MB outbound
100,000 req    × 500KB = 50GB outbound   ← approaching free tier
1,000,000 req  × 500KB = 500GB outbound  → 400GB over → $36 extra
```

### Small Responses Are Usually Fine

```
GET /user/profile   → 2KB     → negligible
GET /auth/login     → 0.5KB   → negligible
GET /orders/recent  → 10KB    → fine

1,000,000 requests × 2KB = 2GB outbound → well under 100GB → $0
```

### When It Becomes a Problem

```
Serving images directly from EC2   → 200KB–2MB each → adds up fast
Serving video from EC2             → massive
Returning huge unpaginated JSON    → depends on data size
File downloads directly from EC2   → directly proportional to file size
```

### The Fix

```
images, files, videos  →  store on S3, serve via CloudFront
                           S3 + CloudFront is cheaper and faster globally
                           outbound charges go to CloudFront, not EC2

API JSON responses     →  keep them lean — only return fields you need
                           paginate: return 20 items, not 1,000
```

### Outbound Free Tier Resets Monthly

```
January  → 0–100GB outbound → free. 100GB+ → $0.09/GB
February → resets to 0. Same rules apply.

Month 1: sent 80GB  → free
Month 2: sent 150GB → 100GB free, 50GB × $0.09 = $4.50 extra
Month 3: sent 95GB  → free again
```

Inbound has no limit, no cap, no reset needed — always free.

---

## Reducing Outbound GB

### 1. Compression (biggest single win)

```js
import compression from 'compression'
app.use(compression())
```

```
Without compression: GET /products → 500KB
With gzip:           GET /products → 150KB
→ 70% reduction in outbound data
→ same 100GB free tier now effectively covers 3× more traffic
```

### 2. Pagination

```js
// ❌ returns entire collection → huge response
db.orders.find({})

// ✅ returns 20 at a time → tiny response
db.orders.find({}).limit(20).skip(page * 20)
```

### 3. Field Projection

```js
// ❌ returns entire document including unused fields
User.findById(id)

// ✅ returns only what the client needs
User.findById(id).select('name email avatar')
```

### 4. Rate Limiting

Blocks abusive clients before a full response is sent:

```
without rate limiting:
→ bot hammers GET /products 10,000 times
→ each response is 50KB
→ 10,000 × 50KB = 500MB from one bad actor

with rate limiting:
→ bot hits limit after 100 requests
→ remaining 9,900 get a tiny 0.1KB error response
→ 100 × 50KB + 9,900 × 0.1KB ≈ 6MB total
→ 494MB saved from one bad actor alone
```

### 5. CDN (CloudFront)

Serves cached responses from AWS edge locations.
Outbound charges go to CloudFront pricing (cheaper) — not to your EC2 outbound.

---

## Rate Limiting — Full Picture

Rate limiting is essential in production — not primarily for outbound savings,
but because without it a single bot or bad actor can exhaust all your server
resources in minutes.

```
What rate limiting actually protects:

RAM          → minor (blocks requests before they consume memory)
CPU          → significant (rejected requests never run your JS)
MongoDB      → significant (rejected requests never hit the DB)
Outbound GB  → significant (error responses are tiny vs full responses)
Atlas cost   → indirect (fewer queries = less DB pressure = stays on cheaper tier)
```

### Implementation

```js
import rateLimit from 'express-rate-limit'

// Global limit — applies to all routes
const limiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute window
  max: 100,             // 100 requests per IP per minute
  message: { error: 'too many requests' },  // tiny response
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)
```

### Different Limits per Route

```js
// Strict on expensive routes
const heavyLimit = rateLimit({ windowMs: 60_000, max: 10 })

// Relaxed on light routes
const lightLimit = rateLimit({ windowMs: 60_000, max: 200 })

app.get('/products', heavyLimit, getProducts)   // large JSON response
app.get('/health',   lightLimit, healthCheck)   // tiny response
app.post('/auth/login', rateLimit({ windowMs: 60_000, max: 5 }), login)  // brute-force protection
```

---

## Reserved Instances — Saving 30–40%

On-demand pricing (what all numbers above reflect) is pay-month-to-month.
If you know a server will run for a year+, commit upfront:

| Instance | On-demand | 1-year reserved | 3-year reserved |
|----------|-----------|-----------------|-----------------|
| t3.small | ~$17/mo | ~$10/mo | ~$7/mo |
| t3.medium | ~$33/mo | ~$20/mo | ~$14/mo |
| t3.large | ~$67/mo | ~$40/mo | ~$28/mo |

Same server, same performance — just a commitment to keep it running.
For any server you know is permanent, reserved instances are worth it.

---

## Realistic Monthly Bills

### Small app — 1 server, just starting

```
t3.small                  $17
20GB EBS                  $1.60
Upstash Redis             $0–5
Atlas M0 (dev) / M10      $0 or $57
─────────────────────────────────
Total:                    ~$20–80/month
```

### Medium app — 1 server, production

```
t3.medium                 $33
20GB EBS                  $1.60
Upstash Redis             $5
Atlas M10                 $57
─────────────────────────────────
Total:                    ~$97/month
```

### Scaling app — 2 servers + load balancer

```
t3.medium × 2             $66
ALB                       $16
EBS × 2                   $3.20
Upstash Redis             $10
Atlas M10                 $57
─────────────────────────────────
Total:                    ~$152/month
```

The jump from 1 to 2 servers costs ~$55/month extra (second server + ALB).
This is exactly why optimizing the single server first with PM2, Redis caching,
and good indexes delays that jump and saves real money.

---

## The 100GB Outbound — Tier Independent

The 100GB free outbound is the same regardless of EC2 tier:

```
t3.micro  → 100GB free outbound
t3.xlarge → 100GB free outbound
```

Tier only affects CPU and RAM. Outbound pricing is flat across all tiers.

---

## Summary

```
EC2 bill drivers:
  Fixed:    instance type (flat rate), EBS storage, ALB (if 2+ servers)
  Variable: outbound data transfer after 100GB/month

Free forever:
  Inbound traffic, CPU usage, RAM usage, request count, same-AZ transfers

Outbound cost levers (in order of impact):
  1. Compression (gzip)       → 60–70% reduction on every response
  2. Pagination               → massive reduction on list endpoints
  3. Field projection         → return only needed fields
  4. Rate limiting            → blocks abusive traffic before response sent
  5. S3 + CloudFront          → offload files/images entirely off EC2

Scale cost efficiently:
  → Maximize 1 server with PM2 clustering + Redis before adding a 2nd
  → Adding a 2nd server costs: server price + $16 ALB
  → Reserved instances save 30–40% for committed infrastructure
```
