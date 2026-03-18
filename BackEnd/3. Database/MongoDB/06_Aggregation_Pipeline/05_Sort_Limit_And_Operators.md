# MongoDB $sort, $limit, $skip & Pipeline Operators — Deep Notes

---

## 1. Overview

`$sort`, `$limit`, and `$skip` control the **ordering, quantity, and offset** of documents flowing through a pipeline. Combined with logical operators (`$and`, `$or`, `$not`, `$nor`, `$expr`), conditional operators (`$cond`, `$switch`, `$ifNull`), and mathematical operators, they enable sophisticated analytics — ranking, pagination, filtering by computed values, and multi-pipeline analytics via `$facet`. They solve the problem of controlling which results you get back and in what order, plus computing derived values and running complex expressions within a single aggregation.

---

## 2. Stage-by-Stage Breakdown

### `$sort` — Order Results

```javascript
{ $sort: { fieldName: 1 } }   // 1 = ascending (A→Z, 0→9, oldest→newest)
{ $sort: { fieldName: -1 } }  // -1 = descending (Z→A, 9→0, newest→oldest)
{ $sort: { field1: 1, field2: -1 } }  // Multi-field sort
```

**Two-phase sort behavior:**
- `$sort` BEFORE `$group`: can use indexes (fast); typically used when `$first`/`$last` need a specific order
- `$sort` AFTER `$group`: sorts in memory (slow for large datasets); no index available since document structure changed

**Position matters critically:**
- `$sort` must come BEFORE `$limit` — sorting after limiting gives you the sorted subset of an already-limited (arbitrary) set
- `$sort` before `$group` controls `$first`/`$last` accumulator behavior
- `$sort` at the end controls the final output order

**100MB memory limit:**
```javascript
// MongoDB aborts sorts exceeding 100MB in-memory
// Solution: allow disk spill
const result = await Model.aggregate([...]).option({ allowDiskUse: true });
```

**What breaks if removed:** Without `$sort` before `$limit`, the top N documents are arbitrary (storage order). Without `$sort` before `$group` when using `$first`/`$last`, those accumulators return arbitrary values.

---

### `$limit` — Restrict Document Count

```javascript
{ $limit: N }   // Stop passing documents after N have passed through
```

**Position matters critically:**
- Place `$limit` IMMEDIATELY after `$sort` to get the top/bottom N
- Place `$limit` BEFORE expensive stages (`$lookup`, `$unwind`) to ensure those stages only operate on the documents you'll actually use
- `$limit` after `$group` limits the number of groups in output

```javascript
// GOOD — limit before expensive lookup
await Product.aggregate([
  { $match: { category: 'Electronics' } },
  { $sort: { price: -1 } },
  { $limit: 10 },                        // Stop at 10 documents
  { $lookup: { from: 'reviews', ... } }, // Only 10 lookups happen
]);

// BAD — all documents joined, then limited
await Product.aggregate([
  { $match: { category: 'Electronics' } },
  { $lookup: { from: 'reviews', ... } }, // All Electronics joined (could be thousands)
  { $sort: { price: -1 } },
  { $limit: 10 },                        // Wasted: 990+ lookups thrown away
]);
```

---

### `$skip` — Skip N Documents

```javascript
{ $skip: N }   // Skip the first N documents; pass the rest through
```

**Must come after `$sort`** — without a sort, the "first N" to skip is arbitrary.

**Pagination pattern:**
```javascript
const page = 3;
const pageSize = 10;
const skip = (page - 1) * pageSize;   // Page 3: skip 20

await Order.aggregate([
  { $match: { status: 'completed' } },
  { $sort: { createdAt: -1 } },
  { $skip: skip },      // Skip already-seen pages
  { $limit: pageSize }, // Take one page
]);
```

**Performance degradation at large offsets:** `$skip: 10000` forces MongoDB to read and discard 10,000 documents before returning results. For cursor-based pagination (large datasets), use a `$match` on the last seen `_id` or timestamp instead:

