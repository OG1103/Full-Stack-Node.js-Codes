# 5. Caching

Caching is the practice of storing the result of an expensive operation so it can be reused without repeating the computation. It is one of the most impactful performance tools available to any backend system.

---

## 5.1 Why Caching Exists

The fundamental trade-off: computation, I/O, and network calls are expensive; memory reads are cheap. A database query that takes 50ms can be replaced with a memory lookup that takes 0.1ms. Every cache hit is a database query not made, a CPU cycle not spent, a network round trip not taken.

Caching does not make slow code fast — it makes expensive operations infrequent.

---

## 5.2 Cache Layers

Multiple independent caching layers exist between the user and the database. Each layer is controlled by different parties and caches different things.

```
                 ┌─────────────────────────────────┐
                 │  Client (Browser Cache)          │
                 │  Caches: HTML, JS, CSS, images   │
                 │  Controlled by: Cache-Control    │
                 └────────────────┬────────────────-┘
                                  │ cache miss
                 ┌────────────────▼─────────────────┐
                 │  CDN (Edge Cache)                 │
                 │  Caches: static assets, API resp. │
                 │  Controlled by: Cache-Control     │
                 └────────────────┬─────────────────┘
                                  │ cache miss
                 ┌────────────────▼─────────────────┐
                 │  Reverse Proxy / Load Balancer    │
                 │  Caches: entire HTTP responses    │
                 │  Controlled by: proxy config      │
                 └────────────────┬─────────────────┘
                                  │ cache miss
                 ┌────────────────▼─────────────────┐
                 │  Application Cache (Redis etc.)   │
                 │  Caches: query results, sessions  │
                 │  Controlled by: application code  │
                 └────────────────┬─────────────────┘
                                  │ cache miss
                 ┌────────────────▼─────────────────┐
                 │  Database Query Cache             │
                 │  Caches: parsed query results     │
                 │  Controlled by: DB engine config  │
                 └────────────────┬─────────────────┘
                                  │ cache miss
                 ┌────────────────▼─────────────────┐
                 │  Database (source of truth)       │
                 └──────────────────────────────────┘
```

A request hits each layer in order and only travels deeper on a cache miss. The goal is to satisfy as many requests as high in the stack as possible.

---

## 5.3 In-Memory Caching

Storing cached data in the application process's own memory (a dictionary, hashmap, or dedicated in-process cache). No network hop required — reads are as fast as a memory access.

| Aspect | Detail |
|---|---|
| Speed | Fastest possible — sub-microsecond reads |
| Sharing | Not shared across multiple server instances — each process has its own copy |
| Persistence | Lost on process restart |
| Capacity | Limited by the process's allocated memory |
| Best for | Lookup tables, static configuration, per-instance rate limit counters |

In-memory caching is unsuitable for data that must be consistent across multiple server instances (e.g., user sessions, shared counters). Use a distributed cache for those.

---

## 5.4 Distributed Caching (Redis Conceptually)

A distributed cache is an external in-memory data store shared by all server instances. Every instance reads from and writes to the same cache, ensuring consistency.

Redis is the canonical distributed cache. It is, at its core, an in-memory key-value store with support for rich data structures (strings, lists, sets, sorted sets, hashes). Beyond caching, it is used for:
- **Session storage:** All server instances can look up any user's session
- **Rate limiting counters:** Atomic increment operations ensure correctness across instances
- **Distributed locks:** Prevent concurrent operations from conflicting
- **Pub/sub messaging:** Lightweight event broadcasting between services
- **Background job queues:** Task scheduling and worker coordination

> Redis commands and client setup are covered in depth in the relevant library notes.

---

## 5.5 CDN Caching

A Content Delivery Network is a geographically distributed network of servers (edge nodes). When a user requests a resource, it is served from the nearest edge node rather than the origin server. This reduces latency for users far from the origin and offloads traffic from the server.

CDNs primarily cache:
- Static assets (images, JavaScript bundles, CSS, fonts)
- API responses, when explicitly configured with appropriate `Cache-Control` headers

The server instructs CDNs (and browsers) how to cache a response via the `Cache-Control` header. If the header is absent, CDN caching behavior is undefined and varies by provider.

---

## 5.6 HTTP Caching Headers

HTTP provides a standardized mechanism for controlling caching behavior across all layers.

| Header | Purpose | Example |
|---|---|---|
| `Cache-Control: max-age=3600` | Cache this response for 3600 seconds | Static assets |
| `Cache-Control: no-cache` | May be cached, but must be revalidated before use | Dynamic content |
| `Cache-Control: no-store` | Never cache this response | Sensitive data |
| `Cache-Control: private` | Only the browser may cache; CDNs must not | Personalized responses |
| `Cache-Control: public` | Both browsers and CDNs may cache | Shared public content |
| `ETag: "abc123"` | A fingerprint of the response content | Combined with `If-None-Match` |
| `Last-Modified: Thu, 20 Mar 2026 10:00:00 GMT` | When the resource last changed | Combined with `If-Modified-Since` |

**Conditional requests (304 Not Modified):** The client sends its cached ETag back with `If-None-Match: "abc123"`. If the resource has not changed, the server returns `304 Not Modified` with no body — saving bandwidth while allowing the client to reuse its cache.

---

## 5.7 Cache Invalidation Strategies

Cache invalidation — knowing when to remove or refresh a cached entry — is considered one of the two hardest problems in computer science. The strategies represent different trade-offs between freshness, consistency, and simplicity.

| Strategy | How it works | Trade-off |
|---|---|---|
| TTL (Time-to-Live) | Cache entry expires after N seconds | Simple; may serve stale data up to N seconds after source changes |
| Cache-aside (Lazy Loading) | Read from cache; on miss, read from DB and populate cache | Most common; cache only contains what has been requested |
| Write-through | Write to cache and DB simultaneously on every write | Cache always consistent; higher write latency |
| Write-behind (Write-back) | Write to cache immediately; flush to DB asynchronously | Fastest writes; risk of data loss if cache crashes before flush |
| Event-driven invalidation | Domain events (e.g., `ProductUpdated`) trigger cache deletion | Precise; requires event infrastructure; most complex |

For most applications, cache-aside with a reasonable TTL is the right starting point.

---

## 5.8 Cache Pitfalls

**Cache stampede (thundering herd):** A popular cache key expires. Simultaneously, thousands of requests miss the cache, all hit the database at once, and all try to repopulate the cache. The database is overwhelmed. Mitigation: add jitter (random variation) to TTL values; use a probabilistic early expiration strategy; use distributed locks to ensure only one request repopulates a key.

**Stale data window:** Between when source data changes and when the cache expires, users see outdated data. The acceptable staleness window is a product decision and should be explicitly defined.

**When NOT to cache:**
- Financial transactions requiring strict consistency (account balances, payment records)
- Highly personalized data where each user's response is unique and unlikely to be reused
- Data that changes faster than the TTL — the cache adds latency without benefit
- Any operation that must read its own writes immediately
