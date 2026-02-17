# Error Handling in JavaScript

Error handling is a critical aspect of writing robust, production-ready JavaScript. Rather than letting applications crash unexpectedly, proper error handling allows developers to anticipate failures, respond gracefully, and provide meaningful feedback. This guide covers everything from the built-in `Error` object to custom error classes and best practices for both synchronous and asynchronous code.

---

## Table of Contents

1. [The Error Object](#1-the-error-object)
2. [Built-in Error Types](#2-built-in-error-types)
3. [try...catch](#3-trycatch)
4. [The finally Block](#4-the-finally-block)
5. [The throw Statement](#5-the-throw-statement)
6. [Custom Error Classes](#6-custom-error-classes)
7. [Catching Specific Error Types with instanceof](#7-catching-specific-error-types-with-instanceof)
8. [Re-throwing Errors](#8-re-throwing-errors)
9. [Error Handling in Async Code](#9-error-handling-in-async-code)
10. [Error Handling Best Practices](#10-error-handling-best-practices)

---

## 1. The Error Object

When a runtime error occurs in JavaScript, an `Error` object is created and thrown. You can also manually construct `Error` objects. Every `Error` instance carries three key properties that help with debugging.

### Key Properties

| Property  | Type     | Description                                                                                      |
| --------- | -------- | ------------------------------------------------------------------------------------------------ |
| `name`    | `string` | The name/type of the error (e.g., `"TypeError"`, `"RangeError"`). Defaults to `"Error"`.         |
| `message` | `string` | A human-readable description of what went wrong.                                                 |
| `stack`   | `string` | A stack trace showing the call chain at the point the error was created. Non-standard but widely supported. |

### Creating an Error Object

```js
const error = new Error("Something went wrong");

console.log(error.name);    // "Error"
console.log(error.message); // "Something went wrong"
console.log(error.stack);
// Error: Something went wrong
//     at Object.<anonymous> (C:\app\index.js:1:15)
//     at Module._compile (node:internal/modules/cjs/loader:1234:14)
//     ...
```

> **Note:** The `stack` property is not part of the ECMAScript specification, but it is implemented by all major JavaScript engines (V8, SpiderMonkey, JavaScriptCore). Its exact format varies between engines.

### The Stack Trace

The stack trace is invaluable for debugging. It shows the exact file, line number, and call chain that led to the error.

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  throw new Error("Deep error");
}

try {
  a();
} catch (err) {
  console.log(err.stack);
}
// Error: Deep error
//     at c (file.js:10:9)
//     at b (file.js:6:3)
//     at a (file.js:2:3)
//     at Object.<anonymous> (file.js:13:3)
```

---

## 2. Built-in Error Types

JavaScript provides several built-in error constructors. Each one inherits from `Error` and sets the `name` property automatically.

| Error Type       | When It Occurs                                                                 | Example Trigger                              |
| ---------------- | ------------------------------------------------------------------------------ | -------------------------------------------- |
| `Error`          | Generic error; the base class for all other error types.                       | `throw new Error("generic")`                 |
| `TypeError`      | A value is not of the expected type, or an operation is performed on an incompatible type. | `null.toString()`                            |
| `ReferenceError` | A variable that does not exist or has not been declared is referenced.          | `console.log(undeclaredVar)`                 |
| `SyntaxError`    | The code contains a syntax violation (usually caught at parse time, not runtime). | `eval("var a = ;")`                          |
| `RangeError`     | A numeric value is outside the allowable range.                                | `new Array(-1)`                              |
| `EvalError`      | An error related to the global `eval()` function. Rarely thrown in modern JS.  | Legacy; kept for backward compatibility.     |
| `URIError`       | A global URI handling function (e.g., `decodeURIComponent`) was used incorrectly. | `decodeURIComponent("%")`                    |

### Examples of Each Built-in Error Type

```js
// TypeError - operating on wrong type
try {
  const num = 42;
  num.toUpperCase(); // numbers don't have toUpperCase
} catch (err) {
  console.log(err.name);    // "TypeError"
  console.log(err.message); // "num.toUpperCase is not a function"
}

// ReferenceError - accessing undeclared variable
try {
  console.log(nonExistentVariable);
} catch (err) {
  console.log(err.name);    // "ReferenceError"
  console.log(err.message); // "nonExistentVariable is not defined"
}

// SyntaxError - invalid syntax at runtime (via eval)
try {
  eval("if(");
} catch (err) {
  console.log(err.name);    // "SyntaxError"
  console.log(err.message); // "Unexpected end of input"
}

// RangeError - value out of range
try {
  const arr = new Array(-5);
} catch (err) {
  console.log(err.name);    // "RangeError"
  console.log(err.message); // "Invalid array length"
}

// URIError - malformed URI
try {
  decodeURIComponent("%");
} catch (err) {
  console.log(err.name);    // "URIError"
  console.log(err.message); // "URI malformed"
}
```

> **Important:** `SyntaxError` is typically thrown at parse time before any code executes. The only way to catch it at runtime is when syntax errors occur inside `eval()` or `new Function()`.

---

## 3. try...catch

The `try...catch` statement lets you test a block of code for errors and handle them gracefully instead of crashing the program.

### Basic Syntax

```js
try {
  // Code that might throw an error
} catch (error) {
  // Code that runs if an error is thrown
}
```

### How It Works

1. The JavaScript engine executes the code inside the `try` block.
2. If no error occurs, the `catch` block is skipped entirely.
3. If any statement inside `try` throws an error, execution immediately jumps to the `catch` block.
4. The thrown error object is passed to the `catch` block as a parameter.

### The Error Parameter

The `catch` block receives the error object, giving you access to `name`, `message`, and `stack`.

```js
try {
  const data = JSON.parse("{ invalid json }");
} catch (error) {
  console.log(error.name);    // "SyntaxError"
  console.log(error.message); // "Expected property name or '}' ..."
  console.log(error.stack);   // Full stack trace
}

console.log("Program continues running after the error is caught.");
```

### Optional Catch Binding (ES2019)

Since ES2019, you can omit the error parameter if you don't need it:

```js
try {
  JSON.parse("bad json");
} catch {
  console.log("Parsing failed, but we don't need the error details.");
}
```

### Scope of try...catch

`try...catch` only catches **runtime errors** (exceptions). It cannot catch syntax errors in the same script (since the script fails to parse entirely).

```js
// This SyntaxError is NOT caught — the script won't even run:
// try {
//   let x = ;  // SyntaxError at parse time
// } catch (e) {
//   console.log(e);
// }

// This runtime error IS caught:
try {
  undefined.property; // TypeError at runtime
} catch (e) {
  console.log("Caught:", e.message); // "Caught: Cannot read properties of undefined ..."
}
```

### try...catch Is Synchronous

`try...catch` only catches errors that occur **synchronously** within the `try` block. It cannot catch errors from asynchronous callbacks:

```js
// This does NOT work — the error occurs after try...catch has finished
try {
  setTimeout(() => {
    throw new Error("Async error");
  }, 1000);
} catch (err) {
  // This never executes
  console.log("Caught:", err.message);
}

// The error will be an uncaught exception
```

---

## 4. The finally Block

The `finally` block executes **no matter what** -- whether the `try` block succeeds, the `catch` block runs, or even if a `return` statement is encountered.

### Syntax

```js
try {
  // Code that might throw
} catch (error) {
  // Handle the error
} finally {
  // Always executes — cleanup code goes here
}
```

### Key Behavior

- `finally` runs after `try` if no error occurs.
- `finally` runs after `catch` if an error is caught.
- `finally` runs even if `try` or `catch` contain `return`, `break`, or `continue` statements.
- `finally` runs even if an uncaught error is thrown (before the error propagates).

### Use Cases: Resource Cleanup

The primary use case for `finally` is cleanup operations -- closing file handles, database connections, clearing timers, or hiding loading spinners.

```js
function readConfigFile(path) {
  let fileHandle = null;

  try {
    fileHandle = openFile(path);         // might throw if file not found
    const config = parseJSON(fileHandle); // might throw if invalid JSON
    return config;
  } catch (error) {
    console.error("Failed to read config:", error.message);
    return getDefaultConfig();
  } finally {
    // Always close the file handle, even if we returned early
    if (fileHandle) {
      fileHandle.close();
      console.log("File handle closed.");
    }
  }
}
```

### finally with return Statements

Be careful: a `return` in `finally` **overrides** any `return` in `try` or `catch`.

```js
function example() {
  try {
    return "from try";
  } finally {
    return "from finally"; // This overrides the try return!
  }
}

console.log(example()); // "from finally"
```

> **Warning:** Avoid placing `return` statements in `finally` blocks. It overrides any previous returns or thrown errors and makes code difficult to reason about.

### try...finally Without catch

You can use `try...finally` without a `catch` block. The error propagates normally, but cleanup still runs:

```js
function riskyOperation() {
  const resource = acquireResource();
  try {
    processResource(resource); // might throw
  } finally {
    resource.release(); // always runs
    // If processResource threw, the error continues propagating after this
  }
}
```

---

## 5. The throw Statement

The `throw` statement lets you create custom errors. When `throw` executes, the current function stops and control passes to the nearest `catch` block up the call stack.

### Syntax

```js
throw expression;
```

### Throwing Error Objects (Recommended)

```js
throw new Error("Something went wrong");
throw new TypeError("Expected a string, got number");
throw new RangeError("Value must be between 1 and 100");
```

### Throwing Other Values (Not Recommended)

JavaScript allows you to throw any value, but this is considered bad practice because non-Error values lack `name`, `message`, and `stack` properties.

```js
// Technically valid but discouraged
throw "An error occurred";         // string
throw 404;                         // number
throw { code: 500, msg: "fail" };  // object
throw true;                        // boolean
```

### Why Always Throw Error Objects

```js
// Bad: Throwing a string
try {
  throw "something broke";
} catch (err) {
  console.log(err.stack);   // undefined — no stack trace!
  console.log(err.message); // undefined — no structured info!
  console.log(err);         // "something broke" — just a string
}

// Good: Throwing an Error object
try {
  throw new Error("something broke");
} catch (err) {
  console.log(err.stack);   // Full stack trace with file and line info
  console.log(err.message); // "something broke"
  console.log(err.name);    // "Error"
}
```

### Practical Example: Input Validation

```js
function divide(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError("Both arguments must be numbers");
  }
  if (b === 0) {
    throw new RangeError("Cannot divide by zero");
  }
  return a / b;
}

try {
  console.log(divide(10, 2));   // 5
  console.log(divide(10, 0));   // throws RangeError
} catch (err) {
  console.log(`${err.name}: ${err.message}`);
  // "RangeError: Cannot divide by zero"
}
```

---

## 6. Custom Error Classes

For large applications, built-in error types are often insufficient. Custom error classes let you attach additional context (like HTTP status codes) and distinguish between different error categories.

### Extending the Error Class

```js
class ValidationError extends Error {
  constructor(message) {
    super(message);            // Call parent constructor with message
    this.name = "ValidationError"; // Override the name property
  }
}

const err = new ValidationError("Email is required");
console.log(err.name);       // "ValidationError"
console.log(err.message);    // "Email is required"
console.log(err.stack);      // Full stack trace
console.log(err instanceof ValidationError); // true
console.log(err instanceof Error);           // true
```

### Adding Custom Properties (e.g., statusCode)

```js
class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

class NotFoundError extends HttpError {
  constructor(resource) {
    super(404, `${resource} not found`);
    this.name = "NotFoundError";
  }
}

class UnauthorizedError extends HttpError {
  constructor(message = "Authentication required") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

class ForbiddenError extends HttpError {
  constructor(message = "Access denied") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

class BadRequestError extends HttpError {
  constructor(message = "Invalid request") {
    super(400, message);
    this.name = "BadRequestError";
    this.errors = [];
  }

  addError(field, message) {
    this.errors.push({ field, message });
    return this;
  }
}
```

### Using Custom Errors in Practice

```js
function findUser(id) {
  const user = database.get(id);
  if (!user) {
    throw new NotFoundError("User");
  }
  return user;
}

function authenticate(token) {
  if (!token) {
    throw new UnauthorizedError();
  }
  const user = verifyToken(token);
  if (!user) {
    throw new UnauthorizedError("Invalid or expired token");
  }
  return user;
}

function validateRegistration(data) {
  const error = new BadRequestError("Validation failed");

  if (!data.email) error.addError("email", "Email is required");
  if (!data.password) error.addError("password", "Password is required");
  if (data.password && data.password.length < 8) {
    error.addError("password", "Password must be at least 8 characters");
  }

  if (error.errors.length > 0) {
    throw error;
  }
}
```

### A Complete Custom Error Hierarchy

```js
// Base application error
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.name = this.constructor.name; // Automatically uses the class name
    this.statusCode = statusCode;
    this.isOperational = isOperational; // Distinguish operational vs programmer errors
    Error.captureStackTrace(this, this.constructor); // Clean stack trace (V8 only)
  }
}

// Specific error types
class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = "Validation failed", errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(message, 403);
  }
}

class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409);
  }
}

class InternalError extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500, false); // Not operational — indicates a bug
  }
}
```

---

## 7. Catching Specific Error Types with instanceof

When different error types require different handling, use `instanceof` checks inside the `catch` block.

### Basic Pattern

```js
try {
  // Code that might throw various errors
  const result = performOperation();
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors — send 400 response
    console.log("Validation failed:", error.errors);
  } else if (error instanceof NotFoundError) {
    // Handle not found — send 404 response
    console.log("Not found:", error.message);
  } else if (error instanceof AuthenticationError) {
    // Handle auth errors — send 401 response
    console.log("Auth failed:", error.message);
  } else {
    // Unknown error — log and send 500
    console.error("Unexpected error:", error);
    throw error; // Re-throw unknown errors
  }
}
```

### Express.js Error Handling Middleware

```js
// Global error handler middleware
function errorHandler(err, req, res, next) {
  // Log all errors
  console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }

  if (err instanceof AuthenticationError) {
    return res.status(401).json({
      status: "fail",
      message: err.message,
    });
  }

  if (err instanceof AuthorizationError) {
    return res.status(403).json({
      status: "fail",
      message: err.message,
    });
  }

  // For AppError subclasses not explicitly handled above
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.statusCode < 500 ? "fail" : "error",
      message: err.message,
    });
  }

  // Unknown/programmer errors — don't leak details to the client
  console.error("UNHANDLED ERROR:", err.stack);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
}

