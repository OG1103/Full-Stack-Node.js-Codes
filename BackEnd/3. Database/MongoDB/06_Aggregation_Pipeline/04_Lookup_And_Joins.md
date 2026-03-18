# MongoDB $lookup & $unwind — Deep Notes

---

## 1. Overview

`$lookup` performs a **left outer join** between the current collection and another collection, embedding matched documents as an array field. `$unwind` deconstructs an array field into separate documents — one per element. Together they solve the problem of combining data from multiple collections (e.g., enriching orders with customer data, adding product details to order items) — something that `find().populate()` does automatically but without the filtering, sorting, and transformation power of an aggregation pipeline.

**Why `$lookup` instead of `.populate()`?**

| Feature | `.populate()` | `$lookup` |
|---------|--------------|-----------|
| Filter joined docs | No | Yes (pipeline syntax) |
| Sort joined docs | No | Yes (pipeline syntax) |
| Limit joined docs | No | Yes (pipeline syntax) |
| Multiple joins | Yes (chain) | Yes (multiple `$lookup` stages) |
| Works in aggregation | No | Yes |
| Returns | Mongoose documents | Plain objects |

---

## 2. Stage-by-Stage Breakdown

### `$lookup` — Simple Syntax

```javascript
{
  $lookup: {
    from: 'collectionName',      // Target MongoDB collection (lowercase, plural)
    localField: 'fieldInThis',   // Field in the current collection to match
    foreignField: 'fieldInOther', // Field in the foreign collection to match
    as: 'outputArrayName',       // Name of the new array field added to output docs
  }
}
```

**Key rules:**
1. `from` is the **MongoDB collection name** — NOT the Mongoose model name. By convention: lowercase plural. `User` model → `'users'` collection.
2. `$lookup` ALWAYS produces an **array** in the `as` field — even if there is exactly one match. If no match: empty array `[]`.
3. This is a **left outer join** — every document from the current collection passes through, regardless of whether there is a match in the foreign collection. Documents with no match get `as: []`.

**Position:** `$lookup` is an expensive operation. Always `$match` first to reduce the number of documents that need joining. Also, `$limit` before `$lookup` ensures you only join the documents you'll actually use.

**What breaks if moved:**
- `$lookup` before `$match`: joins ALL documents, then filters — wastes join operations
- `$lookup` before `$unwind` on the local array: the local array is an array of references; `$lookup` on `localField` that is itself an array works in simple syntax (MongoDB unwinds internally) but behavior differs from pipeline syntax

---

### `$lookup` — Pipeline Syntax (Advanced)

```javascript
{
  $lookup: {
    from: 'collectionName',
    let: { varName: '$localField' },  // Pass local fields as variables
    pipeline: [
      // A full aggregation pipeline that runs on the foreign collection
      { $match: { $expr: { $eq: ['$foreignField', '$$varName'] } } },
      { $sort: { ... } },
      { $limit: N },
      { $project: { ... } },
    ],
    as: 'outputArrayName',
  }
}
```

**`let` and `$$variable` syntax:**
- `let` defines variables from the parent document's fields
- Variables are accessed in the sub-pipeline with `$$` prefix
- `$$varName` (double dollar) = variable from `let`
- `$field` (single dollar) = field in the foreign collection
- `$expr` is required inside sub-pipeline `$match` to use these variables

**Why pipeline syntax:**
- Filter joined documents by multiple conditions
- Sort and limit joined results
- Project only needed fields from joined documents (reduces memory)
- Cannot do this with simple `localField`/`foreignField` syntax

---

### `$unwind` — Deconstruct Arrays

```javascript
// Simple syntax — for most use cases
{ $unwind: '$arrayField' }

// Extended syntax — for edge case control
{
  $unwind: {
    path: '$arrayField',
    preserveNullAndEmptyArrays: false,  // Default: false
    includeArrayIndex: 'indexField',    // Optional: add the array index as a field
  }
}
```

