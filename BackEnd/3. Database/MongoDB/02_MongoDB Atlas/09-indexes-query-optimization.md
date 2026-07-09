# 09 — MongoDB Atlas: Indexes & Query Optimization

## Why Indexes Matter

Without an index, MongoDB must scan **every document** in a collection to find
matches. With an index, it jumps directly to the relevant documents.

```
Collection: 1,000,000 users
Query: find user where email = "alice@example.com"

Without index: scan all 1,000,000 documents → slow (COLLSCAN)
With index on email: jump directly to 1 document → fast (IXSCAN)
```

The bigger your collection, the more critical indexes become.

---

## Index Types

### Single Field Index
Index on one field. Most common type.
```javascript
db.users.createIndex({ email: 1 })        // ascending
db.users.createIndex({ createdAt: -1 })   // descending (good for "newest first")
```

### Compound Index
Index on multiple fields. Supports queries that filter or sort on multiple fields.
```javascript
// Supports: find({status: "active"}).sort({createdAt: -1})
db.users.createIndex({ status: 1, createdAt: -1 })
```

**ESR Rule for compound indexes:**
Order fields as: **E**quality → **S**ort → **R**ange
```javascript
// Query: find users where status = "active" AND age > 18, sorted by name
db.users.createIndex({ status: 1, name: 1, age: 1 })
//                      Equality   Sort    Range
```

### Unique Index
Enforces uniqueness — rejects duplicate values.
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
```

### Sparse Index
Only indexes documents that have the field. Skips documents where the field is null
or missing. Useful for optional fields.
```javascript
db.users.createIndex({ phoneNumber: 1 }, { sparse: true })
```

### TTL Index (Time-To-Live)
Automatically deletes documents after a set time. Perfect for sessions, logs,
temporary tokens.
```javascript
// Delete documents 3600 seconds (1 hour) after the `createdAt` field value
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })
```

### Text Index
Full-text search across string fields.
```javascript
db.articles.createIndex({ title: "text", body: "text" })

// Query
db.articles.find({ $text: { $search: "mongodb performance" } })
```

### Geospatial Index
For location-based queries (find nearby places, etc.).
```javascript
db.locations.createIndex({ coordinates: "2dsphere" })

// Query: find places within 5km
db.locations.find({
  coordinates: {
    $near: {
      $geometry: { type: "Point", coordinates: [-73.97, 40.77] },
      $maxDistance: 5000
    }
  }
})
```

### Wildcard Index
Index all fields in a document or subdocument. Useful when you don't know field
names in advance.
```javascript
db.products.createIndex({ "attributes.$**": 1 })
```

---

## Creating Indexes

### In Atlas UI
1. Cluster → **Browse Collections**
2. Select your collection → **Indexes** tab
3. Click **Create Index**
4. Define the index fields and options
5. Click **Confirm**

Atlas builds indexes in a rolling fashion across replica set nodes — no downtime.

### In Mongoose (schema definition)
```javascript
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  status: String,
  createdAt: { type: Date, default: Date.now },
  location: { type: { type: String }, coordinates: [Number] }
});

// Single field indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });

// Compound index
userSchema.index({ status: 1, createdAt: -1 });

// TTL index
userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

// Geospatial
userSchema.index({ location: "2dsphere" });
```

### Using mongosh
```javascript
// Create index
db.users.createIndex({ email: 1 }, { unique: true, background: true })

// List all indexes
db.users.getIndexes()

// Drop an index
db.users.dropIndex("email_1")
```

---

## Using explain() to Diagnose Queries

`explain()` shows you how MongoDB executes a query — whether it used an index,
how many documents it scanned, and how long it took.

```javascript
// Basic explain
db.users.find({ email: "alice@example.com" }).explain()

// Execution stats (more detail)
db.users.find({ status: "active" }).sort({ createdAt: -1 }).explain("executionStats")
```

### What to look for in explain output

```javascript
// GOOD — index used
"winningPlan": {
  "stage": "FETCH",
  "inputStage": {
    "stage": "IXSCAN",          // ← Index scan ✅
    "keyPattern": { "email": 1 }
  }
}

// BAD — no index, full collection scan
"winningPlan": {
  "stage": "COLLSCAN"           // ← Collection scan ❌
}
```

```javascript
// In executionStats, check:
"totalDocsExamined": 1,         // ← Good: scanned same as returned
"totalDocsExamined": 100000,    // ← Bad: scanned 100k to return a few
"executionTimeMillis": 2,       // ← Good: 2ms
"executionTimeMillis": 845,     // ← Bad: 845ms — needs index
```

---

## Performance Advisor (Atlas)

Atlas automatically analyzes your slow queries and suggests indexes.

### How to access
Cluster → **Performance Advisor**

### How to use it
1. Review suggested indexes — each shows expected improvement
2. Click **Create Index** to apply
3. Atlas builds in the background with no downtime

### Check after every deployment
New features introduce new query patterns. Check Performance Advisor after
every significant release.

---

## Common Index Mistakes

### 1. Over-indexing
Every index consumes disk space and slows down writes (each write must update
all indexes). Don't index everything — only fields that appear in queries.

```javascript
// Don't do this — 10 indexes on one collection is usually too many
userSchema.index({ firstName: 1 });
userSchema.index({ lastName: 1 });
userSchema.index({ age: 1 });
userSchema.index({ city: 1 });
// etc.
```

### 2. Not using compound indexes
Two separate single-field indexes do not help a query that filters on both fields.

```javascript
// Query: find({ status: "active", country: "US" })

// ❌ These two indexes do NOT help the compound query efficiently
db.users.createIndex({ status: 1 })
db.users.createIndex({ country: 1 })

// ✅ This compound index handles the query perfectly
db.users.createIndex({ status: 1, country: 1 })
```

### 3. Wrong sort direction in compound index
```javascript
// Query: find({status: "active"}).sort({createdAt: -1})  (newest first)

// ❌ Wrong direction — won't use index for sort
db.users.createIndex({ status: 1, createdAt: 1 })

// ✅ Correct direction
db.users.createIndex({ status: 1, createdAt: -1 })
```

### 4. Forgetting to index for sort fields
Sorting without an index causes MongoDB to load all matching documents into
memory to sort — this fails on large datasets.

---

## Query Optimization Tips

### Project only the fields you need
```javascript
// ❌ Returns entire document (slow on large documents)
db.users.find({ status: "active" })

// ✅ Returns only name and email
db.users.find({ status: "active" }, { name: 1, email: 1, _id: 0 })
```

### Use `$in` instead of multiple queries
```javascript
// ❌ Three separate queries
const user1 = await User.findById(id1);
const user2 = await User.findById(id2);
const user3 = await User.findById(id3);

// ✅ One query
const users = await User.find({ _id: { $in: [id1, id2, id3] } });
```

### Paginate with range queries, not skip
```javascript
// ❌ skip() is slow on large offsets (MongoDB still scans skipped documents)
db.posts.find().sort({ createdAt: -1 }).skip(10000).limit(20)

// ✅ Use range-based pagination (cursor pagination)
db.posts.find({ createdAt: { $lt: lastSeenDate } }).sort({ createdAt: -1 }).limit(20)
```

### Avoid $where and $regex without anchoring
```javascript
// ❌ Cannot use index
db.users.find({ name: { $regex: /smith/i } })

// ✅ Can use index (anchored at start)
db.users.find({ name: { $regex: /^smith/i } })

// ✅ Better: use $text search with text index for full-text
db.users.find({ $text: { $search: "smith" } })
```
