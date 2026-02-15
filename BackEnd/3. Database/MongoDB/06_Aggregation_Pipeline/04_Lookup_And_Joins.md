# Mongoose — $lookup & $unwind (Joins)

`$lookup` performs a **left outer join** between two collections, similar to SQL JOINs. `$unwind` deconstructs array fields into individual documents. They're often used together.

---

## 1. `$lookup` — Join Collections

### Basic Syntax

```javascript
{
  $lookup: {
    from: 'collectionName',     // The collection to join with
    localField: 'fieldInThis',  // Field in the current collection
    foreignField: 'fieldInOther', // Field in the foreign collection
    as: 'outputArrayName',      // Name for the resulting array
  }
}
```

### Simple Example

```javascript
// Join orders with user data
const result = await Order.aggregate([
  {
    $lookup: {
      from: 'users',           // Collection name (lowercase, plural)
      localField: 'customer',  // Field in orders
      foreignField: '_id',     // Field in users
      as: 'customerInfo',      // Output field name
    },
  },
]);

// Result:
// {
//   _id: ..., total: 150, customer: ObjectId("..."),
//   customerInfo: [
//     { _id: ..., name: 'John', email: 'john@...' }
//   ]
// }
```

**Note:** `from` uses the **MongoDB collection name** (lowercase, plural), not the Mongoose model name.

| Model Name | `from` Value |
|-----------|-------------|
| `'User'` | `'users'` |
| `'Product'` | `'products'` |
| `'Category'` | `'categories'` |
| `'OrderItem'` | `'orderitems'` |

### `$lookup` Always Returns an Array

Even if there's only one match, the result is an array. Use `$unwind` or `$arrayElemAt` to get a single object.

---

## 2. `$unwind` — Deconstruct Arrays

Converts an array field into individual documents — one document per array element.

### How It Works

```javascript
// Before $unwind:
{ _id: 1, name: 'John', hobbies: ['reading', 'coding', 'gaming'] }

// After $unwind on hobbies:
{ _id: 1, name: 'John', hobbies: 'reading' }
{ _id: 1, name: 'John', hobbies: 'coding' }
{ _id: 1, name: 'John', hobbies: 'gaming' }
```

### Syntax

```javascript
// Simple
{ $unwind: '$arrayField' }

// With options
{
  $unwind: {
    path: '$arrayField',
    preserveNullAndEmptyArrays: false,  // Default: false
    includeArrayIndex: 'index',         // Optional: add index field
  }
}
```

### `preserveNullAndEmptyArrays`

```javascript
// Without preserveNullAndEmptyArrays (default: false):
// Documents with empty/missing arrays are DROPPED

// With preserveNullAndEmptyArrays: true:
// Documents with empty/missing arrays are KEPT (field set to null)
{ $unwind: { path: '$tags', preserveNullAndEmptyArrays: true } }
```

---

## 3. `$lookup` + `$unwind` — Common Pattern

Since `$lookup` returns an array, use `$unwind` to flatten it to a single object:

```javascript
const result = await Order.aggregate([
  // Join with users
  {
    $lookup: {
      from: 'users',
      localField: 'customer',
      foreignField: '_id',
      as: 'customerInfo',
    },
  },
  // Flatten the array to a single object
  {
    $unwind: '$customerInfo',
  },
  // Now customerInfo is an object, not an array
  {
    $project: {
      total: 1,
      customerName: '$customerInfo.name',
      customerEmail: '$customerInfo.email',
      createdAt: 1,
    },
  },
]);

// Result:
// { _id: ..., total: 150, customerName: 'John', customerEmail: 'john@...', createdAt: ... }
```

### Preserve Orders Without Customers

```javascript
{
  $unwind: {
    path: '$customerInfo',
    preserveNullAndEmptyArrays: true,  // Keep orders even if no customer match
  }
}
```

---

## 4. Multiple Lookups

```javascript
const result = await Order.aggregate([
  // Join customer
  {
    $lookup: {
      from: 'users',
      localField: 'customer',
      foreignField: '_id',
      as: 'customerInfo',
    },
  },
  { $unwind: '$customerInfo' },
  // Join products for each item
  {
    $lookup: {
      from: 'products',
      localField: 'items.product',
      foreignField: '_id',
      as: 'productDetails',
    },
  },
  {
    $project: {
      total: 1,
      customer: '$customerInfo.name',
      products: '$productDetails.name',
      createdAt: 1,
    },
  },
]);
```

