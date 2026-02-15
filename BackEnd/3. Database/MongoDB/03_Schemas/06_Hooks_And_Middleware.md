# Mongoose — Hooks & Middleware

Middleware (hooks) are functions that run **before** or **after** specific Mongoose operations. They're used for validation, data transformation, logging, and side effects like sending emails or cascading deletes.

---

## 1. How Hooks Work

```
Pre Hook → Operation → Post Hook

Example (save):
pre('save') → document.save() → post('save')
```

### Types of Middleware

| Type | Operations | `this` Context |
|------|-----------|---------------|
| **Document** | `save`, `validate`, `remove`, `init` | The document |
| **Query** | `find`, `findOne`, `findOneAndUpdate`, `deleteOne`, `deleteMany`, `updateOne`, `updateMany`, `countDocuments` | The query |
| **Aggregate** | `aggregate` | The aggregation object |

---

## 2. Pre Hooks (Before Operation)

### `pre('save')` — Most Common Hook

Runs before every `save()` and `create()`:

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  slug: String,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password was modified (not on every save)
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Generate slug from name
userSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});
```

### Key Helper Methods in Pre Save Hooks

#### `this.isModified(path)` — Was This Field Changed?

```javascript
userSchema.pre('save', async function (next) {
  // Check if a specific field was modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  // Check if ANY field was modified (no argument)
  if (this.isModified()) {
    console.log('Document was modified');
  }

  next();
});
```

Returns `true` when:
- The field was explicitly set to a new value
- The document is **new** (all fields are considered "modified" on creation)

#### `this.isNew` — Is This a New Document?

```javascript
userSchema.pre('save', function (next) {
  if (this.isNew) {
    console.log('Creating new user:', this.email);
    // Send welcome email, initialize settings, etc.
  } else {
    console.log('Updating existing user:', this.email);
  }
  next();
});
```

#### `this.modifiedPaths()` — Which Fields Changed?

```javascript
userSchema.pre('save', function (next) {
  const modified = this.modifiedPaths();
  console.log('Modified fields:', modified);
  // ['name', 'email'] — array of field names that changed
  next();
});
```

#### `this.get(path)` and `this.set(path, value)`

```javascript
userSchema.pre('save', function (next) {
  const email = this.get('email');       // Read a field
  this.set('email', email.toLowerCase()); // Set a field
  next();
});
```

#### `this.validate()` and `this.invalidate()`

```javascript
userSchema.pre('save', function (next) {
  if (this.startDate > this.endDate) {
    this.invalidate('endDate', 'End date must be after start date');
  }
  next();
});
```

#### `this.markModified(path)` — For Mixed Types

```javascript
userSchema.pre('save', function (next) {
  // Required for Mixed/Object types that Mongoose can't detect changes on
  if (this.metadata && this.metadata.lastLogin) {
    this.markModified('metadata');
  }
  next();
});
```

---

## 3. Pre Hooks on Query Operations

### `pre('findOneAndUpdate')` and `pre('updateOne')`

In query hooks, `this` is the **query**, not the document:

```javascript
// Automatically set updatedAt on every update
userSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Access the update object
userSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  console.log('Update operation:', update);
  // { $set: { name: 'New Name' } }

  // Modify the update
  if (update.$set?.password) {
    update.$set.password = bcrypt.hashSync(update.$set.password, 12);
  }

  next();
});
```

### `this.getUpdate()` — Access Update Data

```javascript
userSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  // Hash password if it's being updated
  if (update.password || update.$set?.password) {
    const password = update.password || update.$set.password;
    const hashed = bcrypt.hashSync(password, 12);

    if (update.$set) {
      update.$set.password = hashed;
    } else {
      update.password = hashed;
    }
  }

  next();
});
```

### `this.getFilter()` and `this.getQuery()` — Access Query Conditions

```javascript
userSchema.pre('findOneAndDelete', async function (next) {
  const filter = this.getFilter();
  // { _id: '...' } — the conditions used to find the document

  // Cascading delete: remove all posts by this user
  const user = await this.model.findOne(filter);
  if (user) {
    await mongoose.model('Post').deleteMany({ author: user._id });
  }

  next();
});
```

### `pre('find')` — Modify All Find Queries

```javascript
// Automatically exclude soft-deleted documents
userSchema.pre('find', function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

// Also apply to findOne
userSchema.pre('findOne', function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});
```

---

## 4. `this.set()` vs Direct Assignment in Pre Hooks

### In Document Hooks (`pre('save')`)

Both work, but `this.set()` triggers Mongoose's change tracking:

```javascript
// Direct assignment — works fine in pre save
userSchema.pre('save', function (next) {
  this.email = this.email.toLowerCase();
  next();
});

