# 02 — Server Components: Disk, RAM & CPU Usage

## The Three Resources Every Server Has

```
┌─────────────────────────────────────────────────────────────────┐
│                         EC2 SERVER                              │
│                                                                 │
│   DISK                    RAM                    CPU            │
│   ──────────────          ──────────────          ───────────── │
│   Permanent storage       Active workspace        Computation   │
│   Survives restarts       Lost on restart         Does work     │
│   Cheap per GB            Expensive per GB        Measured in   │
│   Slow to read            Fast to read            cores/vCPUs   │
│   Where code lives        Where running           Where logic   │
│                           processes live          executes      │
└─────────────────────────────────────────────────────────────────┘
```

They are completely independent resources with different jobs, different limits,
and different things that exhaust them.

---

## Installing vs Running — The Most Important Distinction

```
Installing / downloading a program
→ writes files to DISK
→ zero RAM impact
→ zero CPU impact (after install completes)

Starting / running a program
→ OS loads it from disk into RAM
→ RAM is now consumed
→ CPU is used whenever it does work
```

**A program sitting on disk costs nothing until you run it.**
The moment you `systemctl start redis` or `pm2 start app.js`, the OS allocates RAM
for that process and it begins competing for CPU time.

---

## Base Overhead Per Service (No Traffic)

This is the RAM cost of simply having each service running — before any users,
requests, or cached data exist.

```
OS itself                      →  200–500MB RAM
Node.js process (empty app)    →   30– 50MB RAM
Node.js (your real app loaded) →   80–150MB RAM   (code, modules, mongoose, etc.)
Redis  (nothing cached)        →    3–  5MB RAM
MongoDB (idle)                 →  100–200MB RAM   (WiredTiger cache initializes) // if used locally
Nginx  (reverse proxy)         →    5– 20MB RAM
```

These numbers are the floor — the minimum RAM cost just to keep the lights on.
Everything above is driven by traffic, data, and load.

---

## DISK — Permanent Storage

### What Uses Disk

```
OS files and system libraries          →   2–5GB
Node.js runtime                        →   ~50MB
npm packages (node_modules)            →   50–500MB (depends on dependencies)
Your app source code                   →   1–50MB
MongoDB data files                     →   grows with your dataset
MongoDB journal and oplog              →   grows over time
Redis AOF / RDB persistence files      →   grows with cached dataset (if enabled)
Nginx config + logs                    →   small, but logs grow over time
PM2 logs                               →   grows over time
System logs (/var/log)                 →   grows over time
```

### What Increases Disk Usage Over Time

```
1. MongoDB data growth
   → every document inserted → stored on disk permanently
   → indexes also stored on disk
   → formula: disk needed ≈ raw data size × 1.5–2× (for indexes + overhead)

2. Log files (biggest silent killer)
   → Nginx access logs: 1 line per request → 200 bytes per line
   → 100 req/sec × 86,400 sec/day = 8.6 million lines/day ≈ 1.7GB/day
   → MongoDB logs, PM2 logs, system logs all accumulate
   → without log rotation, logs will fill the disk in days/weeks

3. MongoDB oplog (replication log)
   → if running a replica set, oplog is a capped collection
   → default size: 5% of disk or 50GB, whichever is smaller
   → on a 20GB disk: oplog can consume up to 1GB

4. Redis persistence files (only if enabled)
   → RDB snapshot: full in-memory dump to disk periodically
   → AOF: append-only log of every write command
   → both grow proportionally with cached data size
```

### What Does NOT Increase Disk

```
Traffic / concurrent users     → no disk impact (data served from RAM)
CPU load                       → no disk impact
Number of connections          → no disk impact
RAM pressure                   → no disk impact (unless swap is enabled)
```

### Disk Warning Signs

```
df -h          ← check disk space (run this regularly in production)
du -sh /var/log/*   ← find which logs are consuming space
```

```
df -h output:
Filesystem   Size  Used Avail Use%
/dev/xvda1   20G   18G  2G    90%   ← ⚠️  getting full
```

### Keeping Disk Under Control

```bash
# Set up log rotation (prevents logs from filling disk)
sudo nano /etc/logrotate.d/nginx
# rotate daily, keep 7 days, compress old logs

# MongoDB: use Atlas → no disk management needed
# Self-hosted MongoDB: monitor with mongostat

# Clear PM2 logs
pm2 flush

# Check what's eating disk
du -sh /* 2>/dev/null | sort -rh | head -20
```

---

## RAM — Active Workspace

### What Uses RAM

RAM is consumed by every **running process**. Each service claims its base overhead
the moment it starts, then grows based on activity.

```
Total RAM = OS + each running process's current usage
```

### How RAM Grows Per Service

#### OS (~200–500MB, relatively stable)
```
OS base:           200–300MB  ← kernel, drivers, system services
File system cache: 0–500MB    ← OS aggressively caches recently read files
                               OS will release this cache if a process needs RAM
```

