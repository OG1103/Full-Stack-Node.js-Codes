# Mongoose — Indexing

Indexes are **data structures** that MongoDB maintains alongside your data to make queries faster. Without indexes, MongoDB must scan every document in a collection (collection scan). With indexes, it can jump directly to matching documents.

---

## 1. How Indexes Work

MongoDB uses **B-tree** data structures for indexes. Think of it like a book's index — instead of reading every page, you look up a term and go directly to the right page.

```
Without Index (Collection Scan):
  Scan doc1 → doc2 → doc3 → ... → doc10000 → Found!
  Time: O(n)

With Index (Index Scan):
  B-tree lookup → Jump to doc7432 → Found!
  Time: O(log n)
```

### Trade-offs

| Benefit | Cost |
|---------|------|
| Faster reads/queries | Slower writes (index must be updated) |
| Efficient sorting | Extra storage space |
| Quick lookups | Memory usage |

**Rule of thumb:** Index fields that you **query frequently**. Don't index everything.

---

## 2. Creating Indexes in Mongoose

### Schema-Level Index

```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,    // Creates a unique index
    index: true,     // Creates a regular index (optional if unique is set)
  },
  name: {
    type: String,
    index: true,     // Single field index
  },
  age: Number,
  status: String,
  createdAt: Date,
});
```

### Using `schema.index()` — Compound and Complex Indexes

```javascript
// Single field index
userSchema.index({ age: 1 });           // Ascending
userSchema.index({ createdAt: -1 });    // Descending

// Compound index (multiple fields)
userSchema.index({ status: 1, createdAt: -1 });

// Unique compound index
userSchema.index({ email: 1, tenant: 1 }, { unique: true });
```

---

## 3. Index Types

### Single Field Index

Index on one field:

```javascript
userSchema.index({ email: 1 });    // 1 = ascending, -1 = descending

// Supports queries like:
await User.find({ email: 'john@example.com' });       // Uses index
await User.find().sort({ email: 1 });                  // Uses index for sorting
await User.find().sort({ email: -1 });                 // Uses index (reversed)
```

### Compound Index

Index on multiple fields — **field order matters**:

```javascript
userSchema.index({ status: 1, createdAt: -1 });

// Uses this index:
await User.find({ status: 'active' });                              // Yes (prefix)
await User.find({ status: 'active' }).sort({ createdAt: -1 });      // Yes (full match)
await User.find({ status: 'active', createdAt: { $gt: someDate } }); // Yes

// Does NOT use this index:
await User.find({ createdAt: { $gt: someDate } });   // No (skips first field)
await User.find().sort({ createdAt: -1 });             // No (prefix missing)
```

#### The Prefix Rule

A compound index `{ a: 1, b: 1, c: 1 }` supports queries on these prefixes:

| Query Fields | Uses Index? |
|-------------|-------------|
| `{ a }` | Yes (prefix) |
| `{ a, b }` | Yes (prefix) |
| `{ a, b, c }` | Yes (full) |
| `{ b }` | No (not a prefix) |
| `{ b, c }` | No |
| `{ a, c }` | Partially (uses `a` only) |

#### The ESR Rule (Equality, Sort, Range)

For optimal compound indexes, order fields as:

1. **Equality** fields first (`status: 'active'`)
2. **Sort** fields next (`createdAt: -1`)
3. **Range** fields last (`age: { $gt: 18 }`)

```javascript
// Query:
await User.find({ status: 'active', age: { $gt: 18 } }).sort({ createdAt: -1 });

// Optimal index (ESR order):
userSchema.index({ status: 1, createdAt: -1, age: 1 });
//                 Equality     Sort           Range
```

#### Sort Direction in Compound Indexes

```javascript
// Index: { a: 1, b: -1 }
// Supports these sorts:
.sort({ a: 1, b: -1 })    // Exact match — uses index
.sort({ a: -1, b: 1 })    // Exact inverse — uses index (reversed)

// Does NOT support:
.sort({ a: 1, b: 1 })     // Mixed directions — cannot use index
.sort({ a: -1, b: -1 })   // Mixed directions — cannot use index
```

#### The Chain Rule

MongoDB reads a compound index **left to right** and stops at the first **range** condition:

```javascript
// Index: { a: 1, b: 1, c: 1 }

// Query: { a: 'x', b: { $gt: 5 }, c: 'y' }
// Uses: a (equality) → b (range, STOPS) → c is NOT used
// 'c' field is not utilized because 'b' is a range query

// Better: Reorder so range comes last
// Index: { a: 1, c: 1, b: 1 }
// Query: { a: 'x', c: 'y', b: { $gt: 5 } }
// Uses: a (equality) → c (equality) → b (range) — all fields used!
```

### Unique Index

Prevents duplicate values:

```javascript
userSchema.index({ email: 1 }, { unique: true });

// Compound unique index
userSchema.index({ email: 1, tenant: 1 }, { unique: true });
// Same email allowed in different tenants, but not within the same tenant
```