```javascript
// Better than $skip for large offsets
await Order.aggregate([
  { $match: { status: 'completed', createdAt: { $lt: lastSeenDate } } },
  { $sort: { createdAt: -1 } },
  { $limit: 10 },
]);
```

---

### `$count` — Count Documents Reaching This Stage

```javascript
{ $count: 'outputFieldName' }
// Emits ONE document: { outputFieldName: <integer> }
```

```javascript
await Product.aggregate([
  { $match: { price: { $gt: 100 } } },
  { $count: 'expensiveProductCount' },
]);
// Result: [{ expensiveProductCount: 42 }]
```

**Position:** `$count` must be the last (or near-last) stage — it collapses all documents into one count document. No further per-document processing is possible after it.

**`$count` vs `countDocuments()`:**
- `countDocuments()` is faster for simple counting
- Use `$count` inside a pipeline (e.g., inside `$facet`) to count mid-pipeline results

---

### `$facet` — Multiple Sub-Pipelines on Same Input

```javascript
{
  $facet: {
    pipeline1Name: [ ...stages ],  // Runs on the docs entering $facet
    pipeline2Name: [ ...stages ],  // Runs on the same docs independently
    pipeline3Name: [ ...stages ],
  }
}
// Output: ONE document with one array field per named pipeline
// { pipeline1Name: [...results], pipeline2Name: [...results], ... }
```

**Key properties:**
- All sub-pipelines receive the SAME input documents that entered `$facet`
- Sub-pipelines run independently — changes in one don't affect others
- `$facet` cannot contain `$facet`, `$out`, `$indexStats` inside its sub-pipelines
- Output is always one document (with multiple arrays inside)

**Position:** Typically near the end of a pipeline, after `$match` and other filters have reduced the dataset. The input to `$facet` is the same for all sub-pipelines.

---

## 3. Data Flow — Step-by-Step

**Scenario:** Paginated product listing with metadata using `$facet`.

**Pipeline:**
```javascript
const page = 2;
const pageSize = 3;

await Product.aggregate([
  { $match: { inStock: true } },
  {
    $facet: {
      // Sub-pipeline 1: Paginated data
      data: [
        { $sort: { price: -1 } },
        { $skip: (page - 1) * pageSize },    // Skip: 3
        { $limit: pageSize },                 // Take: 3
        { $project: { name: 1, price: 1, category: 1 } },
      ],
      // Sub-pipeline 2: Total count for pagination UI
      totalCount: [
        { $count: 'count' },
      ],
      // Sub-pipeline 3: Category breakdown
      byCategory: [
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ],
      // Sub-pipeline 4: Price statistics
      priceStats: [
        {
          $group: {
            _id: null,
            avgPrice: { $avg: '$price' },
            maxPrice: { $max: '$price' },
            minPrice: { $min: '$price' },
          },
        },
      ],
    },
  },
]);
```

**Input (inStock products — 9 total):**
```javascript
{ name: 'Laptop', price: 1200, category: 'Electronics', inStock: true }
{ name: 'Phone',  price: 800,  category: 'Electronics', inStock: true }
{ name: 'Shirt',  price: 45,   category: 'Clothing',    inStock: true }
{ name: 'Pants',  price: 60,   category: 'Clothing',    inStock: true }
{ name: 'Book A', price: 20,   category: 'Books',       inStock: true }
{ name: 'Book B', price: 15,   category: 'Books',       inStock: true }
{ name: 'Tablet', price: 500,  category: 'Electronics', inStock: true }
{ name: 'Watch',  price: 300,  category: 'Accessories', inStock: true }
{ name: 'Belt',   price: 25,   category: 'Accessories', inStock: true }
```

**All 9 docs enter `$facet`. Each sub-pipeline processes all 9 independently.**

**`data` sub-pipeline result (page 2, sorted by price desc, skip 3, limit 3):**
```javascript
// Sorted: Laptop(1200), Phone(800), Tablet(500), Watch(300), Pants(60), Shirt(45), Belt(25), Book A(20), Book B(15)
// Skip 3: starts at Watch(300)
[
  { name: 'Watch', price: 300, category: 'Accessories' },
  { name: 'Pants', price: 60,  category: 'Clothing' },
  { name: 'Shirt', price: 45,  category: 'Clothing' },
]
```

