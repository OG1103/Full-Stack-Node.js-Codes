# Instance Methods in Mongoose

Instance methods in Mongoose are custom methods defined on a Mongoose document. They allow you to add functionality directly to document instances created from a Mongoose model.

---

## Defining Instance Methods

You can define instance methods by adding a function to the `schema.methods` object.

### Syntax

```javascript
schema.methods.methodName = function () {
  // Your custom logic
};
```

The function can access and manipulate the document using the `this` keyword, which refers to the current document instance.

---

## Example 1: Adding a Full Name Method

This example shows how to add an instance method that returns a user's full name.

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
});

// Instance method to get the full name
userSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

const User = mongoose.model("User", userSchema);

const user = new User({ firstName: "Alice", lastName: "Doe" });
console.log(user.getFullName()); // Output: Alice Doe
```

### Explanation

- `userSchema.methods.getFullName` defines a custom method `getFullName`.
- `this.firstName` and `this.lastName` refer to the properties of the current document instance.
- Calling `user.getFullName()` on the document instance returns the concatenated full name.

---

## Example 2: Updating a Document with an Instance Method

You can also create instance methods that modify the document itself.

```javascript
userSchema.methods.updateName = function (newFirstName, newLastName) {
  this.firstName = newFirstName;
  this.lastName = newLastName;
  return this.save();
};

const user = new User({ firstName: "John", lastName: "Smith" });
user.updateName("Jane", "Doe").then(() => {
  console.log("Name updated:", user.getFullName()); // Output: Name updated: Jane Doe
});
```

### Explanation

- `updateName` modifies the `firstName` and `lastName` properties of the document.
- `this.save()` saves the updated document to the database.
- The method returns a promise, allowing you to handle the result asynchronously.

---

## Example 3: Instance Method with Asynchronous Logic

You can define asynchronous instance methods using `async` functions.

```javascript
userSchema.methods.getGreeting = async function () {
  return `Hello, ${this.firstName}!`;
};

const user = new User({ firstName: "Alice" });
user.getGreeting().then((greeting) => {
  console.log(greeting); // Output: Hello, Alice!
});
```

### Explanation

- `getGreeting` is defined as an `async` method.
- The method returns a promise, which can be handled using `.then()` or `await`.

---

## Best Practices

1. **Use Instance Methods for Document-Specific Logic:**
   Instance methods are best suited for operations that involve a single document.

2. **Avoid Arrow Functions:**
   Always use regular functions (not arrow functions) when defining instance methods, as arrow functions do not have their own `this` and will not bind to the document instance correctly.

3. **Leverage Async/Await for Asynchronous Methods:**
   When dealing with asynchronous operations (e.g., database queries, external API calls), use `async`/`await` to simplify the code and handle promises cleanly.

---

## Summary

- Instance methods in Mongoose allow you to add custom behavior to document instances.
- They are defined by attaching functions to the `schema.methods` object.
- Use instance methods for logic that pertains to individual documents, such as formatting or updating document fields.

By leveraging instance methods, you can encapsulate document-specific behavior within the model, making your code more organized and reusable.

---

### References

- [Mongoose Documentation: Methods](https://mongoosejs.com/docs/guide.html#methods)
