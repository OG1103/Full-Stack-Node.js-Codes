# Mongoose — Update Operations

Mongoose provides multiple ways to update documents, each with different behaviors regarding hooks, validation, and return values.

---

## 1. Update Methods Overview

| Method | Returns | Hooks | Validation | Use Case |
|--------|---------|-------|-----------|----------|
| `findByIdAndUpdate()` | Updated doc | Query hooks | Optional | Update by ID, get result |
| `findOneAndUpdate()` | Updated doc | Query hooks | Optional | Update by filter, get result |
| `updateOne()` | Write result | Query hooks | Optional | Update one, don't need doc back |
| `updateMany()` | Write result | Query hooks | Optional | Bulk update |
| `doc.save()` | Document | Document hooks | Always | Full document control |

---

## 2. `findByIdAndUpdate()` — Update by ID

```javascript
const user = await User.findByIdAndUpdate(
  userId,                            // ID to find
  { name: 'John Updated', age: 29 }, // Update data
  {
    new: true,             // Return the UPDATED document (default: returns old)
    runValidators: true,   // Run schema validators on update
  }
);

if (!user) {
  console.log('User not found');
}
```

### Options

```javascript
{
  new: true,              // Return updated doc (default: false = returns pre-update doc)
  runValidators: true,    // Enable schema validation
  upsert: false,          // Create document if not found (default: false)
  select: 'name email',  // Fields to return
  lean: true,             // Return plain object
}
```

---

## 3. `findOneAndUpdate()` — Update by Filter

Same as `findByIdAndUpdate` but accepts any filter:

```javascript
const user = await User.findOneAndUpdate(
  { email: 'john@example.com' },     // Filter
  { $inc: { loginCount: 1 } },       // Update
  { new: true, runValidators: true }
);

// More complex filter
const product = await Product.findOneAndUpdate(
  { slug: 'laptop-pro', isActive: true },
  { $set: { price: 899 } },
  { new: true }
);
```

---

## 4. `updateOne()` — Update Without Returning

Returns a write result, not the document:

```javascript
const result = await User.updateOne(
  { _id: userId },
  { $set: { isActive: false } }
);

console.log(result);
// {
//   acknowledged: true,
//   modifiedCount: 1,      ← Number of documents modified
//   upsertedId: null,
//   upsertedCount: 0,
//   matchedCount: 1,       ← Number of documents matched
// }
```

---

## 5. `updateMany()` — Bulk Update

Update all documents matching a filter:

```javascript
// Deactivate all users who haven't logged in for 90 days
const result = await User.updateMany(
  { lastLogin: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } },
  { $set: { isActive: false } }
);

console.log(`Deactivated ${result.modifiedCount} users`);
```

---

## 6. `doc.save()` — Full Document Update

Find, modify, and save — triggers all document middleware:

```javascript
const user = await User.findById(userId);

user.name = 'Updated Name';
user.age = 30;

await user.save();  // Triggers pre('save'), validates, post('save')
```

### When to Use `save()` Over Update Methods

- When you need **pre/post save hooks** (password hashing, slug generation)
- When you need **full validation** (including cross-field validators)
- When you need to run **instance methods** before saving
- When you need `isModified()` checks in hooks

---

## 7. Update Operators

### `$set` — Set Field Values

```javascript
await User.updateOne(
  { _id: userId },
  { $set: { name: 'New Name', 'address.city': 'New York' } }
);
```

**Note:** When using `findByIdAndUpdate()`, Mongoose wraps your update in `$set` automatically if you don't use operators:

```javascript
// These are equivalent:
await User.findByIdAndUpdate(id, { name: 'John' });
await User.findByIdAndUpdate(id, { $set: { name: 'John' } });
```

### `$unset` — Remove a Field

```javascript
await User.updateOne(
  { _id: userId },
  { $unset: { phone: '', tempField: '' } }  // Value doesn't matter
);
// Removes 'phone' and 'tempField' from the document
```

### `$inc` — Increment/Decrement

```javascript
// Increment by 1
await Product.updateOne({ _id: productId }, { $inc: { views: 1 } });

// Decrement by 1
await Product.updateOne({ _id: productId }, { $inc: { stock: -1 } });

// Increment multiple fields
await User.updateOne(
  { _id: userId },
  { $inc: { loginCount: 1, points: 10 } }
);
```

### `$push` — Add to Array

