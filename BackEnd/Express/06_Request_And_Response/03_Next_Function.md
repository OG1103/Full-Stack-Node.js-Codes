# The `next()` Function in Express

## Table of Contents

- [Overview](#overview)
- [How next() Passes Control](#how-next-passes-control)
- [Middleware Chain Flow](#middleware-chain-flow)
- [What Happens Without next()](#what-happens-without-next)
- [Express Auto-Passes req, res, and next](#express-auto-passes-req-res-and-next)
- [next('route') - Skip Remaining Handlers](#nextroute---skip-remaining-handlers)
- [next(err) - Error Forwarding](#nexterr---error-forwarding)
- [Common Mistakes](#common-mistakes)
- [Visual Flow Diagram](#visual-flow-diagram)

---

## Overview

`next()` is a function provided by Express that, when called, passes control from the current middleware or route handler to the **next** matching middleware or route handler in the stack. It is the mechanism that allows Express to chain multiple functions together to process a single request.

```js
import express from "express";
const app = express();

// Middleware function
app.use((req, res, next) => {
  console.log("Middleware executed");
  next(); // Pass control to the next handler
});

app.get("/", (req, res) => {
  res.json({ message: "Home" });
});
```

Without `next()`, the request processing pipeline stops at the current handler (unless a response is sent). With `next()`, the request flows through each handler in sequence until one sends a response.

---

## How next() Passes Control

When Express receives a request, it matches it against registered middleware and routes **in the order they were defined**. Each handler can do one of three things:

1. **Send a response** (`res.json()`, `res.send()`, etc.) -- ends the cycle.
2. **Call `next()`** -- passes control to the next matching handler.
3. **Do nothing** -- the request hangs indefinitely (this is a bug).

```js
// Handler 1: runs first
app.use((req, res, next) => {
  console.log("Step 1: Logger");
  next(); // Move to Step 2
});

// Handler 2: runs second
app.use((req, res, next) => {
  console.log("Step 2: Auth check");
  next(); // Move to Step 3
});

// Handler 3: runs third -- sends response
app.get("/", (req, res) => {
  console.log("Step 3: Route handler");
  res.json({ message: "Done" }); // End of cycle -- no next() needed
});
```

Output for `GET /`:
```
Step 1: Logger
Step 2: Auth check
Step 3: Route handler
```

---

## Middleware Chain Flow

Middleware functions form a chain. Each function in the chain has access to the same `req` and `res` objects, so earlier middleware can attach data that later handlers use.

```js
import express from "express";
const app = express();

// Middleware 1: Add a timestamp to the request
app.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});

// Middleware 2: Log the request
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} at ${req.requestTime}`);
  next();
});

// Middleware 3: Authentication check
app.use((req, res, next) => {
  const token = req.get("Authorization");
  if (!token) {
    // Send response and stop the chain -- do NOT call next()
    return res.status(401).json({ error: "No token provided" });
  }
  req.user = { id: 1, name: "Alice" }; // Attach user data for later use
  next();
});

// Route handler: uses data from middleware
app.get("/profile", (req, res) => {
  res.json({
    user: req.user,           // Set by Middleware 3
    requestTime: req.requestTime, // Set by Middleware 1
  });
});

app.listen(3000);
```

---

## What Happens Without next()

If a middleware function does not call `next()` **and** does not send a response, the request **hangs**. The client waits forever (until it times out), and no further handlers run.

```js
// BUG: This middleware does not call next() or send a response
app.use((req, res, next) => {
  console.log("This runs...");
  // Neither next() nor res.send() is called
  // The request HANGS here -- the client gets no response
});

app.get("/", (req, res) => {
  // This NEVER runs
  res.json({ message: "You will never see this" });
});
```

This is one of the most common Express mistakes. Every middleware **must** either:
- Call `next()` to continue the chain, OR
- Send a response to end the cycle.

---

## Express Auto-Passes req, res, and next

You do not create `req`, `res`, or `next` yourself. Express creates them internally and passes them to every middleware and route handler automatically.

```js
// Express calls this function like:
// handler(reqObject, resObject, nextFunction)
app.use((req, res, next) => {
  // req, res, and next are provided by Express automatically
  // You just define the function signature to receive them
  next();
});

// For route handlers, next is optional in the signature.
// But Express still passes it -- you just choose not to receive it.
app.get("/", (req, res) => {
  // next is available if you add it to the parameter list
  res.json({ message: "Hello" });
});

// Same handler explicitly receiving next
app.get("/other", (req, res, next) => {
  // next is available here too
  res.json({ message: "Hello" });
});
```

### How Express Knows the Difference

Express uses `function.length` (the number of declared parameters) to distinguish between regular middleware/handlers and error-handling middleware:

- **3 parameters** `(req, res, next)` -- regular middleware or route handler.
- **4 parameters** `(err, req, res, next)` -- error-handling middleware.

This distinction matters and is covered in the error forwarding section below.

---

## next('route') - Skip Remaining Handlers

When you define multiple handler functions for the same route, `next('route')` skips the remaining handlers **on that specific route** and jumps to the next matching route.

### Multiple Handlers on One Route

```js
app.get(
  "/user/:id",
  // Handler 1: Validate
  (req, res, next) => {
    const { id } = req.params;
    if (isNaN(Number(id))) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    next(); // Continue to Handler 2
  },
  // Handler 2: Respond
  (req, res) => {
    res.json({ user: { id: req.params.id, name: "Alice" } });
  }
);
```

### Using next('route') to Skip Handlers

```js
app.get(
  "/user/:id",
  // Handler 1: Check for special case
  (req, res, next) => {
    if (req.params.id === "admin") {
      // Skip Handler 2 and Handler 3 of THIS route
      // Jump to the next app.get("/user/:id", ...) or next middleware
      return next("route");
    }
    next(); // Continue to Handler 2
  },
  // Handler 2: runs only if id is NOT "admin"
  (req, res) => {
    res.json({ user: { id: req.params.id } });
  }
);

// This route catches the "admin" case because next('route') skipped the above
app.get("/user/:id", (req, res) => {
  res.json({ admin: true, message: "Admin panel" });
});
```

### Important Limitation

`next('route')` only works with route handlers defined using `app.get()`, `app.post()`, `app.put()`, etc. It does **not** work with `app.use()` middleware.

---

## next(err) - Error Forwarding

Passing any argument to `next()` (except the string `'route'`) tells Express that an error has occurred. Express then skips all remaining regular middleware and routes and jumps directly to the **error-handling middleware**.

```js
import express from "express";
const app = express();

app.use(express.json());

app.get("/user/:id", (req, res, next) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    // Create an error and forward it
    const error = new Error("Invalid user ID");
    error.statusCode = 400;
    return next(error); // Jump to error-handling middleware
  }

  res.json({ id: Number(id), name: "Alice" });
});

// This middleware is SKIPPED when next(err) is called
app.use((req, res, next) => {
  console.log("This does NOT run after an error");
  next();
});

// Error-handling middleware: must have exactly 4 parameters
app.use((err, req, res, next) => {
  console.error("Error caught:", err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message,
  });
});

app.listen(3000);
```

### The 4-Parameter Signature Is Required

Express identifies error-handling middleware **solely** by its 4-parameter function signature. Even if you do not use the `next` parameter, you must declare it.

```js
// CORRECT: 4 parameters -- Express recognizes this as error middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// WRONG: 3 parameters -- Express treats this as regular middleware
app.use((err, req, res) => {
  // This is NOT error middleware. Express interprets:
  // err as req, req as res, res as next
  res.status(500).json({ error: err.message }); // Will not work as expected
});
```

---

## Common Mistakes

### Mistake 1: Calling next() After Sending a Response

```js
// BUG: Calling next after response causes "headers already sent" error
app.use((req, res, next) => {
  res.json({ message: "Done" });
  next(); // ERROR: response already sent, next handler may try to respond again
});

// FIX: Do not call next() after sending a response
app.use((req, res, next) => {
  res.json({ message: "Done" });
  // No next() -- the cycle ends here
});
```

### Mistake 2: Forgetting to Return After Conditional Response

```js
// BUG: Code continues to execute after res.status(401) because there is no return
app.use((req, res, next) => {
  if (!req.get("Authorization")) {
    res.status(401).json({ error: "Unauthorized" });
    // Execution continues to next() below!
  }
  next(); // This runs even after sending the 401 response
});

// FIX: Use return to stop execution
app.use((req, res, next) => {
  if (!req.get("Authorization")) {
    return res.status(401).json({ error: "Unauthorized" });
    // return stops execution -- next() is never reached
  }
  next();
});
```

### Mistake 3: Forgetting next() Entirely

```js
// BUG: Request hangs because neither next() nor a response is sent
app.use((req, res, next) => {
  console.log("Logging...");
  // Forgot next() -- request hangs forever
});

// FIX: Always call next() if you are not sending a response
app.use((req, res, next) => {
  console.log("Logging...");
  next();
});
```

### Mistake 4: Error Middleware with Wrong Parameter Count

```js
// BUG: Only 3 parameters -- Express does NOT treat this as error middleware
app.use((err, req, res) => {
  res.status(500).json({ error: err.message });
});

// FIX: Must have exactly 4 parameters
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

---

## Visual Flow Diagram

The following text diagram shows how a request flows through an Express application when `next()` is called at each step.

### Normal Flow (No Errors)

```
Client sends GET /profile
        |
        v
+---------------------------+
|  Middleware 1: Logger      |
|  console.log("Request")   |
|  next()  ----------------->
+---------------------------+
        |
        v
+---------------------------+
|  Middleware 2: Auth Check  |
|  Token valid?              |
|  YES -> next() ----------->
+---------------------------+
        |
        v
+---------------------------+
|  Route: GET /profile       |
|  res.json({ user })       |
|  (response sent, chain    |
|   ends here)              |
+---------------------------+
        |
        v
   Response sent to client
```

### Flow When Middleware Stops the Chain

```
Client sends GET /profile (no auth token)
        |
        v
+---------------------------+
|  Middleware 1: Logger      |
|  console.log("Request")   |
|  next()  ----------------->
+---------------------------+
        |
        v
+---------------------------+
|  Middleware 2: Auth Check  |
|  Token valid?              |
|  NO -> res.status(401)     |
|  (response sent, chain    |
|   ends here)              |
+---------------------------+           +---------------------------+
                                        |  Route: GET /profile       |
        X  (never reached)              |  NEVER EXECUTES            |
                                        +---------------------------+
        |
        v
   401 Response sent to client
```

### Flow with Error Forwarding

```
Client sends GET /user/abc
        |
        v
+---------------------------+
|  Middleware 1: Logger      |
|  next()  ----------------->
+---------------------------+
        |
        v
+---------------------------+
|  Route: GET /user/:id      |
|  "abc" is not a number     |
|  next(error) ------------->  (skips all regular middleware)
+---------------------------+
        |
        |    Skips Middleware 3, Middleware 4, etc.
        |
        v
+---------------------------+
|  Error Middleware           |
|  (err, req, res, next)     |
|  res.status(400).json(err) |
+---------------------------+
        |
        v
   400 Response sent to client
```

### Summary

| Call           | Effect                                                          |
| -------------- | --------------------------------------------------------------- |
| `next()`       | Pass control to the next matching middleware or route handler    |
| `next('route')`| Skip remaining handlers on this route, jump to next route match |
| `next(err)`    | Skip all regular handlers, jump to error-handling middleware     |
| No `next()` and no response | Request **hangs** -- this is a bug                |
