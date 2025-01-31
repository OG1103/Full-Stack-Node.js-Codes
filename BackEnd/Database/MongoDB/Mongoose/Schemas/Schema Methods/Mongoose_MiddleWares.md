# Mongoose Middlewares

Mongoose middlewares (also called pre and post hooks) are functions that are executed during specific lifecycle events of a Mongoose model. They are useful for handling side effects, validations, or asynchronous operations before or after an event occurs.

## Types of Mongoose Middlewares

Mongoose supports two types of middlewares:

1. **Pre Middleware**: Runs before a certain event.
2. **Post Middleware**: Runs after a certain event.

### Supported Events

Mongoose middleware can be used for various events, including:

- `validate`
- `save`
- `remove`
- `updateOne`
- `deleteOne`
- `find`
- `findOne`
- `findOneAndUpdate`
- `aggregate`

---

## 1. Pre Middleware

Pre middlewares are executed before a particular event. They can be asynchronous, and you can control when they complete by calling the `next` function.

### Example: Pre-save Middleware

This example hashes a user's password before saving it to the database.

```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// Pre-save middleware
// use function defintion so this keyword belongs to our documents
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);
```

### Explanation

- `this.isModified('password')` checks if the password field has been modified.
- `bcrypt.hash()` hashes the password with a salt of 10 rounds.
- `next()` signals that the middleware has completed its task.

---

## 2. Post Middleware

Post middlewares are executed after a particular event has completed. They are useful for logging, cleanup, or triggering asynchronous tasks.

### Example: Post-save Middleware

This example logs a message after a new user is saved to the database.

```javascript
userSchema.post("save", function (doc, next) {
  console.log(`New user ${doc.username} was saved.`);
  next();
});
```

### Explanation

- The `doc` parameter contains the document that was saved.
- `next()` is called to signal completion of the middleware.

---

## 3. Pre-find Middleware

Pre-find middleware runs before executing a `find` query. It is often used to apply default filters or modify the query.

### Example: Pre-find Middleware for Soft Deletion

This example excludes documents that have been soft deleted (i.e., marked as deleted without being removed from the database).

```javascript
userSchema.pre("find", function (next) {
  this.where({ deleted: { $ne: true } });
  next();
});
```

### Explanation

- `this.where()` modifies the query to exclude documents where `deleted` is `true`.
- This approach is useful for implementing soft delete functionality.

---

## 4. Pre-aggregate Middleware

Pre-aggregate middleware runs before executing an `aggregate` query. It is useful for adding filters or modifying aggregation pipelines.

### Example: Adding a Global Filter

This example adds a filter to exclude deleted documents from aggregation queries.

```javascript
userSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { deleted: { $ne: true } } });
  next();
});
```

### Explanation

- `this.pipeline().unshift()` adds a `$match` stage at the beginning of the aggregation pipeline.
- This ensures that deleted documents are excluded from all aggregation results.

---

## 5. Error Handling Middleware

Error handling middleware is used to handle errors during specific operations, such as saving or updating documents.

### Example: Duplicate Username Error Handling

This example handles errors related to duplicate usernames.

```javascript
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("Username already exists."));
  } else {
    next(error);
  }
});
```

### Explanation

- The error object is inspected for a duplicate key error (`code 11000`).
- A custom error message is passed to the next middleware or error handler.

---

## 6. Post-remove Middleware

Post-remove middleware runs after a document is removed. It can be used to clean up related data.

### Example: Cleaning Up Related Data

This example removes all posts associated with a user after the user is deleted.

```javascript
userSchema.post("remove", async function (doc, next) {
  await Post.deleteMany({ userId: doc._id });
  next();
});
```

### Explanation

- `Post.deleteMany()` deletes all posts where `userId` matches the deleted user's ID.

---

## Best Practices

- **Always call `next()`**: Make sure to call `next()` to avoid hanging operations.
- **Use asynchronous functions carefully**: When using `async` functions, ensure proper error handling.
- **Avoid modifying the query in post middleware**: Post middlewares are intended for side effects, not for altering queries.
- **Test thoroughly**: Since middlewares affect model behavior, test them to ensure they work as expected.

---

## Conclusion

Mongoose middlewares are a powerful feature that allows you to hook into the lifecycle of documents and queries. By understanding and using them properly, you can handle various tasks such as data validation, logging, and cleanup in an efficient and organized manner.

---

### References

- [Mongoose Middleware Documentation](https://mongoosejs.com/docs/middleware.html)
