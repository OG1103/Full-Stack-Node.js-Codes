# Mongoose — Aggregation Pipeline Overview

The aggregation pipeline processes documents through a sequence of **stages**. Each stage transforms the data and passes the result to the next stage. It's MongoDB's most powerful tool for data analysis, reporting, and complex queries.

---

## 1. How Pipelines Work

```
Collection → Stage 1 → Stage 2 → Stage 3 → ... → Result

Example:
orders → $match (filter) → $group (aggregate) → $sort (order) → Final Result
```

Each stage receives documents from the previous stage, processes them, and outputs documents to the next stage. The original collection is never modified.

---

## 2. Syntax

```javascript
const result = await Model.aggregate([
  { $match: { ... } },       // Stage 1: Filter
  { $group: { ... } },       // Stage 2: Group & aggregate
  { $sort: { ... } },        // Stage 3: Sort
  { $project: { ... } },     // Stage 4: Shape output
]);
```

`aggregate()` returns **plain JavaScript objects** (not Mongoose documents). This means no instance methods, virtuals, or change tracking.

---

## 3. All Pipeline Stages

| Stage | Purpose | SQL Equivalent |
|-------|---------|---------------|
| `$match` | Filter documents | `WHERE` |
| `$group` | Group and aggregate | `GROUP BY` |
| `$project` | Shape output fields | `SELECT` |
| `$sort` | Order results | `ORDER BY` |
| `$limit` | Limit result count | `LIMIT` |
| `$skip` | Skip documents | `OFFSET` |
| `$lookup` | Join collections | `JOIN` |
| `$unwind` | Deconstruct arrays | — |
| `$addFields` | Add computed fields | — |
| `$count` | Count documents | `COUNT(*)` |
| `$facet` | Multiple pipelines | — |
| `$out` | Write results to collection | `INSERT INTO ... SELECT` |

---

## 4. `$match` — Filter Documents

Works like `find()` filters. Place early in the pipeline for best performance (uses indexes).

```javascript
// Simple match
const result = await Order.aggregate([
  { $match: { status: 'completed' } },
]);

// Multiple conditions
const result = await Order.aggregate([
  {
    $match: {
      status: 'completed',
      total: { $gte: 100 },
      createdAt: { $gte: new Date('2024-01-01') },
    },
  },
]);

// With logical operators
const result = await Product.aggregate([
  {
    $match: {
      $or: [
        { category: 'Electronics' },
        { price: { $gt: 500 } },
      ],
    },
  },
]);

// Using $in
const result = await Product.aggregate([
  {
    $match: {
      category: { $in: ['Electronics', 'Clothing'] },
      inStock: true,
    },
  },
]);
```

### Match with ObjectId

When using `$match` with ObjectId fields in aggregation, you must cast manually:

```javascript
import mongoose from 'mongoose';

const result = await Post.aggregate([
  {
    $match: {
      author: new mongoose.Types.ObjectId(userId),  // Must cast explicitly
    },
  },
]);
```

---

## 5. Pipeline Optimization Tips

### Place `$match` Early

```javascript
// GOOD — filters first, fewer docs to process
const result = await Order.aggregate([
  { $match: { status: 'completed' } },    // Filter first
  { $group: { _id: '$customer', total: { $sum: '$amount' } } },
  { $sort: { total: -1 } },
]);

// BAD — groups all docs, then filters
const result = await Order.aggregate([
  { $group: { _id: '$customer', total: { $sum: '$amount' } } },
  { $match: { total: { $gt: 1000 } } },   // Too late — already grouped everything
]);
```

### Place `$limit` Early When Possible

```javascript
// GOOD — limit early when you don't need all results
const result = await Product.aggregate([
  { $match: { category: 'Electronics' } },
  { $sort: { price: -1 } },
  { $limit: 10 },                          // Stop processing after 10
  { $project: { name: 1, price: 1 } },
]);
```

---

## 6. Combining Match with Other Stages

### Match → Group

```javascript
// Average order value by month for completed orders
const result = await Order.aggregate([
  { $match: { status: 'completed' } },
  {
    $group: {
      _id: { $month: '$createdAt' },
      avgOrderValue: { $avg: '$total' },
      orderCount: { $sum: 1 },
    },
  },
  { $sort: { _id: 1 } },
]);
```

### Match → Group → Match (Two-Stage Filter)

```javascript
// Find customers who spent more than $1000
const result = await Order.aggregate([
  { $match: { status: 'completed' } },            // Filter completed orders
  {
    $group: {
      _id: '$customer',
      totalSpent: { $sum: '$total' },
    },
  },
  { $match: { totalSpent: { $gt: 1000 } } },     // Filter grouped results
  { $sort: { totalSpent: -1 } },
]);
```

---

## 7. Aggregation vs Mongoose Queries

| Feature | Mongoose Query | Aggregation Pipeline |
|---------|---------------|---------------------|
| Returns | Mongoose documents | Plain objects |
| Hooks | Yes (pre/post find) | Only `pre('aggregate')` |
| Populate | `.populate()` | Use `$lookup` |
| Virtuals | Available | Not available |
| Complexity | Simple CRUD | Complex analytics |
| Performance | Good for single operations | Better for multi-step processing |

### When to Use Aggregation

- Grouping and summarizing data (totals, averages, counts)
- Joining collections (`$lookup`)
- Reshaping documents (`$project`, `$addFields`)
- Complex filtering that involves computed values
- Reports and analytics dashboards

---

## 8. Summary

```
$match    → Filter documents (WHERE)
$group    → Group and aggregate (GROUP BY)
$project  → Shape output (SELECT)
$sort     → Order results (ORDER BY)
$limit    → Limit count (LIMIT)
$skip     → Skip docs (OFFSET)
$lookup   → Join collections (JOIN)
$unwind   → Flatten arrays
```

### Key Points

1. Stages execute **in order** — each transforms data for the next
2. Place `$match` **as early as possible** for performance (uses indexes)
3. Aggregation returns **plain objects**, not Mongoose documents
4. Cast ObjectIds manually with `new mongoose.Types.ObjectId(id)`
5. Use `$expr` in `$match` to compare fields against each other
