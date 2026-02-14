# MongoDB Indexing — The Complete Guide

---

## What is an Index?

Imagine you have a library with 1 million books and no catalog system. To find a book about "JavaScript", you'd have to walk through every single shelf and read every title. That's exactly what MongoDB does without indexes — it reads every document in a collection to find what you're looking for. This is called a **Collection Scan**.

An index is the catalog system. It's a separate, small data structure that MongoDB keeps alongside your collection. It stores the values of specific fields in a sorted, organized way so MongoDB can jump straight to the documents you need instead of reading everything.

**Without an index:**
```
Query: find users where email = "john@example.com"
MongoDB: reads document 1... no. reads document 2... no. reads document 3... no.
         ... reads 1,000,000 documents
```

**With an index on email:**
```
Query: find users where email = "john@example.com"
MongoDB: jumps straight to "john@example.com" in the index → found it
```

The difference in speed is enormous once your collection grows.

---

## How Indexes Work Under the Hood

MongoDB uses a data structure called a **B-tree (Balanced Tree)** to store indexes. You don't need to know all the details, but the key idea is:

- The B-tree keeps data sorted
- Searching a B-tree takes `O(log n)` time — meaning if you have 1,000,000 documents, MongoDB only needs about 20 "steps" to find what it needs
- Without an index, MongoDB needs `O(n)` time — meaning it reads all 1,000,000 documents

Think of it like a phone book. It's sorted alphabetically, so finding "Smith" takes seconds. If the phone book was in random order, you'd have to read every entry.

---

## The Trade-off

Indexes are not free. Every index you add has a cost:

| Benefit | Cost |
|---------|------|
| Faster reads (find, sort, filter) | Slower writes (insert, update, delete) |
| Jump straight to results | MongoDB must update every index on write |
| — | Uses RAM and disk space |

Every time you insert a document or update an indexed field, MongoDB has to update the B-tree. So adding too many indexes slows down your writes and wastes memory.

**The golden rule:** Only index fields you actually query on frequently.

---

## Index Directions: What do `1` and `-1` mean?

When you create an index you specify a direction for each field:

- `1` = **Ascending** (A → Z, 0 → 9, oldest → newest)
- `-1` = **Descending** (Z → A, 9 → 0, newest → oldest)

```js
userSchema.index({ createdAt: -1 }) // newest documents first
userSchema.index({ name: 1 })       // alphabetical A to Z
```

For **single field indexes**, the direction doesn't matter much because MongoDB can traverse the tree in either direction. Direction starts to matter a lot in **compound indexes** (covered below).

---

## Types of Indexes

### 1. Single Field Index

The most basic index. Speeds up queries on one specific field.

```js
userSchema.index({ email: 1 })
```

Now this query is fast:
```js
User.findOne({ email: "john@example.com" })
```

Without the index, MongoDB reads every user document. With it, MongoDB jumps straight to the match.

**When to use it:** Any field you regularly search, filter, or sort by on its own.

---

### 2. Compound Index

An index on **multiple fields combined**. This is where things get powerful.

```js
userSchema.index({ role: 1, createdAt: -1 })
```

This builds a sorted structure that looks like:

```
role: "admin",  createdAt: 2024-12-01  ← newest admin
role: "admin",  createdAt: 2024-11-15
role: "admin",  createdAt: 2024-10-03  ← oldest admin
role: "mod",    createdAt: 2024-12-05
role: "mod",    createdAt: 2024-11-20
role: "user",   createdAt: 2024-12-10
role: "user",   createdAt: 2024-12-08
...
```

Now this query is extremely fast:
```js
User.find({ role: "admin" }).sort({ createdAt: -1 })
```

MongoDB jumps to the "admin" section of the index and the results are already in the correct sort order — no extra work needed.

**When to use it:** When you frequently filter by one field AND sort/filter by another field together.

---

### 3. Unique Index

Enforces that no two documents can have the same value for a field.

```js
userSchema.index({ email: 1 }, { unique: true })
```

If you try to insert two users with the same email, MongoDB throws an error:
```
MongoServerError: E11000 duplicate key error
```

This is perfect for fields like `email`, `username`, `phoneNumber` — anything that must be unique per user.

**When to use it:** Any field where duplicates would be a data integrity problem.

