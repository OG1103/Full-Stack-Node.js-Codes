# Understanding the Express App Object

The **Express app object** is the core of an Express application. It represents your application and is used to define routes, middleware, and various settings.

## Key Features of the Express App Object

### Creating the App Object
You create an Express app object by calling the `express()` function:
```javascript
import express from "express";
const app = express();
```
This `app` object provides the interface to apply:
- **Routes (endpoints)**
- **Middleware functions**
- **Settings** (e.g., port, view engine)
- **Application-wide configurations**

---

## Defining Routes with `app.httpmethod()`
The app object is used to define different routes directly on your application. Routes respond to HTTP requests and handle client-server interactions.

### Example:
```javascript
app.get('/test_endpoint', middlewares, controllerFunction);
```
In this example:
- `app.get()` defines a route for handling GET requests to `/test_endpoint`.
- `middlewares` are optional middleware functions executed before the `controllerFunction`.
- `controllerFunction` handles the request and sends a response.

---

## What is `app.use()`?
The `app.use()` function is used to add **middleware** to your Express application. Middleware functions can be used to:
- Modify the request or response.
- End the request-response cycle.
- Call `next()` to pass control to the next middleware function.

When you call `app.use()`, Express will execute the middleware for every incoming request. If you specify a **path prefix**, it will only apply the middleware for requests that start with that prefix.

### Types of Middleware Usage

#### 1. Global Middleware
Middleware functions added with `app.use()` are applied **globally** to all routes:
```javascript
app.use(express.json()); // Parses JSON request bodies for all routes
```
In this example, `express.json()` is applied to all routes, meaning every incoming request will be parsed as JSON.

```javascript
app.use(express.static('./public')); // Serves static files from the 'public' directory
```
The express.static middleware serves all static files/assets such as images and so on located in the public directory (files that server does not have to change ex an image file).
All these static files should be placed in the public directory
If a request is made for /style.css, Express will look for style.css in the public directory and serve it if found. 
This is useful for serving assets like HTML, CSS, images, and client-side JavaScript without requiring a specific route handler for each file.


#### 2. Path-Specific Middleware
You can apply middleware to **specific paths**:
```javascript
app.use('/api', someMiddlewareFunction);
```
In this example, `someMiddlewareFunction` will only be executed for requests that start with `/api`.

#### 3. Using `app.use()` with Routers from Separate Files
- Express **routers** (`express.Router()`) are middleware too.
- When you define a router in a separate file and use `app.use()` to add it to your app, you’re **mounting the router as middleware**.
- The endpoints defined in the router become accessible based on how you mount it.

**Router Setup in a Separate File:**
```javascript
// userRoutes.js
const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
  res.send('User Profile');
});

module.exports = router;
```

**Mounting the Router in app.js:**
```javascript
const userRoutes = require('./userRoutes');
app.use('/users', userRoutes);
```
- In this example, the `/users` prefix is applied to all routes in `userRoutes`. To access the `/profile` endpoint, the client must use `/users/profile`.

**Without a Prefix:**
```javascript
app.use(userRoutes);
```
- Here, the routes in `userRoutes` are applied globally, meaning `/profile` will be accessible directly without any prefix.

---

## What is `app.listen()`?
The `app.listen()` method is used to **start the server** and have it listen for incoming connections on a specified port and host.

### Syntax
```javascript
app.listen(port, [hostname], [backlog], [callback]);
```

### Explanation
- **`port` (required)**: The port number that the server should listen on (e.g., 3000, 8000). This is where clients (browsers or API consumers) will send their requests.
- **`hostname` (optional)**: The IP address or domain name the server should listen to (e.g., `'localhost'`).
  - If omitted, it defaults to `'localhost'` or `'0.0.0.0'`, which listens on all available network interfaces.
  - Must be a valid IP address or a domain name that resolves to an IP address.
- **`backlog` (optional)**: The maximum length of the queue of pending connections. It’s rarely used.
- **`callback` (optional)**: A function that runs once the server starts successfully. It’s often used to log a message to the console indicating that the server is running.

### Example:
```javascript
const express = require('express');
const app = express();

app.listen(3000, 'localhost', () => {
  console.log('Server running on http://localhost:3000');
});
```
In this example:
- The server listens on port `3000` and hostname `'localhost'`.
- Once the server starts, it logs a message to the console.

---

## Summary
- The **app object** in Express is the core component used to set up routes, middleware, and application-wide configurations.
- `app.use()` is used to apply middleware globally or to specific paths.
- You can set up routers in separate files and mount them using `app.use()` with or without prefixes.
- `app.listen()` starts the server and listens for incoming connections.

---

## References
- [Express.js Documentation](https://expressjs.com/en/4x/api.html)
- [Node.js Documentation](https://nodejs.org/en/docs/)