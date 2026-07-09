# MongoDB Aggregation Pipeline — Overview

The aggregation pipeline transforms and analyzes data through a **sequence of stages** — each stage receives documents from the previous one, transforms them, and passes them on. It does what `find()` cannot: grouping, joining, reshaping, and multi-step analytics.

```javascript
const result = await Order.aggregate([
  { $match: { status: 'completed' } },   // stage 1: filter
  { $group: { _id: '$customer', total: { $sum: '$total' } } },   // stage 2: group
  { $sort: { total: -1 } },              // stage 3: sort
  { $limit: 3 },                          // stage 4: top 3
]);
```

**When to use aggregation vs a regular query:**

| Need | Regular query | Aggregation |
|------|--------------|-------------|
| Filter documents | `find({...})` | `$match` |
| Sum / avg / min / max | Not possible | `$group` + accumulators |
| Group by field | Not possible | `$group` |
| Join collections | `.populate()` (limited) | `$lookup` |
| Reshape / compute fields | Limited | `$project` / `$addFields` |
| Several analytics in one query | Not possible | `$facet` |

---

## 1. What Aggregation Returns

| Situation | Result |
|-----------|--------|
| Success | Array of **plain JS objects** (NOT Mongoose documents) |
| No documents match | `[]` — empty array, no error |
| Invalid stage/operator syntax | Throws `MongoServerError` |
| Stage exceeds 100MB memory | Throws `Exceeded memory limit` — fix with `allowDiskUse` |

**Plain objects — the big difference from `find()`:**

```javascript
const results = await Order.aggregate([...]);

results[0].save();        // ERROR — not a Mongoose document
results[0].someVirtual;   // undefined — virtuals don't run
```

If you need Mongoose documents afterward, take the `_id`s from the result and run a `find()`.

---

## 2. All Pipeline Stages at a Glance

| Stage | Purpose | SQL equivalent | Key rule |
|-------|---------|---------------|----------|
| `$match` | Filter documents | `WHERE` | Put **first** — only place indexes are used |
| `$group` | Group + aggregate | `GROUP BY` | `_id` is required; blocks until all input is seen |
| `$project` | Shape/compute fields | `SELECT` | Can't mix include (1) and exclude (0), except `_id` |
| `$addFields` | Add computed fields | — | Keeps all existing fields |
| `$sort` | Order results | `ORDER BY` | `1` asc, `-1` desc; before `$limit` |
| `$limit` | Take first N | `LIMIT` | Place early — later stages process fewer docs |
| `$skip` | Skip N | `OFFSET` | Only meaningful after `$sort` |
| `$lookup` | Join another collection | `JOIN` | Result is **always an array** |
| `$unwind` | One doc per array element | — | Drops docs with empty/missing arrays by default |
| `$count` | Count docs reaching it | `COUNT(*)` | Terminal — emits one `{ name: N }` doc |
| `$facet` | Multiple sub-pipelines | Multiple queries | All run on the same input |
| `$out` | Write results to a collection | `INSERT...SELECT` | Must be last; **replaces** the target collection |

**Stages execute top to bottom — order is everything.** The two golden rules:
1. `$match` first (filter early, use indexes, feed fewer docs to expensive stages).
2. `$sort` + `$limit` before `$lookup`/`$unwind` when you only need the top N.

---

## 3. `$match` — Filter Documents

Works exactly like `find()` filter syntax (see `05_Query_Features/01_Query_Filters.md` for all operators):

```javascript
{ $match: { status: 'completed' } }
{ $match: { total: { $gte: 100 } } }
{ $match: { createdAt: { $gte: new Date('2024-01-01') } } }
{ $match: { $or: [{ category: 'Electronics' }, { price: { $gt: 500 } }] } }
```

### Edge Case — ObjectId Casting (the #1 aggregation bug)

Regular Mongoose queries auto-cast strings to ObjectId. **Aggregation does NOT:**

```javascript
import mongoose from 'mongoose';

// WRONG — string never matches an ObjectId field; silently returns []
{ $match: { author: '64b2f9c3e4a1b2c3d4e5f6a7' } }

// CORRECT — cast manually
{ $match: { author: new mongoose.Types.ObjectId('64b2f9c3e4a1b2c3d4e5f6a7') } }
```

The failure is **silent** — no error, just zero results. Check this first whenever an aggregation unexpectedly returns `[]`.

### Edge Case — `$expr` for Field-to-Field Comparison

```javascript
// Regular operators compare a field to a LITERAL.
// To compare a field to ANOTHER FIELD, wrap in $expr:
{ $match: { $expr: { $gt: ['$sellingPrice', '$costPrice'] } } }
```

