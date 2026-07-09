# 01 — Server Efficiency & Scaling

## What a Server Actually Is

A server is a computer — it has the same physical components as your laptop.
The difference is that it runs 24/7, has no screen, and is optimized for
handling many simultaneous tasks rather than interactive use.

Every server has two fundamental resources:

```
┌────────────────────────────────────────────────────────┐
│                       SERVER                           │
│                                                        │
│   RAM                          CPU                     │
│   ───────────────────          ──────────────────────  │
│   Temporary memory             The brain(s)            │
│   Holds data in-flight         Does actual computation │
│   Fast, volatile               Has 1 or more cores     │
│   Lost on restart              Each core = 1 worker    │
└────────────────────────────────────────────────────────┘
```

---

## RAM — The Workspace

RAM (Random Access Memory) is temporary, ultra-fast storage.
Everything the server is **currently working on** lives in RAM.

Think of RAM as a **physical desk**:

```
Small desk (low RAM)         Large desk (high RAM)
┌──────────┐                 ┌──────────────────────────┐
│ 1 file   │                 │ file  file  file  file   │
│ at a     │                 │ file  file  file  file   │
│ time     │                 │ file  file  file  file   │
└──────────┘                 └──────────────────────────┘

Can only work on 1 thing     Can have many things open
simultaneously               at the same time
```

**What RAM holds for a web server:**
- Every in-flight HTTP request and its data
- Session data, variables, objects being processed
- Database query results waiting to be sent back
- Node.js process heap — the JS runtime itself
- Cached data (if you cache in-process)

**The RAM rule:**
```
more RAM = more concurrent requests the server can hold in memory at once
```

If RAM fills up, the OS starts killing processes or throwing out-of-memory errors.
Requests don't get slow — they crash.

**Typical memory per Node.js request:** 1–10MB depending on payload size.

```
Example:
  4GB RAM available to Node
  ~2MB per request average
  → can hold ~2,000 requests in memory simultaneously
```

---

## CPU — The Worker

CPU (Central Processing Unit) is what actually **executes code**.
Every line of JavaScript, every calculation, every JSON parse runs on the CPU.

A modern CPU has multiple **cores**. Each core is an independent worker
that can execute instructions simultaneously and in parallel with other cores.

```
Single-core CPU:               4-core CPU:
┌──────┐                       ┌──────┬──────┬──────┬──────┐
│ Core │  → 1 task at a time   │  C1  │  C2  │  C3  │  C4  │
└──────┘                       └──────┴──────┴──────┴──────┘
                                → 4 tasks truly in parallel
```

**What the CPU does for a web server:**
- Parses incoming JSON bodies
- Runs your route handler logic
- Executes database query result processing
- Encrypts/decrypts (bcrypt, JWT, HTTPS)
- Serializes the response back to JSON

**The CPU rule:**
```
more cores = more requests being actively computed at the same time
```

If CPU maxes out, requests don't crash — they queue up and wait.
Everything gets slower. Latency climbs.

---

## RAM vs CPU — The Critical Distinction

| | RAM | CPU |
|---|---|---|
| **Role** | Holds things | Does things |
| **Controls** | Capacity — how many requests exist at once | Throughput — how fast requests are processed |
| **Bottleneck symptom** | Out-of-memory errors, process crashes | High latency, requests queue up |
| **Analogy** | Desk space | Number of hands doing work |
| **Fix** | Add more RAM | Add more cores or servers |

**The kitchen analogy (full version):**

```
RAM   = size of the kitchen counter
        → how many orders can sit waiting at once

CPU cores = number of chefs
        → how many orders are being cooked simultaneously

CPU speed = how fast each chef works
        → how quickly each order is finished and frees up a spot
```

