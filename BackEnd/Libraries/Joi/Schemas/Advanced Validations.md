# 📊 Joi Advanced Schema Validation

This document focuses on **advanced Joi schema validation techniques**, going beyond basic data types to cover powerful methods like `Joi.ref()`, `.valid()`, custom validations with regex, and more.

---

## 🚀 **1. `Joi.ref()` - Referencing Another Field**

`Joi.ref()` allows you to **reference the value of another field** within the same schema. This is useful for comparing fields, such as password confirmation or conditional validations.

### ✅ **Example: Password Confirmation**

```javascript
import Joi from 'joi';

const schema = Joi.object({
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    .messages({ 'any.only': 'Passwords do not match' })
});

const data = { password: 'securePass123', confirmPassword: 'securePass123' };
const result = schema.validate(data);
console.log(result.error ? result.error.details[0].message : 'Validation Passed ✅');
```

**Explanation:**
- `Joi.ref('password')` references the `password` field.
- `.valid(Joi.ref('password'))` ensures `confirmPassword` matches `password`.

---

## 🎯 **2. `.valid()` and `.invalid()` - Defining Allowed and Forbidden Values**

- **`valid()`**: Ensures the value matches one of the specified values.
- **`invalid()`**: Ensures the value **does not** match the specified values.

### ✅ **Example: Role Validation**

```javascript
const schema = Joi.object({
  role: Joi.string().valid('admin', 'user', 'moderator').required()
    .messages({ 'any.only': 'Role must be admin, user, or moderator' })
});

const data = { role: 'guest' };
const result = schema.validate(data);
console.log(result.error ? result.error.details[0].message : 'Role is valid ✅');
```

**Output:**
```
Role must be admin, user, or moderator
```

---

## ⚡ **3. `.when()` - Conditional Validation**

`Joi.when()` allows you to apply **conditional validation** based on another field's value.

### ✅ **Example: Access Code for Admins**

```javascript
const schema = Joi.object({
  role: Joi.string().valid('admin', 'user').required(),
  accessCode: Joi.when('role', {
    is: 'admin',
    then: Joi.string().required().messages({ 'any.required': 'Access code is required for admins' }),
    otherwise: Joi.forbidden()
  })
});

const data = { role: 'admin', accessCode: '1234' };
const result = schema.validate(data);
console.log(result.error ? result.error.details[0].message : 'Validation Passed ✅');
```

- If `role` is **'admin'**, `accessCode` is **required**.
- If `role` is **'user'**, `accessCode` is **forbidden**.

### 🔑 **What is `Joi.forbidden()`?**

- **`Joi.forbidden()`** explicitly **disallows** a value. If the field exists in the data, Joi will trigger a validation error.
- In the above example, when the role is `user`, the presence of `accessCode` triggers an error because it's **forbidden**.

---

## 🔍 **4. Custom Validation with `.custom()`**

You can create **custom validation logic** using `.custom()`. This is helpful when default Joi methods aren't sufficient for complex validation rules.

### ✅ **Example: Custom Username Validation**

```javascript
const usernameValidator = (value, helpers) => {
  if (value.includes('admin')) {
    return helpers.error('any.invalid', { message: 'Username cannot contain "admin"' });
  }
  return value; // Return the value if valid
};

const schema = Joi.object({
  username: Joi.string().custom(usernameValidator).required()
});

const data = { username: 'adminUser' };
const result = schema.validate(data);
console.log(result.error ? result.error.details[0].message : 'Username is valid ✅');
```

### 🔍 **How Custom Validation Works:**

1. **Function Signature:**
   - `usernameValidator(value, helpers)`
     - **`value`**: The current field value being validated.
     - **`helpers`**: A set of utilities provided by Joi to trigger errors, customize messages, etc.

2. **Triggering Errors:**
   - `helpers.error('any.invalid', { message: 'Custom error message' })` triggers an error with a custom message.

