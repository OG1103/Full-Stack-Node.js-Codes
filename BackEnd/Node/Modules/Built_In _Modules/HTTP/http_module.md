
# Node.js Built-in Module: `http`

The `http` module allows the creation of an HTTP server and handling of client requests. It's used to build web servers and handle HTTP methods like GET, POST, etc.

Express is a popular web framework built on top of the http module. It abstracts away many complexities of directly using http by providing an easier and more intuitive API for routing, middleware management, and request/response handling. Because of this, developers often prefer Express (or similar frameworks) over directly using the http module, especially for larger applications.

### Example: Creating a simple HTTP server
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

### Explanation:

1. `http.createServer()` creates an HTTP server.
2. The callback `(req, res)` handles incoming requests and sends a response.
3. `server.listen(3000)` makes the server listen on port 3000.