```
Scenario A — Low RAM, fast CPU:
→ Only 5 orders can sit on the counter
→ The chefs are blazing fast
→ But at order #6, there is no counter space → orders are dropped

Scenario B — High RAM, slow/few CPUs:
→ 1,000 orders can sit on the counter
→ Only 1 chef, cooking slowly
→ Orders pile up, wait time grows, but nothing crashes

Scenario C — Balanced:
→ Counter holds enough for peak demand
→ Chefs process them fast enough that the counter never fills
→ System runs smoothly
```

---

## Node.js and the Single-Thread Problem

Node.js is **single-threaded** — its JavaScript execution runs on exactly **one core**.

```
4-core EC2 instance running 1 Node.js process:

Core 1  ████████████████  ← Node.js doing all the work
Core 2  ░░░░░░░░░░░░░░░░  ← idle, wasted
Core 3  ░░░░░░░░░░░░░░░░  ← idle, wasted
Core 4  ░░░░░░░░░░░░░░░░  ← idle, wasted

You are paying for 4 cores and using 1.
75% of your CPU budget is wasted.
```

Node handles concurrency through its **event loop** — async I/O means it doesn't
*block* a thread while waiting for a DB query or file read. It queues the callback
and moves on. This is why Node can handle thousands of concurrent connections on
one core — but all the JS execution itself is still serialized through that one core.

**CPU-bound work** (heavy computation, image processing, bcrypt hashing) blocks
the event loop and stalls every other request. That is when you actually need more cores.

---

## Thread Pooling — The Hidden Threads Inside Node.js

Node.js says it is single-threaded, and that is true **for your JavaScript code**.
But Node.js is built on **libuv**, a C library that runs a small internal thread pool
behind the scenes to handle operations the OS cannot do asynchronously.

```
Your Node.js process (1 JS thread)
┌──────────────────────────────────────────────────────┐
│                                                      │
│   Event Loop  (1 thread — runs your JS)              │
│       │                                              │
│       │  offloads certain operations to:             │
│       ▼                                              │
│   libuv Thread Pool  (4 threads by default)          │
│   ┌────────┬────────┬────────┬────────┐              │
│   │ Thread │ Thread │ Thread │ Thread │              │
│   │   1    │   2    │   3    │   4    │              │
│   └────────┴────────┴────────┴────────┘              │
│                                                      │
└──────────────────────────────────────────────────────┘
```

The event loop hands off expensive work to the thread pool, then continues
processing other requests. When the thread pool finishes, it hands the result
back to the event loop which runs your callback.

### What Uses the Thread Pool

```
✅ Uses libuv thread pool:
   fs.*             → file reads, writes, stat calls
   crypto.*         → bcrypt, pbkdf2, randomBytes, scrypt
   zlib.*           → gzip compression/decompression
   DNS lookups      → dns.lookup() (not dns.resolve())
   some C++ addons  → native modules that opt into the pool

❌ Does NOT use the thread pool (handled by OS kernel directly):
   TCP/HTTP         → network I/O (MongoDB, Redis, HTTP requests)
   UDP sockets      → event-driven at OS level
   Child processes  → separate process, not a thread
```

This is why network I/O (DB queries, Redis calls, HTTP to external APIs) is so
efficient in Node — the OS handles it natively without consuming thread pool slots.
Thousands of network operations can be in flight simultaneously on zero pool threads.

### The Default Pool Size Is 4

```
UV_THREADPOOL_SIZE = 4   ← default

4 bcrypt operations can run in parallel
5th bcrypt must wait for a thread to free up
```

This matters when you have CPU-heavy operations that hit the pool simultaneously.
A login endpoint that does bcrypt hashing is the most common example.

```
10 simultaneous login requests, bcrypt cost factor 12, pool size 4:

Threads 1–4: hashing requests 1–4  (~300ms each)
Requests 5–10: waiting in queue

→ requests 5–10 are blocked for 300ms before they even start hashing
→ event loop is free for other routes, but those login requests are stuck
```

### Increasing the Thread Pool Size

You can increase it — but only up to the number of physical cores, otherwise
threads compete and you gain nothing:

