# Node.js Built-in Module — `http`

The `http` module allows you to create **HTTP servers** and **HTTP clients** in Node.js. It is the foundation for all web server functionality in Node — frameworks like Express are built on top of it.

---

## 1. Importing

```javascript
// CommonJS
const http = require('http');

// ES Modules
import http from 'http';
```

---

## 2. Creating a Basic HTTP Server

```javascript
import http from 'http';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

### How It Works

1. `http.createServer(callback)` creates a server with a request handler
2. The callback receives two objects:
   - `req` (IncomingMessage) — the incoming request (URL, method, headers, body)
   - `res` (ServerResponse) — the response you send back
3. `server.listen(port)` starts listening for incoming connections

---

## 3. The Request Object (`req`)

The `req` object contains information about the incoming HTTP request:

```javascript
const server = http.createServer((req, res) => {
  console.log(req.method);           // 'GET', 'POST', 'PUT', 'DELETE'
  console.log(req.url);              // '/api/users?page=1'
  console.log(req.headers);          // { 'content-type': 'application/json', ... }
  console.log(req.headers.host);     // 'localhost:3000'

  res.end('Request received');
});
```

### Reading the Request Body

The request body arrives in **chunks** (it's a readable stream). You must collect and parse it:

```javascript
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const parsed = JSON.parse(body);
      console.log('Body:', parsed);
      res.end('Data received');
    });
  }
});
```

---

## 4. The Response Object (`res`)

```javascript
const server = http.createServer((req, res) => {
  // Set status code
  res.statusCode = 200;

  // Set headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Custom-Header', 'my-value');

  // Send the response body and end the response
  res.end(JSON.stringify({ message: 'Hello!' }));
});
```

### Response Methods

| Method | Description |
|--------|-------------|
| `res.statusCode = 200` | Set HTTP status code |
| `res.setHeader(name, value)` | Set a response header |
| `res.writeHead(statusCode, headers)` | Set status code and headers at once |
| `res.write(data)` | Send a chunk of data (can be called multiple times) |
| `res.end(data?)` | End the response (optionally with final data) |

```javascript
// writeHead — set status code and all headers at once
res.writeHead(200, {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache',
});
res.end(JSON.stringify({ status: 'ok' }));
```

---

## 5. Basic Routing

Without a framework, you handle routing manually by checking `req.method` and `req.url`:

```javascript
import http from 'http';

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Home Page');
  } else if (method === 'GET' && url === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify([{ id: 1, name: 'John' }]));
  } else if (method === 'POST' && url === '/api/users') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User created', data: JSON.parse(body) }));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => console.log('Server on http://localhost:3000'));
```

This is why frameworks like **Express** exist — they abstract away this manual routing and request parsing, providing a much cleaner API.

---

## 6. HTTP Client (Making Requests)

The `http` module can also make outgoing HTTP requests:

```javascript
import http from 'http';

const options = {
  hostname: 'jsonplaceholder.typicode.com',
  path: '/posts/1',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(JSON.parse(data));
  });
});

req.on('error', (err) => console.error('Request error:', err.message));
req.end();
```

**In practice**, use `fetch()` (built into Node 18+) or libraries like `axios` for HTTP client requests — they are much simpler.

---

## 7. HTTP vs Express

| Feature | Raw `http` module | Express |
|---------|-------------------|---------|
| Routing | Manual `if/else` on `req.url` | `app.get('/path', handler)` |
| Body parsing | Manual (collect chunks) | `express.json()` middleware |
| Middleware | None built-in | Full middleware system |
| Static files | Manual implementation | `express.static()` |
| Error handling | Manual | Centralized error middleware |
| Complexity | Low-level, verbose | High-level, concise |

Express is built **on top of** the `http` module — it calls `http.createServer()` internally. Understanding the `http` module helps you understand what Express does under the hood.

---

## 8. Summary

| Concept | Code |
|---------|------|
| Create server | `http.createServer((req, res) => { ... })` |
| Start listening | `server.listen(port, callback)` |
| Get request method | `req.method` |
| Get request URL | `req.url` |
| Get request headers | `req.headers` |
| Set status code | `res.statusCode = 200` |
| Set header | `res.setHeader('Content-Type', 'text/plain')` |
| Send response | `res.end('data')` |

### Key Points

1. The `http` module is **built into Node.js** — no installation needed
2. `http.createServer()` creates a server; the callback runs for every incoming request
3. Request body arrives in **chunks** — collect them with `req.on('data')` and `req.on('end')`
4. Always call `res.end()` to finish the response — otherwise the client hangs
5. Use **Express** (or similar frameworks) instead of raw `http` for real applications — it abstracts routing, body parsing, middleware, and more
