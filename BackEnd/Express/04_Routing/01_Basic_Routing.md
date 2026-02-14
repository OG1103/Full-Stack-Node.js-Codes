# Basic Routing in Express

## 1. What is Routing?

**Routing** determines how an application responds to a client request at a specific URL (path) and HTTP method. Each route can have one or more handler functions that execute when the route is matched.

### Route Definition Syntax

```javascript
app.METHOD(path, handler);
```

- **app**: Express application instance
- **METHOD**: HTTP method in lowercase (`get`, `post`, `put`, `patch`, `delete`)
- **path**: URL path (string, pattern, or regex)
- **handler**: Function executed when the route matches

---

## 2. Route Methods

```javascript
import express from 'express';
const app = express();
app.use(express.json());

app.get('/users', (req, res) => { /* Retrieve users */ });
app.post('/users', (req, res) => { /* Create user */ });
app.put('/users/:id', (req, res) => { /* Replace user */ });
app.patch('/users/:id', (req, res) => { /* Update user */ });
app.delete('/users/:id', (req, res) => { /* Delete user */ });
```

### app.all() - Match All HTTP Methods

```javascript
// Runs for ANY HTTP method on /api/secret
app.all('/api/secret', (req, res) => {
  res.status(403).json({ message: 'Access denied' });
});
```

---

## 3. Route Paths

### String Paths

```javascript
app.get('/about', handler);          // Matches /about
app.get('/api/users', handler);      // Matches /api/users
```

### Paths with Parameters

Route parameters are named URL segments prefixed with `:`. Their values are captured in `req.params`.

```javascript
// Single parameter
app.get('/users/:id', (req, res) => {
  console.log(req.params.id); // "42" for /users/42
  res.json({ userId: req.params.id });
});

// Multiple parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
  // /users/5/posts/12 -> { userId: "5", postId: "12" }
});
```

**Important**: Route parameter values are always **strings**. Parse them if you need numbers:

```javascript
const id = Number(req.params.id);
```

### Query Strings

Query parameters are appended after `?` in the URL and accessed via `req.query`. They are optional.

```javascript
app.get('/search', (req, res) => {
  // GET /search?q=express&page=2&limit=10
  const { q, page = 1, limit = 10 } = req.query;
  res.json({ query: q, page, limit });
});
```

---

## 4. Route Handlers

### Single Handler

```javascript
app.get('/hello', (req, res) => {
  res.send('Hello World');
});
```

### Multiple Handlers (Middleware Chain)

Each handler must call `next()` to pass control to the next one:

```javascript
const logRequest = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const authenticate = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

app.get('/dashboard', logRequest, authenticate, (req, res) => {
  res.json({ message: 'Welcome to the dashboard' });
});
```

### Array of Handlers

```javascript
const middlewares = [logRequest, authenticate];

app.get('/admin', middlewares, (req, res) => {
  res.json({ message: 'Admin panel' });
});
```

---

## 5. app.route() - Chaining Methods

When multiple HTTP methods share the same path, use `app.route()` to avoid repeating the path:

```javascript
app.route('/api/users')
  .get((req, res) => {
    res.json({ message: 'Get all users' });
  })
  .post((req, res) => {
    res.status(201).json({ message: 'Create user' });
  });

app.route('/api/users/:id')
  .get((req, res) => {
    res.json({ message: `Get user ${req.params.id}` });
  })
  .put((req, res) => {
    res.json({ message: `Replace user ${req.params.id}` });
  })
  .patch((req, res) => {
    res.json({ message: `Update user ${req.params.id}` });
  })
  .delete((req, res) => {
    res.json({ message: `Delete user ${req.params.id}` });
  });
```

---

## 6. Route Order Matters

Express matches routes in the order they are defined. The **first matching route** handles the request.

```javascript
// This route matches first for /users/profile
app.get('/users/:id', (req, res) => {
  res.send(`User ID: ${req.params.id}`); // id = "profile"
});

// This never runs for /users/profile because the route above matches first
app.get('/users/profile', (req, res) => {
  res.send('User profile page');
});
```

**Fix**: Place specific routes before parameterized routes:

```javascript
app.get('/users/profile', (req, res) => {
  res.send('User profile page'); // Matches /users/profile
});

app.get('/users/:id', (req, res) => {
  res.send(`User ID: ${req.params.id}`); // Matches /users/42, /users/abc, etc.
});
```

---

## 7. Summary

| Concept | Description |
|---------|-------------|
| `app.METHOD(path, handler)` | Define a route for a specific HTTP method |
| `app.all(path, handler)` | Match all HTTP methods for a path |
| `req.params` | Named route parameters (`:id`) - always strings |
| `req.query` | Query string parameters (`?key=value`) - optional |
| `app.route(path)` | Chain multiple methods on the same path |
| Multiple handlers | Pass middleware functions before the final handler |
| Route order | First match wins - put specific routes before parameterized ones |
