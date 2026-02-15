# Mongoose — $project (Reshape Documents)

The `$project` stage controls which fields appear in the output. It can include/exclude fields, rename them, and create computed fields with expressions.

---

## 1. Basic Field Selection

### Include Fields

```javascript
const result = await User.aggregate([
  {
    $project: {
      name: 1,        // Include
      email: 1,       // Include
      // _id is included by default
    },
  },
]);
// { _id: ..., name: 'John', email: 'john@...' }
```

### Exclude Fields

```javascript
const result = await User.aggregate([
  {
    $project: {
      password: 0,     // Exclude
      __v: 0,          // Exclude
    },
  },
]);
// Returns all fields EXCEPT password and __v
```

### Exclude `_id`

```javascript
const result = await User.aggregate([
  {
    $project: {
      _id: 0,          // Exclude _id
      name: 1,
      email: 1,
    },
  },
]);
// { name: 'John', email: 'john@...' }
```

**Note:** You cannot mix inclusion and exclusion (except for `_id`). Either include specific fields OR exclude specific fields.

---

## 2. Rename Fields

```javascript
const result = await User.aggregate([
  {
    $project: {
      _id: 0,
      userId: '$_id',           // Rename _id to userId
      fullName: '$name',        // Rename name to fullName
      contactEmail: '$email',   // Rename email to contactEmail
    },
  },
]);
// { userId: ObjectId("..."), fullName: 'John', contactEmail: 'john@...' }
```

---

## 3. Computed Fields

### String Operations

```javascript
const result = await User.aggregate([
  {
    $project: {
      name: 1,
      email: 1,
      // Concatenate fields
      displayName: {
        $concat: ['$firstName', ' ', '$lastName'],
      },
      // Uppercase
      nameUpper: { $toUpper: '$name' },
      // Lowercase
      emailLower: { $toLower: '$email' },
      // Substring
      initials: { $substr: ['$name', 0, 1] },
    },
  },
]);
```

### Math Operations

```javascript
const result = await Product.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      // Multiply
      priceWithTax: { $multiply: ['$price', 1.1] },
      // Add
      priceWithShipping: { $add: ['$price', 5.99] },
      // Subtract
      discount: { $subtract: ['$price', '$salePrice'] },
      // Divide
      pricePerUnit: { $divide: ['$totalPrice', '$quantity'] },
      // Round
      roundedPrice: { $round: ['$price', 2] },
    },
  },
]);
```

### Date Operations

```javascript
const result = await Order.aggregate([
  {
    $project: {
      total: 1,
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' },
      day: { $dayOfMonth: '$createdAt' },
      dayOfWeek: { $dayOfWeek: '$createdAt' },   // 1 (Sun) - 7 (Sat)
      formattedDate: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$createdAt',
        },
      },
    },
  },
]);
```

### Conditional Fields

```javascript
const result = await Product.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      // If/else condition
      priceCategory: {
        $cond: {
          if: { $gte: ['$price', 100] },
          then: 'Expensive',
          else: 'Affordable',
        },
      },
      // Switch (multiple conditions)
      priceRange: {
        $switch: {
          branches: [
            { case: { $lt: ['$price', 25] }, then: 'Budget' },
            { case: { $lt: ['$price', 100] }, then: 'Mid-Range' },
            { case: { $lt: ['$price', 500] }, then: 'Premium' },
          ],
          default: 'Luxury',
        },
      },
      // Null check
      description: { $ifNull: ['$description', 'No description available'] },
    },
  },
]);
```

### Array Operations

```javascript
const result = await User.aggregate([
  {
    $project: {
      name: 1,
      // Array size
      hobbyCount: { $size: '$hobbies' },
      // First element
      primaryHobby: { $arrayElemAt: ['$hobbies', 0] },
      // Slice
      topThreeHobbies: { $slice: ['$hobbies', 3] },
      // Check if value is in array
      likesReading: { $in: ['reading', '$hobbies'] },
    },
  },
]);
```

---

## 4. `$addFields` — Add Without Removing

`$project` replaces the document shape (only included fields survive). `$addFields` adds new fields while keeping all existing ones:

```javascript
const result = await Product.aggregate([
  {
    $addFields: {
      priceWithTax: { $multiply: ['$price', 1.1] },
      isExpensive: { $gte: ['$price', 100] },
    },
  },
]);
// Original fields + priceWithTax + isExpensive
```

Use `$addFields` when you want to **augment** documents without specifying every field to keep.

---

## 5. Practical Examples

### User Profile Summary

```javascript
const result = await User.aggregate([
  { $match: { isActive: true } },
  {
    $project: {
      _id: 0,
      id: '$_id',
      displayName: { $concat: ['$firstName', ' ', '$lastName'] },
      email: 1,
      memberSince: {
        $dateToString: { format: '%B %Y', date: '$createdAt' },
      },
      accountAge: {
        $dateDiff: {
          startDate: '$createdAt',
          endDate: '$$NOW',
          unit: 'day',
        },
      },
    },
  },
]);
```

### Product Listing

```javascript
const result = await Product.aggregate([
  { $match: { inStock: true } },
  {
    $project: {
      name: 1,
      price: 1,
      salePrice: {
        $cond: {
          if: '$isOnSale',
          then: { $multiply: ['$price', 0.8] },  // 20% off
          else: '$price',
        },
      },
      savings: {
        $cond: {
          if: '$isOnSale',
          then: { $subtract: ['$price', { $multiply: ['$price', 0.8] }] },
          else: 0,
        },
      },
      imageCount: { $size: { $ifNull: ['$images', []] } },
    },
  },
  { $sort: { salePrice: 1 } },
]);
```

---

## 6. Summary

| Operation | Expression | Example |
|-----------|-----------|---------|
| Include field | `field: 1` | `name: 1` |
| Exclude field | `field: 0` | `password: 0` |
| Rename | `newName: '$oldName'` | `userId: '$_id'` |
| Concatenate | `$concat` | `$concat: ['$first', ' ', '$last']` |
| Math | `$multiply`, `$add`, `$subtract`, `$divide` | `$multiply: ['$price', 1.1]` |
| Conditional | `$cond`, `$switch`, `$ifNull` | `$cond: { if, then, else }` |
| Date | `$year`, `$month`, `$dateToString` | `$year: '$createdAt'` |
| Array | `$size`, `$arrayElemAt`, `$slice` | `$size: '$tags'` |
| Add fields | `$addFields` | Keeps all fields + adds new ones |

### Key Points

1. `$project` **replaces** the document shape — only specified fields appear
2. `$addFields` **augments** — keeps all fields and adds new ones
3. Cannot mix inclusion (`1`) and exclusion (`0`) except for `_id`
4. Use `$` prefix to reference field values (`'$price'`)
5. Use `$cond` for if/else and `$switch` for multiple conditions
6. Use `$ifNull` to provide defaults for missing fields
