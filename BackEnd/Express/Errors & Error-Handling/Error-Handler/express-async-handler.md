# Express Async Handler

The `express-async-handler` library is a lightweight Node.js package that simplifies error handling in Express applications, especially when working with asynchronous code. Normally, handling errors in asynchronous functions requires the use of `try-catch` blocks. However, with `express-async-handler`, you can avoid repetitive `try-catch` statements, making your code cleaner and more maintainable.

## Installation

```bash
npm install express-async-handler
```

## How It Works

The library provides a simple function that wraps your asynchronous route handlers or middleware. This wrapper automatically catches any errors thrown inside the `async` function and forwards them to Express's default error-handling middleware.

### Importing and Setting Up (ES6 Syntax)

```javascript
import express from 'express';
import asyncHandler from 'express-async-handler';

const app = express();

// Example route without try-catch
app.get('/async-error', asyncHandler(async (req, res) => {
  throw new Error('Something went wrong!'); // This error will be caught automatically
}));

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

## Key Features

1. **No More Try-Catch:**

   - You don't need to wrap each `async` function with `try-catch`. Just wrap the route with `asyncHandler()`.

2. **Handles All Thrown Errors:**

   - Whether you throw a standard JavaScript `Error` or a custom error, the library ensures that it's passed to the next error-handling middleware.

3. **Automatic `next()` Invocation:**

   - You don’t need to manually call `next(err)` for errors. The wrapper automatically catches errors and forwards them to the error-handling middleware.

4. **Custom Error Handling:**

   - You can define custom error classes and throw them as needed:

```javascript
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

app.get('/custom-error', asyncHandler(async (req, res) => {
  throw new CustomError('Custom error occurred!', 400);
}));

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ error: err.message });
});
```

## Handling Errors from `await`

If an `await` operation fails (e.g., a rejected promise), you don't need to wrap it in a `try-catch` block. The error will be automatically caught and passed to the error-handling middleware:

```javascript
app.get('/await-error', asyncHandler(async (req, res) => {
  const result = await Promise.reject(new Error('Promise failed!'));
  res.send(result);
}));
```

This error will be caught and handled by the global error handler without the need for `try-catch`.

## Handling Errors Thrown by Express

The `express-async-handler` library primarily handles errors thrown in asynchronous code. However, for errors thrown internally by Express (such as syntax errors in JSON parsing), these are handled by Express's default error handling. To capture such errors, you can still use custom middleware:

```javascript
app.use(express.json());

app.post('/json-error', (req, res) => {
  res.send('Received valid JSON');
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next(err);
});
```

## Do You Need to Wrap Components?

Yes, unlike `express-async-errors`, with `express-async-handler`, you **must wrap each async route or middleware** with the `asyncHandler()` function to ensure errors are caught.

### Example With Wrapping:

```javascript
import express from 'express';
import asyncHandler from 'express-async-handler';

const app = express();

app.get('/error', asyncHandler(async (req, res) => {
  throw new Error('Error without try-catch!');
}));

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

app.listen(3000);
```

## Creating Your Own Async Handler Wrapper (Using `try-catch`)

If you'd like to create your own custom wrapper for handling async errors (similar to `express-async-handler`), here’s how you can do it using `try-catch`:

### Custom Async Handler

```javascript
const customAsyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err); // Forward the error to Express error-handling middleware
    }
  };
};

export default customAsyncHandler;
```

### Separation of Concerns Example

#### `controllers/userController.js`

```javascript
import customAsyncHandler from '../middlewares/customAsyncHandler.js';

export const getUser = customAsyncHandler(async (req, res) => {
  throw new Error('User not found!');
});
```

#### `routes/userRoutes.js`

```javascript
import express from 'express';
import { getUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/user', getUser);

export default router;
```

#### `app.js`

```javascript
import express from 'express';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(express.json());
app.use('/api', userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ error: err.message });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### How It Works:

- The `customAsyncHandler` wraps async controller functions with `try-catch`.
- Errors are caught in the `catch` block and passed to Express’s error-handling middleware using `next(err)`.
- The centralized error handler in `app.js` handles all errors.

## Centralized Error Handling

All errors, regardless of type, are ultimately funneled into the global error handler middleware:

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ message: err.message });
});
```

## Conclusion

`express-async-handler` is a powerful library that simplifies error handling for asynchronous operations in Express. It reduces boilerplate code, eliminates the need for repetitive `try-catch` blocks, and ensures that all errors are handled consistently. You can also create your own custom async handler using `try-catch` for even more flexibility.

