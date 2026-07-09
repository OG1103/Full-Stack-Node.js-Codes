# Mongoose — Create Operations

Three ways to create documents: `Model.create()`, `new Model() + save()`, and `Model.insertMany()`.

**Quick decision guide:**

| Situation | Use |
|-----------|-----|
| Create one (or a few) documents normally | `Model.create()` |
| Build/modify a document before saving | `new Model()` + `save()` |
| Insert hundreds/thousands fast | `Model.insertMany()` |

---

## 1. `Model.create()` — Create One or More Documents

The standard way. Runs **validation** and **pre/post save hooks**.

### Single Document

```javascript
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  age: 28,
});

console.log(user._id);   // ObjectId — auto-generated
console.log(user.name);  // 'John Doe'
```

**What it returns:**

| Outcome | Result |
|---------|--------|
| Success | The full Mongoose document (with `_id`, defaults, and hook changes applied) |
| Validation fails | Throws `ValidationError` — **nothing is inserted** |
| Duplicate unique field | Throws `MongoServerError` with `code: 11000` — nothing is inserted |
| DB unreachable | Throws connection error (`MongooseServerSelectionError`) |

### Multiple Documents (array)

```javascript
const users = await User.create([
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' },
]);
// users → array of 2 documents
```

**Edge case — partial insert:** with an array, Mongoose saves documents **one by one**. If doc #2 fails validation, doc #1 is **already in the database** and is NOT rolled back:

```javascript
try {
  await User.create([
    { name: 'Alice', email: 'alice@example.com' },  // valid → inserted
    { name: 'Bob', email: 'not-an-email' },          // invalid → throws here
  ]);
} catch (err) {
  // Alice IS in the DB, Bob is not. No automatic rollback!
}
```

If you need all-or-nothing, use a transaction (session) or validate everything before creating.

---

## 2. `new Model() + save()` — Two-Step Creation

Use when you want to **modify the document before saving**:

```javascript
const user = new User({ name: 'John', email: 'john@example.com' });

console.log(user.isNew);  // true — not saved yet
console.log(user._id);    // ObjectId already exists! (generated in memory, NOT in DB yet)

user.role = 'admin';      // modify before saving

await user.save();
console.log(user.isNew);  // false — now in the database
```

**What `save()` returns:**

| Outcome | Result |
|---------|--------|
| Success | The saved document |
| Validation fails | Throws `ValidationError` — nothing written; you can fix the field and call `save()` again |
| Duplicate unique field | Throws error with `code: 11000` |

**Edge cases:**
- `_id` is created **in memory** the moment you call `new Model()` — having an `_id` does NOT mean the document exists in the DB yet.
- Calling `save()` twice on the same document does not create a duplicate — the second call is an update (same `_id`).

**`create()` vs `new + save()`:** they are equivalent — `create(data)` is literally `new Model(data)` then `save()`. Both run validation and hooks. Use `new + save()` only when you need the in-between step.

---

## 3. `Model.insertMany()` — Bulk Insert (Fast)

Sends **one bulk command** to MongoDB instead of one `save()` per document. Much faster for large batches.

```javascript
const products = await Product.insertMany([
  { name: 'Laptop', price: 999 },
  { name: 'Shirt', price: 29 },
  { name: 'Book', price: 15 },
]);
```

### Differences from `create()`

| Feature | `create()` | `insertMany()` |
|---------|-----------|----------------|
| Validation | Yes | Yes (by default) |
| `save` hooks | Yes (per document) | **No** |
| Speed | Normal | Fast (single round trip) |
| Failure behavior | Stops, earlier docs stay | Depends on `ordered` option |

### The `ordered` Option — What Happens on Failure

```javascript
await Product.insertMany(docs, { ordered: true });   // default
await Product.insertMany(docs, { ordered: false });
```

Given 3 docs where doc #2 is invalid:

| Option | Doc 1 | Doc 2 (bad) | Doc 3 | Error thrown? |
|--------|-------|-------------|-------|---------------|
| `ordered: true` (default) | Inserted | Fails, stops here | **Never attempted** | Yes |
| `ordered: false` | Inserted | Skipped | **Inserted** | Yes (after trying all) |

**Reading the error after a partial failure:**

```javascript
try {
  await Product.insertMany(docs, { ordered: false });
} catch (err) {
  console.log(err.insertedDocs.length);  // how many succeeded
  console.log(err.writeErrors);          // [{ index, code, errmsg }] — which ones failed and why
}
```

**Rule of thumb:** `ordered: false` for bulk imports (a few bad rows shouldn't block the rest); default `ordered: true` when order/dependency matters.

### Other Options

```javascript
await Product.insertMany(docs, {
  validateBeforeSave: false,  // skip validation — only for trusted data
  rawResult: true,            // return raw result ({ insertedCount, insertedIds }) instead of docs
});
```

---

## 4. Handling Creation Errors

### Validation Errors

```javascript
try {
  await User.create({ name: '', email: 'invalid' });
} catch (err) {
  if (err.name === 'ValidationError') {
    // err.errors is an object keyed by field name
    const messages = Object.values(err.errors).map(e => e.message);
    // ['Path `name` is required.', 'Invalid email format']
  }
}
```

### Duplicate Key Errors (unique index)

```javascript
try {
  await User.create({ email: 'existing@email.com' });
} catch (err) {
  if (err.code === 11000) {
    console.log(err.keyValue);  // { email: 'existing@email.com' } — which field clashed
  }
}
```

**Important:** a duplicate key error is **NOT** a `ValidationError` — it comes from the database, not the schema. Check `err.code === 11000` separately, or duplicate-email errors will slip past your validation handler:

```javascript
catch (err) {
  if (err.name === 'ValidationError') { /* schema problems */ }
  else if (err.code === 11000)        { /* duplicate — e.g. return 409 Conflict */ }
  else                                { /* unexpected — 500 */ }
}
```

---

## 5. Practical Patterns

### Create with a Reference

```javascript
const post = await Post.create({
  title: 'My First Post',
  author: user._id,   // reference to an existing user
});
```

**Edge case:** Mongoose does NOT check that `user._id` actually exists in the users collection. A broken reference saves fine — you'll only notice when `.populate('author')` returns `null` later.

### Upsert — Create If Not Found, Update If Found

```javascript
const user = await User.findOneAndUpdate(
  { email: 'john@example.com' },   // filter
  { name: 'John', age: 28 },       // update
  { upsert: true, new: true }      // create if missing, return the resulting doc
);
```

**Edge case (race condition):** if two requests upsert the same email at the same moment, one can fail with `code: 11000` even with `upsert: true`. Catch it and retry as a plain update.

---

## 6. Summary

| Method | Hooks | Validation | Speed | On failure |
|--------|-------|-----------|-------|-----------|
| `create()` | Yes | Yes | Normal | Throws; array form may leave earlier docs inserted |
| `new + save()` | Yes | Yes | Normal | Throws; nothing written, safe to retry |
| `insertMany()` | No | Yes | Fast | `ordered: true` stops; `ordered: false` skips bad docs |

### Key Points

1. `create()` = `new Model()` + `save()` — same validation, same hooks.
2. `insertMany()` is fastest but **skips save hooks**.
3. Creating an **array** with `create()` is not atomic — earlier docs stay if a later one fails.
4. Duplicate key (`code: 11000`) is a **database** error, not a `ValidationError` — handle both.
5. `new Model()` generates `_id` in memory — it doesn't mean the doc is saved.
6. References are not verified on create — a bad ObjectId ref saves without error.
