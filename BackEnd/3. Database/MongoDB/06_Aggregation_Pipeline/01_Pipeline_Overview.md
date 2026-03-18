# MongoDB Aggregation Pipeline — Deep Notes

---

## 1. Overview

The aggregation pipeline is MongoDB's system for transforming, filtering, and analyzing data through a sequence of stages — each stage receives documents from the previous one, transforms them, and passes them forward. It solves the problem of performing multi-step data analysis (grouping, joining, reshaping, summarizing) that a single `find()` query cannot do.

**Why aggregation instead of a regular query?**

| Need | Regular Query | Aggregation |
|------|--------------|-------------|
| Filter documents | `find({ status: 'active' })` | `$match` |
| Count with filter | `countDocuments()` | `$count` |
| Sum/avg/min/max | Not possible | `$group` with accumulators |
| Join collections | Not possible (use `.populate()`) | `$lookup` |
| Reshape output | Limited projection | `$project` + computed fields |
| Group by field | Not possible | `$group` |
| Multiple analytics in one query | Not possible | `$facet` |

---

## 2. Stage-by-Stage Breakdown

### How the Pipeline Executes

```
Collection Documents
       ↓
   [ Stage 1: $match ]      ← filters documents; fewer docs enter next stage
       ↓
   [ Stage 2: $group ]      ← collapses many docs into groups
       ↓
   [ Stage 3: $sort ]       ← orders the grouped results
       ↓
   [ Stage 4: $project ]    ← shapes the final output
       ↓
   Final Result Array
```

Every stage is an object inside the array passed to `.aggregate([...])`. Stages execute **left to right / top to bottom** — order is critical.

---

### `$match` — Filter Documents

**Purpose:** Reduce the document set before expensive operations. Works exactly like `find()` query conditions.

**Why position matters:** Place `$match` as the first stage whenever possible. MongoDB can use indexes on `$match` only at the start of the pipeline. A late `$match` filters documents that have already been processed by every earlier stage — wasteful.

```javascript
// Syntax
{ $match: { <query conditions> } }

// Simple equality
{ $match: { status: 'completed' } }

// Comparison operators
{ $match: { total: { $gte: 100 } } }
{ $match: { price: { $lt: 500 } } }
{ $match: { score: { $gt: 0, $lte: 100 } } }

// Date range
{ $match: { createdAt: { $gte: new Date('2024-01-01'), $lt: new Date('2025-01-01') } } }

// Logical OR
{ $match: { $or: [{ category: 'Electronics' }, { price: { $gt: 500 } }] } }

// Logical AND (implicit — multiple conditions in same object)
{ $match: { status: 'active', age: { $gte: 18 } } }

// Explicit $and (needed when the same field appears twice)
{ $match: { $and: [{ price: { $gte: 10 } }, { price: { $lte: 100 } }] } }

// Negation
{ $match: { status: { $ne: 'cancelled' } } }
{ $match: { category: { $not: { $eq: 'Electronics' } } } }

// Array membership
{ $match: { category: { $in: ['Electronics', 'Clothing'] } } }
{ $match: { status: { $nin: ['cancelled', 'refunded'] } } }

// Field existence
{ $match: { description: { $exists: true } } }
{ $match: { deletedAt: { $exists: false } } }

// Regex
{ $match: { name: { $regex: /^john/i } } }

// $expr: compare two fields to each other (cannot use regular operators for this)
{ $match: { $expr: { $gt: ['$sellingPrice', '$costPrice'] } } }
// "Find documents where sellingPrice field > costPrice field"

// $month, $year inside $expr
{ $match: { $expr: { $eq: [{ $month: '$createdAt' }, 3] } } }  // March only
```

**ObjectId casting — critical rule:** Aggregation does NOT auto-cast strings to ObjectId the way Mongoose queries do. You must cast manually:

```javascript
import mongoose from 'mongoose';

// WRONG — string won't match ObjectId
{ $match: { author: '64b2f9c3e4a1b2c3d4e5f6a7' } }

// CORRECT
{ $match: { author: new mongoose.Types.ObjectId('64b2f9c3e4a1b2c3d4e5f6a7') } }
```

**What breaks if removed:** Removing `$match` means every document in the collection flows through the rest of the pipeline. For a collection with millions of records, this can cause severe memory/performance issues or a timeout.

---

### `$group` — Group and Aggregate

**Purpose:** Collapse multiple documents into one per group, computing aggregate values.

```javascript
{
  $group: {
    _id: <grouping key>,              // Required — what to group by
    fieldName: { <accumulator> },    // One or more computed fields
  }
}
```

