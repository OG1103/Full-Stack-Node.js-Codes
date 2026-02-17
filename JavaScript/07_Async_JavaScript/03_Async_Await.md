# JavaScript Async/Await

`async` and `await` are built on top of Promises and provide a cleaner, more readable way to write asynchronous code that looks synchronous.

---

## 1. Async Functions

An `async` function **always returns a Promise**. Even if you return a non-promise value, it is automatically wrapped in a resolved Promise.

```javascript
async function getData() {
  return "Hello, World!";
}

// Equivalent to:
function getData() {
  return Promise.resolve("Hello, World!");
}

getData().then(result => console.log(result)); // "Hello, World!"
```

### Return Value = Resolve Value

```javascript
async function getUser() {
  return { name: "Alice", age: 30 }; // Automatically wrapped in Promise.resolve()
}

getUser().then(user => console.log(user.name)); // "Alice"
```

### Throwing = Rejecting

```javascript
async function failingFunction() {
  throw new Error("Something went wrong");
  // Equivalent to: return Promise.reject(new Error("Something went wrong"));
}

failingFunction().catch(err => console.error(err.message));
// "Something went wrong"
```

---

## 2. The `await` Keyword

`await` pauses the execution of the async function until the Promise settles (resolves or rejects).

### Key Rules

- `await` can **only be used inside an `async` function** (or at the top level of ES modules)
- It pauses only the **current async function**, not the entire program
- The main thread continues running other code while the function is paused
- If the awaited Promise resolves, `await` returns the resolved value
- If the awaited Promise rejects, `await` throws the rejection reason

```javascript
async function fetchData() {
  console.log("Start fetching...");

  const response = await fetch("https://api.example.com/data");
  // Execution pauses here until fetch completes
  // Main thread continues running other code

  const data = await response.json();
  // Pauses again until JSON parsing completes

  console.log("Data received:", data);
  return data;
}
```

---

## 3. Error Handling with try/catch

Since `await` throws on rejection, use `try/catch` for error handling.

```javascript
async function fetchUser(id) {
  try {
    const response = await fetch(`https://api.example.com/users/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const user = await response.json();
    console.log("User:", user);
    return user;

  } catch (error) {
    console.error("Failed to fetch user:", error.message);
    // Can re-throw, return default value, or handle gracefully
    return null;
  } finally {
    console.log("Fetch attempt completed");
    // Runs regardless of success or failure
  }
}
```

### Error Propagation

Errors propagate up through async function chains. You can catch at any level.

```javascript
async function getUser() {
  const response = await fetch("/api/user"); // May throw
  return response.json();
}

async function getUserPosts() {
  const user = await getUser(); // If getUser throws, this throws too
  const posts = await fetch(`/api/posts?userId=${user.id}`);
  return posts.json();
}

async function main() {
  try {
    const posts = await getUserPosts(); // Catch errors from entire chain
    console.log(posts);
  } catch (error) {
    console.error("Something failed:", error.message);
  }
}
```

---

## 4. Calling Async Functions

### With `await` (Pauses Until Complete)

```javascript
async function main() {
  const result = await fetchUser(1);
  console.log("Got result:", result);
  // This line runs AFTER fetchUser completes
}
```

### Without `await` (Runs in Background)

```javascript
function main() {
  fetchUser(1); // Runs in background, doesn't pause
  console.log("This runs immediately, before fetchUser completes");
}
```

### With `.then()` (Alternative)

```javascript
fetchUser(1).then(result => {
  console.log("Got result:", result);
});
```

---

## 5. Sequential vs Parallel Execution

### Sequential (One After Another)

Each request waits for the previous one to complete. Slower but necessary when requests depend on each other.

```javascript
async function sequential() {
  const user = await fetchUser(1);         // ~1 second
  const posts = await fetchPosts(user.id); // ~1 second (depends on user)
  const comments = await fetchComments(posts[0].id); // ~1 second
  // Total: ~3 seconds
}
```

### Parallel (All at Once)

Use `Promise.all()` when requests are independent of each other. Much faster.

```javascript
async function parallel() {
  // Start all requests simultaneously
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),     // ~1 second
    fetchPosts(),     // ~1 second
    fetchComments()   // ~1 second
  ]);
  // Total: ~1 second (all run concurrently)
}
```

### Mixed (Start Together, Use Results)

```javascript
async function mixed() {
  // Start independent requests in parallel
  const userPromise = fetchUser(1);
  const settingsPromise = fetchSettings();

  // Await them when you need the results
  const user = await userPromise;
  const settings = await settingsPromise;

  // Sequential request that depends on user
  const posts = await fetchPosts(user.id);
}
```

---

## 6. Promise.all with Async/Await

### Wait for All (Fail Fast)

```javascript
async function fetchAllData() {
  try {
    const [users, products, orders] = await Promise.all([
      fetch("/api/users").then(r => r.json()),
      fetch("/api/products").then(r => r.json()),
      fetch("/api/orders").then(r => r.json())
    ]);
    return { users, products, orders };
  } catch (error) {
    // If ANY request fails, Promise.all rejects immediately
    console.error("One of the requests failed:", error);
  }
}
```

### Wait for All (Get All Results)

```javascript
async function fetchAllSafely() {
  const results = await Promise.allSettled([
    fetch("/api/users").then(r => r.json()),
    fetch("/api/products").then(r => r.json()),
    fetch("/api/orders").then(r => r.json())
  ]);

  // Check each result individually
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`Request ${index} succeeded:`, result.value);
    } else {
      console.error(`Request ${index} failed:`, result.reason);
    }
  });
}
```

---

## 7. Top-Level Await (ES2022)

In ES modules, you can use `await` at the top level without wrapping in an async function.

```javascript
// In an ES module (.mjs or type="module")
const response = await fetch("/api/config");
const config = await response.json();

