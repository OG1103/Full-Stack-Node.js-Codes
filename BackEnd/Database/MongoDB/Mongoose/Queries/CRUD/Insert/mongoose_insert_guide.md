# Inserting Documents in Mongoose

## 1. `create()` - Insert a Single or Multiple Documents
### ✅ Description
- Inserts **one or more** documents into the database.
- Automatically assigns an `_id` to each document.
- Returns the created document(s).
- If insertion **fails** (e.g., validation error), it **throws an error**.

### 📌 Example (Single Insert):
```js
const insertUser = async () => {
  try {
    const user = await User.create({ name: "Alice", age: 25 });
    console.log("User created:", user);
  } catch (err) {
    console.error("Error inserting user:", err);
  }
};
```

### 🔹 Expected Output:
- **If successful** → `{ _id: "abc123", name: "Alice", age: 25 }`
- **If validation fails** → `Error: Validation failed for 'age'`

---

### 📌 Example (Multiple Inserts):
```js
const insertMultipleUsers = async () => {
  try {
    const users = await User.create([
      { name: "Bob", age: 30 },
      { name: "Charlie", age: 35 }
    ]);
    console.log("Users created:", users);
  } catch (err) {
    console.error("Error inserting multiple users:", err);
  }
};
```

### 🔹 Expected Output:
- **If successful** → `[ { _id: "id1", name: "Bob" }, { _id: "id2", name: "Charlie" } ]`
- **If failure occurs** → Throws an error and **no documents are inserted**.

---

## 2. `insertMany()` - Bulk Insert Multiple Documents
### ✅ Description
- Inserts **multiple documents** in a single operation.
- Faster than multiple `create()` calls.
- Can run in **ordered** or **unordered** mode.
  - **Ordered (`{ ordered: true }`)**: Stops on the first error.
  - **Unordered (`{ ordered: false }`)**: Continues inserting even if some fail.

### 📌 Example:
```js
const bulkInsertUsers = async () => {
  try {
    const users = await User.insertMany(
      [
        { name: "David", age: 28 },
        { name: "Eve", age: 22 },
        { name: "", age: 40 } // Invalid (empty name)
      ],
      { ordered: false } // Continue inserting valid ones
    );
    console.log("Bulk insert result:", users);
  } catch (err) {
    console.error("Bulk insert error:", err);
  }
};
```

### 🔹 Expected Output:
- **If all valid** → `[ { _id: "id1", name: "David" }, { _id: "id2", name: "Eve" } ]`
- **If some fail (`ordered: false`)** → Successfully inserts valid ones, logs error for invalid ones.
- **If `ordered: true` and first fails** → No documents are inserted.

---

## 3. `new Model()` + `.save()` - Insert and Modify Before Saving
### ✅ Description
- Creates a new document **without inserting it immediately**.
- Allows modifications **before saving** to the database.
- Calls `save()` to insert it.

### 📌 Example:
```js
const insertWithSave = async () => {
  try {
    const user = new User({ name: "Frank", age: 32 });
    user.age = 33; // Modify before saving
    await user.save();
    console.log("User saved:", user);
  } catch (err) {
    console.error("Error saving user:", err);
  }
};
```

### 🔹 Expected Output:
- **If successful** → `{ _id: "id3", name: "Frank", age: 33 }`
- **If validation fails** → Throws an error and does **not** save.

---

## 4. Handling Insertion Errors
### ✅ Description
- Insert operations can fail due to:
  - **Validation errors** (e.g., missing required fields).
  - **Duplicate keys** (e.g., `_id` conflicts).
  - **Connection issues**.

### 📌 Example (Error Handling):
```js
const safeInsertUser = async () => {
  try {
    const user = await User.create({ name: "" }); // Missing required field
    console.log("User inserted:", user);
  } catch (err) {
    console.error("Insertion failed:", err.message);
  }
};
```

### 🔹 Expected Output:
- **If validation fails** → `Insertion failed: ValidationError: 'name' is required`
- **If successful** → `{ _id: "xyz789", name: "Valid User" }`

---

## Summary

| Method | Returns | Use Case |
|--------|---------|----------|
| `create()` | Single/Multiple documents | Quick insert |
| `insertMany()` | Array of inserted documents | Bulk insert |
| `new Model() + save()` | Single document | Modify before saving |