3. **Returning Valid Data:**
   - If the value is valid, simply return it as is. Joi will consider it valid.

### ✅ **Advanced Example: Custom Email Domain Validation**

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

const data = { email: 'user@gmail.com' };
const result = schema.validate(data);
console.log(result.error ? result.error.details[0].message : 'Email is valid ✅');
```

- This custom validation **ensures emails are from the `example.com` domain**.

### 🔑 **Key Points for Custom Validation:**
- Always return the value if it’s valid.
- Use `helpers.error()` to trigger validation errors.
- You can chain `.messages()` for custom error messages.

---

## 🔐 **5. Regex Validation with `.pattern()`**

Joi allows you to apply **regular expressions** to validate complex string patterns using `.pattern()`.

### ✅ **Example: Strong Password Validation**

```javascript
const passwordSchema = Joi.object({
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.'
    })
});

const data = { password: 'WeakPass1' };
const result = passwordSchema.validate(data);
console.log(result.error ? result.error.details[0].message : 'Password is strong ✅');
```

**Regex Explanation:**
- `(?=.*[a-z])` → At least one lowercase letter
- `(?=.*[A-Z])` → At least one uppercase letter
- `(?=.*\d)` → At least one number
- `(?=.*[@$!%*?&])` → At least one special character
- `{8,}` → Minimum 8 characters

---

## 🚦 **6. `.min()`, `.max()`, and `.length()` for Arrays/Strings**

- `.min(n)` → Requires at least `n` items/characters.
- `.max(n)` → Limits to a maximum of `n` items/characters.
- `.length(n)` → Requires exactly `n` items/characters.

### ✅ **Example: Array Length Validation**

```javascript
const schema = Joi.object({
  tags: Joi.array().items(Joi.string()).min(2).max(5).required()
    .messages({
      'array.min': 'At least 2 tags are required',
      'array.max': 'No more than 5 tags are allowed'
    })
});

const data = { tags: ['nodejs'] };
const result = schema.validate(data);
console.log(result.error ? result.error.details[0].message : 'Tags are valid ✅');
```

**Output:**
```
At least 2 tags are required
```

---

## 📌 **7. Combining Rules with `.concat()`**

`Joi.concat()` allows you to **merge two schemas** into one.

### ✅ **Example: Reusing Schemas**

```javascript
const baseSchema = Joi.object({
  name: Joi.string().required()
});

const extendedSchema = baseSchema.concat(
  Joi.object({
    email: Joi.string().email().required()
  })
);

const data = { name: 'John Doe', email: 'john@example.com' };
const result = extendedSchema.validate(data);
console.log(result.error ? result.error.details[0].message : 'Validation Passed ✅');
```

---

## 🚀 **8. `.alter()` - Dynamic Schema Modifications**

`Joi.alter()` allows for **dynamic schema adjustments** based on the context.

### ✅ **Example: Dynamic Required Fields**

```javascript
const schema = Joi.object({
  username: Joi.string().alter({ create: (s) => s.required(), update: (s) => s.optional() })
});

const createResult = schema.tailor('create').validate({});
console.log(createResult.error ? 'Create Error: ' + createResult.error.details[0].message : 'Create Valid ✅');

const updateResult = schema.tailor('update').validate({});
console.log(updateResult.error ? 'Update Error: ' + updateResult.error.details[0].message : 'Update Valid ✅');
```

- **`tailor('create')`** → Makes `username` required.
- **`tailor('update')`** → Makes `username` optional.

---

## 🎯 **Conclusion**

Joi provides powerful tools beyond basic data types to handle complex validation logic:
- **Field References:** `Joi.ref()`
- **Custom Rules:** `.custom()`
- **Conditional Validation:** `.when()`
- **Regex Validation:** `.pattern()`
- **Dynamic Schemas:** `.alter()`

Mastering these features will help you create robust and flexible validation schemas for any application. 🚀

