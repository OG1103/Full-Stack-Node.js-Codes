# Mongoose — Update Operations

Multiple ways to update documents, each with different behaviors for hooks, validation, and return values.

**Quick reference — what each returns:**

| Method | Success | No match | Notes |
|--------|---------|----------|-------|
| `findByIdAndUpdate()` | Doc (old by default, new with `{new: true}`) | `null` | Query hooks only |
| `findOneAndUpdate()` | Doc (same as above) | `null` | Query hooks only |
| `updateOne()` | `{ matchedCount, modifiedCount, ... }` | `matchedCount: 0` (no error) | Query hooks only |
| `updateMany()` | `{ matchedCount, modifiedCount, ... }` | `matchedCount: 0` (no error) | Query hooks only |
| `doc.save()` | The document | N/A (you already have the doc) | **Document hooks + always validates** |

**The #1 gotcha:** update methods **skip schema validation by default**. Pass `{ runValidators: true }` or invalid data can be written. Only `save()` always validates.

---

## 1. `findByIdAndUpdate()` — Update by ID

```javascript
const user = await User.findByIdAndUpdate(
  userId,
  { name: 'John Updated', age: 29 },
  {
    new: true,           // return the UPDATED doc (default false = returns the OLD doc!)
    runValidators: true, // run schema validators (default false!)
  }
);

if (!user) {
  // valid-format id but no such document → null, no error thrown
}
```

**Outcomes:**

| Outcome | Result |
|---------|--------|
| Found & updated | The document (pre-update version unless `new: true`) |
| No matching doc | `null` — does NOT throw |
| Malformed id | Throws `CastError` (handle as 400, like in Read notes) |
| Validation fails (with `runValidators: true`) | Throws `ValidationError`, nothing updated |

**Options:**

```javascript
{
  new: true,             // return post-update doc
  runValidators: true,   // enable validation
  upsert: true,          // create the doc if not found
  select: 'name email',  // fields to return
  lean: true,            // plain object
}
```

---

## 2. `findOneAndUpdate()` — Update by Filter

Same as above but with any filter:

```javascript
const user = await User.findOneAndUpdate(
  { email: 'john@example.com' },     // filter
  { $inc: { loginCount: 1 } },       // update
  { new: true, runValidators: true }
);
```

**Edge case:** if the filter matches multiple docs, only ONE is updated — whichever MongoDB finds first (arbitrary). If "which one" matters, pass a sort:

```javascript
// Cancel the customer's MOST RECENT pending order
await Order.findOneAndUpdate(
  { customer: userId, status: 'pending' },
  { $set: { status: 'cancelled' } },
  { sort: { createdAt: -1 }, new: true }
);
```

---

## 3. `updateOne()` — Update Without Returning the Doc

```javascript
// Note i don't necessarly need $set in basic update
const result = await User.updateOne({ _id: userId }, { $set: { isActive: false } });

console.log(result);
// {
//   acknowledged: true,
//   matchedCount: 1,     ← documents that MATCHED the filter
//   modifiedCount: 1,    ← documents actually CHANGED
//   upsertedCount: 0,
//   upsertedId: null,
// }
```

### `matchedCount` vs `modifiedCount` — Don't Confuse Them

```javascript
// Doc already has isActive: false — update is a no-op
const result = await User.updateOne({ _id: userId }, { $set: { isActive: false } });
// matchedCount: 1   ← found it
// modifiedCount: 0  ← but nothing changed (value was already false)
```

- **"Does the doc exist?"** → check `matchedCount === 0`
- **"Did anything actually change?"** → check `modifiedCount`
- Checking `modifiedCount === 0` to mean "not found" is a bug — it also fires on no-op updates.

**No match is NOT an error:**

```javascript
const result = await User.updateOne({ _id: nonExistentId }, { $set: { name: 'X' } });
// { matchedCount: 0, modifiedCount: 0 } — resolves normally, does not throw
```

---

## 4. `updateMany()` — Bulk Update

Updates ALL documents matching the filter:

```javascript
// Note i don't necessarly need $set in basic update
const result = await User.updateMany(
  { lastLogin: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } },
  { $set: { isActive: false } },
);
console.log(`Deactivated ${result.modifiedCount} users`);
```

**Edge cases:**
- Empty filter `updateMany({}, ...)` updates **every document in the collection**.
- Not a transaction: if it fails partway (rare — e.g., server crash), already-updated docs stay updated.
- `pre('save')` hooks do NOT run — if your hook sets `updatedAt` or hashes passwords, those side effects are silently skipped. Use schema `{ timestamps: true }` (which does work with update methods) or set fields explicitly.

---

## 5. `doc.save()` — Full Document Update

Find → modify → save. Triggers **all document middleware** and **always validates**:

