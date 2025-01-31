# Query Options in Mongoose

Mongoose provides various query options that allow you to customize how data is retrieved from MongoDB.

## 1. `select()` - Choose Fields to Return
### ✅ Description
- Limits the fields included in the result.
- Use space-separated field names or an object with `1` (include) and `0` (exclude).

### 📌 Example:
```js
const findUserWithSelectedFields = async () => {
  try {
    const user = await User.findOne({ name: "Alice" }).select("name age");
    console.log("User with selected fields:", user);
  } catch (err) {
    console.error("Error selecting fields:", err.message);
  }
};
```

### 🔹 Expected Output:
- `{ name: "Alice", age: 25 }`

---

## 2. `sort()` - Order Query Results
### ✅ Description
- Sorts the documents in ascending (`1`) or descending (`-1`) order.

### 📌 Example:
```js
const findSortedUsers = async () => {
  try {
    const users = await User.find().sort({ age: -1 });
    console.log("Sorted users:", users);
  } catch (err) {
    console.error("Error sorting users:", err.message);
  }
};
```

### 🔹 Expected Output:
- `[ { name: "Charlie", age: 40 }, { name: "Alice", age: 25 } ]`

---

## 3. `limit()` - Restrict Number of Results
### ✅ Description
- Limits the number of documents returned.

### 📌 Example:
```js
const findLimitedUsers = async () => {
  try {
    const users = await User.find().limit(2);
    console.log("Limited users:", users);
  } catch (err) {
    console.error("Error limiting users:", err.message);
  }
};
```

### 🔹 Expected Output:
- Only 2 users returned.

---

## 4. `skip()` - Offset Results
### ✅ Description
- Skips a given number of documents before returning results.
- Useful for **pagination**.

### 📌 Example:
```js
const findUsersWithOffset = async () => {
  try {
    const users = await User.find().skip(2).limit(3);
    console.log("Paginated users:", users);
  } catch (err) {
    console.error("Error paginating users:", err.message);
  }
};
```

### 🔹 Expected Output:
- Skips first 2 users, returns next 3.

---

## 5. `countDocuments()` - Count Matching Documents
### ✅ Description
- Counts the number of documents matching a filter.

### 📌 Example:
```js
const countUsers = async () => {
  try {
    const userCount = await User.countDocuments({ age: { $gte: 30 } });
    console.log("Users count:", userCount);
  } catch (err) {
    console.error("Error counting users:", err.message);
  }
};
```

### 🔹 Expected Output:
- `Users count: 5` (example count).

---

## 6. `lean()` - Optimize Query Performance
### ✅ Description
- Converts the result to a **plain JavaScript object** instead of a Mongoose document.
- Improves performance.

### 📌 Example:
```js
const findLeanUsers = async () => {
  try {
    const users = await User.find().lean();
    console.log("Lean users:", users);
  } catch (err) {
    console.error("Error with lean query:", err.message);
  }
};
```

### 🔹 Expected Output:
- Returns **plain objects** instead of Mongoose models.

---

## 7. `where()` - Chain Query Conditions
### ✅ Description
- Allows chaining conditions for readability.

### 📌 Example:
```js
const findUsersWhere = async () => {
  try {
    const users = await User.where("age").gt(20).lt(40);
    console.log("Users in age range:", users);
  } catch (err) {
    console.error("Error using where:", err.message);
  }
};
```

### 🔹 Expected Output:
- Returns users with `20 < age < 40`.

---

## Summary

| Method | Use Case | Example |
|--------|---------|---------|
| `select()` | Choose fields | `.select("name age")` |
| `sort()` | Sort results | `.sort({ age: -1 })` |
| `limit()` | Restrict results | `.limit(5)` |
| `skip()` | Offset results | `.skip(5).limit(10)` |
| `countDocuments()` | Count documents | `.countDocuments({ age: { $gte: 30 } })` |
| `lean()` | Optimize query | `.lean()` |
| `where()` | Chain conditions | `.where("age").gt(20).lt(40)` |