```bash
# In your start command or ecosystem.config.js
UV_THREADPOOL_SIZE=8 node app.js

# Or in PM2 ecosystem file
env: {
  UV_THREADPOOL_SIZE: 8
}
```

```
Rule: UV_THREADPOOL_SIZE should not exceed your core count
      More threads than cores → context switching overhead → no gain

4-core server:  UV_THREADPOOL_SIZE=4  (default, already optimal)
8-core server:  UV_THREADPOOL_SIZE=8  (doubles parallel crypto/fs capacity)
```

### Thread Pool vs PM2 Clustering — Different Levers

These solve different problems and work together:

```
Thread pool (libuv)          PM2 clustering
────────────────────         ──────────────────────────
Inside 1 Node process        Multiple separate processes
Parallelizes fs/crypto/zlib  Parallelizes JS execution
Default 4 threads            1 process per CPU core
Set via UV_THREADPOOL_SIZE   Set via pm2 start -i max
Helps: bcrypt, file I/O      Helps: request throughput
```

**Combined on a 4-core server:**
```
PM2: 4 Node processes (1 per core)
Each process: 4 libuv threads (default)

→ 4 × 4 = 16 total threads doing work simultaneously
→ but all 16 share the 4 physical cores
→ thread count > core count is fine because threads spend most time waiting
```

### Practical Impact

For a typical MERN API, the thread pool matters most at:

```
1. Auth routes (bcrypt)
   → 1 bcrypt hash ties up 1 thread for ~100–400ms
   → with pool of 4: only 4 simultaneous bcrypt operations
   → fix: lower bcrypt rounds in dev (10), keep 12 in prod
          or use argon2 which is more parallelizable

2. File operations (multer, disk writes)
   → reading/writing uploaded files goes through thread pool
   → with many simultaneous uploads: pool can saturate
   → fix: stream directly to S3 instead of disk (bypasses thread pool)

3. Compression (zlib / gzip)
   → if you compress responses manually in app code
   → note: the `compression` express middleware uses zlib → thread pool
   → at high traffic, many concurrent compressions compete for threads
   → fix: offload compression to Nginx (runs its own thread model)
```

### Summary

```
Node.js is single-threaded for JS execution — your code runs on 1 thread
libuv thread pool handles fs, crypto, zlib — default 4 threads
Network I/O (DB, Redis, HTTP) bypasses the pool entirely — OS handles it

Thread pool saturation symptoms:
→ bcrypt/file operations suddenly slow at high concurrency
→ event loop stays free (other routes respond fine)
→ only the pool-using operations are backed up

Fixes:
→ increase UV_THREADPOOL_SIZE up to core count
→ offload heavy crypto to a worker thread
→ stream files to S3 instead of disk
→ let Nginx handle gzip instead of Node
```

---

## PM2 Clustering — Using What You Already Have

PM2 cluster mode spawns **one Node.js process per CPU core**, each listening on
the same port. PM2 assigns incoming requests to processes using **round robin** —
it picks the next process in rotation before the request arrives.

```
Without PM2 cluster:                 With PM2 cluster (4 cores):

Core 1  [Node process]               Core 1  [Node process #1]
Core 2  [idle]                       Core 2  [Node process #2]
Core 3  [idle]                       Core 3  [Node process #3]
Core 4  [idle]                       Core 4  [Node process #4]
                                              ↑
                                     same port, PM2 round-robins
                                     incoming requests across all 4
```

```bash
# Run as many processes as CPU cores
pm2 start app.js -i max

# Or specify explicitly
pm2 start app.js -i 4
```

**What this gives you:**
- Up to 4× the CPU throughput on a 4-core machine
- Each process has its own independent RAM heap
- If one process crashes, the others keep serving requests
- Zero code changes required

**What this does NOT give you:**
- More RAM — each process eats its own slice, total RAM usage goes up
- Shared in-process state — each process is isolated (use Redis for shared sessions/cache)
- More than what the machine has — it just stops wasting what's already there

