# Introduction to Middleware

## 1. What is Middleware?

Middleware functions are functions that have access to the **request object** (`req`), the **response object** (`res`), and the **next middleware function** (`next`) in the request-response cycle.

Middleware functions can:
- **Execute any code**
- **Modify the request and response objects** (e.g., attach data to `req`)
- **End the request-response cycle** (send a response)
- **Call the next middleware** in the stack using `next()`

If a middleware does not end the cycle or call `next()`, the request will hang indefinitely.

---

## 2. The Middleware Chain

When a request arrives, Express runs middleware functions in the order they are defined. Each function decides whether to pass control to the next one or end the cycle:

```
Request -> Middleware 1 -> Middleware 2 -> Route Handler -> Response
                |              |
           (can end)      (can end)
```

```javascript
import express from 'express';
const app = express();

// Middleware 1
app.use((req, res, next) => {
  console.log('Middleware 1');
  next(); // Pass to next middleware
});

// Middleware 2
app.use((req, res, next) => {
  console.log('Middleware 2');
  next(); // Pass to route handler
});

// Route handler
app.get('/', (req, res) => {
  console.log('Route handler');
  res.send('Hello');
});

// Output for GET /:
// Middleware 1
// Middleware 2
// Route handler
```

---

## 3. Types of Middleware

### Application-Level Middleware

Bound to the app instance using `app.use()` or `app.METHOD()`:

```javascript
// Runs for every request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
});

// Runs only for GET /api/users (Middleware for a specifc route)
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});
```

### Router-Level Middleware

Bound to a router instance using `router.use()` or `router.METHOD()`:

```javascript
import express from 'express';
const router = express.Router();

// Runs for all routes in this router
router.use((req, res, next) => {
  console.log('Router middleware');
  next();
});

router.get('/items', (req, res) => {
  res.json({ items: [] });
});

app.use('/api', router); // This mounts the entire router under the /api path.
```

### Error-Handling Middleware

Defined with **four parameters** (`err, req, res, next`). Express recognizes it as an error handler because of the four parameters:

```javascript
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.statusCode || 500).json({ error: err.message });
});
```

### Built-In Middleware

Express provides these out of the box:

```javascript
app.use(express.json());                        // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(express.static('public'));               // Serve static files
```

### Third-Party Middleware

Installed via npm and added to your app:

```javascript
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

app.use(cors());                // Enable Cross-Origin Resource Sharing
app.use(morgan('dev'));         // Log HTTP requests
app.use(cookieParser());       // Parse cookies
app.use(helmet());             // Set security-related HTTP headers
```

---

## 4. How next() Works

`next()` passes control to the next matching middleware or route handler.

```javascript
function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
    // Response sent - do NOT call next()
  }
  req.user = verifyToken(token); // Attach user data to request
  next(); // Pass to next middleware/handler
}
```

**What happens if you forget `next()`?**

```javascript
app.use((req, res, next) => {
  console.log('This runs...');
  // next() is not called - request hangs forever!
  // The client will eventually get a timeout error
});

app.get('/', (req, res) => {
  res.send('This never runs');
});
```

---

## 5. Complete Example

```javascript
import express from 'express';
import cors from 'cors';

const app = express();

// --- Built-in middleware ---
app.use(express.json());

// --- Third-party middleware ---
app.use(cors());

// --- Custom global middleware (logging) ---
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- Route-specific middleware ---
const requireAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// --- Routes ---
app.get('/public', (req, res) => {
  res.json({ message: 'Anyone can access this' });
});

app.get('/protected', requireAuth, (req, res) => {
  res.json({ message: 'Only authenticated users can access this' });
});

// --- Error-handling middleware (must be last) ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```
