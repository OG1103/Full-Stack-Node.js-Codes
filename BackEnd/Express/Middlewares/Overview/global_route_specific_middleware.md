
# Global and Route-Specific Middlewares in Express

Middleware in Express can be broadly categorized into **global middleware** and **route-specific middleware**. Understanding the difference between them and when they execute in relation to controller functions is essential for building scalable and well-structured applications.

---

## 1. Global Middleware

### Definition
Global middleware is applied to **all routes** in the application. It is typically defined using `app.use()` without specifying a path, meaning it runs for every incoming request, regardless of the route.

### Example
```javascript
const express = require("express");
const app = express();

// Global middleware to log requests
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
  next(); // Pass control to the next middleware or route handler
});

app.get("/home", (req, res) => {
  res.send("Welcome to the Home Page");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

In this example, the global middleware logs the request method and URL for **all incoming requests**, regardless of the route.

---

## 2. Route-Specific Middleware

### Definition
Route-specific middleware is applied only to **specific routes** by passing the middleware function as an argument in the route definition.

### Example
```javascript
const express = require("express");
const app = express();

// Route-specific middleware for authentication
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

In this example, the `checkAuth` middleware is applied **only** to the `/private` route, ensuring that only authorized requests are allowed.

---

## 3. Execution Order: Before and After Controller

### When Middleware Executes **Before** the Controller Function

Middleware functions defined **before** the route handlers will always execute **before** the controller function. This is the most common use case, as middleware is typically used to:

- Parse request bodies (e.g., `express.json()`).
- Authenticate users (e.g., `checkAuth`).
- Log requests (e.g., `morgan`).

#### Example
```javascript
// Middleware 1
app.use((req, res, next) => {
  console.log("Middleware 1 executed");
  next();
});

// Middleware 2
app.use((req, res, next) => {
  console.log("Middleware 2 executed");
  next();
});

// Route handler
app.get("/home", (req, res) => {
  console.log("Controller executed");
  res.send("Response from controller");
});
```

Output:
```
Middleware 1 executed
Middleware 2 executed
Controller executed
```

### When Middleware Executes **After** the Controller Function

Middleware can execute **after** the controller function if it is defined **after** the routes. This is typically done for:

- Error handling.
- Post-processing, such as logging responses or cleaning up resources.

#### Example Global 
```javascript
// Route handler (controller)
app.get("/home", (req, res, next) => {
  console.log("Controller executed");
  res.send("Response from controller");
  next(); // Pass control to the next middleware
});

// Middleware 1 (post-processing middleware)
app.use((req, res, next) => {
  console.log("Middleware 1 executed after controller");
  next();
});

// Middleware 2 (post-processing middleware)
app.use((req, res, next) => {
  console.log("Middleware 2 executed after controller");
  next();
});

// Middleware 3 (post-processing middleware)
app.use((req, res, next) => {
  console.log("Middleware 3 executed after controller");
  next();
});
```
Output:
```
Controller executed
Middleware 1 executed after controller
Middleware 2 executed after controller
Middleware 3 executed after controller
```
In this example, the middleware runs **after** the controller, but only if `next()` is called or if the request-response cycle has not been ended.

### Example Route-Specific
```javascript
router.get("/", middleware1, controller, middleware2);

```
1. middleware1 runs first.
2. controller runs second.
3. middleware2 runs after the controller function, but only if next() is called in the controller.

---

## 4. Error-Handling Middleware

Error-handling middleware always executes **after** the controller function if an error is passed using `next(err)`.

### Example
```javascript
app.get("/home", (req, res, next) => {
  const error = new Error("Something went wrong");
  next(error); // Pass the error to the error-handling middleware
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).send("Internal Server Error");
});
```

In this example, the error-handling middleware is executed **after** the controller function because an error was passed using `next(err)`.

---

## 5. Summary: Differences Between Global and Route-Specific Middleware

| **Aspect**                   | **Global Middleware**                           | **Route-Specific Middleware**                     |
|------------------------------|-------------------------------------------------|--------------------------------------------------|
| **Application Scope**         | Applies to all routes                          | Applies only to specified routes                 |
| **Definition**                | `app.use(middleware)`                          | `app.METHOD(path, middleware)`                   |
| **Execution Before Controller** | Always executes before controller if defined before routes | Executes before controller only for specified routes |
| **Execution After Controller**  | Can execute after controller if defined after routes | Not applicable                                   |
| **Common Use Cases**          | Logging, request parsing, error handling       | Authentication, validation                       |

---

## 6. Best Practices

1. **Global Middleware for Common Tasks**:
   Use global middleware for tasks that need to be applied to all routes, such as logging, parsing request bodies, or setting headers.

2. **Route-Specific Middleware for Selective Tasks**:
   Use route-specific middleware for tasks that apply only to certain routes, such as authentication or validation.

3. **Order Matters**:
   Always define middleware in the correct order. Middleware defined before routes will execute before the controller, while middleware defined after routes will execute after the controller.

4. **Error Handling**:
   Always define error-handling middleware after all other middleware and routes to ensure it catches errors correctly.

---

## References

- [Express.js Documentation](https://expressjs.com/en/guide/using-middleware.html)
