## Redundant Work: Caching, Polling, and Duplicate Calls

### What is it

A lot of backend cost isn't from any single request being expensive — it's from doing the **same expensive thing over and over** when the answer hasn't changed. Recomputing, re-querying, or re-fetching identical data on every request burns database reads, third-party API quota (which is often billed per-call), and CPU for no new information.

| Waste source | What it costs you |
|---|---|
| Re-running the same expensive query/aggregation on every request | Full DB cost paid repeatedly for an unchanged answer |
| Polling an external API or another service on a timer "just in case" | Billed API calls / compute even when nothing changed |
| No cache layer for read-heavy, rarely-changing data (config, plans, categories) | Every request pays full DB round-trip cost for static data |
| Calling a paid third-party API (email, SMS, geocoding, AI) redundantly for the same input | Direct per-call billing, often the largest line item in a cost report |
| Recomputing a value in-process on every call instead of memoizing it | Wasted CPU, which on serverless/pay-per-use platforms is billed directly |

### Example

```js
// ❌ EXPENSIVE — heavy aggregation re-run on every single page load
app.get('/dashboard/stats', async (req, res) => {
  const stats = await Order.aggregate([
    { $match: { createdAt: { $gte: startOfMonth() } } },
    { $group: { _id: '$status', total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]); // scans/aggregates a month of orders on every request
  res.json(stats);
});

// ❌ EXPENSIVE — polling a paid geocoding API every 30s regardless of change
setInterval(async () => {
  const location = await geocodeApi.lookup(driver.address); // billed per call
  await Driver.updateOne({ _id: driver.id }, { location });
}, 30_000);
```

### Solution

**Fix 1 — Cache expensive/rarely-changing results (in-memory or Redis):**

```js
// ✅ CHEAPER — recompute once per minute, serve cache the rest of the time
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 60 }); // 60s TTL

app.get('/dashboard/stats', async (req, res) => {
  const cached = cache.get('dashboard-stats');
  if (cached) return res.json(cached);

  const stats = await Order.aggregate([/* ... */]);
  cache.set('dashboard-stats', stats);
  res.json(stats);
});
```

For multi-instance deployments, use a shared cache (Redis) instead of in-memory, so every instance doesn't independently recompute the same thing.

**Fix 2 — Replace polling with event-driven updates (webhooks) where possible:**

```js
// ✅ CHEAPER — the provider calls you only when something actually changed,
// instead of you calling them repeatedly to check
app.post('/webhooks/geocoding-update', (req, res) => {
  const { driverId, location } = req.body;
  Driver.updateOne({ _id: driverId }, { location });
  res.sendStatus(200);
});
```

**Fix 3 — Deduplicate/debounce identical in-flight requests:**

```js
// ✅ CHEAPER — collapses N simultaneous requests for the same key into 1 upstream call
const inFlight = new Map();

async function getExchangeRate(currency) {
  if (inFlight.has(currency)) return inFlight.get(currency); // join the existing call

  const promise = externalRatesApi.fetch(currency).finally(() => inFlight.delete(currency));
  inFlight.set(currency, promise);
  return promise;
}
```

**Fix 4 — Memoize pure, repeat-input computations within a process:**

```js
// ✅ CHEAPER — avoid recomputing the same pure calculation for the same input
const memo = new Map();
function computeShippingZone(postalCode) {
  if (memo.has(postalCode)) return memo.get(postalCode);
  const zone = expensiveZoneLookup(postalCode);
  memo.set(postalCode, zone);
  return zone;
}
```

### When to use each solution

| Solution | When to use it |
|---|---|
| **TTL cache (in-memory)** | Single-instance apps, data that tolerates being slightly stale (dashboards, aggregates, config). |
| **Shared cache (Redis)** | Multi-instance/horizontally scaled apps — avoids each instance paying the cost independently. |
| **Webhooks instead of polling** | Any third-party integration that supports push notifications — almost always cheaper than a polling loop. |
| **Request de-duplication** | Bursty traffic where many concurrent requests ask for the same not-yet-cached value (thundering herd on cache miss). |
| **In-process memoization** | Pure functions called repeatedly with a small set of recurring inputs within one process lifetime. |
