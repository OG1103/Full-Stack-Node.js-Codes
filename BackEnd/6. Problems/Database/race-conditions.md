## Race Conditions

### What is it

A race condition happens when **two requests read the same data at the same time, both modify it, and both write back** — so one write silently overwrites the other.

The dangerous pattern is **Read → Modify → Write**. There is a gap in time between reading and writing. Another request can slip into that gap, read the same old value, and cause one update to be lost.

```
Request A:  READ stock=10 ──────────────── WRITE stock=9
Request B:            READ stock=10 ─ WRITE stock=9

Both read 10. Both subtract 1. Both write 9.
Final value: 9 — but 2 items were sold. Should be 8.
```

No error is thrown. The data is silently wrong.

> For a full deep-dive with more examples and all solutions explained in detail, see `BackEnd/2. Express/16_Race_Conditions/Race_Conditions.md`

### Example

```js
// ❌ BROKEN — race condition on stock
app.post('/products/:id/purchase', async (req, res) => {
  const product = await Product.findById(req.params.id); // READ: stock = 10

  if (product.stock < 1) {
    return res.status(400).json({ error: 'Out of stock' });
  }

  product.stock -= 1;         // MODIFY in memory
  await product.save();       // WRITE back — another request may have already written

  res.json({ success: true });
});
```

### Solution

**Solution 1 — Atomic operation (simplest fix):**

Let the database do the math in one command. No read/write gap.

```js
// ✅ FIXED — atomic findOneAndUpdate with condition
app.post('/products/:id/purchase', async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, stock: { $gt: 0 } }, // only match if stock is still > 0
    { $inc: { stock: -1 } },                    // decrement atomically
    { new: true }
  );

  if (!product) {
    return res.status(400).json({ error: 'Out of stock' });
  }

  res.json({ success: true, stock: product.stock });
});
```

**Solution 2 — Optimistic locking (for complex logic):**

Read the document with its version (`__v`). If another request updated it before you save, Mongoose throws a `VersionError` — you catch it and retry.

```js
// Schema — enable optimistic concurrency
const productSchema = new mongoose.Schema({
  name:  String,
  stock: Number,
}, { optimisticConcurrency: true }); // Mongoose checks __v on every save()
```

```js
// ✅ FIXED — optimistic locking with retry
app.post('/products/:id/purchase', async (req, res) => {
  const MAX_RETRIES = 3;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const product = await Product.findById(req.params.id);
      if (product.stock < 1) return res.status(400).json({ error: 'Out of stock' });

      product.stock -= 1;
      await product.save(); // throws VersionError if __v changed since we read

      return res.json({ success: true });
    } catch (err) {
      if (err.name === 'VersionError' && attempt < MAX_RETRIES - 1) continue; // retry
      throw err;
    }
  }

  res.status(409).json({ error: 'Could not complete purchase, please try again' });
});
```

### When to use each solution

| Solution | When to use it |
|---|---|
| **Atomic `findOneAndUpdate`** | Default choice for simple check-then-update operations (stock, seats, counters). One DB call, zero overhead. |
| **Optimistic locking** | Use when the logic between read and write is complex and cannot be expressed in a single query condition. Conflicts are expected to be rare. |
| **Transaction** | Use when the operation involves multiple documents that must all succeed or fail together (e.g., deduct stock AND create an order). See `deadlocks.md` and `BackEnd/2. Express/15_Transactions`. |
