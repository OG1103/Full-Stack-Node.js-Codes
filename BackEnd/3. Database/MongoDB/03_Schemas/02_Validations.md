# Mongoose — Schema Validations

Validations ensure that data meets your requirements **before** it's saved to the database. Mongoose runs validators on `save()` and `create()`. By default, `update` operations skip validation unless configured otherwise.

---

## 1. Built-in Validators

### `required` — Field Must Exist

```javascript
{
  name: {
    type: String,
    required: true,
  },
  // With custom error message
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  // Conditional required (function)
  phone: {
    type: String,
    required: function () {
      return this.contactMethod === 'phone';  // Required only if contactMethod is 'phone'
    },
  }
}
```

**Important:** `required` does not check for empty strings. `''` passes `required: true`. To reject empty strings, combine with `minlength: 1` or a custom validator.

### `default` — Fallback Value

```javascript
{
  role: {
    type: String,
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,           // Function reference — called at creation
  },
  code: {
    type: String,
    default: () => generateCode(),  // Dynamic default
  }
}
```

### `immutable` — Cannot Change After Creation

```javascript
{
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,   // Silently ignores any update attempts
  }
}
```

---

## 2. String Validators

```javascript
{
  username: {
    type: String,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    enum: {
      values: ['admin', 'user', 'moderator'],
      message: '{VALUE} is not a valid role',
    },
    trim: true,         // Remove whitespace (not a validator, but a setter)
    lowercase: true,    // Convert to lowercase before saving
    uppercase: true,    // Convert to uppercase before saving
  }
}
```

### `match` — Regex Validation

```javascript
{
  email: {
    type: String,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Please provide a valid email',
    ],
  },
  slug: {
    type: String,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
  }
}
```

### `enum` — Allowed Values

```javascript
{
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'deleted'],
  },
  // With custom error
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'critical'],
      message: '{VALUE} is not a valid priority level',
    },
  }
}
```

---

## 3. Number Validators

```javascript
{
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [150, 'Age cannot exceed 150'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  price: {
    type: Number,
    min: [0, 'Price must be positive'],
  }
}
```

---

## 4. `unique` — Unique Index Constraint

```javascript
{
  email: {
    type: String,
    unique: true,  // Creates a unique index in MongoDB
  }
}
```

**Important distinctions about `unique`:**

1. `unique` is **not a validator** — it creates a MongoDB index. Duplicate key errors come from MongoDB, not Mongoose validation
2. It does **not** run during `validate()` — only triggers on insert/update at the database level
3. The error is a **MongoServerError** (code `11000`), not a Mongoose `ValidationError`
4. You must handle it separately:

```javascript
try {
  await User.create({ email: 'duplicate@test.com' });
} catch (err) {
  if (err.code === 11000) {
    console.log('Duplicate key error:', err.keyValue);
    // err.keyValue = { email: 'duplicate@test.com' }
  }
}
```

---

## 5. `select: false` — Hide Fields by Default

```javascript
{
  password: {
    type: String,
    required: true,
    select: false,   // Excluded from query results by default
  },
  secretToken: {
    type: String,
    select: false,
  }
}

// Normal query — password is NOT returned
const user = await User.findById(id);
// { _id, name, email } — no password

// Explicitly include the hidden field
const userWithPassword = await User.findById(id).select('+password');
// { _id, name, email, password }
```

This is essential for security — sensitive fields like passwords and tokens should never be returned in normal queries.

---

## 6. Custom Validators

### Synchronous Custom Validator

```javascript
{
  phone: {
    type: String,
    validate: {
      validator: function (value) {
        return /^\d{10}$/.test(value);
      },
      message: 'Phone number must be exactly 10 digits',
    },
  }
}
```

### Async Custom Validator

```javascript
{
  email: {
    type: String,
    validate: {
      validator: async function (value) {
        const existingUser = await mongoose.model('User').findOne({ email: value });
        // If editing (not creating), allow the same email for the same user
        if (existingUser && existingUser._id.toString() !== this._id?.toString()) {
          return false;
        }
        return true;
      },
      message: 'Email already exists',
    },
  }
}
```

### Multiple Validators on One Field

```javascript
{
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    validate: [
      {
        validator: (v) => /[A-Z]/.test(v),
        message: 'Password must contain at least one uppercase letter',
      },
      {
        validator: (v) => /[0-9]/.test(v),
        message: 'Password must contain at least one number',
      },
      {
        validator: (v) => /[!@#$%^&*]/.test(v),
        message: 'Password must contain at least one special character',
      },
    ],
  }
}
```

---

## 7. Validation on Updates

By default, Mongoose **does not run validators** on `update()` operations. You must opt in:

```javascript
// Validators DO run:
const doc = await Model.findById(id);
doc.name = '';
await doc.save();  // ValidationError if name is required

// Validators DO NOT run by default:
await Model.findByIdAndUpdate(id, { name: '' });  // No error!

// Enable validators on update:
await Model.findByIdAndUpdate(id, { name: '' }, { runValidators: true });
// Now throws ValidationError

await Model.updateOne({ _id: id }, { name: '' }, { runValidators: true });
// Also validates
```

**Setting globally** (Mongoose 6+):

```javascript
mongoose.set('runValidators', true);
```

### `this` Context in Update Validators

In update validators, `this` refers to the **query** object, not the document. Use `this.getUpdate()` to access update data:

```javascript
{
  confirmPassword: {
    type: String,
    validate: {
      validator: function (value) {
        // In save: this = document
        // In update with runValidators: this = query
        if (this.isNew || this.isModified?.('password')) {
          return value === this.password;
        }
        return true;
      },
      message: 'Passwords do not match',
    },
  }
}
```

---

## 8. Handling Validation Errors

Mongoose wraps all validation failures in a `ValidationError` object:

```javascript
try {
  await User.create({ name: '', email: 'bad', age: -5 });
} catch (err) {
  if (err.name === 'ValidationError') {
    // err.errors is an object with one entry per failed field
    for (const field in err.errors) {
      console.log(`${field}: ${err.errors[field].message}`);
    }
    // Output:
    // name: Name is required
    // email: Please provide a valid email
    // age: Age cannot be negative
  }
}
```

### Error Object Structure

```javascript
err = {
  name: 'ValidationError',
  message: 'User validation failed: name: ..., email: ...',
  errors: {
    name: {
      name: 'ValidatorError',
      message: 'Name is required',
      kind: 'required',
      path: 'name',
      value: '',
    },
    email: {
      name: 'ValidatorError',
      message: 'Please provide a valid email',
      kind: 'regexp',
      path: 'email',
      value: 'bad',
    },
  },
};
```

### Express Error Handler for Validation

```javascript
const handleValidationError = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ success: false, errors });
  }
  next(err);
};
```

---

## 9. Summary

| Validator | Applies To | Purpose |
|-----------|-----------|---------|
| `required` | All types | Field must exist |
| `default` | All types | Fallback value |
| `immutable` | All types | Prevent changes after creation |
| `enum` | String, Number | Restrict to allowed values |
| `min` / `max` | Number, Date | Value range |
| `minlength` / `maxlength` | String | Length constraints |
| `match` | String | Regex pattern |
| `unique` | All types | Unique index (not a validator) |
| `select` | All types | Hide from query results |
| `validate` | All types | Custom validation function |

### Key Points

1. Validators run on `save()` and `create()` by default
2. Use `{ runValidators: true }` to enable validation on updates
3. `unique` is an **index**, not a validator — handle `E11000` separately
4. `select: false` hides sensitive fields — use `+field` to explicitly include
5. Custom validators support both sync and async functions
6. Access all errors via `err.errors` in a `ValidationError`
