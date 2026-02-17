# Promises in JavaScript

A Promise is an object that represents the eventual completion or failure of an asynchronous operation and its resulting value. Introduced in ES2015 (ES6), Promises replaced the callback pattern as the standard way to handle asynchronous code in JavaScript, providing a cleaner, more composable, and more predictable API.

---

## Table of Contents

1. [What Is a Promise](#1-what-is-a-promise)
2. [Promise States](#2-promise-states)
3. [Creating Promises](#3-creating-promises)
4. [Consuming Promises: .then(), .catch(), .finally()](#4-consuming-promises-then-catch-finally)
5. [Promise Chaining](#5-promise-chaining)
6. [Error Propagation in Promise Chains](#6-error-propagation-in-promise-chains)
7. [Promise.all()](#7-promiseall)
8. [Promise.allSettled()](#8-promiseallsettled)
9. [Promise.race()](#9-promiserace)
10. [Promise.any()](#10-promiseany)
11. [Promise.resolve() and Promise.reject()](#11-promiseresolve-and-promisereject)
12. [Common Patterns and Anti-Patterns](#12-common-patterns-and-anti-patterns)

---

## 1. What Is a Promise

A Promise is a **proxy for a value that may not be available yet**. Instead of immediately returning a final value, an asynchronous method returns a promise to supply the value at some point in the future.

Think of a Promise like a receipt from a restaurant: you place an order (start an async operation), receive a receipt (the Promise object), and later your order is fulfilled (the Promise resolves) or the kitchen tells you they are out of ingredients (the Promise rejects).

```js
// A function that returns a Promise
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    // Simulate an async database query
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, name: "Alice", email: "alice@example.com" });
      } else {
        reject(new Error("Invalid user ID"));
      }
    }, 1000);
  });
}

// The function returns a Promise object immediately
const promise = fetchUser(1);
console.log(promise); // Promise { <pending> }
```

---

## 2. Promise States

A Promise is always in one of three **mutually exclusive** states:

| State         | Description                                                | Also Called |
| ------------- | ---------------------------------------------------------- | ----------- |
| **Pending**   | Initial state. The async operation has not completed yet.  | Unsettled   |
| **Fulfilled** | The operation completed successfully. The promise has a value. | Resolved    |
| **Rejected**  | The operation failed. The promise has a reason (error).    | Rejected    |

### State Transitions

```
                    ┌─── resolve(value) ───→ FULFILLED (value)
                    │
    PENDING ────────┤
                    │
                    └─── reject(reason) ───→ REJECTED (reason)
```

### Key Rules

1. A promise starts in the **pending** state.
2. It can transition to either **fulfilled** or **rejected** -- but not both.
3. Once a promise is settled (fulfilled or rejected), it **cannot change state again**. The result is immutable.
4. A settled promise is sometimes called **resolved** (meaning its fate is determined).

```js
const promise = new Promise((resolve, reject) => {
  resolve("first");   // Promise is now fulfilled with "first"
  resolve("second");  // Ignored — already settled
  reject("error");    // Ignored — already settled
});

promise.then((value) => {
  console.log(value); // "first"
});
```

---

## 3. Creating Promises

### The Promise Constructor

The `Promise` constructor takes a single argument: an **executor function**. The executor receives two functions as parameters: `resolve` and `reject`.

```js
const promise = new Promise((resolve, reject) => {
  // Perform async work here...
  // Call resolve(value) on success
  // Call reject(reason) on failure
});
```

### Basic Example

```js
const myPromise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Operation completed successfully");
  } else {
    reject(new Error("Operation failed"));
  }
});
```

### Wrapping Callback-Based APIs

One of the most common uses of the Promise constructor is wrapping older callback-based functions:

```js
const fs = require("fs");

// Wrap fs.readFile in a Promise
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        reject(err);    // Reject on error
      } else {
        resolve(data);  // Resolve with file contents
      }
    });
  });
}

// Now you can use it with .then/.catch or async/await
readFilePromise("config.json")
  .then((data) => console.log("Config:", data))
  .catch((err) => console.error("Error:", err.message));
```

### Wrapping setTimeout

```js
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Usage
delay(2000).then(() => console.log("2 seconds have passed"));
```

### The Executor Runs Synchronously

The executor function runs **immediately** when the Promise is created -- it does not wait for `.then()` or `await`:

```js
console.log("Before Promise creation");

const p = new Promise((resolve, reject) => {
  console.log("Inside executor (synchronous)");
  resolve("done");
});

console.log("After Promise creation");

p.then((value) => {
  console.log("In .then() callback:", value);
});

console.log("After .then() registration");

// Output:
// Before Promise creation
// Inside executor (synchronous)
// After Promise creation
// After .then() registration
// In .then() callback: done
```

### Errors in the Executor

If the executor throws an error, the promise is automatically **rejected** with that error:

```js
const promise = new Promise((resolve, reject) => {
  throw new Error("Executor error"); // Equivalent to calling reject(new Error(...))
});

promise.catch((err) => {
  console.log(err.message); // "Executor error"
});
```

---

## 4. Consuming Promises: .then(), .catch(), .finally()

### .then(onFulfilled, onRejected)

`.then()` registers callbacks to be called when the promise settles. It accepts two optional arguments.

```js
promise.then(
  (value) => {
    // Called when the promise is fulfilled
    console.log("Success:", value);
  },
  (reason) => {
    // Called when the promise is rejected (optional)
    console.log("Failure:", reason);
  }
);
```

Typically, only the `onFulfilled` handler is passed to `.then()`, and rejections are handled with `.catch()`.

```js
fetchUser(1).then((user) => {
  console.log("User:", user.name);
});
```

### .catch(onRejected)

`.catch()` registers a callback for when the promise is rejected. It is syntactic sugar for `.then(undefined, onRejected)`.

```js
fetchUser(-1).catch((error) => {
  console.error("Error:", error.message);
});

// Equivalent to:
fetchUser(-1).then(undefined, (error) => {
  console.error("Error:", error.message);
});
```

### .finally(onFinally)

`.finally()` registers a callback that runs when the promise settles, **regardless of whether it was fulfilled or rejected**. The callback receives no arguments and the promise's value passes through unchanged.

```js
let isLoading = true;

fetchUser(1)
  .then((user) => {
    console.log("User:", user.name);
    return user;
  })
  .catch((error) => {
    console.error("Error:", error.message);
  })
  .finally(() => {
    // Runs whether fulfilled or rejected
    isLoading = false;
    console.log("Loading complete. isLoading:", isLoading);
  });
```

### .finally() Passes Through Values

```js
Promise.resolve("hello")
  .finally(() => {
    console.log("Cleanup"); // Runs, but doesn't alter the value
  })
  .then((value) => {
    console.log(value); // "hello" — the value passes through
  });

Promise.reject(new Error("fail"))
  .finally(() => {
    console.log("Cleanup"); // Runs for rejections too
  })
  .catch((error) => {
    console.log(error.message); // "fail" — the error passes through
  });
```

---

## 5. Promise Chaining

Every `.then()`, `.catch()`, and `.finally()` call returns a **new Promise**, enabling chaining. This is what makes Promises so much better than callbacks for sequential async operations.

### Returning Values from .then()

When you return a value from a `.then()` callback, the next `.then()` receives that value:

```js
Promise.resolve(1)
  .then((value) => {
    console.log(value); // 1
    return value + 1;
  })
  .then((value) => {
    console.log(value); // 2
    return value * 3;
  })
  .then((value) => {
    console.log(value); // 6
  });
```

### Returning Promises from .then()

When you return a Promise from a `.then()` callback, the chain waits for that promise to settle before continuing:

```js
function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: "Alice" }), 500);
  });
}

function fetchOrders(userId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve([{ orderId: 101 }, { orderId: 102 }]), 500);
  });
}

function fetchOrderDetails(orderId) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ orderId, item: "Widget", price: 29.99 }), 500);
  });
}

// Chain: fetch user → fetch orders → fetch first order details
fetchUser(1)
  .then((user) => {
    console.log("User:", user.name);
    return fetchOrders(user.id); // Returns a Promise — chain waits
  })
  .then((orders) => {
    console.log("Orders:", orders.length);
    return fetchOrderDetails(orders[0].orderId); // Returns a Promise
  })
  .then((details) => {
    console.log("First order:", details.item, "$" + details.price);
  })
  .catch((error) => {
    console.error("Something failed:", error.message);
  });

// Output (after ~1.5 seconds total):
// User: Alice
// Orders: 2
// First order: Widget $29.99
```

### Chaining Transforms

```js
fetch("https://api.example.com/users/1")
  .then((response) => response.json())           // Parse JSON
  .then((user) => user.name)                      // Extract name
  .then((name) => name.toUpperCase())             // Transform
  .then((upperName) => console.log(upperName))    // Output: "ALICE"
  .catch((err) => console.error(err));
```

---

## 6. Error Propagation in Promise Chains

Errors propagate down the chain until they are caught by a `.catch()` handler. This is similar to how exceptions propagate up the call stack in synchronous code.

### Errors Skip .then() Handlers

```js
Promise.reject(new Error("Initial failure"))
  .then((value) => {
    // SKIPPED — the promise is rejected
    console.log("This never runs");
    return value;
  })
  .then((value) => {
    // SKIPPED — still rejected
    console.log("This never runs either");
    return value;
  })
  .catch((error) => {
    // RUNS — first .catch() in the chain handles the error
    console.log("Caught:", error.message); // "Initial failure"
  });
```

### Error in the Middle of a Chain

```js
Promise.resolve("start")
  .then((value) => {
    console.log(value); // "start"
    return "step 1 done";
  })
  .then((value) => {
    console.log(value); // "step 1 done"
    throw new Error("Step 2 failed!"); // Error thrown here
  })
  .then((value) => {
    // SKIPPED — the chain is in an error state
    console.log("This never runs");
  })
  .catch((error) => {
    console.log("Caught:", error.message); // "Step 2 failed!"
    return "recovered"; // Returning from .catch() resolves the chain
  })
  .then((value) => {
    // RUNS — the chain is recovered
    console.log(value); // "recovered"
  });
```

### Recovery in .catch()

A `.catch()` handler can recover from an error by returning a value. The chain continues as fulfilled:

```js
fetchUser(-1)
  .catch((error) => {
    console.warn("User fetch failed, using default");
    return { id: 0, name: "Guest" }; // Recovery value
  })
  .then((user) => {
    console.log("User:", user.name); // "Guest"
  });
```

### Re-throwing in .catch()

If `.catch()` throws or returns a rejected promise, the error continues propagating:

```js
fetchUser(-1)
  .catch((error) => {
    if (error.message.includes("network")) {
      // Recover from network errors
      return { id: 0, name: "Cached User" };
    }
    throw error; // Re-throw errors we can't handle
  })
  .then((user) => {
    console.log("User:", user.name);
  })
  .catch((error) => {
    // Catches re-thrown errors
    console.error("Unrecoverable error:", error.message);
  });
```

### Multiple .catch() Handlers

```js
fetchUser(1)
  .then((user) => {
    if (!user.email) throw new Error("No email");
    return sendEmail(user.email, "Welcome!");
  })
  .catch((error) => {
    // Handle errors from fetchUser and the email check
    console.log("First catch:", error.message);
    return "fallback"; // Recover
  })
  .then((result) => {
    // This runs because the first .catch() recovered
    console.log("Result:", result);
    throw new Error("Final failure"); // New error
  })
  .catch((error) => {
    // Handle errors from the second .then()
    console.log("Second catch:", error.message); // "Final failure"
  });
```

---

## 7. Promise.all()

`Promise.all()` takes an iterable of promises and returns a single promise that fulfills when **all** input promises fulfill, or rejects as soon as **any one** rejects.

### Syntax

```js
Promise.all([promise1, promise2, promise3])
  .then((results) => {
    // results is an array of all fulfilled values, in order
  })
  .catch((error) => {
    // error is the rejection reason of the FIRST promise to reject
  });
```

### Behavior

| Scenario              | Result                                                             |
| --------------------- | ------------------------------------------------------------------ |
| All promises fulfill  | Resolves with an array of all values (preserving order)            |
| Any promise rejects   | Rejects immediately with the first rejection reason (**fail-fast**)|
| Empty array           | Resolves immediately with `[]`                                     |
| Non-promise values    | Treated as `Promise.resolve(value)`                                |

### Example: Parallel Data Fetching

```js
async function fetchDashboardData(userId) {
  const [user, orders, notifications] = await Promise.all([
    fetchUser(userId),
    fetchOrders(userId),
    fetchNotifications(userId),
  ]);

  return { user, orders, notifications };
}

// All three requests start at the same time
// Total time = time of the slowest request (not the sum)
```

### Fail-Fast Behavior

```js
const promise1 = new Promise((resolve) => setTimeout(() => resolve("A"), 3000));
const promise2 = new Promise((_, reject) => setTimeout(() => reject(new Error("B failed")), 1000));
const promise3 = new Promise((resolve) => setTimeout(() => resolve("C"), 2000));

Promise.all([promise1, promise2, promise3])
  .then((results) => {
    console.log(results); // Never reached
  })
  .catch((error) => {
    console.log(error.message); // "B failed" — after 1 second
    // promise1 and promise3 still run to completion, but their results are ignored
  });
```

### Preserving Order

`Promise.all()` always returns results in the **same order** as the input promises, regardless of which one finishes first:

```js
const slow = new Promise((resolve) => setTimeout(() => resolve("slow"), 3000));
const fast = new Promise((resolve) => setTimeout(() => resolve("fast"), 100));
const medium = new Promise((resolve) => setTimeout(() => resolve("medium"), 1000));

Promise.all([slow, fast, medium]).then((results) => {
  console.log(results); // ["slow", "fast", "medium"] — input order, not completion order
});
```

### Practical Example: Fetching Multiple API Endpoints

```js
async function getMultipleUsers(userIds) {
  const promises = userIds.map((id) => fetchUser(id));
  const users = await Promise.all(promises);
  return users;
}

// Usage
const users = await getMultipleUsers([1, 2, 3, 4, 5]);
// All 5 requests run in parallel
```

---

## 8. Promise.allSettled()

`Promise.allSettled()` waits for **all** promises to settle (fulfill or reject), regardless of individual outcomes. It never short-circuits.

### Syntax

```js
Promise.allSettled([promise1, promise2, promise3]).then((results) => {
  // results is an array of objects, each with:
  // { status: "fulfilled", value: ... }  or
  // { status: "rejected", reason: ... }
});
```

### Behavior

| Scenario            | Result                                                              |
| ------------------- | ------------------------------------------------------------------- |
| All promises settle | Resolves with an array of result objects (never rejects)            |
| Mix of outcomes     | Each result has `status: "fulfilled"` or `status: "rejected"`       |
| Empty array         | Resolves immediately with `[]`                                      |

### Example

```js
const promises = [
  Promise.resolve("Success A"),
  Promise.reject(new Error("Failed B")),
  Promise.resolve("Success C"),
  Promise.reject(new Error("Failed D")),
];

const results = await Promise.allSettled(promises);

console.log(results);
// [
//   { status: "fulfilled", value: "Success A" },
//   { status: "rejected",  reason: Error("Failed B") },
//   { status: "fulfilled", value: "Success C" },
//   { status: "rejected",  reason: Error("Failed D") }
// ]
```

### Filtering Results

```js
const results = await Promise.allSettled(promises);

const successes = results
  .filter((r) => r.status === "fulfilled")
  .map((r) => r.value);

const failures = results
  .filter((r) => r.status === "rejected")
  .map((r) => r.reason);

console.log("Successes:", successes); // ["Success A", "Success C"]
console.log("Failures:", failures);   // [Error("Failed B"), Error("Failed D")]
```

### Practical Example: Batch Operations

```js
async function sendBulkEmails(recipients) {
  const promises = recipients.map((recipient) =>
    sendEmail(recipient.email, "Newsletter", recipient.name)
  );

  const results = await Promise.allSettled(promises);

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected");

  console.log(`Sent: ${sent}/${recipients.length}`);

  if (failed.length > 0) {
    console.log("Failed recipients:");
    failed.forEach((f, i) => {
      console.log(`  - ${recipients[results.indexOf(f)].email}: ${f.reason.message}`);
    });
  }
}
```

### Promise.all() vs Promise.allSettled()

| Feature         | `Promise.all()`                       | `Promise.allSettled()`                   |
| --------------- | ------------------------------------- | ---------------------------------------- |
| Short-circuits? | Yes, on first rejection               | No, always waits for all                 |
| Result on mix   | Rejects with first error              | Array of all outcomes                    |
| Use when        | All must succeed (dependencies)       | Individual results matter, partial OK    |
| Result shape    | Array of values                       | Array of `{status, value/reason}`        |

---

## 9. Promise.race()

`Promise.race()` returns a promise that settles as soon as the **first** promise in the iterable settles (fulfills or rejects). The result (value or rejection reason) of the first promise to settle becomes the result.

### Syntax

```js
Promise.race([promise1, promise2, promise3])
  .then((value) => {
    // value from the first promise to fulfill
  })
  .catch((error) => {
    // error from the first promise to reject
  });
```

### Behavior

| Scenario                        | Result                                      |
| ------------------------------- | ------------------------------------------- |
| First to settle is fulfilled    | Resolves with that value                    |
| First to settle is rejected     | Rejects with that reason                    |
| Empty array                     | Stays pending forever (never settles)       |

### Example

```js
const slow = new Promise((resolve) => setTimeout(() => resolve("slow"), 3000));
const fast = new Promise((resolve) => setTimeout(() => resolve("fast"), 500));
const medium = new Promise((resolve) => setTimeout(() => resolve("medium"), 1500));

const winner = await Promise.race([slow, fast, medium]);
console.log(winner); // "fast" — it settled first
```

### Practical Example: Request Timeout

One of the most common uses of `Promise.race()` is implementing timeouts:

```js
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms);
  });
}

async function fetchWithTimeout(url, ms = 5000) {
  const result = await Promise.race([
    fetch(url),
    timeout(ms),
  ]);
  return result;
}

// Usage
try {
  const response = await fetchWithTimeout("https://api.example.com/data", 3000);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.log(error.message); // "Timed out after 3000ms" if fetch takes too long
}
```

### Race with First Rejection

```js
const success = new Promise((resolve) => setTimeout(() => resolve("ok"), 2000));
const failure = new Promise((_, reject) => setTimeout(() => reject(new Error("fast fail")), 500));

Promise.race([success, failure])
  .then((value) => console.log("Won:", value))
  .catch((error) => console.log("Error:", error.message)); // "fast fail"
```

---

## 10. Promise.any()

`Promise.any()` (ES2021) returns a promise that fulfills as soon as **any one** of the input promises **fulfills**. It ignores rejections unless **all** promises reject.

### Syntax

```js
Promise.any([promise1, promise2, promise3])
  .then((value) => {
    // value from the first promise to FULFILL
  })
  .catch((error) => {
    // AggregateError — only if ALL promises reject
  });
```

### Behavior

| Scenario                        | Result                                              |
| ------------------------------- | --------------------------------------------------- |
| Any promise fulfills            | Resolves with the first fulfilled value              |
| All promises reject             | Rejects with `AggregateError` containing all errors  |
| Empty array                     | Rejects with `AggregateError`                        |

### Promise.race() vs Promise.any()

| Feature          | `Promise.race()`                          | `Promise.any()`                              |
| ---------------- | ----------------------------------------- | -------------------------------------------- |
| Settles on       | First to **settle** (fulfill OR reject)   | First to **fulfill** only                    |
| Ignores          | Nothing — any settlement wins             | Rejections (unless all reject)               |
| All reject       | Rejects with the first rejection          | Rejects with `AggregateError`                |

### Example

```js
const p1 = new Promise((_, reject) => setTimeout(() => reject(new Error("Error 1")), 100));
const p2 = new Promise((resolve) => setTimeout(() => resolve("Success from p2"), 200));
const p3 = new Promise((resolve) => setTimeout(() => resolve("Success from p3"), 300));

const result = await Promise.any([p1, p2, p3]);
console.log(result); // "Success from p2" — first to FULFILL (p1's rejection is ignored)
```

### AggregateError (All Rejected)

```js
const p1 = Promise.reject(new Error("Error 1"));
const p2 = Promise.reject(new Error("Error 2"));
const p3 = Promise.reject(new Error("Error 3"));

try {
  await Promise.any([p1, p2, p3]);
} catch (error) {
  console.log(error instanceof AggregateError); // true
  console.log(error.message);                   // "All promises were rejected"
  console.log(error.errors);                    // [Error("Error 1"), Error("Error 2"), Error("Error 3")]
}
```

### Practical Example: Fastest Successful Server

```js
async function fetchFromFastestServer(resource) {
  const servers = [
    "https://server1.example.com",
    "https://server2.example.com",
    "https://server3.example.com",
  ];

  try {
    const response = await Promise.any(
      servers.map((server) => fetch(`${server}/${resource}`))
    );
    return await response.json();
  } catch (error) {
    // All servers failed
    console.error("All servers failed:", error.errors.map((e) => e.message));
    throw new Error("No server available");
  }
}
```

---

## 11. Promise.resolve() and Promise.reject()

These are static shortcut methods for creating already-settled promises.

### Promise.resolve(value)

Creates a promise that is immediately fulfilled with the given value.

```js
const p = Promise.resolve(42);
p.then((value) => console.log(value)); // 42
```

**Behavior with different argument types:**

```js
// Primitive value → fulfilled promise
Promise.resolve("hello");       // Promise {<fulfilled>: "hello"}

// Object → fulfilled promise
Promise.resolve({ a: 1 });      // Promise {<fulfilled>: {a: 1}}

// Another promise → returns the same promise (no wrapping)
const original = new Promise((resolve) => resolve("test"));
const same = Promise.resolve(original);
console.log(original === same);  // true

// Thenable → follows the thenable
const thenable = {
  then(resolve) {
    resolve("from thenable");
  },
};
Promise.resolve(thenable).then((value) => console.log(value)); // "from thenable"

// No argument → fulfilled with undefined
Promise.resolve().then((value) => console.log(value)); // undefined
```

### Promise.reject(reason)

Creates a promise that is immediately rejected with the given reason.

```js
const p = Promise.reject(new Error("Something went wrong"));
p.catch((error) => console.log(error.message)); // "Something went wrong"
```

> **Note:** Unlike `Promise.resolve()`, `Promise.reject()` does **not** unwrap thenables or promises. It always rejects with the exact value passed.

```js
// The error is the reason, not unwrapped
const innerPromise = Promise.resolve("inner");
const rejected = Promise.reject(innerPromise);

rejected.catch((reason) => {
  console.log(reason === innerPromise); // true — the Promise object IS the reason
});
```

### Use Cases

```js
// Conditional early return
function getUser(id) {
  if (!id) {
    return Promise.reject(new Error("ID is required"));
  }
  return fetchFromDatabase(id);
}

// Cache with fallback
function getCachedOrFetch(key) {
  const cached = cache.get(key);
  if (cached) {
    return Promise.resolve(cached); // Return cached value as a promise
  }
  return fetchFromServer(key).then((data) => {
    cache.set(key, data);
    return data;
  });
}

// Normalize sync/async functions
function normalizeToPromise(fn) {
  try {
    const result = fn();
    return result instanceof Promise ? result : Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}
```

---

## 12. Common Patterns and Anti-Patterns

### Anti-Pattern 1: The Explicit Promise Construction (Promise Constructor Anti-Pattern)

Do not wrap an existing promise in a new `Promise` constructor:

```js
// BAD: Unnecessary Promise wrapper
function getUser(id) {
  return new Promise((resolve, reject) => {
    fetchFromDatabase(id)
      .then((user) => resolve(user))
      .catch((err) => reject(err));
  });
}

// GOOD: Just return the promise directly
function getUser(id) {
  return fetchFromDatabase(id);
}
```

### Anti-Pattern 2: Nested .then() (Callback Hell with Promises)

```js
// BAD: Nesting instead of chaining
getUser(1).then((user) => {
  getOrders(user.id).then((orders) => {
    getOrderDetails(orders[0].id).then((details) => {
      console.log(details);
    });
  });
});

// GOOD: Flat chain
getUser(1)
  .then((user) => getOrders(user.id))
  .then((orders) => getOrderDetails(orders[0].id))
  .then((details) => console.log(details))
  .catch((error) => console.error(error));
```

### Anti-Pattern 3: Missing .catch()

```js
// BAD: No error handling — unhandled promise rejection
getUser(1).then((user) => console.log(user));

// GOOD: Always handle rejections
getUser(1)
  .then((user) => console.log(user))
  .catch((error) => console.error("Failed to get user:", error.message));
```

### Anti-Pattern 4: Breaking the Chain

```js
// BAD: Not returning the promise in .then()
getUser(1)
  .then((user) => {
    getOrders(user.id); // Missing return! The chain doesn't wait for this.
  })
  .then((orders) => {
    console.log(orders); // undefined — because nothing was returned above
  });

// GOOD: Return the promise
getUser(1)
  .then((user) => {
    return getOrders(user.id); // Return the promise so the chain waits
  })
  .then((orders) => {
    console.log(orders); // Correctly receives the orders
  });
```

### Anti-Pattern 5: Using .then() for Side Effects Without Returning

```js
// BAD: Forgetting to return in arrow function with braces
fetchData()
  .then((data) => {
    processData(data); // processData returns a promise, but it's not returned
  })
  .then((result) => {
    // result is undefined
  });

// GOOD: Return the value or use concise arrow syntax
fetchData()
  .then((data) => processData(data)) // Concise arrow returns implicitly
  .then((result) => {
    // result is the return value of processData
  });
```

### Pattern: Sequential Execution Over an Array

```js
// Execute promises one at a time (sequential)
async function processSequentially(items) {
  const results = [];
  for (const item of items) {
    const result = await processItem(item); // Wait for each one
    results.push(result);
  }
  return results;
}

// Execute all at once (parallel)
async function processInParallel(items) {
  return Promise.all(items.map((item) => processItem(item)));
}

// Execute with concurrency limit (batched)
async function processInBatches(items, batchSize = 5) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((item) => processItem(item)));
    results.push(...batchResults);
  }
  return results;
}
```

### Pattern: Retry Logic

```js
async function retry(fn, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) {
        throw error; // Final attempt failed — give up
      }
      console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}

// Usage
const data = await retry(() => fetch("https://api.example.com/data"), 3, 1000);
```

### Pattern: Promise-Based Queue

```js
class PromiseQueue {
  constructor(concurrency = 1) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  enqueue(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.run();
    });
  }

  async run() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const { fn, resolve, reject } = this.queue.shift();
      this.running++;
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        this.running--;
        this.run(); // Process next in queue
      }
    }
  }
}

// Usage: max 2 concurrent operations
const queue = new PromiseQueue(2);
const results = await Promise.all(
  urls.map((url) => queue.enqueue(() => fetch(url)))
);
```

---

## Summary

| Concept               | Key Takeaway                                                                      |
| --------------------- | --------------------------------------------------------------------------------- |
| Promise               | An object representing the eventual result of an async operation.                 |
| States                | Pending -> Fulfilled (value) or Rejected (reason). Immutable once settled.        |
| `.then()`             | Registers a fulfillment handler. Returns a new Promise (enables chaining).        |
| `.catch()`            | Registers a rejection handler. Shortcut for `.then(undefined, onRejected)`.       |
| `.finally()`          | Runs on settlement regardless of outcome. Value passes through unchanged.         |
| Chaining              | Return values/promises from `.then()` to build sequential async pipelines.        |
| Error propagation     | Rejections skip `.then()` handlers and flow to the nearest `.catch()`.            |
| `Promise.all()`       | Wait for all; fail-fast on first rejection. Use for parallel dependent operations.|
| `Promise.allSettled()` | Wait for all; get every result. Use when partial success is acceptable.           |
| `Promise.race()`      | First to settle wins (fulfill or reject). Use for timeouts.                       |
| `Promise.any()`       | First to fulfill wins; ignores rejections. Use for redundancy/fallback.           |
| `Promise.resolve()`   | Shortcut to create an already-fulfilled promise.                                  |
| `Promise.reject()`    | Shortcut to create an already-rejected promise.                                   |
