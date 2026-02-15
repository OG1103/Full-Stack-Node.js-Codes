# Mongoose — Query Filters & Operators

Query filters define **which documents** to match in find, update, and delete operations. MongoDB provides a rich set of operators for comparison, logic, arrays, and more.

---

## 1. Comparison Operators

### `$eq` — Equal

```javascript
await User.find({ age: { $eq: 25 } });
// Same as:
await User.find({ age: 25 });
```

### `$ne` — Not Equal

```javascript
await User.find({ status: { $ne: 'banned' } });
// All users where status is NOT 'banned'
```

### `$gt` / `$gte` — Greater Than / Greater or Equal

```javascript
await Product.find({ price: { $gt: 100 } });     // price > 100
await Product.find({ price: { $gte: 100 } });    // price >= 100
```

### `$lt` / `$lte` — Less Than / Less or Equal

```javascript
await Product.find({ stock: { $lt: 10 } });      // stock < 10
await Product.find({ stock: { $lte: 10 } });     // stock <= 10
```

### Range Queries (Combining Operators)

```javascript
// Price between 50 and 200 (inclusive)
await Product.find({
  price: { $gte: 50, $lte: 200 },
});

// Age between 18 and 65
await User.find({
  age: { $gte: 18, $lt: 65 },
});

// Date range
await Order.find({
  createdAt: {
    $gte: new Date('2024-01-01'),
    $lt: new Date('2024-02-01'),
  },
});
```

---

## 2. Logical Operators

### `$and` — All Conditions Must Match

```javascript
await Product.find({
  $and: [
    { price: { $gte: 100 } },
    { category: 'Electronics' },
    { inStock: true },
  ],
});

// Implicit AND (equivalent — simpler syntax):
await Product.find({
  price: { $gte: 100 },
  category: 'Electronics',
  inStock: true,
});
```

**Explicit `$and` is needed** when you have multiple conditions on the same field:

```javascript
// Find price > 50 AND price < 200
// Implicit works:
await Product.find({ price: { $gt: 50, $lt: 200 } });

// But for same-operator conditions on same field, use $and:
await Product.find({
  $and: [
    { tags: 'sale' },
    { tags: 'electronics' },  // Both conditions on 'tags'
  ],
});
```

### `$or` — At Least One Condition Must Match

```javascript
await User.find({
  $or: [
    { role: 'admin' },
    { role: 'moderator' },
  ],
});

// Combined with other filters:
await Product.find({
  isActive: true,
  $or: [
    { price: { $lt: 50 } },
    { rating: { $gte: 4.5 } },
  ],
});
// Active products that are either cheap OR highly rated
```

### `$not` — Invert a Condition

```javascript
await Product.find({
  price: { $not: { $gt: 100 } },
});
// Products where price is NOT greater than 100 (i.e., <= 100 or no price field)

await User.find({
  name: { $not: /^admin/i },
});
// Users whose name does NOT start with 'admin'
```

### `$nor` — None of the Conditions Match

```javascript
await Product.find({
  $nor: [
    { category: 'Electronics' },
    { price: { $gt: 500 } },
  ],
});
// Products that are NOT Electronics AND NOT expensive
```

---

## 3. Element Operators

### `$exists` — Field Exists or Doesn't

```javascript
// Users who HAVE a phone field (even if null)
await User.find({ phone: { $exists: true } });

// Users who do NOT have a phone field
await User.find({ phone: { $exists: false } });
```

### `$type` — Field Type Check

```javascript
// Fields that are strings
await User.find({ age: { $type: 'string' } });

// Fields that are numbers
await User.find({ age: { $type: 'number' } });

// Common types: 'string', 'number', 'boolean', 'object', 'array', 'date', 'null', 'objectId'
```

---

## 4. Array Operators

### `$in` — Value In Array

```javascript
// Users with role 'admin' OR 'moderator'
await User.find({ role: { $in: ['admin', 'moderator'] } });

// Products in specific categories
await Product.find({
  category: { $in: [categoryId1, categoryId2, categoryId3] },
});
```

### `$nin` — Value NOT In Array

```javascript
await User.find({ status: { $nin: ['banned', 'suspended'] } });
// Users who are NOT banned or suspended
```

