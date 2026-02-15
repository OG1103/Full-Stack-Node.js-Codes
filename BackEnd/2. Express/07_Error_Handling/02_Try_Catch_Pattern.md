# Try-Catch Pattern in Express

The `try...catch` pattern is the foundation for error handling in Express. It catches errors in route handlers and forwards them to the global error-handling middleware via `next(err)`.

---

## 1. Basic Pattern

```javascript
import express from 'express';
const app = express();

app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new Error('User not found');
    }

    res.json({ user });
  } catch (err) {
    next(err); // Forward to global error handler
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.statusCode || 500).json({ error: err.message });
});
```

### How It Works

1. Code inside `try` executes normally
2. If an error is thrown (or a promise rejects), execution jumps to `catch`
3. `next(err)` forwards the error to the global error-handling middleware
4. The error handler sends a consistent response

---

## 2. Throwing Stops Execution

When you `throw` inside a `try` block, all code after the throw is skipped:

```javascript
app.post('/api/products', async (req, res, next) => {
  try {
    console.log('Before validation');

    if (!req.body.name) {
      throw new Error('Product name is required');
      // Everything below this line is SKIPPED
    }

    console.log('After validation'); // Only runs if no throw
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
});
```

---

## 3. Centralized Error Handling Across Routes

Every route follows the same pattern — catch errors and forward them:

```javascript
// Route 1
app.get('/api/users', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

// Route 2
app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// Route 3
app.post('/api/users', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

// Single error handler for ALL routes
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[${statusCode}] ${message}`);
  res.status(statusCode).json({ status: 'error', message });
});
```

---

## 4. Synchronous vs Asynchronous Errors

### Synchronous Errors

Express automatically catches synchronous errors thrown in route handlers (Express 5+ and Express 4 with sync handlers):

```javascript
app.get('/sync-error', (req, res) => {
  throw new Error('Sync error'); // Caught automatically by Express
});
```

### Asynchronous Errors

Async errors are **not automatically caught** in Express 4. You must use `try...catch`:

```javascript
// WITHOUT try-catch: error crashes the server
app.get('/bad', async (req, res) => {
  const user = await User.findById('invalid'); // Unhandled if it rejects
});

// WITH try-catch: error handled properly
app.get('/good', async (req, res, next) => {
  try {
    const user = await User.findById('invalid');
    res.json({ user });
  } catch (err) {
    next(err);
  }
});
```

---

## 5. Setting Custom Status Codes

Attach a `statusCode` property to errors before throwing:

```javascript
app.get('/api/orders/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    if (order.userId.toString() !== req.user.id) {
      const error = new Error('Not authorized to view this order');
      error.statusCode = 403;
      throw error;
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
});
```

---

## 6. The Global Error Handler

The error handler must have **exactly 4 parameters**. Express uses the parameter count to identify it:

```javascript
app.use((err, req, res, next) => {
  // Log for debugging
  console.error('Error:', err.stack);

  // Set status code
  const statusCode = err.statusCode || 500;

  // Send response (hide details in production)
  const response = {
    status: 'error',
    message: err.message,
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
});
```

---

## 7. Best Practices

1. **Always use `try...catch`** in async route handlers (Express 4)
2. **Always call `next(err)`** in the catch block to forward errors
3. **Attach `statusCode`** to errors for proper HTTP responses
4. **Place the error handler last** after all routes and middleware
5. **Never expose stack traces** in production responses
6. **Keep error responses consistent** across all routes
