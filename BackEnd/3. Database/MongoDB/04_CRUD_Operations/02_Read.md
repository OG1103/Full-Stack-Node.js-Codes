# Mongoose — Read Operations (Find)

Methods to query and retrieve documents, plus the query helpers you chain onto them.

**Quick reference — what each returns:**

| Method | Success | No match | Bad input |
|--------|---------|----------|-----------|
| `find()` | Array of docs | `[]` (empty array) | Throws `CastError` |
| `findOne()` | Document | `null` | Throws `CastError` |
| `findById()` | Document | `null` | Throws `CastError` (malformed id) |
| `countDocuments()` | Number | `0` | Throws `CastError` |
| `distinct()` | Array of values | `[]` | Throws `CastError` |
| `exists()` | `{ _id }` | `null` | Throws `CastError` |

---

## 1. `find()` — Get Multiple Documents

```javascript
const users = await User.find();                       // all users
const active = await User.find({ isActive: true });    // with filter

const results = await User.find({
  age: { $gte: 18 },
  role: 'user',
});

// No match → empty array, NOT null and NOT an error
const none = await User.find({ name: 'nonexistent' }); // []
```

**Common bug:** checking `if (!results)` — an empty array is truthy! Check `results.length === 0` instead.

### Chaining Query Helpers

```javascript
const users = await User.find({ isActive: true })
  .select('name email')       // only these fields
  .sort({ createdAt: -1 })    // newest first
  .limit(10)
  .skip(20)
  .lean();                    // plain objects (faster)
```

**How execution works:** `find()` returns a **Query object**, not results. Nothing runs until you `await` it (or call `.exec()`). That's why you can keep chaining.

---

## 2. `findOne()` — Get a Single Document

Returns the **first** matching document, or `null`:

```javascript
const user = await User.findOne({ email: 'john@example.com' });

if (!user) {
  // handle not found — this check is mandatory, or the next line crashes
  return res.status(404).json({ error: 'User not found' });
}
console.log(user.name);
```

**Edge case — which doc is "first"?** Without `.sort()`, MongoDB returns whichever matching document it scans first — NOT guaranteed to be the oldest or newest. If it matters, sort explicitly:

```javascript
// "The customer's most recent order" — needs a sort to be correct
const latest = await Order.findOne({ customer: userId }).sort({ createdAt: -1 });
```

---

## 3. `findById()` — Get by ObjectId

Shorthand for `findOne({ _id: id })`:

```javascript
const user = await User.findById('64f1a2b3c4d5e6f7a8b9c0d1');
```

### The Two Failure Modes (important!)

```javascript
// 1. Valid-format ID that doesn't exist → returns null (no error)
const a = await User.findById('64f1a2b3c4d5e6f7a8b9c0d1');  // null

// 2. Malformed ID (not valid ObjectId format) → THROWS CastError
const b = await User.findById('abc123');  // throws!
```

These need different HTTP responses — the standard pattern:

```javascript
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Not found' });   // valid id, no doc
    res.json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid id format' });    // malformed id
    }
    throw err;  // real error → 500
  }
});
```

**Edge case:** `findById(undefined)` does NOT return `null` — it becomes `findOne({})` and returns the **first document in the collection**. Validate that the id param actually exists before querying.

---

## 4. `select()` — Field Selection (Projection)

```javascript
// Include only these fields (plus _id, always included by default)
await User.find().select('name email age');

// Exclude specific fields
await User.find().select('-password -__v');

// Object syntax: 1 = include, 0 = exclude
await User.find().select({ name: 1, email: 1, _id: 0 });
```

**Rules and edge cases:**
- **Cannot mix** include and exclude in one select — `select({ name: 1, password: 0 })` throws. Exception: `_id: 0` can be mixed with inclusions.
- If a schema field has `select: false` (e.g., password), it's omitted from ALL queries unless you explicitly re-include it with `+`:

```javascript
const user = await User.findOne({ email }).select('+password');
// Without '+password', user.password is undefined — classic login-bug
```

- If you exclude a ref field and then `.populate()` it, populate silently returns nothing (no error).

---

## 5. `sort()` — Order Results

```javascript
await User.find().sort({ age: 1 });                 // ascending
await User.find().sort({ createdAt: -1 });          // descending
await User.find().sort({ role: 1, name: -1 });      // multi-field
await User.find().sort('age -name');                // string syntax
```

**Edge cases:**
- **Ties are unstable:** documents with equal sort values can come back in different orders between queries. For pagination, always add a unique tiebreaker: `.sort({ createdAt: -1, _id: -1 })`.
- **Memory limit:** sorting a large collection on an unindexed field can throw `Sort exceeded memory limit` (100MB). Fix: add an index on the sort field.