---

## 5. `$lookup` with Pipeline (Advanced)

For more control over the joined data, use the pipeline syntax:

```javascript
const result = await User.aggregate([
  {
    $lookup: {
      from: 'posts',
      let: { userId: '$_id' },          // Variables from the parent
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$author', '$$userId'] },  // Match author to user
                { $eq: ['$isPublished', true] },    // Only published posts
              ],
            },
          },
        },
        { $sort: { createdAt: -1 } },
        { $limit: 5 },                             // Only latest 5
        { $project: { title: 1, createdAt: 1 } },  // Only these fields
      ],
      as: 'recentPosts',
    },
  },
]);
```

This is more powerful than the basic syntax because you can:
- Filter the joined documents
- Sort and limit them
- Project only needed fields
- Use multiple conditions

---

## 6. Unwind for Array Analytics

### Count Tags

```javascript
const tagCounts = await Post.aggregate([
  { $unwind: '$tags' },
  {
    $group: {
      _id: '$tags',
      count: { $sum: 1 },
    },
  },
  { $sort: { count: -1 } },
  { $limit: 10 },
]);
// [
//   { _id: 'javascript', count: 45 },
//   { _id: 'react', count: 38 },
// ]
```

### Analyze Order Items

```javascript
const itemAnalysis = await Order.aggregate([
  { $unwind: '$items' },
  {
    $group: {
      _id: '$items.product',
      totalQuantity: { $sum: '$items.quantity' },
      totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      orderCount: { $sum: 1 },
    },
  },
  {
    $lookup: {
      from: 'products',
      localField: '_id',
      foreignField: '_id',
      as: 'product',
    },
  },
  { $unwind: '$product' },
  {
    $project: {
      productName: '$product.name',
      totalQuantity: 1,
      totalRevenue: 1,
      orderCount: 1,
    },
  },
  { $sort: { totalRevenue: -1 } },
]);
```

---

## 7. Complete Example: E-Commerce Report

```javascript
const salesReport = await Order.aggregate([
  // Filter completed orders
  { $match: { status: 'completed', createdAt: { $gte: startDate } } },

  // Flatten order items
  { $unwind: '$items' },

  // Join product details
  {
    $lookup: {
      from: 'products',
      localField: 'items.product',
      foreignField: '_id',
      as: 'productInfo',
    },
  },
  { $unwind: '$productInfo' },

  // Join customer info
  {
    $lookup: {
      from: 'users',
      localField: 'customer',
      foreignField: '_id',
      as: 'customerInfo',
    },
  },
  { $unwind: '$customerInfo' },

  // Group by product
  {
    $group: {
      _id: '$items.product',
      productName: { $first: '$productInfo.name' },
      category: { $first: '$productInfo.category' },
      totalSold: { $sum: '$items.quantity' },
      revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      uniqueCustomers: { $addToSet: '$customer' },
    },
  },

  // Add computed fields
  {
    $addFields: {
      uniqueCustomerCount: { $size: '$uniqueCustomers' },
    },
  },

  // Clean up output
  {
    $project: {
      _id: 0,
      productName: 1,
      category: 1,
      totalSold: 1,
      revenue: 1,
      uniqueCustomerCount: 1,
    },
  },

  // Sort by revenue
  { $sort: { revenue: -1 } },
  { $limit: 20 },
]);
```

---

## 8. Summary

| Stage | Purpose | Example |
|-------|---------|---------|
| `$lookup` | Join collections | `from: 'users', localField, foreignField` |
| `$unwind` | Flatten arrays | `$unwind: '$items'` |
| `preserveNullAndEmptyArrays` | Keep docs with empty arrays | `true` on unwind |
| Pipeline `$lookup` | Advanced join with filtering | `let` + `pipeline` syntax |

### Key Points

1. `$lookup` always returns an **array** — use `$unwind` to flatten to a single object
2. `from` uses the **collection name** (lowercase, plural), not the model name
3. Use `preserveNullAndEmptyArrays: true` to keep documents without matches (like LEFT JOIN)
4. Pipeline `$lookup` gives you **full query power** over joined documents
5. `$unwind` creates one document per array element — useful for per-item analytics
6. Combine `$unwind` + `$group` to aggregate array data (tag counts, item totals)
