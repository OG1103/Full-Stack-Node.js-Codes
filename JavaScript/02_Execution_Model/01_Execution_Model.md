# JavaScript Execution Model: Call Stack, Execution Context, Event Loop, and Task Queues

## Table of Contents

1. [JavaScript is Single-Threaded](#1-javascript-is-single-threaded)
2. [The Call Stack](#2-the-call-stack)
3. [Execution Context](#3-execution-context)
4. [The Event Loop](#4-the-event-loop)
5. [Microtasks](#5-microtasks)
6. [Macrotasks](#6-macrotasks)
7. [Priority Hierarchy](#7-priority-hierarchy)
8. [Complex Example with Step-by-Step Walkthrough](#8-complex-example-with-step-by-step-walkthrough)
9. [Gotchas and Common Pitfalls](#9-gotchas-and-common-pitfalls)
10. [Practical Implications](#10-practical-implications)
11. [Visual Diagram of the Event Loop](#11-visual-diagram-of-the-event-loop)
12. [Summary Table](#12-summary-table)

---

## 1. JavaScript is Single-Threaded

JavaScript executes code on a **single thread**. This means the engine processes one instruction at a time, in sequence, on a single call stack. There is no built-in concurrency through multiple threads of execution.

### What Does Single-Threaded Mean?

- Only **one piece of code** runs at any given moment.
- There is **one call stack** and **one memory heap**.
- Long-running operations (e.g., a massive loop) **block everything else**, including UI rendering and user interactions.

### Why Single-Threaded?

JavaScript was originally designed for the browser to manipulate the DOM. If multiple threads could modify the DOM simultaneously, race conditions would make the language unpredictable and unsafe. A single-threaded model eliminates this class of bugs entirely.

### How Does It Handle Async Then?

Despite being single-threaded, JavaScript achieves non-blocking behavior through:

1. **Web APIs / Node.js APIs** -- The runtime environment (browser or Node.js) provides background threads for I/O, timers, network requests, etc.
2. **Task Queues** -- Completed async operations push callbacks onto queues.
3. **The Event Loop** -- Continuously checks if the call stack is empty and then dequeues tasks.

```
Single Thread                    Runtime Environment (Multi-Threaded)
+-------------------+            +-----------------------------------+
|   Call Stack      |  -------> |  Timer Thread (setTimeout)         |
|   (one at a time) |  <------- |  Network Thread (fetch/XHR)        |
+-------------------+            |  File I/O Thread (Node.js fs)      |
                                 +-----------------------------------+
```

The JavaScript engine itself is single-threaded, but the **runtime environment** provides concurrency through background threads. The event loop bridges these two worlds.

---

## 2. The Call Stack

### What Is the Call Stack?

The **call stack** is a data structure that tracks the execution of functions in a program. It records where in the program we currently are. When we call a function, it gets pushed onto the stack. When the function returns, it gets popped off the stack.

### LIFO Principle (Last-In, First-Out)

The call stack follows the **LIFO** principle:

- The **last** function pushed onto the stack is the **first** one to be popped off.
- The function currently on **top** of the stack is the one being executed.
- A function below another on the stack is **waiting** for the one above it to return.

### How Functions Are Pushed and Popped

```javascript
function multiply(a, b) {
    return a * b;
}

function square(n) {
    return multiply(n, n);
}

function printSquare(n) {
    const result = square(n);
    console.log(result);
}

printSquare(5);
```

**Call Stack Progression:**

```
Step 1:  [ main()          ]   -- Global execution context enters the stack
Step 2:  [ main()          ]
         [ printSquare(5)  ]   -- printSquare is called, pushed onto stack
Step 3:  [ main()          ]
         [ printSquare(5)  ]
         [ square(5)       ]   -- square is called inside printSquare
Step 4:  [ main()          ]
         [ printSquare(5)  ]
         [ square(5)       ]
         [ multiply(5, 5)  ]   -- multiply is called inside square
Step 5:  [ main()          ]
         [ printSquare(5)  ]
         [ square(5)       ]   -- multiply returns 25, popped off
Step 6:  [ main()          ]
         [ printSquare(5)  ]   -- square returns 25, popped off
Step 7:  [ main()          ]
         [ printSquare(5)  ]
         [ console.log(25) ]   -- console.log is called
Step 8:  [ main()          ]
         [ printSquare(5)  ]   -- console.log completes, popped off
Step 9:  [ main()          ]   -- printSquare completes, popped off
Step 10: [ ]                   -- main() completes, stack is empty
```

**Output:**
```
25
```

### Stack Overflow

A **stack overflow** occurs when the call stack exceeds its maximum size. This typically happens with infinite or deeply nested recursion that lacks a proper base case.

```javascript
// Infinite recursion -- no base case
function recurse() {
    recurse();
}

recurse();
// RangeError: Maximum call stack size exceeded
```

The maximum stack size varies by engine:

| Engine       | Approximate Max Stack Depth |
|-------------|----------------------------|
| V8 (Chrome/Node.js) | ~10,000 - 15,000 frames |
| SpiderMonkey (Firefox) | ~10,000 - 50,000 frames |
| JavaScriptCore (Safari) | ~30,000 - 65,000 frames |

**Proper recursion with a base case:**

```javascript
function factorial(n) {
    if (n <= 1) return 1;        // Base case -- stops recursion
    return n * factorial(n - 1); // Recursive case
}

console.log(factorial(5)); // 120
```

**Call Stack for `factorial(4)`:**

```
[ factorial(4) ]
[ factorial(4), factorial(3) ]
[ factorial(4), factorial(3), factorial(2) ]
[ factorial(4), factorial(3), factorial(2), factorial(1) ]  -- base case hit
[ factorial(4), factorial(3), factorial(2) ]                -- returns 1
[ factorial(4), factorial(3) ]                              -- returns 2
[ factorial(4) ]                                            -- returns 6
[ ]                                                         -- returns 24
```

---

## 3. Execution Context

Every time JavaScript code runs, it runs inside an **execution context**. An execution context is an abstract concept that holds information about the environment in which the current code is being executed.

### Types of Execution Contexts

There are three types:

| Type | When Created | How Many |
|------|-------------|----------|
| **Global Execution Context (GEC)** | When the script first loads | Exactly one per program |
| **Function Execution Context (FEC)** | Every time a function is called | One per function invocation |
| **Eval Execution Context** | When `eval()` is used | One per `eval()` call (avoid using `eval`) |

### Global Execution Context (GEC)

The GEC is the default context. It is created before any code runs and persists for the lifetime of the script.

- Creates the **global object** (`window` in browsers, `global` in Node.js).
- Sets the value of `this` to the global object (in non-strict mode).
- Allocates memory for globally declared variables and function declarations.

```javascript
// This code runs in the Global Execution Context
var greeting = "Hello";
function sayHello() {
    console.log(greeting);
}
sayHello();
```

### Function Execution Context (FEC)

A new FEC is created every time a function is **invoked** (not when it is declared). Each invocation gets its own context, even for the same function.

```javascript
function greet(name) {
    const message = `Hello, ${name}!`;
    console.log(message);
}

greet("Alice"); // Creates FEC #1
greet("Bob");   // Creates FEC #2 (separate context)
```

### Two Phases of an Execution Context

Every execution context goes through two phases:

#### Phase 1: Creation Phase (Memory Allocation)

During the creation phase, the JavaScript engine:

1. Creates the **Variable Object (VO)** / **Lexical Environment**
   - Scans for function declarations and stores them in memory **in full** (function hoisting).
   - Scans for `var` declarations and initializes them to `undefined` (variable hoisting).
   - `let` and `const` declarations are registered but placed in a **Temporal Dead Zone (TDZ)** -- they are not initialized.
2. Determines the **Scope Chain** -- a chain of references to outer lexical environments.
3. Sets the value of **`this`**.

#### Phase 2: Execution Phase (Code Execution)

During the execution phase:

1. The engine executes code **line by line**.
2. Variable assignments happen (values replace `undefined` for `var`; `let`/`const` get their values).
3. Functions are called, creating new execution contexts.

### Example: Seeing Both Phases in Action

```javascript
console.log(x);        // undefined   (var is hoisted, initialized to undefined)
console.log(y);        // ReferenceError: Cannot access 'y' before initialization
console.log(greet);    // [Function: greet]  (function declaration fully hoisted)

var x = 10;
let y = 20;

function greet() {
    return "Hello!";
}
```

**Creation Phase builds this environment:**

```
Global Execution Context (Creation Phase):
+-------------------------------+
|  Variable Object:             |
|    x         -> undefined     |  (var -- hoisted, initialized to undefined)
|    y         -> <TDZ>         |  (let -- hoisted, but in Temporal Dead Zone)
|    greet     -> function(){}  |  (function declaration -- fully hoisted)
|                               |
|  Scope Chain: [Global]        |
|  this: window / global        |
+-------------------------------+
```

**Execution Phase updates values:**

```
Global Execution Context (Execution Phase):
+-------------------------------+
|  Variable Object:             |
|    x         -> 10            |  (assigned during execution)
|    y         -> 20            |  (assigned, exits TDZ)
|    greet     -> function(){}  |  (unchanged)
+-------------------------------+
```

### Nested Execution Contexts

```javascript
var a = 1;

function outer() {
    var b = 2;

    function inner() {
        var c = 3;
        console.log(a + b + c); // 6
    }

    inner();
}

outer();
```

**Execution Context Stack:**

```
1. Global EC created   -> Stack: [ Global EC ]
   - a = undefined (creation), then a = 1 (execution)

2. outer() called      -> Stack: [ Global EC, outer EC ]
   - b = undefined (creation), then b = 2 (execution)

3. inner() called      -> Stack: [ Global EC, outer EC, inner EC ]
   - c = undefined (creation), then c = 3 (execution)
   - console.log(a + b + c): Looks up scope chain
     - c found in inner EC (3)
     - b found in outer EC (2)
     - a found in Global EC (1)
     - Output: 6

4. inner() returns     -> Stack: [ Global EC, outer EC ]
5. outer() returns     -> Stack: [ Global EC ]
6. Script ends         -> Stack: [ ]
```

---

## 4. The Event Loop

### What Is the Event Loop?

The **event loop** is the mechanism that enables JavaScript to perform non-blocking, asynchronous operations despite running on a single thread. It continuously monitors the call stack and the task queues, transferring queued callbacks to the call stack when it becomes empty.

### Why Do We Need It?

Without the event loop, any operation that takes time (network requests, file reads, timers) would freeze the entire program. The event loop allows the engine to:

1. **Offload** long-running operations to the runtime environment (browser APIs, Node.js APIs).
2. **Continue** executing synchronous code without waiting.
3. **Pick up** results from completed async operations when the call stack is free.

### The Event Loop Cycle

The event loop follows a precise, repeating cycle:

```
+------------------------------------------------------------+
|                    EVENT LOOP CYCLE                         |
+------------------------------------------------------------+
|                                                            |
|  Step 1: Execute all synchronous code on the call stack    |
|           (until the call stack is empty)                   |
|                          |                                  |
|                          v                                  |
|  Step 2: Process ALL microtasks in the microtask queue     |
|           (drain the entire queue, including any new        |
|            microtasks added during processing)              |
|                          |                                  |
|                          v                                  |
|  Step 3: Render UI updates (browser only, if needed)       |
|           (requestAnimationFrame callbacks run here)        |
|                          |                                  |
|                          v                                  |
|  Step 4: Execute ONE macrotask from the macrotask queue    |
|           (the oldest/first macrotask in the queue)         |
|                          |                                  |
|                          v                                  |
|  Step 5: Go back to Step 2 (repeat)                        |
|                                                            |
+------------------------------------------------------------+
```

**Key observations:**
- ALL microtasks are drained before moving to macrotasks.
- Only ONE macrotask is processed per cycle.
- After each macrotask, the engine checks for microtasks again before the next macrotask.
- UI rendering happens between microtask processing and macrotask execution (in browsers).

---

## 5. Microtasks

### What Are Microtasks?

**Microtasks** are high-priority asynchronous tasks that execute immediately after the currently running synchronous code completes, but before any macrotasks or UI rendering. They represent work that should happen "as soon as possible."

### Sources of Microtasks

| Source | Description |
|--------|-------------|
| `Promise.then()` | Callback registered via `.then()` on a resolved/rejected promise |
| `Promise.catch()` | Callback registered via `.catch()` on a rejected promise |
| `Promise.finally()` | Callback registered via `.finally()` regardless of outcome |
| `async/await` | Code after `await` is scheduled as a microtask (equivalent to `.then()`) |
| `queueMicrotask()` | Explicitly enqueues a function as a microtask |
| `MutationObserver` | Callback triggered when observed DOM mutations occur |

### Key Characteristics

1. **Higher priority** than macrotasks -- always processed first.
2. **All microtasks** in the queue are processed before the event loop moves on.
3. **Microtasks can enqueue more microtasks**, and those will also be processed in the same cycle.
4. The microtask queue is **fully drained** each time it is checked.

### Basic Microtask Example

```javascript
console.log("1: Synchronous - start");

Promise.resolve().then(() => {
    console.log("3: Microtask - Promise.then");
});

queueMicrotask(() => {
    console.log("4: Microtask - queueMicrotask");
});

console.log("2: Synchronous - end");
```

**Output:**
```
1: Synchronous - start
2: Synchronous - end
3: Microtask - Promise.then
4: Microtask - queueMicrotask
```

**Explanation:** All synchronous code runs first (logs 1 and 2). Then both microtasks are processed in the order they were enqueued (logs 3 and 4).

### Microtasks Spawning More Microtasks

```javascript
console.log("1: Sync");

Promise.resolve().then(() => {
    console.log("2: Microtask 1");

    // This new microtask is added to the queue and processed
    // in the SAME microtask processing cycle
    queueMicrotask(() => {
        console.log("3: Microtask spawned by Microtask 1");
    });
});

Promise.resolve().then(() => {
    console.log("4: Microtask 2");
});
```

**Output:**
```
1: Sync
2: Microtask 1
4: Microtask 2
3: Microtask spawned by Microtask 1
```

**Explanation:** Microtask 1 runs and enqueues a new microtask. Microtask 2 runs next (it was already in the queue). Then the spawned microtask runs. All happen before any macrotask.

### async/await as Microtasks

Under the hood, `async/await` is syntactic sugar over Promises. Everything after an `await` expression is essentially wrapped in a `.then()` callback.

```javascript
async function demo() {
    console.log("2: Inside async (before await) - synchronous");
    await Promise.resolve();
    console.log("4: After await - this is a microtask");
}

console.log("1: Start");
demo();
console.log("3: After calling demo()");
```

**Output:**
```
1: Start
2: Inside async (before await) - synchronous
3: After calling demo()
4: After await - this is a microtask
```

**Explanation:** The code before `await` runs synchronously. The `await` pauses the function and schedules the rest as a microtask. Control returns to the caller, which logs "3". Then the microtask queue processes the continuation of `demo()`.

---

## 6. Macrotasks

### What Are Macrotasks?

**Macrotasks** (also called simply "tasks") are lower-priority asynchronous tasks. The event loop processes **one macrotask per cycle**, then checks for microtasks before processing the next macrotask.

### Sources of Macrotasks

| Source | Description |
|--------|-------------|
| `setTimeout()` | Schedules a callback after a minimum delay |
| `setInterval()` | Schedules a callback to repeat at a given interval |
| `setImmediate()` | Executes a callback after I/O events (Node.js only) |
| I/O operations | Callbacks from file system reads, network responses, etc. |
| UI rendering events | Browser paint/layout cycles |
| User interaction events | Click, scroll, keypress event callbacks |
| `MessageChannel` | `postMessage` callbacks on a `MessageChannel` |

### Key Characteristics

1. **Lower priority** than microtasks.
2. Only **one macrotask** is executed per event loop iteration.
3. After each macrotask, **all microtasks** are drained before the next macrotask runs.
4. `setTimeout(fn, 0)` does **not** mean "execute immediately" -- it means "execute as soon as the call stack and microtask queue are empty, and it is this macrotask's turn."

### Macrotask vs Microtask Ordering

```javascript
console.log("1: Synchronous");

setTimeout(() => {
    console.log("5: Macrotask (setTimeout)");
}, 0);

setInterval(() => {
    console.log("This would repeat...");
}, 10000);
// (cleared for clarity -- just showing it schedules macrotasks)

Promise.resolve().then(() => {
    console.log("3: Microtask (Promise)");
});

queueMicrotask(() => {
    console.log("4: Microtask (queueMicrotask)");
});

console.log("2: Synchronous");
```

**Output:**
```
1: Synchronous
2: Synchronous
3: Microtask (Promise)
4: Microtask (queueMicrotask)
5: Macrotask (setTimeout)
```

### One Macrotask Per Cycle, Then Microtasks

```javascript
setTimeout(() => {
    console.log("1: Macrotask A");

    Promise.resolve().then(() => {
        console.log("2: Microtask from Macrotask A");
    });
}, 0);

setTimeout(() => {
    console.log("3: Macrotask B");

    Promise.resolve().then(() => {
        console.log("4: Microtask from Macrotask B");
    });
}, 0);
```

**Output:**
```
1: Macrotask A
2: Microtask from Macrotask A
3: Macrotask B
4: Microtask from Macrotask B
```

**Explanation:** Macrotask A runs, then its microtask runs (queue drained). Only then does Macrotask B run, followed by its microtask. This confirms: one macrotask, drain microtasks, next macrotask.

---

## 7. Priority Hierarchy

The JavaScript runtime processes tasks in a strict priority order:

```
+------------------------------------------------------+
|  PRIORITY 1 (Highest): Synchronous Code              |
|  - Runs on the call stack                            |
|  - Executes immediately, line by line                |
|  - Blocks everything until complete                  |
+------------------------------------------------------+
                       |
                       v
+------------------------------------------------------+
|  PRIORITY 2: Microtasks                              |
|  - Promise callbacks (.then, .catch, .finally)       |
|  - async/await continuations (code after await)      |
|  - queueMicrotask()                                  |
|  - MutationObserver                                  |
|  - ALL microtasks drained before moving on           |
+------------------------------------------------------+
                       |
                       v
+------------------------------------------------------+
|  PRIORITY 3 (Lowest): Macrotasks                     |
|  - setTimeout / setInterval                          |
|  - setImmediate (Node.js)                            |
|  - I/O callbacks                                     |
|  - UI events                                         |
|  - ONE macrotask per event loop cycle                |
+------------------------------------------------------+
```

### Quick Proof of Priority

```javascript
// Macrotask (lowest priority)
setTimeout(() => console.log("3: Macrotask"), 0);

// Microtask (medium priority)
Promise.resolve().then(() => console.log("2: Microtask"));

// Synchronous (highest priority)
console.log("1: Synchronous");
```

**Output:**
```
1: Synchronous
2: Microtask
3: Macrotask
```

This output is **always** deterministic -- the priority hierarchy guarantees this order.

---

## 8. Complex Example with Step-by-Step Walkthrough

### The Code

```javascript
console.log("1: Script start");                              // SYNC

setTimeout(() => {                                            // MACRO 1
    console.log("8: setTimeout 1");
    Promise.resolve().then(() => {
        console.log("9: Promise inside setTimeout 1");
    });
}, 0);

Promise.resolve()                                             // MICRO chain
    .then(() => {
        console.log("4: Promise 1");
        setTimeout(() => {
            console.log("11: setTimeout inside Promise 1");
        }, 0);
    })
    .then(() => {
        console.log("6: Promise 1 chained");
    });

setTimeout(() => {                                            // MACRO 2
    console.log("10: setTimeout 2");
}, 0);

queueMicrotask(() => {                                        // MICRO
    console.log("5: queueMicrotask 1");
    queueMicrotask(() => {
        console.log("7: nested queueMicrotask");
    });
});

async function asyncDemo() {
    console.log("2: async function (before await)");
    await Promise.resolve();
    console.log("3: async function (after await)");
}

asyncDemo();

console.log("SYNC: Script end");
```

### Wait -- What Actually Prints?

Let us walk through this step by step, tracking all three areas: the call stack, the microtask queue, and the macrotask queue.

---

**PHASE 1: Synchronous Execution (Call Stack)**

| Line | Action | Output |
|------|--------|--------|
| `console.log("1: Script start")` | Direct execution | `1: Script start` |
| `setTimeout(cb1, 0)` | Registers cb1 in macrotask queue | -- |
| `Promise.resolve().then(cb2)` | Registers cb2 in microtask queue | -- |
| `setTimeout(cb3, 0)` | Registers cb3 in macrotask queue | -- |
| `queueMicrotask(cb4)` | Registers cb4 in microtask queue | -- |
| `asyncDemo()` is called | Enters the function synchronously | `2: async function (before await)` |
| `await Promise.resolve()` | Pauses asyncDemo, schedules continuation (cb5) as microtask | -- |
| `console.log("SYNC: Script end")` | Direct execution | `SYNC: Script end` |

**State after synchronous execution:**

```
Call Stack:       [ empty ]
Microtask Queue:  [ cb2 (Promise 1), cb4 (queueMicrotask 1), cb5 (async continuation) ]
Macrotask Queue:  [ cb1 (setTimeout 1), cb3 (setTimeout 2) ]
```

**Output so far:**
```
1: Script start
2: async function (before await)
SYNC: Script end
```

---

**PHASE 2: Drain Microtask Queue**

| Step | Microtask | Action | Output | New Items Queued |
|------|-----------|--------|--------|-----------------|
| 1 | cb5 (async continuation) | Runs code after `await` | `3: async function (after await)` | -- |
| 2 | cb2 (Promise 1 .then) | Logs, schedules setTimeout, and chains .then | `4: Promise 1` | Macrotask: setTimeout inside Promise 1; Microtask: cb6 (Promise 1 chained) |
| 3 | cb4 (queueMicrotask 1) | Logs, queues nested microtask | `5: queueMicrotask 1` | Microtask: cb7 (nested queueMicrotask) |
| 4 | cb6 (Promise 1 chained) | Logs | `6: Promise 1 chained` | -- |
| 5 | cb7 (nested queueMicrotask) | Logs | `7: nested queueMicrotask` | -- |

> **Note:** The order of cb5 vs cb2 can depend on engine implementation. In V8 (Chrome/Node.js), the async continuation and the Promise.then callbacks are both microtasks enqueued in order. The exact ordering may be: cb2 first, then cb4, then cb5. The output numbers in this example are labeled for clarity; see the final output below.

**State after draining microtasks:**

```
Call Stack:       [ empty ]
Microtask Queue:  [ empty ]
Macrotask Queue:  [ cb1 (setTimeout 1), cb3 (setTimeout 2), setTimeout inside Promise 1 ]
```

**Output so far:**
```
1: Script start
2: async function (before await)
SYNC: Script end
3: async function (after await)
4: Promise 1
5: queueMicrotask 1
6: Promise 1 chained
7: nested queueMicrotask
```

---

**PHASE 3: Process Macrotasks (One at a Time)**

**Macrotask Cycle 1: cb1 (setTimeout 1)**

| Action | Output | New Items |
|--------|--------|-----------|
| Runs setTimeout 1 callback | `8: setTimeout 1` | Microtask: Promise inside setTimeout 1 |
| Drain microtasks: Promise inside setTimeout 1 | `9: Promise inside setTimeout 1` | -- |

**Macrotask Cycle 2: cb3 (setTimeout 2)**

| Action | Output | New Items |
|--------|--------|-----------|
| Runs setTimeout 2 callback | `10: setTimeout 2` | -- |
| Drain microtasks: (none) | -- | -- |

**Macrotask Cycle 3: setTimeout inside Promise 1**

| Action | Output | New Items |
|--------|--------|-----------|
| Runs the callback | `11: setTimeout inside Promise 1` | -- |
| Drain microtasks: (none) | -- | -- |

---

### Final Complete Output

```
1: Script start
2: async function (before await)
SYNC: Script end
3: async function (after await)
4: Promise 1
5: queueMicrotask 1
6: Promise 1 chained
7: nested queueMicrotask
8: setTimeout 1
9: Promise inside setTimeout 1
10: setTimeout 2
11: setTimeout inside Promise 1
```

---

## 9. Gotchas and Common Pitfalls

### Gotcha 1: `setTimeout(fn, 0)` Is NOT Immediate

Many developers assume `setTimeout(fn, 0)` runs the callback immediately. It does not. The `0` means "at least 0 milliseconds," but the callback still goes through the macrotask queue and must wait for:

1. All synchronous code to finish.
2. All microtasks to be drained.
3. Its turn in the macrotask queue.

```javascript
console.log("A");

setTimeout(() => {
    console.log("C"); // This is LAST, not second
}, 0);

Promise.resolve().then(() => {
    console.log("B"); // This runs before setTimeout
});

// Output: A, B, C
```

Additionally, browsers clamp `setTimeout` delays to a **minimum of ~4ms** for nested calls (after 5+ levels of nesting), per the HTML spec.

### Gotcha 2: Microtasks Can Starve Macrotasks

Because **all** microtasks are drained before any macrotask runs, a microtask that continuously enqueues new microtasks will block macrotasks (and UI rendering) indefinitely.

```javascript
// WARNING: This will freeze the page/process!
function infiniteMicrotasks() {
    queueMicrotask(() => {
        console.log("Microtask running...");
        infiniteMicrotasks(); // Enqueues another microtask endlessly
    });
}

setTimeout(() => {
    console.log("This macrotask will NEVER run!");
}, 0);

infiniteMicrotasks();
// The microtask queue never empties, so the setTimeout callback never executes.
// In a browser, this also blocks UI rendering -- the page becomes unresponsive.
```

**How to avoid:** Never create unbounded recursive microtask chains. If you need to do iterative async work, use `setTimeout` to yield control back to the event loop periodically.

### Gotcha 3: `async/await` Splits Execution at `await`

Code before `await` runs **synchronously**. Code after `await` is scheduled as a **microtask**. This can be confusing:

```javascript
async function fetchData() {
    console.log("1: Before await");             // Synchronous
    const data = await fetch("/api/data");      // Pauses here
    console.log("3: After await");              // Microtask
    return data;
}

console.log("Start");
fetchData();
console.log("2: This runs before 'After await'");

// Output:
// Start
// 1: Before await
// 2: This runs before 'After await'
// 3: After await
```

### Gotcha 4: Promise Constructor Runs Synchronously

The executor function passed to `new Promise()` runs **synchronously**, not as a microtask. Only the `.then()` / `.catch()` / `.finally()` callbacks are microtasks.

```javascript
console.log("1: Start");

new Promise((resolve) => {
    console.log("2: Promise executor (synchronous!)");
    resolve();
}).then(() => {
    console.log("4: .then callback (microtask)");
});

console.log("3: End");

// Output:
// 1: Start
// 2: Promise executor (synchronous!)
// 3: End
// 4: .then callback (microtask)
```

### Gotcha 5: Multiple `await` Statements Create Multiple Microtask Boundaries

Each `await` creates a separate pause point:

```javascript
async function multiAwait() {
    console.log("A1");
    await Promise.resolve();
    console.log("A2");
    await Promise.resolve();
    console.log("A3");
}

async function singleLog() {
    console.log("B1");
    await Promise.resolve();
    console.log("B2");
}

multiAwait();
singleLog();
console.log("Sync end");

// Output:
// A1
// B1
// Sync end
// A2
// B2
// A3
```

**Explanation:** `A1` and `B1` run synchronously. Both functions pause at their first `await`. "Sync end" runs. Then `A2` and `B2` run as microtasks from the first await. Then `A3` runs as a microtask from the second await in `multiAwait`.

---

## 10. Practical Implications

### 10.1 Building Responsive UIs

Long-running synchronous code blocks the event loop and freezes the UI. Break heavy computation into chunks using macrotasks so the browser can render between chunks.

```javascript
// BAD: Blocks UI for the entire duration
function processLargeArray(array) {
    for (let i = 0; i < array.length; i++) {
        heavyComputation(array[i]); // Blocks for each iteration
    }
}

// GOOD: Yields to the event loop between chunks
function processInChunks(array, chunkSize = 100) {
    let index = 0;

    function processChunk() {
        const end = Math.min(index + chunkSize, array.length);

        for (let i = index; i < end; i++) {
            heavyComputation(array[i]);
        }

        index = end;

        if (index < array.length) {
            // Schedule the next chunk as a macrotask
            // This allows UI rendering and event handling between chunks
            setTimeout(processChunk, 0);
        }
    }

    processChunk();
}
```

**Why `setTimeout` instead of `queueMicrotask`?** Using a microtask would drain all chunks in the same microtask cycle, still blocking rendering. `setTimeout` is a macrotask, so the browser can render between chunks.

### 10.2 Predictable Order of Operations

Understanding the priority hierarchy helps you control execution order:

```javascript
function loadDashboard() {
    // Step 1: Immediately update the DOM with a loading state (synchronous)
    showLoadingSpinner();

    // Step 2: Fetch data -- the .then runs as a microtask when resolved
    fetchDashboardData()
        .then(data => {
            // Step 3: This microtask runs before any setTimeout callbacks
            renderDashboard(data);
        })
        .catch(error => {
            renderError(error);
        });

    // Step 3 (alternative): If you need something to happen AFTER rendering,
    // use a macrotask to ensure the browser has painted
    setTimeout(() => {
        initializeAnimations(); // Runs after the next render
    }, 0);
}
```

### 10.3 Error Handling in Async Code

Errors in microtasks and macrotasks must be handled differently:

```javascript
// -- Microtask error handling (Promises) --

// Option A: .catch()
Promise.resolve()
    .then(() => {
        throw new Error("Promise error!");
    })
    .catch(err => {
        console.error("Caught in .catch():", err.message);
    });

// Option B: async/await with try-catch
async function safeOperation() {
    try {
        const result = await riskyAsyncCall();
        return result;
    } catch (err) {
        console.error("Caught in try-catch:", err.message);
        return fallbackValue;
    }
}

// Option C: Global handler for unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled rejection:", event.reason);
    event.preventDefault(); // Prevents default browser logging
});


// -- Macrotask error handling (setTimeout, etc.) --

// Promises do NOT catch errors inside setTimeout!
// You must use try-catch inside the callback.
setTimeout(() => {
    try {
        throw new Error("Macrotask error!");
    } catch (err) {
        console.error("Caught in macrotask:", err.message);
    }
}, 0);

// This WILL NOT catch the error:
try {
    setTimeout(() => {
        throw new Error("This escapes the try-catch!");
    }, 0);
} catch (err) {
    // This block NEVER executes because the error is thrown
    // in a different execution context (the macrotask callback)
    console.error("This never runs");
}
```

### 10.4 Debouncing with Microtasks

You can use microtasks to batch multiple synchronous calls into a single async operation:

```javascript
class BatchedUpdater {
    constructor() {
        this.pending = false;
        this.updates = [];
    }

    scheduleUpdate(update) {
        this.updates.push(update);

        if (!this.pending) {
            this.pending = true;

            // All synchronous scheduleUpdate calls complete first,
            // then this microtask runs once with all accumulated updates
            queueMicrotask(() => {
                this.flush();
            });
        }
    }

    flush() {
        const updates = this.updates;
        this.updates = [];
        this.pending = false;

        // Process all batched updates at once
        console.log(`Processing ${updates.length} batched updates`);
        updates.forEach(update => update());
    }
}

const updater = new BatchedUpdater();
updater.scheduleUpdate(() => console.log("Update 1"));
updater.scheduleUpdate(() => console.log("Update 2"));
updater.scheduleUpdate(() => console.log("Update 3"));

// Output:
// Processing 3 batched updates
// Update 1
// Update 2
// Update 3
```

---

## 11. Visual Diagram of the Event Loop

```
                    +----------------------------------------------+
                    |           JAVASCRIPT RUNTIME                  |
                    |                                              |
  +-------------+  |  +------------------+    +----------------+  |
  | Heap        |  |  |   Call Stack     |    | Web APIs /     |  |
  | (Memory     |  |  |   (LIFO)        |    | Node APIs      |  |
  |  Allocation)|  |  |                  |    |                |  |
  |             |  |  | +- - - - - - -+  |    | - setTimeout   |  |
  | Objects,    |  |  | | currently   |  |    | - fetch        |  |
  | variables,  |  |  | | executing   | ------>- DOM events   |  |
  | functions   |  |  | | function    |  |    | - file I/O     |  |
  |             |  |  | +- - - - - - -+  |    | - HTTP requests|  |
  +-------------+  |  +------------------+    +-------+--------+  |
                    |         ^                        |           |
                    |         |                        |           |
                    |         |    EVENT LOOP          |           |
                    |         |    (constantly         |           |
                    |         |     checking)          |           |
                    |         |                        v           |
                    |  +------+------+    +-----------+---------+ |
                    |  | Microtask   |    | Callback / Task     | |
                    |  | Queue       |    | Queues              | |
                    |  | (Priority!) |    |                     | |
                    |  |             |    | +--Macrotask Queue-+| |
                    |  | - Promise   |    | | setTimeout cb    || |
                    |  |   .then()   |    | | setInterval cb   || |
                    |  | - async     |    | | I/O callbacks    || |
                    |  |   /await    |    | | UI events        || |
                    |  | - queue     |    | +------------------+| |
                    |  |   Microtask |    |                     | |
                    |  | - Mutation  |    |                     | |
                    |  |   Observer  |    |                     | |
                    |  +------+------+    +---------------------+ |
                    |         |                                    |
                    |         v                                    |
                    |   EVENT LOOP ALGORITHM:                      |
                    |   1. Run all sync code (call stack)          |
                    |   2. Drain ALL microtasks                    |
                    |   3. Render (if needed)                      |
                    |   4. Run ONE macrotask                       |
                    |   5. Go to step 2                            |
                    +----------------------------------------------+
```

### Simplified Flow

```
    Synchronous Code
         |
         v
    +---------+      +-----------+
    | Is call |--No->| Check     |
    | stack   |      | microtask |--Has tasks--> Run ALL microtasks --+
    | empty?  |      | queue     |                                    |
    +---------+      +-----------+                                    |
         |                ^  |                                        |
        Yes               |  No tasks                                 |
         |                |  |                                        |
         v                |  v                                        |
    +---------+           | +-----------+                             |
    | Done    |           | | Check     |                             |
    | (idle)  |           | | macrotask |--Has task--> Run ONE task --+
    +---------+           | | queue     |
                          | +-----------+
                          |      |
                          |     No tasks
                          |      |
                          |      v
                          +-- Wait for tasks...
```

---

## 12. Summary Table

| Aspect | Call Stack (Synchronous) | Microtasks | Macrotasks |
|--------|-------------------------|------------|------------|
| **What it is** | LIFO data structure tracking function execution | High-priority async task queue | Lower-priority async task queue |
| **Priority** | Highest (runs first) | High (runs after sync code) | Lowest (runs after all microtasks) |
| **Sources** | Function calls, global code | `Promise.then/catch/finally`, `async/await`, `queueMicrotask()`, `MutationObserver` | `setTimeout`, `setInterval`, `setImmediate`, I/O, UI events, `MessageChannel` |
| **Per cycle** | Runs until empty | **All** queued microtasks are drained | **One** macrotask per cycle |
| **Can spawn more?** | Yes (nested function calls) | Yes (and they run in the same drain cycle) | Yes (queued for future cycles) |
| **Blocks rendering?** | Yes (while executing) | Yes (while draining) | No (rendering happens between macrotasks) |
| **Error handling** | `try/catch` works normally | `.catch()` or `try/catch` with `await` | `try/catch` inside the callback only |
| **Use case** | Normal program flow | High-priority follow-up work (data processing after fetch) | Deferred work (animations, yielding to browser) |

---

## Key Takeaways

1. **JavaScript is single-threaded** -- only one operation runs at a time on the call stack.
2. **Execution contexts** (global and function) go through a **creation phase** (hoisting, scope chain, `this` binding) and an **execution phase** (line-by-line code execution).
3. The **call stack** uses LIFO ordering; stack overflow occurs with unbounded recursion.
4. The **event loop** bridges the single-threaded engine with the multi-threaded runtime environment.
5. **Microtasks** (Promises, async/await, queueMicrotask) have higher priority and are all drained before any macrotask.
6. **Macrotasks** (setTimeout, setInterval, I/O) execute one per event loop cycle.
7. The cycle is: **sync code -> drain ALL microtasks -> render (maybe) -> ONE macrotask -> repeat**.
8. **`setTimeout(fn, 0)` is not immediate** -- it still waits for sync code and all microtasks.
9. **Microtasks can starve macrotasks** -- never create infinite microtask chains.
10. Understanding this model is essential for writing predictable, performant, non-blocking JavaScript.

---

## Further Reading

- [MDN: Concurrency Model and the Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
- [MDN: Using Microtasks in JavaScript](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)
- [Jake Archibald: Tasks, Microtasks, Queues and Schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
- [Philip Roberts: What the heck is the event loop anyway? (JSConf EU)](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
- [HTML Spec: Event Loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)
