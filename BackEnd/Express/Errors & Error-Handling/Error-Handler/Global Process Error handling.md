Here’s a `.md` file that explains `uncaughtException` and `unhandledRejection` in Node.js, complete with examples and best practices.

---

# Global Error Handling in Node.js: `uncaughtException` and `unhandledRejection`

In Node.js applications, some errors may occur outside of `try...catch` blocks or may go unhandled in promises. To capture these, Node.js provides two important process-level events:

---

## 🔹 1. `uncaughtException`

This event is triggered when a **synchronous error** is thrown and **not caught** anywhere in your application.

### Example

```js
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

throw new Error("This will crash the app");
````

### Use Case

* Logs any critical uncaught error in your app.
* Common in server-side applications to trace unexpected crashes.

### ⚠️ Important

The app may become unstable after an uncaught exception. Best practice is to log the error and **exit the process**:

```js
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});
```

---

## 🔹 2. `unhandledRejection`

This event is triggered when a **Promise is rejected** and there is no `.catch()` handler.

### Example

```js
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});

Promise.reject(new Error("Forgot to catch this!"));
```

### Use Case

* Detect and log promise rejections that would otherwise be silent.
* Prevent issues caused by forgotten or improperly chained `.catch()` blocks.

### Best Practice

Also log the error and **exit the process** to avoid unknown states:

```js
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  process.exit(1);
});
```

---

## ✅ Summary

| Event                | Triggers When                            | Example                               |
| -------------------- | ---------------------------------------- | ------------------------------------- |
| `uncaughtException`  | Sync error is thrown and not caught      | `throw new Error()` outside try-catch |
| `unhandledRejection` | A Promise is rejected without `.catch()` | `Promise.reject()` with no handler    |

---

## 🛡 Recommended Practice

For production environments:

* Always log these errors.
* Perform necessary cleanup (e.g. closing DB connections).
* Exit the process after logging to prevent the app from running in a corrupted state.

```js
process.on("uncaughtException", (err) => {
  console.error("Fatal: Uncaught Exception!", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Fatal: Unhandled Rejection!", err);
  process.exit(1);
});
```
```
