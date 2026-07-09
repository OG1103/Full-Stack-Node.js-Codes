# MongoDB `$project` & `$addFields` — Reshaping Documents

`$project` controls the **shape** of documents: which fields appear, renames, and computed fields. `$addFields` adds computed fields while **keeping everything else**.

**Which one to use:**

| Goal | Stage |
|------|-------|
| Control exactly which fields appear | `$project` |
| Just add fields to what's already there | `$addFields` |

---

## 1. `$project` — The Rules

```javascript
{
  $project: {
    name: 1,                    // include
    password: 0,                // exclude
    id: '$_id',                 // rename (new name: '$oldField')
    total: { $multiply: ['$price', '$qty'] },   // computed
  }
}
```

| Rule | Detail |
|------|--------|
| Include mode | Listing `field: 1` → ONLY listed fields (+ `_id`) appear |
| Exclude mode | Listing `field: 0` → everything EXCEPT listed fields appears |
| **No mixing** | `{ name: 1, password: 0 }` **throws an error** |
| The exception | `_id: 0` CAN be combined with inclusions |

```javascript
// WRONG — throws "Cannot do exclusion on field password in inclusion projection"
{ $project: { name: 1, password: 0 } }

// CORRECT — pick one mode
{ $project: { name: 1, email: 1 } }        // include mode
{ $project: { password: 0, __v: 0 } }      // exclude mode
{ $project: { _id: 0, name: 1 } }          // the allowed exception
```

**Rename edge case — the `$` prefix:**

```javascript
{ newName: 'name' }    // WRONG — literal string: every doc gets newName: 'name'
{ newName: '$name' }   // CORRECT — field reference: newName: 'John'
```

---

## 2. `$addFields` — Augment Without Replacing

```javascript
{
  $addFields: {
    priceWithTax: { $multiply: ['$price', 1.1] },
    isExpensive: { $gte: ['$price', 100] },
  }
}
// All original fields still present + the new ones
```

**Edge case:** `$addFields` with an existing field name **overwrites** that field — handy for normalizing (`{ $addFields: { email: { $toLower: '$email' } } }`), dangerous if accidental.

---

## 3. Worked Example

**Input:**

```javascript
{
  _id: ObjectId("64b2..."), firstName: 'John', lastName: 'Doe',
  email: 'john@example.com', password: 'hashed...',
  createdAt: ISODate("2024-03-15"), hobbies: ['reading', 'coding', 'gaming'],
}
```

**Pipeline:**

```javascript
await User.aggregate([
  { $project: {
      _id: 0,
      id: '$_id',
      displayName: { $concat: ['$firstName', ' ', '$lastName'] },
      email: 1,
      memberSince: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
      hobbyCount: { $size: { $ifNull: ['$hobbies', []] } },
      primaryHobby: { $arrayElemAt: ['$hobbies', 0] },
  } },
]);
```

**Output:**

```javascript
{
  id: ObjectId("64b2..."),
  displayName: 'John Doe',
  email: 'john@example.com',
  memberSince: '2024-03',
  hobbyCount: 3,
  primaryHobby: 'reading',
  // password, firstName, lastName, __v — all gone (include mode)
}
```

---

## 4. Operators by Category (with edge cases)

### String Operators

| Operator | Example | Edge case |
|----------|---------|-----------|
| `$concat` | `{ $concat: ['$first', ' ', '$last'] }` | **Any null/missing arg → whole result is `null`** |
| `$toUpper` / `$toLower` | `{ $toLower: '$email' }` | null → null, no error |
| `$substr` | `{ $substr: ['$name', 0, 1] }` | `[str, start, length]`; length `-1` = rest of string |

**The `$concat` null trap and its fix:**

```javascript
// If middleName is missing → displayName is null, not 'John Doe'
{ $concat: ['$firstName', ' ', '$middleName'] }

// Fix — default optional parts to '':
{ $concat: ['$firstName', ' ', { $ifNull: ['$middleName', ''] }] }
```

### Math Operators

| Operator | Example | Edge case |
|----------|---------|-----------|
| `$add` | `{ $add: ['$price', '$tax'] }` | On a date + number → adds milliseconds |
| `$subtract` | `{ $subtract: ['$sell', '$cost'] }` | Two dates → difference in ms |
| `$multiply` | `{ $multiply: ['$price', '$qty'] }` | Any null arg → null |
| `$divide` | `{ $divide: ['$total', '$count'] }` | **Divide by 0 → error in match contexts / null-safety varies — guard the denominator** |
| `$round` | `{ $round: ['$val', 2] }` | Negative places rounds to tens: `[145, -1]` → 150 |
| `$ceil` / `$floor` / `$abs` | `{ $ceil: '$val' }` | `-3.9` → ceil `-3`, floor `-4` |

**Safe division pattern:**

