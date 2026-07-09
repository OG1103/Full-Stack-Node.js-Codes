## Slow Queries

### What is it

A slow query is a database query that takes too long to run — sometimes hundreds of milliseconds or even seconds. When a query is slow, every request that depends on it is slow too, and under load the database gets backed up with a queue of slow queries, which can bring the whole app to a halt.

**The most common causes:**

| Cause | What happens |
|---|---|
| **Missing index** | MongoDB scans every document in the collection to find matches (collection scan) |
| **Fetching too many fields** | Returning entire documents when you only need 2–3 fields |
| **No pagination** | Returning thousands of documents in one query |
| **Inefficient aggregation** | Running `$lookup` or `$group` on un-indexed fields |
| **Deep `.populate()`** | Populating nested references across many documents |

### Example

```js
// ❌ BROKEN — multiple slow query problems

// Problem 1: no index on 'email' — full collection scan every login
app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  // MongoDB reads EVERY user document to find a match
  res.json(user);
});

// Problem 2: returns entire documents — most fields are unused
app.get('/users', async (req, res) => {
  const users = await User.find(); // returns _id, name, email, password hash,
                                   // address, preferences, giant bio field, etc.
  res.json(users);
});

// Problem 3: no pagination — returns ALL orders (could be millions)
app.get('/orders', async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
});
```

### Solution

**Fix 1 — Add indexes to fields you query on:**

```js
// In your schema — add index to frequently queried fields
const userSchema = new mongoose.Schema({
  name:      String,
  email:     { type: String, unique: true, index: true }, // ← index on email
  createdAt: { type: Date, index: true },                 // ← index for date sorting
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // ← index for user lookups
  status: { type: String, index: true },
});

// Compound index — when you always query by userId AND sort by createdAt
orderSchema.index({ userId: 1, createdAt: -1 });
```

**Fix 2 — Select only the fields you need (projection):**

```js
// ✅ FIXED — only fetch needed fields
app.get('/users', async (req, res) => {
  // Second argument to find() is a projection: 1 = include, 0 = exclude
  const users = await User.find({}, { name: 1, email: 1, _id: 1 });
  // MongoDB only reads and returns 3 fields — much less data transferred
  res.json(users);
});

// With .select() — same thing, different syntax
const users = await User.find().select('name email');
```

**Fix 3 — Always paginate large result sets:**

```js
// ✅ FIXED — paginated query
app.get('/orders', async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 20; // default 20 per page
  const skip  = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ userId: req.user.id }),
  ]);

  res.json({
    data: orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
```

**Fix 4 — Use `.lean()` for read-only queries:**

Mongoose documents are full objects with methods, change tracking, and virtuals. For read-only API responses you do not need any of that — `.lean()` returns plain JavaScript objects, which is significantly faster.

```js
// ✅ Use .lean() when you only need to read and return data
const products = await Product.find({ category: 'electronics' })
  .select('name price stock')
  .lean(); // returns plain JS objects — no Mongoose overhead
```

**Fix 5 — Use MongoDB Explain to find the problem:**

```js
// Run this in your code or in MongoDB Compass to diagnose a slow query
const explanation = await User.find({ email: 'test@example.com' }).explain('executionStats');

console.log(explanation.executionStats);
// Look for:
//   executionStages.stage: "COLLSCAN"  ← bad, means no index used
//   executionStages.stage: "IXSCAN"    ← good, index was used
//   totalDocsExamined                  ← should be close to nReturned
```

### When to use each solution

| Solution | When to use it |
|---|---|
| **Index** | Add an index on any field you use in `.find()`, `.findOne()`, `.sort()`, or aggregation `$match`. Start here — it is the highest-impact fix. |
| **Projection (select)** | Always use in list endpoints. Only request fields the client actually needs. Especially important when documents have large text fields or arrays. |
| **Pagination** | Any endpoint that can return more than ~50 documents. Never return an unbounded list. |
| **`.lean()`** | Any read-only query (GET endpoints). Skip it only when you need Mongoose document methods like `.save()` or virtuals. |