**What `$unwind` does:**
```javascript
// Input: one document
{ _id: 1, name: 'John', hobbies: ['reading', 'coding', 'gaming'] }

// After { $unwind: '$hobbies' }: three documents
{ _id: 1, name: 'John', hobbies: 'reading' }
{ _id: 1, name: 'John', hobbies: 'coding' }
{ _id: 1, name: 'John', hobbies: 'gaming' }
// The rest of the document is copied to each output doc
```

**`preserveNullAndEmptyArrays`:**
```javascript
// Without (default: false):
// Documents with hobbies: [] → DROPPED
// Documents with hobbies: null → DROPPED
// Documents missing 'hobbies' field → DROPPED

// With preserveNullAndEmptyArrays: true:
// { _id: 2, name: 'Jane', hobbies: [] }  → kept as { _id: 2, name: 'Jane', hobbies: null } or dropped based on version
// { _id: 3, name: 'Bob' }  → kept as { _id: 3, name: 'Bob' } (hobbies field absent)
```

**`includeArrayIndex`:**
```javascript
{ $unwind: { path: '$items', includeArrayIndex: 'itemIndex' } }
// Input: { items: ['a', 'b', 'c'] }
// Output:
// { items: 'a', itemIndex: 0 }
// { items: 'b', itemIndex: 1 }
// { items: 'c', itemIndex: 2 }
```

**Position matters:**
- `$unwind` before `$lookup` (on a lookup array): impossible — you haven't joined yet
- `$unwind` after `$lookup` (on the joined array): flatten the joined documents into individual docs for further processing
- `$unwind` before `$group` (on an items array in original docs): create one doc per item, then group on item properties

---

## 3. Data Flow — Step-by-Step

**Scenario:** Get each order with full customer info, for completed orders only.

**orders collection:**
```javascript
{ _id: 1, customer: ObjectId("u1"), status: 'completed', total: 200 }
{ _id: 2, customer: ObjectId("u2"), status: 'completed', total: 350 }
{ _id: 3, customer: ObjectId("u1"), status: 'cancelled', total: 150 }
```

**users collection:**
```javascript
{ _id: ObjectId("u1"), name: 'Alice', email: 'alice@example.com' }
{ _id: ObjectId("u2"), name: 'Bob',   email: 'bob@example.com' }
```

**Pipeline:**
```javascript
await Order.aggregate([
  { $match: { status: 'completed' } },
  {
    $lookup: {
      from: 'users',
      localField: 'customer',
      foreignField: '_id',
      as: 'customerInfo',
    },
  },
  { $unwind: '$customerInfo' },
  {
    $project: {
      _id: 0,
      orderId: '$_id',
      total: 1,
      customerName: '$customerInfo.name',
      customerEmail: '$customerInfo.email',
    },
  },
]);
```

**After `$match: { status: 'completed' }`:**
```javascript
{ _id: 1, customer: ObjectId("u1"), status: 'completed', total: 200 }
{ _id: 2, customer: ObjectId("u2"), status: 'completed', total: 350 }
// Order 3 (cancelled) is dropped
```

**After `$lookup`:**
```javascript
{
  _id: 1, customer: ObjectId("u1"), status: 'completed', total: 200,
  customerInfo: [{ _id: ObjectId("u1"), name: 'Alice', email: 'alice@example.com' }]
  //            ↑ Always an array, even with one match
}
{
  _id: 2, customer: ObjectId("u2"), status: 'completed', total: 350,
  customerInfo: [{ _id: ObjectId("u2"), name: 'Bob', email: 'bob@example.com' }]
}
```

**After `$unwind: '$customerInfo'`:**
```javascript
{
  _id: 1, customer: ObjectId("u1"), status: 'completed', total: 200,
  customerInfo: { _id: ObjectId("u1"), name: 'Alice', email: 'alice@example.com' }
  //            ↑ Now an object, not an array
}
{
  _id: 2, customer: ObjectId("u2"), status: 'completed', total: 350,
  customerInfo: { _id: ObjectId("u2"), name: 'Bob', email: 'bob@example.com' }
}
```

