# 🔍 Joi Custom Validation with `.custom()`

The `.custom()` method in Joi allows you to define **custom validation logic** that extends Joi's built-in validation capabilities. This is useful when you need complex validation rules that aren't covered by default Joi methods.

---

## 🚀 **1. Understanding `.custom()`**

### ✅ **Syntax:**

```javascript
Joi.string().custom(customValidator, [description]);
```

- **`customValidator`**: A function that defines the custom validation logic.
- **`description`** *(optional)*: A string describing the custom rule (useful for debugging).

---

## ⚡ **2. Function Signature for Custom Validators**

### ✅ **Basic Structure:**

```javascript
const customValidator = (value, helpers) => {
  // Custom validation logic
  if (invalidCondition) {
    return helpers.error('error.code', { message: 'Custom error message' });
  }
  return value; // Return the valid value
};
```

### 🔑 **Parameters Explained:**

1. **`value`** *(any)*:
   - The current value being validated.
   - Example: If validating an email, `value` will be the email string.

2. **`helpers`** *(object)*:
   - A set of utility functions provided by Joi to trigger errors, apply context, and customize messages.
   - **Common Methods:**
     - `helpers.error(code, context)` → Triggers an error with a specific code.
     - `helpers.state` → Provides the current validation state (like the parent object).
     - `helpers.message(message)` → Returns a custom error message directly.

---

## 📦 **3. Use Cases & Examples**

### ✅ **Example 1: Disallowing Certain Words in a Username**

```javascript
const usernameValidator = (value, helpers) => {
  if (value.includes('admin')) {
    return helpers.error('any.invalid', { message: 'Username cannot contain "admin"' });
  }
  return value;
};

const schema = Joi.object({
  username: Joi.string().custom(usernameValidator).required()
});

const result = schema.validate({ username: 'adminUser' });
console.log(result.error ? result.error.details[0].message : 'Username is valid ✅');
```

- **Logic:** Disallows usernames containing "admin".
- **Error Handling:** Uses `helpers.error('any.invalid')` to trigger an error.

---

### ✅ **Example 2: Custom Email Domain Validation**

```javascript
const emailDomainValidator = (value, helpers) => {
  if (!value.endsWith('@example.com')) {
    return helpers.error('any.invalid', { message: 'Email must be from example.com domain' });
  }
  return value;
};

const schema = Joi.object({
  email: Joi.string().email().custom(emailDomainValidator).required()
});

const result = schema.validate({ email: 'user@gmail.com' });
console.log(result.error ? result.error.details[0].message : 'Email is valid ✅');
```

- **Logic:** Ensures emails are from `example.com`.
- **Error:** Triggered if the condition fails.

---

### ✅ **Example 3: Password Strength Validation**

```javascript
const passwordStrengthValidator = (value, helpers) => {
  const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  if (!strongPassword.test(value)) {
    return helpers.error('any.invalid', { message: 'Password must include uppercase, lowercase, number, and special character.' });
  }
  return value;
};

const schema = Joi.object({
  password: Joi.string().custom(passwordStrengthValidator).required()
});

const result = schema.validate({ password: 'weakpass1' });
console.log(result.error ? result.error.details[0].message : 'Password is strong ✅');
```

- **Logic:** Requires at least one uppercase, lowercase, number, and special character.
- **Regex:** Defines the password policy.

---

### ✅ **Example 4: Date Comparison Validation**

```javascript
const dateComparisonValidator = (value, helpers) => {
  const currentDate = new Date();
  if (new Date(value) > currentDate) {
    return helpers.error('any.invalid', { message: 'Date cannot be in the future.' });
  }
  return value;
};

const schema = Joi.object({
  dateOfBirth: Joi.date().custom(dateComparisonValidator).required()
});

const result = schema.validate({ dateOfBirth: '2050-01-01' });
console.log(result.error ? result.error.details[0].message : 'Date is valid ✅');
```

- **Logic:** Ensures `dateOfBirth` isn’t a future date.
- **Comparison:** Compares with the current date.

---

### ✅ **Example 5: Conditional Field Validation**

```javascript
const roleValidator = (value, helpers) => {
  if (value === 'admin' && !helpers.state.ancestors[0].accessCode) {
    return helpers.error('any.invalid', { message: 'Admin must provide an access code.' });
  }
  return value;
};

const schema = Joi.object({
  role: Joi.string().custom(roleValidator).required(),
  accessCode: Joi.string().optional()
});

const result = schema.validate({ role: 'admin' });
console.log(result.error ? result.error.details[0].message : 'Validation Passed ✅');
```

- **Logic:** Requires `accessCode` if the role is `admin`.
- **Context:** Uses `helpers.state.ancestors[0]` to access the full object.

---

## 🚦 **4. Advanced Concepts in Custom Validation**

### 🔑 **Error Codes You Can Use:**
- `any.invalid`: General invalid error.
- `string.pattern.base`: For pattern/regex-related errors.
- `number.base`: For number-specific errors.
- `date.base`: For date-specific errors.

### ✅ **Using `helpers.message()` for Direct Messages:**

```javascript
const validator = (value, helpers) => {
  if (value.length < 5) {
    return helpers.message('Value must be at least 5 characters long.');
  }
  return value;
};

const schema = Joi.object({
  text: Joi.string().custom(validator).required()
});

const result = schema.validate({ text: 'abc' });
console.log(result.error ? result.error.details[0].message : 'Valid Input ✅');
```

- **Difference:** `helpers.message()` is a shortcut for adding custom error messages without specifying an error code.

---

## 🎯 **Key Takeaways**

1. `.custom()` allows custom validation logic beyond Joi’s built-in rules.
2. Use `helpers.error()` to trigger errors with specific codes.
3. Access additional data with `helpers.state.ancestors` for contextual validations.
4. Return the value if valid, or trigger an error if invalid.
5. Combine `.custom()` with other Joi rules for robust validation.

Mastering `.custom()` will help you create flexible, dynamic, and highly specific validation schemas for your applications. 🚀

