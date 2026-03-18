# MongoDB $project & $addFields — Deep Notes

---

## 1. Overview

`$project` controls the shape of documents: which fields are included, which are excluded, how fields are renamed, and what computed fields are added. `$addFields` does the same for additions but preserves all existing fields. Together they solve the problem of transforming raw database documents into the exact shape your application or API needs — without changing the stored data.

**Why `$project`/`$addFields` instead of application-level reshaping?**
- Reducing document size early in the pipeline reduces memory usage for later stages
- Computing fields in the database offloads work from Node.js
- Renaming/restructuring for API output keeps controllers clean

---

## 2. Stage-by-Stage Breakdown

### `$project` — Replace Document Shape

```javascript
{
  $project: {
    fieldToInclude: 1,            // Include this field
    fieldToExclude: 0,            // Exclude this field
    newFieldName: '$oldFieldName', // Rename a field
    computedField: <expression>,  // Compute a new value
  }
}
```

**Rules:**
1. Specifying `field: 1` includes it; everything NOT specified is excluded
2. Specifying `field: 0` excludes it; everything NOT specified is included
3. **Cannot mix** `1` and `0` in the same `$project` — except `_id: 0` alongside inclusions
4. `_id` is included by default; explicitly set `_id: 0` to exclude it

**Position in pipeline:**
- Use `$project` AFTER `$match` (to reduce fields for later stages)
- Use `$project` AFTER `$group` (to rename `_id` to a friendlier name, exclude unwanted accumulator results)
- Use `$project` AFTER `$lookup`/`$unwind` (to shape the joined document)
- Placing `$project` early to drop unused fields improves performance of later stages

**What breaks if moved/removed:**
- Removing `$project` when it renames fields means downstream stages or application code expecting the renamed field will get `undefined`
- Placing `$project` BEFORE `$group` can remove fields the accumulator needs, causing errors

---

### `$addFields` — Augment Without Replacing

```javascript
{
  $addFields: {
    newField: <expression>,
    anotherField: <expression>,
  }
}
```

`$addFields` behaves like `$project` for additions only — all existing fields pass through unchanged. Use when you want to add computed fields without having to list every existing field to preserve.

**`$project` vs `$addFields` decision:**
- Want to control WHICH fields appear: use `$project`
- Want to ADD fields to all existing ones: use `$addFields`

---

## 3. Data Flow — Step-by-Step

**Scenario:** Transform raw product documents into API-ready format with computed fields.

**Input document:**
```javascript
{
  _id: ObjectId("64b2f9c3e4a1b2c3d4e5f6a7"),
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'hashed_password_here',
  createdAt: ISODate("2024-03-15T10:30:00Z"),
  isActive: true,
  hobbies: ['reading', 'coding', 'gaming'],
  __v: 0,
}
```

**Pipeline:**
```javascript
await User.aggregate([
  { $match: { isActive: true } },
  {
    $project: {
      _id: 0,
      id: '$_id',
      displayName: { $concat: ['$firstName', ' ', '$lastName'] },
      email: 1,
      emailLower: { $toLower: '$email' },
      memberSince: { $dateToString: { format: '%B %Y', date: '$createdAt' } },
      accountAgeDays: {
        $dateDiff: { startDate: '$createdAt', endDate: '$$NOW', unit: 'day' },
      },
      hobbyCount: { $size: '$hobbies' },
      primaryHobby: { $arrayElemAt: ['$hobbies', 0] },
    },
  },
]);
```

**After `$match: { isActive: true }`:**
```javascript
// Only active users pass through; document shape unchanged
{
  _id: ObjectId("64b2f9c3..."),
  firstName: 'John', lastName: 'Doe', email: 'john@example.com',
  password: 'hashed...', createdAt: ISODate("2024-03-15..."), isActive: true,
  hobbies: ['reading', 'coding', 'gaming'], __v: 0,
}
```

