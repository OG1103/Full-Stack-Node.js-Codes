# Updating Documents in Mongoose

## 1. `updateOne()` - Update a Single Document
### ✅ Description
- Updates **the first document** that matches the filter.
- Returns an **acknowledgment** with update count.
- Does **not return** the updated document.

### 📌 Example:
```js
const updateSingleUser = async () => {
  try {
    const result = await User.updateOne({ name: "Alice" }, { age: 30 });
    console.log("Update Result:", result);
  } catch (err) {
    console.error("Error updating user:", err.message);
  }
};
```

### 🔹 Expected Output:
- **If successful** → `{ acknowledged: true, modifiedCount: 1, matchedCount: 1 }`
- **If no match found** → `{ acknowledged: true, modifiedCount: 0, matchedCount: 0 }`

---

## 2. `updateMany()` - Update Multiple Documents
### ✅ Description
- Updates **all documents** that match the filter.
- Returns update count but **not** updated documents.

### 📌 Example:
```js
const updateMultipleUsers = async () => {
  try {
    const result = await User.updateMany({ age: { $lt: 30 } }, { age: 30 });
    console.log("Bulk Update Result:", result);
  } catch (err) {
    console.error("Error updating users:", err.message);
  }
};
```

### 🔹 Expected Output:
- **If successful** → `{ acknowledged: true, modifiedCount: X, matchedCount: Y }`
- **If no match found** → `{ acknowledged: true, modifiedCount: 0, matchedCount: 0 }`

---

## 3. `findByIdAndUpdate()` - Find by ID and Update
### ✅ Description
- Finds a document by `_id`, updates it, and **returns** the document.
- Default: Returns the **old document** (before update).
- `{ new: true }` returns the **updated document**.

### 📌 Example:
```js
const updateUserById = async (id) => {
  try {
    const user = await User.findByIdAndUpdate(id, { age: 40 }, { new: true });
    console.log("Updated User By ID:", user);
  } catch (err) {
    console.error("Error updating user by ID:", err.message);
  }
};
```

### 🔹 Expected Output:
- **If successful** → `{ _id: "abc123", name: "Alice", age: 40 }`
- **If ID not found** → `null`

---

## 4. `findOneAndUpdate()` - Find One and Update
### ✅ Description
- Finds the **first document** matching a filter and updates it.
- `{ new: true }` returns the updated document.
- `{ upsert: true }` inserts a new document if none is found.

### 📌 Example:
```js
const updateUser = async () => {
  try {
    const user = await User.findOneAndUpdate({ name: "Bob" }, { age: 32 }, { new: true });
    console.log("Updated User:", user);
  } catch (err) {
    console.error("Error updating user:", err.message);
  }
};
```

### 🔹 Expected Output:
- **If successful** → `{ _id: "xyz789", name: "Bob", age: 32 }`
- **If no match found** → `null`

---

## 5. `new Model() + save()` - Load, Modify, and Save
### ✅ Description
- Finds a document, **modifies it manually**, and calls `.save()`.
- **Useful for updating multiple fields at different times.**

### 📌 Example:
```js
const updateWithSave = async () => {
  try {
    const user = await User.findOne({ name: "Charlie" });
    if (user) {
      user.age = 35;
      await user.save();
      console.log("Saved User:", user);
    } else {
      console.log("User not found.");
    }
  } catch (err) {
    console.error("Error saving updated user:", err.message);
  }
};
```

### 🔹 Expected Output:
- **If successful** → `{ _id: "def456", name: "Charlie", age: 35 }`
- **If not found** → `User not found.`

---

## 6. Handling Update Errors
### ✅ Description
- Updates can fail due to:
  - **Validation errors** (if validation is enabled).
  - **MongoDB connection issues**.

### 📌 Example (Error Handling):
```js
const safeUpdate = async () => {
  try {
    const result = await User.updateOne({ name: "Unknown" }, { age: 50 });
    console.log("Update result:", result);
  } catch (err) {
    console.error("Update failed:", err.message);
  }
};
```

### 🔹 Expected Output:
- **If update successful** → `{ acknowledged: true, modifiedCount: 1, matchedCount: 1 }`
- **If failure occurs** → Logs error message

---

## Summary

| Method | Returns | Use Case |
|--------|---------|----------|
| `updateOne()` | Update result | Update one document |
| `updateMany()` | Update result | Update multiple documents |
| `findByIdAndUpdate()` | Updated document | Find by ID and update |
| `findOneAndUpdate()` | Updated document | Find one and update |
| `save()` | Saved document | Load, modify, then save |
