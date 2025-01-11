# Setting Up an Express Server

## 1. Import Express
```javascript
import express from 'express';
```
- This line imports the **Express** library using ES6 module syntax.
- **Express** is a popular Node.js framework used for building web applications and APIs.
- By importing `express`, you gain access to its functionality to create a web server.

---

## 2. Create an Express Application
```javascript
const app = express();
```
- This line creates an instance of an **Express application**.
- `app` is an Express application object that provides methods for:
  - Handling requests (e.g., `app.get()`, `app.post()`).
  - Adding middleware (e.g., `app.use()`).
  - Configuring the server (e.g., `app.set()`).

---

## 3. Define the Server Port
```javascript
const port = 8000;
```
- This line defines the **port number** on which your server will listen for incoming HTTP requests.
- In this example, the server will listen on **port 8000**.
- A **port** is an address on your computer or server that applications use to listen for requests.
- Different applications use different ports to avoid conflicts.

---

## 4. Set Up Middleware to Parse JSON
```javascript
app.use(express.json());
```
- This line sets up middleware to enable your Express app to automatically parse incoming requests with **JSON payloads**.
- Middleware functions in Express execute **before** the final route handler and allow you to modify the request or response objects.
- Without this middleware, the app wouldn't be able to handle `application/json` request bodies.

```javascript
app.use(cors());
```
- This line sets up **CORS (Cross-Origin Resource Sharing)** middleware using a third-party library (`cors`).
- By using `app.use(cors())`, the server sends appropriate **CORS headers**, allowing requests from a different origin (e.g., a frontend app hosted on another domain).

**Note**: Middleware should be declared **before defining any routes** to ensure it is applied to all incoming requests.

---

## 5. Initialize Routes (If Defined in a Separate File)
If your routes are defined in a separate file, you can import and initialize them as follows:

### Example:
```javascript
import initializeRoutes from './routes.js';
initializeRoutes(app);
```
- `initializeRoutes` is a function that takes the `app` object as an argument and registers all the routes.
- This approach helps keep your code modular and organized.

---

## 6. Start the Server and Listen for Requests
```javascript
app.listen(port, () => {
  console.log('Server up and running on', port);
});
```
- This line starts the server and tells it to **listen** for incoming requests on the specified port (in this case, **8000**).
- The `app.listen()` method takes two arguments:
  1. **`port`**: The port number on which the server will listen.
  2. **`callback`**: A function that runs once the server starts successfully.
    - In this example, it logs `"Server up and running on 8000"` to the console.

### Explanation:
- When the server starts, it waits for incoming **HTTP requests**.
- Based on the routes or endpoints you define, it responds to these requests accordingly.

---

## Summary
1. **Import Express** to gain access to its functionality.
2. **Create an Express app** using `express()`.
3. **Define a port** for the server to listen on.
4. **Set up middleware** to handle JSON payloads and enable CORS.
5. **Initialize routes** if they are defined in a separate file.
6. **Start the server** using `app.listen()` and log a message once it is running.

---

## Example Code
```javascript
import express from 'express';
import cors from 'cors';
import initializeRoutes from './routes.js';

const app = express();
const port = 8000;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize routes
initializeRoutes(app);

// Start the server
app.listen(port, () => {
  console.log('Server up and running on', port);
});
```

---

## References
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
