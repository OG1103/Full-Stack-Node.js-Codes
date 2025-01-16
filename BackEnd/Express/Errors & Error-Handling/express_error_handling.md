
# **Error Handling in Express (Custom Errors and Execution Flow)**

This guide explains how error handling works in Express when throwing errors both **inside** and **outside** a `try...catch` block, how Express handles uncaught errors, and whether execution stops upon throwing an error.

---

## **1. Throwing Errors and Handling in a `catch` Block**

### **Scenario: Throwing an Error Inside a `try` Block**

When an error is thrown **inside** a `try` block, it is caught by the corresponding `catch` block. This allows you to handle the error locally before it is propagated further.

#### **Example:**

```javascript
const exampleMiddleware = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error('Authorization header missing'); // Error thrown inside try block
    }
    res.send('Request successful');
  } catch (err) {
    console.error('Caught error:', err.message);
    res.status(401).json({ error: err.message }); // Error handled in catch block
  }
};
```

### **Flow**:
1. If the `Authorization` header is missing, an error is thrown.
2. Since the error is inside the `try` block, the `catch` block catches it.
3. The error is logged, and a `401 Unauthorized` response is sent.
4. **Execution stops after the error is thrown**, meaning subsequent lines inside the `try` block (after the `throw` statement) are not executed.

---

## **2. Throwing Errors Outside a `try` Block (Handled by Express)**

When an error is thrown **outside** a `try` block, or if you don’t handle it in a `catch` block, Express catches it and forwards it to the nearest error-handling middleware. This is only the case for synchronous functions. For Async check point 3. 

### **Example:**

```javascript
const exampleMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    throw new Error('Authorization header missing'); // Error thrown outside try block
  }
  res.send('Request successful');
};

// Custom error-handling middleware
app.use((err, req, res, next) => {
  console.error('Express caught error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});
```

### **Flow**:
1. The error is thrown directly outside any `try` block.
2. Since there’s no `catch` block, the error is propagated to Express’s built-in error handler.
3. Express forwards the error to the custom error-handling middleware (`app.use((err, req, res, next) => {...})`).
4. The error is logged, and a `500 Internal Server Error` response is sent.

---

## **3. Asynchronous Error Handling**

### **Scenario: Handling Errors in Asynchronous Code**

In asynchronous functions, errors must be handled explicitly using `try...catch` blocks. Express does not automatically catch errors thrown in `async` functions unless they are wrapped in a `try...catch` and forwarded using `next(err)`.

#### **Example:**

```javascript
app.get('/async-route', async (req, res, next) => {
  try {
    if (!req.query.name) {
      throw new Error('Name is required');
    }
    const data = await someAsyncFunction();
    res.json(data);
  } catch (err) {
    next(err); // Pass error to Express's error handler
  }
});
```

### **Flow**:
1. If an error occurs inside the `async` function, it is caught by the `catch` block.
2. The error is then passed to the custom error-handling middleware using `next(err)`.

> **Note:** For asynchronous errors, using `express-async-errors` can simplify the process by automatically forwarding thrown errors to the error-handling middleware without needing explicit `try...catch` blocks.

#### **Using express-async-errors**

```bash
npm install express-async-errors
```

```javascript
import 'express-async-errors';

app.get('/async-route', async (req, res) => {
  if (!req.query.name) {
    throw new Error('Name is required'); // Automatically forwarded to error handler
  }
  const data = await someAsyncFunction();
  res.json(data);
});
```

---

## **4. Does Throwing an Error Stop Execution?**

### **Inside a `try` Block**:
- Yes, throwing an error inside a `try` block stops further execution of the lines within the `try` block.
- Control immediately jumps to the `catch` block (if defined).

#### **Example:**

```javascript
try {
  console.log('Before error');
  throw new Error('Something went wrong');
  console.log('After error'); // This line will not execute
} catch (err) {
  console.error('Caught error:', err.message);
}
```

Output:
```
Before error
Caught error: Something went wrong
```

### **Outside a `try` Block**:
- Yes, throwing an error outside a `try` block also stops further execution in that middleware or route handler.
- The error is propagated to Express’s error-handling mechanism.

#### **Example:**

```javascript
app.get('/', (req, res) => {
  console.log('Before error');
  throw new Error('Something went wrong');
  console.log('After error'); // This line will not execute
});
```

Output:
```
Before error
Express caught error: Something went wrong
```

---

## **5. Summary: How Errors Are Handled**

- Your custom error-handling middleware should be defined as a global middleware at the end of all your routes and other middlewares. Once an error is thrown or passed using next(err), Express will automatically forward the error to your custom error-handling middleware.

| **Scenario**                                  | **Is Execution Stopped?** | **How is the Error Handled?**                       |
|------------------------------------------------|---------------------------|----------------------------------------------------|
| **Error thrown inside a `try` block**          | Yes                       | Handled in the `catch` block                      |
| **Error thrown outside a `try` block**         | Yes                       | Propagated to Express’s error-handling middleware |
| **Error thrown in `async` function**           | Yes                       | Requires `try...catch` and `next(err)` or use of `express-async-errors` |
| **Error passed to `next(err)` manually**       | Yes                       | Propagated to Express’s error-handling middleware |
| **Unhandled errors**                          | Yes                       | Caught by Express’s default error handler         |

---

## **6. Best Practices for Error Handling in Express**

1. **Use `try...catch` blocks for synchronous errors**:
   - For synchronous code, always wrap critical sections in `try...catch` blocks to handle errors gracefully.
   
2. **Use `async...await` with `try...catch` for asynchronous errors**:
   - When using asynchronous code with `async...await`, ensure you wrap it in a `try...catch` block to handle errors.

3. **Always define a custom error-handling middleware**:
   - This allows you to control how errors are presented to the client.
   - Example:

     ```javascript
     app.use((err, req, res, next) => {
       console.error('Error:', err.message);
       res.status(err.status || 500).json({ error: err.message });
     });
     ```

4. **Never expose sensitive error details in production**:
   - Avoid sending stack traces or internal error details to the client in production.

---

## **7. References**

- [Express.js Documentation: Error Handling](https://expressjs.com/en/guide/error-handling.html)
- [MDN Web Docs: try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