**After `$project`:**
```javascript
[
  { orderId: 1, total: 200, customerName: 'Alice', customerEmail: 'alice@example.com' },
  { orderId: 2, total: 350, customerName: 'Bob',   customerEmail: 'bob@example.com'  },
]
```

---

## 4. Operators Deep Dive

### `$lookup` Simple Syntax — All Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `from` | string | Yes | MongoDB collection name (not model name) |
| `localField` | string | Yes | Field in current documents |
| `foreignField` | string | Yes | Field in foreign collection to match against |
| `as` | string | Yes | Output array field name |

**Model-to-collection name mapping:**
```javascript
// Mongoose model name → MongoDB collection name
'User'       → 'users'
'Product'    → 'products'
'Category'   → 'categories'
'OrderItem'  → 'orderitems'
'BlogPost'   → 'blogposts'
```

**`localField` with arrays:** If `localField` is an array field (e.g., `items` is an array of ObjectIds), MongoDB matches all elements:
```javascript
// Order has: { items: [ObjectId("p1"), ObjectId("p2")] }
{ $lookup: { from: 'products', localField: 'items', foreignField: '_id', as: 'products' } }
// Produces: { products: [{ _id: "p1", ... }, { _id: "p2", ... }] }
```

---

### `$lookup` Pipeline Syntax — All Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `from` | string | Yes | Target collection |
| `let` | object | No | Variables from current document |
| `pipeline` | array | Yes | Aggregation pipeline on foreign collection |
| `as` | string | Yes | Output array field name |

**`$expr` + `$eq` inside pipeline `$match`:**
```javascript
{
  $lookup: {
    from: 'posts',
    let: { userId: '$_id' },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ['$author', '$$userId'] },     // foreign.author == local._id
              { $eq: ['$isPublished', true] },       // Only published posts
            ],
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
      { $project: { title: 1, createdAt: 1, _id: 0 } },
    ],
    as: 'recentPosts',
  }
}
```

**Multiple conditions in `$and` inside pipeline:**
- Each element of the `$and` array is an expression
- `$eq: ['$foreignField', '$$localVar']` — note: foreign field uses single `$`, local variable uses `$$`
- You MUST use `$expr` to use aggregation expressions inside `$match`

**`$sort` inside pipeline lookup:**
```javascript
// Sort joined documents before taking the first/limit
{ $sort: { createdAt: -1 } }  // Inside pipeline — sorts joined docs only
// This does NOT affect the outer pipeline's sort
```

**`$limit` inside pipeline lookup:**
```javascript
{ $limit: 5 }  // Inside pipeline — limits joined docs per outer document
// Each outer doc gets at most 5 joined docs
```

**`$project` inside pipeline lookup:**
```javascript
{ $project: { title: 1, createdAt: 1 } }  // Inside pipeline — reduces joined doc size
// Critical for performance: only pull the fields you need from the foreign collection
```

---

### `$unwind` — Behavior with Different Input Types

| Input | Default (preserveNull: false) | preserveNullAndEmptyArrays: true |
|-------|------------------------------|----------------------------------|
| `{ arr: ['a', 'b'] }` | Two docs: `{arr:'a'}`, `{arr:'b'}` | Same: two docs |
| `{ arr: ['x'] }` | One doc: `{arr:'x'}` | Same: one doc |
| `{ arr: [] }` | DROPPED (zero docs) | Kept: one doc `{arr: null}` or field absent |
| `{ arr: null }` | DROPPED | Kept: one doc with `arr: null` |
| `{ }` (missing) | DROPPED | Kept: one doc without `arr` field |

**`includeArrayIndex` use case:**
```javascript
{ $unwind: { path: '$items', includeArrayIndex: 'position' } }
// Useful when position in original array matters (e.g., first item = primary item)
```

---

### `$expr` in Pipeline `$match`