// Usage: app.use(errorHandler);
```

### Checking Built-in Error Types

```js
try {
  someFunction();
} catch (error) {
  if (error instanceof TypeError) {
    console.log("Type error — check your data types");
  } else if (error instanceof RangeError) {
    console.log("Range error — value out of bounds");
  } else if (error instanceof ReferenceError) {
    console.log("Reference error — variable not declared");
  } else {
    console.log("Other error:", error.message);
  }
}
```

---

## 8. Re-throwing Errors

Sometimes a `catch` block should only handle certain errors and let others propagate up the call stack. This pattern is called **re-throwing**.

### Basic Re-throw

```js
function processData(data) {
  try {
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Handle JSON parsing errors specifically
      console.log("Invalid JSON, returning default");
      return { default: true };
    }
    // Re-throw any other error — we don't know how to handle it
    throw error;
  }
}
```

### Re-throwing with Additional Context

You can wrap the original error with more context before re-throwing:

```js
function loadUserProfile(userId) {
  try {
    const raw = readFromDatabase(userId);
    return JSON.parse(raw);
  } catch (error) {
    // Wrap with context but preserve the original error
    const wrappedError = new Error(`Failed to load profile for user ${userId}: ${error.message}`);
    wrappedError.cause = error; // ES2022 error cause
    throw wrappedError;
  }
}
```

### ES2022 Error Cause

ES2022 introduced a standardized `cause` property for errors, enabling proper error chaining:

```js
try {
  connectToDatabase();
} catch (error) {
  throw new Error("Service initialization failed", { cause: error });
}