**`totalCount` sub-pipeline result:**
```javascript
[{ count: 9 }]
```

**`byCategory` sub-pipeline result:**
```javascript
[
  { _id: 'Electronics', count: 3 },
  { _id: 'Clothing',    count: 2 },
  { _id: 'Books',       count: 2 },
  { _id: 'Accessories', count: 2 },
]
```

**`priceStats` sub-pipeline result:**
```javascript
[{ _id: null, avgPrice: 329.4, maxPrice: 1200, minPrice: 15 }]
```

**Final `$facet` output — ONE document:**
```javascript
{
  data:        [ /* 3 products */ ],
  totalCount:  [{ count: 9 }],
  byCategory:  [ /* 4 categories */ ],
  priceStats:  [{ _id: null, avgPrice: 329.4, maxPrice: 1200, minPrice: 15 }],
}
```

---

## 4. Operators Deep Dive

### Logical Operators (in `$match`)

#### `$and` — All Must Be True
```javascript
{ $match: { $and: [
  { category: 'Electronics' },
  { stock: { $gt: 0 } },
  { price: { $lt: 1000 } },
] } }

// When to use explicit $and vs implicit:
// Implicit $and (different fields — same as $and, shorter):
{ $match: { category: 'Electronics', stock: { $gt: 0 }, price: { $lt: 1000 } } }

// Explicit $and required when SAME FIELD appears twice:
{ $match: { $and: [{ price: { $gte: 100 } }, { price: { $lte: 500 } }] } }
// Cannot do: { price: { $gte: 100 }, price: { $lte: 500 } }
// (JavaScript silently drops the first 'price' key — duplicate key in object)
```

**Edge cases:**
- `$and: []` — empty array: matches all documents (vacuously true)
- `$and: [{}]` — array with empty object: matches all documents

#### `$or` — At Least One Must Be True
```javascript
{ $match: { $or: [
  { category: 'Electronics' },
  { price: { $gt: 1000 } },
] } }
// Electronics OR expensive products
```

**Edge case:**
- `$or: []` — empty array: matches NO documents (vacuously false)
- `$or` with one condition is valid but pointless — just use the condition directly

#### `$nor` — None Must Be True
```javascript
{ $match: { $nor: [
  { category: 'Electronics' },
  { price: { $gt: 500 } },
] } }
// Products that are NEITHER Electronics NOR expensive
// Equivalent to: NOT Electronics AND NOT (price > 500)
```

**Edge case:** `$nor: []` — empty array: matches all documents.

#### `$not` — Negate a Single Condition
```javascript
{ $match: { category: { $not: { $eq: 'Electronics' } } } }
// Products that are NOT Electronics

{ $match: { price: { $not: { $gte: 100 } } } }
// Products where price is NOT >= 100 (i.e., price < 100)

// $not also matches documents where the field is missing
// { category: { $not: { $eq: 'Electronics' } } } matches docs WITHOUT 'category' field too
```

**`$not` vs `$ne`:**
- `{ f: { $ne: v } }` — field exists but is not v
- `{ f: { $not: { $eq: v } } }` — field is not v OR field is missing

#### `$expr` — Expression-Based Comparison in `$match`
```javascript
// Field-to-field comparison (impossible without $expr)
{ $match: { $expr: { $gt: ['$sellingPrice', '$costPrice'] } } }
// Products where sellingPrice > costPrice

// Computed comparison
{ $match: { $expr: { $lt: ['$stock', { $divide: ['$price', 10] }] } } }
// Products where stock < price/10

// Date expression
{ $match: { $expr: { $gte: [{ $year: '$createdAt' }, 2024] } } }
// Documents from 2024 or later

// Using $in inside $expr
{ $match: { $expr: { $in: ['$category', ['Electronics', 'Clothing']] } } }
```

