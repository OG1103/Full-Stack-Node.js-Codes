# 01 — S3 Costs & Pricing

> All prices are for **US East (N. Virginia)** — the cheapest and most common reference region.
> Other regions are 5–20% more expensive. Prices as of 2025.
> Always verify at: https://aws.amazon.com/s3/pricing/

---

## What S3 Charges You For

S3 has four separate cost dimensions. Each is billed independently.

```
1. Storage        → how much data you store (per GB/month)
2. Requests       → how many operations you perform (per 1,000 requests)
3. Data transfer  → how much data leaves S3 (outbound GB)
4. Management     → optional features like Intelligent-Tiering monitoring
```

There is **no charge** for:
- Creating a bucket
- Inbound data transfers (uploading to S3)
- Transfer between S3 and EC2/CloudFront **in the same region**
- Deleting objects (DELETE requests are free)

---

## Storage Classes & Costs

S3 has multiple storage tiers. You choose based on how often data is accessed.

| Storage Class | Cost per GB/month | Min storage duration | Retrieval fee | Use when |
|---------------|-------------------|----------------------|---------------|---------|
| **S3 Standard** | $0.023 | None | None | Frequently accessed — images, uploads, active files |
| **S3 Intelligent-Tiering** | $0.023 (frequent) / $0.0125 (infrequent) | None | None | Unknown or changing access patterns |
| **S3 Standard-IA** | $0.0125 | 30 days | $0.01/GB | Infrequent access — backups, older files |
| **S3 One Zone-IA** | $0.01 | 30 days | $0.01/GB | Infrequent, non-critical — can recreate if lost |
| **S3 Glacier Instant** | $0.004 | 90 days | $0.03/GB | Archives, retrieved occasionally (ms latency) |
| **S3 Glacier Flexible** | $0.0036 | 90 days | $0.01/GB | Archives, retrieval in minutes to hours |
| **S3 Glacier Deep Archive** | $0.00099 | 180 days | $0.02/GB | Long-term compliance, retrieved rarely (12hr) |

### The Most Important Tiers for a MERN App

**S3 Standard** — use this for everything actively served to users:
```
profile pictures, uploaded images, documents, app assets
→ $0.023/GB/month
→ 100GB of images = $2.30/month
→ 1TB of images   = $23/month
```

**S3 Standard-IA** — use this for backups and old data:
```
MongoDB Atlas backups exported, old user uploads, logs
→ $0.0125/GB/month  (45% cheaper than Standard)
→ BUT: minimum 30-day charge + retrieval fee
→ don't use for data accessed more than once a month
```

**S3 Glacier Deep Archive** — use this for compliance/legal retention:
```
$0.00099/GB/month — nearly free
1TB archived = $1.04/month
retrieval takes up to 12 hours and costs extra
```

---

## Request Costs

Every operation against S3 is a request and has a small per-request cost.

| Request type | Cost per 1,000 requests | Examples |
|-------------|------------------------|---------|
| **PUT, COPY, POST, LIST** | $0.005 | Uploading a file, listing bucket contents |
| **GET, SELECT** | $0.0004 | Downloading a file, reading an object |
| **DELETE** | Free | Deleting objects |
| **Lifecycle transitions** | $0.01 per 1,000 | Moving objects between storage classes |

### What This Means in Practice

```
Uploading 10,000 images (10,000 PUT requests):
  10,000 ÷ 1,000 × $0.005 = $0.05    ← basically free

Serving those 10,000 images to users (10,000 GET requests):
  10,000 ÷ 1,000 × $0.0004 = $0.004  ← essentially free

1,000,000 image views/month (1M GET requests):
  1,000,000 ÷ 1,000 × $0.0004 = $0.40/month  ← still cheap
```

**Request costs are almost never the significant part of your S3 bill.**
Storage and outbound transfer dominate.

---

## Data Transfer Costs

This is where S3 bills can surprise people — same as EC2.

