# Node.js — The Event Loop

The event loop is the **core mechanism** that makes Node.js asynchronous and non-blocking despite being single-threaded. It is responsible for scheduling and executing all asynchronous operations — timers, I/O callbacks, promises, and more.

---

## 1. Why Does Node.js Need an Event Loop?

Node.js runs on a **single thread**. Without the event loop, every I/O operation (reading files, querying databases, making HTTP requests) would block the thread, and the entire application would freeze until the operation completes.

The event loop solves this by:
1. **Offloading** I/O operations to the operating system or the libuv thread pool
2. **Continuing** to execute other code while waiting
3. **Executing callbacks** when the operations complete

```javascript
console.log('Before');

// This does NOT block — the event loop handles it
setTimeout(() => {
  console.log('Timer done');
}, 2000);

console.log('After');

// Output:
// Before
// After
// Timer done (2 seconds later)
```

---

## 2. How the Event Loop Works

The event loop continuously cycles through **phases**, each responsible for a specific type of callback:

```
   ┌───────────────────────────┐
┌─>│         Timers             │ ← setTimeout, setInterval callbacks
│  └──────────┬────────────────┘
│  ┌──────────┴────────────────┐
│  │     Pending Callbacks      │ ← Deferred I/O callbacks
│  └──────────┬────────────────┘
│  ┌──────────┴────────────────┐
│  │      Idle, Prepare         │ ← Internal use only
│  └──────────┬────────────────┘
│  ┌──────────┴────────────────┐
│  │         Poll               │ ← Retrieve new I/O events; execute I/O callbacks
│  └──────────┬────────────────┘
│  ┌──────────┴────────────────┐
│  │         Check              │ ← setImmediate callbacks
│  └──────────┬────────────────┘
│  ┌──────────┴────────────────┐
│  │     Close Callbacks        │ ← socket.on('close'), etc.
│  └──────────┬────────────────┘
│             │
└─────────────┘  (loops back to Timers)
```

### Phase Details

| Phase | Executes | Examples |
|-------|----------|---------|
| **Timers** | Callbacks from `setTimeout()` and `setInterval()` | Timer-based delays |
| **Pending Callbacks** | I/O callbacks deferred from the previous loop | Some TCP/UDP errors |
| **Idle, Prepare** | Internal operations (not user-accessible) | — |
| **Poll** | New I/O events; executes I/O callbacks | File reads, network requests |
| **Check** | `setImmediate()` callbacks | Post-I/O processing |
| **Close Callbacks** | Close event handlers | `socket.on('close')` |

### Between Every Phase: Microtask Queues

Before moving to the next phase, Node.js drains all **microtasks**:
1. `process.nextTick()` callbacks (highest priority)
2. Promise `.then()` / `.catch()` / `.finally()` callbacks

---

## 3. Execution Priority

Understanding priority is crucial for predicting execution order:

```
Priority (highest to lowest):
1. Synchronous code (runs immediately on the call stack)
2. process.nextTick() (microtask — runs before any async callback)
3. Promise callbacks (microtask — runs after nextTick)
4. setTimeout / setInterval (Timers phase)
5. setImmediate (Check phase)
6. I/O callbacks (Poll phase)
```

### Demonstration

```javascript
console.log('1 — Synchronous');

process.nextTick(() => {
  console.log('2 — process.nextTick');
});

Promise.resolve().then(() => {
  console.log('3 — Promise');
});

setTimeout(() => {
  console.log('4 — setTimeout');
}, 0);

setImmediate(() => {
  console.log('5 — setImmediate');
});

console.log('6 — Synchronous');
```

**Output:**
```
1 — Synchronous
6 — Synchronous
2 — process.nextTick
3 — Promise
4 — setTimeout
5 — setImmediate
```

### Explanation

1. **Synchronous** code runs first (lines 1 and 6)
2. **`process.nextTick()`** runs before anything else in the async queue (highest priority microtask)
3. **Promise** callbacks run next (also microtasks, but after nextTick)
4. **`setTimeout(..., 0)`** runs in the Timers phase
5. **`setImmediate()`** runs in the Check phase

---

## 4. Microtasks vs Macrotasks

| Category | Examples | When They Run |
|----------|---------|---------------|
| **Microtasks** | `process.nextTick()`, Promise `.then()` | Between every phase (highest priority) |
| **Macrotasks** | `setTimeout`, `setInterval`, `setImmediate`, I/O callbacks | During their respective phase |

Microtasks always run **before** the next macrotask. This means if you keep creating microtasks, macrotasks will be starved:

```javascript
// DANGER: This starves the event loop
function recursive() {
  process.nextTick(recursive);  // Never lets setTimeout run
}
recursive();

setTimeout(() => {
  console.log('This will never execute');
}, 0);
```

---

## 5. `setTimeout` vs `setImmediate` vs `process.nextTick`

