# Mongoose — Query Filters & Operators

Filters define **which documents** match in find, update, and delete operations. Same operators work everywhere a filter is accepted.

**General behavior:** a filter that matches nothing is never an error — you get `[]` / `null` / counts of 0. Errors come from **malformed filters** (invalid operators, values that can't be cast to the schema type → `CastError`).

---

## 1. Comparison Operators

```javascript
await User.find({ age: { $eq: 25 } });   // equal (same as { age: 25 })
await User.find({ status: { $ne: 'banned' } });   // not equal

await Product.find({ price: { $gt: 100 } });    // >
await Product.find({ price: { $gte: 100 } });   // >=
await Product.find({ stock: { $lt: 10 } });     // <
await Product.find({ stock: { $lte: 10 } });    // <=
```

### Range Queries (combine on one field)

```javascript
// Price between 50 and 200 inclusive
await Product.find({ price: { $gte: 50, $lte: 200 } });

// Date range — all of January 2024
await Order.find({
  createdAt: { $gte: new Date('2024-01-01'), $lt: new Date('2024-02-01') },
});
```

### Edge Cases

- **`$ne` also matches missing fields:** `{ status: { $ne: 'banned' } }` matches docs that have no `status` field at all.
- **Comparing to `null`:** `{ phone: null }` matches docs where `phone` is `null` **AND** docs where `phone` doesn't exist. To match only real nulls: `{ phone: { $eq: null, $exists: true } }`.
- **Type matters:** `{ age: '25' }` (string) will not match `age: 25` (number) in raw MongoDB — Mongoose usually saves you by casting to the schema type, but only if the field is in the schema. A value that can't be cast throws `CastError`.
- **Comparisons skip missing fields:** `{ price: { $lt: 100 } }` does NOT match docs with no `price` field — missing ≠ 0.

---

## 2. Logical Operators

### `$and` — All Conditions Must Match

```javascript
// Implicit AND — just list conditions (preferred, simpler)
await Product.find({ price: { $gte: 100 }, category: 'Electronics' });

// Explicit $and — same thing
await Product.find({
  $and: [{ price: { $gte: 100 } }, { category: 'Electronics' }],
});
```

**When explicit `$and` is REQUIRED:** the same field with the same operator twice. This is a JavaScript issue — duplicate object keys silently overwrite:

```javascript
// BUG — JS keeps only the second 'tags' key; first condition silently lost
await Product.find({ tags: 'sale', tags: 'electronics' });

// CORRECT
await Product.find({ $and: [{ tags: 'sale' }, { tags: 'electronics' }] });
```

### `$or` — At Least One Must Match

```javascript
await User.find({ $or: [{ role: 'admin' }, { role: 'moderator' }] });

// Combined with other conditions (AND across, OR within):
await Product.find({
  isActive: true,                                        // AND
  $or: [{ price: { $lt: 50 } }, { rating: { $gte: 4.5 } }],
});
// Active AND (cheap OR highly rated)
```

### `$not` — Invert a Condition

```javascript
await Product.find({ price: { $not: { $gt: 100 } } });
// price NOT > 100 — includes docs with price <= 100 AND docs with NO price field!
```

**`$not` vs `$ne`/`$lte`:** `{ price: { $lte: 100 } }` requires the field to exist; `{ price: { $not: { $gt: 100 } } }` also matches docs missing the field. Different result sets.

### `$nor` — None Must Match

```javascript
await Product.find({
  $nor: [{ category: 'Electronics' }, { price: { $gt: 500 } }],
});
// NOT Electronics AND NOT expensive
```

### Empty-Array Edge Cases (important with dynamic filters)

| Expression | Matches |
|-----------|---------|
| `{ $and: [] }` | Throws an error in MongoDB (empty $and not allowed at top level in some versions) — avoid |
| `{ $or: [] }` | Throws `$or must be a nonempty array` |
| `{ $in: [] }` | **Nothing** (zero results) |
| `{ $nin: [] }` | **Everything** |

When building `$or` arrays dynamically, guard against pushing an empty array into the filter:

```javascript
const orConditions = [];
if (search) orConditions.push({ name: regex }, { description: regex });
if (orConditions.length > 0) filter.$or = orConditions;   // only add if non-empty
```

---

## 3. Element Operators

### `$exists` — Field Present or Not

```javascript
await User.find({ phone: { $exists: true } });    // has the field (even if null!)
await User.find({ phone: { $exists: false } });   // field completely absent
```

**Edge case:** `$exists: true` matches `phone: null` — existence is about the field being present, not having a value. "Has a real value" needs both: `{ phone: { $exists: true, $ne: null } }`.

### `$type` — Field Type Check

```javascript
await User.find({ age: { $type: 'string' } });   // find docs where age was saved as a string
// Common types: 'string', 'number', 'bool', 'object', 'array', 'date', 'null', 'objectId'
```

Useful for finding dirty data after schema changes.

---

## 4. Array Operators

### `$in` — Value Is One Of

```javascript
await User.find({ role: { $in: ['admin', 'moderator'] } });
```

**Edge case:** on an **array field**, `$in` matches if ANY element is in the list: `{ tags: { $in: ['sale'] } }` matches `tags: ['new', 'sale']`.

### `$nin` — Value Is None Of

```javascript
await User.find({ status: { $nin: ['banned', 'suspended'] } });
```

**Edge case:** `$nin` also matches docs where the field is **missing** entirely.

### `$all` — Array Contains ALL Values

```javascript
// Tagged with BOTH 'electronics' AND 'sale' (order doesn't matter)
await Product.find({ tags: { $all: ['electronics', 'sale'] } });
```

### `$size` — Exact Array Length

```javascript
await User.find({ hobbies: { $size: 3 } });   // exactly 3 hobbies
```

**Edge case:** `$size` only does exact matches — `{ $size: { $gt: 2 } }` is invalid. For ranges use `$expr`:

```javascript
await User.find({ $expr: { $gt: [{ $size: '$hobbies' }, 5] } });   // more than 5
```

### `$elemMatch` — One Element Matches ALL Conditions

```javascript
// At least one item has BOTH quantity > 5 AND price > 100
await Order.find({
  items: { $elemMatch: { quantity: { $gt: 5 }, price: { $gt: 100 } } },
});
```

**Why it exists — the subtle trap without it:**

```javascript
// WITHOUT $elemMatch: conditions can match on DIFFERENT elements!
await Order.find({ 'items.quantity': { $gt: 5 }, 'items.price': { $gt: 100 } });
// Matches an order where item A has quantity 6 and item B has price 150
// — even though NO single item satisfies both.
```

Use `$elemMatch` whenever multiple conditions must hold for the **same** array element.

---

## 5. Evaluation Operators

### `$regex` — Pattern Matching

```javascript
// Case-insensitive contains
await User.find({ name: { $regex: 'john', $options: 'i' } });

// Starts with 'A'
await User.find({ name: { $regex: /^A/ } });

// Shorthand
await User.find({ name: /john/i });
```

**Edge cases:**
- **Performance:** only anchored prefixes (`/^abc/`) can use an index. A leading wildcard (`/john/`) scans every document — slow on large collections; consider a text/search index instead.
- **User input must be escaped** — a search term like `a+b(` is an invalid/unintended regex. Escape special chars before building the pattern:

```javascript
const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
await User.find({ name: { $regex: escaped, $options: 'i' } });
```

- Unescaped user input can also create catastrophic patterns (ReDoS) that hang the query.

### `$expr` — Compare Fields to Each Other

Regular operators compare a field to a **literal**. `$expr` compares fields to **fields**:

```javascript
// Products that need restocking: stock < reorderLevel
await Product.find({ $expr: { $lt: ['$stock', '$reorderLevel'] } });

// Orders over budget
await Order.find({ $expr: { $gt: ['$total', '$budget'] } });
```

**Edge case:** field references inside `$expr` need the `$` prefix (`'$stock'`); without it you're comparing the literal string `'stock'`. `$expr` can't use indexes for most comparisons — fine for admin queries, be careful on hot paths.

### `$where` — JavaScript Expression (avoid)

```javascript
await User.find({ $where: function () { return this.firstName.length > this.lastName.length; } });
```

**Warning:** runs JS per document — full collection scan, no indexes, blocked on some hosted providers. Almost always replaceable by `$expr`. Avoid in production.

---

## 6. Geospatial Operators (brief)

```javascript
// Schema needs a 2dsphere index
storeSchema.index({ location: '2dsphere' });

// Stores within 5km of a point — [longitude, latitude] order!
await Store.find({
  location: {
    $near: {
      $geometry: { type: 'Point', coordinates: [-73.9857, 40.7484] },
      $maxDistance: 5000,   // meters
    },
  },
});
```

**Edge cases:** coordinates are `[lng, lat]` — reversing them is the classic geo bug (query "works" but returns wrong-hemisphere results). `$near` without a `2dsphere` index throws an error.

---

## 7. Building Dynamic Filters (API pattern)

```javascript
app.get('/api/products', async (req, res) => {
  const { category, minPrice, maxPrice, search, inStock } = req.query;

  const filter = {};

  if (category) filter.category = category;
  if (inStock === 'true') filter.inStock = true;   // query params are always strings!
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.name = { $regex: escaped, $options: 'i' };
  }

  const products = await Product.find(filter).sort({ createdAt: -1 }).limit(20);
  res.json(products);
});
```

**Edge cases to handle:**
- Query params are **strings**: `req.query.inStock` is `'true'`, not `true`; numbers need `Number()` — and check `isNaN` after converting.
- **Operator injection:** if you pass `req.query` values directly into a filter, a malicious client can send `?password[$ne]=x` and turn a string into an operator object. Whitelist fields and cast types explicitly (as above); never spread raw query objects into a filter.

---

## 8. Summary

| Category | Operator | Description | Key edge case |
|----------|----------|-------------|---------------|
| Comparison | `$eq`, `$ne` | Equal / not equal | `$ne` matches missing fields too |
| | `$gt`, `$gte`, `$lt`, `$lte` | Ranges | Missing fields never match |
| Logical | `$and` | All match | Required when same field appears twice |
| | `$or` | At least one | `$or: []` throws |
| | `$not` | Invert | Also matches missing fields |
| | `$nor` | None match | — |
| Element | `$exists` | Field present | `true` still matches `null` values |
| | `$type` | Type check | Good for finding dirty data |
| Array | `$in` / `$nin` | In / not in list | `$in: []` matches nothing; `$nin: []` matches all |
| | `$all` | Contains all | Order-independent |
| | `$size` | Exact length | No ranges — use `$expr` |
| | `$elemMatch` | One element matches all conditions | Without it, conditions match across elements |
| Evaluation | `$regex` | Pattern match | Escape user input; only `/^prefix/` uses indexes |
| | `$expr` | Field-to-field compare | Needs `$` prefix on field names |
| | `$where` | JS expression | Avoid — slow, unsafe |
| Geo | `$near`, `$geoWithin` | Location queries | `[lng, lat]` order; needs 2dsphere index |
