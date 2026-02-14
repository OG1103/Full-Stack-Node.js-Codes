# Setting Up an Express Server

## 1. Prerequisites

- **Node.js** installed (v14+ recommended)
- **npm** (comes with Node.js)

## 2. Project Initialization

```bash
mkdir my-express-app
cd my-express-app
npm init -y
npm install express
```

To use ES6 `import` syntax, add `"type": "module"` to `package.json`.

---

## 3. Step-by-Step Server Setup

### Step 1: Import Express

```javascript
import express from 'express';
```

### Step 2: Create the App Instance

```javascript
const app = express();
```

The `app` object is the core of your Express application. It provides methods for:
- Defining routes: `app.get()`, `app.post()`, `app.put()`, `app.delete()`
- Adding middleware: `app.use()`
- Configuring settings: `app.set()`
- Starting the server: `app.listen()`

### Step 3: Define the Port

```javascript
const port = process.env.PORT || 3000;
```

Using `process.env.PORT` allows the port to be set via environment variables (essential for deployment).

### Step 4: Setup Essential Middleware

```javascript
app.use(express.json()); // Parses JSON request bodies -> populates req.body
```

Without `express.json()`, `req.body` would be `undefined` for JSON requests.

### Step 5: Define Routes

```javascript
app.get('/', (req, res) => {
  res.send('Server is running');
});
```

### Step 6: Start the Server

```javascript
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

`app.listen()` binds the server to the specified port and begins accepting connections.

---

## 4. The App Object

### app.use() - Registering Middleware

`app.use()` adds middleware that runs for every incoming request (or for requests matching a specific path).

**Global middleware** (runs for all routes):

```javascript
app.use(express.json());          // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
```

**Path-specific middleware** (runs only for matching paths):

```javascript
app.use('/api', authMiddleware);  // Only runs for routes starting with /api
```

**Mounting routers**:

```javascript
import userRouter from './routes/users.js';
app.use('/api/users', userRouter); // All user routes prefixed with /api/users
```

**Serving static files**:

```javascript
app.use(express.static('public'));
// Files in /public are served directly:
// public/style.css -> accessible at /style.css
// public/images/logo.png -> accessible at /images/logo.png
```

With a path prefix:

```javascript
app.use('/assets', express.static('public'));
// public/style.css -> accessible at /assets/style.css
```

### app.listen() - Starting the Server

```javascript
app.listen(port, hostname, backlog, callback);
```

- **port** (required): Port number to listen on
- **hostname** (optional): Defaults to `localhost` / `0.0.0.0`
- **backlog** (optional): Max pending connections queue length
- **callback** (optional): Function called once server starts

```javascript
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### app.set() / app.get() - Application Settings

```javascript
app.set('view engine', 'ejs');  // Set a configuration value
app.get('view engine');          // Retrieve: 'ejs'
```

---

## 5. Modularizing Routes

As your app grows, keep routes in separate files.

### Pattern 1: Route Initializer Function

```javascript
// routes.js
export default (app) => {
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  // Import and register more route files here
};

// app.js
import initializeRoutes from './routes.js';
initializeRoutes(app);
```

### Pattern 2: Express Router (Recommended)

```javascript
// routes/users.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => res.json({ users: [] }));
router.post('/', (req, res) => res.status(201).json({ message: 'Created' }));

export default router;

// app.js
import userRouter from './routes/users.js';
app.use('/api/users', userRouter);
```

---

## 6. Complete Starter Template

```javascript
import express from 'express';

// Catch critical errors outside Express
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

const app = express();
const port = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());

// --- Routes ---
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// --- 404 Handler (after all routes) ---
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --- Error Handler (must have 4 parameters) ---
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

---

## 7. Environment Variables with dotenv

```bash
npm install dotenv
```

Create a `.env` file:

```
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/myapp
```

Load in your app:

```javascript
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
```

**Important**: Add `.env` to your `.gitignore` file to keep secrets out of version control.