Full coverage in `02_Group_And_Accumulators.md` Notes.

---

### `$project` — Shape Output Fields

**Purpose:** Control which fields appear in output; compute new fields.

```javascript
{ $project: { name: 1, email: 1, password: 0 } }
```

Full coverage in `03_Project_And_Reshape.md` Notes.

---

### `$sort` — Order Results

**Purpose:** Order documents by one or more fields.

```javascript
{ $sort: { field: 1 } }   // 1 = ascending (A→Z, low→high)
{ $sort: { field: -1 } }  // -1 = descending (Z→A, high→low)
```

Full coverage in `05_Sort_Limit_And_Operators.md` Notes.

---

### `$limit` — Restrict Count

**Purpose:** Stop the pipeline after N documents.

```javascript
{ $limit: 10 }
```

**Performance:** Place early. If you only need the top 10, add `$limit` right after `$sort` — the stages after it only process 10 documents instead of thousands.

---

### `$skip` — Skip Documents

**Purpose:** Offset for pagination.

```javascript
{ $skip: 20 }  // Skip first 20, return from position 21 onward
```

---

### `$lookup` — Join Collections

**Purpose:** Bring in documents from another collection (left outer join).

```javascript
{
  $lookup: {
    from: 'collectionName',
    localField: 'fieldInThisDoc',
    foreignField: 'fieldInOtherDoc',
    as: 'outputArrayField',
  }
}
```

Full coverage in `04_Lookup_And_Joins.md` Notes.

---

### `$unwind` — Deconstruct Arrays

**Purpose:** Turn one document with an array into N documents, one per array element.

```javascript
{ $unwind: '$arrayField' }
```

Full coverage in `04_Lookup_And_Joins.md` Notes.

---

### `$addFields` — Add Computed Fields

**Purpose:** Add new fields without removing existing ones (unlike `$project` which replaces the shape).

```javascript
{
  $addFields: {
    priceWithTax: { $multiply: ['$price', 1.1] },
    isExpensive: { $gte: ['$price', 100] },
  }
}
```

---

### `$count` — Count Documents Passing Through

**Purpose:** Emit a single document with the count of documents that reached this stage.

```javascript
// Input: 42 documents reach this stage
{ $count: 'totalRecords' }
// Output: [{ totalRecords: 42 }]
```

**What breaks if moved:** `$count` must come after all filtering/grouping stages that define what you're counting. Placing it before `$match` counts the entire collection.

---

### `$facet` — Multiple Sub-Pipelines

**Purpose:** Run multiple independent pipelines on the same input documents in a single stage.

```javascript
{
  $facet: {
    pipeline1Name: [ ...stages ],
    pipeline2Name: [ ...stages ],
  }
}
// Output: one document with one array field per named pipeline
```

Full coverage in `05_Sort_Limit_And_Operators.md` Notes.

---

### `$out` — Write Results to a Collection

**Purpose:** Store aggregation results in a MongoDB collection (creates or replaces it).

```javascript
{ $out: 'reportResults' }
// Must be the LAST stage
// Replaces the target collection entirely — destructive!
```

---

## 3. Data Flow — Step-by-Step Example

**Scenario:** Find total revenue per customer for completed orders, show only top 3 spenders.

**Collection: orders**
```javascript
// Sample documents
{ _id: 1, customer: 'Alice', status: 'completed', total: 200 }
{ _id: 2, customer: 'Bob',   status: 'completed', total: 350 }
{ _id: 3, customer: 'Alice', status: 'cancelled', total: 150 }
{ _id: 4, customer: 'Carol', status: 'completed', total: 500 }
{ _id: 5, customer: 'Bob',   status: 'completed', total: 180 }
{ _id: 6, customer: 'Dave',  status: 'completed', total: 90  }
```

**Pipeline:**
```javascript
const result = await Order.aggregate([
  { $match: { status: 'completed' } },
  { $group: { _id: '$customer', totalSpent: { $sum: '$total' } } },
  { $sort: { totalSpent: -1 } },
  { $limit: 3 },
  { $project: { _id: 0, customer: '$_id', totalSpent: 1 } },
]);
```

**After Stage 1 — `$match: { status: 'completed' }`:**
```javascript
// Doc 3 (Alice, cancelled) is removed
{ _id: 1, customer: 'Alice', status: 'completed', total: 200 }
{ _id: 2, customer: 'Bob',   status: 'completed', total: 350 }
{ _id: 4, customer: 'Carol', status: 'completed', total: 500 }
{ _id: 5, customer: 'Bob',   status: 'completed', total: 180 }
{ _id: 6, customer: 'Dave',  status: 'completed', total: 90  }
// 5 documents pass through (was 6)
```

