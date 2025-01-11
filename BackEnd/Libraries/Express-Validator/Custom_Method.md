
# Understanding the `custom()` Method in Express-validator

The `custom()` method in Express-validator allows you to define custom validation logic that goes beyond the built-in validation methods. This is useful when you need to perform complex validations, such as checking values against a database or comparing fields within a request.

---

## Syntax

```javascript
body('fieldName').custom((value, { req }) => {
  // Custom validation logic
  if (/* condition */) {
    throw new Error('Custom error message');
  }
  return true; // Return true if validation passes
});
```

- **`value`**: The value of the field being validated.
- **`req`**: The request object, which allows access to other fields and request data.
- **`throw new Error()`**: Use this to specify a custom error message when validation fails.
- **`return true`**: Indicates that the validation passed successfully.

---

## Examples

### Example 1: Password Confirmation

This example checks if the `passwordConfirmation` field matches the `password` field.

```javascript
body('passwordConfirmation').custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Password confirmation does not match password');
  }
  return true;
});
```

### Example 2: Checking Value Against a Database

In this example, a custom validator checks if an email is already registered in the database.

```javascript
const User = require('./models/User');

body('email').custom(async (value) => {
  const existingUser = await User.findOne({ email: value });
  if (existingUser) {
    throw new Error('Email already in use');
  }
  return true;
});
```

### Example 3: Conditional Validation Based on Another Field

This example validates a discount code only if a specific product is selected.

```javascript
body('discountCode').custom((value, { req }) => {
  if (req.body.product === 'special-item' && !value) {
    throw new Error('Discount code is required for special items');
  }
  return true;
});
```

### Example 4: Custom Validation for Array Elements

This example checks if all elements in an array are positive integers.

```javascript
body('numbers').custom((value) => {
  if (!Array.isArray(value)) {
    throw new Error('Must be an array');
  }
  for (const num of value) {
    if (!Number.isInteger(num) || num <= 0) {
      throw new Error('All elements must be positive integers');
    }
  }
  return true;
});
```

---

## Handling Validation Results

After defining custom validations, use `validationResult()` to collect and handle errors.

```javascript
const { body, validationResult } = require('express-validator');

app.post('/submit', [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.send('Validation passed!');
});
```

---

## Summary

- The `custom()` method in Express-validator allows for advanced, user-defined validation logic.
- Use `throw new Error()` to specify a custom error message when validation fails.
- Access other fields in the request using the `req` object, making it possible to perform complex validations.
- Always handle validation results using `validationResult()` to provide appropriate feedback to the client.

---

## References

- [express-validator GitHub Repository](https://github.com/express-validator/express-validator)
- [npm - express-validator](https://www.npmjs.com/package/express-validator)
