# Mongoose Schema Types

Mongoose provides various schema types to define the structure of documents in a collection.

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
- For ref, you include the refrence Model. You have to copy the exact model name that you created.


### 📌 Example:
```js
posts: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post" // Post model 
  }
]
```

---

## 10. Schema Options
### ✅ Description
- Additional options like `timestamps` for `createdAt` and `updatedAt` fields.

### 📌 Example:
```js
const schemaOptions = {
  timestamps: true
};
```

---

## Summary

| Type | Description | Example |
|------|------------|---------|
| **String** | Stores text | `{ type: String, required: true }` |
| **Number** | Stores numbers | `{ type: Number, min: 0, max: 120 }` |
| **Date** | Stores date values | `{ type: Date, default: Date.now }` |
| **Boolean** | Stores true/false | `{ type: Boolean, default: true }` |
| **Array** | Stores arrays of values | `{ type: [String], default: [] }` |
| **Subdocument** | Nested object | `{ address: { street: String, city: String } }` |
| **Enum** | Restricts values | `{ type: String, enum: ["admin", "user"] }` |
| **Mixed** | Stores any type of data | `{ type: mongoose.Schema.Types.Mixed }` |
| **ObjectId** | References another collection | `{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }` |
