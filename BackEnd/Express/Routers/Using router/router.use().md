# 📘 Express.js `router.use()` Middleware Guide

Express uses `router.use()` to apply middleware functions. You can apply middleware to all routes, specific paths, or entire sub-routers. Middleware runs in the order it's defined.

---

## ✅ 1. Global Middleware (All Routes)

Apply middleware to every route in the router.

### 📌 Example:

```js
const router = express.Router();

router.use(authenticate); // Applies to everything below

router.get("/profile", getProfile);
router.post("/settings", updateSettings);
```

🟢 `authenticate` runs for all routes defined after it in this router.

---

## ✅ 2. Middleware for a Specific Path

Applies middleware **only** to routes that start with the given path.

### 📌 Example:

```js
router.use("/address", authenticate);
```

### ✅ This applies to:

```js
router.get("/address", getAllAddresses);           // ✅ middleware runs
router.post("/address", createAddress);            // ✅ middleware runs
router.patch("/address/:id", updateAddress);       // ✅ middleware runs
router.delete("/address/:id", deleteAddress);      // ✅ middleware runs
```

### ❌ This does NOT apply to:

```js
router.get("/profile", getProfile);                // ❌ middleware skipped
router.post("/wishlist", addToWishlist);           // ❌ middleware skipped
```

---

## ✅ 3. Route-Specific Middleware

Apply middleware directly to a specific route.

### 📌 Example:

```js
router.get("/profile", authenticate, getProfile);
router.post("/settings", authenticate, updateSettings);
```

Or use `.route()` for multiple methods:

```js
router.route("/settings")
  .all(authenticate) // runs for all methods
  .get(getSettings)
  .post(updateSettings);
```

---

## ✅ 4. Mounting Sub-Routers

Mount an entire router under a path and apply middleware to it.

### 📌 Example:

```js
const adminRouter = express.Router();

adminRouter.get("/dashboard", getAdminDashboard);

app.use("/admin", authenticateAdmin, adminRouter);
```

🟢 `authenticateAdmin` runs for all `/admin/*` routes.

---

## ✅ 5. Nested Routers (Routers inside Routers)

You can use `router.use()` to nest a router within another router.

### 📌 Example:

```js
const wishlistRouter = express.Router();
wishlistRouter.get("/", getWishlist);
wishlistRouter.post("/", addToWishlist);

const userRouter = express.Router();
userRouter.use("/wishlist", authenticate, wishlistRouter);

app.use("/user", userRouter);
```

### ✅ This structure supports:

* `GET /user/wishlist` → passes through `authenticate` → `getWishlist`
* `POST /user/wishlist` → passes through `authenticate` → `addToWishlist`

---

## ✅ 6. Middleware Order Matters

Middleware runs in the order it’s defined. If you define middleware **after** a route, it won’t affect that route.

### 📌 Example:

```js
app.use(logger);                   // logs every request

app.use("/admin", authenticate);  // runs only on /admin routes

app.get("/profile", (req, res) => {
  console.log("Handling /profile");
  res.send("Public profile");
});

app.get("/admin/dashboard", (req, res) => {
  console.log("Handling /admin/dashboard");
  res.send("Admin dashboard");
});
```

---

### 🧪 Request: `/profile`

**Console Output:**

```
🪵 Logger: Request made to /profile
👤 Handling /profile
```

✅ Logger runs
❌ Admin middleware skipped
✅ Profile route runs

---

### 🧪 Request: `/admin/dashboard`

**Console Output:**

```
🪵 Logger: Request made to /admin/dashboard
🔒 Admin auth check
📊 Handling /admin/dashboard
```

✅ Logger runs
✅ Admin middleware runs
✅ Route handler runs

---

## ✅ Summary Table

| Use Case                   | Syntax Example                                      | Applies To                      |
| -------------------------- | --------------------------------------------------- | ------------------------------- |
| Global middleware          | `router.use(auth)`                                  | All routes in router            |
| Middleware for path prefix | `router.use("/address", auth)`                      | Routes starting with `/address` |
| Route-specific middleware  | `router.get("/x", auth, handler)`                   | Only that one route             |
| All methods on a route     | `router.route("/x").all(auth)`                      | Every HTTP method on `/x`       |
| Sub-router + middleware    | `app.use("/admin", auth, adminRouter)`              | All `/admin/*` routes           |
| Nested router              | `userRouter.use("/wishlist", auth, wishlistRouter)` | `/user/wishlist/*`              |
| Middleware after route     | ❌ Will not run                                      | Must be defined before route    |

---

Let me know if you'd like a visual diagram of how middleware flows across routers and nested routers!
