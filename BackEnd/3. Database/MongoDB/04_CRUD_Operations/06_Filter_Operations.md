# Mongoose — Filter Operations (Query Operators)

The filter object is the first argument to `find()`, `findOne()`, `updateOne()`, `deleteMany()`, etc. Plain key-value pairs mean equality; MongoDB's `$`-prefixed operators let you express comparisons, logic, array checks, and pattern matching.

**Quick reference — operator families:**

| Family | Operators | Purpose |
|--------|-----------|---------|
| Comparison | `$eq` `$ne` `$gt` `$gte` `$lt` `$lte` `$in` `$nin` | Compare a field's value |
| Logical | `$and` `$or` `$nor` `$not` | Combine multiple conditions |
| Element | `$exists` `$type` | Test field presence/type |
| Array | `$all` `$size` `$elemMatch` | Match against array fields |
| Evaluation | `$regex` `$expr` `$mod` | Pattern matching, computed comparisons |

---

## 1. Equality — Implicit `$eq`

```javascript
await User.find({ role: 'admin' });
// Same as:
await User.find({ role: { $eq: 'admin' } });
```

Plain `{ field: value }` is always shorthand for `$eq`. You only write `$eq` explicitly when it needs to sit alongside other operators on the same field.

---

## 2. Comparison Operators

```javascript
await Product.find({ price: { $gt: 100 } });              // price > 100
await Product.find({ price: { $gte: 100 } });              // price >= 100
await Product.find({ price: { $lt: 50 } });                // price < 50
await Product.find({ price: { $lte: 50 } });                // price <= 50
await Product.find({ price: { $ne: 0 } });                  // price != 0

// Range — combine on the same field
await Product.find({ price: { $gte: 50, $lte: 200 } });     // 50 <= price <= 200

// Match against a set of values
await User.find({ role: { $in: ['admin', 'moderator'] } }); // role is admin OR moderator
await User.find({ role: { $nin: ['banned', 'suspended'] } }); // role is neither
```

**Common real-world use — date range:**

```javascript
const startOfMonth = new Date(new Date().setDate(1));
await Order.find({
  createdAt: { $gte: startOfMonth, $lt: new Date() },
});
```

**Edge case:** `$in`/`$nin` expect an **array**, even for a single value: `{ role: { $in: ['admin'] } }`. Passing a bare string (`{ role: { $in: 'admin' } }`) throws a cast error.

---

## 3. Logical Operators

```javascript
// $or — matches if ANY condition is true
await User.find({
  $or: [{ role: 'admin' }, { isVerified: true }],
});

// $and — matches if ALL conditions are true (rarely needed — plain object already ANDs)
await User.find({
  $and: [{ age: { $gte: 18 } }, { age: { $lte: 65 } }],
});

// $nor — matches if NONE of the conditions are true
await User.find({
  $nor: [{ role: 'banned' }, { isActive: false }],
});

// $not — negates a single condition
await Product.find({
  price: { $not: { $gt: 100 } }, // NOT (price > 100)
});
```

**When you actually need `$and`:** only when combining multiple conditions on the **same field** that a plain object would overwrite:

```javascript
// ❌ WRONG — second $or silently overwrites the first (same key, object literal)
await User.find({
  $or: [{ role: 'admin' }, { role: 'editor' }],
  $or: [{ isActive: true }, { isVerified: true }], // overwrites the line above!
});

// ✅ CORRECT — $and lets both $or clauses coexist
await User.find({
  $and: [
    { $or: [{ role: 'admin' }, { role: 'editor' }] },
    { $or: [{ isActive: true }, { isVerified: true }] },
  ],
});
```

**Mixing filter fields with `$or` — implicit AND:**

```javascript
// isPublished AND (category is news OR category is tech)
await Post.find({
  isPublished: true,
  $or: [{ category: 'news' }, { category: 'tech' }],
});
```

---

## 4. Element Operators — `$exists` and `$type`

```javascript
await User.find({ deletedAt: { $exists: false } });   // field is absent (not soft-deleted)
await User.find({ avatarUrl: { $exists: true } });    // field is present (even if null)

await Product.find({ discount: { $type: 'number' } }); // field is specifically a number
```

**Edge case:** `$exists: true` matches a field set to `null` — presence, not truthiness. To exclude both missing *and* null values, combine with `$ne`:

```javascript
await User.find({ avatarUrl: { $exists: true, $ne: null } });
```

---

## 5. Array Operators — `$all`, `$size`, `$elemMatch`

