# MongoDB `$sort`, `$limit`, `$skip`, `$count`, `$facet` & Expression Operators

The stages that control **ordering, quantity, and offset**, plus `$facet` for multi-result queries and the expression operators used across `$match`/`$project`/`$group`.

---

## 1. `$sort` — Order Results

```javascript
{ $sort: { price: 1 } }              // 1 = ascending
{ $sort: { createdAt: -1 } }         // -1 = descending
{ $sort: { role: 1, name: -1 } }     // multi-field
```

**Position rules (getting these wrong gives silently wrong results):**

| Rule | Why |
|------|-----|
| `$sort` BEFORE `$limit` | Sorting after limiting sorts N *arbitrary* docs, not the top N |
| `$sort` BEFORE `$group` when using `$first`/`$last` | Otherwise those accumulators return arbitrary values |
| `$sort` early (before `$group`) can use indexes | After `$group` the docs are new — in-memory sort only |

```javascript
// WRONG — takes 10 arbitrary docs, then sorts those 10
[{ $limit: 10 }, { $sort: { price: -1 } }]

// CORRECT — top 10 by price (MongoDB optimizes sort+limit into a fast top-N sort)
[{ $sort: { price: -1 } }, { $limit: 10 }]
```

**Edge cases:**
- Ties are unstable — add `_id` as a tiebreaker for deterministic pagination: `{ $sort: { createdAt: -1, _id: -1 } }`.
- Sorts over 100MB throw `Exceeded memory limit` → `.option({ allowDiskUse: true })` or add an index.

---

## 2. `$limit` and `$skip`

```javascript
{ $limit: 10 }   // pass at most 10 docs onward
{ $skip: 20 }    // discard the first 20
```

**Position matters for performance** — limit before expensive stages:

```javascript
// GOOD — only 10 docs get joined
[{ $sort: { price: -1 } }, { $limit: 10 }, { $lookup: {...} }]

// BAD — thousands joined, then 10 kept
[{ $lookup: {...} }, { $sort: { price: -1 } }, { $limit: 10 }]
```

**Pagination pattern:**

```javascript
const page = 3, pageSize = 10;
await Order.aggregate([
  { $match: { status: 'completed' } },
  { $sort: { createdAt: -1, _id: -1 } },   // sort BEFORE skip — mandatory for determinism
  { $skip: (page - 1) * pageSize },
  { $limit: pageSize },
]);
```

**Edge cases:**
- `$skip` without `$sort` → non-deterministic pages (items repeat/vanish between requests).
- Large skips scan-and-discard everything skipped — for deep pagination use a range `$match` on the last-seen value instead (keyset pagination, same idea as in `05_Query_Features/02_Pagination.md`).
- Skip past the end → `[]`, no error.

---

## 3. `$count` — Count Documents Reaching This Stage

```javascript
await Product.aggregate([
  { $match: { price: { $gt: 100 } } },
  { $count: 'expensive' },
]);
// → [{ expensive: 42 }]
```

| Situation | Result |
|-----------|--------|
| N docs reach it | `[{ fieldName: N }]` |
| **Zero docs reach it** | `[]` — NOT `[{ fieldName: 0 }]`! |

```javascript
// The safe read — memorize this:
const count = result[0]?.expensive ?? 0;
```

**Position:** terminal — it collapses everything into one doc, so nothing per-document can follow it. Use `countDocuments()` for simple counts; use `$count` when counting *inside* a pipeline (especially in `$facet`).

---

## 4. `$facet` — Multiple Sub-Pipelines, One Query

Runs several independent pipelines on the **same input documents** and returns one document with one array per pipeline:

```javascript
const page = 2, pageSize = 10;

const [result] = await Product.aggregate([
  { $match: { inStock: true } },        // shared input for all facets
  { $facet: {
      data: [                            // facet 1: the page of results
        { $sort: { price: -1, _id: -1 } },
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
      ],
      totalCount: [                      // facet 2: total for pagination UI
        { $count: 'count' },
      ],
      byCategory: [                      // facet 3: sidebar filter counts
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ],
  } },
]);

// result = {
//   data: [ ...10 products ],
//   totalCount: [{ count: 87 }],     ← still an array!
//   byCategory: [ { _id: 'Electronics', count: 30 }, ... ],
// }

const total = result.totalCount[0]?.count ?? 0;   // guard the empty-count case
```

**This is THE pattern for paginated endpoints** — data + total + filters in one round trip instead of three queries.

**Edge cases:**
- Output is always **exactly one document**; each facet value is an array — even single-value facets like counts.
- Empty input → each facet returns `[]` (hence the `?? 0` guard).
- `$facet` sub-pipelines cannot contain `$facet` or `$out`, and can't use indexes internally — do the heavy `$match` **before** the `$facet`.

---

## 5. Logical Operators in `$match`

Covered in depth in `05_Query_Features/01_Query_Filters.md` — the aggregation-relevant essentials:

```javascript
{ $match: { $and: [{ price: { $gte: 100 } }, { price: { $lte: 500 } }] } }   // same field twice
{ $match: { $or: [{ category: 'Electronics' }, { price: { $gt: 1000 } }] } }
{ $match: { price: { $not: { $gt: 100 } } } }   // also matches docs missing the field
```

**Empty-array behavior (matters when building pipelines dynamically):**

| Expression | Matches |
|-----------|---------|
| `$or: []` | Throws an error |
| `$in: []` | Nothing |
| `$nin: []` | Everything |

### `$expr` — Field-to-Field and Computed Comparisons

```javascript
// Compare two fields (impossible with plain operators)
{ $match: { $expr: { $lt: ['$stock', '$reorderPoint'] } } }

// Computed comparison
{ $match: { $expr: { $lt: ['$stock', { $divide: ['$price', 10] }] } } }

// Date parts
{ $match: { $expr: { $eq: [{ $month: '$createdAt' }, 6] } } }   // June only
```

**Edge case:** don't use `$expr` for plain field-vs-literal checks (`{ $expr: { $eq: ['$status', 'done'] } }`) — the simple form `{ status: 'done' }` is equivalent and can use indexes; `$expr` mostly can't.

---

## 6. Conditional Operators

(Details + edge cases in `03_Project_And_Reshape.md`; recap:)

```javascript
// $cond — 2 outcomes
{ stockLabel: { $cond: [{ $gt: ['$stock', 0] }, 'In Stock', 'Out of Stock'] } }

// $switch — 3+ outcomes; first matching branch wins; default REQUIRED if nulls possible
{ tier: { $switch: {
    branches: [
      { case: { $gte: ['$totalSpent', 5000] }, then: 'Platinum' },
      { case: { $gte: ['$totalSpent', 1000] }, then: 'Gold' },
    ],
    default: 'Bronze',
} } }

// $ifNull — replaces ONLY null/missing (not 0/false/'')
{ description: { $ifNull: ['$description', 'No description'] } }
```

---

## 7. Math Operators

Work in `$project`, `$addFields`, inside `$group` accumulators, and in `$match` via `$expr`:

| Operator | Syntax | Edge case |
|----------|--------|-----------|
| `$add` | `{ $add: [a, b, ...] }` | Date + number = date shifted by ms |
| `$subtract` | `{ $subtract: [a, b] }` | Date − date = milliseconds |
| `$multiply` | `{ $multiply: [a, b, ...] }` | Any null → null |
| `$divide` | `{ $divide: [a, b] }` | **Guard the denominator against 0** |
| `$mod` | `{ $mod: [a, b] }` | Remainder; even check: `{ $eq: [{ $mod: ['$n', 2] }, 0] }` |
| `$abs` | `{ $abs: v }` | `-50` → `50` |
| `$ceil` / `$floor` | `{ $ceil: v }` | `-3.9` → ceil `-3`, floor `-4` |
| `$round` | `{ $round: [v, places] }` | Negative places → tens: `[145, -1]` → 150 |
| `$pow` / `$sqrt` | `{ $pow: [base, exp] }` | `$sqrt` of a negative → error/NaN |

**Complete example — customer tiers with computed metrics:**

```javascript
await Order.aggregate([
  { $group: { _id: '$customer', totalSpent: { $sum: '$total' }, orderCount: { $sum: 1 } } },
  { $addFields: {
      avgOrderValue: { $round: [{ $divide: ['$totalSpent', '$orderCount'] }, 2] },
      // orderCount is always >= 1 here (each group has at least one doc) — divide is safe
      tier: { $switch: {
          branches: [
            { case: { $gte: ['$totalSpent', 5000] }, then: 'Platinum' },
            { case: { $gte: ['$totalSpent', 1000] }, then: 'Gold' },
          ],
          default: 'Bronze',
      } },
  } },
  { $sort: { totalSpent: -1 } },
]);
```

---

## 8. Summary

### Common Mistakes

```javascript
// 1. $limit before $sort → top N of arbitrary docs
// 2. $skip without $sort → items repeat/vanish across pages
// 3. Reading $count when zero docs reached it → result is [], not [{count: 0}]
// 4. $facet totalCount without the ?? 0 guard → crash on empty datasets
// 5. Field-to-field comparison without $expr → invalid/always-false
// 6. $or: [] in a dynamically-built match → throws
```

### Key Points

1. Order of stages IS the logic: sort → limit for top-N; sort → skip → limit for pages.
2. Always add `_id` as a sort tiebreaker for pagination.
3. `$count` on empty input → `[]`; read with `result[0]?.field ?? 0`.
4. `$facet` = data + total + filter counts in one query — the standard paginated-endpoint pattern; heavy `$match` goes before it.
5. `$expr` for field-to-field comparisons only — plain form for field-vs-literal (it can use indexes).
6. Guard divisions by zero and give `$switch` a `default`.
7. 100MB per-stage limit — `allowDiskUse: true` as fallback for big sorts/groups.