`$expr` allows aggregation expression operators inside `$match`:

```javascript
// Field-to-field comparison (requires $expr)
{ $match: { $expr: { $eq: ['$author', '$$userId'] } } }
//                        ↑ foreign field  ↑ local variable from let

// Complex condition
{ $match: { $expr: { $and: [
  { $eq: ['$author', '$$authorId'] },
  { $gt: ['$views', 100] },
  { $eq: ['$status', 'published'] },
] } } }
```

**Without `$expr`, you cannot:**
- Reference variables from `let`
- Compare two fields to each other
- Use aggregation operators like `$month`, `$size` in `$match`

---

### `$size`, `$addToSet`, `$first`, `$multiply`, `$sum` — Used After `$lookup`

After joining, you typically use these in a `$group` or `$addFields` stage:

```javascript
await Order.aggregate([
  { $match: { status: 'completed' } },
  { $unwind: '$items' },
  {
    $lookup: {
      from: 'products',
      localField: 'items.product',
      foreignField: '_id',
      as: 'productInfo',
    },
  },
  { $unwind: '$productInfo' },
  {
    $group: {
      _id: '$items.product',
      productName:      { $first: '$productInfo.name' },     // First = same for all in group
      category:         { $first: '$productInfo.category' },
      totalSold:        { $sum: '$items.quantity' },
      revenue:          { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      uniqueCustomers:  { $addToSet: '$customer' },          // Collect unique buyers
    },
  },
  {
    $addFields: {
      uniqueCustomerCount: { $size: '$uniqueCustomers' },    // Count the set
    },
  },
]);
```

---

## 5. Advanced Concepts

### Multiple `$lookup` Stages

You can chain multiple lookups to join from several collections:

```javascript
await Order.aggregate([
  // Join customer
  { $lookup: { from: 'users', localField: 'customer', foreignField: '_id', as: 'customerInfo' } },
  { $unwind: '$customerInfo' },

  // Join products for each item
  { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'productDetails' } },

  { $project: {
    total: 1,
    customer: '$customerInfo.name',
    products: '$productDetails.name',
  }},
]);
```

**Performance tip:** Each `$lookup` is expensive. Minimize the number of lookups and always project down foreign collection fields to only what you need.

---

### `preserveNullAndEmptyArrays` — Implementing LEFT JOIN Behavior

By default, `$lookup` + `$unwind` acts like an INNER JOIN (only documents with matches survive unwind). To keep documents without matches (LEFT JOIN):

```javascript
// Without preserve: orders with no matching customer are dropped after $unwind
{ $unwind: '$customerInfo' }

// With preserve: orders with no matching customer are KEPT
{ $unwind: { path: '$customerInfo', preserveNullAndEmptyArrays: true } }
// The order document is kept; customerInfo is null
```

---

### Using `$group` After `$unwind` to Aggregate Array Data

```javascript
// Count tag usage across all blog posts
await Post.aggregate([
  { $unwind: '$tags' },                                    // One doc per tag
  { $group: { _id: '$tags', count: { $sum: 1 } } },      // Count each tag
  { $sort: { count: -1 } },
  { $limit: 10 },
]);
```

```javascript
// Total revenue per product from order items
await Order.aggregate([
  { $unwind: '$items' },
  {
    $group: {
      _id: '$items.product',
      totalQty:     { $sum: '$items.quantity' },
      totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      orderCount:   { $sum: 1 },
    },
  },
  { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
  { $unwind: '$product' },
  { $project: { productName: '$product.name', totalQty: 1, totalRevenue: 1, orderCount: 1 } },
  { $sort: { totalRevenue: -1 } },
]);
```

---

### Full E-Commerce Sales Report

