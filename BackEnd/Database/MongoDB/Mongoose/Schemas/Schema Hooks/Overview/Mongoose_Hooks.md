# Mongoose Middlewares

Mongoose middlewares (also called hooks) are functions that run before (`pre`) or after (`post`) certain actions on a Mongoose schema. They allow us to modify data, perform validations, and execute additional logic during different lifecycle events.

## Middleware Methods: `pre` and `post`

### `pre` Middleware

The `pre` middleware runs **before** an operation is executed. This is useful for tasks like modifying data before saving or deleting related documents before removing an entry.

### `post` Middleware

The `post` middleware runs **after** an operation is executed. This is useful for logging operations, sending notifications, or handling errors after the main database action is performed.

## Parameters: Methods It Can Be Applied To

Mongoose middleware can be applied to different model methods, such as:

- **`save`**: Runs before/after a document is saved.
- **`remove`**: Runs before/after a document is removed.
- **`updateOne`**: Runs before/after a single document update.
- **`findOneAndUpdate`**: Runs before/after a `findOneAndUpdate` query.
- **`findOneAndDelete`**: Runs before/after a `findOneAndDelete` query.
- **`insertMany`**: Runs before/after inserting multiple documents.
- **`validate`**: Runs before a document is validated.
- **`deleteOne`**: Runs before/after deleting a single document.
- **`bulkWrite`**: Runs before/after bulk write operations.
- **`createCollection`**: Runs before/after creating a collection.
- **`count`**: Runs before/after counting documents.
- **`countDocuments`**: Runs before/after counting documents with filters.
- **`deleteMany`**: Runs before/after deleting multiple documents.
- **`estimatedDocumentCount`**: Runs before/after estimating the document count.
- **`find`**: Runs before/after finding multiple documents.
- **`findOne`**: Runs before/after finding a single document.
- **`findOneAndReplace`**: Runs before/after finding one document and replacing it.
- **`replaceOne`**: Runs before/after replacing a document.
- **`update`**: Runs before/after updating documents.
- **`updateMany`**: Runs before/after updating multiple documents.
- **`aggregate`**: Runs before/after an aggregation operation.

## Using `function` Syntax to Access `this`

In `pre` middleware, we often use the `function` keyword instead of arrow functions. This is because the `this` keyword refers to the document being processed, and arrow functions do not have their own `this` context.

### Example:

```javascript
schema.pre("save", function (next) {
  console.log("Saving document:", this);
  next();
});
```

If we use an arrow function, `this` will be `undefined`:

```javascript
schema.pre("save", (next) => {
  console.log(this); // `this` is undefined
  next();
});
```

### **`this.set(path, value)`**

Manually sets a new value for a field before saving.

#### **How it works:**

- This allows overriding a field value dynamically before saving.
- It ensures Mongoose tracks the field as modified explicitly.
- Useful in query middleware where `this` is the query object instead of the document.

#### **Example:**

```javascript
userSchema.pre("save", function (next) {
  this.set("lastUpdated", new Date());
  next();
});
```

#### **Direct Assignment vs. `.set()`**

```javascript
// Works in most cases
userSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

// Ensures Mongoose marks it as modified
userSchema.pre("save", function (next) {
  this.set("lastUpdated", new Date());
  next();
});
```

## Best Practices: When to Use `this.set()` vs. Direct Assignment

### **Use `this.set(path, value)` When:**
✔ Working with **query middleware** (`findOneAndUpdate`, `updateOne`, etc.), where `this` refers to the query object, not the document.
✔ Ensuring Mongoose explicitly tracks a field as modified.
✔ Modifying data in middleware that does not automatically track changes.

#### **Example:**
```javascript
userSchema.pre('findOneAndUpdate', function(next) {
    this.set('lastUpdated', new Date()); // Ensures Mongoose marks it as modified
    next();
});
```

### **Use Direct Assignment (`this.field = value`) When:**
✔ Working with **document middleware** (`pre('save')`, `pre('validate')`), where `this` refers to the actual document.
✔ Modifying simple fields inside `pre('save')` or `pre('validate')` hooks.

#### **Example:**
```javascript
userSchema.pre('save', function(next) {
    this.lastUpdated = new Date(); // Works fine
    next();
});
```

### `this` in `post` Middleware

In `post` middleware, `this` **does not refer to the document**. Instead:

- **For `post('save')` and similar document middleware**: The first argument of the callback is the document that was processed.
- **For `post('findOneAndUpdate')`, `post('findOneAndDelete')`, etc.**: The first argument is the modified or deleted document.
- **For query middleware (`post('find')`, etc.)**: The first argument is the array of retrieved documents.

#### Example:

```javascript
userSchema.post("save", function (doc) {
  console.log(doc); // `doc` is the saved document
  console.log(this); // `this` does NOT refer to the document here!
});
```

## Example Use Cases

### 1. Deleting Related Documents (Cascade Delete)

When deleting a user, we can also delete all related posts.

```javascript
const UserSchema = new mongoose.Schema({
  name: String,
});

const PostSchema = new mongoose.Schema({
  title: String,
  userId: mongoose.Schema.Types.ObjectId,
});

UserSchema.pre("remove", async function (next) {
  await Post.deleteMany({ userId: this._id });
  next();
});
```

### 2. Hashing Passwords Before Saving

Automatically hash the password before saving a new user or updating it.

```javascript
const bcrypt = require("bcrypt");

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```

### 3. Logging Updates

Log whenever a user updates their information.

```javascript
UserSchema.post("findOneAndUpdate", function (doc) {
  console.log(`User ${doc._id} was updated`);
});
```

Mongoose middlewares provide powerful lifecycle hooks to manage and manipulate data before or after database operations. They ensure data consistency and automate tasks like hashing passwords, deleting related records, and logging changes.
