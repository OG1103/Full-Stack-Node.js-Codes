# Mongoose Update Operations

Mongoose provides several update operators to modify documents in MongoDB. This guide covers all update operations with examples, expected outputs, and when to use them.

---

## 1. `$set` - Update or Add a Field

### ✅ Description
- Updates an existing field or adds it if it does not exist.

### 📌 Example:
```js
await User.findOneAndUpdate(
  { _id: userId },
  { $set: { name: "John Doe" } },
  { new: true }
);
```

### 🔥 Expected Output:
```json
{
  "_id": "65abcdef1234567890abcd00",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### 🛠 When to Use:
- When updating a **single field**.
- When adding a new field if it does not exist.

---

## 2. `$unset` - Remove a Field

### ✅ Description
- Removes a field from the document.

### 📌 Example:
```js
await User.findOneAndUpdate(
  { _id: userId },
  { $unset: { email: "" } },
  { new: true }
);
```

### 🔥 Expected Output:
```json
{
  "_id": "65abcdef1234567890abcd00",
  "name": "John Doe"
}
```

### 🛠 When to Use:
- When **deleting a specific field** from a document.

---

## 3. `$inc` - Increment/Decrement a Number

### ✅ Description
- Increments (or decrements) a number field.
- To increment just leave the number s it is (+ve) if decrementing ad a -before the number

### 📌 Example:
```js
await Product.findOneAndUpdate(
  { _id: productId },
  { $inc: { stock: -1 } },
  { new: true }
);
```

### 🔥 Expected Output:
```json
{
  "_id": "65abcdef1234567890abcd01",
  "name": "Laptop",
  "stock": 9
}
```

### 🛠 When to Use:
- When **increasing or decreasing numeric fields**, such as inventory stock or user points.

---

## 4. `$push` - Add an Element to an Array

### ✅ Description
- Appends a new value to an array **(allows duplicates)**.

### 📌 Example:
```js
await User.findOneAndUpdate(
  { _id: userId },
  { $push: { wishlist: productId } },
  { new: true }
);
```

### 🔥 Expected Output:
```json
{
  "_id": "65abcdef1234567890abcd00",
  "wishlist": ["65abcdef1234567890abcd01", "65abcdef1234567890abcd02"]
}
```

### 🛠 When to Use:
- When adding **a new item to an array that allows duplicates**.

---

## 5. `$addToSet` - Add Unique Element to an Array

### ✅ Description
- Adds an element **only if it does not already exist**.

### 📌 Example:
```js
await User.findOneAndUpdate(
  { _id: userId },
  { $addToSet: { wishlist: productId } },
  { new: true }
);
```

### 🔥 Expected Output:
```json
{
  "_id": "65abcdef1234567890abcd00",
  "wishlist": ["65abcdef1234567890abcd01"]
}
```

### 🛠 When to Use:
- When adding **a unique value to an array**, like a **favorites list**.

---

## 6. `$pull` - Remove an Element from an Array

### ✅ Description
- Removes a specific value from an array.

### 📌 Example:
```js
await User.findOneAndUpdate(
  { _id: userId },
  { $pull: { wishlist: productId } },
  { new: true }
);
```

### 🔥 Expected Output:
```json
{
  "_id": "65abcdef1234567890abcd00",
  "wishlist": []
}
```

### 🛠 When to Use:
- When **removing a specific item from an array**, such as **unfavoriting a product**.

---

## 7. `$pop` - Remove First or Last Element from an Array

### ✅ Description
- Removes **the first (`-1`) or last (`1`)** item from an array.

### 📌 Example:
```js
await User.findOneAndUpdate(
  { _id: userId },
  { $pop: { wishlist: -1 } }, // Removes the first item
  { new: true }
);
```

### 🔥 Expected Output:
```json
{
  "_id": "65abcdef1234567890abcd00",
  "wishlist": ["65abcdef1234567890abcd02"]
}
```

### 🛠 When to Use:
- When **removing the oldest or newest element** in an array (e.g., chat messages, queue systems).

---

## 8. `$rename` - Rename a Field

### ✅ Description
- Renames a field in the document.

### 📌 Example:
```js
await User.findOneAndUpdate(
  { _id: userId },
  { $rename: { oldFieldName: "newFieldName" } },
  { new: true }
);
```

### 🔥 Expected Output:
```json
{
  "_id": "65abcdef1234567890abcd00",
  "newFieldName": "Some value"
}
```

### 🛠 When to Use:
- When renaming a field **without losing existing data**.

---

## Summary of Update Operations

| Operator   | Description | Example |
|------------|-------------|---------|
| **`$set`** | Updates/adds a field | `{ $set: { name: "John" } }` |
| **`$unset`** | Removes a field | `{ $unset: { email: "" } }` |
| **`$inc`** | Increments/decrements a number | `{ $inc: { stock: -1 } }` |
| **`$push`** | Adds a value to an array | `{ $push: { wishlist: productId } }` |
| **`$addToSet`** | Adds unique value to an array | `{ $addToSet: { wishlist: productId } }` |
| **`$pull`** | Removes a value from an array | `{ $pull: { wishlist: productId } }` |
| **`$pop`** | Removes first/last array item | `{ $pop: { wishlist: -1 } }` |
| **`$rename`** | Renames a field | `{ $rename: { oldField: "newField" } }` |

## Example Of Updating Multiple Things at once 
```js
await User.updateOne(
  { _id: "123" },
  {
    $set: { "profile.city": "Dubai", isActive: false },  // set new values
    $inc: { points: 10, age: 1 },                        // increment numbers, adds 10 to points and 1 to age
    $unset: { "profile.bio": "" }                        // remove a field
  }
);

```
---

## Conclusion
Mongoose provides powerful update operations to modify documents efficiently. Choosing the right update operator ensures optimized database operations and data integrity. 🚀

