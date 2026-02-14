# Express-Validator — Custom Validators

When built-in methods aren't enough, use `.custom()` to write your own validation logic, including async operations like database lookups.

---

## 1. Basic Custom Validator

```javascript
import { body } from 'express-validator';

body('username').custom((value) => {
  if (value.includes(' ')) {
    throw new Error('Username cannot contain spaces');
  }
  return true;  // Must return true if valid
});
```

### Rules

- **Throw an error** or **return a rejected promise** to indicate failure
- **Return `true`** or **return a resolved promise** to indicate success
- The error message comes from the thrown error or `.withMessage()`

---

## 2. Async Custom Validator (Database Checks)

`.custom()` supports async functions — return a promise or use `async/await`:

### Check if Email Already Exists

```javascript
import User from '../models/User.js';

body('email')
  .isEmail()
  .custom(async (value) => {
    const existingUser = await User.findOne({ email: value });
    if (existingUser) {
      throw new Error('Email is already registered');
    }
    return true;
  });
```

### Check if Username is Taken

```javascript
body('username')
  .isLength({ min: 3 })
  .custom(async (value) => {
    const existingUser = await User.findOne({ username: value });
    if (existingUser) {
      throw new Error('Username is already taken');
    }
    return true;
  });
```

### Check if Resource Exists

```javascript
import { param } from 'express-validator';
import Product from '../models/Product.js';

param('id')
  .isMongoId()
  .custom(async (value) => {
    const product = await Product.findById(value);
    if (!product) {
      throw new Error('Product not found');
    }
    return true;
  });
```

---

## 3. Accessing the Request Object

The second argument to `.custom()` provides `{ req }`, giving access to the full request:

### Password Confirmation

```javascript
body('confirmPassword').custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Passwords do not match');
  }
  return true;
});
```

### Conditional Validation Based on Other Fields

```javascript
body('companyName').custom((value, { req }) => {
  if (req.body.accountType === 'business' && !value) {
    throw new Error('Company name is required for business accounts');
  }
  return true;
});
```

### Using Auth Context

```javascript
body('email').custom(async (value, { req }) => {
  // Check if email is taken by ANOTHER user (not the current one)
  const existingUser = await User.findOne({ email: value });
  if (existingUser && existingUser._id.toString() !== req.user.userId) {
    throw new Error('Email is already in use by another account');
  }
  return true;
});
```

---

## 4. Array Validation

### Validate Array Items

```javascript
// Validate each tag in the tags array
body('tags').isArray({ min: 1, max: 10 }),
body('tags.*').isString().trim().isLength({ min: 1, max: 30 }),
```

The `.*` wildcard validates each element in the array.

### Validate Array of Objects

```javascript
// Validate items in an order
body('items').isArray({ min: 1 }),
body('items.*.productId').isMongoId(),
body('items.*.quantity').isInt({ min: 1 }),
body('items.*.price').isFloat({ min: 0 }),
```

---

## 5. Complete Example

```javascript
import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import User from './models/User.js';

const app = express();
app.use(express.json());

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Registration with custom validators
app.post('/api/register',
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),

  body('email')
    .isEmail().withMessage('Invalid email')
    .normalizeEmail()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) throw new Error('Email already registered');
      return true;
    }),

  body('password')
    .isLength({ min: 8 }).withMessage('Password must be 8+ characters')
    .matches(/[A-Z]/).withMessage('Must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Must contain a number'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Invalid role'),

  validate,

  async (req, res) => {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  }
);

// Product search with query validation
app.get('/api/products',
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('category').optional().isIn(['electronics', 'clothing', 'books']),
  query('minPrice').optional().isFloat({ min: 0 }).toFloat(),

  validate,

  async (req, res) => {
    // req.query values are already sanitized (converted to numbers)
    const products = await Product.find();
    res.json({ products });
  }
);

// Update with param validation
app.put('/api/users/:id',
  param('id').isMongoId().withMessage('Invalid user ID'),

  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('email').optional().isEmail().normalizeEmail(),

  validate,

  async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ user });
  }
);

app.listen(3000);
```

---

## 6. Organizing Validators

Group validators into reusable arrays:

```javascript
// validations/user.validation.js
import { body, param } from 'express-validator';
import User from '../models/User.js';

export const registerValidation = [
  body('name').trim().notEmpty().isLength({ min: 2, max: 50 }),
  body('email').isEmail().normalizeEmail()
    .custom(async (value) => {
      if (await User.findOne({ email: value })) {
        throw new Error('Email already registered');
      }
      return true;
    }),
  body('password').isLength({ min: 8 }),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match');
    return true;
  }),
];

export const updateUserValidation = [
  param('id').isMongoId(),
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('email').optional().isEmail().normalizeEmail(),
];
```

### Use in Routes

```javascript
import { registerValidation, updateUserValidation } from '../validations/user.validation.js';
import validate from '../middleware/validate.js';

router.post('/register', ...registerValidation, validate, register);
router.put('/:id', ...updateUserValidation, validate, updateUser);
```

---

## 7. Summary

| Feature | Syntax |
|---------|--------|
| Custom sync | `.custom((value) => { throw/return })` |
| Custom async | `.custom(async (value) => { throw/return })` |
| Access request | `.custom((value, { req }) => { ... })` |
| Array items | `body('items.*').isString()` |
| Nested objects | `body('address.city').notEmpty()` |
| Group validators | Export arrays of validation chains |

### Custom Validator Pattern

```javascript
.custom(async (value, { req }) => {
  // 1. Perform check (sync or async)
  // 2. If invalid → throw new Error('message')
  // 3. If valid → return true
})
```
