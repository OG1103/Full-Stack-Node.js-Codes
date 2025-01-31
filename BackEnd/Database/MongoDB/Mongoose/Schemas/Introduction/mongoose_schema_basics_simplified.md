# Mongoose Schema Basics (Introduction)

## 1. What is a Mongoose Schema?
### ✅ Definition
- A **Mongoose Schema** defines the **structure** of documents in a MongoDB collection.
- It specifies **field names, types, and validation rules**.
- Fields **not defined in the schema are ignored** when inserting documents.

---

## 2. Defining a Basic Schema
### ✅ Syntax
```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number
});
```

---

## 3. Creating and Exporting a Model
### ✅ Description
- A **model** is a wrapper around the schema that represents a collection.
- It is created using `mongoose.model("ModelName", schema)`.
- Models allow you to interact with MongoDB (insert, update, delete, find).

### 📌 Example:
```js
const User = mongoose.model("User", userSchema);
module.exports = User;
```

---

## Summary

| Concept | Description | Example |
|---------|------------|---------|
| **Schema** | Defines structure | `new mongoose.Schema({ name: String })` |
| **Model** | Represents a collection | `mongoose.model("User", schema)` |
| **Exporting** | Makes model available | `module.exports = User` |
