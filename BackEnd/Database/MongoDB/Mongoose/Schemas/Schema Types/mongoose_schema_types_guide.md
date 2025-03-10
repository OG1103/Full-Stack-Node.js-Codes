# Mongoose Schema Types

Mongoose provides various schema types to define the structure of documents in a collection.

---

## 1. String Type

### ✅ Description

- Stores text values.
- Supports validation options like `required`, `trim`, and `match`.

### 📌 Example:

```js
name: {
  type: String,
  required: true,
  trim: true // Removes leading and trailing spaces
}
```

---

## 2. Number Type

### ✅ Description

- Stores numeric values.
- Supports `min` and `max` for range validation.

### 📌 Example:

```js
age: {
  type: Number,
  min: 0,
  max: 120
}
```

---

## 3. Date Type

### ✅ Description

- Stores date and time values.
- Can have a default value like `Date.now`.

### 📌 Example:

```js
createdAt: {
  type: Date,
  default: Date.now
}
```

---

## 4. Boolean Type

### ✅ Description

- Stores `true` or `false` values.

### 📌 Example:

```js
isActive: {
  type: Boolean,
  default: true
}
```

---

## 5. Array of Strings

### ✅ Description

- Stores multiple string values in an array.

### 📌 Example:

```js
hobbies: {
  type: [String],
  default: []
}
```

---

## 6. Embedded Object (Subdocument)

### ✅ Description

- Stores nested objects within a document.
- Each field inside an object has its own validation.

### 📌 Example:

```js
address: {
  street: { type: String, required: true },
  city: { type: String, required: true },
  zipcode: { type: String, match: [/^\d{5}$/, "Enter a valid 5-digit zipcode"] }
}

address: [{
  street: { type: String, required: true },
  city: { type: String, required: true },
  zipcode: { type: String, match: [/^\d{5}$/, "Enter a valid 5-digit zipcode"] }
}] // array of embedded object; 
```

---

## 7. Enum Type

### ✅ Description

- Restricts values to a predefined set.

### 📌 Example:

```js
role: {
  type: String,
  enum: ["user", "admin", "guest"],
  default: "user"
}
```

---

## 8. Mixed Type

### ✅ Description

- Allows any type of data to be stored.

### 📌 Example:

```js
metadata: {
  type: mongoose.Schema.Types.Mixed,
  default: {}
}
```

---

## 9. ObjectId (Reference to Another Collection)

### ✅ Description

- Stores references to documents in another collection.
- Useful for relationships between models.
- useful If you want to store more than just ObjectIds and include extra details such as timestamps, roles, or other metadata
- `ref` should exactly match the model name.

### 📌 Example:

```js
posts: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", // Reference to the Post model
  },
];
```

---

## 10. Direct Array of ObjectIds

### ✅ Description

- Stores an array of `ObjectId`s directly.
- `ref` is applied to the entire array instead of individual elements.
- Use when i want a direct array of objectIds

### 📌 Example:

```js
wishlist: {
  type: [mongoose.Schema.Types.ObjectId], // Direct array of ObjectId
  ref: "Product"
}
```

---

## 11. Schema Options

### ✅ Description

- Additional options like `timestamps` for `createdAt` and `updatedAt` fields.

### 📌 Example:

```js
const schemaOptions = {
  timestamps: true,
};
```

---

## Summary

| Type                          | Description                   | Example                                                      |
| ----------------------------- | ----------------------------- | ------------------------------------------------------------ |
| **String**                    | Stores text                   | `{ type: String, required: true }`                           |
| **Number**                    | Stores numbers                | `{ type: Number, min: 0, max: 120 }`                         |
| **Date**                      | Stores date values            | `{ type: Date, default: Date.now }`                          |
| **Boolean**                   | Stores true/false values      | `{ type: Boolean, default: true }`                           |
| **Array**                     | Stores arrays of values       | `{ type: [String], default: [] }`                            |
| **Subdocument**               | Nested object                 | `{ address: { street: String, city: String } }`              |
| **Enum**                      | Restricts values              | `{ type: String, enum: ["admin", "user"] }`                  |
| **Mixed**                     | Stores any type of data       | `{ type: mongoose.Schema.Types.Mixed }`                      |
| **ObjectId**                  | References another collection | `{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }`      |
| **Direct Array of ObjectIds** | Stores an array of ObjectIds  | `{ type: [mongoose.Schema.Types.ObjectId], ref: "Product" }` |

---

## Examples

### Example 1: Full Schema with Various Types

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, min: 0, max: 120 },
    email: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    hobbies: { type: [String], default: [] },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    wishlist: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
```

### Example 2: Populating References

```js
import User from "./models/User.js";

const userWithPosts = await User.findById(userId).populate("posts");
console.log(userWithPosts);
```

This will return the full `Post` details instead of just their `ObjectId`s.

---

## Conclusion

Mongoose provides various schema types to structure your database efficiently. Understanding these types and their use cases helps in designing a well-structured MongoDB database. 🚀