```javascript
const user = await User.findById(userId);
user.name = 'Updated Name';
user.age = 30;
await user.save();   // pre('save') → validation → write → post('save')
```

### When to Use `save()` Over Update Methods

- You need **pre/post save hooks** (password hashing, slug generation)
- You need **full validation** including cross-field validators
- You need `isModified()` checks in hooks

### Edge Case — Race Conditions (Lost Updates)

`findById` → modify → `save()` is a read-modify-write cycle. Two concurrent requests can both read the same value and overwrite each other:

```javascript
// UNSAFE for counters: both requests read stock=1, both save stock=0 → oversold
const product = await Product.findById(id);
product.stock -= 1;
await product.save();

// SAFE: atomic operator + guard condition, single DB operation
const result = await Product.updateOne(
  { _id: id, stock: { $gte: 1 } },   // only match if stock is available
  { $inc: { stock: -1 } }
);
if (result.modifiedCount === 0) throw new Error('Out of stock');
```

**Rule:** for counters and concurrent modifications, use atomic operators (`$inc`, etc.) — not `save()`.

---

## 6. Update Operators

### `$set` — Set Field Values

```javascript
await User.updateOne({ _id: userId }, { $set: { name: "New Name", "address.city": "New York" } });
```

> **Note:** All Mongoose update methods — `updateOne()`, `updateMany()`, `findByIdAndUpdate()`, `findOneAndUpdate()`, etc. — automatically wrap plain objects in `$set`. So passing `{ name: 'John' }` updates only that field and leaves the rest of the document untouched. Writing `$set` explicitly is optional; other operators like `$inc`, `$push`, and `$unset` must always be written explicitly. This auto-wrapping is a Mongoose feature — the native MongoDB driver requires an explicit operator.

### `$unset` — Remove a Field

```javascript
await User.updateOne({ _id: userId }, { $unset: { phone: '', tempField: '' } });
// The value ('') doesn't matter — the fields are removed from the document
```

### `$inc` — Increment/Decrement (Atomic!)

```javascript
await Product.updateOne({ _id: id }, { $inc: { views: 1 } });    // +1
await Product.updateOne({ _id: id }, { $inc: { stock: -1 } });   // -1
```

**Why it matters:** `$inc` is applied server-side atomically — concurrent increments never lose updates, unlike read-modify-`save()`.

**Edge case:** `$inc` on a missing field creates it (starting from 0). `$inc` on a non-numeric field throws.

### `$push` — Add to Array (allows duplicates)

```javascript
await User.updateOne({ _id: userId }, { $push: { hobbies: 'swimming' } });

// Push multiple:
await User.updateOne(
  { _id: userId },
  { $push: { hobbies: { $each: ['swimming', 'hiking'] } } }
);

// Push, sort, and cap the array at the last 10:
await User.updateOne(
  { _id: userId },
  { $push: { notifications: {
      $each: [{ message: 'New alert', date: new Date() }],
      $sort: { date: -1 },
      $slice: 10,
  } } }
);
```

**Edge cases:** pushing to a nonexistent field creates the array. Pushing to a field that exists but is NOT an array throws an error.

### `$addToSet` — Add to Array (no duplicates)

```javascript
await User.updateOne({ _id: userId }, { $addToSet: { roles: 'moderator' } });
// Only added if not already present — no error if it exists, just a no-op (modifiedCount: 0)
```

**Edge case:** objects are compared by **deep equality of all fields**. Two subdocuments that look the same but have different `_id`s count as different — both get added.

### `$pull` — Remove from Array

```javascript
// Remove by value
await User.updateOne({ _id: userId }, { $pull: { hobbies: 'swimming' } });

// Remove by condition — removes ALL matching elements
await User.updateOne({ _id: userId }, { $pull: { notifications: { read: true } } });
```

### `$pop` — Remove First/Last Element

```javascript
await User.updateOne({ _id: userId }, { $pop: { hobbies: 1 } });   // remove last
await User.updateOne({ _id: userId }, { $pop: { hobbies: -1 } });  // remove first
```

### `$rename` — Rename a Field

```javascript
await User.updateMany({}, { $rename: { oldFieldName: 'newFieldName' } });
// Edge case: if newFieldName already exists, it's silently overwritten
```

---

## 7. Updating Array Elements In Place (Positional Operators)

### `$` — First Matching Element

```javascript
// The filter must include the array condition; $ targets the element that matched it
await Order.updateOne(
  { _id: orderId, 'items.sku': 'ABC123' },
  { $set: { 'items.$.shipped': true } }
);
// Only the FIRST item with sku 'ABC123' is updated
```

### `$[]` — Every Element

