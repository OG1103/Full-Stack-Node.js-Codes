## N+1 Query Problem

### What is it

The N+1 problem happens when your code runs **one query to fetch a list**, then runs **one extra query for every item in that list** to get related data.

If you fetch 100 posts, you end up doing 101 database round-trips — 1 for the list, then 1 per post to get its author. Each round-trip has overhead. 100 queries is roughly 100x slower than 1 well-written query.

```
Without fix:
  Query 1:   find all posts                    → 100 posts
  Query 2:   find user where id = post[0].author
  Query 3:   find user where id = post[1].author
  ...
  Query 101: find user where id = post[99].author

Total: 101 queries
```

### Example

```js
// ❌ BROKEN — N+1 query
app.get('/posts', async (req, res) => {
  const posts = await Post.find();

  // For every post, a separate query fires to get the author
  // 100 posts = 100 extra queries
  const result = await Promise.all(
    posts.map(async (post) => {
      const author = await User.findById(post.authorId); // ← separate query per post
      return { ...post.toObject(), author };
    })
  );

  res.json(result);
});
```

`Promise.all` does not fix this — it fires all 100 queries at the same time (concurrently), which hammers the database connection pool. The total number of queries is the same.

### Solution

Use Mongoose `.populate()` to fetch all related data in **one extra query** instead of one per document.

```js
// ✅ FIXED — populate fetches all authors in one query
app.get('/posts', async (req, res) => {
  const posts = await Post.find().populate('authorId', 'name email');
  // Mongoose fires 2 queries total:
  //   1. find all posts
  //   2. find all users WHERE _id IN [list of authorIds]  ← one batch, not one per post

  res.json(posts);
});
```

Your Post schema needs a ref for populate to work:

```js
const postSchema = new mongoose.Schema({
  title:    String,
  body:     String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ← ref tells populate which model to query
});
```

**Alternative — manual batch query (when populate is not an option):**

```js
// ✅ ALTERNATIVE — 2 queries total using $in
app.get('/posts', async (req, res) => {
  // Query 1: get all posts
  const posts = await Post.find().lean();

  // Collect all unique author IDs
  const authorIds = [...new Set(posts.map((p) => p.authorId.toString()))];

  // Query 2: fetch ALL those users in one query using $in
  const authors = await User.find({ _id: { $in: authorIds } }).lean();

  // Build a lookup map: { userId → user }
  const authorMap = Object.fromEntries(authors.map((u) => [u._id.toString(), u]));

  // Attach author to each post — no extra queries
  const result = posts.map((post) => ({
    ...post,
    author: authorMap[post.authorId.toString()],
  }));

  res.json(result);
});
```

Total: **2 queries** no matter how many posts exist.

### When to use each solution

| Solution | When to use it |
|---|---|
| **`.populate()`** | Default choice. Simple, clean, and handled by Mongoose automatically. Use whenever you have a `ref` set up on the schema. |
| **Manual `$in` batch** | Use when you need more control over the query, when `populate` is too limiting, or when you are working with IDs that come from an earlier step rather than directly from a field ref. |