**After `$project`:**
```javascript
{
  id: ObjectId("64b2f9c3..."),         // _id renamed, original _id excluded
  displayName: 'John Doe',             // computed from firstName + ' ' + lastName
  email: 'john@example.com',           // included as-is
  emailLower: 'john@example.com',      // lowercase version
  memberSince: 'March 2024',           // formatted date string
  accountAgeDays: 365,                 // computed days since creation
  hobbyCount: 3,                       // count of hobbies array
  primaryHobby: 'reading',             // first element
  // password, __v, isActive, firstName, lastName — ALL GONE (not specified)
}
```

---

## 4. Operators Deep Dive

### String Operators

#### `$concat` — Combine Strings
```javascript
{ $concat: ['$firstName', ' ', '$lastName'] }
// Joins all array elements into one string
// ['$firstName', ' ', '$lastName'] → 'John Doe'

// Edge case: if ANY element is null/missing, result is null
{ $concat: ['$firstName', ' ', '$lastName'] }
// If lastName is missing → null (not 'John ')
// Fix: use $ifNull to provide defaults
{ $concat: [{ $ifNull: ['$firstName', ''] }, ' ', { $ifNull: ['$lastName', ''] }] }
```

#### `$toUpper` / `$toLower`
```javascript
{ $toUpper: '$name' }       // 'john' → 'JOHN'
{ $toLower: '$email' }      // 'JOHN@Email.COM' → 'john@email.com'

// Edge case: null/missing field → null (no error)
```

#### `$substr` — Extract Substring
```javascript
{ $substr: ['$name', 0, 1] }    // First character: 'John' → 'J'
{ $substr: ['$code', 2, 4] }    // 4 chars starting at index 2
// Arguments: [string, startIndex, length]
// If startIndex > string length → empty string
// If length is -1 → rest of string from startIndex
```

---

### Math Operators

All math operators take arrays of arguments (two or more):

#### `$multiply`
```javascript
{ $multiply: ['$price', 1.1] }           // Single scalar
{ $multiply: ['$price', '$quantity'] }    // Two fields
{ $multiply: ['$base', '$rate', 1.05] }   // Three values (chained multiply)
// Edge case: if any argument is null/missing → null
```

#### `$add`
```javascript
{ $add: ['$price', '$shippingCost'] }    // Sum fields
{ $add: ['$price', 5.99] }              // Field + literal
// Works on dates: { $add: ['$date', 86400000] } adds 1 day (in milliseconds)
```

#### `$subtract`
```javascript
{ $subtract: ['$sellingPrice', '$costPrice'] }  // Margin
{ $subtract: ['$total', '$discount'] }
// With dates: { $subtract: ['$endDate', '$startDate'] } → milliseconds between dates
```

#### `$divide`
```javascript
{ $divide: ['$totalCost', '$quantity'] }   // Average cost per unit
// Edge case: dividing by 0 → null (MongoDB does not throw, returns null)
// Edge case: dividing by missing field → null
```

#### `$round`
```javascript
{ $round: ['$price', 2] }     // Round to 2 decimal places: 10.999 → 11.00
{ $round: ['$price', 0] }     // Round to nearest integer: 10.5 → 11
{ $round: ['$value', -1] }    // Round to nearest 10: 145 → 150
```

#### `$ceil` / `$floor` / `$abs`
```javascript
{ $ceil:  '$value' }    // Round up:  3.1 → 4,  -3.9 → -3
{ $floor: '$value' }    // Round down: 3.9 → 3,  -3.1 → -4
{ $abs:   '$profit' }   // Absolute value: -50 → 50
```

---

### Date Operators

All date operators take a date field reference or date expression:

#### `$year` / `$month` / `$dayOfMonth` / `$dayOfWeek`
```javascript
{ $year:       '$createdAt' }   // 2024
{ $month:      '$createdAt' }   // 1–12 (January = 1)
{ $dayOfMonth: '$createdAt' }   // 1–31
{ $dayOfWeek:  '$createdAt' }   // 1–7 (1 = Sunday, 7 = Saturday)
```

