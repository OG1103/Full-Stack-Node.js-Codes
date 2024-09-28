/**
 * This file explains the differences between:
 * 1. app.[HTTP method] (e.g., app.get, app.post)
 * 2. app.use(routerFile)
 * 3. router.[HTTP method] (e.g., router.get, router.post)
 * 4. Using a function that initializes routes (e.g., import userRoutes(app))
 */

// 1. Using app.[HTTP method]
// This is how you define routes directly on the main Express application instance (app).
// Routes like GET, POST, PUT, DELETE can be handled using app.get(), app.post(), etc.

import express from "express"; // Import the Express library

const app = express(); // Create an instance of the Express application

// Define a GET route directly on the app instance
app.get("/", (req, res) => {
  res.send("Welcome to the Home Page");
});

// Define a POST route on the "/submit" path
app.post("/submit", (req, res) => {
  res.send("Form submitted successfully");
});

// 2. Using a function that takes the app instance (e.g., userRoutes(app))
// Instead of using app.use() and router, you can directly define routes in a function
// that accepts the `app` instance as a parameter, and initializes routes for that app.

import initializeUserRoutes from "./userRouteInitializer.js"; // Import a route-initializing function

// Call the function, passing the `app` instance to it. This allows defining routes directly.
initializeUserRoutes(app);

/**
 * Example of userRouteInitializer.js:
 *
 * // userRouteInitializer.js
 * export default function(app) {
 *     // Define a GET route directly on the app
 *     app.get('/users', (req, res) => {
 *         res.send('List of users');
 *     });
 *
 *     // Define a POST route directly on the app
 *     app.post('/users', (req, res) => {
 *         res.send('Create a new user');
 *     });
 * }
 *
 * In this approach, routes are defined directly on the `app` instance, but within a separate file.
 * This allows modularizing the routes while still using `app.[HTTP method]` instead of `router.[HTTP method]`.
 */

// Starting the server
const port = 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// 3. Using app.use(routerFile)
// You can use app.use() to mount routers from separate files.

import userRoutes from "./userRoutes.js"; // Import the router from a separate file

// Mount the userRoutes router to the "/users" path
app.use("/users", userRoutes);

// The app.use() method mounts middleware or routers at a base path.
// All routes in userRoutes.js will be prefixed with "/users" when accessed in the main app.

// 4. Using router.[HTTP method]
// Defining routes inside a Router object, typically in separate files.

import express from "express"; // Import Express in the router file
const router = express.Router(); // Create an instance of the Router

// Define a GET route on the router for the "/users" path
router.get("/", (req, res) => {
  res.send("List of users");
});

// Define a POST route on the router for the "/users" path
router.post("/", (req, res) => {
  res.send("User created");
});

// Export the router so it can be used in the main app
export default router;

/**
 * Summary:
 * 
 * 1. app.[HTTP method]:
 *    - Used to define routes directly on the Express app (e.g., app.get('/path', callback)).
 *    - Routes are added directly to the main application and respond to specific HTTP methods.
 * 
 * 2. app.use(routerFile):
 *    - Used to mount routers or middleware to the main app.
 *    - If mounting a router, it applies all the routes in the router to a specific base path.
 *    - For example, app.use('/users', userRoutes) mounts user-related routes under "/users".
 * 
 * 3. router.[HTTP method]:
 *    - Used to define routes inside a Router object (e.g., router.get('/path', callback)).
 *    - Routers are modular, making it easier to manage routes in separate files.
 *    - You typically export a router and import it into the main app, where it's mounted using app.use().
 * 
 * 4. Passing the app instance to a route-initializing function:
 *    - Instead of using app.use(), you can define routes in a separate file by passing the `app` instance to a function.
 *    - This allows defining routes using `app.get()`, `app.post()`, etc., directly within the initializing function.
 *    - It’s another way of modularizing routes but without using routers.
 * 
 * Modularization using routers or functions that take `app` as a parameter helps in organizing routes,
 * especially in larger applications, by keeping the codebase clean and scalable.
 * 
 * When to Use Which Approach:
        - app.[HTTP method]: Use when you want to define routes directly in the main file.
        - app.use('/prefix', router): Use when you want to modularize routes and group related routes together using Express routers and mount a specifc path to a certain group of routes.
        - app.use(router) (Without Prefix): the routes in the router will be mounted globally. This means that the routes inside the router will be accessible directly at the defined paths without any additional prefix. just like app.method
        - router.[HTTP method]: Use inside router files to organize routes, making the code modular and maintainable.
        - Route-initializing function (passing app): Use when you want to modularize routes but prefer to define them directly on the app instance, instead of using routers.
 */
