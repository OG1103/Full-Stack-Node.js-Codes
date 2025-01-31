# Deleting Documents in Mongoose

## 1. `deleteOne()` - Delete a Single Document
### ✅ Description
- Deletes **the first document** that matches the filter.
- Returns an **acknowledgment** with deletion count.
- If **no matching document exists**, deletion count is `0`.

### 📌 Example:
```js
const deleteSingleUser = async () => {
  try {
    const result = await User.deleteOne({ name: "Alice" });
    console.log("Delete Result:", result);
  } catch (err) {
    console.error("Error deleting user:", err.message);
  }
};
```

### 🔹 Expected Output:
- **If successful** → `{ acknowledged: true, deletedCount: 1 }`
- **If no match found** → `{ acknowledged: true, deletedCount: 0 }`

---

## 2. `deleteMany()` - Delete Multiple Documents
### ✅ Description
- Deletes **all documents** that match the filter.
- Returns delete count.

### 📌 Example:
```js
const deleteMultipleUsers = async () => {
  try {
    const result = await User.deleteMany({ age: { $lt: 30 } });
    console.log("Bulk Delete Result:", result);
  } catch (err) {
    console.error("Error deleting users:", err.message);
  }
};
```

### 🔹 Expected Output:
- **If successful** → `{ acknowledged: true, deletedCount: X }`
- **If no match found** → `{ acknowledged: true, deletedCount: 0 }`

---

## 3. `findByIdAndDelete()` - Find by ID and Delete
### ✅ Description
- Finds a document by `_id`, deletes it, and **returns** the deleted document.
- If **no document is found**, returns `null`.

### 📌 Example:
```js
const deleteUserById = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id);
    console.log("Deleted User By ID:", user);
  } catch (err) {
    console.error("Error deleting user by ID:", err.message);
  }
};
```

### 🔹 Expected Output:
- **If successful** → `{ _id: "abc123", name: "Alice" }`
- **If ID not found** → `null`

---

## 4. `findOneAndDelete()` - Find One and Delete
### ✅ Description
- Finds the **first document** matching a filter and deletes it.
- Returns the **deleted document**.

### 📌 Example:
```js
const deleteUser = async () => {
  try {
    const user = await User.findOneAndDelete({ name: "Bob" });
    console.log("Deleted User:", user);
  } catch (err) {
    console.error("Error deleting user:", err.message);
  }
};
```

### 🔹 Expected Output:
- **If successful** → `{ _id: "xyz789", name: "Bob" }`
- **If no match found** → `null`

---

## 5. Handling Deletion Errors
### ✅ Description
- Deletions can fail due to:
  - **Invalid ObjectID format**.
  - **MongoDB connection issues**.

### 📌 Example (Error Handling):
```js
const safeDelete = async () => {
  try {
    const result = await User.deleteOne({ name: "Unknown" });
    console.log("Delete result:", result);
  } catch (err) {
    console.error("Delete failed:", err.message);
  }
};
```

### 🔹 Expected Output:
- **If delete successful** → `{ acknowledged: true, deletedCount: 1 }`
- **If failure occurs** → Logs error message

---

## Summary

| Method | Returns | Use Case |
|--------|---------|----------|
| `deleteOne()` | Deletion result | Delete one document |
| `deleteMany()` | Deletion result | Delete multiple documents |
| `findByIdAndDelete()` | Deleted document | Find by ID and delete |
| `findOneAndDelete()` | Deleted document | Find one and delete |
