# Custom Error Classes

Custom error classes let you define errors with specific names, status codes, and behaviors. This makes error handling consistent and meaningful across your application.

---

## 1. Base Custom Error Class

Create a base class that all custom errors extend:

```javascript
// errors/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes from programming errors
  }
}

export default AppError;
```

---

## 2. Specific Error Classes

Extend `AppError` for common HTTP error scenarios:

```javascript
// errors/index.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

export {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
};
```

---

## 3. Using Custom Errors in Controllers

Import and throw custom errors in your route handlers:

```javascript
// controllers/taskController.js
import { NotFoundError, BadRequestError } from '../errors/index.js';

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    res.json({ task });
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new BadRequestError('Task name is required');
    }

    const task = await Task.create({ name });
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
};
```

---

## 4. Error-Handling Middleware

The centralized error handler uses the `statusCode` and `isOperational` properties:

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  // Default values
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  // Log error details
  console.error(`[${err.name}] ${message}`);

  // Send response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};

export default errorHandler;
```

---

## 5. Wiring It Together

```javascript
// app.js
import express from 'express';
import errorHandler from './middleware/errorHandler.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Error handler - MUST be last
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## 6. Handling Mongoose Errors

Mongoose throws specific error types. Transform them in the error handler:

```javascript
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map(e => e.message);
    message = `Validation failed: ${messages.join(', ')}`;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  res.status(statusCode).json({ status: 'error', statusCode, message });
};

export default errorHandler;
```

---

## 7. Project Structure

```
project/
├── errors/
│   └── index.js          # All custom error classes
├── middleware/
│   └── errorHandler.js   # Centralized error handler
├── controllers/
│   └── taskController.js # Uses custom errors
├── routes/
│   └── taskRoutes.js
└── app.js                # Mounts error handler last
```

---

## 8. Summary

| Error Class | Status Code | Use Case |
|-------------|-------------|----------|
| `BadRequestError` | 400 | Invalid input, missing fields |
| `UnauthorizedError` | 401 | Missing or invalid authentication |
| `ForbiddenError` | 403 | Insufficient permissions |
| `NotFoundError` | 404 | Resource not found |
| `ConflictError` | 409 | Duplicate resource |
| `InternalServerError` | 500 | Unexpected server errors |

### Key Benefits

1. **Consistent responses** across the entire application
2. **Self-documenting** errors with meaningful names and status codes
3. **Separation of concerns** between error definition, throwing, and handling
4. **The `isOperational` flag** distinguishes expected errors from bugs
