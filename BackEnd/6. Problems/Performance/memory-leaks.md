## Memory Leaks

### What is it

A memory leak happens when your Node.js application **allocates memory but never frees it**. Over time the memory usage grows and grows until the server runs out of RAM and crashes or becomes too slow to respond.

The tricky part: the code looks fine, it works fine at first, and there are no error messages. The server just slowly gets worse over hours or days until it dies.

**Common causes in Express/Node.js backends:**

| Cause | Example |
|---|---|
| Event listeners never removed | Attaching listeners in a loop but never calling `removeListener` |
| Closures holding large objects | A request handler captures a large array in a closure that never gets garbage collected |
| Unbounded caches | An in-memory cache that grows indefinitely with no eviction |
| Mongoose connection not closed | Opening a new DB connection per request instead of reusing a pool |
| Timers/intervals never cleared | `setInterval` running forever, holding references to large objects |

### Example

```js
// ❌ BROKEN — three common memory leaks

// Leak 1: in-memory cache with no size limit
const cache = {}; // grows forever as new users visit

app.get('/users/:id', async (req, res) => {
  if (!cache[req.params.id]) {
    cache[req.params.id] = await User.findById(req.params.id).lean();
    // cache is never cleared — after 1 million unique requests, RAM is exhausted
  }
  res.json(cache[req.params.id]);
});


// Leak 2: event listener added on every request, never removed
app.post('/upload', (req, res) => {
  process.on('exit', () => {
    // cleanup code
  }); // ← added on EVERY request — thousands of listeners pile up
  res.json({ success: true });
});


// Leak 3: new Mongoose connection per request
app.get('/data', async (req, res) => {
  const conn = await mongoose.createConnection(process.env.MONGO_URI); // ← new connection every request
  const Data = conn.model('Data', dataSchema);
  const data = await Data.find();
  // conn is never closed — connections accumulate
  res.json(data);
});
```

### Solution

**Fix 1 — Use a size-limited cache (LRU Cache):**

An LRU (Least Recently Used) cache automatically evicts the oldest entries when it reaches a size limit, so memory stays bounded.

```bash
npm install lru-cache
```

```js
// ✅ FIXED — bounded LRU cache
const { LRUCache } = require('lru-cache');

const cache = new LRUCache({
  max: 500,       // max 500 entries — oldest are evicted when full
  ttl: 1000 * 60, // each entry expires after 60 seconds
});

app.get('/users/:id', async (req, res) => {
  const key = `user:${req.params.id}`;

  if (cache.has(key)) {
    return res.json(cache.get(key));
  }

  const user = await User.findById(req.params.id).lean();
  cache.set(key, user);
  res.json(user);
});
```

**Fix 2 — Register event listeners once, outside request handlers:**

```js
// ✅ FIXED — register listeners once at startup, not per request
process.on('exit', () => {
  // cleanup code
});

// If you truly need per-request listeners, remove them when done:
app.post('/upload', (req, res) => {
  const handler = () => { /* cleanup */ };
  req.on('close', handler);
  res.on('finish', () => req.removeListener('close', handler)); // ← remove after done
  res.json({ success: true });
});
```

**Fix 3 — Reuse a single Mongoose connection (connect once at startup):**

```js
// ✅ FIXED — connect once when the app starts, reuse for all requests
// In server.js / app.js:
mongoose.connect(process.env.MONGO_URI);

// Now every model uses this shared connection automatically
// No need to create/close connections per request
app.get('/data', async (req, res) => {
  const data = await Data.find(); // uses the shared connection
  res.json(data);
});
```

**Fix 4 — Clear intervals when they are no longer needed:**

```js
// ✅ FIXED — store the reference and clear it when done
const intervalId = setInterval(async () => {
  await cleanupExpiredSessions();
}, 60_000);

// Clear it on shutdown so Node.js can garbage collect the closure
process.on('SIGTERM', () => {
  clearInterval(intervalId);
  mongoose.connection.close();
  process.exit(0);
});
```

**Detecting memory leaks — monitor heap usage:**

```js
// Add this to watch memory growth in development
setInterval(() => {
  const mem = process.memoryUsage();
  console.log(`Heap used: ${Math.round(mem.heapUsed / 1024 / 1024)} MB`);
}, 10_000);
```

If heap used grows continuously without levelling off, you have a leak.

### When to use each solution

| Solution | When to use it |
|---|---|
| **LRU Cache** | Whenever you cache anything in memory. Always set a `max` size and a `ttl`. Never use a plain object `{}` as a long-lived cache. |
| **Register listeners once** | Any time you call `process.on`, `emitter.on`, or `req.on` — make sure it is either called once at startup or has a matching `removeListener`. |
| **Single Mongoose connection** | Always. Call `mongoose.connect()` once at startup and let Mongoose manage the connection pool. Never open connections inside request handlers. |
| **Clear intervals** | Any `setInterval` or `setTimeout` that holds a reference to a large object should be cleared when the owning context is destroyed. |
