# MongoDB $group & Accumulators — Deep Notes

---

## 1. Overview

`$group` collapses many documents into fewer documents by grouping them on a shared key, then computing aggregate values (sum, average, max, min, etc.) across each group. It solves the problem of answering questions like "what is the total revenue per category?" or "how many orders did each customer place?" — which regular `find()` queries cannot answer.

**Why aggregation `$group` instead of application-level grouping?**
- Processing happens on the database server — no need to transfer all documents to Node.js
- Accumulators can handle millions of documents in a single pass
- Expressions inside accumulators can perform math, dates, conditionals before accumulating

---

## 2. Stage-by-Stage Breakdown

### `$group` — The Core Stage

```javascript
{
  $group: {
    _id: <grouping expression>,           // Required — defines the group key
    outputField1: { <accumulator>: <expression> },
    outputField2: { <accumulator>: <expression> },
  }
}
```

**`_id` rules:**
- `_id: '$fieldName'` — group by one field
- `_id: { key1: '$field1', key2: '$field2' }` — group by multiple fields (compound key)
- `_id: null` — aggregate the entire collection as one group (no grouping)
- `_id: { $year: '$createdAt' }` — group by expression result

**What position matters:**
- `$group` must come AFTER `$match` (if filtering original fields) and AFTER `$unwind` (if grouping on array elements)
- `$group` must come BEFORE any `$sort`, `$limit`, or `$project` that operate on the grouped output
- Any `$match` after `$group` can only reference the **output fields** of `$group` (`_id` and the accumulator fields), not the original document fields

**Performance implication:** `$group` requires MongoDB to hold documents in memory (or on disk with `allowDiskUse`) while it processes the entire input stream. It cannot produce output until it has seen every input document. This makes `$group` a "blocking" stage — always place `$match` before it to reduce input size.

---

### `$unwind` (used before `$group` for array analytics)

```javascript
{ $unwind: '$items' }
// Converts: { _id: 1, items: ['a', 'b', 'c'] }
// Into three docs: { _id: 1, items: 'a' }, { _id: 1, items: 'b' }, { _id: 1, items: 'c' }
```

Use `$unwind` before `$group` when you need to group on individual array elements:

```javascript
// Count occurrences of each tag across all posts
await Post.aggregate([
  { $unwind: '$tags' },           // One doc per tag
  { $group: { _id: '$tags', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]);
```

---

## 3. Data Flow — Step-by-Step

**Scenario:** Sales report by category from order items.

**Input documents (after `$unwind: '$items'`):**
```javascript
{ orderId: 1, status: 'completed', items: { category: 'Electronics', price: 200, quantity: 2 } }
{ orderId: 1, status: 'completed', items: { category: 'Clothing',    price: 50,  quantity: 3 } }
{ orderId: 2, status: 'completed', items: { category: 'Electronics', price: 150, quantity: 1 } }
{ orderId: 3, status: 'completed', items: { category: 'Clothing',    price: 80,  quantity: 2 } }
{ orderId: 4, status: 'completed', items: { category: 'Books',       price: 25,  quantity: 4 } }
```

**Pipeline:**
```javascript
await Order.aggregate([
  { $match: { status: 'completed' } },
  { $unwind: '$items' },
  {
    $group: {
      _id: '$items.category',
      totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      itemsSold: { $sum: '$items.quantity' },
      avgPrice: { $avg: '$items.price' },
      orderCount: { $sum: 1 },
    },
  },
  { $sort: { totalRevenue: -1 } },
]);
```

**After `$group`:**
```javascript
{ _id: 'Electronics', totalRevenue: 550, itemsSold: 3, avgPrice: 175, orderCount: 2 }
//   200*2 + 150*1 = 550; qty: 2+1=3; avg: (200+150)/2=175; count: 2 docs
{ _id: 'Clothing',    totalRevenue: 310, itemsSold: 5, avgPrice: 65,  orderCount: 2 }
//   50*3 + 80*2 = 310; qty: 3+2=5; avg: (50+80)/2=65; count: 2 docs
{ _id: 'Books',       totalRevenue: 100, itemsSold: 4, avgPrice: 25,  orderCount: 1 }
```