| Transfer direction | Cost |
|-------------------|------|
| **Inbound (upload to S3)** | **Free** — no limit |
| **S3 → same-region EC2** | **Free** |
| **S3 → CloudFront** | **Free** |
| **S3 → internet (outbound)** | **$0.09/GB** after 100GB/month free |
| **S3 → different AWS region** | $0.02/GB |

### The Critical Rule

```
Never serve files directly from S3 to users' browsers in production.
S3 outbound → internet = $0.09/GB → same expensive rate as EC2

Instead:
S3 → CloudFront → users' browsers
S3 → CloudFront transfer = FREE
CloudFront → users = $0.0085/GB (10× cheaper than S3 direct)
```

---

## CloudFront — The Right Way to Serve S3 Files

CloudFront is AWS's CDN. It caches your S3 files at edge locations worldwide
and serves them to users from the nearest location.

### CloudFront Pricing (US region)

| Volume per month | Price per GB |
|-----------------|-------------|
| First 10TB | $0.0085/GB |
| Next 40TB | $0.0080/GB |
| Next 100TB | $0.0060/GB |

### CloudFront Request Costs

| Request type | Cost |
|-------------|------|
| HTTP requests | $0.0075 per 10,000 |
| HTTPS requests | $0.0100 per 10,000 |

### CloudFront Free Tier (12 months)

```
1TB outbound transfer/month
10,000,000 HTTP/HTTPS requests/month
```

### S3 Direct vs CloudFront — Side by Side

```
Serving 1TB/month of images to users:

S3 direct → internet:
  Storage:   1TB × $0.023 = $23
  Transfer:  1TB × $0.09  = $92   ← expensive
  Total:     ~$115/month

S3 → CloudFront → internet:
  Storage:   1TB × $0.023      = $23
  S3→CF:     free
  CF→users:  1TB × $0.0085     = $8.70
  Total:     ~$32/month

Saving: $83/month — 72% cheaper
```

CloudFront also adds:
- Global edge caching (lower latency for users worldwide)
- DDoS protection (AWS Shield Standard — free)
- HTTPS with custom domain (free SSL cert via ACM)
- Cache control (serve stale content while S3 updates)

---

## Free Tier

AWS gives you this every month for the first 12 months (new accounts):

```
5GB S3 Standard storage
20,000 GET requests
2,000 PUT requests
100GB data transfer out
```

After 12 months, the free tier expires — you pay standard rates.
The 100GB outbound transfer is a one-time 12-month benefit, not recurring.

---

## Realistic Cost Examples

### Small App — Profile pictures, document uploads

```
Storage:    50GB  × $0.023     = $1.15/month
Uploads:    5,000 PUTs/month   = $0.025
Downloads:  50,000 GETs/month  = $0.02
Transfer:   via CloudFront 100GB = $0.85
──────────────────────────────────────────
Total:      ~$2/month
```

### Medium App — Image-heavy platform (Instagram-style)

```
Storage:    500GB × $0.023     = $11.50/month
Uploads:    100,000 PUTs/month = $0.50
Downloads:  1M GETs/month      = $0.40
Transfer:   via CloudFront 2TB = $17/month
──────────────────────────────────────────
Total:      ~$29/month
```

### Large App — Video/file platform

```
Storage:    10TB  × $0.023     = $230/month
  (move older files to Standard-IA: 7TB × $0.0125 = $87.50 → saves $75)
Uploads:    500,000 PUTs/month = $2.50
Downloads:  5M GETs/month      = $2
Transfer:   via CloudFront 20TB = $170/month
──────────────────────────────────────────
Total:      ~$405/month (or ~$330 with IA for cold files)
```

---

## Bucket Basics & Costs

### What a Bucket Is

A bucket is a container for objects (files). Think of it as a top-level folder
with a globally unique name.

```
Bucket: my-app-uploads
  └── users/
        ├── avatar-123.jpg
        ├── avatar-456.jpg
  └── documents/
        ├── invoice-001.pdf
```