```javascript
// Push one item
await User.updateOne(
  { _id: userId },
  { $push: { hobbies: 'swimming' } }
);

// Push multiple items
await User.updateOne(
  { _id: userId },
  { $push: { hobbies: { $each: ['swimming', 'hiking'] } } }
);

// Push and keep only the last 10 items
await User.updateOne(
  { _id: userId },
  {
    $push: {
      notifications: {
        $each: [{ message: 'New alert', date: new Date() }],
        $slice: -10,     // Keep only last 10
        $sort: { date: -1 },
      },
    },
  }
);

// Push a subdocument
await Order.updateOne(
  { _id: orderId },
  { $push: { items: { product: productId, quantity: 2, price: 29.99 } } }
);
```

### `$addToSet` — Add to Array (No Duplicates)

```javascript
await User.updateOne(
  { _id: userId },
  { $addToSet: { roles: 'moderator' } }
);
// Only adds 'moderator' if it's not already in the array

// Add multiple (no duplicates)
await User.updateOne(
  { _id: userId },
  { $addToSet: { tags: { $each: ['node', 'react', 'mongo'] } } }
);
```

### `$pull` — Remove from Array

```javascript
// Remove a specific value
await User.updateOne(
  { _id: userId },
  { $pull: { hobbies: 'swimming' } }
);

// Remove by condition
await User.updateOne(
  { _id: userId },
  { $pull: { notifications: { read: true } } }
);
// Removes all notifications where read is true

// Remove an ObjectId reference
await User.updateOne(
  { _id: userId },
  { $pull: { friends: friendId } }
);
```

### `$pop` — Remove First or Last Array Element

```javascript
// Remove last element
await User.updateOne({ _id: userId }, { $pop: { hobbies: 1 } });

// Remove first element
await User.updateOne({ _id: userId }, { $pop: { hobbies: -1 } });
```

### `$rename` — Rename a Field

```javascript
await User.updateMany(
  {},
  { $rename: { 'oldFieldName': 'newFieldName' } }
);
```

---

## 8. `$set` vs Direct Object for Nested Updates

This is critical to understand for nested objects:

### Direct Object — **Replaces** the Entire Nested Object

```javascript
// Before: { address: { street: '123 Main', city: 'NYC', zip: '10001' } }

await User.updateOne(
  { _id: userId },
  { address: { city: 'Boston' } }   // Direct replacement
);

// After: { address: { city: 'Boston' } }
// street and zip are GONE!
```

### `$set` with Dot Notation — **Updates** Specific Fields

```javascript
// Before: { address: { street: '123 Main', city: 'NYC', zip: '10001' } }

await User.updateOne(
  { _id: userId },
  { $set: { 'address.city': 'Boston' } }
);

// After: { address: { street: '123 Main', city: 'Boston', zip: '10001' } }
// Only city changed, street and zip preserved!
```

### The Rule

| Method | Behavior |
|--------|---------|
| `{ nestedObj: newValue }` | **Replaces** the entire nested object |
| `{ $set: { 'nested.field': value } }` | **Updates** only the specified field |

Always use **dot notation with `$set`** when updating specific nested fields.

---

## 9. `findOneAndReplace()` — Replace Entire Document

```javascript
const replaced = await User.findOneAndReplace(
  { _id: userId },
  {
    name: 'Completely New',
    email: 'new@example.com',
    // All other fields are removed!
  },
  { new: true }
);
```

Unlike `findOneAndUpdate()`, this replaces the entire document (except `_id`).

---

## 10. Summary

| Operator | Purpose | Example |
|----------|---------|---------|
| `$set` | Set field values | `{ $set: { name: 'John' } }` |
| `$unset` | Remove fields | `{ $unset: { temp: '' } }` |
| `$inc` | Increment/decrement | `{ $inc: { count: 1 } }` |
| `$push` | Add to array | `{ $push: { tags: 'new' } }` |
| `$addToSet` | Add unique to array | `{ $addToSet: { tags: 'new' } }` |
| `$pull` | Remove from array | `{ $pull: { tags: 'old' } }` |
| `$pop` | Remove first/last | `{ $pop: { tags: 1 } }` |
| `$rename` | Rename field | `{ $rename: { old: 'new' } }` |

### Key Points

1. Use `{ new: true }` to get the **updated** document back
2. Use `{ runValidators: true }` to enable **validation** on updates
3. `doc.save()` triggers **document hooks**; update methods trigger **query hooks**
4. Use **dot notation** (`$set: { 'nested.field': value }`) to update nested fields without replacing the entire object
5. `$addToSet` prevents duplicates; `$push` allows them
