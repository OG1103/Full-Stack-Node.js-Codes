# MongoDB `$group` & Accumulators

`$group` collapses many documents into one per group, computing aggregates (sum, average, max, count...) across each group. It answers questions like "total revenue per category?" or "orders per customer?" that `find()` cannot.

```javascript
{
  $group: {
    _id: <grouping key>,                        // REQUIRED — what to group by
    outputField: { <accumulator>: <expression> }, // computed per group
  }
}
```

---

## 1. The `_id` Grouping Key

| Pattern | Example | Groups by |
|---------|---------|-----------|
| Single field | `_id: '$category'` | Each unique category |
| `null` | `_id: null` | Whole collection = one group |
| Multiple fields | `_id: { cat: '$category', status: '$status' }` | Each unique combination |
| Expression | `_id: { $year: '$createdAt' }` | Each unique year |

```javascript
// Count per category
await Product.aggregate([
  { $group: { _id: '$category', count: { $sum: 1 } } },
]);
// → [{ _id: 'Electronics', count: 12 }, { _id: 'Books', count: 7 }, ...]

// Whole-collection stats (one output doc)
await Product.aggregate([
  { $group: { _id: null, total: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
]);
// → [{ _id: null, total: 150, avgPrice: 89.5 }]

// Group by year + month
await Order.aggregate([
  { $group: {
      _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
      revenue: { $sum: '$total' },
  } },
  { $sort: { '_id.year': 1, '_id.month': 1 } },   // nested _id needs quoted dot-paths
]);
```

**Edge cases:**
- Grouping by a field that's missing on some docs → those docs form a group with `_id: null` (merged with actual-null values).
- After `$group`, the ONLY fields that exist are `_id` + your accumulators. Everything else is gone.
- On an empty input (nothing survived `$match`), `$group` outputs `[]` — even `_id: null` produces no document. `result[0]?.total ?? 0` is the safe read.

---

## 2. Accumulators — What Each Returns

| Accumulator | Purpose | Returns | Missing-field behavior |
|------------|---------|---------|------------------------|
| `$sum` | Sum / count | Number | Contributes **0** (never errors) |
| `$avg` | Average | Number or `null` | **Excluded** from the average (NOT counted as 0) |
| `$max` / `$min` | Extremes | Input type | All missing → `null` |
| `$push` | Collect all values | Array (with duplicates) | Pushes `null` |
| `$addToSet` | Collect unique values | Array (no duplicates, unordered) | At most one `null` |
| `$first` / `$last` | First/last doc's value | Any | **Arbitrary without a prior `$sort`!** |
| `$count: {}` | Count docs (v5+) | Number | Same as `$sum: 1` |

### `$sum` — Sum or Count

```javascript
{ totalRevenue: { $sum: '$total' } }        // sum a field
{ orderCount: { $sum: 1 } }                  // count docs (sum 1 per doc)
{ revenue: { $sum: { $multiply: ['$price', '$quantity'] } } }   // sum an expression
{ paidCount: { $sum: { $cond: ['$isPaid', 1, 0] } } }           // conditional count
```

**Edge case:** `{ count: { $sum: '$price' } }` sums prices — it does NOT count. To count, sum the constant `1`. Non-numeric values (strings) contribute 0 silently.

### `$avg` — the Missing-Field Difference

```javascript
// Group has docs: {rating: 5}, {rating: 3}, {no rating field}
{ $avg: '$rating' }   // (5+3)/2 = 4     — missing EXCLUDED
{ $sum: '$rating' }   // 5+3+0 = 8       — missing counts as 0
```

This asymmetry means `sum / count ≠ avg` when fields are missing — be deliberate about which you want.

### `$max` / `$min`

```javascript
{ highestPrice: { $max: '$price' } }
{ newestOrder: { $max: '$createdAt' } }    // works on dates and strings too
```

### `$push` / `$addToSet` — Collect Into Arrays

```javascript
{ orderTotals: { $push: '$total' } }              // all values, duplicates kept, order preserved
{ uniqueCustomers: { $addToSet: '$customer' } }   // deduplicated, order NOT guaranteed
{ items: { $push: { product: '$product', qty: '$quantity' } } }   // collect sub-objects
{ allDocs: { $push: '$$ROOT' } }                  // collect ENTIRE documents
```

**`$$ROOT`** is a system variable meaning "the whole current document":

```javascript
// Most expensive product per category — full doc
await Product.aggregate([
  { $sort: { price: -1 } },
  { $group: { _id: '$category', topProduct: { $first: '$$ROOT' } } },
]);
```

**Edge cases:**
- `$push: '$$ROOT'` on huge groups builds massive in-memory arrays — the classic aggregation memory blow-up. `$project` only the needed fields first, and/or use `allowDiskUse`.
- `$addToSet` treats `1` (number) and `'1'` (string) as different values.

