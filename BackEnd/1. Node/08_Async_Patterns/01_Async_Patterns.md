# Node.js — Asynchronous Patterns

Node.js is designed to be **asynchronous and non-blocking**. This means operations like reading files, querying databases, and making HTTP requests don't block the main thread — they run in the background and notify your code when they're done. Understanding the different async patterns is essential for writing efficient Node.js code.

---

## 1. Synchronous vs Asynchronous

### Synchronous (Blocking)

Each operation waits for the previous one to finish before starting:

```javascript
const data1 = fs.readFileSync('file1.txt', 'utf8');  // Blocks until done
const data2 = fs.readFileSync('file2.txt', 'utf8');  // Waits for data1
console.log('Both files read');                       // Runs last
```

Total time: **time(file1) + time(file2)** — sequential.

### Asynchronous (Non-Blocking)

Operations start and the code continues. Callbacks/promises notify when done:

```javascript
fs.readFile('file1.txt', 'utf8', (err, data1) => { /* ... */ });
fs.readFile('file2.txt', 'utf8', (err, data2) => { /* ... */ });
console.log('Files being read...');  // Runs immediately
```

Total time: **max(time(file1), time(file2))** — concurrent.

---

## 2. Callbacks

A **callback** is a function passed as an argument to another function, to be called when the async operation completes. This was the original async pattern in Node.js.

### Error-First Callback Convention

Node.js callbacks follow the **error-first** pattern: the first argument is always the error (or `null` if no error), the second is the result.

```javascript
import fs from 'fs';

fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  console.log('Content:', data);
});
```

### Callback Hell (Pyramid of Doom)

When you need to do sequential async operations with callbacks, you end up with deeply nested code:

```javascript
fs.readFile('file1.txt', 'utf8', (err, data1) => {
  if (err) return console.error(err);

  fs.readFile('file2.txt', 'utf8', (err, data2) => {
    if (err) return console.error(err);

    fs.readFile('file3.txt', 'utf8', (err, data3) => {
      if (err) return console.error(err);

      fs.writeFile('output.txt', data1 + data2 + data3, (err) => {
        if (err) return console.error(err);
        console.log('Combined and written!');
      });
    });
  });
});
```

**Problems:**
- Hard to read and follow
- Error handling repeated at every level
- Difficult to debug and maintain

Callbacks are still used in some older APIs, but **Promises and async/await** are the modern solution.

---

## 3. Promises

A **Promise** represents a value that will be available in the future. It can be in one of three states:

| State | Description |
|-------|-------------|
| **Pending** | Operation in progress |
| **Fulfilled** (resolved) | Operation completed successfully → `.then()` runs |
| **Rejected** | Operation failed → `.catch()` runs |

### Basic Usage

```javascript
import fs from 'fs/promises';

fs.readFile('example.txt', 'utf8')
  .then((data) => {
    console.log('Content:', data);
  })
  .catch((err) => {
    console.error('Error:', err.message);
  })
  .finally(() => {
    console.log('Operation complete (success or failure)');
  });
```

### Creating a Promise

```javascript
function delay(ms) {
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      reject(new Error('Delay must be positive'));
    }
    setTimeout(() => resolve(`Done after ${ms}ms`), ms);
  });
}

delay(1000)
  .then((msg) => console.log(msg))      // Done after 1000ms
  .catch((err) => console.error(err));
```

### Promise Chaining

Promises can be chained to avoid nested callbacks. Each `.then()` returns a new Promise:

```javascript
import fs from 'fs/promises';

fs.readFile('file1.txt', 'utf8')
  .then((data1) => {
    console.log('File 1:', data1);
    return fs.readFile('file2.txt', 'utf8');   // Return a new promise
  })
  .then((data2) => {
    console.log('File 2:', data2);
    return fs.readFile('file3.txt', 'utf8');
  })
  .then((data3) => {
    console.log('File 3:', data3);
    console.log('All files read!');
  })
  .catch((err) => {
    // Catches errors from ANY step in the chain
    console.error('Error:', err.message);
  });
```

### Promise Utility Methods

#### `Promise.all()` — Run in Parallel, Fail Fast

Runs all promises concurrently. Resolves when **all** succeed, rejects if **any** fail.

```javascript
const [data1, data2, data3] = await Promise.all([
  fs.readFile('file1.txt', 'utf8'),
  fs.readFile('file2.txt', 'utf8'),
  fs.readFile('file3.txt', 'utf8'),
]);
// All three files read concurrently — much faster than sequential
```

#### `Promise.allSettled()` — Run in Parallel, Never Fail

Waits for all promises to settle (resolve or reject). Never rejects.

```javascript
const results = await Promise.allSettled([
  fs.readFile('exists.txt', 'utf8'),
  fs.readFile('missing.txt', 'utf8'),
]);

results.forEach((result) => {
  if (result.status === 'fulfilled') {
    console.log('Success:', result.value);
  } else {
    console.log('Failed:', result.reason.message);
  }
});
```

#### `Promise.race()` — First to Settle Wins

Returns the result of whichever promise settles first (resolves or rejects).

```javascript
const result = await Promise.race([
  fetch('https://api1.example.com/data'),
  fetch('https://api2.example.com/data'),
]);
// Whichever API responds first wins
```

#### `Promise.any()` — First to Resolve Wins

Returns the result of the first promise to **resolve** (ignores rejections unless all reject).