#### Node.js (starts ~80MB, grows with traffic)
```
Base (runtime + your app code loaded):   80–150MB
+ each in-flight HTTP request:           + 1–5MB each
+ connection pool (mongoose):            + ~5–20MB
+ in-process cache (if any):            + grows indefinitely without TTL

What increases it:
→ more concurrent users → more simultaneous requests in memory
→ loading large files or datasets without streaming
→ memory leaks (objects referenced but never freed → heap grows forever)
→ more PM2 processes → multiplies the base (4 processes × 150MB = 600MB)

What decreases it:
→ requests completing → memory freed
→ Node.js garbage collector runs periodically
→ PM2 restart on memory threshold (--max-memory-restart 500M)
```

#### Redis (starts ~5MB, grows with cached data)
```
Base (process with nothing stored):   3–5MB
+ each cached key:                    + key size + 50–70 bytes overhead
+ session objects:                    + ~400 bytes each
+ rate limit counters:                + ~100 bytes each

What increases it:
→ storing more cache entries
→ caching large JSON responses
→ sessions accumulating without expiry
→ keys set without TTL (never evicted, grow forever)

What keeps it controlled:
→ TTL on every key (self-cleaning)
→ maxmemory limit + allkeys-lru eviction policy
→ short TTLs on large entries

What decreases it:
→ keys expiring (TTL reached)
→ manual DEL / FLUSHALL
→ eviction policy kicking in at maxmemory limit
```

#### MongoDB (starts ~100–200MB, grows with dataset and queries)
```
Base (WiredTiger cache initialized):   100–200MB
+ indexes loaded into cache:           + 20MB–several GB (depends on indexes)
+ hot documents in cache:              + grows with working set size
+ active query memory:                 + ~1–5MB per concurrent query
+ connection memory:                   + ~1MB per open connection

What increases it:
→ more data → larger indexes → more cache needed
→ more complex queries → more memory per query execution
→ more concurrent connections → linear memory growth
→ working set growing beyond WiredTiger cache → thrashing (bad)

WiredTiger cache formula:
  cache = max( (total RAM - 1GB) × 0.5,  256MB )
  → M10 (2GB): ~0.5GB cache
  → M20 (4GB): ~1.5GB cache
  → M30 (8GB): ~3.5GB cache

What keeps it controlled:
→ Archiving cold data (removes it from working set)
→ Proper indexes (smaller indexes = less cache needed)
→ Atlas tier upgrade when working set outgrows cache
```

### The Full RAM Budget

```
Example: t3.medium (4GB RAM), 3 Node processes, Redis, MongoDB on same server

OS overhead:              ~400MB
Node process × 3:         ~450MB  (150MB each, base)
Node in-flight requests:  ~100MB  (50 concurrent × 2MB, at peak)
Redis base:               ~  5MB
Redis cached data:        ~200MB  (app cache + sessions)
MongoDB base:             ~200MB  (running locally — Atlas runs on its own server)
                          ──────
Total at moderate load:   ~1,355MB  ← well within 4GB
Peak headroom:            ~2.6GB remaining for spikes

If MongoDB runs on Atlas (separate server), remove its 200MB from this budget.
Most production setups: Node.js + Redis on EC2, MongoDB on Atlas.
```

### RAM Warning Signs

```bash
free -h        ← check available RAM
top            ← see per-process RAM usage live
```

```
free -h output:
              total   used   free   available
Mem:           3.8G   3.5G   100M   300M     ← ⚠️ only 300MB left
```

```
What to do:
→ used > 80% consistently: upgrade instance or reduce maxPoolSize / maxmemory
→ used > 90%: imminent OOM kill risk — act now
→ one process growing indefinitely: memory leak — profile the heap
```

```bash
# Check Node.js heap usage from inside the app
console.log(process.memoryUsage())
// { heapUsed: 45MB, heapTotal: 67MB, rss: 120MB, external: 5MB }

# rss (Resident Set Size) = total RAM the process is using right now
# heapUsed = JS objects currently alive
# heapTotal = total heap allocated (some may be free but reserved)
```

---

## CPU — Computation

### What Uses CPU

CPU is consumed whenever a process is **actively doing work** — not while it waits.
Node.js is async: it waits for DB responses without burning CPU.
CPU burns when it is actively processing.

```
What burns CPU:
→ parsing incoming JSON request bodies
→ running your route handler logic (JS execution)
→ serializing response to JSON
→ bcrypt password hashing (extremely CPU-intensive)
→ JWT signing/verification
→ image/file processing
→ MongoDB query execution (on the MongoDB server's CPU, not yours)
→ Redis command execution (minimal — Redis is single-threaded but very fast)
→ TLS/HTTPS encryption/decryption
→ garbage collection runs (Node.js GC pauses the event loop briefly)
```

### How CPU Usage Scales