**When `$expr` is required vs when regular operators suffice:**
- Regular: `{ price: { $gte: 100 } }` — field vs literal value
- `$expr`: `{ $expr: { $gt: ['$price', '$minPrice'] } }` — field vs field

---

### Conditional Operators (`$project` / `$addFields`)

#### `$cond` — Binary If/Else
```javascript
// Object syntax (verbose, readable)
{
  $cond: {
    if: { $gt: ['$stock', 0] },
    then: 'In Stock',
    else: 'Out of Stock',
  }
}

// Array shorthand
{ $cond: [{ $gt: ['$stock', 0] }, 'In Stock', 'Out of Stock'] }

// Compute a value in then/else branches
{
  $cond: {
    if: '$isOnSale',
    then: { $multiply: ['$price', 0.8] },
    else: '$price',
  }
}
```

**Edge cases:**
- `if` evaluates `null`, `false`, `0`, `""`, missing field → takes `else` branch
- Both `then` and `else` must be present
- `if: '$booleanField'` — truthy if field is true, non-zero number, non-empty string, or non-null object

#### `$switch` — Multiple Branches
```javascript
{
  $switch: {
    branches: [
      { case: { $lte: ['$price', 25] },  then: 'Budget' },
      { case: { $lte: ['$price', 100] }, then: 'Standard' },
      { case: { $lte: ['$price', 500] }, then: 'Premium' },
    ],
    default: 'Luxury',
  }
}
```

**Edge cases:**
- Branches evaluate in order; FIRST matching case wins
- If no branch matches and `default` is absent → error
- If no branch matches and `default` is present → uses default

**`$cond` vs `$switch`:**
- `$cond`: two outcomes (if/else)
- `$switch`: 3+ distinct outcomes; more readable than nested `$cond`

#### `$ifNull` — Replace Null or Missing
```javascript
{ $ifNull: ['$description', 'No description'] }
// Only replaces null/missing — does NOT replace 0, false, or empty string

// Use $cond if you also want to handle 0, false, or ''
{ $cond: { if: '$fieldName', then: '$fieldName', else: 'default' } }
```

---

### Mathematical Operators

All work in `$project`, `$addFields`, `$group` (inside accumulators), and `$match` (via `$expr`):

#### `$add` / `$subtract`
```javascript
{ $add:      ['$price', '$tax'] }         // price + tax
{ $subtract: ['$total', '$discount'] }    // total - discount
// With dates: { $add: ['$date', 86400000] } adds 1 day (86,400,000 ms)
// Date subtraction: { $subtract: ['$end', '$start'] } → milliseconds
```

#### `$multiply` / `$divide`
```javascript
{ $multiply: ['$price', '$quantity'] }    // price × quantity
{ $multiply: ['$price', 1.1] }           // 10% markup
{ $divide:   ['$total', '$count'] }      // average
{ $divide:   ['$price', 100] }           // convert cents to dollars
// Edge case: $divide by 0 → null (no error thrown)
// Edge case: $divide by missing field → null
```

#### `$mod`
```javascript
{ $mod: ['$number', 2] }
// Returns remainder: 7 % 2 = 1; 8 % 2 = 0
// Use case: check even/odd: { $eq: [{ $mod: ['$id', 2] }, 0] }
```

#### `$abs`
```javascript
{ $abs: '$profit' }
// Returns absolute value: -50 → 50; 50 → 50
// Useful when profit can be negative (loss) and you want magnitude
```

#### `$ceil` / `$floor` / `$round`
```javascript
{ $ceil:  '$value' }               // 3.1 → 4;  -3.9 → -3
{ $floor: '$value' }               // 3.9 → 3;  -3.1 → -4
{ $round: ['$value', 2] }          // 10.999 → 11.00; 10.994 → 10.99
{ $round: ['$value', 0] }          // 10.5 → 11; 10.4 → 10 (banker's rounding)
{ $round: ['$value', -1] }         // 145 → 150 (round to nearest 10)
```