---

### 4. Sparse Index

Only includes documents in the index if the indexed field **actually exists** on them.

```js
userSchema.index({ university: 1 }, { sparse: true })
```

Imagine you have:
- 800,000 regular users with no `university` field
- 200,000 student users with a `university` field

Without `sparse`, the index includes all 1,000,000 documents — the 800,000 non-students are in there with a `null` value, wasting space.

With `sparse`, the index only includes the 200,000 students. It's smaller, faster, and more efficient.

**The real power of sparse + unique combined:**

```js
userSchema.index({ username: 1 }, { unique: true, sparse: true })
```

Without `sparse`, if multiple users don't have a `username` set, MongoDB sees multiple `null` values and throws a unique constraint error. With `sparse`, documents missing `username` are excluded from the index entirely, so multiple users can exist without a username — the unique constraint only applies to documents that actually have the field set.

**When to use it:** Optional fields that only exist on some documents.

---

### 5. TTL Index (Time To Live)

Automatically deletes documents after a certain amount of time.

```js
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 }) // delete after 1 hour
```

MongoDB runs a background process that checks this index and removes expired documents automatically. You don't need a cron job or manual cleanup.

**When to use it:** Sessions, password reset tokens, email verification codes, temporary data, logs you only need to keep for X days.

---

### 6. Text Index

Enables full text search on string fields. Completely different from a regular index — it breaks words into tokens and lets you search by words, not exact values.

```js
postSchema.index({ title: "text", body: "text" })
```

Then you can query like:
```js
Post.find({ $text: { $search: "mongodb indexing" } })
```

This finds documents containing the words "mongodb" or "indexing" anywhere in `title` or `body`.

**When to use it:** Search bars, content search, anything where users type keywords to find documents.

---

### 7. Partial Index

Like sparse, but with more control. You define exactly which documents to include using a filter.

```js
userSchema.index(
  { email: 1 },
  { partialFilterExpression: { verified: true } }
)
```

This index only includes verified users. Queries on unverified users won't use it — but that's fine if you rarely query those. The index is smaller and faster.

**When to use it:** When you only ever query a subset of documents and want a lean, targeted index.

---

## The Prefix Rule (Very Important for Compound Indexes)

With compound indexes, MongoDB can only use the index if your query starts from the **left side** of the index definition.

Given this index:
```js
userSchema.index({ role: 1, createdAt: -1, username: 1 })
```

MongoDB can use this index for:
- ✅ Queries on `role` alone
- ✅ Queries on `role` + `createdAt`
- ✅ Queries on `role` + `createdAt` + `username`
- ❌ Queries on `createdAt` alone (skips the first field)
- ❌ Queries on `username` alone (skips the first two fields)
- ❌ Queries on `createdAt` + `username` (skips the first field)

This is called the **prefix rule** — the query must match a left-to-right prefix of the index.

**Practical implication:** Think carefully about which field goes first. Put the field you filter on most often first.

---

## The ESR Rule (How to Order Fields in Compound Indexes)

When designing compound indexes, follow the **ESR rule** for best performance:

1. **E — Equality** fields first (exact match filters)
2. **S — Sort** fields second
3. **R — Range** fields last (greater than, less than, between)

```js
// Query: find all admins, sort by date, where createdAt > someDate
// E = role (equality: role === "admin")
// S = createdAt (sort)
// R = createdAt (range: createdAt > someDate)
// Since sort and range are the same field, just one field needed after E
userSchema.index({ role: 1, createdAt: -1 })
```

Another example:
```js
// Query: find verified admins in a date range, sorted by username
// E = verified, role (equality)
// S = username (sort)
// R = createdAt (range)
userSchema.index({ verified: 1, role: 1, username: 1, createdAt: -1 })
```

Following ESR makes MongoDB use the index for as many parts of your query as possible.

---

## When to Add an Index (Decision Guide)

**Add an index when:**
- You query that field frequently (login lookups, dashboard filters, search)
- The collection has many documents (10,000+, especially 100,000+)
- You're filtering, sorting, or doing exact lookups regularly
- The field has high cardinality (many unique values — like email, userId, username)

