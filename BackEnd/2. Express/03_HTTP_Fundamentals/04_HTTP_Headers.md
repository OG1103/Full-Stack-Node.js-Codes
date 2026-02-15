# HTTP Headers

## 1. Overview

HTTP headers are **key-value pairs** sent in both requests and responses as part of the HTTP protocol. They provide metadata about the message, such as the content type, authentication credentials, caching policies, and connection details.

```
Header-Name: header-value
```

Headers are **case-insensitive** in their names (e.g., `Content-Type` and `content-type` are equivalent).

---

## 2. Types of HTTP Headers

### Request Headers

Sent by the client to provide information about the request.

| Header | Purpose | Example |
|--------|---------|---------|
| `Host` | Domain name of the server | `Host: example.com` |
| `User-Agent` | Identifies the client (browser, app) | `User-Agent: Mozilla/5.0` |
| `Accept` | Content types the client can process | `Accept: application/json` |
| `Authorization` | Authentication credentials | `Authorization: Bearer <token>` |
| `Content-Type` | Media type of the request body | `Content-Type: application/json` |
| `Cookie` | Cookies previously set by the server | `Cookie: sessionId=abc123` |

### Response Headers

Sent by the server to provide information about the response.

| Header | Purpose | Example |
|--------|---------|---------|
| `Content-Type` | Media type of the response body | `Content-Type: application/json` |
| `Content-Length` | Size of the response body in bytes | `Content-Length: 512` |
| `Set-Cookie` | Sets cookies on the client | `Set-Cookie: sessionId=abc123; HttpOnly` |
| `Cache-Control` | Caching directives | `Cache-Control: no-cache` |
| `Location` | Redirect URL | `Location: https://example.com/new` |
| `Access-Control-Allow-Origin` | CORS allowed origins | `Access-Control-Allow-Origin: *` |

### General Headers

Present in both requests and responses, not related to the body content.

| Header | Purpose | Example |
|--------|---------|---------|
| `Date` | Date and time of the message | `Date: Wed, 21 Oct 2025 07:28:00 GMT` |
| `Connection` | Connection management | `Connection: keep-alive` |
| `Transfer-Encoding` | Encoding used for safe transfer | `Transfer-Encoding: chunked` |

### Entity Headers

Describe the body of the request or response.

| Header | Purpose | Example |
|--------|---------|---------|
| `Content-Type` | Media type of the body | `Content-Type: application/json` |
| `Content-Encoding` | Compression encoding | `Content-Encoding: gzip` |
| `Content-Length` | Body size in bytes | `Content-Length: 2048` |

---

## 3. Reading Request Headers in Express

Express provides access to request headers through the `req.headers` object and the `req.get()` method.

### Using req.headers

```javascript
import express from 'express';
const app = express();

app.get('/api/info', (req, res) => {
  // req.headers is an object with all headers (keys are lowercase)
  console.log(req.headers);
  // {
  //   host: 'localhost:3000',
  //   'user-agent': 'Mozilla/5.0',
  //   accept: 'application/json',
  //   authorization: 'Bearer eyJhbG...'
  // }

  res.json({ headers: req.headers });
});
```

### Using req.get()

A cleaner way to read a specific header by name (case-insensitive).

```javascript
app.get('/api/profile', (req, res) => {
  const userAgent = req.get('User-Agent');
  const authToken = req.get('Authorization');
  const contentType = req.get('Content-Type');

  res.json({ userAgent, authToken, contentType });
});
```

---

## 4. Setting Response Headers in Express

Express provides `res.set()` to set response headers before sending the response.

### Using res.set()

```javascript
app.get('/api/data', (req, res) => {
  // Set a single header
  res.set('X-Request-Id', '12345');

  // Set multiple headers at once
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'X-Powered-By': 'Express',
  });

  res.json({ message: 'Data with custom headers' });
});
```

### Using res.setHeader() (Node.js native)

```javascript
app.get('/api/data', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Custom-Header', 'my-value');
  res.json({ data: 'hello' });
});
```

### Removing Headers

```javascript
app.get('/api/data', (req, res) => {
  // Express sets X-Powered-By by default; you can remove it
  res.removeHeader('X-Powered-By');
  res.json({ data: 'hello' });
});

// Or disable it globally
app.disable('x-powered-by');
```

---

## 5. Common Header Use Cases

### Authentication

```javascript
app.get('/api/protected', (req, res) => {
  const authHeader = req.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No valid token provided' });
  }

  const token = authHeader.split(' ')[1];
  // Verify the token...
  res.json({ message: 'Access granted' });
});
```

### Content Negotiation

```javascript
app.get('/api/users', (req, res) => {
  const accept = req.get('Accept');

  if (accept.includes('application/xml')) {
    res.set('Content-Type', 'application/xml');
    res.send('<users><user>Alice</user></users>');
  } else {
    res.json([{ name: 'Alice' }]); // Default to JSON
  }
});
```

### CORS Headers

```javascript
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(204).send();
  }

  next();
});
```

### Caching

```javascript
// Cache static data for 1 hour
app.get('/api/config', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  res.json({ theme: 'dark', language: 'en' });
});

// Disable caching for sensitive data
app.get('/api/account', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json({ balance: 1000 });
});
```

---

## 6. Sending Headers from the Client

When making requests from a client (e.g., using `fetch` or Axios), headers are included in the request configuration.

### Using fetch

```javascript
const response = await fetch('http://localhost:3000/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer my-token',
  },
  body: JSON.stringify({ name: 'Alice' }),
});
```

### Using Axios

```javascript
import axios from 'axios';

const response = await axios.post('http://localhost:3000/api/users',
  { name: 'Alice' },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer my-token',
    },
  }
);
```

### Axios Instance with Default Headers

```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Authorization': 'Bearer my-token',
    'Accept': 'application/json',
  },
});

// All requests from this instance include the default headers
const users = await api.get('/users');
const newUser = await api.post('/users', { name: 'Alice' });
```

---

## 7. Summary

| Operation | Node.js (http) | Express |
|-----------|----------------|---------|
| Read request header | `req.headers['header-name']` | `req.get('Header-Name')` |
| Read all request headers | `req.headers` | `req.headers` |
| Set response header | `res.setHeader('Name', 'value')` | `res.set('Name', 'value')` |
| Set multiple headers | Multiple `setHeader()` calls | `res.set({ ... })` |
| Remove response header | `res.removeHeader('Name')` | `res.removeHeader('Name')` |
| Get response header | `res.getHeader('Name')` | `res.get('Name')` |

**Key takeaways:**
- HTTP headers provide essential metadata for requests and responses.
- Request headers carry authentication, content type, and client information.
- Response headers control caching, cookies, CORS, and content details.
- Express simplifies header management with `req.get()` and `res.set()`.
- Always validate authentication headers on the server side.
- Use CORS headers to control which origins can access your API.
