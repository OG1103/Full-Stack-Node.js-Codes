
// Custom Error Classes
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

// Error-Handling Middleware
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

// Example Controller Utilizing Custom Errors
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
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new BadRequestError("Task name is required");
    }

    const newTask = new Task({ name });
    await newTask.save();

    res.status(201).json({ status: "success", task: newTask });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTask, createTask };

// Main Application File (app.js)
const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorHandler");
const taskRoutes = require("./routes/taskRoutes");

app.use(express.json());

// Task routes
app.use("/tasks", taskRoutes);

// Error-handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