```javascript
await Order.updateOne(
  { _id: orderId },
  { $mul: { 'items.$[].price': 0.9 } }   // 10% off every item
);
```

### `$[name]` + `arrayFilters` — Elements Matching a Condition

```javascript
await Order.updateOne(
  { _id: orderId },
  { $set: { 'items.$[elem].isBulk': true } },
  { arrayFilters: [{ 'elem.quantity': { $gt: 5 } }] }
);
// Updates every item with quantity > 5
```

**Edge case:** using `$[elem]` without a matching `arrayFilters` entry throws `No array filter found for identifier 'elem'`. The names must match exactly.

---

## 8. `$set` vs Direct Object for Nested Updates (Critical!)

### Direct object — REPLACES the whole nested object

```javascript
// Before: { address: { street: '123 Main', city: 'NYC', zip: '10001' } }

await User.updateOne({ _id: userId }, { address: { city: 'Boston' } });

// After: { address: { city: 'Boston' } }
// street and zip are GONE!
```

### Dot notation — updates ONLY that field

```javascript
await User.updateOne({ _id: userId }, { $set: { 'address.city': 'Boston' } });

// After: { address: { street: '123 Main', city: 'Boston', zip: '10001' } }
// Everything else preserved
```

**Rule:** always use dot notation for nested field updates unless you intentionally want to replace the whole object.

### Note: the all-or-nothing rule
 
If the update object has **no operators**, Mongoose auto-wraps everything in `$set`:
 
```js
await User.findByIdAndUpdate(id, { name: "Ali" });
// Mongoose sends: { $set: { name: "Ali" } } → only `name` is updated
```
 
But the moment the update object contains **any `$` operator**, auto-wrapping stops —
**everything** must now be inside an operator. No mixing plain fields with operators.
 
```js
// ✅ Plain fields only → auto $set
{ name: "Ali", age: 25 }
 
// ✅ Operators only
{ $inc: { views: 1 } }
 
// ❌ Mixed — NOT allowed
{ $inc: { views: 1 }, name: "Ali" }
 
// ✅ Fix — wrap the field in $set yourself
{ $inc: { views: 1 }, $set: { name: "Ali" } }
```
 
Multiple fields per operator are fine, and it's still **one query**:
 
```js
await User.findByIdAndUpdate(id, {
  $inc: { loginCount: 1, points: 10 },
  $set: { name: "Ali", lastLogin: new Date() },
});
```
 
**Rule of thumb:** the update object is either all plain fields, or all operators — never both.

---

## 9. Upsert — Update or Create

```javascript
const user = await User.findOneAndUpdate(
  { email: 'john@example.com' },
  { $set: { name: 'John' }, $setOnInsert: { createdVia: 'import' } },
  { upsert: true, new: true }
);
```

- If a doc matches → it's updated.
- If nothing matches → a new doc is created from the filter's equality fields + the update.
- `$setOnInsert` fields apply **only** when the doc is created, not on updates.

**Edge case (race):** two simultaneous upserts on the same unique key — one can lose and throw `code: 11000`. Catch and retry as a plain update.

---

## 10. `findOneAndReplace()` — Replace Entire Document

```javascript
const replaced = await User.findOneAndReplace(
  { _id: userId },
  { name: 'Completely New', email: 'new@example.com' },  // this becomes the WHOLE doc
  { new: true }
);
```

Unlike `findOneAndUpdate`, every field not in the replacement object is **removed** (except `_id`). Rarely what you want — prefer `$set` updates.

---

## 11. Summary

| Operator | Purpose | Key edge case |
|----------|---------|---------------|
| `$set` | Set field values | Use dot notation for nested fields |
| `$unset` | Remove fields | Value in the operator is ignored |
| `$inc` | Atomic increment | Missing field starts at 0; non-number throws |
| `$push` | Add to array | Non-array target throws |
| `$addToSet` | Add unique | Objects compared by deep equality (incl. `_id`) |
| `$pull` | Remove from array | Removes ALL matches |
| `$pop` | Remove first/last | `1` = last, `-1` = first |
| `$rename` | Rename field | Overwrites existing target silently |

### Key Points

1. `{ new: true }` to get the updated doc back — default returns the **old** version.
2. `{ runValidators: true }` — update methods **skip validation by default**.
3. `save()` = document hooks + always validates; update methods = query hooks only.
4. `matchedCount === 0` means "not found"; `modifiedCount === 0` alone can just mean "no-op".
5. `findOneAndUpdate` on no match → `null` (no error); `updateOne` on no match → counts of 0 (no error).
6. Use atomic operators (`$inc`, guarded `updateOne`) for anything modified concurrently — read-modify-`save()` loses updates under race conditions.
7. Dot notation updates nested fields; direct objects replace them entirely.
