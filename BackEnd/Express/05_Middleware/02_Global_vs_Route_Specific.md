# Global vs Route-Specific Middleware

## 1. Global Middleware

Global middleware is applied using `app.use()` without specifying a path. It runs for **every incoming request**, regardless of the route.

```javascript
import express from 'express';
const app = express();

// Global middleware - runs for ALL routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/home', (req, res) => res.send('Home Page'));
app.get('/about', (req, res) => res.send('About Page'));

app.listen(3000);
```

Both `GET /home` and `GET /about` will trigger the logging middleware.

---

## 2. Route-Specific Middleware

Route-specific middleware is passed as an argument in the route definition. It runs **only for that specific route**.

```javascript
const checkAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Public route - no middleware
app.get('/public', (req, res) => {
  res.send('Public page');
});

// Protected route - checkAuth middleware runs first
app.get('/private', checkAuth, (req, res) => {
  res.send('Private page');
});
```

- `GET /public` - no middleware runs, handler executes directly
- `GET /private` - `checkAuth` runs first, then handler (if auth passes)

---

## 3. Execution Order

### Middleware Before Controller (Most Common)

Middleware defined **before** routes executes before the route handler:

```javascript
app.use((req, res, next) => {
  console.log('Middleware 1');
  next();
});

app.use((req, res, next) => {
  console.log('Middleware 2');
  next();
});

app.get('/home', (req, res) => {
  console.log('Controller');
  res.send('Home');
});
```

Output for `GET /home`:
```
Middleware 1
Middleware 2
Controller
```

### Middleware After Controller

Middleware defined **after** routes can execute if the controller calls `next()`:

```javascript
app.get('/home', (req, res, next) => {
  console.log('Controller');
  res.send('Home');
  next(); // Pass control to next middleware
});

app.use((req, res, next) => {
  console.log('Post-processing middleware');
  next();
});
```

Output:
```
Controller
Post-processing middleware
```

### Route-Level Ordering

Middleware in a route definition executes in order:

```javascript
router.get('/', middleware1, middleware2, controller);
// 1. middleware1 runs
// 2. middleware2 runs (if middleware1 calls next())
// 3. controller runs (if middleware2 calls next())
```

---

## 4. Error-Handling Middleware

Error-handling middleware has **four parameters** and executes when an error is passed via `next(err)`:

```javascript
app.get('/error', (req, res, next) => {
  const error = new Error('Something failed');
  next(error); // Skips all non-error middleware, goes to error handler
});

// This is SKIPPED when an error is passed
app.use((req, res, next) => {
  console.log('This will not run');
  next();
});

// Error handler - MUST have 4 parameters
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});
```

Error-handling middleware must be defined **after all routes and other middleware**.

---

## 5. Combining Both Types

```javascript
import express from 'express';
const app = express();

// Global middleware (runs for all routes)
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.url}`);
  next();
});

// Route-specific middleware
const validateUser = (req, res, next) => {
  if (!req.query.user) {
    return res.status(400).json({ error: 'User parameter required' });
  }
  next();
};

app.get('/profile', validateUser, (req, res) => {
  res.json({ message: `Welcome, ${req.query.user}` });
});

app.get('/home', (req, res) => {
  res.send('Home page'); // No validateUser middleware
});

app.listen(3000);
```

For `GET /profile?user=Alice`:
```
[LOG] GET /profile?user=Alice
-> validateUser passes -> controller responds
```

For `GET /home`:
```
[LOG] GET /home
-> controller responds (no validateUser)
```

---

## 6. Summary

| Aspect | Global Middleware | Route-Specific Middleware |
|--------|-------------------|--------------------------|
| Scope | All routes | Only specified routes |
| Syntax | `app.use(middleware)` | `app.get(path, middleware, handler)` |
| Before controller | Yes, if defined before routes | Yes, for the specified route |
| Common use cases | Logging, body parsing, CORS, security headers | Authentication, validation, authorization |

### Best Practices

1. **Global middleware** for tasks applied to all routes: parsing, logging, CORS, security
2. **Route-specific middleware** for selective tasks: auth, validation, rate limiting
3. **Order matters**: define middleware before the routes that need it
4. **Error-handling middleware** always goes last, after all routes
