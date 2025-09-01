Here is a `.md` file that clearly explains the `Error` object in JavaScript:

---

### 📄 `error-object-in-javascript.md`

````markdown
# Error Object in JavaScript

JavaScript provides a built-in `Error` object that is used to represent runtime errors. It serves as the foundation for all error handling in JavaScript and can be extended to create custom error types.

---

## 📌 Basic Syntax

```js
const err = new Error("Something went wrong");
````

### Properties:

* `message`: A human-readable description of the error.
* `name`: The name of the error type (default is `"Error"`).
* `stack`: A string describing the point in the code at which the error was instantiated.

---

## 🧠 Example

```js
try {
  throw new Error("File not found");
} catch (err) {
  console.log(err.message); // "File not found"
  console.log(err.name);    // "Error"
  console.log(err.stack);   // Stack trace
}
```

---

## 🔧 Custom Error Classes

You can extend the `Error` object to define your own custom error types:

```js
class CustomAPIError extends Error {
  constructor(message) {
    super(message);                // Call the Error constructor
    this.name = this.constructor.name; // Set the error name
  }
}
```

### Usage

```js
try {
  throw new CustomAPIError("Unauthorized access");
} catch (err) {
  console.log(err.message); // "Unauthorized access"
  console.log(err.name);    // "CustomAPIError"
}
```

---

## 📚 Built-in Error Types

JavaScript includes several built-in error types that inherit from `Error`:

| Error Type       | Description                           |
| ---------------- | ------------------------------------- |
| `Error`          | General error                         |
| `TypeError`      | Value is not of the expected type     |
| `ReferenceError` | Invalid reference to a variable       |
| `SyntaxError`    | Syntax mistake in the code            |
| `RangeError`     | Numeric value out of acceptable range |
| `EvalError`      | Related to the `eval()` function      |
| `URIError`       | Malformed URI handling                |

---

## 🛠 Good Practices

* Always call `super(message)` in custom error classes.
* Set a custom `name` for better stack trace readability.
* Optionally include a `statusCode` for HTTP APIs.

```js
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}
```

---

## ✅ Summary

* The `Error` object is fundamental for error handling in JavaScript.
* Custom error classes improve clarity and error management.
* Use built-in types for common errors and extend when needed.

```

```