**After Stage 2 — `$group: { _id: '$customer', totalSpent: { $sum: '$total' } }`:**
```javascript
// 5 docs collapse to 4 groups
{ _id: 'Alice', totalSpent: 200 }
{ _id: 'Bob',   totalSpent: 530 }   // 350 + 180
{ _id: 'Carol', totalSpent: 500 }
{ _id: 'Dave',  totalSpent: 90  }
```

**After Stage 3 — `$sort: { totalSpent: -1 }`:**
```javascript
{ _id: 'Bob',   totalSpent: 530 }
{ _id: 'Carol', totalSpent: 500 }
{ _id: 'Alice', totalSpent: 200 }
{ _id: 'Dave',  totalSpent: 90  }
```

**After Stage 4 — `$limit: 3`:**
```javascript
{ _id: 'Bob',   totalSpent: 530 }
{ _id: 'Carol', totalSpent: 500 }
{ _id: 'Alice', totalSpent: 200 }
// Dave is cut off
```

**After Stage 5 — `$project: { _id: 0, customer: '$_id', totalSpent: 1 }`:**
```javascript
// Final result
[
  { customer: 'Bob',   totalSpent: 530 },
  { customer: 'Carol', totalSpent: 500 },
  { customer: 'Alice', totalSpent: 200 },
]
```

---

## 4. Operators Deep Dive

### Comparison Operators (used in `$match`)

| Operator | Meaning | Example |
|----------|---------|---------|
| `$eq` | Equal | `{ price: { $eq: 100 } }` (same as `{ price: 100 }`) |
| `$ne` | Not equal | `{ status: { $ne: 'cancelled' } }` |
| `$gt` | Greater than | `{ age: { $gt: 18 } }` |
| `$gte` | Greater than or equal | `{ score: { $gte: 90 } }` |
| `$lt` | Less than | `{ price: { $lt: 50 } }` |
| `$lte` | Less than or equal | `{ quantity: { $lte: 0 } }` |
| `$in` | In array | `{ status: { $in: ['active', 'pending'] } }` |
| `$nin` | Not in array | `{ role: { $nin: ['banned', 'deleted'] } }` |

**Edge cases:**
- `$in: []` — empty array: matches nothing (returns zero documents)
- `$nin: []` — empty array: matches everything (no exclusion)
- Comparing to `null` with `$eq: null` also matches documents where the field does not exist

---

### Logical Operators

| Operator | Meaning | Syntax |
|----------|---------|--------|
| `$and` | All conditions must be true | `{ $and: [ cond1, cond2 ] }` |
| `$or` | At least one condition must be true | `{ $or: [ cond1, cond2 ] }` |
| `$nor` | No condition must be true | `{ $nor: [ cond1, cond2 ] }` |
| `$not` | Negates a single condition | `{ field: { $not: { $eq: value } } }` |

**When `$and` is required vs. implicit:**
- Implicit `$and`: `{ a: 1, b: 2 }` — different fields, no problem
- Explicit `$and` needed: same field with two conditions — `{ $and: [{ price: { $gte: 10 } }, { price: { $lte: 100 } }] }`
  - Writing `{ price: { $gte: 10 }, price: { $lte: 100 } }` silently overwrites the first condition in JavaScript (duplicate key)

**`$not` edge case:** `$not` does not support regex at the top level; use `{ field: { $not: /pattern/ } }` instead of `$not: { $regex }` in some versions.

---

### `$expr` — Field-to-Field and Expression Comparisons

Standard `$match` operators compare a field to a **literal value**. `$expr` lets you use aggregation expressions — allowing field-to-field comparisons and computed comparisons:

```javascript
// Compare two fields
{ $match: { $expr: { $gt: ['$sellingPrice', '$costPrice'] } } }

// Computed comparison
{ $match: { $expr: { $lt: ['$stock', { $divide: ['$price', 10] }] } } }

// Date expression inside match
{ $match: { $expr: { $eq: [{ $month: '$createdAt' }, 6] } } }  // June orders
```

**Without `$expr`:** `{ $match: { $gt: ['$a', '$b'] } }` — this is invalid syntax. You need `$expr` to wrap it.

---

### `$avg` and `$sum` in `$match` context

These are accumulator operators, not `$match` operators. You cannot use `$avg` in a `$match` stage directly. To filter by an aggregate value (e.g., customers with average order > $100), you must compute it in `$group` first, then apply a second `$match`:

```javascript
// Find customers whose average order > $100
await Order.aggregate([
  { $group: { _id: '$customer', avgOrder: { $avg: '$total' } } },
  { $match: { avgOrder: { $gt: 100 } } },  // Second $match on computed field
]);
```

---

### `$month` / Date Extraction Operators

Used inside `$group._id`, `$project`, `$addFields`, or within `$expr` in `$match`:

```javascript
{ $month: '$createdAt' }     // 1–12
{ $year: '$createdAt' }      // e.g., 2024
{ $dayOfMonth: '$createdAt' } // 1–31
{ $dayOfWeek: '$createdAt' }  // 1 (Sun) – 7 (Sat)
```

**Edge case:** If the date field is missing or null, date operators return `null` — they do not throw an error.

---

## 5. Advanced Concepts

### Index Usage

MongoDB can use indexes only in the **first `$match`** and the **first `$sort`** of a pipeline (when `$sort` appears before the first `$group`). After `$group`, the document structure changes and original indexes no longer apply.

```javascript
// Index on 'status' will be used here:
await Order.aggregate([
  { $match: { status: 'completed' } },  // ← index used
  { $group: { _id: '$customer', total: { $sum: '$total' } } },
  { $sort: { total: -1 } },             // ← no index — sorting in memory
]);

// Index on 'price' would be used if $sort comes before $group:
await Product.aggregate([
  { $sort: { price: -1 } },    // ← index on price used
  { $limit: 10 },
]);
```

---

### `allowDiskUse`

MongoDB limits in-memory sorting/processing to **100MB per pipeline**. For large datasets:

```javascript
const result = await Model.aggregate([
  // ...pipeline...
]).option({ allowDiskUse: true });
```

This allows intermediate results to spill to disk, enabling processing of datasets larger than 100MB at the cost of speed.

---

### `aggregate()` Returns Plain Objects

Aggregation bypasses Mongoose's document system:

```javascript
const results = await Order.aggregate([...]);
// results[0] is a plain JS object — NOT a Mongoose document
// results[0].save()       // ← ERROR: method does not exist
// results[0].someVirtual  // ← undefined: virtuals not available
// results[0].__v          // may or may not be present depending on $project
```

If you need Mongoose documents after aggregation, query with `find()` using the result IDs.

---

### `pre('aggregate')` Hook

Aggregation triggers only the `pre('aggregate')` hook (not `pre('find')`):

```javascript
OrderSchema.pre('aggregate', function () {
  // 'this' is the Aggregation object
  this.pipeline().unshift({ $match: { deletedAt: null } }); // inject soft-delete filter
});
```

---

## 6. Use Cases

### Simple — Count Documents by Status
```javascript
await Order.aggregate([
  { $group: { _id: '$status', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]);
```

### Intermediate — Monthly Revenue Report
```javascript
await Order.aggregate([
  { $match: { status: 'completed' } },
  {
    $group: {
      _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
      revenue: { $sum: '$total' },
      orderCount: { $sum: 1 },
      avgOrderValue: { $avg: '$total' },
    },
  },
  { $sort: { '_id.year': 1, '_id.month': 1 } },
]);
```

### Advanced — Two-Stage Filter (Post-Group Filter)
```javascript
// Find customers who spent more than $1000 total on completed orders
await Order.aggregate([
  { $match: { status: 'completed' } },
  { $group: { _id: '$customer', totalSpent: { $sum: '$total' } } },
  { $match: { totalSpent: { $gt: 1000 } } },  // Filter on aggregated value
  { $sort: { totalSpent: -1 } },
]);
```

### Advanced — Search for Active Electronics Under $500
```javascript
await Product.aggregate([
  {
    $match: {
      category: 'Electronics',
      inStock: true,
      price: { $lt: 500 },
      $or: [
        { rating: { $gte: 4 } },
        { reviewCount: { $gte: 100 } },
      ],
    },
  },
  { $sort: { rating: -1, price: 1 } },
  { $limit: 20 },
  { $project: { name: 1, price: 1, rating: 1, _id: 0 } },
]);
```

---

## 7. Common Mistakes

### 1. `$match` Too Late
```javascript
// WRONG — groups ALL documents, then filters
await Order.aggregate([
  { $group: { _id: '$customer', total: { $sum: '$total' } } },
  { $match: { status: 'completed' } },  // can't filter by original field after grouping!
]);

// CORRECT
await Order.aggregate([
  { $match: { status: 'completed' } },  // Filter BEFORE grouping
  { $group: { _id: '$customer', total: { $sum: '$total' } } },
]);
```

