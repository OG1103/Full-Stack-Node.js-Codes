# Mongoose — Read Operations (Find)

Mongoose provides several methods to query and retrieve documents from MongoDB.

---

## 1. `find()` — Get Multiple Documents

Returns an **array** of documents matching the filter:

```javascript
// Find all users
const users = await User.find();

// Find with filter
const activeUsers = await User.find({ isActive: true });

// Find with multiple conditions
const results = await User.find({
  age: { $gte: 18 },
  role: 'user',
  isActive: true,
});

// Empty result returns an empty array (not null)
const noResults = await User.find({ name: 'nonexistent' });
// []
```

### Chaining Query Methods

```javascript
const users = await User.find({ isActive: true })
  .select('name email age')          // Only return these fields
  .sort({ createdAt: -1 })           // Sort by newest first
  .limit(10)                          // Maximum 10 results
  .skip(20)                           // Skip first 20 (pagination)
  .lean();                            // Return plain objects (faster)
```

---

## 2. `findOne()` — Get a Single Document

Returns the **first document** matching the filter, or `null`:

```javascript
const user = await User.findOne({ email: 'john@example.com' });

if (!user) {
  console.log('User not found');
  return;
}

console.log(user.name);
```

### With Multiple Conditions

```javascript
const admin = await User.findOne({ role: 'admin', isActive: true });
```

### Difference from `find()`

| Method | Returns | No Match |
|--------|---------|----------|
| `find()` | Array of documents | `[]` (empty array) |
| `findOne()` | Single document | `null` |

---

## 3. `findById()` — Get by ObjectId

Shorthand for `findOne({ _id: id })`:

```javascript
const user = await User.findById('64f1a2b3c4d5e6f7a8b9c0d1');

// Equivalent to:
const user = await User.findOne({ _id: '64f1a2b3c4d5e6f7a8b9c0d1' });
```

### With Chaining

```javascript
const user = await User.findById(userId)
  .select('name email')
  .populate('posts');
```

### Invalid ID Handling

```javascript
try {
  const user = await User.findById('invalid-id');
} catch (err) {
  // CastError: Cast to ObjectId failed for value "invalid-id"
  console.log(err.name);  // 'CastError'
}
```

---

## 4. `select()` — Field Selection (Projection)

Control which fields are returned:

### Include Specific Fields

```javascript
const users = await User.find().select('name email age');
// Each document only has: { _id, name, email, age }
```

### Exclude Specific Fields

```javascript
const users = await User.find().select('-password -__v');
// Everything except password and __v
```

### Include Hidden Fields (`select: false`)

```javascript
// If password has select: false in the schema:
const user = await User.findById(id).select('+password');
// Now includes password
```

### Object Syntax

```javascript
const users = await User.find().select({ name: 1, email: 1, _id: 0 });
// 1 = include, 0 = exclude
// Cannot mix include and exclude (except for _id)
```

---

## 5. `sort()` — Order Results

```javascript
// Ascending (1) — smallest first
const users = await User.find().sort({ age: 1 });

// Descending (-1) — largest first
const users = await User.find().sort({ createdAt: -1 });

// Multiple sort fields
const users = await User.find().sort({ role: 1, name: -1 });
// Sort by role ascending, then by name descending within each role

// String syntax
const users = await User.find().sort('age -name');
// age ascending, name descending
```

---

## 6. `limit()` and `skip()` — Pagination

```javascript
// Get first 10 users
const users = await User.find().limit(10);

// Skip first 20, then get 10 (page 3 with 10 per page)
const users = await User.find().skip(20).limit(10);
```

### Pagination Helper

```javascript
const getUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(),
  ]);

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};
```

---

## 7. `countDocuments()` — Count Matches

```javascript
const total = await User.countDocuments();                         // All users
const activeCount = await User.countDocuments({ isActive: true }); // Active users
```

### `estimatedDocumentCount()` — Faster Count

For approximate counts on large collections (uses collection metadata):

```javascript
const approxCount = await User.estimatedDocumentCount();
```

---

## 8. `lean()` — Plain JavaScript Objects

By default, Mongoose returns **Mongoose documents** with methods, getters, and change tracking. `lean()` returns plain objects — much faster:

```javascript
// Mongoose document (has methods like .save(), .populate(), etc.)
const user = await User.findById(id);
user.save();  // Works

// Lean object (plain JavaScript object — no Mongoose features)
const user = await User.findById(id).lean();
user.save();  // ERROR — not a Mongoose document
```

**Use `lean()` when:**
- You only need to **read** data (API responses)
- Performance is critical (large result sets)
- You don't need to modify and save

**Don't use `lean()` when:**
- You need to call `.save()`, `.populate()`, or instance methods
- You need virtuals or getters

---

## 9. `where()` — Query Builder Syntax

Alternative chainable syntax:

```javascript
const users = await User.find()
  .where('age').gte(18).lte(65)
  .where('isActive').equals(true)
  .where('role').in(['user', 'moderator'])
  .sort({ name: 1 })
  .limit(20);

// Equivalent to:
const users = await User.find({
  age: { $gte: 18, $lte: 65 },
  isActive: true,
  role: { $in: ['user', 'moderator'] },
}).sort({ name: 1 }).limit(20);
```

---

## 10. `distinct()` — Unique Values

Get unique values for a field:

```javascript
const roles = await User.distinct('role');
// ['admin', 'user', 'moderator']

const cities = await User.distinct('address.city', { isActive: true });
// ['New York', 'London', 'Tokyo'] — only from active users
```

---

## 11. `exists()` — Check if Documents Exist

```javascript
const hasAdmins = await User.exists({ role: 'admin' });
// Returns { _id: ... } if found, null if not

if (hasAdmins) {
  console.log('At least one admin exists');
}
```

---

## 12. Summary

| Method | Returns | No Match | Use Case |
|--------|---------|----------|----------|
| `find()` | Array | `[]` | Multiple documents |
| `findOne()` | Document | `null` | Single document by filter |
| `findById()` | Document | `null` | Single document by ID |
| `countDocuments()` | Number | `0` | Count matches |
| `distinct()` | Array | `[]` | Unique field values |
| `exists()` | `{ _id }` | `null` | Check existence |

### Query Helpers

| Method | Purpose |
|--------|---------|
| `.select()` | Choose fields to return |
| `.sort()` | Order results |
| `.limit()` | Maximum documents |
| `.skip()` | Skip documents (pagination) |
| `.lean()` | Plain objects (faster) |
| `.where()` | Chainable query builder |
| `.populate()` | Resolve references |