#### `$pow` / `$sqrt`
```javascript
{ $pow:  ['$base', 2] }    // base squared: 5² = 25
{ $pow:  [2, 10] }         // 2^10 = 1024
{ $sqrt: '$area' }         // √area; returns float
// Edge case: $sqrt of negative number → NaN
// Edge case: $sqrt of null/missing → null
```

---

### `allowDiskUse`

MongoDB limits each pipeline stage to **100MB of RAM**. `allowDiskUse` allows intermediate results to spill to disk:

```javascript
const result = await Model.aggregate([
  { $sort: { field: 1 } },       // Most likely to hit limit
  { $group: { ... } },           // Also can hit limit
]).option({ allowDiskUse: true });
```

**When to use:**
- Large dataset sorts (millions of documents)
- `$group` on high-cardinality fields
- `$push: '$$ROOT'` on large collections

**Cost:** Disk I/O is much slower than memory. Use `allowDiskUse` as a fallback, not a default.

---

## 5. Advanced Concepts

### Combining `$sort` + `$limit` for Top-N Queries

The `$sort` + `$limit` combination is a recognized optimization pattern. MongoDB internally uses a "top-N sort" that avoids sorting the entire collection:

```javascript
// MongoDB optimizes this to a heap-based top-5 sort
await Product.aggregate([
  { $match: { inStock: true } },
  { $sort: { rating: -1 } },
  { $limit: 5 },
]);
// Much faster than: sort all → return 5
```

### `$skip` + `$limit` Pagination vs Keyset Pagination

```javascript
// Offset pagination — simple but slow at high page numbers
const offsetPagination = async (page, size) => {
  return await Order.aggregate([
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * size },  // O(n) scan
    { $limit: size },
  ]);
};

// Keyset pagination — fast at any offset
const keysetPagination = async (lastCreatedAt, size) => {
  return await Order.aggregate([
    { $match: { createdAt: { $lt: lastCreatedAt } } },  // Uses index
    { $sort: { createdAt: -1 } },
    { $limit: size },
  ]);
};
```

### `$facet` for Search Results Page

A common pattern for e-commerce/search: get paginated results + filters + metadata in one query:

```javascript
await Product.aggregate([
  { $match: { inStock: true, price: { $lte: 1000 } } },
  {
    $facet: {
      results: [
        { $sort: { relevanceScore: -1 } },
        { $skip: 0 },
        { $limit: 20 },
        { $project: { name: 1, price: 1, category: 1, image: { $arrayElemAt: ['$images', 0] } } },
      ],
      totalCount: [{ $count: 'total' }],
      priceRanges: [
        {
          $bucket: {
            groupBy: '$price',
            boundaries: [0, 25, 100, 500, 1000],
            default: '1000+',
            output: { count: { $sum: 1 } },
          },
        },
      ],
      topCategories: [
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ],
    },
  },
]);
```

### Complex Calculation with Math + Conditional

```javascript
await Order.aggregate([
  { $group: {
    _id: '$customer',
    totalSpent: { $sum: '$total' },
    orderCount: { $sum: 1 },
  }},
  {
    $addFields: {
      // Average order value, rounded to 2 decimal places
      avgOrderValue: { $round: [{ $divide: ['$totalSpent', '$orderCount'] }, 2] },
      // Customer tier based on total spend
      customerTier: {
        $switch: {
          branches: [
            { case: { $gte: ['$totalSpent', 5000] }, then: 'Platinum' },
            { case: { $gte: ['$totalSpent', 1000] }, then: 'Gold' },
            { case: { $gte: ['$totalSpent', 500] },  then: 'Silver' },
          ],
          default: 'Bronze',
        },
      },
      // Flag high-value customers
      isHighValue: { $gte: ['$totalSpent', 1000] },
    },
  },
  { $sort: { totalSpent: -1 } },
]);
```

---

## 6. Use Cases

### Simple — Top 3 Most Expensive Products
```javascript
await Product.aggregate([
  { $sort: { price: -1 } },
  { $limit: 3 },
  { $project: { name: 1, price: 1 } },
]);
```

