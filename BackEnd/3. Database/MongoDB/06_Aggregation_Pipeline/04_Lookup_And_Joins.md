# MongoDB `$lookup` & `$unwind` — Joins

`$lookup` performs a **left outer join** with another collection, embedding matches as an array field. `$unwind` flattens an array into one document per element. Together they replace `.populate()` when you need filtering, sorting, or aggregation power over joined data.

**`.populate()` vs `$lookup`:**

| Feature | `.populate()` | `$lookup` |
|---------|--------------|-----------|
| Filter/sort/limit joined docs | Basic | Full pipeline power |
| Execution | Extra query per path | Single server-side pipeline |
| Returns | Mongoose documents | Plain objects |
| Best for | Simple CRUD reads | Reports, complex joins |

---

## 1. `$lookup` — Simple Syntax

```javascript
{
  $lookup: {
    from: 'users',              // MongoDB COLLECTION name (not model name!)
    localField: 'customer',     // field in the current docs
    foreignField: '_id',        // field in the foreign collection
    as: 'customerInfo',         // output field — ALWAYS an array
  }
}
```

### The Three Rules

**1. `from` is the collection name, not the model name.** Mongoose pluralizes + lowercases model names:

| Model | `from` value |
|-------|-------------|
| `User` | `'users'` |
| `Category` | `'categories'` |
| `OrderItem` | `'orderitems'` |

**Edge case:** a wrong `from` (e.g., `'User'`) does NOT throw — the join simply finds nothing and every doc gets `as: []`. Silent empty results → check `from` first.

**2. The output is ALWAYS an array** — even for exactly one match:

| Situation | `as` field contains |
|-----------|---------------------|
| One match | `[ { ...doc } ]` — array of one |
| Many matches | `[ {...}, {...} ]` |
| No match | `[]` — empty array (doc still passes through) |

**3. It's a LEFT join** — every input document survives, matched or not.

### Edge Case — `localField` Is an Array

If `localField` holds an array of ids, MongoDB matches all of them:

```javascript
// Order: { items: [ObjectId("p1"), ObjectId("p2")] }
{ $lookup: { from: 'products', localField: 'items', foreignField: '_id', as: 'products' } }
// → products: [ {p1 doc}, {p2 doc} ]
```

---

## 2. `$unwind` — Flatten Arrays

```javascript
{ $unwind: '$customerInfo' }              // simple form

{ $unwind: {                               // extended form
    path: '$customerInfo',
    preserveNullAndEmptyArrays: true,      // keep docs with no matches (default: false)
    includeArrayIndex: 'idx',              // optionally record the element's index
} }
```

**What it does:**

```javascript
// Input: { _id: 1, name: 'John', hobbies: ['reading', 'coding'] }
// After { $unwind: '$hobbies' }:
{ _id: 1, name: 'John', hobbies: 'reading' }
{ _id: 1, name: 'John', hobbies: 'coding' }
```

### The Critical Default — Docs Get DROPPED

| Input | Default | With `preserveNullAndEmptyArrays: true` |
|-------|---------|------------------------------------------|
| `{ arr: ['a', 'b'] }` | 2 docs | 2 docs |
| `{ arr: [] }` | **DROPPED** | 1 doc (field absent) |
| `{ arr: null }` | **DROPPED** | 1 doc (`arr: null`) |
| field missing | **DROPPED** | 1 doc (field absent) |

**This makes `$lookup` + `$unwind` an INNER join by default:** orders whose customer was deleted vanish silently. To keep them (true LEFT join):

```javascript
{ $unwind: { path: '$customerInfo', preserveNullAndEmptyArrays: true } }
// then guard nulls downstream:
{ $project: { customerName: { $ifNull: ['$customerInfo.name', 'Guest'] } } }
```

---

## 3. Worked Example — Join + Flatten + Shape

```javascript
// orders: { _id: 1, customer: ObjectId("u1"), status: 'completed', total: 200 }
// users:  { _id: ObjectId("u1"), name: 'Alice', email: 'alice@example.com' }

await Order.aggregate([
  { $match: { status: 'completed' } },        // 1. filter FIRST (fewer joins)
  { $lookup: {                                 // 2. join
      from: 'users',
      localField: 'customer',
      foreignField: '_id',
      as: 'customerInfo',
  } },
  // → customerInfo: [{ _id, name: 'Alice', email }]   ← array!
  { $unwind: '$customerInfo' },                // 3. array of 1 → object
  { $project: {                                // 4. shape output
      _id: 0,
      orderId: '$_id',
      total: 1,
      customerName: '$customerInfo.name',
  } },
]);
// → [{ orderId: 1, total: 200, customerName: 'Alice' }]
```

