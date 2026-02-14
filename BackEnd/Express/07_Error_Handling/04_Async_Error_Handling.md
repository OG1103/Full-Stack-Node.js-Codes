# Async Error Handling

Handling errors in asynchronous Express routes requires extra care. This guide covers `express-async-handler`, custom wrappers, and the `express-async-errors` package.

---

## 1. The Problem

In Express 4, async errors are **not automatically caught**. If an async function throws or a promise rejects, Express won't forward it to the error handler:

```javascript
// This will CRASH the server - unhandled rejection
app.get('/users', async (req, res) => {
  const users = await User.find(); // If this rejects, no error handler catches it
  res.json({ users });
});
```

You must wrap every async handler with `try...catch`:

```javascript
// Works but repetitive
app.get('/users', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    next(err);
  }
});
```

---

## 2. express-async-handler

A lightweight wrapper that eliminates repetitive `try...catch` blocks.

### Installation

```bash
npm install express-async-handler
```

### Usage

```javascript
import express from 'express';
import asyncHandler from 'express-async-handler';

const app = express();

// No try-catch needed - errors are caught automatically
app.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json({ users });
}));

// Thrown errors are caught too
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ user });
}));

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ error: err.message });
});
```

### How It Works

1. Wraps your async function in a try-catch
2. If an error is thrown or a promise rejects, it calls `next(err)` automatically
3. The error reaches your global error handler

### With Custom Error Classes

```javascript
import { NotFoundError } from '../errors/index.js';

app.get('/products/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new NotFoundError('Product not found'); // Caught automatically
  }
  res.json({ product });
}));
```

---

## 3. Building Your Own Async Wrapper

You can create a custom wrapper instead of using a library:

```javascript
// middleware/asyncHandler.js
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
```

### Alternative Using Try-Catch

```javascript
const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export default asyncHandler;
```

### Usage in Controllers

```javascript
// controllers/userController.js
import asyncHandler from '../middleware/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json({ users });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  res.json({ user });
});
```

```javascript
// routes/userRoutes.js
import express from 'express';
import { getUsers, getUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUser);

export default router;
```

---

## 4. express-async-errors (Alternative)

This package patches Express globally so that async errors are automatically caught without wrapping each handler:

### Installation

```bash
npm install express-async-errors
```

### Usage

```javascript
import express from 'express';
import 'express-async-errors'; // Just import it - no wrapping needed

const app = express();

// No asyncHandler wrapper, no try-catch
app.get('/users', async (req, res) => {
  const users = await User.find(); // Errors auto-forwarded to error handler
  res.json({ users });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

### Comparison

| Feature | `express-async-handler` | `express-async-errors` |
|---------|------------------------|----------------------|
| Wrapping required | Yes, each handler | No, import once |
| Explicit | Yes, clear what's wrapped | No, magic behind the scenes |
| Granular control | Yes | No |
| Setup | Wrap individual handlers | Single import |

---

## 5. Complete Example

```javascript
// app.js
import express from 'express';
import asyncHandler from 'express-async-handler';

const app = express();
app.use(express.json());

// All async routes use asyncHandler
app.get('/api/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json({ users });
}));

app.post('/api/users', asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ user });
}));

app.delete('/api/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ message: 'User deleted' });
}));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({ error: err.message });
});

app.listen(3000);
```

---

## 6. Best Practices

1. **Choose one approach** and use it consistently across your project
2. **`express-async-handler`** is recommended for explicit control
3. **Always have a global error handler** regardless of which approach you use
4. **Combine with custom error classes** for meaningful status codes and messages
5. **Wrap controllers at definition**, not in route files, for cleaner code