**Edge cases:**
- If the field is null or missing: result is `null` (no error)
- Timezone: by default, uses UTC. To use local timezone: `{ $month: { date: '$createdAt', timezone: 'America/New_York' } }`

#### `$dateToString` — Format as String
```javascript
{
  $dateToString: {
    format: '%Y-%m-%d',       // '2024-03-15'
    date: '$createdAt',
  }
}

// Format tokens:
// %Y → 4-digit year (2024)
// %m → 2-digit month (03)
// %d → 2-digit day (15)
// %H → hour (00–23)
// %M → minutes (00–59)
// %S → seconds (00–59)
// %B → full month name (March)  [non-standard, MongoDB-specific]

{
  $dateToString: {
    format: '%B %d, %Y',
    date: '$createdAt',
  }
}
// → 'March 15, 2024'
```

#### `$dateDiff` — Difference Between Dates
```javascript
{
  $dateDiff: {
    startDate: '$createdAt',
    endDate: '$$NOW',           // $$NOW = current date at query execution time
    unit: 'day',                // 'year', 'month', 'week', 'day', 'hour', 'minute', 'second'
  }
}
// Returns integer (e.g., 365 for one year in days)
```

#### `$$NOW` — Current Date/Time
`$$NOW` is a system variable that holds the current UTC date+time at the moment the aggregation runs. Use it for computing "age" or "time since":

```javascript
{ accountAgeDays: { $dateDiff: { startDate: '$createdAt', endDate: '$$NOW', unit: 'day' } } }
```

---

### Conditional Operators

#### `$cond` — If/Else
```javascript
// Object syntax (explicit, preferred for readability)
{
  $cond: {
    if: { $gte: ['$price', 100] },
    then: 'Expensive',
    else: 'Affordable',
  }
}

// Array syntax (shorthand)
{ $cond: [{ $gte: ['$price', 100] }, 'Expensive', 'Affordable'] }

// Nested $cond
{
  $cond: {
    if: { $gte: ['$price', 500] },
    then: 'Premium',
    else: {
      $cond: {
        if: { $gte: ['$price', 100] },
        then: 'Mid',
        else: 'Budget',
      },
    },
  }
}
```

**Edge cases:**
- `if` evaluates to `false`, `null`, `0`, `""`, or missing → takes `else` branch
- Both `then` and `else` are required
- If condition references missing field → condition is falsy → `else` branch taken

#### `$switch` — Multiple Conditions (switch/case)
```javascript
{
  $switch: {
    branches: [
      { case: { $lt: ['$price', 25] },  then: 'Budget' },
      { case: { $lt: ['$price', 100] }, then: 'Mid-Range' },
      { case: { $lt: ['$price', 500] }, then: 'Premium' },
    ],
    default: 'Luxury',   // Required if any document might not match any branch
  }
}
```

**Edge cases:**
- Branches are evaluated in order; first matching branch wins
- If no branch matches and there is no `default`: error
- If no branch matches and `default` is present: uses default value

**`$cond` vs `$switch`:**
- `$cond`: simple if/else — two outcomes
- `$switch`: multiple conditions — use when you have 3+ distinct cases

#### `$ifNull` — Default for Missing/Null Fields
```javascript
{ $ifNull: ['$description', 'No description available'] }
// If $description is null or the field is missing → 'No description available'
// If $description has any truthy or even falsy (like 0, false, '') value → keeps that value
// Note: only replaces null/missing, NOT 0 or false

{ $ifNull: ['$rating', 0] }
// Missing rating → 0; existing rating (even 0) → kept
```

**Comparing `$ifNull` vs `$cond`:**
```javascript
// $ifNull — only handles null/missing
{ $ifNull: ['$field', 'default'] }

// $cond — can check any condition
{ $cond: { if: '$field', then: '$field', else: 'default' } }
// This replaces null, missing, 0, false, '' with 'default'
// More powerful but different semantics
```

---

### Array Operators

