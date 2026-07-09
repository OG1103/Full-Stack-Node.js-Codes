# 6. Performance & Scalability

Performance is about serving individual requests quickly. Scalability is about maintaining that performance as load increases. Both require deliberate architectural decisions — they do not emerge naturally from correct code.

---

## 6.1 Vertical vs Horizontal Scaling

| Approach | Description | Limit | Risk |
|---|---|---|---|
| Vertical scaling (scale up) | Add more CPU, RAM, or faster storage to a single machine | Physical hardware ceiling | Single point of failure |
| Horizontal scaling (scale out) | Add more machines running the same application | Near-unlimited (with cost) | Requires stateless application design |

Horizontal scaling requires that the application hold no local state. If one request modifies in-process state (a variable, a local cache, a file on the local filesystem) and the next request goes to a different instance, that state is invisible. This is why session state must be stored in a shared external store (Redis, database) rather than in process memory.

The 12-Factor App principle: **stateless processes**. Store all state that must persist in backing services (databases, caches), not in the application process itself.

---

## 6.2 Load Balancing

A load balancer sits in front of a pool of server instances and distributes incoming requests across them. Without a load balancer, horizontal scaling is useless — all traffic would go to one instance.

**Distribution algorithms:**

| Algorithm | How it works | Best for |
|---|---|---|
| Round-robin | Requests distributed sequentially across instances | Equal-sized requests, homogeneous instances |
| Least connections | Send each request to the instance with the fewest active connections | Variable request durations |
| IP hash | Hash the client's IP to always route to the same instance (sticky sessions) | Applications with local session state (legacy pattern) |
| Weighted | Some instances receive a higher proportion of traffic | Heterogeneous instances (different capacities) |

**Health checks:** The load balancer periodically probes each instance (e.g., `GET /health`). If an instance fails to respond, the load balancer stops sending traffic to it and routes around it. This enables zero-downtime deployments (remove instance from pool, deploy, verify health, return to pool).

**L4 vs L7:**
- **Layer 4 (TCP):** Routes based on IP and port. No visibility into HTTP content. Faster, lower overhead.
- **Layer 7 (HTTP):** Routes based on URL path, headers, or content. Enables path-based routing to different services (e.g., `/api/` → API cluster, `/` → static asset cluster).

---

## 6.3 Connection Pooling

Establishing a new database connection for every request is expensive. It involves a TCP handshake, TLS handshake, database authentication, and memory allocation on both sides. A connection that takes 5ms to establish and 1ms to execute a query wastes 83% of its time on setup.

A **connection pool** maintains a set of pre-established connections that are leased to request handlers and returned when finished. The overhead is paid once at application startup, not per request.

**Pool size tuning:**
- Too small: requests queue waiting for an available connection (latency spike under load)
- Too large: the database runs out of available connection slots (most databases have a hard limit)
- A rough rule of thumb: `pool_size ≈ (number_of_cpu_cores * 2) + effective_spindle_count`

Connection pools are a feature of database client libraries, not something built manually. They are available in virtually every language and database combination.

---

## 6.4 Asynchronous Processing and Background Jobs

Not every operation needs to be completed before the server responds to the client. If an action is slow, can fail and be retried, or does not affect the response content, it is a candidate for asynchronous processing.

**The pattern:**
1. Client sends a request (e.g., "process this order")
2. Server validates the request, enqueues the work, and returns `202 Accepted` immediately with a job ID
3. A background worker picks up the job from the queue and processes it
4. Client can poll the status endpoint or receive a webhook when complete

**Examples of background-able work:**
- Sending emails or notifications
- Generating PDF reports or data exports
- Processing uploaded images (resize, transcode)
- Syncing data to third-party services
- Running scheduled maintenance tasks

A job queue (BullMQ in Node.js, Sidekiq in Ruby, Celery in Python, etc.) handles job persistence, retry logic, priority, and failure handling. Failed jobs go to a dead-letter queue for inspection rather than being silently lost.

---

## 6.5 Database Read Replicas

Most web applications read data far more often than they write it. A read replica is a copy of the database that receives all writes from the primary and replicates them asynchronously.

```
Writes → Primary DB (source of truth)
                 |
                 | replication
                 ↓
Reads  ← Read Replica 1
Reads  ← Read Replica 2
```

**Replication lag:** There is a delay (typically milliseconds to seconds) between a write to the primary and its availability on replicas. This is generally acceptable for most reads but must be accounted for in cases where a user must immediately read their own write (e.g., updating profile and immediately viewing it). Route these critical reads to the primary.

---

## 6.6 The N+1 Query Problem

The N+1 query problem occurs when fetching a list of N records and then making one additional database query per record to fetch related data.

```
Example: Fetch 100 orders and the customer name for each
  Query 1: SELECT * FROM orders  →  returns 100 rows
  Query 2: SELECT name FROM customers WHERE id = 1
  Query 3: SELECT name FROM customers WHERE id = 2
  ...
  Query 101: SELECT name FROM customers WHERE id = 100

Total: 101 queries instead of 1
```

At small scale this is invisible. At scale (1000 records, 10 concurrent requests) it results in 10,010 database queries per second from what appears to be light traffic.

**Solutions:**
- **Eager loading / JOIN:** Include related data in the original query (`SELECT orders.*, customers.name FROM orders JOIN customers ON ...`)
- **Batching / DataLoader pattern:** Collect all required IDs and fetch them in one `WHERE id IN (...)` query
- **ORM eager loading:** Most ORMs provide a `include` or `populate` option that generates efficient JOINs automatically

> For Mongoose populate (eager loading) see `3. Database/MongoDB/05_Query_Features/`. For Sequelize associations and includes, see `3. Database/MySQL/05_Associations/`.

---

## 6.7 Indexing as a Performance Tool

A database index is a separate data structure (typically a B-tree) that the database maintains alongside the table data. It allows the database to find rows matching a condition without scanning the entire table.

Without index: O(n) scan — every row is examined
With index: O(log n) lookup — the B-tree is traversed

The cost of indexes: every write to the table (insert, update, delete) must also update all indexes on that table. Indexes are a read/write trade-off.

> Detailed coverage of index types, composite indexes, and the left-prefix rule is in `07_Database_Design_Fundamentals/`.

---

## 6.8 Profiling and Identifying Bottlenecks

The cardinal rule: **measure before optimizing.** Optimizing code that is not the bottleneck wastes time and adds complexity.

The standard methodology:
1. Establish a baseline metric (requests per second, p99 latency)
2. Identify the constraint: is it CPU, memory, database query time, I/O, network?
3. Profile the specific bottleneck (query EXPLAIN plans, flame graphs, APM traces)
4. Optimize the single biggest bottleneck
5. Measure again to verify the improvement

Common bottlenecks in roughly descending order of frequency:
- Slow database queries (missing indexes, N+1 queries, unoptimized joins)
- Blocking I/O in a single-threaded runtime (doing file I/O synchronously in Node.js)
- Repeated expensive computation (candidates for caching)
- Chatty third-party API calls (missing connection reuse, no timeout, no caching)
- Memory leaks causing garbage collection pressure