// Later, when catching:
try {
  initializeService();
} catch (error) {
  console.log(error.message);       // "Service initialization failed"
  console.log(error.cause);         // Original database connection error
  console.log(error.cause.message); // "ECONNREFUSED 127.0.0.1:5432"
}
```

---

## 9. Error Handling in Async Code

Asynchronous code requires different error handling strategies depending on the pattern used.

### With Promises (.then/.catch)

```js
fetchUser(userId)
  .then((user) => {
    return fetchOrders(user.id);
  })
  .then((orders) => {
    console.log("Orders:", orders);
  })
  .catch((error) => {
    // Catches errors from any .then() in the chain
    console.error("Error:", error.message);
  });
```

### With async/await and try...catch

`try...catch` works naturally with `async/await`, making async error handling look synchronous:

```js
async function getUserOrders(userId) {
  try {
    const user = await fetchUser(userId);
    const orders = await fetchOrders(user.id);
    const enrichedOrders = await enrichOrderData(orders);
    return enrichedOrders;
  } catch (error) {
    // Catches rejected promises from any await
    if (error instanceof NotFoundError) {
      console.log("User or orders not found");
      return [];
    }
    throw error; // Re-throw unexpected errors
  }
}
```

### Handling Errors in Parallel Operations

```js
async function fetchDashboardData(userId) {
  try {
    const [user, orders, notifications] = await Promise.all([
      fetchUser(userId),
      fetchOrders(userId),
      fetchNotifications(userId),
    ]);

    return { user, orders, notifications };
  } catch (error) {
    // If ANY promise rejects, we land here
    console.error("Dashboard data fetch failed:", error.message);
    throw error;
  }
}
```

### The Unhandled Promise Rejection Problem

If you neither `await` nor `.catch()` a rejected promise, the rejection goes unhandled:

```js
// BAD: Unhandled promise rejection
async function badExample() {
  fetchData(); // No await, no .catch() — rejection is lost!
}

