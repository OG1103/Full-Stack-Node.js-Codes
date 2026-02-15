# Joi — Practical Examples

Real-world validation schemas and middleware patterns for Express applications.

---

## 1. User Registration Schema

```javascript
import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'any.required': 'Name is required',
    }),

  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required()
    .messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must include uppercase, lowercase, and a number',
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
    }),

  role: Joi.string()
    .valid('user', 'admin')
    .default('user'),
});
```

---

## 2. Product Schema

```javascript
export const productSchema = Joi.object({
  name: Joi.string().min(2).max(200).trim().required(),

  description: Joi.string().max(2000).allow(''),

  price: Joi.number().positive().precision(2).required()
    .messages({ 'number.positive': 'Price must be greater than 0' }),

  category: Joi.string()
    .valid('electronics', 'clothing', 'books', 'food', 'other')
    .required(),

  tags: Joi.array()
    .items(Joi.string().trim().max(30))
    .max(10)
    .unique()
    .default([]),

  stock: Joi.number().integer().min(0).default(0),

  images: Joi.array()
    .items(Joi.string().uri())
    .max(5),

  specifications: Joi.object().pattern(
    Joi.string(),
    Joi.alternatives().try(Joi.string(), Joi.number())
  ),

  isPublished: Joi.boolean().default(false),
});
```

---

## 3. Query String Schema (Pagination + Filtering)

```javascript
export const productQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().valid('price', '-price', 'name', '-name', 'createdAt', '-createdAt')
    .default('-createdAt'),
  category: Joi.string().valid('electronics', 'clothing', 'books', 'food'),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().greater(Joi.ref('minPrice')),
  search: Joi.string().trim().max(100),
});

// Usage
app.get('/api/products', validate(productQuerySchema, 'query'), getProducts);
```

---

## 4. MongoDB ObjectId Validation

```javascript
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

export const paramsIdSchema = Joi.object({
  id: Joi.string().pattern(objectIdPattern).required()
    .messages({ 'string.pattern.base': 'Invalid ID format' }),
});

// Usage
app.get('/api/users/:id', validate(paramsIdSchema, 'params'), getUser);
app.delete('/api/users/:id', validate(paramsIdSchema, 'params'), deleteUser);
```

---

## 5. Update Schema (Partial Validation)

For PUT/PATCH requests where fields are optional:

```javascript
export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).trim(),
  email: Joi.string().email().lowercase().trim(),
  bio: Joi.string().max(500).allow(''),
  avatar: Joi.string().uri(),
}).min(1);  // At least one field must be provided

// Usage
app.patch('/api/users/:id',
  validate(paramsIdSchema, 'params'),
  validate(updateUserSchema),
  updateUser
);
```

---

## 6. Conditional Schema (Payment)

```javascript
export const paymentSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required(),
  currency: Joi.string().valid('USD', 'EUR', 'GBP').default('USD'),

  paymentMethod: Joi.string()
    .valid('card', 'bank_transfer', 'paypal')
    .required(),

  // Card fields required only if paymentMethod is 'card'
  cardNumber: Joi.string().creditCard().when('paymentMethod', {
    is: 'card',
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),

  cardExpiry: Joi.string().pattern(/^(0[1-9]|1[0-2])\/\d{2}$/).when('paymentMethod', {
    is: 'card',
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),

  // Bank fields required only if paymentMethod is 'bank_transfer'
  bankAccount: Joi.string().when('paymentMethod', {
    is: 'bank_transfer',
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),

  // PayPal email required only if paymentMethod is 'paypal'
  paypalEmail: Joi.string().email().when('paymentMethod', {
    is: 'paypal',
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
});
```

---

## 7. Reusable Validation Middleware

```javascript
// middleware/validate.js
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      return res.status(400).json({ status: 'error', errors });
    }

    req[property] = value;
    next();
  };
};

export default validate;
```

### Response Format

```json
{
  "status": "error",
  "errors": [
    { "field": "email", "message": "Please provide a valid email" },
    { "field": "password", "message": "Password must be at least 8 characters" }
  ]
}
```

---

## 8. Organizing Schemas

```
project/
├── validations/
│   ├── auth.validation.js      // registerSchema, loginSchema
│   ├── user.validation.js      // updateUserSchema, paramsIdSchema
│   ├── product.validation.js   // productSchema, productQuerySchema
│   └── payment.validation.js   // paymentSchema
├── middleware/
│   └── validate.js             // Reusable middleware
└── routes/
    ├── auth.routes.js
    ├── user.routes.js
    └── product.routes.js
```

### Example Route File

```javascript
// routes/auth.routes.js
import express from 'express';
import validate from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';
import { register, login } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;
```

---

## 9. Summary

| Schema Type | Key Feature | Example |
|-------------|------------|---------|
| Registration | Password confirmation with `Joi.ref()` | `confirmPassword: Joi.valid(Joi.ref('password'))` |
| Product | Nested arrays and objects | `tags: Joi.array().items(Joi.string())` |
| Query params | Defaults and ranges | `page: Joi.number().default(1)` |
| ObjectId | Regex pattern | `.pattern(/^[0-9a-fA-F]{24}$/)` |
| Update (PATCH) | All optional with `.min(1)` | `Joi.object({...}).min(1)` |
| Conditional | `.when()` based on other fields | Different fields per payment method |
