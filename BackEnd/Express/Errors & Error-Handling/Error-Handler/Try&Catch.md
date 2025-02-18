# 🚨 Global Error Handling in Express (Using `try...catch` Blocks)

This guide focuses on **global error handling in Express** using `try...catch` blocks. It explains how to catch errors thrown inside `try` blocks and forward them to Express's global error-handling middleware for consistent error responses.

---

## 📚 **Overview**

- **Purpose:** Handle application-wide errors gracefully.
- **Key Concept:** Errors caught in `try...catch` blocks should be forwarded to the global error handler using `next(err)`.
- **Why It Matters:** Centralizes error handling, ensuring uniform error responses across all routes and middleware.

---

## ✅ **Basic Error Handling with `try...catch`**

### 1️⃣ **Throwing and Catching Errors in Middleware**

When an error occurs in a route or middleware, you can catch it using `try...catch` and pass it to the global error handler.

```javascript
const express = require('express');
const app = express();

app.get('/example', (req, res, next) => {
  try {
    if (!req.query.id) {
      throw new Error('ID is required'); // Error thrown inside try block
    }
    res.send('Request successful');
  } catch (err) {
    next(err); // Forward error to the global error handler
  }
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error('Global Error:', err.message);
  res.status(500).json({ error: err.message });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### 🚀 **Flow:**
1. **Error Thrown:** An error is thrown inside the `try` block.
2. **Caught by `catch`:** The error is caught immediately.
3. **Forwarded to Global Handler:** The `next(err)` function forwards the error to the global error-handling middleware.
4. **Response:** The global handler logs the error and returns a `500 Internal Server Error` with the error message.

---

## 🔍 **Global Error-Handling Middleware Structure**

Express’s global error handler is defined using four parameters: `err`, `req`, `res`, and `next`.

```javascript
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ error: err.message });
});
```

### ⚡ **Key Points:**
- **`err`**: The error object passed from `next(err)`.
- **`req` / `res`**: The request and response objects.
- **`next`**: Optional, used if you want to pass control to another error handler.
- **`res.status()`**: Sends the appropriate status code (defaults to `500` if none provided).

---

## 🚀 **Example: Centralized Error Handling Across Multiple Routes**

```javascript
const express = require('express');
const app = express();

// Route 1
app.get('/route1', (req, res, next) => {
  try {
    throw new Error('Error in Route 1');
  } catch (err) {
    next(err);
  }
});

// Route 2
app.get('/route2', (req, res, next) => {
  try {
    if (!req.query.user) {
      throw new Error('User parameter missing');
    }
    res.send('Route 2 accessed successfully');
  } catch (err) {
    next(err);
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`Error occurred: ${err.message}`);
  res.status(500).json({ error: err.message });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### ✅ **Execution Flow:**
1. If an error is thrown in any route, it’s caught in the `catch` block.
2. The error is passed to `next(err)`.
3. The global error handler logs the error and returns a standardized JSON response.

---

## 🔔 **Does Throwing an Error Stop Execution?**

Yes. Throwing an error inside a `try` block immediately stops further execution of code within that block. Control jumps directly to the `catch` block.

```javascript
try {
  console.log('Before error');
  throw new Error('Something went wrong');
  console.log('After error'); // This line will NOT execute
} catch (err) {
  console.error('Caught error:', err.message);
}
```

### **Output:**
```
Before error
Caught error: Something went wrong
```

- The line `console.log('After error')` is skipped because execution halts at the `throw` statement.

---

## 🗒️ **Best Practices for Global Error Handling**

1. **Always Use `try...catch` in Critical Code Paths:**
   - Especially when dealing with external APIs, file operations, or database queries.

2. **Forward Errors with `next(err)`:**
   - This ensures Express routes the error to the global error handler.

3. **Standardize Error Responses:**
   - Keep API error responses consistent (e.g., `{ error: 'Something went wrong' }`).

4. **Avoid Exposing Sensitive Error Details in Production:**
   - Never expose stack traces or sensitive data in production environments.

5. **Place Error Middleware Last:**
   - The global error handler should be defined **after all routes and middleware**.

---

## ✅ **Conclusion**

Using `try...catch` with Express's global error-handling middleware provides a robust mechanism for managing errors. It ensures:

- Errors are caught gracefully.
- Execution flow remains controlled.
- Clients receive clear, consistent error messages.

Centralizing error handling simplifies debugging, improves application stability, and enhances the developer experience. 🚀