```javascript
const salesReport = await Order.aggregate([
  // 1. Filter relevant orders
  { $match: { status: 'completed', createdAt: { $gte: startDate } } },

  // 2. Flatten order items (one doc per item)
  { $unwind: '$items' },

  // 3. Join product details
  {
    $lookup: {
      from: 'products',
      localField: 'items.product',
      foreignField: '_id',
      as: 'productInfo',
    },
  },
  { $unwind: '$productInfo' },

  // 4. Join customer info
  {
    $lookup: {
      from: 'users',
      localField: 'customer',
      foreignField: '_id',
      as: 'customerInfo',
    },
  },
  { $unwind: '$customerInfo' },

  // 5. Group by product to get sales totals
  {
    $group: {
      _id: '$items.product',
      productName:     { $first: '$productInfo.name' },
      category:        { $first: '$productInfo.category' },
      totalSold:       { $sum: '$items.quantity' },
      revenue:         { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      uniqueCustomers: { $addToSet: '$customer' },
    },
  },

  // 6. Compute uniqueCustomerCount from the set
  { $addFields: { uniqueCustomerCount: { $size: '$uniqueCustomers' } } },

  // 7. Shape final output
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

  // 8. Sort by revenue
  { $sort: { revenue: -1 } },
  { $limit: 20 },
]);
```

---

## 6. Use Cases

### Simple — Join Orders with Customer Name
```javascript
await Order.aggregate([
  { $lookup: { from: 'users', localField: 'customer', foreignField: '_id', as: 'customerInfo' } },
  { $unwind: '$customerInfo' },
  { $project: { total: 1, customerName: '$customerInfo.name' } },
]);
```

### Simple — Count Tags Across Posts
```javascript
await Post.aggregate([
  { $unwind: '$tags' },
  { $group: { _id: '$tags', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 },
]);
```

### Intermediate — User with Their Last 5 Published Posts (Pipeline Lookup)
```javascript
await User.aggregate([
  {
    $lookup: {
      from: 'posts',
      let: { userId: '$_id' },
      pipeline: [
        { $match: { $expr: { $and: [
          { $eq: ['$author', '$$userId'] },
          { $eq: ['$isPublished', true] },
        ] } } },
        { $sort: { createdAt: -1 } },
        { $limit: 5 },
        { $project: { title: 1, createdAt: 1 } },
      ],
      as: 'recentPosts',
    },
  },
  { $project: { name: 1, email: 1, recentPosts: 1 } },
]);
```

### Advanced — Orders Keeping No-Customer Records (LEFT JOIN)
```javascript
await Order.aggregate([
  { $lookup: { from: 'users', localField: 'customer', foreignField: '_id', as: 'customerInfo' } },
  { $unwind: { path: '$customerInfo', preserveNullAndEmptyArrays: true } },
  {
    $project: {
      total: 1,
      status: 1,
      customerName: { $ifNull: ['$customerInfo.name', 'Guest'] },
    },
  },
]);
```

---

## 7. Common Mistakes

### 1. Using Model Name Instead of Collection Name in `from`
```javascript
// WRONG — 'User' is the Mongoose model name
{ $lookup: { from: 'User', ... } }

// CORRECT — MongoDB collection name is lowercase, plural
{ $lookup: { from: 'users', ... } }
```

### 2. Not Using `$unwind` After `$lookup` (Treating Array as Object)
```javascript
// After $lookup, customerInfo is an ARRAY
{ _id: 1, total: 200, customerInfo: [{ name: 'Alice', email: 'alice@...' }] }

// Accessing $customerInfo.name on an array — this returns an ARRAY of names, not a string
{ $project: { name: '$customerInfo.name' } }
// Result: { name: ['Alice'] }  ← array, not string!

// CORRECT — unwind first, then access
{ $unwind: '$customerInfo' }
{ $project: { name: '$customerInfo.name' } }
// Result: { name: 'Alice' }  ← string
```

