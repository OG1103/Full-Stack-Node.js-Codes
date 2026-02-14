# Route Organization Patterns

## 1. Four Approaches to Organizing Routes

### Approach 1: Direct on App Instance

Define routes directly in the main file using `app.METHOD()`.

```javascript
// app.js
import express from 'express';
const app = express();

app.get('/users', (req, res) => res.json({ users: [] }));
app.post('/users', (req, res) => res.status(201).json({ message: 'Created' }));

app.listen(3000);
```

**Best for**: Small apps, prototypes, learning.
**Drawback**: All routes in one file becomes unmanageable as the app grows.

---

### Approach 2: Route Initializer Function

Pass the `app` instance to a function in a separate file that defines routes.

```javascript
// routes/userRoutes.js
export default (app) => {
  app.get('/api/users', (req, res) => res.json({ users: [] }));
  app.post('/api/users', (req, res) => res.status(201).json({ message: 'Created' }));
};

// routes/index.js
import initUserRoutes from './userRoutes.js';
import initProductRoutes from './productRoutes.js';

export default (app) => {
  initUserRoutes(app);
  initProductRoutes(app);
};

// app.js
import initializeRoutes from './routes/index.js';
const app = express();
initializeRoutes(app);
```

**Best for**: Medium apps that want modularity without Express Router.
**Drawback**: No route-level middleware grouping, no path prefixes.

---

### Approach 3: Express Router with Prefix (Recommended)

Use `express.Router()` in separate files and mount with `app.use('/prefix', router)`.

```javascript
// routes/users.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => res.json({ users: [] }));
router.post('/', (req, res) => res.status(201).json({ message: 'Created' }));
router.get('/:id', (req, res) => res.json({ userId: req.params.id }));

export default router;

// app.js
import userRouter from './routes/users.js';
app.use('/api/users', userRouter);
// GET /api/users, POST /api/users, GET /api/users/:id
```

**Best for**: Most applications. Clean separation, reusable middleware, path prefixes.

---

### Approach 4: Express Router without Prefix

Mount a router globally (routes use their full paths):

```javascript
app.use(userRouter);
// Routes are accessible at the paths defined in the router
```

**Best for**: When you want to define full paths in the router file itself.

---

## 2. When to Use Each

| Approach | Use When |
|----------|----------|
| `app.METHOD()` directly | Small apps, quick prototypes |
| Route initializer function | Want modularity without Router |
| `app.use('/prefix', router)` | Most apps - modular, grouped, scalable |
| `app.use(router)` without prefix | Full paths defined in router files |

---

## 3. Handling Undefined Routes

After all route definitions, add a catch-all for undefined routes:

### Using Middleware (Recommended)

```javascript
// middleware/notFound.js
const notFound = (req, res) => {
  res.status(404).json({ error: 'Route not found' });
};

export default notFound;

// app.js - Place AFTER all routes
app.use(notFound);
```

### Using Wildcard Route

```javascript
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route does not exist' });
});
```

Both approaches work. The key is placing them **after all defined routes** so they only catch unmatched requests.

---

## 4. Recommended Project Structure

### Small App

```
src/
  app.js            # Everything in one file
```

### Medium App

```
src/
  app.js            # Express setup + middleware
  routes/
    users.js        # User routes
    products.js     # Product routes
```

### Large App

```
src/
  app.js                # Express setup
  routes/
    index.js            # Mount all routers
    userRoutes.js
    productRoutes.js
    orderRoutes.js
  controllers/
    userController.js
    productController.js
    orderController.js
  middleware/
    auth.js
    validate.js
    errorHandler.js
    notFound.js
  models/
    User.js
    Product.js
    Order.js
  utils/
    helpers.js
```
