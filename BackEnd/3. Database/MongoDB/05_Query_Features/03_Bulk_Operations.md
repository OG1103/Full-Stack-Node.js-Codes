# Mongoose — Bulk Operations (bulkWrite)

`bulkWrite()` executes **multiple write operations** (inserts, updates, deletes) in a **single round trip** to MongoDB.

| Approach | 1000 updates |
|----------|--------------|
| 1000 individual `updateOne()` calls | ~1000 round trips |
| One `bulkWrite()` | 1 round trip |

**Trade-off:** it's fast because it bypasses Mongoose — **no save hooks, no validation by default**. Use it for trusted, high-volume operations (imports, syncs, batch updates).

---

## 1. Syntax

```javascript
const result = await Model.bulkWrite([
  { insertOne:  { document: { ... } } },
  { updateOne:  { filter: { ... }, update: { ... } } },
  { updateMany: { filter: { ... }, update: { ... } } },
  { deleteOne:  { filter: { ... } } },
  { deleteMany: { filter: { ... } } },
  { replaceOne: { filter: { ... }, replacement: { ... } } },
]);
```

Each array element is one operation wrapped in an object naming its type.

---

## 2. The Six Operations

```javascript
// insertOne — add a document
{ insertOne: { document: { name: 'New Product', price: 99 } } }

// updateOne — update first match (supports upsert)
{ updateOne: {
    filter: { _id: productId },
    update: { $set: { price: 89 } },
    upsert: false,          // optional: create if not found
} }

// updateMany — update all matches
{ updateMany: {
    filter: { category: 'Electronics' },
    update: { $inc: { price: -10 } },
} }

// deleteOne / deleteMany
{ deleteOne:  { filter: { _id: productId } } }
{ deleteMany: { filter: { inStock: false } } }

// replaceOne — replace the ENTIRE document (fields not listed are removed)
{ replaceOne: {
    filter: { _id: productId },
    replacement: { name: 'Updated', price: 149 },
    upsert: true,           // optional
} }
```

---

## 3. What It Returns

### On Full Success

```javascript
const result = await Product.bulkWrite([...]);

console.log(result);
// {
//   insertedCount: 1,
//   matchedCount: 5,     ← docs matched by update/replace filters
//   modifiedCount: 4,    ← docs actually changed
//   deletedCount: 2,
//   upsertedCount: 0,
//   insertedIds: { '0': ObjectId("...") },   ← keyed by operation index
//   upsertedIds: {},
// }
```

**Edge cases in the counts:**
- A filter matching nothing is NOT an error — it just contributes 0 to the counts. Verify `matchedCount`/`modifiedCount` against what you expected.
- `matchedCount > modifiedCount` means some updates were no-ops (values already equal).

### On Failure — `MongoBulkWriteError`

If any operation fails (most commonly a duplicate key), `bulkWrite` throws — but some operations may have already succeeded:

```javascript
try {
  await Product.bulkWrite(ops, { ordered: false });
} catch (err) {
  console.log(err.name);                    // 'MongoBulkWriteError'
  console.log(err.result.insertedCount);    // counts for what DID succeed
  console.log(err.writeErrors);             // one entry per failed op:
  err.writeErrors.forEach(e => {
    console.log(e.index);    // which operation in your array failed
    console.log(e.code);     // e.g. 11000 for duplicate key
    console.log(e.errmsg);   // human-readable reason
  });
}
```

---

## 4. `ordered` — Failure Behavior (the key option)

```javascript
await Model.bulkWrite(operations, { ordered: true });   // default
await Model.bulkWrite(operations, { ordered: false });
```

Given 5 operations where #3 fails:

| Option | Ops 1–2 | Op 3 (bad) | Ops 4–5 | Throws? |
|--------|---------|-----------|---------|---------|
| `ordered: true` (default) | Executed | Fails, stops | **Never attempted** | Yes |
| `ordered: false` | Executed | Skipped | **Executed** | Yes (after trying all) |

