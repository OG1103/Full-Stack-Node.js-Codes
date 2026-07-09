# Mongoose — Populate (Reference Resolution)

Populate replaces an `ObjectId` reference with the **actual document** from another collection. It's Mongoose's JOIN-like operation.

```
Without Populate:
{ _id: ..., title: 'My Post', author: ObjectId("64f1a2b3...") }

With Populate:
{ _id: ..., title: 'My Post', author: { _id: "64f1a2b3...", name: 'John', email: 'john@...' } }
```

**How it works under the hood:** populate runs a **second query** against the referenced collection and merges the results — it is not a real database join (that's `$lookup`, see the aggregation notes).

---

## 1. Schema Setup

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const postSchema = new mongoose.Schema({
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',        // must match the MODEL name exactly
    required: true,
  },
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
```

**Edge case:** `ref` must match the **model name** (`'User'`), not the collection name (`'users'`). A wrong `ref` throws `MissingSchemaError: Schema hasn't been registered for model "..."` when you populate.

---

## 2. Basic Populate

```javascript
// One field
const post = await Post.findById(postId).populate('author');

// Multiple fields
const post = await Post.findById(postId).populate('author').populate('category');
// or: .populate('author category')

// With field selection (only pull what you need)
const post = await Post.findById(postId).populate('author', 'name email');
// post.author = { _id, name, email } — nothing else

// Exclude fields instead
const post = await Post.findById(postId).populate('author', '-password -__v');
```

### What Populate Returns per Situation

| Situation | Result |
|-----------|--------|
| Reference exists and doc found | The full (or selected) referenced document |
| Referenced doc was **deleted** (broken ref) | `null` (single ref) / silently missing from array |
| Field is `null`/missing on the parent doc | Stays `null`/missing — no error |
| `ref` model not registered | Throws `MissingSchemaError` |
| Path doesn't exist in schema | Throws `StrictPopulateError` (unless `strictPopulate: false`) |

**The broken-reference trap:** MongoDB has no foreign keys. If a referenced user is deleted, the post keeps its ObjectId, and populate quietly gives you `null`:

```javascript
const post = await Post.findById(postId).populate('author');
console.log(post.author.name);  // TypeError if the user was deleted!

// Always guard:
const authorName = post.author?.name ?? 'Deleted user';
```

---

## 3. Object Syntax (Full Control)

Every field is optional except `path`:

```javascript
const post = await Post.findById(postId).populate({
  path: 'author',            // (required) the field to populate
  select: 'name email',      // fields to include from the referenced doc
  match: { isActive: true }, // only populate if the referenced doc matches this filter
  model: 'User',             // override the model (usually inferred from ref)
  options: {                 // query options for the lookup query
    sort: { name: 1 },
    limit: 5,                // meaningful for ARRAY refs
    lean: true,              // plain objects instead of Mongoose docs
  },
  populate: {                // nested populate (refs inside the populated doc)
    path: 'profile',
    select: 'avatar bio',
  },
  strictPopulate: false,     // don't throw if path isn't in the schema
});
```

| Field | Purpose | Key edge case |
|-------|---------|---------------|
| `path` | Field to populate (dot notation OK) | Wrong path throws unless `strictPopulate: false` |
| `select` | Same syntax as `.select()` | Excluding a nested ref blocks deeper populate |
| `match` | Filter on the referenced docs | Non-matching → `null` (single) / filtered out (array) |
| `model` | Explicit model for the lookup | Needed for refs stored without `ref` in the schema |
| `options` | `sort`/`limit`/`skip`/`lean` on the lookup query | `limit` does nothing useful on a single ref |
| `populate` | Nested populate config | Each level = another query — costs add up |

### `match` — Conditional Populate

```javascript
const user = await User.findById(userId).populate({
  path: 'posts',
  match: { isPublished: true },   // only published posts
  select: 'title createdAt',
  options: { sort: { createdAt: -1 }, limit: 5 },
});
```

**Edge case:** `match` filters the *populated data*, not the parent docs. A single ref that fails the match becomes `null`; array items that fail are dropped from the array. The parent document is always returned either way.

---

## 4. Populate on `find()` Results (Many Docs)

```javascript
const posts = await Post.find({ isPublished: true })
  .populate('author', 'name email')
  .sort({ createdAt: -1 });
```

**Performance note:** Mongoose batches this — one extra query **per populated path**, not per document (it collects all the ObjectIds and runs a single `$in` query). So `find()` + one populate = 2 queries total, regardless of how many posts. Nested/deep populates add one more query per level.

---

## 5. Nested Populate (Deep Population)

Populate a reference **inside** an already-populated document:

```javascript
// comment → post → author
const comment = await Comment.findById(commentId).populate({
  path: 'post',
  populate: { path: 'author', select: 'name' },
});

console.log(comment.post.author.name);
```

Multiple nested paths:

```javascript
const comment = await Comment.findById(commentId).populate({
  path: 'post',
  populate: [
    { path: 'author', select: 'name email' },
    { path: 'category', select: 'name' },
  ],
});
```

**Edge case:** each nesting level is another round trip to the DB. Two or three levels is fine; beyond that, consider `$lookup` or restructuring the schema.

---

## 6. Populate an Array of References

```javascript
const playlistSchema = new mongoose.Schema({
  name: String,
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
});

const playlist = await Playlist.findById(playlistId)
  .populate('songs', 'title artist duration');

// playlist.songs = [ { title, artist, duration }, ... ]
```

**Edge cases:**
- Deleted songs are **silently dropped** from the array — a playlist with 10 refs can populate into 7 docs with no error.
- An empty refs array populates into an empty array (no error).
- `options: { limit }` on array populate limits per parent document.

---

## 7. Virtual Populate (Reverse Lookup)

Normal populate follows a ref you stored. **Virtual populate** goes the other way — "give me all posts whose `author` points at this user" — without storing an array of post ids on the user:

```javascript
userSchema.virtual('posts', {
  ref: 'Post',            // model to query
  localField: '_id',      // this user's _id...
  foreignField: 'author', // ...matched against post.author
});

// Virtuals need these to show up in output:
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const user = await User.findById(id).populate('posts');
// user.posts = all posts where post.author === user._id
```

**Why it's better than storing `posts: [ObjectId]` on the user:** no array to keep in sync on every post create/delete, and no unbounded array growth.

**Edge case:** virtual populate returns `[]` when nothing matches (never `null`), and the virtual is invisible in JSON output unless `toJSON: { virtuals: true }` is set.

---

## 8. Auto-Populate with Hooks

```javascript
postSchema.pre(/^find/, function (next) {
  this.populate({ path: 'author', select: 'name email avatar' });
  next();
});

// Every find query now auto-populates author:
const posts = await Post.find();
```

**Edge case:** this adds the populate query to **every** find, even ones that don't need it — a hidden performance cost. Use only for fields you genuinely always need.

---

## 9. Populate After the Fact

```javascript
const post = await Post.create({ title: 'New Post', author: userId });
// post.author is still just an ObjectId

await post.populate('author');
// now post.author is the full user document
```

**Edge case:** you cannot call `.populate()` on `.lean()` results — lean objects are plain JS objects with no Mongoose methods. Populate must be chained on the query *before* `.lean()`:

```javascript
// CORRECT — populate is part of the query, lean applies to the final result
const post = await Post.findById(id).populate('author').lean();
```

---

## 10. Populate vs `$lookup`

| Feature | `.populate()` | `$lookup` (aggregation) |
|---------|-------------|-----------|
| Execution | Extra query per path | Single pipeline server-side |
| Ease of use | Simple, chainable | More verbose |
| Filter/sort/limit joined docs | Basic (`match`, `options`) | Full pipeline power |
| Returns | Mongoose documents | Plain objects |
| Best for | Typical CRUD reads | Reports, complex joins, large datasets |

---

## 11. Summary

| Pattern | Code |
|---------|------|
| Basic | `.populate('author')` |
| Select fields | `.populate('author', 'name email')` |
| Object syntax | `.populate({ path: 'author', select: 'name' })` |
| Conditional | `.populate({ path: 'posts', match: { isPublished: true } })` |
| Nested | `.populate({ path: 'post', populate: { path: 'author' } })` |
| Reverse (virtual) | `userSchema.virtual('posts', { ref, localField, foreignField })` |
| After create | `await doc.populate('author')` |

### Key Points

1. `ref` must match the **model name** exactly — wrong name throws `MissingSchemaError`.
2. Broken references populate to `null` (single) or vanish from arrays — always guard with `?.`.
3. `match` failing → `null`/filtered out, but the parent doc is still returned.
4. Populate on `find()` is batched: one extra query per path, not per document.
5. Virtual populate = reverse lookup without storing an array of ids; needs `toJSON: { virtuals: true }`.
6. `.populate()` must come before `.lean()` in the chain — lean objects can't populate.
7. For heavy joins and reports, switch to `$lookup`.
