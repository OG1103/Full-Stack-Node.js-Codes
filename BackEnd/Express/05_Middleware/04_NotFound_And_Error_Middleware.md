# NotFound and Error-Handling Middleware

Every Express application needs two essential catch-all middleware functions: a **notFound** handler for undefined routes and an **error handler** for application errors.

---

## 1. NotFound Middleware

### What It Does

Catches requests to routes that have not been defined and returns a 404 response.

### How It Works

Express processes middleware and routes in the order they are defined. If a request doesn't match any route, it falls through to the notFound middleware.

### Implementation

```javascript
const notFound = (req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Place AFTER all route definitions
app.use(notFound);
```

---

## 2. Error-Handling Middleware

### What It Does

Catches all errors that occur during request processing and sends a consistent error response.

### How It Works

When an error is thrown or passed via `next(err)`, Express **skips all remaining non-error middleware and route handlers** and jumps to the nearest error-handling middleware.

### The 4-Parameter Signature

Express identifies error-handling middleware by its **four parameters**. All four must be present even if you don't use `next`:

```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};

// Place AFTER notFound middleware
app.use(errorHandler);
```

### How Errors Reach the Handler

**Throwing an error** (synchronous routes):

```javascript
app.get('/fail', (req, res) => {
  throw new Error('Something broke'); // Caught by error handler
});
```

**Using next(err)** (async routes):

```javascript
app.get('/async-fail', async (req, res, next) => {
  try {
    await someAsyncOperation();
  } catch (err) {
    next(err); // Forward to error handler
  }
});
```

---

## 3. Correct Order of Declaration

The order is critical. Express processes middleware top to bottom:

```
1. Built-in middleware (express.json(), etc.)
2. Custom global middleware (logging, auth)
3. Route definitions
4. notFound middleware    <-- catches unmatched routes
5. Error-handling middleware  <-- catches all errors
```

### Correct Example

```javascript
import express from 'express';
const app = express();

// 1. Middleware
app.use(express.json());

// 2. Routes
app.get('/home', (req, res) => {
  res.send('Home Page');
});

app.get('/error', (req, res) => {
  throw new Error('Test error');
});

// 3. NotFound - catches unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 4. Error handler - catches all errors
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});

app.listen(3000);
```

### Incorrect Example

```javascript
// ERROR: Error handler defined BEFORE routes - won't catch route errors
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.get('/home', (req, res) => {
  throw new Error('This error will NOT be caught!');
});
```

---

## 4. Summary

| Middleware | Purpose | Parameters | Placement |
|-----------|---------|------------|-----------|
| notFound | Handle undefined routes (404) | `(req, res)` | After all routes |
| errorHandler | Handle all application errors | `(err, req, res, next)` | After notFound, last in the chain |

### Key Rules

1. **notFound** and **error handler** must be defined **after all routes**
2. The error handler must have **exactly 4 parameters** - Express uses parameter count to identify it
3. Use `next(err)` in async code to forward errors to the error handler
4. In sync routes, `throw` is automatically caught by Express
5. Log errors server-side but avoid exposing sensitive details to clients
