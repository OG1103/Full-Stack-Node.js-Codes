# Mongoose — $sort, $limit, $skip & Pipeline Operators

These stages control the **ordering, size, and logic** of your pipeline results. Combined with logical and mathematical operators, they enable sophisticated data analysis.

---

## 1. `$sort` — Order Results

### Syntax

```javascript
{ $sort: { field: 1 } }    // 1 = ascending, -1 = descending
```

### Basic Sorting

```javascript
// Sort by price ascending
const result = await Product.aggregate([
  { $sort: { price: 1 } },
]);

// Sort by price descending
const result = await Product.aggregate([
  { $sort: { price: -1 } },
]);
```

### Sort by Multiple Fields

```javascript
const result = await Product.aggregate([
  { $sort: { category: 1, price: -1 } },
  // Sort by category A→Z, then by price highest→lowest within each category
]);
```

### Sort After Grouping

```javascript
// Top 5 categories by total revenue
const result = await Order.aggregate([
  { $unwind: '$items' },
  {
    $group: {
      _id: '$items.category',
      totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
    },
  },
  { $sort: { totalRevenue: -1 } },  // Sort grouped results
  { $limit: 5 },
]);
```

### Performance Note

`$sort` before `$group` can use indexes. `$sort` after `$group` sorts in memory, which can be expensive for large datasets. MongoDB has a **100MB memory limit** for sort operations. For larger sorts, allow disk use:

```javascript
const result = await Model.aggregate([...]).option({ allowDiskUse: true });
```

---

## 2. `$limit` — Restrict Result Count

```javascript
// Get top 3 most expensive products
const result = await Product.aggregate([
  { $sort: { price: -1 } },
  { $limit: 3 },
]);
```

### Placement Matters

Place `$limit` as early as possible to reduce the number of documents processed by later stages:

```javascript
// GOOD — limits early
const result = await Product.aggregate([
  { $match: { category: 'Electronics' } },
  { $sort: { price: -1 } },
  { $limit: 10 },                              // Stop here
  { $lookup: { from: 'reviews', ... } },       // Only joins 10 docs
]);

// BAD — joins everything, then limits
const result = await Product.aggregate([
  { $match: { category: 'Electronics' } },
  { $lookup: { from: 'reviews', ... } },       // Joins ALL electronics
  { $sort: { price: -1 } },
  { $limit: 10 },                              // Wasted effort on other docs
]);
```

---

## 3. `$skip` — Skip Documents

```javascript
// Skip first 10 results
const result = await Product.aggregate([
  { $sort: { createdAt: -1 } },
  { $skip: 10 },
  { $limit: 10 },
]);
```

### Pagination with `$skip` and `$limit`

```javascript
const paginateAggregation = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const result = await Order.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: '$customer',
        totalSpent: { $sum: '$total' },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { totalSpent: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  return result;
};
```

### After Grouping

```javascript
// Skip the top category, get the next 2
const result = await Product.aggregate([
  {
    $group: {
      _id: '$category',
      totalPrice: { $sum: '$price' },
    },
  },
  { $sort: { totalPrice: -1 } },
  { $skip: 1 },    // Skip the top category
  { $limit: 2 },   // Get the next 2
]);
```

---

## 4. `$count` — Count Documents

```javascript
const result = await Product.aggregate([
  { $match: { price: { $gt: 100 } } },
  { $count: 'expensiveProductCount' },
]);
// [{ expensiveProductCount: 42 }]
```

---

## 5. Logical Operators in Aggregation

### `$and` in `$match`

```javascript
const result = await Product.aggregate([
  {
    $match: {
      $and: [
        { category: 'Electronics' },
        { stock: { $gt: 0 } },
        { price: { $lt: 1000 } },
      ],
    },
  },
]);
```

### `$or` in `$match`

```javascript
const result = await Product.aggregate([
  {
    $match: {
      $or: [
        { category: 'Electronics' },
        { price: { $gt: 1000 } },
      ],
    },
  },
]);
```

### `$not` in `$match`

```javascript
const result = await Product.aggregate([
  {
    $match: {
      category: { $not: { $eq: 'Electronics' } },
    },
  },
]);
```

### `$nor` in `$match`

```javascript
const result = await Product.aggregate([
  {
    $match: {
      $nor: [
        { category: 'Electronics' },
        { price: { $gt: 500 } },
      ],
    },
  },
]);
// Products that are NOT Electronics AND NOT expensive
```

### `$expr` — Compare Fields to Each Other

```javascript
const result = await Product.aggregate([
  {
    $match: {
      $expr: {
        $lt: ['$stock', { $divide: ['$price', 10] }],
      },
    },
  },
]);
// Products where stock is less than price/10
```

