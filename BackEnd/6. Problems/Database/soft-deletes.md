## Soft Deletes

### What is it

A **hard delete** removes a record from the database permanently. A **soft delete** does not remove it — instead it marks the record as deleted (e.g., `deletedAt: Date` or `isDeleted: true`) so it disappears from normal queries but can be recovered or audited later.

**Why you often need soft deletes:**
- Users accidentally delete something and want it back
- You need an audit trail (who deleted what, when)
- Other records reference the deleted record (foreign key integrity)
- Legal/compliance reasons require data retention

The challenge: once you add soft deletes, **every query in your entire app must filter out deleted records**. Forgetting even one query will leak deleted data to users.

### Example

```js
// ❌ BROKEN — hard delete, data is gone forever
app.delete('/posts/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ❌ BROKEN — soft delete added, but queries not updated
app.delete('/posts/:id', async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { deletedAt: new Date() });
  res.json({ success: true });
});

// Now this query still returns deleted posts — bug!
app.get('/posts', async (req, res) => {
  const posts = await Post.find(); // ← does not filter out deletedAt
  res.json(posts);
});
```

### Solution

**Step 1 — Add `deletedAt` to the schema:**

```js
const postSchema = new mongoose.Schema({
  title:     String,
  body:      String,
  author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedAt: { type: Date, default: null }, // null = not deleted, Date = deleted
});
```

**Step 2 — Soft delete endpoint (set deletedAt instead of removing):**

```js
// ✅ Soft delete — mark as deleted, do not remove from DB
app.delete('/posts/:id', async (req, res) => {
  const post = await Post.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null }, // only if not already deleted
    { deletedAt: new Date() },
    { new: true }
  );

  if (!post) return res.status(404).json({ error: 'Post not found' });

  res.json({ success: true });
});
```

**Step 3 — Filter deleted records in ALL queries:**

```js
// ✅ All normal queries must exclude soft-deleted records
app.get('/posts', async (req, res) => {
  const posts = await Post.find({ deletedAt: null }); // ← always filter
  res.json(posts);
});

app.get('/posts/:id', async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, deletedAt: null });
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});
```

**Step 4 — Use a Mongoose plugin to apply the filter automatically (recommended for large apps):**

Instead of manually adding `deletedAt: null` to every query, add a query middleware that applies it automatically.

```js
// In your schema definition
postSchema.pre(/^find/, function () {
  // 'this' is the query — automatically add the filter before every find
  this.where({ deletedAt: null });
});

// Now all find queries automatically exclude soft-deleted posts
const posts = await Post.find();           // automatically adds deletedAt: null
const post  = await Post.findById(id);    // same
const post  = await Post.findOne({...});  // same
```

**Step 5 — Restore a soft-deleted record:**

```js
// ✅ Restore — clear deletedAt
app.post('/posts/:id/restore', async (req, res) => {
  const post = await Post.findOneAndUpdate(
    { _id: req.params.id, deletedAt: { $ne: null } }, // only if actually deleted
    { deletedAt: null },
    { new: true }
  );

  if (!post) return res.status(404).json({ error: 'Post not found or not deleted' });

  res.json({ success: true, post });
});
```

**Step 6 — Admin view: show deleted records:**

```js
// ✅ Admin endpoint — bypass the default filter to show all records
app.get('/admin/posts', async (req, res) => {
  // Use the model directly, bypassing the pre-find middleware
  // by including deletedAt in the query explicitly
  const posts = await Post.find({}).where('deletedAt').ne(undefined);
  // Or disable the middleware with a special flag your middleware checks
  res.json(posts);
});
```

### When to use each solution

| Solution | When to use it |
|---|---|
| **Manual `deletedAt: null` filter** | Simple apps with few queries. Easy to understand, no magic. Risk: easy to forget in new queries. |
| **Schema `pre(/^find/)` middleware** | Recommended for medium/large apps. Applies automatically to all queries so you can't forget. Requires explicit bypass for admin views. |
| **Hard delete** | Use only when data has no audit/recovery requirements and nothing else references the record (e.g., temporary session data, log entries). |
