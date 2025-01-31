# Mongoose Schema Validations

Mongoose provides built-in **validations** to ensure data integrity and consistency in MongoDB.

## 1. Required Fields
### ✅ Description
- Ensures that a field **must have a value** (cannot be `null` or `undefined`).

### 📌 Example:
```js
email: {
  type: String,
  required: [true, "Email is required"] // Custom error message if validation fails
}
```

---

## 2. Default Values
### ✅ Description
- Provides a **default value** when no value is provided.

### 📌 Example:
```js
isActive: {
  type: Boolean,
  default: true
}
```

---

## 3. String Length Validation
### ✅ Description
- Enforces **minimum** and **maximum** length constraints.

### 📌 Example:
```js
username: {
  type: String,
  minlength: [5, "Username must be at least 5 characters"],
  maxlength: [15, "Username cannot exceed 15 characters"]
}
```

---

## 4. Number Range Validation
### ✅ Description
- Ensures a number falls within a **valid range**.

### 📌 Example:
```js
age: {
  type: Number,
  min: [18, "Age must be at least 18"],
  max: [65, "Age must be less than or equal to 65"]
}
```

---

## 5. Regular Expression (Regex) Validation
### ✅ Description
- Validates a string using a **regular expression**.

### 📌 Example:
```js
phone: {
  type: String,
  match: [/^\d{10}$/, "Phone number must be a valid 10-digit number"]
}
```

---

## 6. Enum Validation (Restricted Values)
### ✅ Description
- Limits the field to **specific predefined values**.

### 📌 Example:
```js
role: {
  type: String,
  enum: ["user", "admin", "guest"],
  default: "user"
}
```

---

## 7. Unique Fields (Index-Based Validation)
### ✅ Description
- Ensures the field value is **unique** in the database.

### 📌 Example:
```js
email: {
  type: String,
  unique: true
}
```

---

## 8. Custom Validator Function
### ✅ Description
- Allows defining a **custom validation function**.

### 📌 Example:
```js
password: {
  type: String,
  required: true,
  validate: {
    validator: function (v) {
      return v.length >= 8;
    },
    message: "Password must be at least 8 characters long"
  }
}
```

---

## 9. Mixed Type (Flexible Field)
### ✅ Description
- Allows storing **any kind of data** (object, array, string, etc.).

### 📌 Example:
```js
metadata: {
  type: mongoose.Schema.Types.Mixed,
  default: {}
}
```

---

## 10. Reference (ObjectId) Validation
### ✅ Description
- Stores **references to other documents** in different collections.

### 📌 Example:
```js
posts: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }
]
```

---

## Summary

| Validation | Description | Example |
|------------|------------|---------|
| **Required** | Ensures field is not empty | `{ required: true }` |
| **Default** | Sets default values | `{ default: Date.now }` |
| **Min/Max Length** | Limits string length | `{ minlength: 3, maxlength: 50 }` |
| **Min/Max Number** | Enforces number range | `{ min: 18, max: 65 }` |
| **Regex** | Validates pattern | `{ match: /regex/ }` |
| **Enum** | Restricts values | `{ enum: ["admin", "user"] }` |
| **Unique** | Ensures uniqueness | `{ unique: true }` |
| **Custom Validator** | Defines custom rules | `{ validate: fn }` |
| **Mixed Type** | Stores flexible data | `{ type: mongoose.Schema.Types.Mixed }` |
| **Reference** | Relates to another document | `{ ref: "Post" }` |