```javascript
{ avg: { $cond: [{ $eq: ['$count', 0] }, 0, { $divide: ['$total', '$count'] }] } }
```

### Date Operators

| Operator | Returns | Edge case |
|----------|---------|-----------|
| `$year` / `$month` / `$dayOfMonth` | Integer (month 1–12) | null/missing date → null |
| `$dayOfWeek` | 1 (Sunday) – 7 (Saturday) | Not 0-indexed, not Monday-first! |
| `$dateToString` | Formatted string | `format: '%Y-%m-%d %H:%M'`; optional `timezone` |
| `$dateDiff` | Integer | `{ startDate, endDate, unit: 'day' }` |
| `$$NOW` | Current datetime | Evaluated once per query, UTC |

```javascript
// Account age in days
{ accountAgeDays: { $dateDiff: { startDate: '$createdAt', endDate: '$$NOW', unit: 'day' } } }

// All date operators use UTC by default — pass a timezone for local results:
{ $month: { date: '$createdAt', timezone: 'Africa/Cairo' } }
```

### Conditional Operators

| Operator | Use when | Edge case |
|----------|----------|-----------|
| `$cond` | 2 outcomes (if/else) | Falsy `if` (null/0/''/missing) → else branch |
| `$switch` | 3+ outcomes | **No matching branch + no `default` → ERROR** |
| `$ifNull` | Default for null/missing | Does NOT replace `0`, `false`, or `''` |

```javascript
// $cond — both syntaxes
{ $cond: { if: { $gte: ['$price', 100] }, then: 'Expensive', else: 'Affordable' } }
{ $cond: [{ $gte: ['$price', 100] }, 'Expensive', 'Affordable'] }   // array shorthand

// $switch — first matching branch wins, evaluated in order
{
  $switch: {
    branches: [
      { case: { $lt: ['$price', 25] },  then: 'Budget' },
      { case: { $lt: ['$price', 100] }, then: 'Mid-Range' },
      { case: { $lt: ['$price', 500] }, then: 'Premium' },
    ],
    default: 'Luxury',   // ALWAYS provide — a null price matches no branch → error without it
  }
}

// $ifNull vs $cond for defaults
{ $ifNull: ['$rating', 0] }   // null/missing → 0; an actual 0 stays 0 ✓
{ $cond: { if: '$rating', then: '$rating', else: 0 } }   // ALSO replaces 0/false/'' — different!
```

### Array Operators

| Operator | Example | Edge case |
|----------|---------|-----------|
| `$size` | `{ $size: '$tags' }` | **null/missing field → ERROR** — wrap with `$ifNull` |
| `$arrayElemAt` | `{ $arrayElemAt: ['$tags', 0] }` | `-1` = last; out of bounds → null (no error) |
| `$slice` | `{ $slice: ['$tags', 3] }` | `[arr, n]` first n; `[arr, skip, n]`; negative n = from end |
| `$in` | `{ $in: ['reading', '$hobbies'] }` | `[value, array]` order; null array → false |

**The `$size` protection pattern (memorize this):**

```javascript
// WRONG — throws "The argument to $size must be an array" if field is null/missing
{ hobbyCount: { $size: '$hobbies' } }

// CORRECT
{ hobbyCount: { $size: { $ifNull: ['$hobbies', []] } } }
```

---

## 5. Common Positions in a Pipeline

```javascript
// After $group — rename _id and add derived metrics
await Order.aggregate([
  { $group: { _id: '$customer', totalSpent: { $sum: '$total' }, orderCount: { $sum: 1 } } },
  { $project: {
      _id: 0,
      customer: '$_id',                                     // friendlier name
      totalSpent: 1,
      avgOrder: { $round: [{ $divide: ['$totalSpent', '$orderCount'] }, 2] },
  } },
]);

// Before $lookup / $group — drop big unused fields early (performance)
{ $project: { customer: 1, total: 1, createdAt: 1 } }
```

**Edge case:** `$project` placed **before** `$group` that removes a field the accumulator needs → the accumulator sees missing values (sums become 0, avgs become null) with **no error**. Verify projected fields cover everything downstream stages reference.

---

## 6. Summary

### Key Points

1. `$project` include mode and exclude mode can't be mixed — only `_id: 0` crosses over.
2. Renames need the `$` prefix (`id: '$_id'`) — without it you assign a literal string.
3. `$concat` with any null part → null; wrap optionals in `$ifNull`.
4. `$size` on null/missing → **error**; `{ $size: { $ifNull: ['$arr', []] } }` is the safe form.
5. `$switch` without `default` errors when no branch matches (nulls!). Always provide one.
6. `$ifNull` only fixes null/missing — `0`, `false`, `''` pass through.
7. Dates are UTC by default; `$dayOfWeek` is 1=Sunday.
8. Project early to shrink docs before expensive stages — but never project away fields a later stage needs.