---

## 6. `limit()` and `skip()` — Pagination

```javascript
await User.find().limit(10);            // first 10
await User.find().skip(20).limit(10);   // page 3 (10 per page)
```

**Edge cases:**
- `limit(0)` means **no limit** (returns everything) — NOT "zero results". Dangerous when the value comes from user input; validate first.
- Negative skip/limit values throw an error.
- `skip()` gets slow at large offsets (MongoDB scans and discards skipped docs). See `05_Query_Features/02_Pagination.md` for cursor-based pagination.

### Standard Pagination Pattern

```javascript
const page = 2, limit = 10;
const [data, total] = await Promise.all([
  User.find().sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit),
  User.countDocuments(),
]);
```

---

## 7. Counting — `countDocuments()` vs `estimatedDocumentCount()`

```javascript
await User.countDocuments();                        // exact count, all docs
await User.countDocuments({ isActive: true });      // exact count with filter

await User.estimatedDocumentCount();                // fast approximate count
```

| Method | Accepts filter? | Accuracy | Speed |
|--------|----------------|----------|-------|
| `countDocuments()` | Yes | Exact | Slower (scans/uses index) |
| `estimatedDocumentCount()` | **No** | Approximate (metadata) | Fast |

**Edge case:** `estimatedDocumentCount()` ignores any filter you pass and can be slightly stale right after bulk deletes. Never use it for pagination totals or filtered counts.

---

## 8. `lean()` — Plain JavaScript Objects (Performance)

By default queries return **Mongoose documents** (with `.save()`, virtuals, getters, change tracking). `.lean()` returns plain objects — significantly faster for large reads:

```javascript
const user = await User.findById(id).lean();
user.save();       // ERROR — not a function (plain object)
user.fullName;     // undefined — virtuals don't run on lean objects
```

| Use `lean()` | Don't use `lean()` |
|--------------|---------------------|
| Read-only API responses | You need `.save()` or instance methods |
| Large result sets | You rely on virtuals or getters |
| Performance-critical paths | You'll modify and persist the doc |

---

## 9. `distinct()` — Unique Values

```javascript
const roles = await User.distinct('role');
// ['admin', 'user', 'moderator']

const cities = await User.distinct('address.city', { isActive: true });
// unique cities, only from active users
```

**Edge cases:**
- On an **array field**, returns the flattened, deduplicated set of all elements: docs `{tags:['a','b']}` and `{tags:['b','c']}` → `['a','b','c']`.
- `null` and "field missing" both collapse into a single `null` entry.
- Full collection scan if the field isn't indexed — for big collections, prefer aggregation `$group`.

---

## 10. `exists()` — Check Existence Cheaply

```javascript
const hasAdmins = await User.exists({ role: 'admin' });
// Found → { _id: ObjectId(...) }
// Not found → null

if (hasAdmins) { ... }   // works — object is truthy
```

**Why use it:** stops at the first match and returns only `_id` — cheaper than `findOne()` (fetches whole doc) or `countDocuments() > 0` (may keep counting).

**Edge case:** it returns `{ _id }`, not `true`. So `hasAdmins === true` is always false — just use truthiness.

---

## 11. `where()` — Chainable Query Builder

Alternative syntax; identical behavior to a filter object:

```javascript
await User.find()
  .where('age').gte(18).lte(65)
  .where('role').in(['user', 'moderator']);

// Same as:
await User.find({ age: { $gte: 18, $lte: 65 }, role: { $in: ['user', 'moderator'] } });
```

---

## 12. Big Result Sets — `cursor()`

`find()` loads ALL matches into memory at once. For exports/migrations over huge collections, stream instead:

```javascript
const cursor = User.find({ isActive: true }).lean().cursor();

for await (const user of cursor) {
  await processUser(user);   // one doc in memory at a time
}
```

Without this, a query matching millions of docs can crash Node with out-of-memory.

---

## 13. Summary

### Key Points

1. `find()` returns `[]` on no match (truthy!) — check `.length`, not `if (!result)`.
2. `findOne()`/`findById()` return `null` on no match — always guard before accessing properties.
3. Malformed ObjectId **throws `CastError`**; valid-but-missing id returns `null` → respond 400 vs 404 accordingly.
4. `findById(undefined)` silently returns the first doc in the collection — validate params.
5. Fields with `select: false` need explicit `.select('+field')` to appear.
6. Always add `_id` as a sort tiebreaker when paginating.
7. `limit(0)` = unlimited, not zero.
8. Use `.lean()` for read-only speed; use `.cursor()` for huge result sets.