```javascript
const postSchema = { tags: [String] };

// $all — array field must contain EVERY value listed (order doesn't matter)
await Post.find({ tags: { $all: ['node', 'mongodb'] } });

// $size — array field must have exactly this many elements
await Post.find({ tags: { $size: 3 } });

// Plain array match — matches if ANY element equals the value (implicit)
await Post.find({ tags: 'node' }); // matches docs where 'node' is anywhere in tags[]
```

**`$elemMatch` — multiple conditions on the SAME array element:**

```javascript
const orderSchema = {
  items: [{ product: String, qty: Number, price: Number }],
};

// ❌ WRONG — matches if ANY item has qty > 5 and ANY item (possibly a different one) has price > 100
await Order.find({ 'items.qty': { $gt: 5 }, 'items.price': { $gt: 100 } });

// ✅ CORRECT — both conditions must be true on the SAME array element
await Order.find({
  items: { $elemMatch: { qty: { $gt: 5 }, price: { $gt: 100 } } },
});
```

**Edge case:** without `$elemMatch`, multi-field conditions on array-of-objects can match "mix and match" across different elements — a subtle, easy-to-miss bug.

---

## 6. Regex — Pattern & Text Matching

```javascript
await User.find({ name: { $regex: 'john', $options: 'i' } }); // case-insensitive contains
await User.find({ name: /^john/i });                          // same thing, native JS regex

await User.find({ email: { $regex: '@gmail\\.com$' } });      // ends with @gmail.com
```

**Search-as-you-type pattern:**

```javascript
app.get('/users/search', async (req, res) => {
  const { q } = req.query;
  const users = await User.find({
    name: { $regex: q, $options: 'i' },
  }).select('name email').limit(20);
  res.json(users);
});
```

**Edge cases:**
- Unanchored regex (`$regex: q` with no `^`) cannot use an index efficiently — full collection scan on large tables. For real search, use a text index (`$text`) or a dedicated search engine (Atlas Search, Elasticsearch).
- User-supplied strings passed straight into `$regex` can break (or be abused) if they contain regex special characters (`.`, `*`, `(`). Escape untrusted input before building a regex from it.

---

## 7. `$expr` — Compare Two Fields on the Same Document

Normal filters compare a field to a fixed value. `$expr` lets you compare **two fields against each other**:

```javascript
// Find orders where amountPaid is less than amountDue (underpaid orders)
await Order.find({
  $expr: { $lt: ['$amountPaid', '$amountDue'] },
});
```

**Edge case:** `$expr` generally can't use indexes as efficiently as a direct field comparison — fine for admin/reporting queries, avoid it on hot request paths over large collections.

---

## 8. Combining Filters — A Realistic Example

```javascript
// GET /products?category=electronics&minPrice=50&maxPrice=500&search=phone&inStock=true
app.get('/products', async (req, res) => {
  const { category, minPrice, maxPrice, search, inStock } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (inStock === 'true') filter.stock = { $gt: 0 };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) filter.name = { $regex: search, $options: 'i' };

  const products = await Product.find(filter).select('name price stock category').lean();
  res.json(products);
});
```

**Building filters conditionally like this is the standard pattern** — only add a key to the filter object when the corresponding query param was actually provided. Never pass `undefined` as an operator value; omit the key entirely instead.

---

## 9. Summary

| Need | Operator |
|------|----------|
| Equal / not equal | `$eq` / `$ne` |
| Greater/less than (or equal) | `$gt` `$gte` `$lt` `$lte` |
| One of a set / none of a set | `$in` / `$nin` |
| Any / all / neither condition true | `$or` / `$and` / `$nor` |
| Negate a condition | `$not` |
| Field present / specific type | `$exists` / `$type` |
| Array contains all values / exact length | `$all` / `$size` |
| Multiple conditions on the same array element | `$elemMatch` |
| Text/pattern match | `$regex` |
| Compare two fields on the same doc | `$expr` |

### Key Points

1. Plain `{ field: value }` is shorthand for `$eq` — most filters never need explicit operators.
2. `$in`/`$nin` always take an array, even for one value.
3. Repeating the same top-level key (e.g. two `$or`s) silently overwrites the first — wrap both in `$and`.
4. `$exists: true` matches `null` values too; add `$ne: null` to require a real value.
5. Multi-field conditions on an array of objects need `$elemMatch`, or they can match across different array elements by mistake.
6. Unanchored `$regex` can't use an index — fine for small collections, use a text/search index at scale.
7. Build filter objects conditionally (only add keys for params that were actually provided) rather than passing `undefined` into an operator.