### `$all` — Array Contains All Values

```javascript
// Products tagged with BOTH 'electronics' AND 'sale'
await Product.find({
  tags: { $all: ['electronics', 'sale'] },
});
```

### `$size` — Exact Array Length

```javascript
// Users with exactly 3 hobbies
await User.find({ hobbies: { $size: 3 } });
```

**Note:** `$size` only checks exact length. For range checks, use `$expr`:

```javascript
// Array with more than 5 elements
await User.find({
  $expr: { $gt: [{ $size: '$hobbies' }, 5] },
});
```

### `$elemMatch` — Array Element Matches Multiple Conditions

```javascript
// Find orders where at least one item has quantity > 5 AND price > 100
await Order.find({
  items: {
    $elemMatch: {
      quantity: { $gt: 5 },
      price: { $gt: 100 },
    },
  },
});
```

Without `$elemMatch`, conditions could match across different array elements:

```javascript
// This could match if ONE item has quantity > 5 and a DIFFERENT item has price > 100
await Order.find({
  'items.quantity': { $gt: 5 },
  'items.price': { $gt: 100 },
});

// $elemMatch ensures BOTH conditions are on the SAME array element
```

---

## 5. Evaluation Operators

### `$regex` — Regular Expression Match

```javascript
// Case-insensitive name search
await User.find({
  name: { $regex: 'john', $options: 'i' },
});

// Names starting with 'A'
await User.find({
  name: { $regex: /^A/ },
});

// Email contains 'gmail'
await User.find({
  email: { $regex: /gmail\.com$/ },
});

// Shorthand (equivalent):
await User.find({ name: /john/i });
```

### `$where` — JavaScript Expression

```javascript
// Complex condition using JavaScript
await User.find({
  $where: function () {
    return this.firstName.length > this.lastName.length;
  },
});
```

**Warning:** `$where` is slow (full collection scan, no index usage). Avoid in production.

### `$expr` — Aggregation Expressions in Queries

Compare fields against each other:

```javascript
// Products where stock is less than reorderLevel
await Product.find({
  $expr: { $lt: ['$stock', '$reorderLevel'] },
});

// Orders where total exceeds budget
await Order.find({
  $expr: { $gt: ['$total', '$budget'] },
});
```

---

## 6. Geospatial Operators

### `$near` — Find Near a Point

```javascript
// Schema with location field
const storeSchema = new mongoose.Schema({
  name: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number],  // [longitude, latitude]
  },
});

storeSchema.index({ location: '2dsphere' });

// Find stores within 5km of a point
const stores = await Store.find({
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [-73.9857, 40.7484],  // [lng, lat]
      },
      $maxDistance: 5000,  // 5km in meters
    },
  },
});
```

### `$geoWithin` — Find Within an Area

```javascript
await Store.find({
  location: {
    $geoWithin: {
      $centerSphere: [[-73.9857, 40.7484], 5 / 6378.1],  // 5km radius
    },
  },
});
```

---

## 7. Building Dynamic Filters

Common pattern for API query parameters:

```javascript
app.get('/api/products', async (req, res) => {
  const { category, minPrice, maxPrice, search, inStock } = req.query;

  const filter = {};

  if (category) filter.category = category;
  if (inStock === 'true') filter.inStock = true;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(products);
});
```

---

## 8. Summary

| Category | Operator | Description |
|----------|----------|-------------|
| **Comparison** | `$eq`, `$ne` | Equal / Not equal |
| | `$gt`, `$gte` | Greater than / Greater or equal |
| | `$lt`, `$lte` | Less than / Less or equal |
| **Logical** | `$and` | All conditions match |
| | `$or` | At least one matches |
| | `$not` | Inverts a condition |
| | `$nor` | None match |
| **Element** | `$exists` | Field exists |
| | `$type` | Field type check |
| **Array** | `$in`, `$nin` | Value in / not in array |
| | `$all` | Contains all values |
| | `$size` | Exact array length |
| | `$elemMatch` | Array element matches all conditions |
| **Evaluation** | `$regex` | Pattern matching |
| | `$expr` | Compare fields to each other |
| | `$where` | JavaScript expression (slow) |
| **Geospatial** | `$near` | Near a point |
| | `$geoWithin` | Within an area |