#### `$size` — Count Array Elements
```javascript
{ hobbyCount: { $size: '$hobbies' } }
// Returns integer count: ['a', 'b', 'c'] → 3

// Edge case: if field is null/missing → error! Use $ifNull to protect:
{ hobbyCount: { $size: { $ifNull: ['$hobbies', []] } } }
```

#### `$arrayElemAt` — Get Element at Index
```javascript
{ firstHobby: { $arrayElemAt: ['$hobbies', 0] } }   // Index 0 = first element
{ lastHobby:  { $arrayElemAt: ['$hobbies', -1] } }  // Index -1 = last element
// Edge case: index out of bounds → null (no error)
// Edge case: field is null/missing → null
```

#### `$slice` — Get Subset of Array
```javascript
{ topThree: { $slice: ['$hobbies', 3] } }          // First 3 elements
{ lastTwo:  { $slice: ['$hobbies', -2] } }          // Last 2 elements
{ middle:   { $slice: ['$hobbies', 1, 3] } }        // 3 elements starting at index 1
// [array, n] → first n (if positive) or last n (if negative)
// [array, skip, n] → skip elements, then take n
```

#### `$in` — Check if Value is in Array
```javascript
{ likesReading: { $in: ['reading', '$hobbies'] } }
// Returns true/false: is 'reading' in the hobbies array?
// Arguments: [valueToCheck, arrayExpression]
// Edge case: if array is null/missing → false
```

---

## 5. Advanced Concepts

### Reducing Document Size for Pipeline Performance

When a `$lookup` follows later in the pipeline, project only the fields you need before the lookup. Smaller documents = faster joins:

```javascript
await Order.aggregate([
  { $match: { status: 'completed' } },
  { $project: { customer: 1, total: 1, createdAt: 1 } },  // Drop items, metadata early
  { $lookup: { from: 'users', localField: 'customer', foreignField: '_id', as: 'user' } },
]);
```

### `$project` After `$group`

After `$group`, the document has `_id` (the group key) and any accumulator fields. Use `$project` to rename `_id` and restructure:

```javascript
await Order.aggregate([
  { $group: { _id: '$customer', totalSpent: { $sum: '$total' }, orderCount: { $sum: 1 } } },
  {
    $project: {
      _id: 0,
      customer: '$_id',           // Rename _id to customer
      totalSpent: 1,
      orderCount: 1,
      avgOrder: { $divide: ['$totalSpent', '$orderCount'] },  // Add computed field
    },
  },
]);
```

### Complex Date Formatting for Display

```javascript
{
  $project: {
    formattedDate: {
      $dateToString: {
        format: '%d/%m/%Y %H:%M',   // '15/03/2024 10:30'
        date: '$createdAt',
        timezone: 'Europe/London',   // Optional: output in specific timezone
      },
    },
    year:  { $year:  '$createdAt' },
    month: { $month: '$createdAt' },
    quarter: {
      $ceil: { $divide: [{ $month: '$createdAt' }, 3] }
    }, // Q1=1, Q2=2, Q3=3, Q4=4
  }
}
```

### Sale Price Calculation with Nested Expressions

```javascript
{
  $project: {
    name: 1,
    originalPrice: '$price',
    salePrice: {
      $cond: {
        if: '$isOnSale',
        then: { $round: [{ $multiply: ['$price', 0.8] }, 2] },  // 20% off, rounded
        else: '$price',
      },
    },
    savings: {
      $cond: {
        if: '$isOnSale',
        then: { $round: [{ $multiply: ['$price', 0.2] }, 2] },  // 20% savings
        else: 0,
      },
    },
    imageCount: { $size: { $ifNull: ['$images', []] } },  // Safe size
  }
}
```

---

## 6. Use Cases

### Simple — Remove Sensitive Fields
```javascript
await User.aggregate([
  { $project: { password: 0, __v: 0, resetToken: 0 } },
]);
```

