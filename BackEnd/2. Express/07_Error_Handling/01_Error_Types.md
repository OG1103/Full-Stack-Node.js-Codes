# Types of Errors: Operational vs Programming

In Express applications, errors fall into two categories: **operational errors** (expected runtime problems) and **programming errors** (bugs in code). Understanding this distinction is essential for building robust error-handling strategies.

---

## 1. Operational Errors (Expected)

Operational errors are **runtime problems** that occur under predictable conditions. They are not bugs — they represent legitimate issues that the application should handle gracefully.

### Characteristics

- Occur during normal application operation
- Expected and often recoverable
- Caused by external factors, user actions, or resource limitations
- Should return appropriate status codes and messages

### Examples

**Invalid User Input:**

```javascript
app.post('/login', async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      const error = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }
    // ... handle login
  } catch (err) {
    next(err);
  }
});
```

**Database Connection Failure:**

```javascript
import mongoose from 'mongoose';

try {
  await mongoose.connect(process.env.MONGODB_URI);
} catch (err) {
  console.error('Database connection failed:', err.message);
  process.exit(1);
}
```

**Resource Not Found:**

```javascript
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
```

**Other Examples:**
- Network timeouts
- Third-party API failures
- File system errors (file not found, permission denied)
- Rate limit exceeded

---

## 2. Programming Errors (Bugs)

Programming errors are **unexpected bugs** caused by mistakes in code logic. These errors indicate flaws that require code changes to fix.

### Characteristics

- Caused by mistakes in code logic
- Unexpected and hard to predict
- Usually not recoverable without fixing the code
- Should be logged for debugging

### Examples

**Undefined Variable:**

```javascript
app.get('/', (req, res) => {
  console.log(user.name); // ReferenceError: user is not defined
});
```

**Type Errors:**

```javascript
const result = null;
console.log(result.property); // TypeError: Cannot read properties of null
```

**Incorrect Function Usage:**

```javascript
const sum = (a, b) => a + b;
console.log(sum(5)); // NaN - missing second argument
```

---

## 3. Key Differences

| Aspect | Operational Errors | Programming Errors |
|--------|-------------------|-------------------|
| Cause | External factors, expected failures | Bugs in code logic |
| Recoverable? | Yes, with proper handling | No, requires code fix |
| Examples | Invalid input, DB errors, network issues | Null reference, type errors |
| Handling | Respond gracefully with status codes | Log, alert developers, fix code |
| Impact | Can be anticipated and managed | Indicates a bug that needs correction |

---

## 4. Handling Strategy

### Operational Errors - Handle Gracefully

```javascript
const errorHandler = (err, req, res, next) => {
  if (err.isOperational) {
    // Operational error - send meaningful response
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  } else {
    // Programming error - don't expose details
    console.error('PROGRAMMING ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};
```

### Distinguishing Error Types with a Custom Class

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Mark as operational
  }
}

// Usage
throw new AppError('User not found', 404); // Operational
throw new Error('Unexpected bug');          // Programming (no isOperational flag)
```

---

## 5. Best Practices

1. **Differentiate error types** using custom error classes with an `isOperational` flag
2. **Handle operational errors gracefully** with clear messages and proper status codes
3. **Log programming errors** and alert the development team (use tools like Sentry or Winston)
4. **Never expose stack traces** or internal details to clients in production
5. **Validate input early** to prevent operational errors from propagating
6. **Fail fast** for programming errors — log and restart if necessary
