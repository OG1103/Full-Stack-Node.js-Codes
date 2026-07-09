## Idempotency

### What is it

An operation is **idempotent** if running it multiple times produces the same result as running it once.

**Why this matters:** Networks are unreliable. A client sends a request, never gets a response (timeout, network blip, browser tab closed), and retries. If your server processed the first request but the response was lost, the retry causes the operation to run **twice** — potentially charging a customer twice, placing two orders, or sending two emails.

```
Client sends "charge $50"
Server processes it → charges $50 → tries to send response
Response is lost in transit
Client never got a response → assumes failure → retries
Server processes "charge $50" again → charges another $50
Customer is charged $100 instead of $50
```

The fix: give each request a unique **idempotency key**. If the server has already processed a request with that key, it returns the saved result instead of running the operation again.

### Example

```js
// ❌ BROKEN — no idempotency, duplicate requests cause duplicate charges
app.post('/payments', async (req, res) => {
  const { userId, amount, description } = req.body;

  // Every time this endpoint is hit, a new payment is created
  const payment = await Payment.create({ userId, amount, description });

  res.json({ success: true, paymentId: payment._id });
});
```

If the client retries (due to a timeout), the payment is created again — duplicate charge.

### Solution

**Step 1 — Client sends an idempotency key with the request:**

The client generates a unique key (UUID) and attaches it to the request header. If it retries, it sends the **same key**.

```js
// Client-side example (fetch)
const idempotencyKey = crypto.randomUUID(); // generated once per operation

// First attempt:
fetch('/payments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey, // ← same key on every retry
  },
  body: JSON.stringify({ amount: 50 }),
});

// Retry (if first attempt timed out) — uses the SAME key:
fetch('/payments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Idempotency-Key': idempotencyKey, // ← same key
  },
  body: JSON.stringify({ amount: 50 }),
});
```

**Step 2 — Server checks the key before processing:**

```js
// Idempotency key schema — store processed requests
const idempotencySchema = new mongoose.Schema({
  key:        { type: String, unique: true, index: true },
  userId:     mongoose.Schema.Types.ObjectId,
  response:   mongoose.Schema.Types.Mixed, // store the full response
  createdAt:  { type: Date, default: Date.now, expires: '24h' }, // auto-delete after 24h
});
const IdempotencyRecord = mongoose.model('IdempotencyRecord', idempotencySchema);
```

```js
// ✅ FIXED — idempotent payment endpoint
app.post('/payments', async (req, res) => {
  const idempotencyKey = req.headers['idempotency-key'];

  if (!idempotencyKey) {
    return res.status(400).json({ error: 'Idempotency-Key header is required' });
  }

  // Check if we already processed this exact request
  const existing = await IdempotencyRecord.findOne({
    key: idempotencyKey,
    userId: req.user.id,
  });

  if (existing) {
    // We already processed this request — return the saved response
    // The client gets the same result without re-running the operation
    return res.status(200).json(existing.response);
  }

  // First time we've seen this key — process the request
  const { amount, description } = req.body;
  const payment = await Payment.create({ userId: req.user.id, amount, description });

  const responseBody = { success: true, paymentId: payment._id };

  // Save the result so future retries with this key get the same response
  await IdempotencyRecord.create({
    key:      idempotencyKey,
    userId:   req.user.id,
    response: responseBody,
  });

  res.json(responseBody);
});
```

**Handling race conditions on the idempotency key itself:**

If two requests with the same key arrive simultaneously (both miss the `findOne` check at the same time), you could create two payments. Prevent this using MongoDB's unique index on the key — the second `create` will throw a duplicate key error.

```js
// ✅ FIXED — handle the race on the idempotency key
app.post('/payments', async (req, res) => {
  const idempotencyKey = req.headers['idempotency-key'];
  if (!idempotencyKey) return res.status(400).json({ error: 'Idempotency-Key required' });

  // Try to claim this key immediately (unique index prevents duplicates)
  try {
    await IdempotencyRecord.create({ key: idempotencyKey, userId: req.user.id });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key — this request is already being processed (or was already done)
      const existing = await IdempotencyRecord.findOne({ key: idempotencyKey });
      if (existing?.response) return res.json(existing.response);
      // Still processing — tell client to retry after a moment
      return res.status(409).json({ error: 'Request already in progress, retry in a moment' });
    }
    throw err;
  }

  // We have the lock — process the payment
  const payment = await Payment.create({ userId: req.user.id, amount: req.body.amount });
  const responseBody = { success: true, paymentId: payment._id };

  // Update the record with the response
  await IdempotencyRecord.findOneAndUpdate(
    { key: idempotencyKey },
    { response: responseBody }
  );

  res.json(responseBody);
});
```

### When to use each solution

| Solution | When to use it |
|---|---|
| **Simple check-then-create** | Use for most APIs. Simple, clear, and covers the vast majority of retry scenarios. |
| **Claim-first (unique index)** | Use when the operation is very high-stakes (financial transactions, order placement) and you must guarantee zero duplicates even under concurrent retries. |
| **No idempotency** | Acceptable only for truly read-only operations (GET requests) or operations where duplicates have zero impact (e.g., updating a timestamp to "now"). |