### Sparse Index

Only indexes documents that **have** the indexed field:

```javascript
userSchema.index({ phone: 1 }, { sparse: true });

// Documents without 'phone' field are NOT in the index
// Useful when many documents don't have the field
```

**Note:** Sparse + unique allows multiple documents to NOT have the field (without unique, `null` would conflict):

```javascript
userSchema.index({ socialId: 1 }, { unique: true, sparse: true });
// Multiple users can have no socialId, but those who do must be unique
```

### TTL Index (Time-To-Live)

Automatically deletes documents after a specified time:

```javascript
const sessionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  token: String,
  createdAt: { type: Date, default: Date.now },
});

// Documents expire 24 hours after createdAt
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });
```

- MongoDB checks for expired documents every 60 seconds
- Only works on `Date` fields
- Perfect for sessions, OTPs, temporary tokens

### Text Index

Full-text search on string fields:

```javascript
const articleSchema = new mongoose.Schema({
  title: String,
  body: String,
  tags: [String],
});

// Text index on multiple fields
articleSchema.index({ title: 'text', body: 'text' });

// Searching with text index
const results = await Article.find({
  $text: { $search: 'mongodb indexing' },
});

// With relevance score
const results = await Article.find(
  { $text: { $search: 'mongodb indexing' } },
  { score: { $meta: 'textScore' } }
).sort({ score: { $meta: 'textScore' } });
```

**Limitation:** Only one text index per collection.

### Partial Index

Only indexes documents matching a condition:

```javascript
userSchema.index(
  { email: 1 },
  {
    partialFilterExpression: { isActive: true },
  }
);

// Only active users are indexed
// Smaller index, faster for queries that filter by isActive: true
```

---

## 4. Checking Index Usage with `explain()`

```javascript
const result = await User.find({ status: 'active' })
  .sort({ createdAt: -1 })
  .explain('executionStats');

console.log(result.executionStats);
// {
//   executionSuccess: true,
//   nReturned: 50,
//   totalDocsExamined: 50,      ← Should be close to nReturned
//   totalKeysExamined: 50,      ← Index keys examined
//   executionTimeMillis: 2,
//   winningPlan: {
//     stage: 'IXSCAN',          ← Using index (good!)
//     indexName: 'status_1_createdAt_-1',
//   }
// }
```

| Stage | Meaning |
|-------|---------|
| `IXSCAN` | Index scan (good) |
| `COLLSCAN` | Collection scan (no index used — slow) |
| `SORT` | In-memory sort (consider adding sort field to index) |
| `FETCH` | Retrieving full documents from disk |

**Goal:** `totalDocsExamined` should be close to `nReturned`. If they differ greatly, your index isn't efficient.

---

## 5. Redundant Indexes

An index `{ a: 1, b: 1 }` makes a separate index `{ a: 1 }` redundant because the compound index covers queries on `a` alone (prefix rule).

```javascript
// REDUNDANT — remove the single field index
userSchema.index({ status: 1 });                    // Covered by compound below
userSchema.index({ status: 1, createdAt: -1 });     // Covers { status: 1 } queries too

// NOT REDUNDANT — different fields
userSchema.index({ email: 1 });                      // Unique purpose
userSchema.index({ status: 1, createdAt: -1 });      // Different purpose
```

---

## 6. Managing Indexes

### List All Indexes

```javascript
const indexes = await User.collection.indexes();
console.log(indexes);
```

### Drop an Index

```javascript
await User.collection.dropIndex('email_1');
```

### Auto-Build Indexes

Mongoose automatically calls `createIndex()` for each index in your schema on startup. Disable in production for faster startup:

```javascript
mongoose.set('autoIndex', false);

// Or per-schema:
const schema = new mongoose.Schema({ ... }, { autoIndex: false });
```

In production, create indexes manually via migration scripts instead.

---

## 7. Summary

| Index Type | Syntax | Use Case |
|-----------|--------|----------|
| Single field | `{ field: 1 }` | Simple lookups |
| Compound | `{ a: 1, b: -1 }` | Multi-field queries |
| Unique | `{ unique: true }` | Prevent duplicates |
| Sparse | `{ sparse: true }` | Optional fields |
| TTL | `{ expireAfterSeconds: N }` | Auto-expire documents |
| Text | `{ field: 'text' }` | Full-text search |
| Partial | `{ partialFilterExpression }` | Conditional indexing |

### Key Points

1. **Index fields you query often** — don't index everything
2. **Compound index order matters** — follow the prefix rule and ESR rule
3. **Sort directions matter** — `{ a: 1, b: -1 }` only supports matching or fully inverted sorts
4. **Use `explain()`** to verify indexes are being used
5. **Remove redundant indexes** — they waste space and slow writes
6. **TTL indexes** auto-delete expired documents (sessions, tokens)
7. **Disable `autoIndex` in production** for faster startup