**After `$sort: { totalRevenue: -1 }`:**
```javascript
[
  { _id: 'Electronics', totalRevenue: 550, itemsSold: 3, avgPrice: 175, orderCount: 2 },
  { _id: 'Clothing',    totalRevenue: 310, itemsSold: 5, avgPrice: 65,  orderCount: 2 },
  { _id: 'Books',       totalRevenue: 100, itemsSold: 4, avgPrice: 25,  orderCount: 1 },
]
```

---

## 4. Operators Deep Dive

### `$sum` — Sum Values or Count Documents

**Full syntax:**
```javascript
// Sum a numeric field
{ fieldName: { $sum: '$numericField' } }

// Count documents in each group (sum 1 for each document)
{ count: { $sum: 1 } }

// Sum the result of an expression
{ totalRevenue: { $sum: { $multiply: ['$price', '$quantity'] } } }

// Sum with conditional
{ paidCount: { $sum: { $cond: ['$isPaid', 1, 0] } } }
```

**Return value:** Number. If the field is missing on some documents, those documents contribute 0 to the sum (no error).

**Edge cases:**
- If ALL documents in a group have missing field: sum is 0
- If the field is a string: ignored (contributes 0)
- If the field is an array: sum of array elements (if numeric)

---

### `$avg` — Arithmetic Mean

```javascript
{ averageRating: { $avg: '$rating' } }
{ avgOrderValue: { $avg: '$total' } }

// Average of a computed expression
{ avgRevenue: { $avg: { $multiply: ['$price', '$quantity'] } } }
```

**Return value:** Number (float). If all values are missing/null: returns `null`.

**Edge case:** Documents where the field is missing are **excluded** from the average calculation (not treated as 0). This is different from `$sum` behavior.

```javascript
// Group: { docs: [{rating: 5}, {rating: 3}, {}] }
// $avg: '$rating' → (5+3)/2 = 4  (missing field excluded)
// $sum: '$rating' → 5+3+0 = 8   (missing field treated as 0)
```

---

### `$max` / `$min` — Maximum / Minimum

```javascript
{ highestPrice: { $max: '$price' } }
{ lowestPrice:  { $min: '$price' } }
{ newestOrder:  { $max: '$createdAt' } }  // Works with dates too
{ oldestOrder:  { $min: '$createdAt' } }
```

**Return value:** The highest/lowest value in the group (respects type comparison: numbers < strings < objects < arrays).

**Edge cases:**
- If all values are missing: returns `null`
- Works on dates, strings, numbers

---

### `$push` — Collect All Values into Array

```javascript
{ orderTotals: { $push: '$total' } }
// Collects ALL values, including duplicates
// { _id: 'Alice', orderTotals: [100, 200, 100, 350] }

// Collect entire documents
{ allOrders: { $push: '$$ROOT' } }
// { _id: 'Alice', allOrders: [{_id:1, customer:'Alice', total:100, ...}, ...] }

// Collect a sub-object
{ items: { $push: { product: '$product', qty: '$quantity' } } }
```

**Return value:** Array (may contain duplicates, preserves insertion order).

**Edge cases:**
- If the expression is null/missing for a document: `null` is pushed into the array
- Memory concern: `$push` builds arrays in memory. Pushing `$$ROOT` (entire documents) across millions of records can exhaust memory. Use `allowDiskUse: true` if needed.

---

### `$$ROOT` — Reference to the Entire Input Document

`$$ROOT` is a system variable (double `$`) that refers to the complete document currently being processed:

```javascript
{ $push: '$$ROOT' }    // Collect complete documents
{ $first: '$$ROOT' }   // Get the first complete document in the group
```

```javascript
// Get the most expensive product per category (full document)
await Product.aggregate([
  { $sort: { price: -1 } },
  { $group: { _id: '$category', topProduct: { $first: '$$ROOT' } } },
]);
// topProduct contains the entire document object
```