### 2. String Instead of ObjectId in `$match`
```javascript
// WRONG
{ $match: { userId: '64b2f9c3e4a1b2c3d4e5f6a7' } }  // String won't match ObjectId

// CORRECT
{ $match: { userId: new mongoose.Types.ObjectId('64b2f9c3e4a1b2c3d4e5f6a7') } }
```

### 3. Trying to Use Virtuals or `.save()` on Results
```javascript
const orders = await Order.aggregate([...]);
orders[0].totalWithTax; // undefined — virtuals don't work
orders[0].save();       // TypeError — not a Mongoose document
```

### 4. Mixing Include and Exclude in `$project`
```javascript
// WRONG — cannot mix 1 and 0 (except for _id)
{ $project: { name: 1, password: 0 } }

// CORRECT — either include specific fields
{ $project: { name: 1, email: 1 } }

// OR exclude specific fields
{ $project: { password: 0, __v: 0 } }

// Exception: _id can always be excluded alongside inclusions
{ $project: { _id: 0, name: 1, email: 1 } }
```

### 5. Using `$expr` When Simple Operator Suffices
```javascript
// UNNECESSARY $expr (simple value comparison)
{ $match: { $expr: { $eq: ['$status', 'completed'] } } }

// CORRECT — just use the simple form
{ $match: { status: 'completed' } }

// $expr IS needed for field-to-field comparisons
{ $match: { $expr: { $gt: ['$sellingPrice', '$costPrice'] } } }
```

### 6. Forgetting `$sort` Before `$group` for `$first`/`$last`
```javascript
// Without $sort first, $first/$last return arbitrary documents
await Order.aggregate([
  // MISSING: { $sort: { createdAt: -1 } }
  { $group: { _id: '$customer', latestOrder: { $first: '$total' } } },
  // latestOrder is NOT reliably the most recent
]);

// CORRECT
await Order.aggregate([
  { $sort: { createdAt: -1 } },                                    // Sort first
  { $group: { _id: '$customer', latestOrder: { $first: '$total' } } }, // Then group
]);
```

---

## 8. Quick Reference

### All Pipeline Stages

| Stage | Purpose | SQL Equivalent | Key Note |
|-------|---------|---------------|----------|
| `$match` | Filter documents | `WHERE` | Place first; uses indexes |
| `$group` | Group + aggregate | `GROUP BY` | `_id` is required |
| `$project` | Shape fields | `SELECT` | Cannot mix include/exclude |
| `$sort` | Order results | `ORDER BY` | 1=asc, -1=desc |
| `$limit` | Restrict count | `LIMIT` | Place early for performance |
| `$skip` | Skip N documents | `OFFSET` | Degrades at large N |
| `$lookup` | Join collection | `JOIN` | Always returns array |
| `$unwind` | Flatten array | — | One doc per element |
| `$addFields` | Add computed fields | — | Keeps all existing fields |
| `$count` | Count documents | `COUNT(*)` | Emits `{ fieldName: N }` |
| `$facet` | Multiple pipelines | Multiple queries | All run on same input |
| `$out` | Write to collection | `INSERT ... SELECT` | Last stage only; destructive |

### `$match` Operators Summary

| Operator | Purpose | Example |
|----------|---------|---------|
| `$eq` | Equal | `{ f: { $eq: v } }` or `{ f: v }` |
| `$ne` | Not equal | `{ f: { $ne: v } }` |
| `$gt` | Greater than | `{ f: { $gt: v } }` |
| `$gte` | Greater or equal | `{ f: { $gte: v } }` |
| `$lt` | Less than | `{ f: { $lt: v } }` |
| `$lte` | Less or equal | `{ f: { $lte: v } }` |
| `$in` | In array | `{ f: { $in: [v1, v2] } }` |
| `$nin` | Not in array | `{ f: { $nin: [v1, v2] } }` |
| `$or` | Any condition true | `{ $or: [ c1, c2 ] }` |
| `$and` | All conditions true | `{ $and: [ c1, c2 ] }` |
| `$nor` | No condition true | `{ $nor: [ c1, c2 ] }` |
| `$not` | Negate condition | `{ f: { $not: { $eq: v } } }` |
| `$exists` | Field exists/absent | `{ f: { $exists: true } }` |
| `$regex` | Regex match | `{ f: { $regex: /pat/i } }` |
| `$expr` | Expression/field comparison | `{ $expr: { $gt: ['$a', '$b'] } }` |