// GOOD: Always handle promise rejections
async function goodExample() {
  try {
    await fetchData();
  } catch (error) {
    console.error("Fetch failed:", error.message);
  }
}

// ALSO GOOD: Using .catch()
function alsoGood() {
  fetchData().catch((error) => {
    console.error("Fetch failed:", error.message);
  });
}
```

### Global Unhandled Rejection Handlers

As a safety net, always register global handlers:

```js
// Node.js
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Application-specific logging, cleanup, or shutdown
});

// Browser
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled Rejection:", event.reason);
  event.preventDefault(); // Prevents default browser logging
});
```

---

## 10. Error Handling Best Practices

### 1. Always Throw Error Objects

```js
// Bad
throw "Something went wrong";
throw 404;

// Good
throw new Error("Something went wrong");
throw new NotFoundError("User");
```

### 2. Use Specific Error Types

```js
// Bad — generic error for everything
throw new Error("Failed");

// Good — specific errors carry more meaning
throw new ValidationError("Email format is invalid");
throw new NotFoundError("Product");
throw new AuthenticationError("Token expired");
```

### 3. Don't Swallow Errors Silently

```js
// Bad — error is silently swallowed
try {
  riskyOperation();
} catch (error) {
  // empty catch block!
}

// Good — at minimum, log the error
try {
  riskyOperation();
} catch (error) {
  console.error("Operation failed:", error);
  // Decide: return a default, re-throw, or notify the user
}
```

### 4. Handle Errors at the Appropriate Level

Don't catch errors too early. Let them propagate to a level where you have enough context to handle them properly.

```js
// Low-level function — let errors propagate
function queryDatabase(sql) {
  return db.execute(sql); // Throws on failure — don't catch here
}