---

### `$addToSet` — Unique Values Only

```javascript
{ uniqueCustomers: { $addToSet: '$customer' } }
// Like $push but deduplicates
// { _id: 'Electronics', uniqueCustomers: ['Alice', 'Bob', 'Carol'] }
// (each customer appears once regardless of how many Electronics orders they placed)
```

**Return value:** Array with no duplicates. Order is not guaranteed.

**Edge case:**
- `null` values: if multiple documents have a missing field, only one `null` is added to the set
- Different types: `1` (number) and `"1"` (string) are considered different values

**`$push` vs `$addToSet`:**
- `$push`: keeps all values including duplicates — use when you want the full list
- `$addToSet`: deduplicated — use when you want unique values (e.g., unique customers, unique tags)

---

### `$first` / `$last` — First or Last Value in Group

```javascript
// The order within a group depends on the sort BEFORE $group
{ firstOrder:  { $first: '$total' } }   // Total of the first doc in the group
{ latestOrder: { $first: '$total' } }   // If sorted by createdAt: -1, this is the newest
{ oldestOrder: { $last: '$total' } }    // The last doc in the group
```

**Critical rule:** `$first` and `$last` are meaningful ONLY when you sort BEFORE `$group`. Without a preceding `$sort`, the "first" document in each group is arbitrary (depends on storage order).

```javascript
// CORRECT — get each customer's most recent order total
await Order.aggregate([
  { $sort: { createdAt: -1 } },                                    // Newest first
  { $group: { _id: '$customer', latestTotal: { $first: '$total' } } }, // First = newest
]);

// WRONG — latestTotal is arbitrary without sort
await Order.aggregate([
  { $group: { _id: '$customer', latestTotal: { $first: '$total' } } },
]);
```

---

### `$count` Accumulator (MongoDB 5.0+)

```javascript
{ docCount: { $count: {} } }
// Equivalent to: { docCount: { $sum: 1 } }
// Newer syntax — cleaner intent
```

---

### Mathematical Expressions Inside Accumulators

These are expression operators (not accumulators themselves) but they can be nested inside any accumulator:

#### `$multiply`
```javascript
{ totalRevenue: { $sum: { $multiply: ['$price', '$quantity'] } } }
// Multiplies price × quantity for each doc, then sums across the group
```

#### `$divide`
```javascript
{ avgPricePerUnit: { $avg: { $divide: ['$totalPrice', '$quantity'] } } }
```

#### `$subtract`
```javascript
{ totalProfit: { $sum: { $subtract: ['$sellingPrice', '$costPrice'] } } }
```

#### `$year` / `$month` inside `_id` for time-based grouping
```javascript
{
  $group: {
    _id: {
      year:  { $year:  '$createdAt' },
      month: { $month: '$createdAt' },
    },
    revenue:    { $sum: '$total' },
    orderCount: { $sum: 1 },
  }
}
// Groups all orders from the same year+month into one record
```

#### `$cond` inside accumulators — Conditional Count
```javascript
{ activeCount: { $sum: { $cond: ['$isActive', 1, 0] } } }
// Counts only documents where isActive is truthy

{ premiumRevenue: { $sum: { $cond: [{ $eq: ['$tier', 'premium'] }, '$total', 0] } } }
// Sum total only for premium orders; non-premium contribute 0
```

---

## 5. Advanced Concepts

### Grouping by `null` — Whole-Collection Aggregation

```javascript
await Product.aggregate([
  {
    $group: {
      _id: null,             // No grouping — all docs form one group
      totalProducts: { $sum: 1 },
      averagePrice: { $avg: '$price' },
      maxPrice: { $max: '$price' },
      minPrice: { $min: '$price' },
      allCategories: { $addToSet: '$category' },
    },
  },
]);
// Returns ONE document with stats across the entire collection
// [{ _id: null, totalProducts: 150, averagePrice: 89.5, ... }]
```

### Compound Grouping Key