### Bucket Costs

```
Creating a bucket:    FREE
Having a bucket:      FREE (no per-bucket charge)
Number of buckets:    100 per account by default (can request increase)
Objects per bucket:   Unlimited
```

**You are only charged for what is inside the bucket** — storage, requests,
and transfer. The bucket itself costs nothing.

### Bucket Naming Rules

```
✅ 3–63 characters
✅ Lowercase letters, numbers, hyphens only
✅ Must start and end with a letter or number
✅ Must be globally unique across all AWS accounts

Good names:
  my-app-uploads
  myapp-user-avatars-prod
  myapp-backups-2025

Bad names:
  MyApp_Uploads    ← uppercase and underscore not allowed
  my app           ← spaces not allowed
```

### How Many Buckets to Create

```
Recommended structure for a MERN app:

my-app-uploads-prod      → user-uploaded files (prod)
my-app-uploads-dev       → user-uploaded files (dev/staging)
my-app-backups           → MongoDB exports, server backups
my-app-static            → frontend build files (if hosting on S3)
```

Separate prod and dev so you never accidentally mix environments.
Separate uploads and backups for different access policies and lifecycle rules.

---

## Lifecycle Rules — Automatic Cost Optimization

You can tell S3 to automatically move or delete objects after a set time.
This runs automatically — no code needed.

```
Example lifecycle rule for user uploads:

Day 0:    object uploaded → S3 Standard ($0.023/GB)
Day 90:   auto-transition → S3 Standard-IA ($0.0125/GB)  ← 45% cheaper
Day 365:  auto-transition → S3 Glacier Instant ($0.004/GB) ← 83% cheaper
Day 730:  auto-delete     → object deleted, no more storage cost
```

Set up via AWS console: S3 → Bucket → Management → Lifecycle rules

**Cost impact example:**
```
Without lifecycle rules:
  1TB old files × $0.023 = $23/month forever

With lifecycle rules (after 90 days → IA, after 1 year → Glacier):
  Active (< 90 days):   100GB × $0.023         = $2.30
  IA (90d–1yr):         300GB × $0.0125        = $3.75
  Glacier (> 1yr):      600GB × $0.004         = $2.40
  Total:                                        = $8.45/month
  Saving: $14.55/month — 63% cheaper
```

---

## Versioning — What It Costs

S3 versioning keeps every version of every object when overwritten or deleted.
Useful for accidental delete recovery.

```
Without versioning:
  overwrite file.jpg → old version gone, only new version stored
  storage: 1 copy

With versioning enabled:
  overwrite file.jpg → both versions kept
  storage: 2 copies → you pay for both
```

**Versioning can silently double or triple your storage costs** if objects
are updated frequently. Use it on backup buckets, not high-churn upload buckets.

---

## Summary

```
What drives your S3 bill:

1. Storage (usually the biggest)
   Standard: $0.023/GB/month
   Use lifecycle rules to move cold data to cheaper tiers

2. Data transfer (second biggest if not using CloudFront)
   ALWAYS route through CloudFront → 10× cheaper than direct S3 outbound
   S3 → same-region EC2 = free
   S3 → CloudFront = free

3. Requests (almost always negligible)
   PUT: $0.005 per 1,000
   GET: $0.0004 per 1,000

Cost rules of thumb:
  ✅ Always use CloudFront in front of S3 — never serve S3 direct to browsers
  ✅ Set lifecycle rules on any bucket that accumulates data over time
  ✅ Use Standard-IA for backups (accessed < once/month)
  ✅ Separate prod and dev buckets — accidental dev traffic can cost real money
  ✅ Enable versioning only on buckets where recovery matters (not high-churn)

Realistic monthly costs:
  Small app (50GB, light traffic):   ~$2/month
  Medium app (500GB, moderate):      ~$29/month
  Large app (10TB, heavy):           ~$300–400/month
```
