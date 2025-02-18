# Express Router: A Comprehensive Guide

## 📌 What is Express Router?
Express Router (`express.Router()`) is a **mini-instance of an Express application** that allows you to group routes, apply middleware, and structure your application efficiently. Instead of defining routes directly on `app`, you can create modular route handlers using `router`.

---

## 🔹 Creating a Router Instance
To use the Express router, you first need to **import Express** and create an instance of `express.Router()`:

```js
const express = require("express");
const router = express.Router();
```

Now, you can define routes on this `router` instance just like you would with `app`.

---

## 🔹 Defining Routes Using Express Router

### ✅ Example: Basic Router Setup
```js
const express = require("express");
const router = express.Router();

router.get("/users", (req, res) => {
  res.send("Get all users");
});

router.post("/users", (req, res) => {
  res.send("Create a new user");
});

module.exports = router;
```

This `router` instance is then used in the main `server.js` file:

```js
const express = require("express");
const app = express();
const userRoutes = require("./routes/users");

app.use("/api", userRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
```
🛠 Now, `GET /api/users` and `POST /api/users` will be handled by the router.

---

## 🔹 Grouping Multiple Routes in a Single `.route()` Call

If multiple HTTP methods (`GET`, `POST`, etc.) are needed for the same route, **group them using `.route()`**:

```js
router.route("/users")
  .get((req, res) => res.send("Get all users"))
  .post((req, res) => res.send("Create a user"));

router.route("/users/:id")
  .get((req, res) => res.send(`Get user with ID ${req.params.id}`))
  .put((req, res) => res.send(`Update user with ID ${req.params.id}`))
  .delete((req, res) => res.send(`Delete user with ID ${req.params.id}`));
```

This **keeps the code clean and readable** instead of repeating `router.get()`, `router.post()`, etc.

---

## 🔹 Applying **Global Middleware** to All Routes

Middleware functions **run before route handlers** and can be used for **authentication, logging, request processing, etc.**.

### ✅ Example: Applying Global Middleware to a Router
```js
const express = require("express");
const router = express.Router();

// Global Middleware (applies to all routes in this router)
router.use((req, res, next) => {
  console.log(`Request received at ${new Date().toISOString()}`);
  next(); // Move to the next middleware or route handler
});

router.get("/dashboard", (req, res) => {
  res.send("User dashboard");
});

router.get("/profile", (req, res) => {
  res.send("User profile page");
});

module.exports = router;
```

Now, **every request** to `/dashboard` and `/profile` will first log the request timestamp.

---

## 🔹 Applying **Specific Middleware** to Individual Routes

If a middleware should apply **only to specific routes**, pass it as a second argument before the route handler:

```js
const authMiddleware = (req, res, next) => {
  const isAuthenticated = req.headers.authorization;
  if (!isAuthenticated) return res.status(403).send("Forbidden");
  next();
};

router.get("/admin", authMiddleware, (req, res) => {
  res.send("Welcome to Admin Panel");
});
```

Now, the `/admin` route is protected by `authMiddleware`.

---

## 🔹 Ordering of Middleware Execution

### **Middleware and Route Execution Order** 🏗

1️⃣ **Global Middleware** (applied via `app.use()` or `router.use()`)  
2️⃣ **Middleware for Specific Routes**  
3️⃣ **Route Handlers**  
4️⃣ **Error-Handling Middleware**  

**Example to Demonstrate Ordering:**

```js
const express = require("express");
const app = express();

// 1️⃣ Global Middleware (Runs First)
app.use((req, res, next) => {
  console.log("Global middleware executed");
  next();
});

// 2️⃣ Specific Middleware for /protected Route
const protectedMiddleware = (req, res, next) => {
  console.log("Specific middleware for /protected route");
  next();
};

app.get("/public", (req, res) => {
  res.send("Public route, no middleware");
});

app.get("/protected", protectedMiddleware, (req, res) => {
  res.send("Protected route, middleware applied");
});

// 3️⃣ Error-Handling Middleware (Runs Last)
app.use((err, req, res, next) => {
  console.error("Error Middleware:", err.message);
  res.status(500).send("Internal Server Error");
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

### **🛠 Execution Order When Making Requests:**
- `GET /public` → **Global Middleware → Route Handler**
- `GET /protected` → **Global Middleware → Protected Middleware → Route Handler**

---

## 🔹 Nesting Routers (Modular Routing)
You can organize your routes by **mounting routers inside routers**.

### ✅ Example: Nested Routing
```js
const express = require("express");
const app = express();

const userRouter = express.Router();
const postRouter = express.Router();

// Define user routes
userRouter.get("/", (req, res) => res.send("User List"));
userRouter.get("/:id", (req, res) => res.send(`User ${req.params.id}`));

// Define post routes
postRouter.get("/", (req, res) => res.send("All Posts"));
postRouter.get("/:id", (req, res) => res.send(`Post ${req.params.id}`));

// Mount the routers
app.use("/users", userRouter);
app.use("/posts", postRouter);

app.listen(3000, () => console.log("Server running on port 3000"));
```

Now:
- `GET /users/` → Handles user list.
- `GET /posts/` → Handles post list.

---

## 🔹 Summary 📝

| Concept | Description |
|---------|------------|
| `.route()` | Groups multiple HTTP methods under a single route |
| `router.use()` | Applies **global middleware** to all routes in the router |
| Middleware Order | **Global Middleware → Route-Specific Middleware → Route Handler → Error Middleware** |
| Nested Routers | Mount routers within routers for better structure |

By following these best practices, you can **organize routes effectively** and **scale your Express app efficiently**. 🚀

---

### **✅ Next Steps:**
Would you like examples of **authentication middleware** or **request validation** with Express? 🤔 Let me know! 
