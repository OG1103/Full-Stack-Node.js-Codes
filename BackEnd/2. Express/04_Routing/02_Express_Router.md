# Express Router

## 1. What is Express Router?

`express.Router()` creates a **mini Express application** that handles only routing. It allows you to group routes, apply middleware, and structure your application into modular, maintainable pieces.

Instead of defining all routes directly on `app`, you create separate router instances for different parts of your API and mount them to the app using `app.use('/api/..',router)`.

---

## 2. Creating and Using a Router

### Define Routes in a Separate File

```javascript
// routes/users.js
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Get all users" });
});

router.get("/:id", (req, res) => {
  res.json({ message: `Get user ${req.params.id}` });
});

router.post("/", (req, res) => {
  res.status(201).json({ message: "Create user" });
});

export default router;
```

### Mount the Router in Your App

```javascript
// app.js
import express from "express";
import userRouter from "./routes/users.js";

const app = express();
app.use(express.json());

// Mount with a prefix - all routes in userRouter are prefixed with /api/users
app.use("/api/users", userRouter);
// router.get('/') -> GET /api/users
// router.get('/:id') -> GET /api/users/:id
// router.post('/') -> POST /api/users

app.listen(3000);
```

### Mount Without a Prefix

```javascript
app.use(userRouter);
// Routes are accessible at their defined paths directly
// router.get('/') -> GET /
```

---

## 3. router.route() - Grouping Methods

Group multiple HTTP methods under a single route path:

```javascript
router
  .route("/")
  .get((req, res) => res.json({ message: "Get all users" }))
  .post((req, res) => res.status(201).json({ message: "Create user" }));

router
  .route("/:id")
  .get((req, res) => res.json({ message: `Get user ${req.params.id}` }))
  .put((req, res) => res.json({ message: `Replace user ${req.params.id}` }))
  .patch((req, res) => res.json({ message: `Update user ${req.params.id}` }))
  .delete((req, res) => res.json({ message: `Delete user ${req.params.id}` }));
```

---

## 4. Middleware with Routers

### Global Router Middleware

Applies to **all routes** defined after it in the router:

```javascript
const router = express.Router();

// This middleware runs for every route in this router
// middleware and routes are executed top → bottom, exactly in the order they are defined inside the router.
// so it will execute before anything defined in the router.method() if defined before them
router.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.originalUrl}`);
  next();
});

router.get("/profile", getProfile);
router.post("/settings", updateSettings);
```

### Path-Specific Middleware

Applies only to routes starting with the given path:

```javascript
router.use("/admin", authenticate);

router.get("/admin/dashboard", getDashboard); // authenticate runs
router.get("/admin/settings", getSettings); // authenticate runs
router.get("/profile", getProfile); // authenticate does NOT run
```

### Route-Specific Middleware

Applied directly to a single route:

```javascript
router.get("/profile", authenticate, getProfile);
router.post("/settings", authenticate, validate, updateSettings);
```

### Using .route().all() for Shared Middleware

```javascript
router
  .route("/settings")
  .all(authenticate) // runs for all methods on /settings
  .get(getSettings)
  .post(updateSettings);
```

---

## 5. Nesting Routers

Mount routers within routers for deeply nested resource structures:

```javascript
// routes/posts.js
import express from 'express';
const postRouter = express.Router();

postRouter.get('/', (req, res) => res.json({ message: 'All posts' }));
postRouter.get('/:id', (req, res) => res.json({ message: `Post ${req.params.id}` }));

export default postRouter;

// routes/users.js
import express from 'express';
import postRouter from './posts.js';
const userRouter = express.Router();

userRouter.get('/', (req, res) => res.json({ message: 'All users' }));
userRouter.get('/:id', (req, res) => res.json({ message: `User ${req.params.id}` }));

// Nest post routes under users
userRouter.use('/:userId/posts', postRouter);

export default userRouter;

// app.js
app.use('/api/users', userRouter);
// GET /api/users           -> All users
// GET /api/users/5         -> User 5
// GET /api/users/5/posts   -> All posts (but userId not accessible in postRouter!)
```

**Note**: To access parent params in nested routers, see the mergeParams topic.

---

## 6. Middleware Execution Order

```
1. Global middleware (app.use())
2. Router-level middleware (router.use())
3. Route-specific middleware
4. Route handler (controller)
5. Error-handling middleware
```

Example:

```javascript
// 1. Global middleware
app.use((req, res, next) => {
  console.log("1. Global middleware");
  next();
});

// 2. Route-specific middleware
const authMiddleware = (req, res, next) => {
  console.log("2. Route-specific middleware");
  next();
};

// 3. Route handler
app.get("/protected", authMiddleware, (req, res) => {
  console.log("3. Route handler");
  res.send("Protected content");
});

// 4. Error handler
app.use((err, req, res, next) => {
  console.log("4. Error handler");
  res.status(500).json({ error: err.message });
});
```

Output for `GET /protected`:

```
1. Global middleware
2. Route-specific middleware
3. Route handler
```

---

## 7. Middleware with router.use() - Summary

| Use Case                | Syntax                                   | Applies To                   |
| ----------------------- | ---------------------------------------- | ---------------------------- |
| Global middleware       | `router.use(middleware)`                 | All routes in the router     |
| Path-specific           | `router.use('/path', middleware)`        | Routes starting with `/path` |
| Route-specific          | `router.get('/x', middleware, handler)`  | Only that one route          |
| All methods on route    | `router.route('/x').all(middleware)`     | Every HTTP method on `/x`    |
| Sub-router + middleware | `app.use('/prefix', middleware, router)` | All routes under `/prefix`   |
| Nested router           | `router.use('/sub', childRouter)`        | Routes under `/sub`          |

**Middleware order matters**: Middleware defined **after** a route will not run for that route.

---

## 8. Project Structure Example

```
project/
  src/
    app.js                    # Express app setup
    routes/
      index.js                # Route aggregator
      userRoutes.js           # User routes
      productRoutes.js        # Product routes
      orderRoutes.js          # Order routes
    controllers/
      userController.js       # User business logic
      productController.js    # Product business logic
    middleware/
      auth.js                 # Authentication middleware
      validate.js             # Validation middleware
```

```javascript
// routes/index.js
import userRouter from "./userRoutes.js";
import productRouter from "./productRoutes.js";
import orderRouter from "./orderRoutes.js";

export default (app) => {
  app.use("/api/users", userRouter);
  app.use("/api/products", productRouter);
  app.use("/api/orders", orderRouter);
};
```
