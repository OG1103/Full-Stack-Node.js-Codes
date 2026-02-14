# Process-Level Error Handling

Some errors occur outside Express middleware — uncaught exceptions and unhandled promise rejections. Node.js provides process-level events to catch these before they crash your application.

---

## 1. uncaughtException

Triggered when a **synchronous error** is thrown and not caught anywhere in the application.

```javascript
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.message);
  console.error(err.stack);
  process.exit(1); // Exit - app is in an unknown state
});
```

### When It Triggers

```javascript
// Error thrown outside try-catch or Express middleware
const user = undefined;
console.log(user.name); // TypeError - uncaughtException fires

// Error in a setTimeout (outside Express request cycle)
setTimeout(() => {
  throw new Error('Async throw outside Express');
}, 1000);
```

### Why Exit?

After an uncaught exception, the application is in an **unknown state**. Continuing to run may cause data corruption or unpredictable behavior. Always exit and let a process manager (PM2, Docker) restart the app.

---

## 2. unhandledRejection

Triggered when a **Promise rejects** and no `.catch()` or `try...catch` handles it.

```javascript
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err.message);
  console.error(err.stack);
  process.exit(1);
});
```

### When It Triggers

```javascript
// Promise rejected without .catch()
Promise.reject(new Error('Forgot to catch this'));

// Async function without try-catch (outside Express)
async function connectDB() {
  await mongoose.connect('mongodb://invalid-host');
  // If connection fails, no catch -> unhandledRejection
}
connectDB();
```

---

## 3. Production Setup

In production, combine both handlers with graceful shutdown:

```javascript
import express from 'express';
import mongoose from 'mongoose';

const app = express();

// Start server
const server = app.listen(3000, () => {
  console.log('Server running on port 3000');
});

// Uncaught Exception Handler
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Unhandled Rejection Handler
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);

  // Close server gracefully, then exit
  server.close(() => {
    process.exit(1);
  });
});
```

### Graceful Shutdown

When handling `unhandledRejection`, close the server first so in-flight requests can complete:

```javascript
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err.message);

  // 1. Stop accepting new connections
  server.close(async () => {
    // 2. Close database connections
    await mongoose.connection.close();

    // 3. Exit process
    process.exit(1);
  });

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    console.error('Forced shutdown');
    process.exit(1);
  }, 10000);
});
```

---

## 4. SIGTERM Handling

Cloud platforms (Heroku, AWS, Docker) send `SIGTERM` to gracefully stop your app:

```javascript
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');

  server.close(() => {
    console.log('Process terminated');
  });
});
```

---

## 5. Complete Example

```javascript
import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Express error handler (catches errors within request cycle)
app.use((err, req, res, next) => {
  console.error('Express Error:', err.message);
  res.status(err.statusCode || 500).json({ error: err.message });
});

// Start server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});

// Process-level handlers (catches errors outside request cycle)
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  server.close(() => console.log('Process terminated'));
});
```

---

## 6. Summary

| Event | Triggers When | Action |
|-------|--------------|--------|
| `uncaughtException` | Sync error thrown and not caught | Log and exit immediately |
| `unhandledRejection` | Promise rejected without `.catch()` | Log, close server, exit |
| `SIGTERM` | Platform requests shutdown | Close server gracefully |

### Key Points

1. **Always log** process-level errors before exiting
2. **Always exit** after uncaught exceptions — the app state is unreliable
3. **Use graceful shutdown** to let in-flight requests complete
4. **Use a process manager** (PM2, Docker, systemd) to auto-restart after crashes
5. **These handlers are a safety net** — your goal is to handle all errors properly so they never fire