```javascript
const result = await Promise.any([
  fetch('https://primary-api.com/data'),
  fetch('https://fallback-api.com/data'),
]);
// First successful response wins; failures are ignored
```

### Summary of Promise Methods

| Method | Resolves When | Rejects When |
|--------|---------------|-------------|
| `Promise.all()` | All resolve | Any rejects |
| `Promise.allSettled()` | All settle (resolve or reject) | Never |
| `Promise.race()` | First settles | First settles (if rejection) |
| `Promise.any()` | First resolves | All reject |

---

## 4. Async/Await

**Async/await** is syntactic sugar built on top of Promises. It makes asynchronous code look and behave like synchronous code, making it much easier to read, write, and debug.

### Basic Usage

```javascript
import fs from 'fs/promises';

async function readFiles() {
  try {
    const data1 = await fs.readFile('file1.txt', 'utf8');
    const data2 = await fs.readFile('file2.txt', 'utf8');
    const data3 = await fs.readFile('file3.txt', 'utf8');
    console.log('All files read!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

readFiles();
```

### How It Works

1. **`async`** keyword: Declares an async function. It always returns a Promise.
2. **`await`** keyword: Pauses execution until the Promise resolves. Can only be used inside an `async` function (or at the top level in ES Modules).
3. **`try/catch`**: Handles errors — replaces `.catch()` chaining.

### Sequential vs Parallel

```javascript
// SEQUENTIAL — each await waits for the previous one
async function sequential() {
  const data1 = await fs.readFile('file1.txt', 'utf8');  // Wait...
  const data2 = await fs.readFile('file2.txt', 'utf8');  // Then wait...
  const data3 = await fs.readFile('file3.txt', 'utf8');  // Then wait...
  // Total: time(file1) + time(file2) + time(file3)
}

// PARALLEL — all run at the same time
async function parallel() {
  const [data1, data2, data3] = await Promise.all([
    fs.readFile('file1.txt', 'utf8'),
    fs.readFile('file2.txt', 'utf8'),
    fs.readFile('file3.txt', 'utf8'),
  ]);
  // Total: max(time(file1), time(file2), time(file3))
}
```

**Use sequential** when each step depends on the previous result.
**Use parallel** (`Promise.all`) when operations are independent.

### Top-Level Await

In ES Modules (`"type": "module"`), you can use `await` at the top level without wrapping in an async function:

```javascript
// Works in ES Modules
const data = await fs.readFile('config.json', 'utf8');
const config = JSON.parse(data);
```

### Error Handling Patterns

```javascript
// Pattern 1: try/catch
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch:', err.message);
    throw err;  // Re-throw if caller should handle it
  }
}

// Pattern 2: .catch() on the promise
const data = await fetchData().catch((err) => {
  console.error(err);
  return null;  // Return fallback value
});

// Pattern 3: Wrapper function (Go-style)
async function to(promise) {
  try {
    const result = await promise;
    return [null, result];
  } catch (err) {
    return [err, null];
  }
}

const [err, data] = await to(fs.readFile('file.txt', 'utf8'));
if (err) {
  console.error('Failed:', err.message);
}
```

---

## 5. Converting Callbacks to Promises

### Using `util.promisify`

Node.js provides `util.promisify()` to convert callback-based functions into Promise-based:

```javascript
import { promisify } from 'util';
import fs from 'fs';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const data = await readFile('example.txt', 'utf8');
await writeFile('output.txt', data);
```

### Manual Wrapping

```javascript
function readFilePromise(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

const data = await readFilePromise('example.txt');
```

---

## 6. Pattern Comparison

| Pattern | Syntax | Error Handling | Readability | Nesting |
|---------|--------|----------------|-------------|---------|
| **Callbacks** | `fn(args, callback)` | Error-first param | Poor (nested) | Deep |
| **Promises** | `.then().catch()` | `.catch()` chain | Good | Flat (chained) |
| **Async/Await** | `await fn()` | `try/catch` | Best (looks synchronous) | Flat |

### Evolution

```javascript
// 1. Callbacks — original pattern
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});

// 2. Promises — cleaner chaining
fs.promises.readFile('file.txt', 'utf8')
  .then(data => console.log(data))
  .catch(err => console.error(err));

// 3. Async/Await — modern standard
const data = await fs.promises.readFile('file.txt', 'utf8');
console.log(data);
```

---

## 7. Summary

| Concept | Detail |
|---------|--------|
| Callbacks | Function passed to run when async operation completes |
| Promises | Object representing a future value (pending → fulfilled/rejected) |
| Async/Await | Syntactic sugar on Promises — looks synchronous |
| `Promise.all()` | Run promises in parallel, fail if any reject |
| `Promise.allSettled()` | Run in parallel, get all results (success and failure) |
| `Promise.race()` | First to settle wins |
| `util.promisify()` | Convert callback functions to Promise-based |

### Key Points

1. **Always prefer async/await** over callbacks or raw Promise chains for readability
2. Use `Promise.all()` to run **independent** operations in **parallel** — much faster than sequential `await`
3. Use `try/catch` for error handling with async/await
4. Callbacks follow the **error-first** convention: `(err, result) => {}`
5. Use `Promise.allSettled()` when you need **all results** regardless of failures
6. **Never mix** synchronous and asynchronous patterns for the same operation
7. The `fs/promises` API provides Promise-based versions of all `fs` methods — no need to promisify manually
