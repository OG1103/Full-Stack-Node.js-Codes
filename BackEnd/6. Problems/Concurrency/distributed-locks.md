## Distributed Locks

### What is it

A **distributed lock** ensures that **only one server (or process) can run a specific piece of code at a time**, even when you have multiple Node.js instances running behind a load balancer.

When you run a single Node.js process, you can use an in-memory variable as a lock. But when you scale to multiple servers, each server has its own memory — an in-memory lock on Server 1 is invisible to Server 2. Both servers can run the same code at the same time.

The solution is to use a **shared external store** (Redis) as the lock. Every server checks the same Redis instance, so only one can hold the lock at a time.

```
Single server (in-memory lock works):
  Server 1: checks lock variable → acquired → runs code

Multiple servers (in-memory lock FAILS):
  Server 1: checks its own memory → no lock → acquired → runs code
  Server 2: checks its own memory → no lock → acquired → runs code ← BOTH run at once!

Multiple servers (Redis lock works):
  Server 1: checks Redis → no lock → SET lock NX → acquired → runs code
  Server 2: checks Redis → lock exists → waits or rejects
```

### Example

```js
// ❌ BROKEN — in-memory lock, useless with multiple servers
let isRunning = false; // each server has its own copy of this variable

app.post('/invoices/generate-monthly', async (req, res) => {
  if (isRunning) {
    return res.status(409).json({ error: 'Already running' });
  }

  isRunning = true; // Server 1 sets this to true
  // Server 2 still has isRunning = false in its own memory → both run simultaneously

  try {
    await generateAllMonthlyInvoices(); // runs twice — duplicate invoices sent
    res.json({ success: true });
  } finally {
    isRunning = false;
  }
});
```

### Solution

**Use Redis `SET NX` (Set if Not Exists) as the lock:**

`SET key value NX PX ttl` is a single atomic Redis command that only sets the key if it does not already exist. Only one server can ever succeed — all others get `null` back.

```bash
npm install ioredis
```

```js
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

// Acquire the lock — returns true if we got it, false if someone else has it
async function acquireLock(lockKey, ttlMs = 30_000) {
  const result = await redis.set(lockKey, '1', 'NX', 'PX', ttlMs);
  return result === 'OK';
}

// Release the lock
async function releaseLock(lockKey) {
  await redis.del(lockKey);
}
```

```js
// ✅ FIXED — Redis distributed lock
app.post('/invoices/generate-monthly', async (req, res) => {
  const lockKey = 'lock:generate-monthly-invoices';

  const acquired = await acquireLock(lockKey, 60_000); // 60 second TTL

  if (!acquired) {
    return res.status(409).json({ error: 'Invoice generation is already in progress' });
  }

  try {
    await generateAllMonthlyInvoices();
    res.json({ success: true });
  } finally {
    await releaseLock(lockKey); // always release, even if an error is thrown
  }
});
```

Now, no matter how many servers you have, only one will ever hold the lock at a time.

**More complete example — lock with automatic expiry protection:**

The TTL in `acquireLock` is a safety net: if the server crashes while holding the lock, Redis automatically deletes the key after `ttlMs` milliseconds so other servers are not locked out forever.

```js
// ✅ Lock helper with TTL safety net
async function withLock(lockKey, ttlMs, fn) {
  const acquired = await acquireLock(lockKey, ttlMs);

  if (!acquired) {
    throw new Error(`Could not acquire lock: ${lockKey}`);
  }

  try {
    return await fn(); // run the protected code
  } finally {
    await releaseLock(lockKey); // always release
  }
}

// Usage — clean and readable
app.post('/invoices/generate-monthly', async (req, res) => {
  try {
    await withLock('lock:generate-monthly-invoices', 60_000, async () => {
      await generateAllMonthlyInvoices();
    });
    res.json({ success: true });
  } catch (err) {
    if (err.message.startsWith('Could not acquire lock')) {
      return res.status(409).json({ error: 'Already running on another server' });
    }
    throw err;
  }
});
```

**Per-resource locks — lock a specific document, not the whole operation:**

Sometimes you do not want to block everything — just prevent two requests from modifying the **same resource** at the same time.

```js
// ✅ Per-resource lock — only block requests for the same order ID
app.post('/orders/:id/process', async (req, res) => {
  const lockKey = `lock:order:${req.params.id}`; // unique per order

  const acquired = await acquireLock(lockKey, 10_000);
  if (!acquired) {
    return res.status(409).json({ error: 'Order is already being processed' });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Order is not in pending status' });
    }

    order.status = 'processing';
    await order.save();

    await chargeCustomer(order);

    order.status = 'completed';
    await order.save();

    res.json({ success: true });
  } finally {
    await releaseLock(lockKey);
  }
});
```

Two requests for `order:123` cannot run at the same time, but requests for `order:456` and `order:789` can run concurrently — they have different lock keys.

### When to use each solution

| Solution | When to use it |
|---|---|
| **Global lock (`lock:job-name`)** | Use for background jobs, cron tasks, or admin operations that must run on exactly one server at a time (e.g., nightly report generation, monthly billing). |
| **Per-resource lock (`lock:model:id`)** | Use when you need to serialize operations on a specific record (e.g., order processing, document editing). Allows parallelism across different resources. |
| **No lock (atomic DB operation)** | If the operation can be expressed as a single atomic MongoDB command (`$inc`, `findOneAndUpdate` with a condition), use that instead — it is simpler and faster than a Redis lock. |

> See also: `race-conditions.md` for atomic alternatives and `idempotency.md` for handling client retries.
