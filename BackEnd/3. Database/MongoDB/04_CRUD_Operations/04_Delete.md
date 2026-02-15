# Mongoose — Delete Operations

Mongoose provides multiple methods to remove documents from MongoDB. Each has different return values and behaviors.

---

## 1. Delete Methods Overview

| Method | Returns | Hooks | Use Case |
|--------|---------|-------|----------|
| `findByIdAndDelete()` | Deleted doc | Query hooks | Delete by ID, need doc back |
| `findOneAndDelete()` | Deleted doc | Query hooks | Delete by filter, need doc back |
| `deleteOne()` | Write result | Query hooks | Delete one, don't need doc |
| `deleteMany()` | Write result | Query hooks | Bulk delete |

---

## 2. `findByIdAndDelete()` — Delete by ID

Returns the **deleted document** (useful for cascading deletes or logging):

```javascript
const deletedUser = await User.findByIdAndDelete(userId);

if (!deletedUser) {
  console.log('User not found');
  return;
}

console.log(`Deleted user: ${deletedUser.name}`);
```

### With Options

```javascript
const deleted = await User.findByIdAndDelete(userId, {
  select: 'name email',  // Only return these fields from deleted doc
});
```

---

## 3. `findOneAndDelete()` — Delete by Filter

Same as `findByIdAndDelete` but with a flexible filter:

```javascript
const deleted = await User.findOneAndDelete({ email: 'john@example.com' });

// More complex filter
const expiredSession = await Session.findOneAndDelete({
  expiresAt: { $lt: new Date() },
});
```

### Use Case: Cascading Deletes

```javascript
const deletedUser = await User.findOneAndDelete({ _id: userId });

if (deletedUser) {
  // Clean up related data
  await Post.deleteMany({ author: deletedUser._id });
  await Comment.deleteMany({ user: deletedUser._id });
  await Notification.deleteMany({ recipient: deletedUser._id });
}
```

---

## 4. `deleteOne()` — Delete Without Returning

Returns a write result object, not the deleted document:

```javascript
const result = await User.deleteOne({ _id: userId });

console.log(result);
// {
//   acknowledged: true,
//   deletedCount: 1,       ← 1 if deleted, 0 if not found
// }

if (result.deletedCount === 0) {
  console.log('No document found to delete');
}
```

---

## 5. `deleteMany()` — Bulk Delete

Delete all documents matching a filter:

```javascript
// Delete all inactive users
const result = await User.deleteMany({ isActive: false });
console.log(`Deleted ${result.deletedCount} inactive users`);

// Delete old logs
const result = await Log.deleteMany({
  createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
});

// Delete ALL documents (empty filter)
await TempCollection.deleteMany({});
// WARNING: Deletes everything in the collection
```

---

## 6. Hooks with Delete Operations

### Pre Delete Hook

```javascript
// Using pre hook for cascading deletes
userSchema.pre('findOneAndDelete', async function (next) {
  const user = await this.model.findOne(this.getFilter());
  if (user) {
    await Post.deleteMany({ author: user._id });
  }
  next();
});
```

### Post Delete Hook

```javascript
userSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    console.log(`User ${doc.name} was deleted`);
    await sendAccountDeletionEmail(doc.email);
  }
});
```

---

## 7. Soft Delete Pattern

Instead of permanently deleting, mark documents as deleted:

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
});

// Soft delete method
userSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return await this.save();
};

// Auto-exclude soft-deleted docs from queries
userSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

// Restore a soft-deleted document
userSchema.methods.restore = async function () {
  this.isDeleted = false;
  this.deletedAt = undefined;
  return await this.save();
};

// Usage:
const user = await User.findById(userId);
await user.softDelete();

// Normal queries skip soft-deleted docs automatically
const users = await User.find();  // Only non-deleted users

// To include soft-deleted: bypass the pre hook
const allUsers = await User.find().setOptions({ includeDeleted: true });
```

---

## 8. Drop Collection

For removing an entire collection (development/testing only):

```javascript
await mongoose.connection.dropCollection('users');
// Or
await User.collection.drop();
```

---

## 9. Summary

| Method | Returns | `deletedCount` | Use Case |
|--------|---------|----------------|----------|
| `findByIdAndDelete(id)` | Deleted doc or `null` | — | Delete by ID, need doc |
| `findOneAndDelete(filter)` | Deleted doc or `null` | — | Delete by filter, need doc |
| `deleteOne(filter)` | `{ deletedCount }` | 0 or 1 | Delete one, lightweight |
| `deleteMany(filter)` | `{ deletedCount }` | 0 to N | Bulk delete |

### Key Points

1. Use `findOneAndDelete` / `findByIdAndDelete` when you need the **deleted document** (for cleanup, logging)
2. Use `deleteOne` / `deleteMany` for **lightweight deletes** when you don't need the doc back
3. Implement **soft deletes** for recoverable data (users, orders, important records)
4. Use **pre hooks** on `findOneAndDelete` for cascading cleanup
5. `deleteMany({})` with an empty filter **deletes everything** — use with extreme caution
