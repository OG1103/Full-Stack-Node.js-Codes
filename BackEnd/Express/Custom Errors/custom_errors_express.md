
# Custom Errors in Express

Creating custom errors in an Express.js application can improve error handling, make error responses consistent, and simplify debugging. This guide covers how to create custom error classes, a centralized error-handling middleware, and how to utilize them in controllers.

---

## 1. Creating Custom Error Classes

You can create custom error classes by extending the built-in `Error` class.

```javascript
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

class InternalServerError extends Error {
  constructor(message = "Internal Server Error") {
    super(message);
    this.name = "InternalServerError";
    this.statusCode = 500;
  }
}

module.exports = { NotFoundError, BadRequestError, InternalServerError };
```

---

## 2. Centralized Error-Handling Middleware

Create an error-handling middleware that captures errors thrown in your controllers and sends a consistent response.

```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};

module.exports = errorHandler;
```

---

## 3. Utilizing Custom Errors in Controllers

In your controllers, you can throw custom errors based on specific conditions.

```javascript
const { NotFoundError, BadRequestError } = require("../errors/customErrors");

const getTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    res.status(200).json({ status: "success", task });
  } catch (err) {
    next(err); // Pass the error to the error-handling middleware
  }
};
```

---

## 4. Using the Error-Handling Middleware

In your main application file (`app.js` or `server.js`), add the error-handling middleware after all routes.

```javascript
const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorHandler");

// Other routes and middlewares...

// Error-handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Summary

- **Custom Error Classes**: Allow you to define errors with specific names and status codes.
- **Centralized Error-Handling Middleware**: Ensures consistent error responses.
- **Utilizing Custom Errors**: Helps in throwing meaningful errors from controllers and propagating them properly.

By following these steps, you can build a robust error-handling mechanism in your Express.js application.