**Don't add an index when:**
- The collection is small (a full scan is already fast)
- You rarely query by that field
- The field has very low cardinality (e.g. a `boolean` field like `isActive` — only 2 possible values. MongoDB still has to read half the collection either way, so the index doesn't help much on its own)
- You're already indexing it as part of a compound index that covers that query

---

## How to Check if Your Indexes Are Being Used

MongoDB has an `.explain()` method that shows you exactly what it did to execute a query.

```js
User.find({ role: "admin" }).sort({ createdAt: -1 }).explain("executionStats")
```

**What to look for in the output:**

| Field | Good | Bad |
|-------|------|-----|
| `winningPlan.stage` | `IXSCAN` (index scan) | `COLLSCAN` (collection scan) |
| `totalDocsExamined` | Low (close to `nReturned`) | High (much more than `nReturned`) |
| `executionTimeMillis` | Low | High |

If you see `COLLSCAN`, it means MongoDB is reading every document — you likely need an index.

---

## Example User Schema — Every Index Explained

```js
userSchema.index({ username: 1 }, { unique: true, sparse: true })
```
**What it does:** Enables fast lookup by username (e.g. when loading a profile page at `/users/johndoe`).
**Why unique:** No two users can have the same username — enforced at the database level.
**Why sparse:** Users who registered via Google/Apple OAuth might not have a username yet. Without sparse, multiple users with no username would all have `null` and violate the unique constraint.

---

```js
userSchema.index({ email: 1 }, { unique: true, sparse: true })
```
**What it does:** Enables fast lookup by email — critical for login (`User.findOne({ email })`).
**Why unique:** Prevents two accounts sharing the same email.
**Why sparse:** Same reason as username — some users might sign up without an email (e.g. phone number only, or OAuth).

---

```js
userSchema.index({ verified: 1, createdAt: -1 })
```
**What it does:** A compound index for querying users by `verified` status sorted by newest first.
**Use case:** An admin panel showing "all unverified users, newest first" so you can follow up with them. Without this index, MongoDB would scan every user, filter by `verified`, then sort the results in memory.

---

```js
userSchema.index({ role: 1, createdAt: -1 })
userSchema.index({ role: 1, createdAt: 1 })
```
**What they do:** Two compound indexes on `role` + `createdAt`, one ascending and one descending.
**Why two?** One index efficiently serves one sort direction. If you want admins sorted newest first AND a separate query for oldest first, you need both. MongoDB can't efficiently reverse-traverse a compound index when another field is involved.
**Use case:** Admin dashboards, moderation panels, user management pages.

---

```js
userSchema.index({ university: 1 }, { sparse: true })
userSchema.index({ major: 1 }, { sparse: true })
```
**What they do:** Fast lookup of users by university or major — likely powering a student search or directory feature.
**Why sparse:** Non-student users don't have these fields. Without sparse, all 800,000 non-students would sit in the index with `null` values, making it bigger and slower without any benefit.

---

## Quick Reference Summary

| Index Type | Syntax | Use Case |
|-----------|--------|----------|
| Single Field | `{ field: 1 }` | Frequent lookup/filter on one field |
| Compound | `{ field1: 1, field2: -1 }` | Filter + sort across multiple fields |
| Unique | `{ field: 1 }, { unique: true }` | Enforce no duplicates (email, username) |
| Sparse | `{ field: 1 }, { sparse: true }` | Optional fields not present on all docs |
| Unique + Sparse | `{ field: 1 }, { unique: true, sparse: true }` | Unique optional fields |
| TTL | `{ field: 1 }, { expireAfterSeconds: N }` | Auto-delete old documents |
| Text | `{ field: "text" }` | Full-text keyword search |
| Partial | `{ field: 1 }, { partialFilterExpression: {...} }` | Index only a filtered subset |

---

## The Bottom Line

Indexes are one of the most impactful performance tools in MongoDB. A query that takes 10 seconds on a large collection can take 1 millisecond with the right index. But indexes aren't free — every one you add slows down writes and uses memory.

The smart approach is:
1. Index fields you know you'll query on frequently
2. Use compound indexes to cover queries that filter + sort together
3. Use `sparse` for optional fields
4. Use `unique` to enforce data integrity at the database level
5. Run `.explain()` on slow queries to diagnose missing indexes
6. Don't over-index — only add what your query patterns actually need