# Mongoose — Virtual Properties

Virtuals are fields that are **computed on the fly** — they don't exist in the database but appear on documents when accessed. They're useful for derived data that doesn't need to be stored.

---

## 1. Basic Virtuals (Getters)

### Defining a Virtual

```javascript
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  birthYear: Number,
});

// Virtual getter — computed property
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('age').get(function () {
  return new Date().getFullYear() - this.birthYear;
});

const User = mongoose.model('User', userSchema);
```

### Using Virtuals

```javascript
const user = await User.create({ firstName: 'John', lastName: 'Doe', birthYear: 1995 });

user.fullName;  // 'John Doe'       ← computed, not stored in DB
user.age;       // 29               ← computed from birthYear
```

**Important:** Virtuals are NOT included in `toJSON()` or `toObject()` by default. Enable them:

```javascript
const userSchema = new mongoose.Schema(
  { firstName: String, lastName: String },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
```

Now `res.json(user)` will include `fullName` in the response.

---

## 2. Virtual Setters

Setters allow you to **decompose a value** and set real fields:

```javascript
userSchema.virtual('fullName')
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (fullName) {
    const [first, ...rest] = fullName.split(' ');
    this.firstName = first;
    this.lastName = rest.join(' ');
  });

// Usage:
const user = new User();
user.fullName = 'John Doe';
// user.firstName = 'John'
// user.lastName = 'Doe'
await user.save();
```

---

## 3. Virtual Populate (Reverse References)

The most powerful use of virtuals — create a reference from **parent to children** without storing an array of IDs in the parent.

### The Problem

```javascript
// A User has many Posts
// Option 1: Store post IDs in the user (requires manual management)
const userSchema = new mongoose.Schema({
  name: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],  // Must update on every post create/delete
});

// Option 2: Virtual populate (no storage needed — computed from Post's author field)
```

### Setting Up Virtual Populate

```javascript
// Post schema — stores a reference to its author
const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Post = mongoose.model('Post', postSchema);

// User schema — virtual reference to posts
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('posts', {
  ref: 'Post',            // The model to populate from
  localField: '_id',      // Field on User (the parent)
  foreignField: 'author', // Field on Post that references User
});

const User = mongoose.model('User', userSchema);
```

### Using Virtual Populate

```javascript
const user = await User.findById(userId).populate('posts');

// user.posts = [
//   { _id: ..., title: 'First Post', body: '...', author: userId },
//   { _id: ..., title: 'Second Post', body: '...', author: userId },
// ]
```

### Virtual Populate Options

```javascript
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
  justOne: false,          // false = array (default), true = single document
  count: false,            // true = return count instead of documents
  match: { isPublished: true },  // Only populate published posts
  options: {               // Query options for the populated documents
    sort: { createdAt: -1 },
    limit: 10,
  },
});
```

### Count Virtual

Get the count of related documents instead of the documents themselves:

```javascript
userSchema.virtual('postCount', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
  count: true,             // Returns a number instead of an array
});

const user = await User.findById(userId).populate('postCount');
user.postCount;  // 15
```

---

## 4. Direct Populate vs Virtual Populate

### Direct Populate (Stored Reference)

```javascript
// Parent stores child IDs
const userSchema = new mongoose.Schema({
  name: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
});

// Must manually push/pull IDs
const post = await Post.create({ title: 'Hello', author: user._id });
user.posts.push(post._id);
await user.save();

// Populate
const user = await User.findById(id).populate('posts');
```

### Virtual Populate (Computed Reference)

```javascript
// Parent does NOT store child IDs
const userSchema = new mongoose.Schema({ name: String });

userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author',
});

// No manual management — just create posts with the author reference
await Post.create({ title: 'Hello', author: user._id });

// Populate
const user = await User.findById(id).populate('posts');
```

### Comparison

| Feature | Direct Populate | Virtual Populate |
|---------|----------------|-----------------|
| Storage | Parent stores array of child IDs | No storage in parent |
| Create child | Must push ID to parent + save | Just create child with reference |
| Delete child | Must pull ID from parent + save | Just delete the child |
| Query direction | Parent → Children | Children → Parent (reversed) |
| Performance | Faster (IDs already in parent) | Slightly slower (extra query) |
| Data integrity | Can become out of sync | Always accurate |
| Maintenance | More code to keep in sync | Zero maintenance |
| Best for | Small, stable arrays (roles, tags) | Large/dynamic relationships (posts, comments) |

### When to Use Each

**Direct Populate** — when the array is small and relatively stable:
- User's roles: `['admin', 'editor']`
- Product's tags: `[tagId1, tagId2]`
- Order's items (known at creation time)

**Virtual Populate** — when the relationship is large or frequently changing:
- User's posts (could be hundreds)
- Product's reviews (grows over time)
- Author's books (one-to-many)

---

## 5. Virtuals in Queries

Virtuals **cannot** be used in queries or aggregation because they don't exist in the database:

```javascript
// DOES NOT WORK — fullName is not a real field
await User.find({ fullName: 'John Doe' });

// WORKS — query the actual fields
await User.find({ firstName: 'John', lastName: 'Doe' });
```

You also cannot `sort()`, `$match`, or index virtual fields.

---

## 6. Summary

| Virtual Type | Purpose | Example |
|-------------|---------|---------|
| Getter | Compute a derived value | `fullName` from first + last |
| Setter | Decompose a value into real fields | Set `firstName`/`lastName` from `fullName` |
| Virtual Populate | Reverse reference without storage | User → Posts without storing post IDs |
| Count Virtual | Count of related documents | `postCount` |

### Key Points

1. Virtuals are **not stored** in the database — computed at runtime
2. Enable `{ virtuals: true }` in `toJSON`/`toObject` options to include them in responses
3. Virtual populate eliminates the need to **manually sync** parent-child arrays
4. Virtuals **cannot be queried**, sorted, or indexed
5. Always use **regular functions** (not arrow functions) for `this` binding
