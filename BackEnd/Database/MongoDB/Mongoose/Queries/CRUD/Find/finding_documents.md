# Finding Documents in Mongoose

## 1. `find()` - Retrieve Multiple Documents
### ✅ Description
- **Retrieves all documents** that match a filter.
- If no filter is provided, **returns all documents** in the collection.
- If **no documents match**, an **empty array (`[]`)** is returned.

### 📌 Example:
```js
const findAllUsers = async () => {
  try {
    const users = await User.find({});
    console.log(users.length === 0 ? "No users found." : "All users:", users);
  } catch (err) {
    console.error("Error finding users:", err);
  }
};
```
### 🔹 Expected Output:
- **If users exist** → `[ { name: "Alice", age: 25 }, { name: "Bob", age: 30 } ]`
- **If no users exist** → `No users found.`

---

## 2. `findOne()` - Retrieve a Single Document
### ✅ Description
- Returns **the first document that matches the filter**.
- If **no document is found**, returns `null`.

### 📌 Example:
```js
const findOneUser = async () => {
  try {
    const user = await User.findOne({ name: "John Doe" });
    console.log(user ? "Found user:" : "No user found.", user);
  } catch (err) {
    console.error("Error finding user:", err);
  }
};
```
### 🔹 Expected Output:
- **If user exists** → `{ name: "John Doe", age: 28, email: "john@example.com" }`
- **If not found** → `No user found.`

---

## 3. `findById()` - Retrieve a Document by ID
### ✅ Description
- Searches for a document by its **unique `_id` field**.
- If **no document is found**, returns `null`.

### 📌 Example:
```js
const findUserById = async (id) => {
  try {
    const user = await User.findById(id);
    console.log(user ? "Found user by ID:" : `No user found with ID: ${id}.`, user);
  } catch (err) {
    console.error("Error finding user by ID:", err);
  }
};
```
### 🔹 Expected Output:
- **If user exists** → `{ _id: "abc123", name: "Jane", email: "jane@example.com" }`
- **If not found** → `No user found with ID: abc123.`