### Why Position Matters

Indexes are only used when `$match` is the **first stage**. A `$match` after `$group` can also only reference the fields `$group` produced — the original fields no longer exist:

```javascript
// WRONG — 'status' doesn't exist after grouping; matches nothing
await Order.aggregate([
  { $group: { _id: '$customer', total: { $sum: '$total' } } },
  { $match: { status: 'completed' } },   // silently returns []
]);

// CORRECT
await Order.aggregate([
  { $match: { status: 'completed' } },
  { $group: { _id: '$customer', total: { $sum: '$total' } } },
]);
```

---

## 4. Worked Example — Data Flowing Through Stages

**Goal:** total revenue per customer for completed orders, top 3 spenders.

**Input collection (orders):**

```javascript
{ _id: 1, customer: 'Alice', status: 'completed', total: 200 }
{ _id: 2, customer: 'Bob',   status: 'completed', total: 350 }
{ _id: 3, customer: 'Alice', status: 'cancelled', total: 150 }
{ _id: 4, customer: 'Carol', status: 'completed', total: 500 }
{ _id: 5, customer: 'Bob',   status: 'completed', total: 180 }
{ _id: 6, customer: 'Dave',  status: 'completed', total: 90  }
```

**Pipeline:**

```javascript
await Order.aggregate([
  { $match: { status: 'completed' } },
  { $group: { _id: '$customer', totalSpent: { $sum: '$total' } } },
  { $sort: { totalSpent: -1 } },
  { $limit: 3 },
  { $project: { _id: 0, customer: '$_id', totalSpent: 1 } },
]);
```

**What each stage passes forward:**

```javascript
// After $match  (doc 3 removed — 5 docs remain)
// After $group  (5 docs collapse to 4 groups):
{ _id: 'Alice', totalSpent: 200 }
{ _id: 'Bob',   totalSpent: 530 }   // 350 + 180
{ _id: 'Carol', totalSpent: 500 }
{ _id: 'Dave',  totalSpent: 90  }

// After $sort → Bob, Carol, Alice, Dave
// After $limit: 3 → Dave cut off
// After $project (rename _id → customer):
[
  { customer: 'Bob',   totalSpent: 530 },
  { customer: 'Carol', totalSpent: 500 },
  { customer: 'Alice', totalSpent: 200 },
]
```

---

## 5. Quick Notes on Other Stages

Each has its own detailed file — key facts here:

```javascript
// $addFields — add computed fields, keep everything else
{ $addFields: { priceWithTax: { $multiply: ['$price', 1.1] } } }

// $count — emits ONE doc; must come after all filtering
{ $count: 'totalRecords' }        // → [{ totalRecords: 42 }]
// Edge case: if ZERO docs reach $count, the result is [] — NOT [{ totalRecords: 0 }]!
// Guard: const total = result[0]?.totalRecords ?? 0;

// $out — writes results to a collection, REPLACING it entirely. Must be last. Destructive.
{ $out: 'reportResults' }
```

---

## 6. Performance & Behavior Essentials

### `allowDiskUse` — the 100MB Limit

Each stage is limited to 100MB of RAM. Big sorts/groups throw `Exceeded memory limit`:

```javascript
await Model.aggregate([...]).option({ allowDiskUse: true });
// Spills to disk — slower, but completes. Use as a fallback, not a default.
```

### Index Usage

Only the **first `$match`** (and a `$sort` that comes before any `$group`) can use indexes. After `$group`, the documents are new — original indexes no longer apply.

### Hooks

Aggregation triggers only `pre('aggregate')` — NOT `pre('find')`. If you rely on a find hook (e.g., a soft-delete filter), aggregations bypass it silently:

```javascript
// Re-apply the soft-delete filter for aggregations too:
orderSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { deletedAt: null } });
});
```

---

## 7. Summary

### Key Points

1. Aggregation returns **plain objects** — no `.save()`, no virtuals. No match → `[]`, never an error.
2. **Cast ObjectIds manually** in `$match` — strings silently match nothing.
3. `$match` first: it's the only place indexes work, and everything downstream gets fewer docs.
4. After `$group`, only `_id` and your accumulator fields exist — a `$match` on original fields silently returns nothing.
5. `$expr` is required for field-to-field comparisons inside `$match`.
6. `$count` on zero docs returns `[]`, not `[{ count: 0 }]` — guard with optional chaining.
7. 100MB per-stage memory limit — `allowDiskUse: true` as a fallback for big sorts/groups.
8. `pre('find')` hooks don't run on aggregations — soft-delete filters need a `pre('aggregate')` hook too.