This is **efficiency**, not scaling. You are not getting more than what you paid for.
You are just stopping the waste.

### How PM2 Round Robin Actually Works

Requests do **not** move between processes after assignment. PM2 picks a process
**before** the request lands, and it stays there.

```
Request arrives
→ PM2 picks a process (round robin)
→ request goes to that process
→ if that process is under heavy load → request WAITS in that process
→ it does NOT jump to another process
```

```
incoming requests
        ↓
      PM2
   (round robin)
   ↙  ↓  ↘  ↘
  P1  P2  P3  P4

each process handles its own queue independently
no communication between processes
```

**Why round robin isn't perfect:**
```
Process 1 → handling light fast requests   → pool mostly free
Process 2 → handling heavy slow requests   → pool almost full
New request → PM2 blindly sends to P2 → hits a busy process
```

PM2 does not know which process is less busy — it just rotates.
A slow query in one process can bottleneck that process while others sit idle.
This is why query speed matters so much — fast queries free up the pool instantly
and prevent any one process from becoming a hot spot.

```
Fast queries → connections freed instantly → pool never fills → no queuing
Slow queries → connections held → pool fills → requests queue → users wait
```

No amount of processes or pool tuning fully compensates for slow queries.
That is always the root fix.

### Downsides of PM2 Clustering

**1. Memory multiplies**

Each process is a full copy of your app in RAM:
```
1 process  × 200MB = 200MB RAM used
4 processes × 200MB = 800MB RAM used
```
On a 1GB server, 4 processes can leave almost nothing for the OS or other services.

**2. Shared in-process state breaks**

Each process is completely isolated — they share no memory:
```
User logs in → hits Process 1 → session stored in Process 1's memory
Next request → hits Process 2 → Process 2 has no idea about that session
→ user appears logged out
```

Anything stored in-process breaks across processes:
```
in-memory sessions      ✗
in-memory caches        ✗
in-memory rate limiting ✗
```
Fix: move shared state to Redis before clustering.

**3. MongoDB connection count multiplies**

```
4 processes × maxPoolSize 100 = 400 connections to Atlas
```
Can hit Atlas tier limits faster — lower your `maxPoolSize` per process accordingly.

**4. Harder to debug**

Logs are interleaved across all processes. Tracing a specific error through mixed
output from 4 processes is harder than a single process log stream.

**5. Diminishing returns for I/O-bound apps**

If your app spends most of its time waiting on DB queries (I/O-bound), the CPU
cores are not the bottleneck — extra processes give marginal gains beyond 2–3.

**The sweet spot:**
```
Small server (≤1GB RAM)    → be careful, 4 processes may exhaust memory
Stateful app (sessions)    → move to Redis first, then cluster
Low Atlas tier (M0/FLEX)   → lower maxPoolSize per process first
Pure I/O-bound app         → gains shrink, 2 processes may be enough

For most apps: not always `pm2 start app.js -i max`
Sometimes 2 processes on a 4-core server is better than 4.
```

---

## The Progression: Efficiency → Scaling

```
Step 1 — Default (wasteful)
  1 Node process on a 4-core server
  → 75% CPU idle, paying for resources you don't use
  → throughput limited to 1 core worth of JS execution

Step 2 — PM2 clustering (efficiency)
  4 Node processes, 1 per core
  → 0% CPU idle, full use of what you already have
  → throughput ≈ 4×
  → still the same machine, same bill

Step 3 — Hit the machine's ceiling
  Traffic grows past what 4 cores + current RAM can handle
  → Now you actually need to scale

Step 4 — Vertical scaling (scale up)
  Upgrade to a bigger EC2 instance (more RAM, more cores)
  e.g. t3.medium (2 vCPU, 4GB) → t3.xlarge (4 vCPU, 16GB)
  → simple, no architecture change
  → has a ceiling — the biggest instance AWS offers is still one machine

Step 5 — Horizontal scaling (scale out)
  Run multiple EC2 instances behind a load balancer
  → no ceiling, add instances as needed
  → requires stateless app design (sessions in Redis, not in-process)
  → more complex but the only true path to unlimited scale
```