### `$first` / `$last` — Sort First or Get Garbage

```javascript
// CORRECT — each customer's most recent order total
await Order.aggregate([
  { $sort: { createdAt: -1 } },                                       // sort FIRST
  { $group: { _id: '$customer', latestTotal: { $first: '$total' } } }, // first = newest
]);

// WRONG — no sort → "first" is whatever storage order gives you (arbitrary!)
await Order.aggregate([
  { $group: { _id: '$customer', latestTotal: { $first: '$total' } } },
]);
```

This is the most common silent-wrong-answer bug in `$group` — the query runs fine and returns plausible numbers that are simply not "the latest."

---

## 3. Expressions Inside Accumulators

Math/date/conditional operators nest inside any accumulator:

```javascript
{
  $group: {
    _id: '$category',
    revenue:  { $sum: { $multiply: ['$price', '$quantity'] } },
    profit:   { $sum: { $subtract: ['$sellingPrice', '$costPrice'] } },
    activeCount: { $sum: { $cond: ['$isActive', 1, 0] } },   // count only active
    premiumRevenue: {
      $sum: { $cond: [{ $eq: ['$tier', 'premium'] }, '$total', 0] },  // sum only premium
    },
  }
}
```

Date extraction in the grouping key:

```javascript
_id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }
// $month → 1–12, $year → e.g. 2024, $dayOfWeek → 1 (Sun) – 7 (Sat)
// Edge case: null/missing dates → these operators return null, no error
```

---

## 4. `$unwind` Before `$group` — Array Analytics

To group on individual **array elements**, unwind first (one doc per element):

```javascript
// Count tag usage across all posts
await Post.aggregate([
  { $unwind: '$tags' },                              // { tags: ['a','b'] } → 2 docs
  { $group: { _id: '$tags', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]);
```

Full sales-report pattern:

```javascript
await Order.aggregate([
  { $match: { status: 'completed' } },
  { $unwind: '$items' },                             // one doc per order item
  { $group: {
      _id: '$items.category',
      totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      itemsSold: { $sum: '$items.quantity' },
      avgPrice: { $avg: '$items.price' },
  } },
  { $sort: { totalRevenue: -1 } },
]);
```

(Unwind edge cases — empty/missing arrays get **dropped** by default — are covered in `04_Lookup_And_Joins.md`.)

---

## 5. Two-Stage `$match` — Filtering on Aggregated Values

First `$match` filters original fields; a **second** `$match` after `$group` filters on the computed results:

```javascript
// Customers with 5+ completed orders AND over $500 spent
await Order.aggregate([
  { $match: { status: 'completed' } },                    // filter originals
  { $group: {
      _id: '$customer',
      orderCount: { $sum: 1 },
      totalSpent: { $sum: '$total' },
  } },
  { $match: { orderCount: { $gte: 5 }, totalSpent: { $gt: 500 } } },   // filter groups
]);
```

This is the aggregation equivalent of SQL's `HAVING`.

---

## 6. Performance Notes

- `$group` is a **blocking stage** — it must see ALL input before emitting anything. Always `$match` first to shrink the input.
- 100MB per-stage memory limit → `.option({ allowDiskUse: true })` for big groups.
- `$project` away large unused fields *before* `$group` when pushing `$$ROOT` or grouping huge docs.

---

## 7. Summary

### Common Mistakes

```javascript
// 1. Filtering original fields AFTER $group — they no longer exist → silently []
{ $group: {...} }, { $match: { status: 'completed' } }   // WRONG ORDER

// 2. $first/$last without a prior $sort → arbitrary results, no error

// 3. Wrong field name after $group — outputs are EXACTLY what you named
{ $group: { _id: '$customer', totalSpent: {...} } },
{ $sort: { total: -1 } }        // WRONG — field is 'totalSpent'

// 4. Nested _id sort needs quotes
{ $sort: { '_id.year': 1 } }    // correct — unquoted _id.year is a JS syntax error

// 5. { $sum: '$price' } does NOT count docs — { $sum: 1 } does
```

### Key Points

1. `_id` is required; `_id: null` = aggregate the entire collection into one doc.
2. After `$group`, only `_id` + accumulator fields exist.
3. `$sum` treats missing as 0; `$avg` excludes missing — different denominators.
4. `$first`/`$last` are meaningless without a `$sort` immediately before the `$group`.
5. `$push` keeps duplicates; `$addToSet` dedupes (and loses order).
6. Empty input → `$group` outputs `[]`, even with `_id: null` — read results with `result[0]?.field ?? fallback`.
7. Second `$match` after `$group` = SQL `HAVING`.
