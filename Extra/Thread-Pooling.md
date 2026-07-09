# Thread Pooling

## The Core Idea in One Line

Open a fixed set of threads once upfront, reuse them forever — rather than
creating and destroying a thread every single time you need one.

---

## Why Not Just Open a Thread Per Task?

Creating a thread is expensive:
```
open thread → allocate memory stack → OS registers it → task runs → destroy thread
              └──────────────────────────────────────┘
                    ~1–5ms overhead just to create it
```

If you do this thousands of times per second, the overhead of creating and
destroying threads costs more than the actual work.

---

## What a Thread Pool Does Instead

```
App starts → pool creates N threads upfront → threads sit idle, waiting

Task arrives → grab an idle thread → run the task → thread goes back to pool
Task arrives → grab an idle thread → run the task → thread goes back to pool
Task arrives → grab an idle thread → run the task → thread goes back to pool
```

Threads are **never destroyed between tasks**. They finish, return to the pool,
and immediately become available again — zero creation cost on every reuse.

---

## The "Pool" Part — Parallel Execution

It is not one thread reused sequentially. It is **N threads all alive simultaneously**,
each grabbing independent tasks at the same time.

```
Pool size = 4 threads, 4 tasks arrive at the same moment:

Thread 1 → executes Task A  ┐
Thread 2 → executes Task B  ├── all 4 running in parallel
Thread 3 → executes Task C  │
Thread 4 → executes Task D  ┘

5th task arrives while all 4 are busy:
→ waits in queue
→ the moment any thread finishes → it picks up Task E instantly
```

**Fixed size. Parallel. Reused. That is the entire model.**

---

## The Connection Pool Parallel (Same Concept, Different Resource)

Thread pools and connection pools are the exact same pattern applied to different resources:

| | Thread Pool | Connection Pool |
|---|---|---|
| Resource | OS threads | TCP sockets to MongoDB/Redis |
| Created | Once at startup | Once at startup |
| Reused | Yes — thread returns after task | Yes — connection returns after query |
| Fixed size | Yes — UV_THREADPOOL_SIZE | Yes — maxPoolSize |
| Queue on full | Yes — tasks wait | Yes — queries wait |
| Purpose | Parallel CPU/IO work | Parallel DB queries |

A connection is held only for the duration of a query (~10ms), then returned —
exactly like a thread is held only during the task, then returned.

```
500 users, 1 query every 3s = 167 queries/second
Each query takes 10ms = 0.010s

Connections in use at any moment = 167 × 0.010 = ~2 connections

→ a pool of 10 handles 500 users with 80% headroom
```

The pool being reused is why you never need 1 connection per user.

---

## Use Cases

### 1. libuv Thread Pool in Node.js (built-in, always running)

Node.js uses a thread pool internally for operations the OS cannot do
asynchronously natively:

```
fs.readFile()        → thread pool (disk I/O)
bcrypt.hash()        → thread pool (CPU-heavy crypto)
zlib.gzip()          → thread pool (compression)
dns.lookup()         → thread pool (DNS resolution)
```

Default size: 4 threads. Set via `UV_THREADPOOL_SIZE`.

Network I/O (MongoDB queries, Redis, HTTP) bypasses this pool entirely —
the OS kernel handles it natively via the event loop.

### 2. MongoDB / Redis Connection Pool (driver-managed)

The database driver keeps a pool of open TCP connections to the DB server.
Each query borrows one, runs, returns it — never opens a new TCP connection
per query.

```js
mongoose.connect(uri, { maxPoolSize: 100 })
```

### 3. Worker Thread Pools (manual, for CPU-heavy work)

For genuinely heavy CPU tasks (image resizing, PDF generation, ML inference),
you create your own pool of worker threads to keep the event loop free:

```js
const { Worker } = require('worker_threads');
// worker runs in a separate V8 isolate
// does not share memory or event loop with main thread
// does not block other requests
```

### 4. HTTP Server Thread Pools (other runtimes)

In Java (Tomcat), Python (gunicorn), Go — web servers use thread pools to handle
incoming HTTP requests. Each request gets a thread from the pool.

Node.js does not do this — it uses the event loop instead, which is why one
Node process handles thousands of concurrent HTTP connections on a single thread.

---

## Summary

```
Thread pool = fixed set of threads created once, reused forever

Key properties:
  Fixed size   → N threads alive simultaneously, no creation overhead
  Parallel     → all N run at the same time independently
  Queued       → if all N are busy, new tasks wait — not dropped

Same concept applies to:
  libuv thread pool  → fs, crypto, zlib in Node.js      (UV_THREADPOOL_SIZE)
  Connection pool    → DB connections in Mongoose/Redis  (maxPoolSize)
  Worker threads     → CPU-heavy work isolated from event loop

The bottleneck is always pool size vs demand:
  demand < pool size  → instant execution, no waiting
  demand > pool size  → queue builds → latency rises
  fix: increase pool size (up to hardware limit) or make each task faster
```
