# 📜 Joi Schema Methods Guide

This guide provides a comprehensive overview of **Joi schema methods** used for data validation. Joi is a powerful validation library that helps ensure the correctness of data structures in applications.

---

## 🚀 **1. Overview of Joi Methods and Properties**

Joi offers a wide range of methods to validate different data types, including strings, numbers, objects, arrays, dates, and more. Additionally, `.messages()` allows customization of error messages for better clarity.

---

## ✅ **2. Basic Data Types and Their Methods**

### 📄 **2.1. String Validation**

```javascript
const stringSchema = Joi.string()
  .min(3)
  .max(30)
  .alphanum()
  .email()
  .pattern(/^[a-zA-Z]+$/)
  .lowercase()
  .uppercase()
  .trim()
  .required()
  .messages({
    "string.base": "The value must be a string",
    "string.empty": "This field cannot be empty",
    "string.min": "This field must have at least {#limit} characters",
    "string.max": "This field cannot exceed {#limit} characters",
    "string.alphanum": "This field can only contain alphanumeric characters",
    "string.email": "This field must be a valid email",
    "string.pattern.base": "The value must match the specified pattern",
    "any.required": "This field is mandatory",
  });
```

#### **Notes on String Methods:**

- `.min(value)`: Minimum number of characters.
- `.max(value)`: Maximum number of characters.
- `.alphanum()`: Only alphanumeric characters.
- `.email()`: Validates email format.
- `.pattern(regex)`: Validates against a regular expression.
- `.lowercase()`: Converts string to lowercase before validation.
- `.uppercase()`: Converts string to uppercase before validation.
- `.trim()`: Removes leading and trailing spaces.
- `.required()`: Marks the field as mandatory.

---

### 🔢 **2.2. Number Validation**

```javascript
const numberSchema = Joi.number()
  .integer()
  .min(1)
  .max(100)
  .greater(0)
  .less(101)
  .precision(2)
  .multiple(5)
  .required()
  .messages({
    "number.base": "The value must be a number",
    "number.integer": "The value must be an integer",
    "number.min": "The number cannot be less than {#limit}",
    "number.max": "The number cannot be greater than {#limit}",
    "number.greater": "The number must be greater than {#limit}",
    "number.less": "The number must be less than {#limit}",
    "number.precision": "The number must have at most {#limit} decimal places",
    "number.multiple": "The number must be a multiple of {#limit}",
    "any.required": "This field is mandatory",
  });
```

#### **Notes on Number Methods:**

- `.integer()`: Validates integers only.
- `.min(value)`: Minimum allowed value.
- `.max(value)`: Maximum allowed value.
- `.greater(value)`: Must be greater than a specific value.
- `.less(value)`: Must be less than a specific value.
- `.precision(value)`: Defines decimal precision.
- `.multiple(value)`: Ensures the number is a multiple of the given value.
- `.required()`: Mandatory field.

---

### ⚡ **2.3. Boolean Validation**

```javascript
const booleanSchema = Joi.boolean().messages({
  "boolean.base": "The value must be a boolean",
});
```

#### **Notes on Boolean Methods:**

- `.boolean()`: Ensures the value is `true` or `false`.

---

### 📦 **2.4. Array Validation**

```javascript
const arraySchema = Joi.array().items(Joi.string()).min(1).max(5).messages({
  "array.base": "The value must be an array",
  "array.min": "The array must contain at least {#limit} items",
  "array.max": "The array cannot contain more than {#limit} items",
});
```

#### **Notes on Array Methods:**

- `.items(schema)`: Defines the data type inside the array.
- `.min(value)`: Minimum number of items.
- `.max(value)`: Maximum number of items.

---

### 🗂️ **2.5. Object Validation**

```javascript
const objectSchema = Joi.object({
  username: Joi.string().required(),
  age: Joi.number().min(18).required(),
}).messages({
  "object.base": "The value must be an object",
  "any.required": "{#label} is required",
});
```

#### **Notes on Object Methods:**

- `.object(schema)`: Defines validation rules for object properties.

---

## 🔍 **3. Additional Joi Methods and Properties**

### 🔢 **3.1. Pattern Validation (Regex)**

```javascript
const patternSchema = Joi.string()
  .pattern(/^[a-zA-Z0-9]{3,30}$/)
  .messages({
    "string.pattern.base": "The value must match the pattern: {#regex}",
  });
```

- **`.pattern(regex)`**: Validates data against a regular expression.

---

### 📅 **3.2. Date Validation**

```javascript
const dateSchema = Joi.date().greater("now").iso().messages({
  "date.base": "The value must be a valid date",
  "date.greater": "The date must be in the future",
  "date.format": "The date must be in ISO format",
});
```

- **`.greater(date)`**: Validates dates greater than the specified date.
- **`.iso()`**: Ensures the date is in ISO 8601 format.

---

### 🔧 **3.3. Default Values**

```javascript
const defaultSchema = Joi.string().default("Guest").messages({
  "any.required": "The value is required and defaults to Guest",
});
```

- **`.default(value)`**: Assigns a default value when none is provided.

---

## ⚠️ **4. Custom Error Messages with `.messages()`**

```javascript
const customMessageSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Name must be a text value",
    "string.min": "Name should be at least {#limit} characters long",
    "string.max": "Name cannot exceed {#limit} characters",
    "any.required": "Name is a required field",
  }),
  age: Joi.number().min(18).max(65).required().messages({
    "number.base": "Age must be a number",
    "number.min": "Age must be at least {#limit}",
    "number.max": "Age cannot be greater than {#limit}",
    "any.required": "Age is required",
  }),
});
```

### **Dynamic Placeholders:**

- `{#limit}`: The value of `.min()` or `.max()`.
- `{#label}`: The field name.
- `{#regex}`: The pattern used in `.pattern()`.

---

## 📝 **5. Default Messages in Joi**

If `.messages()` is not provided, Joi uses default messages:

- `string.base`: "must be a string"
- `string.empty`: "is not allowed to be empty"
- `number.base`: "must be a number"
- `number.min`: "must be larger than or equal to {#limit}"
- `array.min`: "must contain at least {#limit} items"
- `any.required`: "is required"

---

## 🔍 **6. Error Object Returned by Joi**

When validation fails, Joi returns an **error object**:

```json
{
  "message": "\"age\" must be larger than or equal to 18",
  "details": [
    {
      "message": "\"age\" must be larger than or equal to 18",
      "path": ["age"],
      "type": "number.min",
      "context": { "label": "age", "key": "age", "limit": 18, "value": 16 }
    }
  ]
}
```

### **Error Object Properties:**

- **`message`**: Human-readable error message.
- **`details`**: Array of validation errors.
- **`path`**: Field that caused the error.
- **`type`**: Type of validation that failed (e.g., `number.min`).
- **`context`**: Additional details like the provided value and limits.

---

## 🚀 **7. Conclusion**

Joi is a flexible and powerful validation library with a wide range of methods for handling different data types. Understanding these methods ensures robust validation logic, better error handling, and a more secure application.

Use Joi effectively to:

- Validate data types.
- Customize error messages.
- Simplify validation logic with concise syntax.

Happy coding with Joi! 🚀