// Mid-level function — catch and add context
async function getUser(id) {
  try {
    return await queryDatabase(`SELECT * FROM users WHERE id = ${id}`);
  } catch (error) {
    throw new NotFoundError("User"); // Transform to domain error
  }
}

// High-level handler — respond to the client
async function handleGetUser(req, res, next) {
  try {
    const user = await getUser(req.params.id);
    res.json(user);
  } catch (error) {
    next(error); // Pass to Express error middleware
  }
}
```

### 5. Distinguish Operational Errors from Programmer Errors

| Operational Errors                    | Programmer Errors                     |
| ------------------------------------- | ------------------------------------- |
| Failed to connect to database         | Calling a method on `undefined`       |
| User input validation failed          | Passing the wrong number of arguments |
| API request timed out                 | Reading property of `null`            |
| File not found                        | Off-by-one errors in loops            |
| **Handle gracefully at runtime**      | **Fix the bug in the code**           |

```js
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}

// In your global error handler:
function handleError(error) {
  if (error.isOperational) {
    // Operational: log and respond gracefully
    logger.warn(error.message);
    return sendErrorResponse(error);
  }

  // Programmer error: log, alert, and consider restarting
  logger.error("PROGRAMMER ERROR:", error);
  alertOpsTeam(error);
  process.exit(1); // Restart via process manager (PM2, etc.)
}
```

### 6. Use finally for Cleanup

```js
async function processFile(filePath) {
  const handle = await fs.open(filePath, "r");
  try {
    const content = await handle.readFile("utf-8");
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to process ${filePath}: ${error.message}`);
  } finally {
    await handle.close(); // Always close the file handle
  }
}
```

### 7. Validate Early, Fail Fast

```js
function createUser(userData) {
  // Validate at the entry point — fail fast
  if (!userData) throw new BadRequestError("User data is required");
  if (!userData.email) throw new BadRequestError("Email is required");
  if (!isValidEmail(userData.email)) throw new BadRequestError("Invalid email format");
  if (!userData.password) throw new BadRequestError("Password is required");
  if (userData.password.length < 8) throw new BadRequestError("Password too short");

  // If we reach here, we know the data is valid
  return database.insert("users", userData);
}
```

### 8. Centralize Error Handling

```js
// Express.js centralized error handler
const app = express();

// Routes
app.get("/users/:id", asyncHandler(getUser));
app.post("/users", asyncHandler(createUser));

// Single error handler for the entire app
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal server error";

  // Log
  if (statusCode >= 500) {
    logger.error(err.stack);
  } else {
    logger.warn(`${statusCode} - ${err.message} - ${req.originalUrl}`);
  }

  // Respond
  res.status(statusCode).json({
    status: statusCode < 500 ? "fail" : "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Async handler wrapper to avoid try/catch in every route
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
```

---

## Summary

| Concept             | Key Takeaway                                                                  |
| ------------------- | ----------------------------------------------------------------------------- |
| `Error` object      | Provides `name`, `message`, and `stack` for debugging.                        |
| Built-in types      | Use `TypeError`, `RangeError`, etc. for semantic meaning.                     |
| `try...catch`       | Catches synchronous runtime errors. Does not catch async callback errors.     |
| `finally`           | Always executes. Use for cleanup (closing connections, releasing resources).   |
| `throw`             | Always throw `Error` objects (never strings or numbers).                      |
| Custom errors       | Extend `Error` to add `statusCode`, `isOperational`, and domain-specific context. |
| `instanceof`        | Differentiate error types in `catch` blocks for targeted handling.            |
| Re-throwing         | Re-throw errors you cannot handle. Use `{ cause }` for error chaining.       |
| Async error handling| Use `try/catch` with `async/await` or `.catch()` with promises.              |
| Best practices      | Fail fast, handle at the right level, centralize, never swallow errors.       |
