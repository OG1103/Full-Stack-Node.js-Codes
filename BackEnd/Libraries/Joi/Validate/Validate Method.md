# ✅ Joi `validate()` Method Explained

The `validate()` method in Joi is used to check whether a given data object conforms to the rules defined in a Joi schema. This guide covers its usage, the structure of returned data, and how to customize validation behavior with options.

---

## 🚀 **1. Basic Usage of `validate()`**

### **Example:**

```javascript
const Joi = require("joi");

const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.base": "Username should be a type of text",
    "string.empty": "Username cannot be empty",
    "string.min": "Username should have at least 3 characters",
    "any.required": "Username is a required field",
  }),
  age: Joi.number().integer().min(18).required().messages({
    "number.base": "Age must be a number",
    "number.min": "Age must be at least 18",
    "any.required": "Age is required",
  }),
});

const validData = { username: "john_doe", age: 25 };
const result = schema.validate(validData);

console.log(result);
```

### ✅ **Output:**

```javascript
{
  value: { username: 'john_doe', age: 25 },
  error: undefined
}
```

---

## 📊 **2. Structure of `validate()` Result**

The `validate()` method returns an **object** containing:

1. **`value`**: The validated data (with defaults applied if defined).
2. **`error`**: The error object (if validation fails); otherwise `undefined`.

### 🔍 **Example with Invalid Data:**

```javascript
const invalidData = { username: "", age: 16 };
const result = schema.validate(invalidData);

console.log(result);
```

### ❌ **Output:**

```javascript
{
  value: { username: '', age: 16 },
  error: [Error [ValidationError]: "username" cannot be empty. "age" must be at least 18] {
    _original: { username: '', age: 16 },
    details: [
      {
        message: '"username" cannot be empty',
        path: [ 'username' ],
        type: 'string.empty',
        context: { label: 'username', key: 'username', value: '' }
      },
      {
        message: '"age" must be at least 18',
        path: [ 'age' ],
        type: 'number.min',
        context: { limit: 18, value: 16, label: 'age', key: 'age' }
      }
    ]
  }
}
```

### 📝 **Explanation:**
- **`value`**: The data that was validated (even if invalid).
- **`error`**: Contains error details if validation fails.
  - **`message`**: Combined error message.
  - **`details`**: Array with specific errors:
    - `path`: Indicates which field failed.
    - `type`: Type of validation error (e.g., `string.empty`).
    - `context`: Additional information (like the invalid value or limit).

---

## ⚙️ **3. Customizing Validation with Options**

### 🚫 **3.1. `stripUnknown` Option**

Removes properties not defined in the schema.

```javascript
const result = schema.validate(
  { username: "jane_doe", age: 22, extraField: "notAllowed" },
  { stripUnknown: true }
);

console.log(result);
```

### ✅ **Output:**

```javascript
{
  value: { username: 'jane_doe', age: 22 },
  error: undefined
}
```

- **`extraField`** was removed.

---

### ⛔ **3.2. `abortEarly` Option**

Controls whether validation stops after the first error.

#### **`abortEarly: false` (Show All Errors):**

```javascript
const result = schema.validate({ username: "", age: 16 }, { abortEarly: false });
console.log(result);
```

### ❌ **Output:**

```javascript
{
  value: { username: '', age: 16 },
  error: [Error [ValidationError]: "username" cannot be empty. "age" must be at least 18]
}
```

- Both `username` and `age` errors are shown.

#### ✅ **`abortEarly: true` (Default Behavior):**

```javascript
const result = schema.validate({ username: "", age: 16 }, { abortEarly: true });
console.log(result);
```

### ❌ **Output:**

```javascript
{
  value: { username: '', age: 16 },
  error: [Error [ValidationError]: "username" cannot be empty]
}
```

- Validation stops after the first error (on `username`).

---

## 🧪 **4. Advanced Example with All Options**

```javascript
const result = schema.validate(
  { username: "", age: 16, unknown: "extra" },
  { abortEarly: false, stripUnknown: true }
);

console.log(result);
```

### ❌ **Output:**

```javascript
{
  value: { username: '', age: 16 },
  error: [Error [ValidationError]: "username" cannot be empty. "age" must be at least 18]
}
```

- **`abortEarly: false`**: Shows all errors.
- **`stripUnknown: true`**: Removes `unknown` field.

---

## ✅ **5. Key Points to Remember**

| **Option**          | **Description**                                 | **Default** |
|---------------------|-------------------------------------------------|-------------|
| `abortEarly`        | Stops at the first error if `true`.             | `true`      |
| `stripUnknown`      | Removes unknown properties if `true`.           | `false`     |
| `allowUnknown`      | Allows unknown properties without removing them.| `false`     |
| `convert`           | Converts data to match schema (e.g., strings to numbers). | `true`      |

---

## 🚀 **6. Conclusion**

The Joi `validate()` method is a robust way to ensure your data conforms to expected formats. By using options like `abortEarly` and `stripUnknown`, you can control validation behavior to suit different needs.

- **Always validate external inputs** to prevent security issues.
- **Leverage custom error messages** for better user feedback.
- **Adjust validation options** for comprehensive error reporting.
- **Always mount the validated value to the req[property]**: any fields that are defined in the schema with a default value will be automatically added after validation if they were not present in the original request. Also if using stripUnknown removes any extra fields not part of the schema. Keeping the req[property] only have fields defined in the schema. This helps maintain clean, complete, and validated data throughout your Express app.

Happy validating with Joi! 🎉

