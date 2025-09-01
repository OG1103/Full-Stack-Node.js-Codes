# Mongoose Schema Options

Mongoose provides various **schema options** that can be used to configure model behavior.

## 1. `timestamps`
### ✅ Description
- Adds `createdAt` and `updatedAt` fields automatically.
- Useful for tracking when documents are created and modified.

### 📌 Example:
```js
const userSchema = new mongoose.Schema({
  name: String
}, { timestamps: true });
```

### 🔹 Effect:
- `{ createdAt: "2024-01-01T12:00:00Z", updatedAt: "2024-01-01T12:30:00Z" }`

---

## 2. `versionKey`
### ✅ Description
- Controls the `__v` field, which tracks document versioning.
- Can be disabled by setting `versionKey: false`.

### 📌 Example (Disable Versioning):
```js
const userSchema = new mongoose.Schema({
  name: String
}, { versionKey: false });
```

### 🔹 Effect:
- Without `{ versionKey: false }`: `{ name: "Alice", __v: 0 }`
- With `{ versionKey: false }`: `{ name: "Alice" }` (No `__v` field)

---

## 3. `collection`
### ✅ Description
- Specifies a custom name for the MongoDB collection.

### 📌 Example:
```js
const userSchema = new mongoose.Schema({
  name: String
}, { collection: "custom_users" });
```

### 🔹 Effect:
- Instead of using the pluralized default `users`, it will use `custom_users`.

---

## 4. `capped`
### ✅ Description
- Limits the collection size in bytes or document count.
- Automatically removes old documents when the limit is reached.

### 📌 Example:
```js
const logsSchema = new mongoose.Schema({
  message: String
}, { capped: { size: 1024, max: 100 } }); // 1024 bytes, max 100 docs
```

### 🔹 Effect:
- When the 101st document is inserted, the oldest document is removed.

---

## 5. `strict`
### ✅ Description
- Controls whether extra fields (not defined in schema) are allowed.
- Default is `true` (extra fields are ignored).

### 📌 Example (Allow Extra Fields):
```js
const userSchema = new mongoose.Schema({
  name: String
}, { strict: false });
```

### 🔹 Effect:
- `{ name: "Alice", role: "Admin" }` → "role" is **saved** in the database.

---

## 6. `strictQuery`
### ✅ Description
- Controls whether queries allow fields **not defined** in the schema.
- Default is `false` (extra query fields are ignored).

### 📌 Example (Allow Extra Query Fields):
```js
const userSchema = new mongoose.Schema({
  name: String
}, { strictQuery: false });
```

### 🔹 Effect:
- `User.find({ age: 25 })` → Does not throw an error but ignores `age`.

---

## 7. `id`
### ✅ Description
- Adds a virtual `id` field (string version of `_id`).
- Default is `true` (enabled).

### 📌 Example (Disable Virtual ID):
```js
const userSchema = new mongoose.Schema({
  name: String
}, { id: false });
```

### 🔹 Effect:
- Without `{ id: false }`: `{ _id: ObjectId("abc123"), id: "abc123" }`
- With `{ id: false }`: `{ _id: ObjectId("abc123") }` (No virtual `id` field).

---

## 8. `toJSON` and `toObject`
### ✅ Description
- Modifies how documents are converted to JSON or plain objects.
- `getters: true` applies **custom transformations**.
- or apply virtuals to the json object

### 📌 Example:
```js
const userSchema = new mongoose.Schema({
  name: String
}, { toJSON: { getters: true }, toObject: { getters: true } });
```

### 🔹 Effect:
- `{ name: "Alice" }` → Applied **getter functions**.

---

## Summary

| Option | Description | Example |
|--------|------------|---------|
| **timestamps** | Adds `createdAt`, `updatedAt` | `{ timestamps: true }` |
| **versionKey** | Controls `__v` field | `{ versionKey: false }` |
| **collection** | Custom collection name | `{ collection: "custom_users" }` |
| **capped** | Limits collection size | `{ capped: { size: 1024, max: 100 } }` |
| **strict** | Allow/disallow extra fields | `{ strict: false }` |
| **strictQuery** | Allow/disallow extra query fields | `{ strictQuery: false }` |
| **id** | Enables virtual `id` field | `{ id: false }` |
| **toJSON / toObject** | Custom JSON/object conversion | `{ toJSON: { getters: true } }` |
