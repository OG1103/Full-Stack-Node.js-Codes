# Joi — Schema Validation

Joi is a powerful schema description and data validation library. It defines the shape, types, and rules of your data, then validates incoming data against those schemas.

---

## 1. Installation

```bash
npm install joi
```

---

## 2. Basic Concept

Define a schema → Validate data against it → Get the result.

```javascript
import Joi from 'joi';

// Define schema
const schema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(18).max(120),
});

// Validate data
const { error, value } = schema.validate({
  name: 'John',
  email: 'john@example.com',
  age: 25,
});

if (error) {
  console.log(error.details[0].message);
  // "name" length must be at least 3 characters long
} else {
  console.log(value); // Validated and cleaned data
}
```

---

## 3. The Validate Result

`schema.validate(data)` returns an object with:

```javascript
const { error, value } = schema.validate(data);
```

| Property | Description |
|----------|-------------|
| `error` | `undefined` if valid, error object if invalid |
| `value` | The validated (and possibly transformed) data |

### Error Object

```javascript
error = {
  details: [
    {
      message: '"name" is required',
      path: ['name'],
      type: 'any.required',
      context: { label: 'name', key: 'name' },
    },
  ],
};
```

- `error.details` — Array of all validation failures
- `error.details[0].message` — Human-readable error message
- `error.details[0].path` — Which field failed

---

## 4. Validate Options

```javascript
const { error, value } = schema.validate(data, {
  abortEarly: false,      // Don't stop at first error (return ALL errors)
  stripUnknown: true,      // Remove fields not in the schema
  allowUnknown: false,     // Reject fields not in the schema (default)
  convert: true,           // Type coercion (default: true)
});
```

### Options Explained

| Option | Default | Description |
|--------|---------|-------------|
| `abortEarly` | `true` | Stop after first error. Set `false` to get all errors |
| `stripUnknown` | `false` | Remove extra fields not defined in the schema |
| `allowUnknown` | `false` | Allow extra fields not defined in the schema |
| `convert` | `true` | Coerce types (e.g., `"25"` → `25` for number fields) |

### `abortEarly: false` Example

```javascript
const { error } = schema.validate(
  { name: '', email: 'invalid' },
  { abortEarly: false }
);

// error.details contains ALL failures, not just the first one
error.details.forEach(d => console.log(d.message));
// "name" is not allowed to be empty
// "email" must be a valid email
```

### `stripUnknown: true` Example

```javascript
const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

const { value } = schema.validate(
  { name: 'John', email: 'john@test.com', hackerField: 'malicious' },
  { stripUnknown: true }
);

console.log(value);
// { name: 'John', email: 'john@test.com' }  — hackerField removed
```

---

## 5. Custom Error Messages

Override default messages with `.messages()`:

```javascript
const schema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'Name must be text',
      'string.min': 'Name must be at least {#limit} characters',
      'string.max': 'Name cannot exceed {#limit} characters',
      'any.required': 'Name is required',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
});
```

### Common Error Types

| Error Type | Trigger |
|-----------|---------|
| `any.required` | Field is missing |
| `string.base` | Value is not a string |
| `string.min` | String too short |
| `string.max` | String too long |
| `string.email` | Not a valid email |
| `number.base` | Value is not a number |
| `number.min` | Number too small |
| `number.max` | Number too large |

---

## 6. Using as Express Middleware

### Validation Middleware Factory

```javascript
// middleware/validate.js
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map(d => d.message);
      return res.status(400).json({ errors: messages });
    }

    req.body = value;  // Replace body with validated/cleaned data
    next();
  };
};

export default validate;
```

### Flexible Middleware (Body, Params, Query)

```javascript
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map(d => d.message);
      return res.status(400).json({ errors: messages });
    }

    req[property] = value;
    next();
  };
};

// Usage
app.get('/api/users/:id', validate(paramsSchema, 'params'), getUser);
app.get('/api/search', validate(querySchema, 'query'), search);
```

### Using in Routes

```javascript
import validate from '../middleware/validate.js';

const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

app.post('/api/users', validate(createUserSchema), async (req, res) => {
  // req.body is validated and cleaned
  const user = await User.create(req.body);
  res.status(201).json({ user });
});
```

---

## 7. Joi vs Express-Validator

| Feature | Joi | Express-Validator |
|---------|-----|-------------------|
| Approach | Schema-based | Chain-based |
| Standalone | Yes (works outside Express) | No (Express only) |
| Syntax | `Joi.string().email()` | `body('email').isEmail()` |
| Validation source | Any data object | `req.body`, `req.params`, `req.query` |
| Error format | Structured details array | Custom with `validationResult()` |
| Learning curve | Moderate | Lower |

Both are excellent. Joi is more powerful for complex schemas; Express-Validator integrates more naturally with Express middleware.

---

## 8. Summary

| Step | What to Do |
|------|-----------|
| Install | `npm install joi` |
| Define schema | `Joi.object({ field: Joi.string().required() })` |
| Validate | `schema.validate(data, options)` |
| Check result | `if (error) { ... } else { use value }` |
| Middleware | Create a reusable `validate(schema)` function |
| Custom errors | Use `.messages({})` on each field |
