# Mongoose — Bulk Operations (bulkWrite)

`bulkWrite()` executes **multiple write operations** (insert, update, delete) in a single command. It's more efficient than running individual operations because it sends everything to MongoDB in one round trip.

---

## 1. Syntax

```javascript
const result = await Model.bulkWrite([
  { insertOne: { document: { ... } } },
  { updateOne: { filter: { ... }, update: { ... } } },
  { updateMany: { filter: { ... }, update: { ... } } },
  { deleteOne: { filter: { ... } } },
  { deleteMany: { filter: { ... } } },
  { replaceOne: { filter: { ... }, replacement: { ... } } },
]);
```

---

## 2. Available Operations

### `insertOne`

```javascript
{ insertOne: { document: { name: 'New Product', price: 99 } } }
```

### `updateOne`

```javascript
{
  updateOne: {
    filter: { _id: productId },
    update: { $set: { price: 89 } },
    upsert: false,  // Optional: create if not found
  }
}
```

### `updateMany`

```javascript
{
  updateMany: {
    filter: { category: 'Electronics' },
    update: { $inc: { price: -10 } },  // Discount all electronics by $10
  }
}
```

### `deleteOne`

```javascript
{
  deleteOne: {
    filter: { _id: productId },
  }
}
```

### `deleteMany`

```javascript
{
  deleteMany: {
    filter: { inStock: false },
  }
}
```

### `replaceOne`

```javascript
{
  replaceOne: {
    filter: { _id: productId },
    replacement: { name: 'Updated Product', price: 149, category: 'Tech' },
  }
}
```

---

## 3. Mixed Operations Example

```javascript
const result = await Product.bulkWrite([
  // Insert a new product
  {
    insertOne: {
      document: { name: 'Headphones', price: 79, category: 'Electronics' },
    },
  },
  // Update price of a specific product
  {
    updateOne: {
      filter: { name: 'Laptop' },
      update: { $set: { price: 1099 } },
    },
  },
  // Apply discount to all clothing
  {
    updateMany: {
      filter: { category: 'Clothing' },
      update: { $mul: { price: 0.9 } },  // 10% off
    },
  },
  // Delete out-of-stock items
  {
    deleteMany: {
      filter: { stock: 0, isActive: false },
    },
  },
]);

console.log(result);
// {
//   insertedCount: 1,
//   matchedCount: 5,
//   modifiedCount: 4,
//   deletedCount: 2,
//   upsertedCount: 0,
//   insertedIds: { '0': ObjectId("...") },
//   upsertedIds: {},
// }
```

---

## 4. Options

```javascript
const result = await Model.bulkWrite(operations, {
  ordered: true,   // Default: true — stops on first error
                   // false — continues executing remaining operations on error
});
```

### `ordered: true` (Default)

- Operations execute in order
- Stops at the first error
- Earlier operations that succeeded are NOT rolled back

### `ordered: false`

- Operations may execute in any order (better performance)
- Continues even if some operations fail
- Reports all errors at the end

---

## 5. Practical Use Cases

### Cart Checkout — Update Stock

```javascript
const checkoutOperations = cartItems.map(item => ({
  updateOne: {
    filter: { _id: item.productId, stock: { $gte: item.quantity } },
    update: { $inc: { stock: -item.quantity } },
  },
}));

const result = await Product.bulkWrite(checkoutOperations);

if (result.modifiedCount !== cartItems.length) {
  // Some items were out of stock
  throw new Error('Some items are no longer available');
}
```

### Bulk Price Update from CSV

```javascript
const priceUpdates = csvData.map(row => ({
  updateOne: {
    filter: { sku: row.sku },
    update: { $set: { price: row.newPrice } },
    upsert: true,  // Create if SKU doesn't exist
  },
}));

const result = await Product.bulkWrite(priceUpdates, { ordered: false });
console.log(`Updated: ${result.modifiedCount}, Created: ${result.upsertedCount}`);
```

### Sync External Data

```javascript
const syncOperations = externalProducts.map(product => ({
  replaceOne: {
    filter: { externalId: product.id },
    replacement: {
      externalId: product.id,
      name: product.name,
      price: product.price,
      lastSynced: new Date(),
    },
    upsert: true,
  },
}));

await Product.bulkWrite(syncOperations, { ordered: false });
```

---

## 6. Performance

| Approach | 1000 Updates |
|----------|-------------|
| Individual `updateOne()` calls | ~1000 round trips to DB |
| `bulkWrite()` | ~1 round trip to DB |

`bulkWrite()` is significantly faster for batch operations because it sends all operations in a single command.

---

## 7. Important Notes

1. **No hooks:** `bulkWrite()` does NOT trigger Mongoose middleware (pre/post hooks)
2. **No validation:** Schema validation is NOT run by default
3. **Atomicity:** Individual operations are atomic, but the batch as a whole is NOT a transaction
4. **For transactions:** Use MongoDB sessions with `startSession()` and `withTransaction()`

---

## 8. Summary

| Operation | Purpose |
|-----------|---------|
| `insertOne` | Add a new document |
| `updateOne` | Update one document |
| `updateMany` | Update multiple documents |
| `deleteOne` | Delete one document |
| `deleteMany` | Delete multiple documents |
| `replaceOne` | Replace entire document |

### Key Points

1. `bulkWrite()` sends multiple operations in **one database call**
2. `ordered: false` is faster but operations may execute in any order
3. **No Mongoose hooks or validation** — use for trusted, high-volume operations
4. Returns a result with `insertedCount`, `modifiedCount`, `deletedCount`, etc.
5. Use for batch imports, stock updates, data syncs, and cleanup tasks
