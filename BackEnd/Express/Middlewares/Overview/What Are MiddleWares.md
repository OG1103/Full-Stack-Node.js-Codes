# Understanding Middleware in Node.js

## Introduction

Middleware in **Node.js** refers to functions that have access to the **request object (`req`)**, the **response object (`res`)**, and the **next middleware function** in the application’s request-response cycle.

In the context of backend development, middleware functions are used to:

- Execute code.
- Modify request and response objects.
- End the request-response cycle.
- Call the next middleware function in the stack.

---

## Key Characteristics of Middleware

- Middleware functions can perform various tasks such as logging, authentication, request parsing, and error handling.
- They are executed **in sequence**, meaning each middleware function decides whether to:
  - Pass control to the next middleware using `next()`.
  - Send a response and end the request-response cycle.

---

## Common Types of Middleware

### 1. Application-Level Middleware

- Defined and used directly in the application using `app.use()` or `app.METHOD()`.
- Example:

  ```javascript
  const express = require("express");
  const app = express();

  app.use((req, res, next) => {
    console.log("Request received at:", new Date());
    next();
  });

  app.get("/", (req, res) => {
    res.send("Hello, world!");
  });
  ```

### 2. Router-Level Middleware

- Bound to specific routes using `express.Router()`.
- Example:

  ```javascript
  const express = require("express");
  const router = express.Router();

  router.use((req, res, next) => {
    console.log("Router-level middleware executed");
    next();
  });

  router.get("/items", (req, res) => {
    res.send("List of items");
  });

  app.use("/api", router);
  ```

### 3. Error-Handling Middleware

- Defined with **four parameters** (`err, req, res, next`) to handle errors.
- Example:
  ```javascript
  app.use((err, req, res, next) => {
    console.error("Error occurred:", err.message);
    res.status(500).send("Internal Server Error");
  });
  ```

### 4. Built-In Middleware

- Provided by **Express**, including:
  - `express.json()`: Parses incoming requests with JSON payloads.
  - `express.static()`: Serves static files.
- Example:
  ```javascript
  app.use(express.json());
  app.use(express.static("public"));
  ```

### 5. Third-Party Middleware

- Provided by external libraries. Common examples include:
  - **`morgan`**: Logs requests.
  - **`body-parser`**: Parses incoming request bodies.
  - **`cors`**: Enables Cross-Origin Resource Sharing.
- Example:

  ```javascript
  const morgan = require("morgan");
  const cors = require("cors");

  app.use(morgan("dev"));
  app.use(cors());
  ```

---

## Example Usage

Middleware is essential for tasks such as:

- **Request Logging**: Capturing request details for debugging or analytics.
- **Parsing JSON Bodies**: Ensuring the request body is correctly parsed before handling it.
- **Error Handling**: Managing errors and sending appropriate responses.

### Example Combining Middlewares

You can combine all middlewares in a single file and pass the `app` instance to that file from `app.js`. In the middleware file, initialize them using `app.use()`. Additionally, custom middleware can be created to apply globally or to specific routes.

---

## Global vs. Route-Specific Middleware

### Global Middleware

- Global middleware is applied using `app.use()` without specifying a path, which means it runs for **all routes** in the application.
- It always executes **before the route handler (controller function)**, ensuring that every request passes through the middleware before reaching the intended route.

#### Example:

```javascript
const express = require("express");
const app = express();

// Custom global middleware
function logRequests(req, res, next) {
  console.log(`Global Middleware - Method: ${req.method}, URL: ${req.url}`);
  next(); // Pass control to the next middleware or route handler
}

// Applying global middleware
app.use(logRequests);

app.get("/home", (req, res) => {
  res.send("Welcome to the Home Page");
});

app.get("/dashboard", (req, res) => {
  res.send("Dashboard Page");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

In this example, `logRequests` will run **before** any route handler (`/home`, `/dashboard`, etc.). It logs the request method and URL for every incoming request.

### Route-Specific Middleware

- Route-specific middleware is applied only to particular routes by passing the middleware function as an argument in the route definition.
- This allows you to selectively apply middleware for specific endpoints.

#### Example:

```javascript
const express = require("express");
const app = express();

// Custom route-specific middleware
function checkAuth(req, res, next) {
  const authorized = req.headers.authorization === "Bearer token123";
  if (!authorized) {
    return res.status(403).send("Forbidden");
  }
  next(); // Pass control to the next middleware or route handler
}

app.get("/public", (req, res) => {
  res.send("Public Page");
});

app.get("/private", checkAuth, (req, res) => {
  res.send("Private Page");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

In this example:

- The `/public` route is accessible to everyone.
- The `/private` route requires authorization, and the `checkAuth` middleware ensures that only authorized requests are allowed.

---

### Combining Global and Route-Specific Middleware

You can combine both global and route-specific middleware in a single application to handle different layers of logic.

#### Example:

```javascript
const express = require("express");
const app = express();

// Global middleware
app.use((req, res, next) => {
  console.log("Global middleware executed");
  next();
});

// Route-specific middleware
function validateUser(req, res, next) {
  if (!req.query.user) {
    return res.status(400).send("User query parameter is required");
  }
  next();
}

app.get("/profile", validateUser, (req, res) => {
  res.send(`Welcome, ${req.query.user}`);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

In this example:

1. The global middleware logs a message for every request.
2. The route-specific middleware `validateUser` ensures that the `user` query parameter is present before processing the `/profile` route.

---

## Notes

- **Global middleware** runs for all routes before the controller function.
- **Route-specific middleware** is applied only to the specified routes.
- Combining both types of middleware helps in maintaining a structured and scalable application.

---

## References

- [Express.js Documentation](https://expressjs.com/en/guide/using-middleware.html)
