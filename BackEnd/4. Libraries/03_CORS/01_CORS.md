# CORS (Cross-Origin Resource Sharing)

CORS is a security mechanism that controls which websites can make requests to your API. By default, browsers block requests from a different origin (domain, port, or protocol) than the server.

---

## 1. The Problem

```
Frontend: http://localhost:3000 (React)
Backend:  http://localhost:5000 (Express)
```

These are **different origins** (different ports). Without CORS configuration, the browser blocks the frontend from accessing the backend API.

### What is an Origin?

An origin is the combination of **protocol + domain + port**:

```
http://localhost:3000  → Origin A
http://localhost:5000  → Origin B  (different port)
https://example.com    → Origin C  (different domain)
http://example.com     → Origin D  (different protocol from C)
```

Requests between different origins are called **cross-origin requests**.

---

## 2. Installation and Basic Setup

```bash
npm install cors
```

### Allow All Origins (Development Only)

```javascript
import express from 'express';
import cors from 'cors';

const app = express();

// Allow requests from any origin
app.use(cors());

app.get('/api/data', (req, res) => {
  res.json({ message: 'Accessible from anywhere' });
});

app.listen(5000);
```

**Warning:** Using `cors()` with no options allows ALL origins. This is fine for development but **not safe for production**.

---

## 3. Configuring Specific Origins

### Single Origin

```javascript
app.use(cors({
  origin: 'http://localhost:3000',
}));
```

### Multiple Origins

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://myapp.com'],
}));
```

### Dynamic Origin (Function)

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://staging.myapp.com',
  'https://myapp.com',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
```

---

## 4. Configuration Options

```javascript
app.use(cors({
  origin: 'http://localhost:3000',   // Allowed origin(s)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed request headers
  exposedHeaders: ['X-Total-Count'],  // Headers the browser can access
  credentials: true,                  // Allow cookies/auth headers
  maxAge: 86400,                      // Cache preflight for 24 hours (seconds)
}));
```

### Options Explained

| Option | Type | Description |
|--------|------|-------------|
| `origin` | String/Array/Function | Which origins can access the API |
| `methods` | Array | Allowed HTTP methods |
| `allowedHeaders` | Array | Headers the client can send |
| `exposedHeaders` | Array | Headers the client can read from the response |
| `credentials` | Boolean | Allow cookies and Authorization headers |
| `maxAge` | Number | How long (seconds) browsers cache preflight responses |

---

## 5. Credentials (Cookies and Auth Headers)

When sending cookies or Authorization headers cross-origin:

### Backend

```javascript
app.use(cors({
  origin: 'http://localhost:3000',  // Must be specific (NOT '*')
  credentials: true,                 // Allow credentials
}));
```

### Frontend (Fetch)

```javascript
const response = await fetch('http://localhost:5000/api/data', {
  credentials: 'include',  // Send cookies
});
```

### Frontend (Axios)

```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,  // Send cookies
});
```

**Important:** When `credentials: true`, you **cannot** use `origin: '*'`. You must specify the exact origin.

---

## 6. Per-Route CORS

Apply CORS to specific routes instead of globally:

```javascript
import cors from 'cors';

const publicCors = cors();  // Allow all origins
const restrictedCors = cors({ origin: 'https://myapp.com' });

// Public endpoint
app.get('/api/public', publicCors, (req, res) => {
  res.json({ data: 'Anyone can access this' });
});

// Restricted endpoint
app.get('/api/admin', restrictedCors, (req, res) => {
  res.json({ data: 'Only myapp.com can access this' });
});
```

---

## 7. Preflight Requests

For certain requests (PUT, DELETE, custom headers), the browser sends an **OPTIONS** request first to check if the actual request is allowed. This is called a **preflight request**.

```
1. Browser → OPTIONS /api/data (preflight)
2. Server → 200 OK with CORS headers
3. Browser → PUT /api/data (actual request)
4. Server → 200 OK with response
```

### When Preflight Happens

| Condition | Preflight? |
|-----------|-----------|
| Simple GET/POST with standard headers | No |
| PUT, DELETE, PATCH methods | Yes |
| Custom headers (e.g., `Authorization`) | Yes |
| `Content-Type` other than form/text/multipart | Yes |

The `cors` middleware handles preflight automatically. The `maxAge` option caches the preflight result so the browser doesn't repeat it for every request.

---

## 8. CORS Headers (What cors() Sets)

The middleware sets these response headers:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

---

## 9. Complete Example

```javascript
import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://myapp.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}));

app.get('/api/data', (req, res) => {
  res.json({ message: 'CORS configured' });
});

app.listen(5000);
```

---

## 10. Summary

| Scenario | Configuration |
|----------|--------------|
| Allow all origins (dev) | `cors()` |
| Single origin | `cors({ origin: 'http://...' })` |
| Multiple origins | `cors({ origin: ['...', '...'] })` |
| With cookies/auth | `cors({ origin: '...', credentials: true })` |
| Per-route | `app.get('/path', cors(options), handler)` |

### Key Rules

1. `credentials: true` requires a specific `origin` (not `'*'`)
2. The `cors` middleware handles preflight (OPTIONS) requests automatically
3. Always specify exact origins in production
4. Use `allowedHeaders` to whitelist custom headers like `Authorization`