// Using this.set() — also works, more explicit
userSchema.pre('save', function (next) {
  this.set('email', this.get('email').toLowerCase());
  next();
});
```

### In Query Hooks (`pre('findOneAndUpdate')`)

You **must** use `this.set()` or modify `this.getUpdate()`:

```javascript
// WRONG — 'this' is the query, not a document
userSchema.pre('findOneAndUpdate', function (next) {
  this.email = 'test@email.com';  // Does nothing useful
  next();
});

// CORRECT — use this.set() on the query
userSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

// CORRECT — modify the update object directly
userSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  update.$set = update.$set || {};
  update.$set.updatedAt = new Date();
  next();
});
```

---

## 5. Post Hooks (After Operation)

### `post('save')` — After Document is Saved

```javascript
userSchema.post('save', function (doc, next) {
  console.log(`User ${doc.name} was saved`);
  // Send welcome email, log event, etc.
  next();
});

// Async post hook
userSchema.post('save', async function (doc) {
  if (doc.isNew) {
    await sendWelcomeEmail(doc.email);
  }
});
```

### `post('find')` — After Query Results

```javascript
userSchema.post('find', function (docs, next) {
  console.log(`Found ${docs.length} users`);
  next();
});

userSchema.post('findOne', function (doc, next) {
  if (doc) {
    console.log(`Found user: ${doc.name}`);
  }
  next();
});
```

### `post('findOneAndDelete')` — Cascading Deletes

```javascript
userSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    // Delete all related data
    await Post.deleteMany({ author: doc._id });
    await Comment.deleteMany({ user: doc._id });
    console.log(`Cleaned up data for deleted user: ${doc.name}`);
  }
});
```

---

## 6. Error Handling in Hooks

### Pre Hook Errors

```javascript
userSchema.pre('save', function (next) {
  if (this.role === 'admin' && !this.adminCode) {
    return next(new Error('Admin code is required for admin users'));
  }
  next();
});
```

### Post Hook Error Handling

```javascript
// Error handling middleware — catches errors from save
userSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Duplicate key error: a user with this email already exists'));
  } else {
    next(error);
  }
});
```

---

## 7. `disconnecting` vs `disconnect` Hook (Socket-like Pattern)

When deleting a document, use `pre` to access the document before it's removed:

```javascript
// pre — document still exists, can access its data
userSchema.pre('findOneAndDelete', async function (next) {
  const user = await this.model.findOne(this.getFilter());
  // user still exists here — clean up references
  await Post.deleteMany({ author: user._id });
  next();
});

// post — document is already deleted
userSchema.post('findOneAndDelete', function (doc) {
  console.log(`User ${doc.name} has been deleted`);
});
```

---

## 8. Common Hook Patterns

### Password Hashing

```javascript
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = new Date();
  next();
});
```

### Slug Generation

```javascript
postSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});
```

### Cascading Deletes

```javascript
categorySchema.pre('findOneAndDelete', async function (next) {
  const category = await this.model.findOne(this.getFilter());
  if (category) {
    await Product.deleteMany({ category: category._id });
  }
  next();
});
```

### Auto-Populate

```javascript
postSchema.pre(/^find/, function (next) {
  // Runs on find, findOne, findById, etc.
  this.populate({ path: 'author', select: 'name email avatar' });
  next();
});
```

---

## 9. Supported Operations

| Hook | Type | `this` | Notes |
|------|------|--------|-------|
| `save` | Document | Document | Runs on `.save()` and `.create()` |
| `validate` | Document | Document | Before validation |
| `remove` | Document | Document | Deprecated — use `findOneAndDelete` |
| `init` | Document | Document | After `new Model(data)` from DB |
| `find` | Query | Query | Before `.find()` |
| `findOne` | Query | Query | Before `.findOne()` and `.findById()` |
| `findOneAndUpdate` | Query | Query | Use `this.getUpdate()` |
| `findOneAndDelete` | Query | Query | Use `this.getFilter()` |
| `updateOne` | Query | Query | Before `.updateOne()` |
| `updateMany` | Query | Query | Before `.updateMany()` |
| `deleteOne` | Query | Query | Before `.deleteOne()` |
| `deleteMany` | Query | Query | Before `.deleteMany()` |
| `aggregate` | Aggregate | Aggregation | Before `.aggregate()` |

---

## 10. Summary

| Concept | Pre Hook | Post Hook |
|---------|---------|-----------|
| Timing | Before operation | After operation |
| `save` | Transform data, hash passwords | Send emails, log events |
| `find` | Add filters, auto-populate | Log query results |
| `delete` | Cascading deletes, cleanup | Logging, notifications |
| Error | Call `next(error)` | Handle in error middleware |

### Key Points

1. `pre('save')` — `this` is the **document**; use `isModified()`, `isNew`
2. `pre('findOneAndUpdate')` — `this` is the **query**; use `getUpdate()`, `getFilter()`
3. Always call `next()` or the operation will hang
4. Use `pre(/^find/)` regex to match all find variants
5. **Arrow functions break `this`** — always use regular functions
6. `this.set()` is required in query hooks; direct assignment only works in document hooks