**In both cases, successful operations are NOT rolled back.** `bulkWrite` is not a transaction — for all-or-nothing semantics, run it inside a session with `withTransaction()`.

**Rule of thumb:** `ordered: false` for independent operations (imports, syncs) — it's also faster since MongoDB can parallelize. Keep `ordered: true` when later ops depend on earlier ones.

---

## 5. Practical Use Cases

### Cart Checkout — Atomic-ish Stock Decrement

```javascript
const ops = cartItems.map(item => ({
  updateOne: {
    // Condition IN the filter: only decrement if enough stock exists
    filter: { _id: item.productId, stock: { $gte: item.quantity } },
    update: { $inc: { stock: -item.quantity } },
  },
}));

const result = await Product.bulkWrite(ops);

if (result.modifiedCount !== cartItems.length) {
  // Some items were out of stock (their filters matched nothing)
  // NOTE: the other items WERE already decremented — you must compensate
  throw new Error('Some items are no longer available');
}
```

**Edge case:** each operation is individually atomic, but the batch is not. If 3 of 5 items succeed, those 3 decrements have happened. Either restore them on failure (compensation) or wrap the checkout in a transaction.

### Bulk Upsert from CSV / External Source

```javascript
const ops = csvRows.map(row => ({
  updateOne: {
    filter: { sku: row.sku },
    update: { $set: { price: row.price, name: row.name } },
    upsert: true,    // create rows that don't exist yet
  },
}));

const result = await Product.bulkWrite(ops, { ordered: false });
console.log(`Updated: ${result.modifiedCount}, Created: ${result.upsertedCount}`);
```

**Edge case (upsert race):** two concurrent bulk upserts on the same key can produce a duplicate-key error for the loser. With `ordered: false`, inspect `err.writeErrors` and retry just those as plain updates.

### Full Sync — Replace by External ID

```javascript
const ops = externalProducts.map(p => ({
  replaceOne: {
    filter: { externalId: p.id },
    replacement: { externalId: p.id, name: p.name, price: p.price, lastSynced: new Date() },
    upsert: true,
  },
}));

await Product.bulkWrite(ops, { ordered: false });
```

Remember `replaceOne` removes any field not in the replacement — fine for full syncs, wrong for partial updates (use `updateOne` + `$set` there).

---

## 6. Important Limitations

1. **No save hooks:** `pre('save')`/`post('save')` never run — password hashing, slug generation, etc. are skipped.
2. **No validation by default:** invalid data can be written. Mongoose does cast values to schema types (throwing `CastError` on impossible casts), but validators don't run.
3. **Not a transaction:** individual ops are atomic; the batch is not. Successful ops survive a mid-batch failure.
4. **`bulkWrite([])`** — an empty operations array throws an error in most driver versions; guard with a length check before calling.

```javascript
if (ops.length > 0) {
  await Model.bulkWrite(ops, { ordered: false });
}
```

For true all-or-nothing:

```javascript
const session = await mongoose.startSession();
await session.withTransaction(async () => {
  await Product.bulkWrite(ops, { session });
});
session.endSession();
```

---

## 7. Summary

| Operation | Purpose |
|-----------|---------|
| `insertOne` | Add a document |
| `updateOne` | Update first match (+ optional upsert) |
| `updateMany` | Update all matches |
| `deleteOne` | Delete first match |
| `deleteMany` | Delete all matches |
| `replaceOne` | Replace whole document (+ optional upsert) |

### Key Points

1. One round trip for many writes — the go-to for imports, syncs, and batch jobs.
2. **No hooks, no validation** — only use with trusted data.
3. `ordered: false` = try everything, report all failures; `ordered: true` (default) = stop at the first failure. Neither rolls back successes.
4. On failure, `err.writeErrors` tells you exactly which operations (by index) failed and why; `err.result` has the counts for what succeeded.
5. Filters that match nothing just contribute 0 to the counts — compare `matchedCount`/`modifiedCount` to expectations.
6. Guard against empty ops arrays, and use a transaction when partial success is unacceptable.
