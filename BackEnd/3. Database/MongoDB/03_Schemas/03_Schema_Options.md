# Mongoose — Schema Options

Schema options are passed as the **second argument** to `new mongoose.Schema()`. They control how Mongoose handles documents, timestamps, versioning, and more.

---

## 1. Syntax

```javascript
const userSchema = new mongoose.Schema(
  {
    // field definitions...
  },
  {
    // options here
    timestamps: true,
    versionKey: false,
  }
);
```

---

## 2. `timestamps` — Automatic Date Tracking

Adds `createdAt` and `updatedAt` fields automatically:

```javascript
const postSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
  },
  { timestamps: true }
);

// Document after save:
// {
//   _id: ...,
//   title: 'Hello',
//   body: '...',
//   createdAt: 2024-01-15T10:30:00.000Z,   ← set on create
//   updatedAt: 2024-01-15T10:30:00.000Z,   ← updated on every save
// }
```

### Custom Timestamp Field Names

```javascript
{
  timestamps: {
    createdAt: 'created_at',    // Rename createdAt
    updatedAt: 'updated_at',    // Rename updatedAt
  }
}
```

### Disable One Timestamp

```javascript
{
  timestamps: {
    createdAt: true,
    updatedAt: false,   // Only track creation time
  }
}
```

---

## 3. `versionKey` — Document Version Tracking

Mongoose adds a `__v` field by default to track document revisions:

```javascript
// Default behavior:
// { _id: ..., name: 'John', __v: 0 }
// After update:
// { _id: ..., name: 'John', __v: 1 }
```

### Disable Version Key

```javascript
const schema = new mongoose.Schema({ ... }, {
  versionKey: false,
});
// Documents will NOT have __v field
```

### Custom Version Key Name

```javascript
{
  versionKey: 'version'
}
// { _id: ..., name: 'John', version: 0 }
```

**When `__v` is useful:** It helps prevent conflicting updates. If two requests read the same document, modify it, and save — Mongoose can detect that the version changed and reject the stale update (optimistic concurrency).

---

## 4. `strict` — Unknown Field Handling

Controls what happens when you try to save fields that are **not defined** in the schema.

```javascript
// strict: true (DEFAULT)
const schema = new mongoose.Schema({ name: String }, { strict: true });

const doc = new Model({ name: 'John', unknown: 'field' });
await doc.save();
// Saved: { name: 'John' }
// 'unknown' is silently stripped
```

### `strict: false` — Allow Unknown Fields

```javascript
const schema = new mongoose.Schema({ name: String }, { strict: false });

const doc = new Model({ name: 'John', extra: 'data' });
await doc.save();
// Saved: { name: 'John', extra: 'data' }
```

### `strict: 'throw'` — Error on Unknown Fields

```javascript
const schema = new mongoose.Schema({ name: String }, { strict: 'throw' });

const doc = new Model({ name: 'John', extra: 'data' });
await doc.save();
// Throws: StrictModeError: Field 'extra' is not in schema
```

---

## 5. `collection` — Custom Collection Name

Override the auto-generated collection name:

```javascript
const userSchema = new mongoose.Schema({ ... }, {
  collection: 'app_users',   // Instead of 'users'
});
```

Without this, `mongoose.model('User', schema)` creates/uses a collection called `users`.

---

## 6. `id` and `_id`

### `_id` — Auto-Generate ObjectId

```javascript
// Default: _id is automatically added
const schema = new mongoose.Schema({ name: String });
// { _id: ObjectId("..."), name: "John" }

// Disable auto _id (rare — for embedded subdocuments):
const subSchema = new mongoose.Schema({ name: String }, { _id: false });
```

### `id` — Virtual Getter for `_id`

```javascript
// Default: Mongoose creates a virtual 'id' that returns _id as a string
const doc = await Model.findById(someId);
doc._id;  // ObjectId("64f1a2b3...")
doc.id;   // "64f1a2b3..." (string version)

// Disable the virtual id:
const schema = new mongoose.Schema({ ... }, { id: false });
```

---

## 7. `toJSON` and `toObject`

Transform documents when converting to JSON (e.g., in API responses):

```javascript
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: { type: String, select: false },
  },
  {
    toJSON: {
      // Remove __v and rename _id to id
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;  // Extra safety
        return ret;
      },
      virtuals: true,  // Include virtual fields in JSON output
    },
    toObject: {
      virtuals: true,  // Include virtuals in .toObject() calls too
    },
  }
);

// When calling res.json(user):
// Before transform: { _id: "abc", name: "John", __v: 0 }
// After transform:  { id: "abc", name: "John" }
```

### Common Transform Pattern

```javascript
{
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
    virtuals: true,
  }
}
```

---

## 8. `capped` — Fixed-Size Collections

Capped collections have a fixed size and automatically overwrite the oldest documents:

```javascript
const logSchema = new mongoose.Schema(
  { message: String, timestamp: Date },
  {
    capped: {
      size: 1024 * 1024,   // 1MB max size
      max: 1000,            // Maximum 1000 documents
    },
  }
);
```

**Use cases:** Server logs, event streams, circular buffers.

---

## 9. `minimize` — Empty Object Handling

```javascript
// minimize: true (DEFAULT) — removes empty objects
const schema = new mongoose.Schema({ settings: {} }, { minimize: true });
await Model.create({ settings: {} });
// Stored: { _id: ... }  — 'settings' is removed because it's empty

// minimize: false — keeps empty objects
const schema = new mongoose.Schema({ settings: {} }, { minimize: false });
await Model.create({ settings: {} });
// Stored: { _id: ..., settings: {} }
```

---

## 10. `read` — Read Preference

Control which replica set members handle read operations:

```javascript
const schema = new mongoose.Schema({ ... }, {
  read: 'secondaryPreferred',
});
```

| Value | Reads From |
|-------|-----------|
| `'primary'` | Primary only (default) |
| `'primaryPreferred'` | Primary, fallback to secondary |
| `'secondary'` | Secondary only |
| `'secondaryPreferred'` | Secondary, fallback to primary |
| `'nearest'` | Lowest latency member |

---

## 11. All Options Summary

| Option | Default | Description |
|--------|---------|-------------|
| `timestamps` | `false` | Add `createdAt` / `updatedAt` |
| `versionKey` | `'__v'` | Version tracking field |
| `strict` | `true` | Strip unknown fields |
| `collection` | Auto | Custom collection name |
| `_id` | `true` | Auto-generate `_id` |
| `id` | `true` | Virtual `id` getter |
| `toJSON` | `{}` | Transform for JSON serialization |
| `toObject` | `{}` | Transform for `.toObject()` |
| `capped` | `false` | Fixed-size collection |
| `minimize` | `true` | Remove empty objects |
| `read` | `'primary'` | Read preference |

### Common Schema Options Template

```javascript
const schema = new mongoose.Schema(
  { /* fields */ },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);
```