```javascript
{
  $group: {
    _id: {
      category: '$category',
      status: '$status',
    },
    count: { $sum: 1 },
  }
}
// Creates one group per unique (category, status) combination
// Access after: sort by '_id.category', filter by '_id.status'
```

To sort by a nested `_id` field, quote the dot-notation path:
```javascript
{ $sort: { '_id.year': 1, '_id.month': 1 } }
```

### Two-Stage `$match` Pattern

The first `$match` filters on original document fields. A second `$match` after `$group` filters on computed/accumulated fields:

```javascript
// Customers who placed 5+ orders AND spent over $500
await Order.aggregate([
  { $match: { status: 'completed' } },           // Stage 1: filter originals
  { $group: {
    _id: '$customer',
    orderCount: { $sum: 1 },
    totalSpent: { $sum: '$total' },
  }},
  { $match: { orderCount: { $gte: 5 }, totalSpent: { $gt: 500 } } }, // Stage 2: filter groups
]);
```

### Memory and Performance

- `$group` must consume the entire input before producing any output (blocking stage)
- Default memory limit: 100MB per pipeline stage
- For large datasets: add `.option({ allowDiskUse: true })`
- To reduce memory: always `$match` before `$group` to reduce input size
- `$project` before `$group` can also help: exclude fields you don't need in the accumulation

---

## 6. Use Cases

### Simple — Count Documents per Category
```javascript
await Product.aggregate([
  { $group: { _id: '$category', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]);
```

### Simple — Overall Collection Stats
```javascript
await Product.aggregate([
  {
    $group: {
      _id: null,
      total: { $sum: 1 },
      avgPrice: { $avg: '$price' },
      maxPrice: { $max: '$price' },
      minPrice: { $min: '$price' },
    },
  },
]);
```

### Intermediate — Monthly Sales Trend
```javascript
await Order.aggregate([
  { $match: { status: 'completed' } },
  {
    $group: {
      _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
      revenue: { $sum: '$total' },
      orders: { $sum: 1 },
      avgOrder: { $avg: '$total' },
    },
  },
  { $sort: { '_id.year': 1, '_id.month': 1 } },
]);
```

### Intermediate — Top 10 Customers
```javascript
await Order.aggregate([
  { $match: { status: 'completed' } },
  {
    $group: {
      _id: '$customer',
      totalSpent: { $sum: '$total' },
      orderCount: { $sum: 1 },
      avgOrderValue: { $avg: '$total' },
      lastOrder: { $max: '$createdAt' },
    },
  },
  { $sort: { totalSpent: -1 } },
  { $limit: 10 },
]);
```

### Advanced — User Activity by Role with Conditional Count
```javascript
await User.aggregate([
  {
    $group: {
      _id: '$role',
      total: { $sum: 1 },
      activeCount: { $sum: { $cond: ['$isActive', 1, 0] } },
      avgAge: { $avg: '$age' },
      names: { $push: '$name' },
      uniqueCities: { $addToSet: '$city' },
    },
  },
  {
    $addFields: {
      inactiveCount: { $subtract: ['$total', '$activeCount'] },
      activePercent: {
        $round: [{ $multiply: [{ $divide: ['$activeCount', '$total'] }, 100] }, 1],
      },
    },
  },
]);
```

### Advanced — Sales Report with Array Item Grouping
```javascript
await Order.aggregate([
  { $match: { status: 'completed' } },
  { $unwind: '$items' },
  {
    $group: {
      _id: '$items.category',
      totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      itemsSold: { $sum: '$items.quantity' },
      avgPrice: { $avg: '$items.price' },
      orderCount: { $sum: 1 },
    },
  },
  { $sort: { totalSales: -1 } },
]);
```

---

## 7. Common Mistakes

### 1. Filtering Original Fields AFTER `$group`
```javascript
// WRONG — 'status' doesn't exist after $group
await Order.aggregate([
  { $group: { _id: '$customer', total: { $sum: '$total' } } },
  { $match: { status: 'completed' } },  // Error or no results
]);

// CORRECT
await Order.aggregate([
  { $match: { status: 'completed' } },  // Filter before grouping
  { $group: { _id: '$customer', total: { $sum: '$total' } } },
]);
```

