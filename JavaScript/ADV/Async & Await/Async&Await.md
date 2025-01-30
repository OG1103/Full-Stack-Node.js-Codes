# Overview of `async` and `await` in JavaScript

## Introduction
`async` and `await` are used in JavaScript to handle **asynchronous operations**, simplifying the code by making it more readable and easier to work with than using raw **Promises** or **callback functions**. They are built on top of Promises but allow you to write asynchronous code in a way that looks synchronous.

---

## What is an `async` Function?

### Key Points:
- An **`async` function** is a function that always returns a **Promise**.
- Even if you explicitly return a non-promise value, it will automatically be wrapped in a resolved Promise.
- The return value in an async function = the resolve value in a promise.
- To **reject** a promise in an async function, you throw a new error.
- Async functions provide a simpler way to create promises.
- You can later call/await that async function in another async function.

### Example:
```javascript
async function getData() {
    return "Hello, World!";
}

getData().then(result => console.log(result));  // Logs: Hello, World!
```

In this example:
- Even though `getData` returns a string, it's automatically wrapped in a resolved Promise.

---

## What is `await`?

### Key Points:
- `await` is used to **wait for a Promise to settle** (resolve or reject).
- When `await` is placed in front of a promise, the **async function** pauses at that point, waits for the promise to resolve or reject, and then resumes with the resolved value or error.
- The Promise that `await` pauses for can be the result of another **async function** or any function that returns a Promise.
- **Meanwhile, the main thread of your application continues running**, so other code can execute in parallel.
- `await` can only be used **inside an async function**.
- If the promise is rejected, it throws an error that can be caught by a `try...catch` block.

### Why Use `await` Inside an `async` Function?
- Async functions are specifically designed to work with Promises.
- `await` is a keyword that **pauses the execution** of an async function until a Promise is resolved or rejected.

### Example:
```javascript
async function fetchData() {
    try {
        const response = await fetch("https://api.example.com/data");
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
fetchData();
```

---

## Explanation of `async/await` and `try-catch`

### Success Scenario:
- When a Promise resolves successfully, the code after `await` continues to execute, and the value returned by the promise is assigned to a variable.

### Error Scenario:
- If the Promise rejects or an error is thrown, the error is passed to the `catch` block.
- The error is handled in the `catch` block, preventing your application from crashing.

### Example:
```javascript
async function fetchData() {
    try {
        const response = await fetch("https://api.example.com/data");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data received:", data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
```

---

## Breakdown of `async` and `await`

### 1. `async`
- The `async` keyword before a function means the function will **return a promise**.
- Inside the function, you can use `await` to handle promises synchronously.

### 2. `await`
- `await` must be used inside an `async` function.
- `await` pauses the execution of the function until the promise resolves or rejects.
- If the promise resolves, it returns the resolved value.
- If the promise rejects, it throws an error, which can be caught by the `catch` block.

### Example:
```javascript
async function getData() {
    const result = await fetchData();  // Pauses until fetchData() resolves
    console.log(result);  // Logs the resolved value of the promise
}
```

---

## Calling an `async` Function

### Scenario 1: Calling an Async Function with `await`
- When you call an async function with `await`, the execution of the code pauses until the promise returned by the async function is resolved or rejected.
- If the promise resolves, the value is stored in a variable.
- If the promise rejects, control passes to the `catch` block.

### Example:
```javascript
async function main() {
    try {
        const result = await getData();
        console.log("Result:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}
main();
```

### Scenario 2: Calling an Async Function Without `await`
- When you call an async function without `await`, the function still returns a promise, but the rest of the code does not wait for the promise to resolve.
- This is useful when you want to run multiple asynchronous operations concurrently or when you don't need to wait for the async function's result.
- Without `await`, the async function runs in the background, and any errors inside it will be handled within the function itself (if a `try/catch` block is present).

### Example:
```javascript
async function logMessage() {
    console.log("Message logged after 2 seconds");
}

function main() {
    logMessage();  // Runs asynchronously in the background
    console.log("This message logs immediately");
}
main();
```

---

## Error Handling Tip:
When you have a chain of async functions calling each other, you can propagate any errors that occur in the lower-level functions (by re-throwing them) up the chain to the last async function, where you can handle them in a `try/catch` block.

---

## Calling Async Controller Functions in Express Routes

### Key Points:
- In **Express.js**, when you define a route and pass an async controller function to handle requests, you **do not need to use `await` in the route itself**.
- The reason is that the async controller function runs in the background while the rest of the application continues executing.
- Once the controller function resolves or rejects, it sends the response back to the client.
- If the controller function is awaiting a promise within it, only that controller function pauses until the nested promise resolves or rejects. This does not affect the main thread or the rest of the application.

### Example:
```javascript
// Async controller function
async function getUserData(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send("Server error");
    }
}

// Route definition
app.get("/users/:id", getUserData);
```

In this example:
- The async controller function `getUserData` handles the request asynchronously.
- Express waits for the Promise returned by `getUserData` to settle before sending the response to the client.
- Since the controller handles errors internally using `try/catch`, the rest of the application continues running without interruption.

---

## Summary
- `async` functions always return a promise, and you can use `await` inside them to pause execution until a promise resolves or rejects.
- `try/catch` blocks are used for error handling in async functions.
- When calling async functions without `await`, they run in the background, allowing other code to execute concurrently.
- In Express.js, async controller functions can handle asynchronous operations without blocking the main thread, ensuring smooth application performance.

---

## References
- [MDN Web Docs - async/await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises)
- [Node.js Documentation](https://nodejs.org/en/docs/)
