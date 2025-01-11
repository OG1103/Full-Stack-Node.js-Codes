
// Example using the 'http' module to create a server
import http from 'http'

const server = http.createServer((req, res) => {
  // Respond with a status code and plain text content
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!');
});

// Start the server and listen on port 3000
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