### `$in` in `$match`

```javascript
const result = await Product.aggregate([
  {
    $match: {
      category: { $in: ['Electronics', 'Clothing'] },
    },
  },
]);
```

---

## 6. Conditional Operators

### `$cond` — If/Else

```javascript
const result = await Product.aggregate([
  {
    $addFields: {
      status: {
        $cond: {
          if: { $gt: ['$stock', 0] },
          then: 'In Stock',
          else: 'Out of Stock',
        },
      },
    },
  },
]);

// Shorthand array syntax:
{ $cond: [{ $gt: ['$stock', 0] }, 'In Stock', 'Out of Stock'] }
```

### `$switch` — Multiple Conditions

```javascript
const result = await Product.aggregate([
  {
    $addFields: {
      tier: {
        $switch: {
          branches: [
            { case: { $lte: ['$price', 25] }, then: 'Budget' },
            { case: { $lte: ['$price', 100] }, then: 'Standard' },
            { case: { $lte: ['$price', 500] }, then: 'Premium' },
          ],
          default: 'Luxury',
        },
      },
    },
  },
]);
```

### `$ifNull` — Default for Missing Values

```javascript
{
  $project: {
    description: { $ifNull: ['$description', 'No description'] },
    rating: { $ifNull: ['$rating', 0] },
  }
}
```

---

## 7. Mathematical Operators

All usable within `$project`, `$addFields`, and `$group`:

| Operator | Purpose | Example |
|----------|---------|---------|
| `$add` | Addition | `{ $add: ['$price', '$tax'] }` |
| `$subtract` | Subtraction | `{ $subtract: ['$total', '$discount'] }` |
| `$multiply` | Multiplication | `{ $multiply: ['$price', '$quantity'] }` |
| `$divide` | Division | `{ $divide: ['$total', '$count'] }` |
| `$mod` | Modulo | `{ $mod: ['$number', 2] }` |
| `$abs` | Absolute value | `{ $abs: '$profit' }` |
| `$ceil` | Round up | `{ $ceil: '$price' }` |
| `$floor` | Round down | `{ $floor: '$price' }` |
| `$round` | Round | `{ $round: ['$price', 2] }` |
| `$pow` | Power | `{ $pow: ['$base', 2] }` |
| `$sqrt` | Square root | `{ $sqrt: '$value' }` |

### Complex Calculation Example

```javascript
const result = await Order.aggregate([
  {
    $group: {
      _id: '$customer',
      totalSpent: { $sum: '$total' },
      orderCount: { $sum: 1 },
    },
  },
  {
    $addFields: {
      avgOrderValue: {
        $round: [{ $divide: ['$totalSpent', '$orderCount'] }, 2],
      },
      isHighValue: {
        $cond: [{ $gte: ['$totalSpent', 1000] }, true, false],
      },
    },
  },
  { $sort: { totalSpent: -1 } },
]);
```

---

## 8. `$facet` — Multiple Pipelines at Once

Run multiple aggregation pipelines on the same data in a single stage:

```javascript
const result = await Product.aggregate([
  {
    $facet: {
      // Pipeline 1: Category breakdown
      byCategory: [
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ],
      // Pipeline 2: Price stats
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
      // Pipeline 3: Paginated results
      data: [
        { $sort: { createdAt: -1 } },
        { $skip: 0 },
        { $limit: 10 },
      ],
      // Pipeline 4: Total count
      totalCount: [
        { $count: 'count' },
      ],
    },
  },
]);
```

---

## 9. Summary

| Stage | Purpose | SQL Equivalent |
|-------|---------|---------------|
| `$sort` | Order by fields | `ORDER BY` |
| `$limit` | Restrict result count | `LIMIT` |
| `$skip` | Skip documents | `OFFSET` |
| `$count` | Count results | `COUNT(*)` |
| `$facet` | Multiple pipelines | Multiple queries |

| Operator Category | Operators |
|------------------|-----------|
| **Logical** | `$and`, `$or`, `$not`, `$nor`, `$expr` |
| **Conditional** | `$cond`, `$switch`, `$ifNull` |
| **Math** | `$add`, `$subtract`, `$multiply`, `$divide`, `$round` |

### Key Points

1. Place `$sort` before `$limit` — sorting after limit makes no sense
2. Place `$limit` **as early as possible** to reduce processing
3. `$skip` + `$limit` works for pagination but degrades at large offsets
4. Use `$expr` to **compare fields** against each other in `$match`
5. `$facet` runs **multiple pipelines in parallel** on the same dataset
6. Use `allowDiskUse: true` for sorts exceeding MongoDB's 100MB memory limit
