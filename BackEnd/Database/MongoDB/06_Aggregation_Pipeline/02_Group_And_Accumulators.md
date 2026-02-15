# Mongoose — $group & Accumulators

The `$group` stage groups documents by a specified field and applies **accumulator expressions** to compute aggregated values like sums, averages, counts, and more.

---

## 1. Syntax

```javascript
{
  $group: {
    _id: <grouping expression>,     // What to group by
    <field>: { <accumulator>: <expression> },
    <field>: { <accumulator>: <expression> },
  }
}
```

- `_id` defines the **grouping key** (like SQL's `GROUP BY`)
- Each additional field uses an **accumulator** to compute a value

---

## 2. Grouping by a Field

```javascript
// Group orders by customer
const result = await Order.aggregate([
  {
    $group: {
      _id: '$customer',           // Group by customer field
      totalSpent: { $sum: '$total' },
      orderCount: { $sum: 1 },
    },
  },
]);

// Result:
// [
//   { _id: 'John', totalSpent: 450, orderCount: 3 },
//   { _id: 'Jane', totalSpent: 800, orderCount: 5 },
// ]
```

### Group by `null` — Aggregate Entire Collection

```javascript
// Get overall stats (no grouping)
const result = await Product.aggregate([
  {
    $group: {
      _id: null,                   // No grouping — entire collection
      totalProducts: { $sum: 1 },
      averagePrice: { $avg: '$price' },
      maxPrice: { $max: '$price' },
      minPrice: { $min: '$price' },
    },
  },
]);

// Result:
// [{ _id: null, totalProducts: 150, averagePrice: 89.5, maxPrice: 1200, minPrice: 5 }]
```

### Group by Multiple Fields

```javascript
const result = await Order.aggregate([
  {
    $group: {
      _id: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
      },
      revenue: { $sum: '$total' },
      orders: { $sum: 1 },
    },
  },
  { $sort: { '_id.year': 1, '_id.month': 1 } },
]);

// Result:
// [
//   { _id: { year: 2024, month: 1 }, revenue: 15000, orders: 120 },
//   { _id: { year: 2024, month: 2 }, revenue: 18000, orders: 145 },
// ]
```

---

## 3. All Accumulator Operators

### `$sum` — Sum Values

```javascript
// Sum a field
{ totalRevenue: { $sum: '$amount' } }

// Count documents (sum of 1 for each doc)
{ count: { $sum: 1 } }

// Computed expression
{ totalWithTax: { $sum: { $multiply: ['$price', 1.1] } } }
```

### `$avg` — Average Value

```javascript
{ averagePrice: { $avg: '$price' } }
{ avgRating: { $avg: '$rating' } }
```

### `$max` / `$min` — Maximum / Minimum

```javascript
{ highestPrice: { $max: '$price' } }
{ lowestPrice: { $min: '$price' } }
{ newestOrder: { $max: '$createdAt' } }
{ oldestOrder: { $min: '$createdAt' } }
```

### `$push` — Collect Values Into Array

```javascript
const result = await Order.aggregate([
  {
    $group: {
      _id: '$customer',
      orders: { $push: '$total' },       // Array of order totals
    },
  },
]);
// { _id: 'John', orders: [100, 200, 150] }
```

### `$$ROOT` — Collect Entire Documents

```javascript
const result = await Order.aggregate([
  {
    $group: {
      _id: '$status',
      orders: { $push: '$$ROOT' },      // Array of full documents
    },
  },
]);
// { _id: 'completed', orders: [{ _id: ..., customer: 'John', total: 100, ... }, ...] }
```

### `$addToSet` — Unique Values Only

```javascript
const result = await Order.aggregate([
  {
    $group: {
      _id: '$category',
      uniqueCustomers: { $addToSet: '$customer' },  // No duplicates
    },
  },
]);
// { _id: 'Electronics', uniqueCustomers: ['John', 'Jane', 'Bob'] }
```

### `$first` / `$last` — First/Last in Group

```javascript
const result = await Order.aggregate([
  { $sort: { createdAt: -1 } },
  {
    $group: {
      _id: '$customer',
      latestOrder: { $first: '$total' },    // First doc after sort (most recent)
      oldestOrder: { $last: '$total' },     // Last doc after sort (oldest)
    },
  },
]);
```

### `$count` — Count Values (Mongoose 5+)

```javascript
// Alternative to { $sum: 1 }
{ orderCount: { $count: {} } }
```

---

## 4. Mathematical Expressions in Group

### `$multiply`

```javascript
const result = await Product.aggregate([
  {
    $group: {
      _id: '$category',
      totalRevenue: {
        $sum: { $multiply: ['$price', '$quantity'] },  // price * quantity
      },
    },
  },
]);
```

### `$divide`

```javascript
{
  $group: {
    _id: null,
    avgPricePerUnit: {
      $avg: { $divide: ['$totalPrice', '$quantity'] },
    },
  }
}
```

### `$subtract`

```javascript
{
  $group: {
    _id: '$category',
    totalProfit: {
      $sum: { $subtract: ['$sellingPrice', '$costPrice'] },
    },
  }
}
```

---

## 5. Practical Examples

### Sales Report by Category

```javascript
const salesReport = await Order.aggregate([
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

### User Activity Summary

```javascript
const userStats = await User.aggregate([
  {
    $group: {
      _id: '$role',
      count: { $sum: 1 },
      avgAge: { $avg: '$age' },
      activeCount: {
        $sum: { $cond: ['$isActive', 1, 0] },  // Conditional count
      },
    },
  },
]);
// [
//   { _id: 'user', count: 150, avgAge: 28, activeCount: 120 },
//   { _id: 'admin', count: 5, avgAge: 35, activeCount: 5 },
// ]
```

### Top Customers

```javascript
const topCustomers = await Order.aggregate([
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

---

## 6. Summary

| Accumulator | Purpose | Example |
|------------|---------|---------|
| `$sum` | Total / Count | `{ $sum: '$price' }` or `{ $sum: 1 }` |
| `$avg` | Average | `{ $avg: '$rating' }` |
| `$max` | Maximum | `{ $max: '$price' }` |
| `$min` | Minimum | `{ $min: '$price' }` |
| `$push` | Collect into array | `{ $push: '$name' }` |
| `$$ROOT` | Collect full documents | `{ $push: '$$ROOT' }` |
| `$addToSet` | Unique values | `{ $addToSet: '$category' }` |
| `$first` | First in group | `{ $first: '$name' }` |
| `$last` | Last in group | `{ $last: '$name' }` |

### Key Points

1. `_id` defines the grouping key — `_id: null` aggregates the entire collection
2. `$sum: 1` counts documents; `$sum: '$field'` sums field values
3. Use `$$ROOT` with `$push` to collect complete documents
4. `$addToSet` prevents duplicates; `$push` includes all values
5. Combine `$sort` before `$group` to control `$first` / `$last` behavior
6. Use math expressions (`$multiply`, `$divide`, `$subtract`) inside accumulators