### 2. Using `$first`/`$last` Without Prior `$sort`
```javascript
// WRONG — result is arbitrary
await Order.aggregate([
  { $group: { _id: '$customer', latest: { $first: '$createdAt' } } },
]);

// CORRECT
await Order.aggregate([
  { $sort: { createdAt: -1 } },
  { $group: { _id: '$customer', latest: { $first: '$createdAt' } } },
]);
```

### 3. Referencing `$group` Output Fields Incorrectly
```javascript
// After $group, field names are exactly what you defined
await Order.aggregate([
  { $group: { _id: '$customer', totalSpent: { $sum: '$total' } } },
  { $sort: { total: -1 } },         // WRONG — field is 'totalSpent', not 'total'
  { $sort: { totalSpent: -1 } },    // CORRECT
]);
```

### 4. Forgetting Nested `_id` Access Requires Quotes
```javascript
// WRONG
{ $sort: { _id.year: 1 } }

// CORRECT — dot-notation in object keys must be quoted
{ $sort: { '_id.year': 1, '_id.month': 1 } }
```

### 5. Expecting `$sum: '$field'` to Count Documents
```javascript
// WRONG — this sums the 'price' field values, not document count
{ count: { $sum: '$price' } }

// CORRECT — to count docs, sum constant 1
{ count: { $sum: 1 } }

// CORRECT — to sum a field
{ totalRevenue: { $sum: '$total' } }
```

### 6. `$push: '$$ROOT'` Memory Blow-up
```javascript
// DANGEROUS on large collections
await Order.aggregate([
  { $group: { _id: '$status', allOrders: { $push: '$$ROOT' } } },
  // If 'completed' has 500k orders, the 'allOrders' array holds 500k full documents
]);

// SOLUTION — add allowDiskUse, or project only needed fields first
await Order.aggregate([
  { $project: { status: 1, total: 1, customer: 1 } },  // Reduce document size first
  { $group: { _id: '$status', allOrders: { $push: '$$ROOT' } } },
]).option({ allowDiskUse: true });
```

---

## 8. Quick Reference

### `$group` Accumulators

| Accumulator | Purpose | Returns | Null behavior |
|------------|---------|---------|---------------|
| `$sum` | Sum / Count | Number | Missing field → 0 |
| `$avg` | Average | Number or null | Missing field excluded from avg |
| `$max` | Maximum | Same type as input | All missing → null |
| `$min` | Minimum | Same type as input | All missing → null |
| `$push` | Collect all into array | Array | Missing → null pushed |
| `$addToSet` | Collect unique into array | Array (unordered) | One null per group max |
| `$first` | First value in group | Any | Needs prior `$sort` to be meaningful |
| `$last` | Last value in group | Any | Needs prior `$sort` to be meaningful |
| `$count` | Count docs (v5.0+) | Number | N/A |

### `$group` Expression Operators (for nesting inside accumulators)

| Operator | Syntax | Purpose |
|----------|--------|---------|
| `$multiply` | `{ $multiply: [a, b] }` | Multiply |
| `$divide` | `{ $divide: [a, b] }` | Divide |
| `$subtract` | `{ $subtract: [a, b] }` | Subtract |
| `$add` | `{ $add: [a, b] }` | Add |
| `$year` | `{ $year: '$date' }` | Extract year |
| `$month` | `{ $month: '$date' }` | Extract month |
| `$cond` | `{ $cond: [if, then, else] }` | Conditional value |
| `$$ROOT` | `$$ROOT` | Full document reference |

### `$group` `_id` Patterns

| Pattern | Example | Groups By |
|---------|---------|-----------|
| Single field | `'$category'` | Each unique category value |
| `null` | `null` | Entire collection as one group |
| Multiple fields | `{ year: { $year: '$date' }, month: { $month: '$date' } }` | Each year+month combination |
| Expression result | `{ $year: '$createdAt' }` | Each unique year |
