# Joi — Advanced Validations

Advanced Joi features for complex validation scenarios: references, conditionals, custom validators, schema composition, and more.

---

## 1. References with `Joi.ref()`

Reference another field's value within the same schema:

```javascript
import Joi from 'joi';

const schema = Joi.object({
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))   // Must match password
    .required()
    .messages({
      'any.only': 'Passwords do not match',
    }),
});

// Valid:   { password: 'abc12345', confirmPassword: 'abc12345' }
// Invalid: { password: 'abc12345', confirmPassword: 'different' }
```

### Date References

```javascript
const schema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date()
    .greater(Joi.ref('startDate'))   // Must be after startDate
    .required(),
});
```

### Number References

```javascript
const schema = Joi.object({
  minPrice: Joi.number().min(0).required(),
  maxPrice: Joi.number()
    .greater(Joi.ref('minPrice'))   // Must be greater than minPrice
    .required(),
});
```

---

## 2. Valid and Invalid

### `.valid()` — Allowlist

```javascript
const schema = Joi.object({
  status: Joi.string().valid('active', 'inactive', 'pending'),
  priority: Joi.number().valid(1, 2, 3, 4, 5),
  role: Joi.string().valid('user', 'admin'),
});
```

### `.invalid()` — Blocklist

```javascript
const schema = Joi.object({
  username: Joi.string()
    .invalid('admin', 'root', 'superuser')  // These are not allowed
    .required(),
});
```

---

## 3. Conditional Validation with `.when()`

Apply different rules based on another field's value:

```javascript
const schema = Joi.object({
  accountType: Joi.string().valid('personal', 'business').required(),

  // If business, company name is required
  companyName: Joi.string().when('accountType', {
    is: 'business',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
});
```

### Multiple Conditions

```javascript
const schema = Joi.object({
  role: Joi.string().valid('user', 'admin', 'moderator').required(),

  // Different permissions field based on role
  permissions: Joi.when('role', {
    switch: [
      { is: 'admin', then: Joi.array().items(Joi.string()).min(1) },
      { is: 'moderator', then: Joi.array().items(Joi.string()).max(5) },
    ],
    otherwise: Joi.forbidden(),  // Regular users can't set permissions
  }),
});
```

### Conditional Based on Value Comparison

```javascript
const schema = Joi.object({
  age: Joi.number().required(),

  // Guardian required if under 18
  guardianName: Joi.string().when('age', {
    is: Joi.number().less(18),
    then: Joi.string().required(),
    otherwise: Joi.string().forbidden(),
  }),
});
```

---

## 4. Custom Validators with `.custom()`

Write your own validation logic:

```javascript
const schema = Joi.object({
  username: Joi.string()
    .custom((value, helpers) => {
      if (value.includes(' ')) {
        return helpers.error('string.noSpaces');
      }
      return value;  // Return the value (can be modified)
    })
    .messages({
      'string.noSpaces': 'Username cannot contain spaces',
    }),
});
```

### Async Custom Validation (Database Check)

Joi's `.custom()` is synchronous. For async checks (like database lookups), validate after Joi:

```javascript
// Joi handles format validation
const schema = Joi.object({
  email: Joi.string().email().required(),
});

// Async check happens separately
const { error, value } = schema.validate(req.body);
if (error) return res.status(400).json({ error: error.details[0].message });

const existingUser = await User.findOne({ email: value.email });
if (existingUser) {
  return res.status(409).json({ error: 'Email already registered' });
}
```

### Transform Values

`.custom()` can also transform the value:

```javascript
const schema = Joi.object({
  tags: Joi.string().custom((value) => {
    return value.split(',').map(tag => tag.trim());
    // "react, node, express" → ["react", "node", "express"]
  }),
});
```

---

## 5. Schema Composition with `.concat()`

Merge two schemas together:

```javascript
const baseSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

const createSchema = baseSchema.concat(
  Joi.object({
    password: Joi.string().min(8).required(),
  })
);

const updateSchema = baseSchema.concat(
  Joi.object({
    name: Joi.string().optional(),    // Override: make optional for updates
    email: Joi.string().email().optional(),
  })
);
```

---

## 6. Schema Variants with `.alter()`

Define multiple variants of a schema:

```javascript
const userSchema = Joi.object({
  name: Joi.string()
    .alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    }),
  email: Joi.string().email()
    .alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.optional(),
    }),
  password: Joi.string().min(8)
    .alter({
      create: (schema) => schema.required(),
      update: (schema) => schema.forbidden(),  // Can't update password here
    }),
});

// Generate variant schemas
const createUserSchema = userSchema.tapioca('create');
const updateUserSchema = userSchema.tapioca('update');
```

> **Note:** Use `.tapioca('variant')` to extract a specific variant.

---

## 7. Object-Level Rules

### `.and()` — All or None

```javascript
const schema = Joi.object({
  latitude: Joi.number(),
  longitude: Joi.number(),
}).and('latitude', 'longitude');
// Either both must be present or both must be absent
```

### `.or()` — At Least One

```javascript
const schema = Joi.object({
  email: Joi.string().email(),
  phone: Joi.string(),
}).or('email', 'phone');
// At least one contact method required
```

### `.xor()` — Exactly One

```javascript
const schema = Joi.object({
  githubId: Joi.string(),
  googleId: Joi.string(),
}).xor('githubId', 'googleId');
// Exactly one must be present (not both, not neither)
```

### `.nand()` — Not Both

```javascript
const schema = Joi.object({
  isAdmin: Joi.boolean(),
  isGuest: Joi.boolean(),
}).nand('isAdmin', 'isGuest');
// Cannot be both admin and guest
```

### `.with()` and `.without()`

```javascript
const schema = Joi.object({
  password: Joi.string(),
  confirmPassword: Joi.string(),
  oldPassword: Joi.string(),
})
  .with('password', 'confirmPassword')      // If password, must have confirmPassword
  .without('isGuest', 'password');           // If isGuest, cannot have password
```

---

## 8. Dynamic Key Patterns

Validate objects with dynamic keys:

```javascript
// Object where all keys must be UUIDs and values must be numbers
const schema = Joi.object().pattern(
  Joi.string().uuid(),     // Key must be a UUID
  Joi.number().min(0)      // Value must be a non-negative number
);

// Valid: { "550e8400-...": 42, "6ba7b810-...": 100 }
```

---

## 9. Summary

| Feature | Method | Use Case |
|---------|--------|----------|
| Reference | `Joi.ref('field')` | Confirm password, date ranges |
| Allowlist | `.valid(a, b, c)` | Enum values |
| Blocklist | `.invalid(a, b)` | Forbidden values |
| Conditional | `.when('field', { is, then, otherwise })` | Different rules per field value |
| Custom logic | `.custom((value, helpers) => {})` | Custom validation or transformation |
| Merge schemas | `.concat(otherSchema)` | Combine base + specific schemas |
| Variants | `.alter({ create, update })` | Reuse schema for different operations |
| Dependencies | `.and()`, `.or()`, `.xor()`, `.with()` | Field-level co-dependencies |
| Dynamic keys | `.pattern(keySchema, valueSchema)` | Unknown/dynamic object keys |
