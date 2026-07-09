# Mongoose — Delete Operations

Methods to remove documents, each with different return values.

**Quick reference — what each returns:**

| Method | Success | No match | Bad input |
|--------|---------|----------|-----------|
| `findByIdAndDelete()` | The deleted doc | `null` (no error) | Throws `CastError` |
| `findOneAndDelete()` | The deleted doc | `null` (no error) | Throws `CastError` |
| `deleteOne()` | `{ deletedCount: 1 }` | `{ deletedCount: 0 }` (no error) | Throws `CastError` |
| `deleteMany()` | `{ deletedCount: N }` | `{ deletedCount: 0 }` (no error) | Throws `CastError` |

**Key decision:** need the deleted document back (for cleanup/logging)? Use `findOneAndDelete`/`findByIdAndDelete`. Otherwise use `deleteOne`/`deleteMany` (lighter).

---

## 1. `findByIdAndDelete()` — Delete by ID

Returns the **deleted document** — useful for cascading cleanup or logging what was removed:

```javascript
const deletedUser = await User.findByIdAndDelete(userId);

if (!deletedUser) {
  // valid-format id, but no such doc → null, nothing was deleted
  return res.status(404).json({ error: 'User not found' });
}

console.log(`Deleted: ${deletedUser.name}`);   // you still have the full doc in memory
```

**Outcomes:**

| Outcome | Result |
|---------|--------|
| Found & deleted | The document as it was before deletion |
| No matching doc | `null` — does NOT throw |
| Malformed id | Throws `CastError` → respond 400 |

---

## 2. `findOneAndDelete()` — Delete by Filter

Same behavior, any filter:

```javascript
const deleted = await User.findOneAndDelete({ email: 'john@example.com' });
```

**Edge case:** if the filter matches multiple docs, only ONE is deleted (arbitrary which). Add `{ sort: ... }` if it matters:

```javascript
// Delete the OLDEST expired session
await Session.findOneAndDelete(
  { expiresAt: { $lt: new Date() } },
  { sort: { expiresAt: 1 } }
);
```

### Use Case: Cascading Deletes

```javascript
const deletedUser = await User.findOneAndDelete({ _id: userId });

if (deletedUser) {
  await Post.deleteMany({ author: deletedUser._id });
  await Comment.deleteMany({ user: deletedUser._id });
}
```

**Edge case — partial cascade failure:** if `Post.deleteMany` succeeds but `Comment.deleteMany` fails (or the server crashes in between), you're left with **orphaned comments** pointing at a deleted user. This is not atomic. Options:
- Wrap all deletes in a **transaction** (session) for all-or-nothing behavior
- Or design queries to tolerate orphans (e.g., populate returns `null` → display "Deleted user")

---

## 3. `deleteOne()` — Delete Without Returning the Doc

```javascript
const result = await User.deleteOne({ _id: userId });

console.log(result);
// { acknowledged: true, deletedCount: 1 }   ← 1 = deleted, 0 = nothing matched

if (result.deletedCount === 0) {
  // no document matched — NOT an error, you must check the count yourself
}
```

**Edge case:** like `findOneAndDelete`, deletes at most ONE doc even if many match the filter.

---

## 4. `deleteMany()` — Bulk Delete

Deletes ALL documents matching the filter:

```javascript
// Delete all inactive users
const result = await User.deleteMany({ isActive: false });
console.log(`Deleted ${result.deletedCount} users`);

// Delete logs older than 30 days
await Log.deleteMany({
  createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
});
```

### ⚠️ The Empty-Filter Danger

```javascript
await User.deleteMany({});   // deletes EVERY document in the collection!
```

**This is the classic production disaster:** a filter built dynamically that ends up empty:

```javascript
// If status is undefined, the filter becomes {} → deletes EVERYTHING
const filter = {};
if (req.query.status) filter.status = req.query.status;
await Order.deleteMany(filter);   // dangerous!

// Guard against it:
if (Object.keys(filter).length === 0) {
  throw new Error('Refusing to delete with an empty filter');
}
```

**Edge case:** `deleteMany` is not a transaction — if it fails midway, already-deleted docs are gone. Deletes are permanent; there is no undo.

---

## 5. Delete Hooks

Deletes trigger **query middleware** (not document middleware):

```javascript
// Pre hook — cascading cleanup before the delete happens
userSchema.pre('findOneAndDelete', async function () {
  const user = await this.model.findOne(this.getFilter());
  if (user) {
    await Post.deleteMany({ author: user._id });
  }
});

// Post hook — receives the deleted doc (or null if nothing matched)
userSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await sendAccountDeletionEmail(doc.email);
  }
});
```

**Edge cases:**
- The post hook's `doc` is `null` when nothing matched — always check before using it.
- `deleteOne()`/`deleteMany()` trigger their own hooks (`pre('deleteOne')`, `pre('deleteMany')`) — a hook registered only for `findOneAndDelete` will NOT fire for `deleteMany`. Register hooks for every method you actually use, or cascades silently don't happen.

---

## 6. Soft Delete Pattern

Instead of permanently deleting, mark documents as deleted — recoverable and auditable:

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
});

// Soft delete method
userSchema.methods.softDelete = function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// Restore
userSchema.methods.restore = function () {
  this.isDeleted = false;
  this.deletedAt = undefined;
  return this.save();
};

// Auto-hide soft-deleted docs from ALL find queries
userSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});
```

Usage:

```javascript
const user = await User.findById(userId);
await user.softDelete();

await User.find();   // soft-deleted users excluded automatically
```

**Edge cases:**
- The `pre(/^find/)` hook does NOT cover `countDocuments`, `aggregate`, or `distinct` unless you add hooks for those too — counts can silently include "deleted" docs.
- Unique indexes still apply to soft-deleted docs: a deleted user's email still blocks a new signup with the same email. Fix with a partial index: `{ unique: true, partialFilterExpression: { isDeleted: false } }`.

**When to use:** users, orders, anything you might need to restore or audit. Hard-delete only truly disposable data (sessions, logs, temp data).

---

## 7. Drop Collection

Removes the entire collection (development/testing only):

```javascript
await User.collection.drop();
```

**Edge case:** dropping a collection that doesn't exist throws `ns not found` — wrap in try/catch when used in test setup.

---

## 8. Summary

| Method | Returns | Use Case |
|--------|---------|----------|
| `findByIdAndDelete(id)` | Deleted doc or `null` | Delete by ID, need doc back |
| `findOneAndDelete(filter)` | Deleted doc or `null` | Delete by filter, need doc back |
| `deleteOne(filter)` | `{ deletedCount: 0 or 1 }` | Lightweight single delete |
| `deleteMany(filter)` | `{ deletedCount: N }` | Bulk delete |

### Key Points

1. No match is **never an error** — you get `null` or `deletedCount: 0` and must check yourself.
2. `deleteMany({})` deletes the entire collection — guard against dynamically-built empty filters.
3. Cascading deletes across collections are **not atomic** — use transactions or tolerate orphans.
4. Hooks are method-specific: a `findOneAndDelete` hook does not fire on `deleteMany`.
5. Prefer **soft deletes** for recoverable data; remember hidden docs still hold unique indexes.
6. Deletes are permanent — there is no undo outside of backups.
