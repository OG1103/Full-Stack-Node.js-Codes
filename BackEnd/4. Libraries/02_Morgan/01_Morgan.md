# Morgan

Morgan is an HTTP request logger middleware for Express. It logs details about every incoming request (method, URL, status code, response time) to the console or a file.

---

## 1. Installation

```bash
npm install morgan
```

---

## 2. Basic Setup

```javascript
import express from 'express';
import morgan from 'morgan';

const app = express();

// Use a predefined format
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ message: 'Hello' });
});

app.listen(3000);
```

### Console Output

```
GET / 200 5.123 ms - 25
GET /api/users 404 1.234 ms - 45
POST /api/login 201 12.456 ms - 120
```

---

## 3. Predefined Formats

Morgan comes with several built-in log formats:

### `dev` (Recommended for Development)

Concise, color-coded output by status code:

```javascript
app.use(morgan('dev'));
// GET /api/users 200 5.123 ms - 25
// POST /api/login 401 3.456 ms - 40  (red for errors)
```

### `combined` (Recommended for Production)

Apache-style logs with full details:

```javascript
app.use(morgan('combined'));
// ::1 - - [10/Oct/2025:10:30:00 +0000] "GET /api/users HTTP/1.1" 200 25 "-" "Mozilla/5.0..."
```

### `common`

Like `combined` but without referrer and user-agent:

```javascript
app.use(morgan('common'));
// ::1 - - [10/Oct/2025:10:30:00 +0000] "GET /api/users HTTP/1.1" 200 25
```

### `short`

Shorter than `common`, includes response time:

```javascript
app.use(morgan('short'));
// ::1 GET /api/users 200 25 - 5.123 ms
```

### `tiny`

Minimal output:

```javascript
app.use(morgan('tiny'));
// GET /api/users 200 25 - 5.123 ms
```

### Format Comparison

| Format | Details Included | Best For |
|--------|-----------------|----------|
| `dev` | Method, URL, status (colored), response time | Development |
| `combined` | IP, date, method, URL, status, referrer, user-agent | Production logs |
| `common` | IP, date, method, URL, status | Production (simpler) |
| `short` | IP, method, URL, status, size, response time | Quick debugging |
| `tiny` | Method, URL, status, size, response time | Minimal logging |

---

## 4. Custom Format Strings

Create your own format using tokens:

```javascript
// Custom format
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
// GET /api/users 200 25 - 5.123 ms

// With date
app.use(morgan(':date[iso] :method :url :status :response-time ms'));
// 2025-10-10T10:30:00.000Z GET /api/users 200 5.123 ms
```

### Available Tokens

| Token | Description |
|-------|-------------|
| `:method` | HTTP method (GET, POST, etc.) |
| `:url` | Request URL |
| `:status` | Response status code |
| `:response-time` | Time to send response (ms) |
| `:date[format]` | Date (`clf`, `iso`, `web`) |
| `:remote-addr` | Client IP address |
| `:http-version` | HTTP version |
| `:referrer` | Referrer header |
| `:user-agent` | User-Agent header |
| `:res[header]` | Response header value |
| `:req[header]` | Request header value |

---

## 5. Custom Tokens

Define your own tokens with `morgan.token()`:

```javascript
// Create a custom token for the current user
morgan.token('user', (req) => {
  return req.user ? req.user.email : 'anonymous';
});

// Use it in a format string
app.use(morgan(':method :url :status :user :response-time ms'));
// GET /api/profile 200 user@example.com 5.123 ms
```

```javascript
// Token for request body (be careful with sensitive data)
morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :body'));
// POST /api/login 200 {"email":"user@example.com"}
```

---

## 6. Logging to a File

Write logs to a file instead of (or in addition to) the console:

```javascript
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';

// Create a write stream (append mode)
const accessLogStream = fs.createWriteStream(
  path.join(process.cwd(), 'access.log'),
  { flags: 'a' }  // 'a' = append
);

// Log to file
app.use(morgan('combined', { stream: accessLogStream }));
```

### Log to Both Console and File

```javascript
// Console logging (development)
app.use(morgan('dev'));

// File logging (all requests)
app.use(morgan('combined', { stream: accessLogStream }));
```

---

## 7. Conditional Logging

### Skip Certain Requests

```javascript
// Only log error responses
app.use(morgan('dev', {
  skip: (req, res) => res.statusCode < 400,
}));

// Skip health check endpoints
app.use(morgan('dev', {
  skip: (req) => req.url === '/health',
}));
```

### Environment-Based Logging

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  const logStream = fs.createWriteStream('access.log', { flags: 'a' });
  app.use(morgan('combined', { stream: logStream }));
}
```

---

## 8. Complete Example

```javascript
import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

// Custom token
morgan.token('user', (req) => req.user?.email || 'guest');

// Development: colored console output
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Production: file logging
if (process.env.NODE_ENV === 'production') {
  const logStream = fs.createWriteStream(
    path.join(process.cwd(), 'access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: logStream }));
}

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello' });
});

app.listen(3000);
```

---

## 9. Summary

| Feature | Detail |
|---------|--------|
| Purpose | Log HTTP requests |
| Install | `npm install morgan` |
| Usage | `app.use(morgan('format'))` |
| Dev format | `morgan('dev')` — colored, concise |
| Prod format | `morgan('combined')` — full Apache-style |
| Custom tokens | `morgan.token('name', fn)` |
| File logging | Pass `{ stream }` option |
| Skip requests | Pass `{ skip: fn }` option |
