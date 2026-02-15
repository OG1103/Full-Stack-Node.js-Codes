# Joi — Data Type Validations

Joi provides validators for every common data type. Each type has its own set of chainable rules.

---

## 1. String Validations

```javascript
import Joi from 'joi';

const schema = Joi.object({
  // Basic string
  name: Joi.string().min(2).max(100).required(),

  // Email
  email: Joi.string().email().required(),

  // URL
  website: Joi.string().uri(),

  // Enum (only these values allowed)
  role: Joi.string().valid('user', 'admin', 'moderator'),

  // Regex pattern
  username: Joi.string().pattern(/^[a-zA-Z0-9_]+$/).min(3).max(30),

  // Trimmed and lowercase
  slug: Joi.string().trim().lowercase(),

  // Alphanumeric only
  code: Joi.string().alphanum(),

  // UUID
  id: Joi.string().uuid(),

  // IP address
  ip: Joi.string().ip(),

  // Hex color
  color: Joi.string().hex().length(6),
});
```

### String Methods

| Method | Description |
|--------|-------------|
| `.min(n)` | Minimum length |
| `.max(n)` | Maximum length |
| `.length(n)` | Exact length |
| `.email()` | Valid email format |
| `.uri()` | Valid URL |
| `.pattern(regex)` | Match regex |
| `.valid(...values)` | Only these values |
| `.alphanum()` | Alphanumeric only |
| `.trim()` | Remove whitespace |
| `.lowercase()` | Convert to lowercase |
| `.uppercase()` | Convert to uppercase |
| `.uuid()` | Valid UUID format |
| `.ip()` | Valid IP address |
| `.hex()` | Hexadecimal string |

---

## 2. Number Validations

```javascript
const schema = Joi.object({
  // Basic number
  age: Joi.number().integer().min(0).max(150),

  // Positive only
  price: Joi.number().positive().precision(2),

  // Range
  rating: Joi.number().min(1).max(5),

  // Only specific values
  quantity: Joi.number().integer().valid(1, 5, 10, 25, 50),

  // Port number
  port: Joi.number().port(),

  // Multiple of
  seats: Joi.number().integer().multiple(2),
});
```

### Number Methods

| Method | Description |
|--------|-------------|
| `.integer()` | Must be a whole number |
| `.min(n)` | Minimum value |
| `.max(n)` | Maximum value |
| `.positive()` | Greater than 0 |
| `.negative()` | Less than 0 |
| `.precision(n)` | Max decimal places |
| `.multiple(n)` | Must be a multiple of n |
| `.port()` | Valid port (0-65535) |
| `.valid(...values)` | Only these values |

---

## 3. Boolean Validations

```javascript
const schema = Joi.object({
  isActive: Joi.boolean().required(),

  // Truthy/falsy conversion (accepts "yes"/"no", 1/0, etc.)
  newsletter: Joi.boolean().truthy('yes', '1', 'on').falsy('no', '0', 'off'),
});
```

With `convert: true` (default), Joi converts these to boolean:
- Truthy: `"true"`, `1`, `"1"` → `true`
- Falsy: `"false"`, `0`, `"0"` → `false`

---

## 4. Date Validations

```javascript
const schema = Joi.object({
  // ISO date string
  birthDate: Joi.date().iso().max('now'),

  // Date range
  startDate: Joi.date().min('2020-01-01').required(),
  endDate: Joi.date().greater(Joi.ref('startDate')),

  // Timestamp
  createdAt: Joi.date().timestamp('unix'),
});
```

### Date Methods

| Method | Description |
|--------|-------------|
| `.iso()` | ISO 8601 format |
| `.timestamp()` | Unix or JavaScript timestamp |
| `.min(date)` | Not before this date |
| `.max(date)` | Not after this date |
| `.greater(ref)` | After another date field |
| `.less(ref)` | Before another date field |

---

## 5. Array Validations