**Why unwind before accessing fields — the array trap:**

```javascript
// WITHOUT $unwind, customerInfo is an array:
{ $project: { name: '$customerInfo.name' } }
// → { name: ['Alice'] }   ← an ARRAY of names, not a string!
```

---

## 4. `$lookup` — Pipeline Syntax (Filter/Sort/Limit the Join)

The simple syntax can only match one field to another. The pipeline syntax runs a **full aggregation on the foreign collection** per document:

```javascript
{
  $lookup: {
    from: 'posts',
    let: { userId: '$_id' },        // expose local fields as variables
    pipeline: [
      { $match: {
          $expr: {                   // $expr is REQUIRED to use $$variables
            $and: [
              { $eq: ['$author', '$$userId'] },    // foreign field vs local variable
              { $eq: ['$isPublished', true] },
            ],
          },
      } },
      { $sort: { createdAt: -1 } },  // sort the joined docs
      { $limit: 5 },                 // at most 5 per parent doc
      { $project: { title: 1, createdAt: 1 } },   // shrink joined docs
    ],
    as: 'recentPosts',
  }
}
```

### `$` vs `$$` — Memorize This

| Prefix | Means | Example |
|--------|-------|---------|
| `$field` | Field in the **foreign** collection | `'$author'` |
| `$$var` | Variable from `let` (the **local** doc) | `'$$userId'` |

**Edge cases:**
- `{ $match: { author: '$$userId' } }` **without `$expr`** does not resolve the variable — it compares against the literal string `'$$userId'` and silently matches nothing. Variables only work inside `$expr`.
- `$sort`/`$limit` inside the pipeline apply **per parent document** (each user gets their own top 5), and don't affect the outer pipeline's order.

---

## 5. Common Patterns

### Aggregate After Joining

```javascript
// Revenue per product across all completed orders
await Order.aggregate([
  { $match: { status: 'completed' } },
  { $unwind: '$items' },
  { $group: {
      _id: '$items.product',
      totalQty: { $sum: '$items.quantity' },
      revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
  } },
  { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
  { $unwind: '$product' },
  { $project: { productName: '$product.name', totalQty: 1, revenue: 1 } },
  { $sort: { revenue: -1 } },
]);
```

Note the trick: `$group` first, `$lookup` after — joining 20 grouped rows is far cheaper than joining thousands of raw orders.

### Multiple Joins

```javascript
await Order.aggregate([
  { $lookup: { from: 'users', localField: 'customer', foreignField: '_id', as: 'customerInfo' } },
  { $unwind: '$customerInfo' },
  { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'productDetails' } },
]);
```

Each `$lookup` is expensive — keep the count low and `$project` foreign docs down to needed fields.

---

## 6. Stage Order Cheat Sheet

```
$match          ← filter first (performance + correctness)
$limit          ← if you only need top N, limit BEFORE the join
$lookup         ← join
$unwind         ← flatten (mind preserveNullAndEmptyArrays!)
$match          ← optional: filter on joined fields
$group          ← optional: aggregate joined data
$project        ← shape output
$sort / $skip / $limit   ← final ordering & pagination
```

---

## 7. Summary

### Common Mistakes

```javascript
// 1. Model name in `from` → silent empty arrays
{ $lookup: { from: 'User', ... } }     // WRONG — 'users'

// 2. Accessing array fields without $unwind → arrays instead of values
{ name: '$customerInfo.name' }         // → ['Alice'], not 'Alice'

// 3. $$variable without $expr → matches nothing, silently
{ $match: { author: '$$userId' } }     // WRONG
{ $match: { $expr: { $eq: ['$author', '$$userId'] } } }   // CORRECT

// 4. $lookup before $match → joins docs you're about to throw away

// 5. Forgetting preserveNullAndEmptyArrays → docs without matches silently vanish
```

### Key Points

1. `from` = collection name (lowercase plural), not model name — wrong name fails **silently** with `[]`.
2. `$lookup` output is **always an array**; no match → `[]`, doc still passes (LEFT join).
3. Default `$unwind` **drops** docs with empty/null/missing arrays — it turns your left join into an inner join. `preserveNullAndEmptyArrays: true` keeps them.
4. Pipeline syntax + `let`/`$$var`/`$expr` = filter, sort, and limit the joined docs.
5. `$` = foreign field, `$$` = local variable — and `$$vars` only resolve inside `$expr`.
6. Filter and limit **before** joining; project foreign docs down to needed fields.
