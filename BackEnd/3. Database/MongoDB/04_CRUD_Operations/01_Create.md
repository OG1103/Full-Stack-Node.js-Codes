# Mongoose — Create Operations

Three ways to create documents in MongoDB with Mongoose: `Model.create()`, `Model.insertMany()`, and `new Model() + save()`.

---

## 1. `Model.create()` — Create One or More Documents

The most common way to create documents. Runs validation and middleware.

### Single Document

```javascript
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  age: 28,
});

console.log(user._id);   // ObjectId
console.log(user.name);  // 'John Doe'
```

### Multiple Documents

```javascript
const users = await User.create([
  { name: 'Alice', email: 'alice@example.com', age: 25 },
  { name: 'Bob', email: 'bob@example.com', age: 30 },
  { name: 'Charlie', email: 'charlie@example.com', age: 22 },
]);

console.log(users.length);  // 3
```

### Behavior

- Runs **schema validation** on each document
- Triggers **pre/post `save` hooks** for each document
- Returns the created document(s) with `_id` and defaults populated
- If one document fails validation, **none are inserted** (when passing an array)

---

## 2. `new Model() + save()` — Two-Step Creation

Useful when you need to **manipulate the document** before saving:

```javascript
const user = new User({
  name: 'John Doe',
  email: 'john@example.com',
});

// Modify before saving
user.role = 'admin';
user.metadata = { source: 'manual' };

// Save to database
await user.save();

console.log(user._id);    // Now has an _id
console.log(user.isNew);  // false (after save)
```

### Difference from `create()`

```javascript
// Model.create() is essentially:
const doc = new Model(data);
await doc.save();
return doc;
```

Both trigger the same validation and hooks. Use `new Model() + save()` when you need to:
- Set fields conditionally before saving
- Access `isNew` before the save
- Attach data that isn't in the initial object

---

## 3. `Model.insertMany()` — Bulk Insert (High Performance)

Optimized for inserting many documents at once:

```javascript
const products = await Product.insertMany([
  { name: 'Laptop', price: 999, category: 'Electronics' },
  { name: 'Shirt', price: 29, category: 'Clothing' },
  { name: 'Book', price: 15, category: 'Education' },
  // ... hundreds of documents
]);
```

### Key Differences from `create()`

| Feature | `create()` | `insertMany()` |
|---------|-----------|----------------|
| Validation | Yes | Yes (by default) |
| `save` hooks | Yes (per document) | **No** |
| Performance | Slower (one at a time) | Faster (bulk operation) |
| Partial insert | All fail if one fails | Can configure `ordered: false` |
| Return value | Array of documents | Array of documents |

### Options

```javascript
await Product.insertMany(
  [
    { name: 'Laptop', price: 999 },
    { name: 'Invalid', price: -1 },    // Fails validation
    { name: 'Phone', price: 599 },
  ],
  {
    ordered: false,       // Continue inserting even if some fail
    rawResult: true,      // Return raw MongoDB result
  }
);
```

**`ordered: false`** — MongoDB inserts all valid documents and reports errors for invalid ones, instead of stopping at the first failure.

### Skipping Validation

```javascript
// Not recommended, but available for trusted data
await Product.insertMany(docs, { validateBeforeSave: false });
```

---

## 4. Handling Creation Errors

### Validation Errors

```javascript
try {
  await User.create({ name: '', email: 'invalid' });
} catch (err) {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    console.log('Validation failed:', messages);
  }
}
```

### Duplicate Key Errors

```javascript
try {
  await User.create({ email: 'existing@email.com' });
} catch (err) {
  if (err.code === 11000) {
    console.log('Duplicate key:', err.keyValue);
    // { email: 'existing@email.com' }
  }
}
```

---

## 5. Practical Patterns

### Create with Reference

```javascript
// Create a post linked to a user
const post = await Post.create({
  title: 'My First Post',
  body: 'Hello world!',
  author: user._id,   // Reference to an existing user
});
```

### Create with Subdocuments

```javascript
const order = await Order.create({
  customer: userId,
  items: [
    { product: productId1, quantity: 2, price: 29.99 },
    { product: productId2, quantity: 1, price: 49.99 },
  ],
  total: 109.97,
});
```

### Upsert (Create or Update)

```javascript
const user = await User.findOneAndUpdate(
  { email: 'john@example.com' },      // Filter
  { name: 'John', age: 28 },          // Update
  { upsert: true, new: true }         // Create if not found, return new doc
);
```

---

## 6. Summary

| Method | Hooks | Validation | Performance | Use Case |
|--------|-------|-----------|-------------|----------|
| `Model.create()` | Yes | Yes | Normal | Standard creation |
| `new Model().save()` | Yes | Yes | Normal | Pre-save manipulation |
| `Model.insertMany()` | No | Yes | Fast | Bulk inserts |

### Key Points

1. `create()` is shorthand for `new Model() + save()`
2. `insertMany()` is faster but **skips `save` hooks**
3. Both `create()` and `insertMany()` run **validation**
4. Use `ordered: false` with `insertMany()` to continue past failures
5. Handle duplicate key errors separately (code `11000`)
