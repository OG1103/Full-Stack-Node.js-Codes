## Thundering Herd

### What is it

The thundering herd problem happens when **many requests arrive at the same time for the same data, the cache is empty (cache miss), and all of them simultaneously hit the database**.

Normally, one request fetches the data, stores it in cache, and all future requests read from cache. But when the cache is cold (just started, or cache entry expired), every request that arrives before the first one has finished will also fire a database query. This creates a sudden spike of identical queries all hitting the database at once — potentially crashing or severely slowing it down.

```
Normal flow (cache warm):
  Request 1, 2, 3 ... 100  →  Redis cache hit  →  return instantly

Thundering herd (cache expired at midnight):
  Request 1  →  cache miss  →  hits DB
  Request 2  →  cache miss  →  hits DB   ← all arrive before Request 1 finishes
  Request 3  →  cache miss  →  hits DB
  ...
  Request 100 → cache miss  →  hits DB

100 identical DB queries fire at once. Database overloads.
```

### Example

```js
// ❌ BROKEN — no protection against cache stampede
app.get('/products/featured', async (req, res) => {
  const cacheKey = 'featured_products';

  // Check cache
  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  // Cache miss — if 200 requests arrive here simultaneously, all hit the DB
  const products = await Product.find({ featured: true }).lean();

  await redis.set(cacheKey, JSON.stringify(products), 'EX', 60); // cache for 60s

  res.json(products);
});
```

When the cache expires, all in-flight requests find an empty cache and all query the database simultaneously.

### Solution

**Solution 1 — Mutex lock (only one request fetches, others wait):**

Use a Redis lock so only the **first** cache-miss request fetches from the database. All other simultaneous requests wait briefly and then read from the cache that the first request just populated.

```js
const Redis = require('ioredis');
const redis = new Redis();

// ✅ FIXED — mutex lock prevents simultaneous DB fetches
app.get('/products/featured', async (req, res) => {
  const cacheKey  = 'featured_products';
  const lockKey   = 'lock:featured_products';

  // 1. Try the cache first
  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  // 2. Try to acquire the lock (NX = only set if not exists, PX = expire after 5s)
  const lockAcquired = await redis.set(lockKey, '1', 'NX', 'PX', 5000);

  if (lockAcquired) {
    // We got the lock — we are responsible for fetching and caching
    try {
      const products = await Product.find({ featured: true }).lean();
      await redis.set(cacheKey, JSON.stringify(products), 'EX', 60);
      return res.json(products);
    } finally {
      await redis.del(lockKey); // always release the lock
    }
  } else {
    // Another request is already fetching — wait briefly and read from cache
    await new Promise((resolve) => setTimeout(resolve, 200)); // wait 200ms
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    // Fallback: if still not cached, query the DB directly
    const products = await Product.find({ featured: true }).lean();
    return res.json(products);
  }
});
```

**Solution 2 — Stale-while-revalidate (return old data, refresh in background):**

Keep serving the old (stale) cached value to all users while one background process quietly fetches fresh data. Users never wait — they always get a response immediately.

```js
// ✅ FIXED — serve stale cache, refresh in background
app.get('/products/featured', async (req, res) => {
  const cacheKey   = 'featured_products';
  const refreshKey = 'refreshing:featured_products';

  const cached = await redis.get(cacheKey);

  if (cached) {
    // Check if cache is about to expire (within 10 seconds of TTL ending)
    const ttl = await redis.ttl(cacheKey);

    if (ttl < 10) {
      // Cache is about to expire — trigger a background refresh
      // but only if one isn't already running
      const alreadyRefreshing = await redis.set(refreshKey, '1', 'NX', 'PX', 10000);
      if (alreadyRefreshing) {
        // Don't await — fire and forget so users don't wait
        Product.find({ featured: true }).lean().then(async (products) => {
          await redis.set(cacheKey, JSON.stringify(products), 'EX', 60);
          await redis.del(refreshKey);
        }).catch(console.error);
      }
    }

    // Return the (possibly slightly stale) cached data immediately
    return res.json(JSON.parse(cached));
  }

  // Cache is completely empty — fetch and cache
  const products = await Product.find({ featured: true }).lean();
  await redis.set(cacheKey, JSON.stringify(products), 'EX', 60);
  res.json(products);
});
```

**Solution 3 — Cache with jitter (stagger expiry times):**

Instead of all cache entries expiring at the same second (e.g., all set to 60s), add a small random offset. This spreads cache misses out over time so they don't all hit the database at once.

```js
// ✅ Add random jitter to cache TTL
function getTTLWithJitter(baseTTL = 60) {
  const jitter = Math.floor(Math.random() * 15); // random 0–15 seconds
  return baseTTL + jitter; // e.g., 60s to 75s
}

await redis.set(cacheKey, JSON.stringify(products), 'EX', getTTLWithJitter(60));
```

### When to use each solution

| Solution | When to use it |
|---|---|
| **Mutex lock** | Best when data accuracy matters. Only one request fetches at a time. Others wait briefly. Use for dashboards, product pages, or any high-traffic endpoint. |
| **Stale-while-revalidate** | Best when a slightly outdated response is acceptable (social feeds, trending lists, statistics). Users never wait — they always get an instant response. |
| **TTL jitter** | Use as a complement to any of the above. Prevents mass simultaneous expiry when you cache many similar items. Always add jitter when caching large datasets. |