### Simple — Rename `_id` to `id`
```javascript
await User.aggregate([
  { $project: { _id: 0, id: '$_id', name: 1, email: 1 } },
]);
```

### Intermediate — User Profile Summary
```javascript
await User.aggregate([
  { $match: { isActive: true } },
  {
    $project: {
      _id: 0,
      id: '$_id',
      displayName: { $concat: ['$firstName', ' ', '$lastName'] },
      email: 1,
      memberSince: { $dateToString: { format: '%B %Y', date: '$createdAt' } },
      accountAgeDays: { $dateDiff: { startDate: '$createdAt', endDate: '$$NOW', unit: 'day' } },
    },
  },
]);
```

### Intermediate — Product Listing with Price Tiers
```javascript
await Product.aggregate([
  { $match: { inStock: true } },
  {
    $project: {
      name: 1,
      price: 1,
      priceCategory: {
        $switch: {
          branches: [
            { case: { $lt: ['$price', 25] },  then: 'Budget' },
            { case: { $lt: ['$price', 100] }, then: 'Mid-Range' },
            { case: { $lt: ['$price', 500] }, then: 'Premium' },
          ],
          default: 'Luxury',
        },
      },
      description: { $ifNull: ['$description', 'No description available'] },
    },
  },
]);
```

### Advanced — E-commerce Product with All Computed Fields
```javascript
await Product.aggregate([
  { $match: { inStock: true } },
  {
    $project: {
      name: 1,
      originalPrice: '$price',
      salePrice: {
        $cond: {
          if: '$isOnSale',
          then: { $round: [{ $multiply: ['$price', 0.8] }, 2] },
          else: '$price',
        },
      },
      savings: {
        $cond: {
          if: '$isOnSale',
          then: { $round: [{ $multiply: ['$price', 0.2] }, 2] },
          else: 0,
        },
      },
      imageCount: { $size: { $ifNull: ['$images', []] } },
      primaryImage: { $arrayElemAt: [{ $ifNull: ['$images', []] }, 0] },
      tags: { $ifNull: ['$tags', []] },
      tagCount: { $size: { $ifNull: ['$tags', []] } },
    },
  },
  { $sort: { salePrice: 1 } },
]);
```

---

## 7. Common Mistakes

### 1. Mixing Include and Exclude
```javascript
// WRONG — cannot mix 1 and 0 (throws error)
{ $project: { name: 1, email: 1, password: 0 } }

// CORRECT — include specific fields
{ $project: { name: 1, email: 1 } }                    // password excluded implicitly

// CORRECT — exclude specific fields
{ $project: { password: 0, __v: 0 } }                  // name, email included implicitly

// Exception: _id: 0 CAN be mixed with inclusions
{ $project: { _id: 0, name: 1, email: 1 } }            // VALID
```

### 2. Using `$size` on a Potentially Null/Missing Field
```javascript
// WRONG — throws error if hobbies is null or field doesn't exist
{ hobbyCount: { $size: '$hobbies' } }

// CORRECT — protect with $ifNull
{ hobbyCount: { $size: { $ifNull: ['$hobbies', []] } } }
```

### 3. Forgetting `$` Prefix on Field References
```javascript
// WRONG — 'name' is a literal string, not a field reference
{ newName: 'name' }    // Output: { newName: 'name' }

// CORRECT
{ newName: '$name' }   // Output: { newName: 'John' } (the actual field value)
```

### 4. `$concat` with Null Fields Returning Null
```javascript
// WRONG — if middleName is missing, entire result is null
{ displayName: { $concat: ['$firstName', ' ', '$middleName', ' ', '$lastName'] } }

// CORRECT — provide defaults for optional fields
{
  displayName: {
    $concat: [
      { $ifNull: ['$firstName', ''] },
      ' ',
      { $ifNull: ['$middleName', ''] },
      ' ',
      { $ifNull: ['$lastName', ''] },
    ],
  }
}
```

