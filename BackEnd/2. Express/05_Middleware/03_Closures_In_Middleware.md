# Closures in Middleware

## 1. What Are Closures?

A **closure** is a function that retains access to variables from its outer (enclosing) scope even after that scope has finished executing. In middleware, closures allow you to create **configurable, reusable middleware** that accepts parameters.

---

## 2. Middleware Without Closures

A simple middleware function with no configuration:

```javascript
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(logger);
```

This works but cannot be customized. What if you want different logging levels?

---

## 3. Middleware With Closures (Parameterized)

A closure-based middleware returns a function. The outer function accepts configuration, and the inner function is the actual middleware:

```javascript
const logger = (level) => {
  return (req, res, next) => {
    if (level === 'verbose') {
      console.log(`[${level}] ${req.method} ${req.url} - ${JSON.stringify(req.headers)}`);
    } else {
      console.log(`[${level}] ${req.method} ${req.url}`);
    }
    next();
  };
};

// Use with different configurations
app.use(logger('basic'));     // Logs method and URL
app.use(logger('verbose'));   // Logs method, URL, and headers
```

**How it works:**
1. `logger('basic')` is called, which returns a middleware function
2. The returned function retains access to `level` via closure
3. Express calls the returned function with `req`, `res`, `next`

---

## 4. Authorization Middleware Example

The most common use case - role-based access control:

```javascript
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role; // Assume auth middleware set req.user

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Usage - different roles for different routes
app.get('/admin', authorize('admin'), (req, res) => {
  res.json({ message: 'Admin panel' });
});

app.get('/dashboard', authorize('admin', 'manager'), (req, res) => {
  res.json({ message: 'Dashboard' });
});

app.get('/profile', authorize('admin', 'manager', 'user'), (req, res) => {
  res.json({ message: 'Profile' });
});
```

---

## 5. Async Middleware With Closures

Closures work with async operations too. Pass in a function or configuration:

```javascript
const validateUser = (fetchUserFn) => {
  return async (req, res, next) => {
    try {
      const userId = req.headers['user-id'];
      const user = await fetchUserFn(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      req.user = user; // Attach user to request for downstream handlers
      next();
    } catch (error) {
      next(error); // Forward to error handler
    }
  };
};

// Usage with a database lookup function
import User from './models/User.js';
app.use(validateUser((id) => User.findById(id)));
```

---

## 6. More Examples

### Rate Limiter

```javascript
const rateLimit = (maxRequests, windowMs) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    const timestamps = (requests.get(ip) || []).filter(t => t > windowStart);

    if (timestamps.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    timestamps.push(now);
    requests.set(ip, timestamps);
    next();
  };
};

app.use('/api', rateLimit(100, 15 * 60 * 1000)); // 100 requests per 15 minutes
```

### Validation Middleware

```javascript
const validateBody = (requiredFields) => {
  return (req, res, next) => {
    const missing = requiredFields.filter(field => !req.body[field]);

    if (missing.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    next();
  };
};

app.post('/api/users', validateBody(['name', 'email']), createUser);
app.post('/api/products', validateBody(['title', 'price']), createProduct);
```

---

## 7. Best Practices

1. **Always call `next()`** unless you are sending a response
2. **Use `next(error)`** to forward errors to error-handling middleware
3. **Keep closures focused** - each middleware should do one thing
4. **Compose middleware** by combining multiple closure-based middleware:

```javascript
app.get('/secure',
  authenticate,                        // Check if logged in
  authorize('admin', 'manager'),       // Check role
  validateBody(['action']),            // Validate input
  controller                           // Handle request
);
```