export default config;
```

> **Note**: Only works in ES modules, not in regular scripts or CommonJS.

---

## 8. Async/Await in Loops

### Sequential Loop (One at a Time)

```javascript
async function processSequentially(ids) {
  const results = [];
  for (const id of ids) {
    const result = await fetchUser(id); // Waits for each
    results.push(result);
  }
  return results;
}
```

### Parallel Loop (All at Once)

```javascript
async function processInParallel(ids) {
  const promises = ids.map(id => fetchUser(id)); // Start all
  const results = await Promise.all(promises);   // Wait for all
  return results;
}
```

> **Warning**: `forEach` does NOT work properly with async/await. Use `for...of` for sequential or `Promise.all` with `.map()` for parallel.

```javascript
// BAD - forEach doesn't await properly
ids.forEach(async (id) => {
  await fetchUser(id); // These all fire at once, forEach doesn't wait
});
console.log("Done"); // Runs before any fetch completes!

// GOOD - for...of waits for each iteration
for (const id of ids) {
  await fetchUser(id); // Properly sequential
}
console.log("Done"); // Runs after all fetches complete
```

---

## 9. Async/Await in Express.js

In Express, async controller functions handle requests without blocking the server.

```javascript
// Async controller
async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

// Route - no need to await when passing to Express
app.get("/users/:id", getUserById);
// Express calls the function; it returns a Promise that Express handles
```

**Why no `await` in the route?**
- Express calls the async function, which returns a Promise
- The function runs asynchronously without blocking the server
- Only the code inside the controller pauses at `await` points
- Other requests continue to be handled normally

---

## 10. Common Mistakes

### Forgetting `await`

```javascript
// BAD - response is a Promise, not the actual data
async function bad() {
  const response = fetch("/api/data"); // Missing await!
  const data = response.json(); // TypeError: response.json is not a function
}

// GOOD
async function good() {
  const response = await fetch("/api/data");
  const data = await response.json();
}
```

### Using `await` Outside Async Function

```javascript
// BAD - SyntaxError
function regular() {
  const data = await fetchData(); // Cannot use await in regular function
}

// GOOD
async function asyncFunc() {
  const data = await fetchData();
}
```

### Not Handling Errors

```javascript
// BAD - unhandled rejection if fetch fails
async function risky() {
  const data = await fetch("/api/data");
  return data.json();
}

// GOOD - always handle potential errors
async function safe() {
  try {
    const data = await fetch("/api/data");
    return data.json();
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}
```

---

## 11. Summary

| Concept | Description |
|---------|-------------|
| `async function` | Always returns a Promise; enables use of `await` |
| `await` | Pauses async function until Promise settles |
| Return value | Becomes the resolved value of the returned Promise |
| `throw` | Becomes the rejection reason of the returned Promise |
| `try/catch` | Primary error handling mechanism for async/await |
| Sequential | Use `await` one after another (slower, for dependencies) |
| Parallel | Use `Promise.all()` with `await` (faster, for independent tasks) |
| Loops | Use `for...of` for sequential; `Promise.all` + `.map()` for parallel |
| Express | No `await` needed in route definitions; use inside controllers |