**Rule:** Always do Step 2 before considering Step 3.
No point paying for a bigger server if you are not using the one you have fully.

---

## Vertical vs Horizontal Scaling

### Vertical Scaling (Scale Up)

```
Before:                          After:
┌─────────────┐                  ┌─────────────────────┐
│ t3.medium   │    upgrade →     │ t3.xlarge           │
│ 2 vCPU      │                  │ 4 vCPU              │
│ 4 GB RAM    │                  │ 16 GB RAM           │
└─────────────┘                  └─────────────────────┘
```

| | Detail |
|---|---|
| How | Change the EC2 instance type in AWS console |
| Downtime | Brief restart required |
| Complexity | Zero — no code or architecture changes |
| Ceiling | Yes — the largest EC2 instance is still one machine |
| Cost | Linear — bigger instance = bigger bill |
| Best for | Getting more headroom quickly without changing architecture |

### Horizontal Scaling (Scale Out)

```
Before:                          After:
                                 ┌─────────────┐
┌─────────────┐                  │  Instance 1 │
│  Instance   │   add more →     ├─────────────┤
│  handles    │                  │  Instance 2 │  ← Load Balancer
│  all traffic│                  ├─────────────┤     distributes
└─────────────┘                  │  Instance 3 │     traffic
                                 └─────────────┘
```

| | Detail |
|---|---|
| How | Add more EC2 instances behind an Application Load Balancer (ALB) |
| Downtime | None — add/remove instances while running |
| Complexity | App must be stateless; shared state (sessions, cache) moved to Redis/DB |
| Ceiling | None — scale to as many instances as needed |
| Cost | Pay per instance — but each instance is smaller and cheaper |
| Best for | Production systems that need to grow beyond any single machine |

---

## Choosing the Right EC2 Instance Type for Node.js

AWS instance families are optimized for different bottlenecks:

| Family | Optimized for | Use when |
|--------|--------------|----------|
| `t3` / `t4g` | General purpose (burstable) | Dev, staging, low-traffic production |
| `m6i` / `m7i` | Balanced RAM + CPU | Most production Node.js apps |
| `c6i` / `c7i` | Compute (CPU) | CPU-bound work: image processing, heavy computation |
| `r6i` / `r7i` | Memory (RAM) | Memory-heavy: large in-memory caches, big working sets |

**Practical starting points for Node.js:**
```
Dev / staging      → t3.micro or t3.small    (1–2 vCPU, 1–2 GB)
Early production   → t3.medium               (2 vCPU, 4 GB)
Growing production → m6i.large               (2 vCPU, 8 GB)
High traffic       → m6i.xlarge or c6i.large (4 vCPU, 16 GB)
```

---

## Quick Diagnosis: Which Resource Are You Hitting?

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Latency climbs gradually under load | CPU saturated | More cores (vertical) or more instances (horizontal) |
| Processes crash / OOM errors | RAM exhausted | More RAM (vertical) or reduce memory per request |
| One core at 100%, rest idle | Not using PM2 cluster | Add PM2 cluster mode |
| All cores high, RAM fine | CPU-bound — need more capacity | Vertical or horizontal scale |
| RAM high, CPU fine | Memory leak or large payloads | Profile heap, reduce payload size |
| Fast locally, slow in prod | Instance too small | Upgrade instance type |

---

## Summary

```
RAM   → workspace  → how many requests exist in memory simultaneously
CPU   → workers    → how fast and how many requests are processed at once
Cores → # of workers → 1 core = 1 parallel thread of execution

PM2 cluster  = efficiency   → use all cores on the machine you have
Vertical     = scale up     → bigger machine, more RAM and cores
Horizontal   = scale out    → more machines, no ceiling, requires stateless design

Always: efficiency first → vertical if needed → horizontal for unlimited scale
```
