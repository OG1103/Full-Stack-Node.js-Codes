
# Express-validator Overview

`express-validator` is a middleware library for Express.js applications that allows you to validate and sanitize incoming data from client requests. It is commonly used to ensure that data coming from forms, API requests, and other input mechanisms is valid and meets specific criteria. The library is built on top of `validator.js` and provides a variety of built-in validation methods.

---

## Key Components

### 1. `body()`
- Validates data from the body of the request (usually used with POST or PUT requests).
- You need to specify the exact field(s) in the request body that you want to validate.

#### Example:
```javascript
body('email').isEmail().withMessage('Enter a valid email');
```

---

### 2. `param()`
- Validates route parameters (e.g., `/:id` in a URL).
- You need to specify the exact parameter you are validating.

#### Example:
```javascript
param('id').isInt().withMessage('User ID must be an integer');
```

---

### 3. `query()`
- Validates query parameters in a request (e.g., `/search?term=keyword`).
- You need to specify the exact query string parameter you are validating.

#### Example:
```javascript
query('page').optional().isInt().withMessage('Page must be an integer');
```

---

### 4. `validationResult()`
- Collects the validation errors and allows you to handle or respond to them in your application.
- You should pass the request object to extract validation results from the defined fields (i.e., body, params, query).

#### Example:
```javascript
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
```

---

### 5. `custom()`
- Creates custom validation logic that is not covered by the built-in methods.
- You can access other fields of the request using the `req` object to perform complex validations.

#### Example:
```javascript
body('passwordConfirmation').custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Password confirmation does not match password');
  }
  return true;
});
```

---

## Typical Validation Workflow

1. **Specify Fields**: Specify the fields in the request that you want to validate using `body()`, `param()`, or `query()` methods.
2. **Validation Execution**: Pass the fields you want to validate in the validation chain.
3. **Collect Validation Results**: Use `validationResult(req)` to collect the results from the request object.
4. **Error Handling**: Respond with error messages if validation fails, ensuring your application only processes valid data.

---

## Summary

- `express-validator` is an essential tool for ensuring data integrity in Express.js applications.
- Common methods include `body()`, `param()`, `query()`, `validationResult()`, and `custom()`.
- It simplifies validation and sanitization, reducing boilerplate code and improving security.

---

## References
- [express-validator GitHub Repository](https://github.com/express-validator/express-validator)
- [npm - express-validator](https://www.npmjs.com/package/express-validator)
