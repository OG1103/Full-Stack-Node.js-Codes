
# **Understanding `notFound` and Error-Handling Middleware in Express**

In an Express application, two important types of global middleware are:

1. **`notFound` middleware**: Handles requests for routes that don’t exist.
2. **Error-handling middleware**: Handles errors thrown or passed using `next(err)` in the application.

---

## **1. `notFound` Middleware**

### **What is `notFound` Middleware?**

The `notFound` middleware is used to handle requests that don’t match any defined routes. It acts as a **catch-all** middleware for undefined routes and returns a `404 Not Found` response.

### **How it Works**
- Express automatically handles this process.
1. Express goes through all defined routes and middlewares in the order they are declared.
2. If no route matches the incoming request, Express forwards the request to the `notFound` middleware.
3. The `notFound` middleware sends a `404` response indicating that the requested resource was not found.

### **Example**

```javascript
// Not Found Middleware
const notFound = (req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
};

// Place it after all routes
app.use(notFound);
```

### **Order of Declaration**

The `notFound` middleware should always be declared **after all route definitions** to ensure that it only handles requests for undefined routes.

---

## **2. Error-Handling Middleware**

### **What is Error-Handling Middleware?**

Error-handling middleware in Express is used to handle errors that occur during request processing. It catches errors that are:

- Thrown using `throw new Error()`.
- Passed using `next(err)`.

### **How it Works**
- Express automatically handles this process.
1. When an error is thrown or passed using `next(err)`, Express skips all remaining route handlers and non-error middlewares.
2. It forwards the error to the nearest error-handling middleware.
3. The error-handling middleware sends an appropriate response to the client.

### **Declaring an Error-Handling Middleware**

Error-handling middleware in Express must have **four parameters**: `(err, req, res, next)`.

#### **Example**

```javascript
// Error-Handling Middleware
const errorHandlerMiddleware = (err, req, res, next) => {
  console.error('Error:', err.message); // Log the error
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
};

// Place it after all routes and the `notFound` middleware
app.use(errorHandlerMiddleware);
```

### **Throwing and Passing Errors**

1. **Throwing Errors**:

   You can throw an error using `throw new Error()` inside a route handler. Express will automatically forward it to the error-handling middleware.

   ```javascript
   app.get('/error', (req, res) => {
     throw new Error('Something went wrong!'); // This will be caught by the error handler
   });
   ```

2. **Passing Errors Using `next(err)`**:

   You can pass an error using `next(err)`, which explicitly tells Express to forward the error to the error-handling middleware.

   ```javascript
   app.get('/async-error', async (req, res, next) => {
     try {
       // Simulate an async error
       throw new Error('Async error occurred!');
     } catch (err) {
       next(err); // Pass the error to the error handler
     }
   });
   ```

### **Order of Declaration**

The error-handling middleware should always be declared **after all routes and the `notFound` middleware**. This ensures that:

1. The `notFound` middleware handles unmatched routes first.
2. The error-handling middleware handles errors from both routes and the `notFound` middleware.

If you declare the error-handling middleware before the routes, it will not work as expected because it won’t be able to catch errors from routes that haven’t been executed yet.

---

## **3. Why is Order of Declaration Important?**

### **Execution Order in Express**

- Express executes middlewares and routes **in the order they are defined**.
- If you define the error-handling or `notFound` middleware **before the routes**, it will be executed before the routes, which defeats its purpose.
- By defining them **after all routes**, you ensure they only handle unmatched routes or errors that occur during route processing.

### **Correct Order Example**

```javascript
const express = require('express');
const app = express();

// Routes
app.get('/home', (req, res) => {
  res.send('Home Page');
});

app.get('/about', (req, res) => {
  res.send('About Page');
});

// Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error-Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

In this example:

1. Routes are defined first (`/home`, `/about`).
2. The `notFound` middleware is defined to catch any unmatched routes.
3. The error-handling middleware is defined to catch any errors that occur.

### **Incorrect Order Example**

```javascript
// Error handler defined before routes (Incorrect!)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Routes
app.get('/home', (req, res) => {
  res.send('Home Page');
});
```

In this case, the error handler is defined before the routes, so it will not be able to catch errors from the routes.

---

## **4. Summary**

| **Middleware**           | **Purpose**                                           | **When It’s Executed**                                    |
|--------------------------|-------------------------------------------------------|----------------------------------------------------------|
| **`notFound` Middleware** | Handles requests for undefined routes (404 responses) | After all routes, if no route matches                     |
| **Error-Handling Middleware** | Handles errors thrown or passed via `next(err)`      | After all routes and `notFound` middleware, if an error occurs |

### **Best Practices**

1. Always declare your **`notFound`** and **error-handling middleware** after all routes.
2. Ensure the error-handling middleware has four parameters: `(err, req, res, next)`.
3. Use `next(err)` to pass errors to the error-handling middleware explicitly.
4. Log errors in the error-handling middleware, but avoid exposing sensitive information to the client.

---

## **References**

- [Express.js Documentation: Error Handling](https://expressjs.com/en/guide/error-handling.html)
- [MDN Web Docs: try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