```javascript
const schema = Joi.object({
  // Array of strings
  tags: Joi.array().items(Joi.string()).min(1).max(10),

  // Array of numbers
  scores: Joi.array().items(Joi.number().min(0).max(100)),

  // Array of objects
  addresses: Joi.array().items(
    Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      zip: Joi.string().pattern(/^\d{5}$/),
    })
  ).max(5),

  // Unique items
  categories: Joi.array().items(Joi.string()).unique(),

  // Mixed types
  values: Joi.array().items(Joi.string(), Joi.number()),

  // Ordered (first must be string, second must be number)
  pair: Joi.array().ordered(Joi.string(), Joi.number()),
});
```

### Array Methods

| Method | Description |
|--------|-------------|
| `.items(schema)` | Schema for array elements |
| `.min(n)` | Minimum array length |
| `.max(n)` | Maximum array length |
| `.length(n)` | Exact array length |
| `.unique()` | No duplicate values |
| `.ordered(...schemas)` | Each position must match its schema |
| `.has(schema)` | At least one item must match |
| `.sparse()` | Allow undefined gaps |

---

## 6. Object Validations

```javascript
const schema = Joi.object({
  // Nested object
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().length(2).uppercase(),
    zip: Joi.string().pattern(/^\d{5}$/),
  }).required(),

  // Object with dynamic keys
  metadata: Joi.object().pattern(
    Joi.string(),       // Key pattern
    Joi.string()        // Value pattern
  ),

  // Object with min/max keys
  preferences: Joi.object().min(1).max(10),
});
```

### Object Methods

| Method | Description |
|--------|-------------|
| `.keys({})` | Define object schema (same as `Joi.object({})`) |
| `.min(n)` | Minimum number of keys |
| `.max(n)` | Maximum number of keys |
| `.length(n)` | Exact number of keys |
| `.pattern(keySchema, valueSchema)` | Dynamic key-value validation |
| `.and('a', 'b')` | Both must be present or both absent |
| `.or('a', 'b')` | At least one must be present |
| `.xor('a', 'b')` | Exactly one must be present |

---

## 7. Common Modifiers (All Types)

These modifiers work on any Joi type:

```javascript
const schema = Joi.object({
  // Required vs optional
  name: Joi.string().required(),        // Must be present
  bio: Joi.string().optional(),          // Can be omitted
  nickname: Joi.string().allow(''),      // Allow empty string
  deletedAt: Joi.date().allow(null),     // Allow null

  // Default values
  role: Joi.string().default('user'),
  isActive: Joi.boolean().default(true),

  // Forbidden (must NOT be present)
  password: Joi.any().forbidden(),       // Reject if included

  // Label (for error messages)
  phone: Joi.string().label('Phone Number'),
  // Error: "Phone Number" is required (instead of "phone")
});
```

### Modifier Reference

| Modifier | Description |
|----------|-------------|
| `.required()` | Field must be present |
| `.optional()` | Field can be omitted |
| `.allow(value)` | Allow specific values (e.g., `null`, `''`) |
| `.default(value)` | Set default if not provided |
| `.forbidden()` | Field must NOT be present |
| `.label('Name')` | Custom name for error messages |
| `.description('...')` | Documentation (not used in validation) |

---

## 8. Alternatives (Union Types)

```javascript
const schema = Joi.object({
  // String or number
  id: Joi.alternatives().try(Joi.string(), Joi.number()),

  // Conditional type
  contact: Joi.alternatives().conditional('contactType', {
    is: 'email',
    then: Joi.string().email(),
    otherwise: Joi.string().pattern(/^\d{10}$/),
  }),
});
```

---

## 9. Summary

| Type | Import | Common Rules |
|------|--------|-------------|
| `Joi.string()` | String | `.email()`, `.min()`, `.max()`, `.pattern()` |
| `Joi.number()` | Number | `.integer()`, `.min()`, `.max()`, `.positive()` |
| `Joi.boolean()` | Boolean | `.truthy()`, `.falsy()` |
| `Joi.date()` | Date | `.iso()`, `.min()`, `.max()`, `.greater()` |
| `Joi.array()` | Array | `.items()`, `.min()`, `.max()`, `.unique()` |
| `Joi.object()` | Object | `.keys()`, `.pattern()`, `.and()`, `.or()` |
| `Joi.alternatives()` | Union | `.try()`, `.conditional()` |