### 3. Using `$eq` Without `$expr` in Pipeline `$match`
```javascript
// WRONG — cannot use $$ variables without $expr
{
  $lookup: {
    from: 'posts', let: { userId: '$_id' },
    pipeline: [
      { $match: { author: '$$userId' } },  // WRONG — $$userId not recognized here
    ],
    as: 'posts',
  }
}

// CORRECT — wrap in $expr
{
  $lookup: {
    from: 'posts', let: { userId: '$_id' },
    pipeline: [
      { $match: { $expr: { $eq: ['$author', '$$userId'] } } },  // CORRECT
    ],
    as: 'posts',
  }
}
```

### 4. Placing `$lookup` Before `$match`
```javascript
// WRONG — joins ALL orders, then filters
await Order.aggregate([
  { $lookup: { from: 'users', localField: 'customer', foreignField: '_id', as: 'info' } },
  { $match: { status: 'completed' } },  // Filtering after expensive join
]);

// CORRECT — filter first, join only matching docs
await Order.aggregate([
  { $match: { status: 'completed' } },  // Reduces docs before join
  { $lookup: { from: 'users', localField: 'customer', foreignField: '_id', as: 'info' } },
]);
```

### 5. Forgetting `preserveNullAndEmptyArrays` When You Need All Parent Docs
```javascript
// This effectively creates an INNER JOIN (docs without matches are dropped)
await Order.aggregate([
  { $lookup: { from: 'users', localField: 'customer', foreignField: '_id', as: 'customerInfo' } },
  { $unwind: '$customerInfo' },  // Orders with no customer match are DROPPED
]);

// For LEFT JOIN behavior (keep all orders even without customer):
await Order.aggregate([
  { $lookup: { from: 'users', localField: 'customer', foreignField: '_id', as: 'customerInfo' } },
  { $unwind: { path: '$customerInfo', preserveNullAndEmptyArrays: true } },
]);
```

### 6. Confusing `$` vs `$$` in Pipeline Lookups
```javascript
// In the pipeline sub-pipeline:
// '$fieldName'   = refers to a field in the FOREIGN collection
// '$$varName'    = refers to a variable defined in 'let' (from the LOCAL document)

{ $match: { $expr: { $eq: ['$author', '$$userId'] } } }
//                       ↑ foreign field  ↑ local variable from let: { userId: '$_id' }
```

---

## 8. Quick Reference

### `$lookup` Simple Syntax

| Parameter | Value | Notes |
|-----------|-------|-------|
| `from` | `'collectionname'` | lowercase, plural — MongoDB collection |
| `localField` | `'fieldName'` | Field in current docs |
| `foreignField` | `'fieldName'` | Field in foreign docs to match |
| `as` | `'outputName'` | Result stored as array in this field |

### `$lookup` Pipeline Syntax

| Parameter | Value | Notes |
|-----------|-------|-------|
| `from` | `'collectionname'` | Same as simple |
| `let` | `{ varName: '$localField' }` | Expose local fields as `$$varName` |
| `pipeline` | `[stages...]` | Full pipeline on foreign collection |
| `as` | `'outputName'` | Result stored as array |

### `$unwind` Options

| Option | Default | Effect |
|--------|---------|--------|
| `path` | Required | Array field to unwind |
| `preserveNullAndEmptyArrays` | `false` | `true` = keep docs with null/empty/missing array |
| `includeArrayIndex` | Not set | When set, adds original index as a field |

### Model → Collection Name

| Model | `from` value |
|-------|-------------|
| `User` | `'users'` |
| `Product` | `'products'` |
| `Order` | `'orders'` |
| `Category` | `'categories'` |
| `BlogPost` | `'blogposts'` |
| `OrderItem` | `'orderitems'` |

### Stage Order for Lookup Patterns

```
$match           ← Filter first (performance)
$limit           ← If you only need top N, limit before lookup
$lookup          ← Join foreign collection
$unwind          ← Flatten joined array (or preserveNullAndEmptyArrays)
$match           ← Optional: filter on joined fields
$group           ← Optional: aggregate after joining
$addFields       ← Optional: compute from joined data
$project         ← Shape final output
$sort            ← Order final results
$limit / $skip   ← Pagination of final results
```