### 5. Using `$project` After `$group` Without Knowing the New Field Names
```javascript
// After $group, fields are: _id + whatever you named in accumulators
await Order.aggregate([
  { $group: { _id: '$customer', totalSpent: { $sum: '$total' } } },
  { $project: { customer: '$customer', total: '$total' } },  // WRONG — fields don't exist anymore
  { $project: { customer: '$_id', totalSpent: 1 } },        // CORRECT
]);
```

### 6. `$switch` Without `default` When a Branch Might Not Match
```javascript
// WRONG — if price is null/missing, no branch matches → error
{
  $switch: {
    branches: [
      { case: { $lt: ['$price', 100] }, then: 'Cheap' },
      { case: { $gte: ['$price', 100] }, then: 'Expensive' },
    ],
    // Missing default — null price causes error
  }
}

// CORRECT
{
  $switch: {
    branches: [
      { case: { $lt: ['$price', 100] }, then: 'Cheap' },
      { case: { $gte: ['$price', 100] }, then: 'Expensive' },
    ],
    default: 'Unknown',
  }
}
```

---

## 8. Quick Reference

### `$project` / `$addFields` Field Operations

| Operation | Syntax | Example |
|-----------|--------|---------|
| Include field | `field: 1` | `name: 1` |
| Exclude field | `field: 0` | `password: 0` |
| Rename field | `newName: '$oldName'` | `id: '$_id'` |
| Exclude `_id` | `_id: 0` | Mixed with inclusions is OK |
| Add computed | `field: <expression>` | `total: { $multiply: [...] }` |

### String Operators

| Operator | Syntax | Notes |
|----------|--------|-------|
| `$concat` | `{ $concat: [str1, str2, ...] }` | null in any arg → null result |
| `$toUpper` | `{ $toUpper: '$field' }` | null → null |
| `$toLower` | `{ $toLower: '$field' }` | null → null |
| `$substr` | `{ $substr: ['$field', start, len] }` | Length -1 = rest of string |

### Math Operators

| Operator | Syntax | Edge Case |
|----------|--------|-----------|
| `$multiply` | `{ $multiply: [a, b] }` | null arg → null |
| `$add` | `{ $add: [a, b] }` | Works on dates (ms) |
| `$subtract` | `{ $subtract: [a, b] }` | Date diff → ms |
| `$divide` | `{ $divide: [a, b] }` | Divide by 0 → null |
| `$round` | `{ $round: [val, places] }` | Negative places rounds to 10s |
| `$ceil` | `{ $ceil: val }` | Round up |
| `$floor` | `{ $floor: val }` | Round down |
| `$abs` | `{ $abs: val }` | Absolute value |

### Date Operators

| Operator | Returns | Notes |
|----------|---------|-------|
| `$year` | Integer | UTC by default |
| `$month` | 1–12 | UTC by default |
| `$dayOfMonth` | 1–31 | UTC by default |
| `$dayOfWeek` | 1–7 (Sun=1) | UTC by default |
| `$dateToString` | String | Use `format` and optional `timezone` |
| `$dateDiff` | Integer | Specify `startDate`, `endDate`, `unit` |
| `$$NOW` | Date | Current UTC time at query execution |

### Conditional Operators

| Operator | Syntax | Use When |
|----------|--------|----------|
| `$cond` | `{ $cond: { if, then, else } }` | Two outcomes |
| `$switch` | `{ $switch: { branches: [...], default } }` | 3+ outcomes |
| `$ifNull` | `{ $ifNull: [expr, default] }` | Replace null/missing only |

### Array Operators

| Operator | Syntax | Edge Case |
|----------|--------|-----------|
| `$size` | `{ $size: '$arr' }` | null field → error; wrap with `$ifNull` |
| `$arrayElemAt` | `{ $arrayElemAt: ['$arr', index] }` | Out of bounds → null |
| `$slice` | `{ $slice: ['$arr', n] }` or `['$arr', skip, n]` | n < 0 = from end |
| `$in` | `{ $in: [value, '$arr'] }` | null array → false |