### Simple — Count Products Over $100
```javascript
await Product.aggregate([
  { $match: { price: { $gt: 100 } } },
  { $count: 'premiumProducts' },
]);
```

### Intermediate — Paginated Customer List (Page 3)
```javascript
const paginateCustomers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return await Order.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: '$customer', totalSpent: { $sum: '$total' }, orderCount: { $sum: 1 } } },
    { $sort: { totalSpent: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);
};
```

### Intermediate — Products Filtered by Logical Conditions
```javascript
// Products that are (Electronics OR Clothing) AND (in stock) AND NOT (price > 2000)
await Product.aggregate([
  {
    $match: {
      $and: [
        { $or: [{ category: 'Electronics' }, { category: 'Clothing' }] },
        { stock: { $gt: 0 } },
        { price: { $not: { $gt: 2000 } } },
      ],
    },
  },
  { $sort: { price: 1 } },
]);
```

### Advanced — Full Dashboard Query with `$facet`
```javascript
await Product.aggregate([
  {
    $facet: {
      byCategory: [
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ],
      priceStats: [
        { $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' },
        }},
      ],
      data: [
        { $sort: { createdAt: -1 } },
        { $skip: 0 },
        { $limit: 10 },
      ],
      totalCount: [{ $count: 'count' }],
    },
  },
]);
```

### Advanced — `$expr` for Field Comparison
```javascript
// Find products where current stock < reorderPoint
await Product.aggregate([
  { $match: { $expr: { $lt: ['$stock', '$reorderPoint'] } } },
  {
    $addFields: {
      deficit: { $subtract: ['$reorderPoint', '$stock'] },
      urgency: {
        $cond: {
          if: { $eq: ['$stock', 0] },
          then: 'Critical',
          else: 'Low',
        },
      },
    },
  },
  { $sort: { deficit: -1 } },
]);
```

---

## 7. Common Mistakes

### 1. Sorting AFTER Limiting
```javascript
// WRONG — limits 10 arbitrary docs, then sorts those 10
await Product.aggregate([
  { $limit: 10 },
  { $sort: { price: -1 } },   // Sorts 10 random docs, not top 10 by price
]);

// CORRECT — sort first, then take top 10
await Product.aggregate([
  { $sort: { price: -1 } },
  { $limit: 10 },
]);
```

### 2. Using `$skip` Without `$sort` (Non-Deterministic Pagination)
```javascript
// WRONG — without sort, different queries return different "pages"
await Order.aggregate([
  { $skip: 10 },
  { $limit: 10 },
]);

// CORRECT — always sort before skip for deterministic pagination
await Order.aggregate([
  { $sort: { createdAt: -1, _id: 1 } },  // _id as tiebreaker
  { $skip: 10 },
  { $limit: 10 },
]);
```

### 3. `$count` in the Wrong Position
```javascript
// WRONG — $count collapses everything; nothing useful can follow
await Product.aggregate([
  { $count: 'total' },
  { $match: { price: { $gt: 100 } } },  // Error or no results — only doc is { total: N }
]);

// CORRECT — $count after all filtering
await Product.aggregate([
  { $match: { price: { $gt: 100 } } },
  { $count: 'total' },
]);
```

### 4. Not Using `allowDiskUse` on Large Sorts
```javascript
// Error: "Exceeded memory limit for $sort stage" (100MB limit)
await Order.aggregate([
  { $sort: { createdAt: -1 } },  // Millions of orders
]);

// Fix:
await Order.aggregate([
  { $sort: { createdAt: -1 } },
]).option({ allowDiskUse: true });
```

### 5. Using `$or: []` (Matches Nothing)
```javascript
// WRONG — $or with empty array matches NO documents
{ $match: { $or: [] } }  // Returns zero results always

// $and with empty array matches ALL — opposite behavior
{ $match: { $and: [] } }  // Returns all documents
```

