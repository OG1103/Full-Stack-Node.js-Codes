# Handling Undefined Routes in Express Using `*` and `notFound` Middleware

When building an Express application, it’s common to encounter requests to routes that have not been defined. To handle these undefined routes gracefully, you can set up an error route using `*` and assign a custom `notFound` middleware that responds with a helpful error message.

This guide explains how to set up a route handler for all undefined routes using Express and a `notFound` middleware.

---

## **Step 1: Create the `notFound` Middleware**

The `notFound` middleware is responsible for sending a 404 response with an appropriate error message when a route does not exist.

```javascript
// middleware/not-found.js
const notFound = (req, res) => {
  res.status(404).json({ msg: 'Route does not exist' });
};

export default notFound;
```

### Explanation
- The middleware function `notFound` takes `req` and `res` as arguments.
- It sets the status code to `404` (Not Found) and responds with a JSON object containing an error message.

---

## **Step 2: Assign the `notFound` Middleware to Undefined Routes**

In Express, you can use the wildcard route `*` to match any route that has not been explicitly defined.

```javascript
// server.js
import express from 'express';
import notFound from './middleware/not-found.js';

const app = express();

// Define your routes here
app.get('/api/v1/example', (req, res) => {
  res.send('This is an example route');
});

// Handle undefined routes
app.use('*', notFound);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
```

### Explanation
1. **`app.use('*', notFound)`**:
   - The wildcard `*` matches any route that has not been defined in your application.
   - When a request is made to an undefined route, the `notFound` middleware is executed, sending a 404 response with the message "Route does not exist."

2. **Order of Middleware**:
   - Ensure that `app.use('*', notFound)` is placed **after all defined routes**. This way, it only handles requests to routes that were not matched by any previous route handler.

---

## **Step 3: Test the Setup**

1. **Defined Route**:
   - Request: `GET /api/v1/example`
   - Response:
     ```
     This is an example route
     ```

2. **Undefined Route**:
   - Request: `GET /api/v1/undefined`
   - Response:
     ```json
     {
       "msg": "Route does not exist"
     }
     ```

---

## **Why Use the Wildcard `*` for Undefined Routes?**

Using the wildcard `*` is a simple and effective way to catch all routes that have not been explicitly defined. This approach ensures:

1. **Consistent Error Handling**:
   - All undefined routes are handled by a single middleware, making it easier to maintain consistent error messages.

2. **Improved User Experience**:
   - Instead of sending a generic server error or an empty response, the middleware provides a clear message indicating that the route does not exist.

3. **Simplified Code**:
   - By using `*`, you don't need to manually define a 404 handler for each undefined route.

---

## **Summary**

- Create a custom `notFound` middleware that sends a 404 response with an error message.
- Use the wildcard `*` route in Express to handle all undefined routes.
- Ensure the `notFound` middleware is added after all defined routes to correctly catch any unmatched requests.

This setup provides a clean and efficient way to handle errors for undefined routes in your Express application.

---

### **Example Project Structure**
```bash
project-folder/
├── middleware/
│   └── not-found.js
├── server.js
├── package.json
└── node_modules/
