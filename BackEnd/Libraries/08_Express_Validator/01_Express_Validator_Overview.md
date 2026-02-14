# Express-Validator — Overview

Express-Validator is a set of middleware functions for validating and sanitizing request data in Express applications. It wraps the `validator.js` library and integrates directly into the Express middleware chain.

---

## 1. Installation

```bash
npm install express-validator
```

---

## 2. Basic Concept

Express-Validator uses a **chain-based** approach: apply validation rules as middleware, then check results in the handler.

```javascript
import { body, validationResult } from 'express-validator';

app.post('/api/users',
  // Validation middleware (runs first)
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be 8+ characters'),

  // Handler (runs after validators)
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validation passed — process the request
    res.json({ message: 'User created', data: req.body });
  }
);
```

---

## 3. Validation Sources

Express-Validator provides different functions based on where the data comes from:

### `body()` — Request Body

```javascript
import { body } from 'express-validator';

app.post('/api/users',
  body('name').notEmpty(),
  body('email').isEmail(),
  handler
);
```

### `param()` — URL Parameters

```javascript
import { param } from 'express-validator';

// GET /api/users/:id
app.get('/api/users/:id',
  param('id').isMongoId().withMessage('Invalid user ID'),
  handler
);
```

### `query()` — Query String

```javascript
import { query } from 'express-validator';

// GET /api/products?page=1&limit=10
app.get('/api/products',
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  handler
);
```

### Summary

| Function | Validates | Source |
|----------|----------|--------|
| `body('field')` | `req.body.field` | POST/PUT/PATCH body |
| `param('field')` | `req.params.field` | URL parameters (`:id`) |
| `query('field')` | `req.query.field` | Query string (`?key=value`) |
| `header('field')` | `req.headers.field` | Request headers |
| `cookie('field')` | `req.cookies.field` | Cookies |

---

## 4. Checking Results with `validationResult()`

```javascript
import { validationResult } from 'express-validator';

const handler = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // All validations passed
  res.json({ data: req.body });
};
```

### Error Response Format

```json
{
  "errors": [
    {
      "type": "field",
      "value": "",
      "msg": "Name is required",
      "path": "name",
      "location": "body"
    },
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

---

## 5. Common Validation Methods

### String Validators

```javascript
body('name').notEmpty().withMessage('Required')
body('name').isLength({ min: 2, max: 50 })
body('email').isEmail()
body('url').isURL()
body('slug').isSlug()
body('code').isAlphanumeric()
body('text').isAlpha()       // Letters only
body('ip').isIP()
body('uuid').isUUID()
body('hex').isHexColor()
```

### Number Validators

```javascript
body('age').isInt({ min: 0, max: 150 })
body('price').isFloat({ min: 0 })
body('rating').isFloat({ min: 1, max: 5 })
body('count').isNumeric()          // Accepts "123" as valid
```

### Boolean and Date

```javascript
body('isActive').isBoolean()
body('birthDate').isISO8601()      // ISO date format
body('birthDate').isDate()         // General date format
```

### Other Validators

```javascript
body('id').isMongoId()             // Valid MongoDB ObjectId
body('card').isCreditCard()
body('zip').isPostalCode('US')
body('phone').isMobilePhone('en-US')
body('data').isJSON()              // Valid JSON string
body('token').isJWT()              // Valid JWT format
```

### Validator Reference

| Method | Description |
|--------|-------------|
| `.notEmpty()` | Must not be empty |
| `.isEmail()` | Valid email format |
| `.isLength({ min, max })` | String length range |
| `.isInt({ min, max })` | Integer within range |
| `.isFloat({ min, max })` | Decimal within range |
| `.isBoolean()` | Boolean value |
| `.isMongoId()` | Valid MongoDB ObjectId |
| `.isURL()` | Valid URL |
| `.isISO8601()` | ISO 8601 date |
| `.matches(regex)` | Matches regular expression |
| `.isIn(['a', 'b'])` | Value is in the list |
| `.optional()` | Skip validation if not provided |

---

## 6. Sanitizers

Sanitizers transform the data after validation:

```javascript
body('email').isEmail().normalizeEmail()    // Lowercase, trim
body('name').trim()                          // Remove whitespace
body('bio').escape()                         // HTML encode special chars
body('age').toInt()                          // Convert "25" → 25
body('active').toBoolean()                   // Convert "true" → true
body('tags').toArray()                       // Ensure it's an array
```

| Sanitizer | Effect |
|-----------|--------|
| `.trim()` | Remove leading/trailing whitespace |
| `.escape()` | HTML-encode `<`, `>`, `&`, `'`, `"` |
| `.normalizeEmail()` | Standardize email format |
| `.toInt()` | Convert to integer |
| `.toFloat()` | Convert to float |
| `.toBoolean()` | Convert to boolean |
| `.toArray()` | Wrap in array if not already |

---

## 7. Error Messages with `.withMessage()`

```javascript
body('password')
  .isLength({ min: 8 }).withMessage('Must be at least 8 characters')
  .matches(/[A-Z]/).withMessage('Must contain an uppercase letter')
  .matches(/[0-9]/).withMessage('Must contain a number');
```

Each `.withMessage()` applies to the **preceding** validator only.

---

## 8. Optional Fields

```javascript
// Skip all validators if the field is not present
body('bio').optional().isLength({ max: 500 });

// Skip if empty string too
body('nickname').optional({ values: 'falsy' }).isLength({ min: 2 });
```

---

## 9. Reusable Validation Middleware

### Extract Validation Check

```javascript
// middleware/validate.js
import { validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export default validate;
```

### Use in Routes

```javascript
import validate from '../middleware/validate.js';

app.post('/api/users',
  body('name').notEmpty(),
  body('email').isEmail(),
  validate,   // Check errors here
  createUser  // Only runs if validation passed
);
```

---

## 10. Summary

| Step | What to Do |
|------|-----------|
| Install | `npm install express-validator` |
| Import | `import { body, param, query, validationResult } from 'express-validator'` |
| Add validators | Chain validation methods as middleware |
| Check results | `validationResult(req)` in handler or middleware |
| Custom messages | `.withMessage('message')` after each validator |
| Sanitize | `.trim()`, `.toInt()`, `.normalizeEmail()` |
| Optional fields | `.optional()` before other validators |