```
Low traffic:
→ CPU mostly idle between requests
→ spikes briefly when a request arrives, drops back to near 0

Medium traffic:
→ CPU has a baseline utilization
→ spikes during bursts
→ if 1 core is handling everything (no PM2), one core saturates first

High traffic:
→ without PM2: 1 core at 100%, rest idle — throughput capped
→ with PM2:    all cores share load — throughput ≈ N× single core

CPU-bound operations under load:
→ bcrypt with cost factor 12 on a single core ≈ 300ms/hash
→ 10 concurrent logins = 3 seconds of blocked event loop on 1 core
→ solution: use worker threads for CPU-bound tasks, or lower bcrypt cost in dev
```

### What Increases CPU Usage

```
1. More concurrent requests         → more JS to execute simultaneously
2. Complex business logic           → more CPU per request
3. Expensive operations per request:
   → bcrypt hashing           (very high — 100–400ms per hash)
   → image processing         (very high)
   → large JSON serialization  (moderate — large arrays/objects)
   → regex on large strings    (moderate to high)
   → JWT signing (RS256)       (moderate — asymmetric crypto)
   → JWT signing (HS256)       (low — symmetric crypto)
4. Memory pressure → more GC runs  → GC uses CPU
5. No PM2 clustering               → single core handles everything
```

### What Does NOT Burn CPU While Waiting

```
Waiting for MongoDB response       → zero CPU (async I/O)
Waiting for Redis response         → zero CPU (async I/O)
Waiting for external API call      → zero CPU (async I/O)
Open but idle TCP connections      → zero CPU
```

This is the whole point of Node.js's event loop — it handles thousands of
concurrent I/O operations without burning CPU while waiting.

### CPU Warning Signs

```bash
top              ← live CPU per process
htop             ← better visual (install with: sudo yum install htop)
```

```
top output:
%CPU
 98.0  node (pid 1234)   ← ⚠️ one Node process at 100%
  0.1  redis-server
  1.2  mongod

Means: single-threaded Node.js is saturated
Fix:   enable PM2 clustering to spread across cores
```

```bash
# Check how many cores are available
nproc                    # e.g. "4"

# Check if PM2 is using all cores
pm2 list                 # see how many processes are running
```

### CPU vs RAM Bottleneck — How to Tell

| Symptom | Cause | Fix |
|---------|-------|-----|
| Latency rising, CPU pegged at 100% | CPU bottleneck | PM2 clustering, scale up/out |
| Latency rising, CPU low, RAM high | RAM bottleneck or memory leak | Add RAM, fix leak |
| Latency rising, CPU low, RAM fine | External bottleneck (slow DB, slow Redis) | Optimize queries, add caching |
| OOM process kills | RAM exhausted | Reduce pool sizes, add RAM |
| Intermittent slow responses | GC pressure or cold cache | Profile heap, check WiredTiger cache hit rate |

---

## How All Three Grow Together Under Load

```
State 1 — Server just started, no traffic

  Disk:  full (OS + code installed)         → stable
  RAM:   base overhead only (~600MB used)   → stable
  CPU:   near 0%                            → stable

State 2 — Traffic begins (100 concurrent users)

  Disk:  unchanged                          → stable
  RAM:   + in-flight requests (~100MB)      → growing
         + Redis cache filling up
  CPU:   active per request                 → spikes on each request

State 3 — Traffic grows (1,000 concurrent users)

  Disk:  logs growing slowly                → slow growth
  RAM:   requests + Redis + pool overhead   → noticeably higher
  CPU:   sustained utilization              → if 1 core: may saturate

State 4 — Heavy load over weeks

  Disk:  logs accumulate                   → can fill disk without rotation
         MongoDB data grows
  RAM:   Redis growing (many cached keys)  → check maxmemory
         MongoDB working set growing       → check WiredTiger cache hit rate
  CPU:   sustained high — need more cores  → PM2 or scale up
```

---

## Summary: What Controls Each Resource

```
DISK
  Increases: MongoDB data inserts, log files, Redis persistence snapshots
  Decreases: Deleting data, log rotation, Redis FLUSHALL, archiving old data
  Risk:      Silent — fills up slowly until the server crashes
  Monitor:   df -h daily, set up disk alerts in CloudWatch

RAM
  Increases: More processes, more concurrent requests, more cached data,
             more connections, memory leaks, MongoDB working set growing
  Decreases: Requests completing, TTLs expiring, GC running, process restart
  Risk:      OOM killer terminates your processes without warning
  Monitor:   free -h, process.memoryUsage(), Redis INFO memory

CPU
  Increases: More concurrent requests, CPU-bound operations (bcrypt, images),
             memory pressure causing GC, no PM2 clustering (wastes cores)
  Decreases: Requests completing, I/O waiting (frees core), traffic dropping
  Risk:      Saturation causes latency to climb; no crashes, just slowness
  Monitor:   top / htop, PM2 metrics (pm2 monit)

The hierarchy of fixes:
  CPU saturated  → PM2 clustering first, then vertical/horizontal scale
  RAM exhausted  → reduce pool sizes + maxmemory, fix leaks, then add RAM
  Disk full      → log rotation + archive old data first, then add storage
```
