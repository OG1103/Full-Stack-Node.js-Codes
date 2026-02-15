# Mongoose — Populate (Reference Resolution)

Populate replaces an `ObjectId` reference with the **actual document** from another collection. It's Mongoose's way of performing JOIN-like operations.

---

## 1. How Populate Works

```
Without Populate:
{ _id: ..., title: 'My Post', author: ObjectId("64f1a2b3...") }

With Populate:
{ _id: ..., title: 'My Post', author: { _id: "64f1a2b3...", name: 'John', email: 'john@...' } }
```

### Schema Setup

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',         // Must match the model name
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
```

---

## 2. Basic Populate

```javascript
// Populate one field
const post = await Post.findById(postId).populate('author');
// post.author = { _id: ..., name: 'John', email: 'john@...' }

// Populate multiple fields
const post = await Post.findById(postId)
  .populate('author')
  .populate('category');

// Or chain them in one call
const post = await Post.findById(postId).populate('author category');
```

### Populate with Field Selection

Only include specific fields from the populated document:

```javascript
const post = await Post.findById(postId)
  .populate('author', 'name email');  // Only name and email from author
// post.author = { _id: ..., name: 'John', email: 'john@...' }

// Exclude specific fields
const post = await Post.findById(postId)
  .populate('author', '-password -__v');
```

### Object Syntax (More Control)

```javascript
const post = await Post.findById(postId).populate({
  path: 'author',
  select: 'name email avatar',
  match: { isActive: true },     // Only populate if author is active
  options: { sort: { name: 1 } },
});

// If match condition fails, author will be null
```

---

## 3. Populate on `find()` Results

```javascript
// Populate across multiple documents
const posts = await Post.find({ isPublished: true })
  .populate('author', 'name email')
  .populate('category', 'name')
  .sort({ createdAt: -1 });
```

---

## 4. Nested Populate (Deep Population)

Populate a reference within a populated document:

```javascript
const commentSchema = new mongoose.Schema({
  text: String,
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

// Populate post, and within post, populate author
const comment = await Comment.findById(commentId)
  .populate({
    path: 'post',
    populate: {
      path: 'author',
      select: 'name',
    },
  })
  .populate('user', 'name');

// comment.post.author.name → 'John'
```

### Multi-Level Nesting

```javascript
const comment = await Comment.findById(commentId).populate({
  path: 'post',
  populate: [
    { path: 'author', select: 'name email' },
    { path: 'category', select: 'name' },
  ],
});
```

---

## 5. Populate an Array of References

```javascript
const playlistSchema = new mongoose.Schema({
  name: String,
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const playlist = await Playlist.findById(playlistId)
  .populate('songs', 'title artist duration')
  .populate('creator', 'name');

// playlist.songs = [
//   { _id: ..., title: 'Song 1', artist: 'Artist A', duration: 210 },
//   { _id: ..., title: 'Song 2', artist: 'Artist B', duration: 185 },
// ]
```

---

## 6. Conditional Populate with `match`

Only populate documents that meet a condition:

```javascript
const user = await User.findById(userId).populate({
  path: 'posts',
  match: { isPublished: true },      // Only populate published posts
  select: 'title createdAt',
  options: {
    sort: { createdAt: -1 },
    limit: 5,
  },
});
```

**Warning:** If `match` doesn't find a result, the field becomes `null` (for single references) or filters out non-matching items (for arrays).

---

## 7. Auto-Populate with Hooks

Automatically populate on every query:

```javascript
postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'name email avatar',
  });
  next();
});

// Now every find query auto-populates author:
const posts = await Post.find();
// posts[0].author = { name: 'John', email: '...', avatar: '...' }
```

---

## 8. Populate After Save

```javascript
const post = await Post.create({
  title: 'New Post',
  author: userId,
});

// post.author is still just an ObjectId
// Populate it:
await post.populate('author');
// Now post.author is the full user document
```

---

## 9. Populate vs Aggregation `$lookup`

| Feature | `.populate()` | `$lookup` |
|---------|-------------|-----------|
| Execution | Multiple queries (N+1) | Single pipeline |
| Performance | Slower for large datasets | Faster (server-side) |
| Ease of use | Simple, chainable | More complex syntax |
| Filtering populated docs | Limited (`match` option) | Full query power |
| Nested populate | Supported | Manual (nested `$lookup`) |
| Works with | Mongoose documents | Aggregation pipeline |

**Use `.populate()`** for simple references and typical CRUD operations.

**Use `$lookup`** for complex joins, reporting, or when performance matters with large datasets.

---

## 10. Summary

| Pattern | Code |
|---------|------|
| Basic populate | `.populate('author')` |
| With field selection | `.populate('author', 'name email')` |
| Multiple fields | `.populate('author category')` |
| Object syntax | `.populate({ path: 'author', select: 'name' })` |
| Nested populate | `.populate({ path: 'post', populate: { path: 'author' } })` |
| Conditional | `.populate({ path: 'posts', match: { isPublished: true } })` |
| After save | `await doc.populate('author')` |

### Key Points

1. `ref` in the schema must match the **model name** exactly
2. Use **field selection** with populate to avoid returning unnecessary data
3. `match` in populate filters the populated data — unmatched refs become `null`
4. Use **auto-populate hooks** (`pre(/^find/)`) for fields you always need
5. For complex or high-performance joins, consider `$lookup` in the aggregation pipeline
6. **Nested populate** is powerful but can cause many database queries — use judiciously