### 6. Forgetting `$expr` for Field-to-Field Comparison
```javascript
// WRONG — syntax error or always false
{ $match: { $gt: ['$sellingPrice', '$costPrice'] } }

// CORRECT
{ $match: { $expr: { $gt: ['$sellingPrice', '$costPrice'] } } }
```

### 7. `$switch` Without `default` When Null Values Exist
```javascript
// WRONG — null price matches no branch → error
{ $switch: { branches: [
  { case: { $lt: ['$price', 100] }, then: 'Cheap' },
  { case: { $gte: ['$price', 100] }, then: 'Expensive' },
] } }
// If price is null: $lt(null, 100) → false; $gte(null, 100) → false → no match → error

// CORRECT
{ $switch: { branches: [
  { case: { $lt: ['$price', 100] }, then: 'Cheap' },
  { case: { $gte: ['$price', 100] }, then: 'Expensive' },
], default: 'Unknown' } }
```

### 8. Expecting `$ifNull` to Replace `0` or `false`
```javascript
// $ifNull only replaces null/missing — NOT 0, false, or ''
{ $ifNull: ['$rating', 0] }
// rating: null → 0       ✓
// rating: 0    → 0       (kept — already 0, not null)
// rating: 5    → 5       ✓

// To also replace 0, use $cond:
{ $cond: { if: '$rating', then: '$rating', else: 0 } }
// rating: null → 0, rating: 0 → 0 (falsy), rating: 5 → 5
```

---

## 8. Quick Reference

### Ordering / Pagination Stages

| Stage | Syntax | Notes |
|-------|--------|-------|
| `$sort` | `{ $sort: { f: 1/-1 } }` | 1=asc, -1=desc; use before `$limit` |
| `$limit` | `{ $limit: N }` | Place early; combined with `$sort` for top-N |
| `$skip` | `{ $skip: N }` | Must follow `$sort`; slow at large N |
| `$count` | `{ $count: 'fieldName' }` | Terminal stage; emits one doc |
| `$facet` | `{ $facet: { name: [stages] } }` | Multiple independent pipelines |

### Logical Operators (in `$match`)

| Operator | True When | Empty Array Behavior |
|----------|-----------|---------------------|
| `$and` | ALL conditions true | `$and: []` → matches all |
| `$or` | ANY condition true | `$or: []` → matches none |
| `$nor` | NO condition true | `$nor: []` → matches all |
| `$not` | Condition is false | Field-level only |
| `$expr` | Expression evaluates truthy | Enables field comparisons |

### Conditional Operators

| Operator | Syntax | Use When |
|----------|--------|----------|
| `$cond` | `{ $cond: { if, then, else } }` | Binary (2 outcomes) |
| `$switch` | `{ $switch: { branches, default } }` | 3+ outcomes |
| `$ifNull` | `{ $ifNull: [expr, fallback] }` | Only null/missing replacement |

### Math Operators

| Operator | Syntax | Edge Case |
|----------|--------|-----------|
| `$add` | `{ $add: [a, b, ...] }` | Works on dates (ms) |
| `$subtract` | `{ $subtract: [a, b] }` | Date diff → ms |
| `$multiply` | `{ $multiply: [a, b, ...] }` | null arg → null |
| `$divide` | `{ $divide: [a, b] }` | /0 → null |
| `$mod` | `{ $mod: [a, b] }` | Remainder |
| `$abs` | `{ $abs: val }` | Absolute value |
| `$ceil` | `{ $ceil: val }` | Round up |
| `$floor` | `{ $floor: val }` | Round down |
| `$round` | `{ $round: [val, places] }` | Negative places = round to 10s |
| `$pow` | `{ $pow: [base, exp] }` | Exponentiation |
| `$sqrt` | `{ $sqrt: val }` | Negative → NaN |

### `allowDiskUse`

```javascript
await Model.aggregate([...]).option({ allowDiskUse: true });
// Allows pipeline to spill to disk when memory limit (100MB) is exceeded
// Use for: large sorts, large $group, $push: '$$ROOT' on big collections
```
