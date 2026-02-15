# Mongoose — Schema Basics & Types

A Schema defines the **structure, types, and rules** for documents in a MongoDB collection. It's the blueprint that every document in the collection should follow.

---

## 1. Defining a Schema

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,                          // Shorthand
  email: { type: String, required: true }, // With options
  age: Number,
  isActive: Boolean,
  createdAt: Date,
});

const User = mongoose.model('User', userSchema);
```

### Shorthand vs Object Syntax

```javascript
// Shorthand — just the type
const schema = new mongoose.Schema({
  name: String,
  age: Number,
});

// Object syntax — type + options
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, min: 0, max: 150 },
});
```

---

## 2. All Schema Types

### String

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true,        // Remove whitespace from both ends
    lowercase: true,   // Convert to lowercase before saving
    uppercase: true,   // Convert to uppercase before saving
    minlength: 2,      // Minimum string length
    maxlength: 100,    // Maximum string length
    match: /^[a-zA-Z\s]+$/,  // Regex validation
    enum: ['admin', 'user', 'moderator'],  // Allowed values
  }
}
```

### Number

```javascript
{
  age: {
    type: Number,
    required: true,
    min: 0,            // Minimum value
    max: 150,          // Maximum value
    default: 18,       // Default value
  },
  price: {
    type: mongoose.Types.Decimal128,  // Precise decimals (financial data)
  }
}
```

### Boolean

```javascript
{
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
}
```

### Date

```javascript
{
  createdAt: {
    type: Date,
    default: Date.now,     // Function reference (called at creation time)
    immutable: true,       // Cannot be changed after creation
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),  // 30 days from now
  }
}
```

**Important:** Use `Date.now` (function reference), not `Date.now()` (immediate invocation). The function is called each time a new document is created.

### ObjectId (References)

```javascript
{
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',          // References the User model
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }
}
```

- `ref` tells Mongoose which model to use for `.populate()`
- Stores a 12-byte ObjectId in the database, not the entire referenced document

### Array Types

```javascript
{
  // Array of strings
  tags: [String],

  // Array of numbers
  scores: [Number],

  // Array of ObjectIds (references)
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  // Array of subdocuments
  addresses: [{
    street: String,
    city: String,
    zip: String,
    isPrimary: { type: Boolean, default: false },
  }],

  // Empty array (accepts any type)
  misc: [],

  // Array with default value
  roles: {
    type: [String],
    default: ['user'],
  },
}
```

### Nested Objects (Subdocuments)

```javascript
{
  // Nested object (inline)
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    zip: { type: String, match: /^\d{5}$/ },
    country: { type: String, default: 'US' },
  },

  // Nested object with explicit type
  settings: {
    type: {
      theme: { type: String, default: 'light' },
      notifications: { type: Boolean, default: true },
    },
    default: {},
  }
}
```

### Enum (Restricted Values)

```javascript
{
  role: {
    type: String,
    enum: {
      values: ['admin', 'user', 'moderator'],
      message: '{VALUE} is not a valid role',  // Custom error message
    },
    default: 'user',
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
  },
  priority: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
  }
}
```

### Mixed (Schema-less)

```javascript
{
  // Accepts any data type — no validation
  metadata: mongoose.Schema.Types.Mixed,

  // Equivalent shorthand
  metadata: {},
}
```

**Warning:** Mongoose cannot detect changes to Mixed fields. You must call `doc.markModified('metadata')` before `save()`:

```javascript
user.metadata.key = 'value';
user.markModified('metadata');
await user.save();
```

### Map

```javascript
{
  // Key-value pairs where keys are strings
  socialLinks: {
    type: Map,
    of: String,
  }
}

// Usage:
user.socialLinks.set('twitter', '@johndoe');
user.socialLinks.get('twitter');  // '@johndoe'
```

### Buffer

```javascript
{
  // Binary data (images, files)
  avatar: Buffer,
}
```

---

## 3. Complete Schema Example

```javascript
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters'],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  description: {
    type: String,
    maxlength: 2000,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  tags: [String],
  images: [{
    url: { type: String, required: true },
    alt: String,
  }],
  specifications: {
    type: Map,
    of: String,
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,  // Adds createdAt and updatedAt
});

const Product = mongoose.model('Product', productSchema);
```

---

## 4. Type Casting

Mongoose automatically casts values to the declared type when possible:

```javascript
const schema = new mongoose.Schema({ age: Number, name: String });

// These work (auto-cast):
await Model.create({ age: '25', name: 123 });
// age is stored as Number 25, name as String '123'

// These fail (cannot cast):
await Model.create({ age: 'not-a-number' });
// CastError: Cast to Number failed for value "not-a-number"
```

---

## 5. Summary

| Type | JavaScript Equivalent | Example |
|------|----------------------|---------|
| `String` | `string` | `'hello'` |
| `Number` | `number` | `42`, `3.14` |
| `Boolean` | `boolean` | `true`, `false` |
| `Date` | `Date` | `new Date()` |
| `ObjectId` | `ObjectId` | `mongoose.Types.ObjectId` |
| `Array` | `Array` | `[String]`, `[{ ... }]` |
| `Mixed` | `any` | `Schema.Types.Mixed` |
| `Map` | `Map` | `{ type: Map, of: String }` |
| `Buffer` | `Buffer` | Binary data |
| `Decimal128` | — | Precise decimals |

### Key Points

1. Use **object syntax** when you need options (required, default, min, max)
2. `ObjectId` with `ref` enables `.populate()` for cross-collection references
3. Nested objects create **subdocuments** with their own `_id`
4. `Mixed` type skips validation — use `markModified()` before saving changes
5. `Date.now` (no parentheses) defers execution to document creation time