| Method | When It Runs | Phase |
|--------|-------------|-------|
| `setTimeout(fn, 0)` | After at least 0ms, in the **Timers** phase | Timers |
| `setImmediate(fn)` | In the **Check** phase (after Poll) | Check |
| `process.nextTick(fn)` | **Before** the next phase (microtask) | Between phases |

### Inside an I/O Callback

When called inside an I/O callback, `setImmediate` always runs before `setTimeout`:

```javascript
import fs from 'fs';

fs.readFile('example.txt', () => {
  // Inside an I/O callback:
  setTimeout(() => console.log('setTimeout'), 0);
  setImmediate(() => console.log('setImmediate'));
});

// Output (guaranteed order):
// setImmediate
// setTimeout
```

This is because after the I/O callback (Poll phase), the event loop enters the Check phase (where `setImmediate` runs) before looping back to the Timers phase.

---

## 6. The Thread Pool (libuv)

While the event loop is single-threaded, Node.js uses a **thread pool** (powered by libuv) for operations that can't be done asynchronously by the OS:

| Uses Thread Pool | Uses OS Async |
|-----------------|--------------|
| File system operations (`fs`) | Network I/O (TCP, HTTP) |
| DNS lookups (`dns.lookup`) | DNS resolution (`dns.resolve`) |
| Compression (`zlib`) | Signals, timers |
| Crypto operations | Pipes |

Default thread pool size is **4 threads**. You can increase it:

```bash
UV_THREADPOOL_SIZE=8 node app.js
```

---

## 7. Blocking the Event Loop

Since the event loop runs on a single thread, **blocking it** freezes your entire application:

```javascript
// BAD — blocks the event loop for 5 seconds
function blockingOperation() {
  const start = Date.now();
  while (Date.now() - start < 5000) {}  // Busy wait
  console.log('Done blocking');
}

// No other callbacks (HTTP requests, timers, etc.) can run during this time
```

### How to Avoid Blocking

| Problem | Solution |
|---------|----------|
| CPU-intensive computation | Use `Worker Threads` |
| Large file reads | Use **Streams** instead of `readFileSync` |
| Complex JSON parsing | Use streaming JSON parsers |
| Synchronous `fs` methods | Use async alternatives (`fs/promises`) |
| Heavy loops | Break into chunks with `setImmediate` |

### Breaking Up Heavy Work

```javascript
// Split heavy computation across event loop iterations
function processLargeArray(array) {
  const chunkSize = 1000;
  let index = 0;

  function processChunk() {
    const end = Math.min(index + chunkSize, array.length);
    for (let i = index; i < end; i++) {
      // Process array[i]
    }
    index = end;

    if (index < array.length) {
      setImmediate(processChunk);  // Yield to the event loop
    }
  }

  processChunk();
}
```

---

## 8. Practical Example — Full Execution Order

```javascript
console.log('Start');

setTimeout(() => console.log('setTimeout 1'), 0);
setTimeout(() => console.log('setTimeout 2'), 0);

setImmediate(() => console.log('setImmediate 1'));
setImmediate(() => console.log('setImmediate 2'));

process.nextTick(() => console.log('nextTick 1'));
process.nextTick(() => {
  console.log('nextTick 2');
  process.nextTick(() => console.log('nested nextTick'));
});

Promise.resolve()
  .then(() => console.log('Promise 1'))
  .then(() => console.log('Promise 2'));

console.log('End');
```

**Output:**
```
Start
End
nextTick 1
nextTick 2
nested nextTick
Promise 1
Promise 2
setTimeout 1
setTimeout 2
setImmediate 1
setImmediate 2
```

**Order explanation:**
1. Synchronous: `Start`, `End`
2. Microtasks — nextTick queue: `nextTick 1`, `nextTick 2`, `nested nextTick`
3. Microtasks — Promise queue: `Promise 1`, `Promise 2`
4. Macrotasks — Timers: `setTimeout 1`, `setTimeout 2`
5. Macrotasks — Check: `setImmediate 1`, `setImmediate 2`

---

## 9. Summary

| Concept | Detail |
|---------|--------|
| Event loop | Continuously cycles through phases to process async callbacks |
| Phases | Timers → Pending → Poll → Check → Close |
| Microtasks | `process.nextTick()` and Promises — run between every phase |
| Macrotasks | `setTimeout`, `setImmediate`, I/O callbacks — run in their phase |
| Thread pool | 4 threads (default) for file I/O, DNS, crypto, compression |
| Blocking | Avoid synchronous operations and CPU-heavy work on the main thread |

### Key Points

1. The event loop is what makes Node.js **non-blocking** despite being single-threaded
2. **Synchronous code** always runs first — it blocks everything until done
3. **`process.nextTick()`** has the highest async priority — use sparingly to avoid starving I/O
4. **Promises** run after nextTick but before setTimeout/setImmediate
5. Inside I/O callbacks, **`setImmediate`** always runs before `setTimeout(..., 0)`
6. **Never block the event loop** — use async methods, streams, and worker threads for heavy work
7. Understanding the event loop is essential for writing **performant Node.js applications**
