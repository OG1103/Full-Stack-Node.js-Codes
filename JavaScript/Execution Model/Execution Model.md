# JavaScript Execution Model: Call Stack, Event Loop, and Task Queues

## Overview

JavaScript is **single-threaded**, meaning it can only execute one piece of code at a time. However, it can handle asynchronous operations efficiently through the event loop and task queues. Understanding how these components work together is crucial for writing effective JavaScript code.

---

## The Call Stack

### What is it?

The **call stack** is a data structure that keeps track of function calls in your program. It works on a Last-In-First-Out (LIFO) principle.

### How it works:

1. When a function is called, it's **pushed** onto the stack
2. When a function completes, it's **popped** off the stack
3. JavaScript executes whatever is on top of the stack

### Example:

```javascript
function first() {
    console.log('First function');
    second();
    console.log('First function end');
}

function second() {
    console.log('Second function');
    third();
}

function third() {
    console.log('Third function');
}

first();

// Call Stack progression:
// 1. [first]
// 2. [first, second]
// 3. [first, second, third]
// 4. [first, second]         // third() completes
// 5. [first]                 // second() completes
// 6. []                      // first() completes
```

### Output:
```
First function
Second function
Third function
First function end
```

### Stack Overflow:

If you call functions recursively without a base case, you'll overflow the stack:

```javascript
function recursive() {
    recursive(); // Never stops!
}

recursive(); // ❌ Maximum call stack size exceeded
```

---

## The Event Loop

### What is it?

The **event loop** is the mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It constantly checks if the call stack is empty and then processes tasks from the task queues.

### How it works:

1. Execute all synchronous code (call stack)
2. When call stack is empty, check the **microtask queue**
3. Execute all microtasks
4. Check the **macrotask queue**
5. Execute one macrotask
6. Repeat from step 2

### Visual representation:

```
┌─────────────────────────┐
│      Call Stack         │ ← JavaScript executes code here
└─────────────────────────┘
            ↓
┌─────────────────────────┐
│  Microtask Queue        │ ← Promises, queueMicrotask
│  (Higher Priority)      │
└─────────────────────────┘
            ↓
┌─────────────────────────┐
│  Macrotask Queue        │ ← setTimeout, setInterval, I/O
│  (Lower Priority)       │
└─────────────────────────┘
```

---

## Microtasks

### What are they?

**Microtasks** are tasks that need to be executed as soon as possible after the current script finishes, but before any macrotasks.

### Common sources of microtasks:

- `Promise.then()`, `Promise.catch()`, `Promise.finally()`
- `async/await` (they use promises under the hood)
- `queueMicrotask()`
- `MutationObserver`

### Key characteristics:

- **Higher priority** than macrotasks
- **All microtasks** are executed before moving to macrotasks
- Microtasks can queue more microtasks (be careful of infinite loops!)

### Example:

```javascript
console.log('1: Synchronous');

Promise.resolve().then(() => {
    console.log('3: Microtask 1');
});

Promise.resolve().then(() => {
    console.log('4: Microtask 2');
});

console.log('2: Synchronous');

// Output:
// 1: Synchronous
// 2: Synchronous
// 3: Microtask 1
// 4: Microtask 2
```

---

## Macrotasks

### What are they?

**Macrotasks** (also called tasks) are operations that are executed one at a time after all microtasks have been processed.

### Common sources of macrotasks:

- `setTimeout()`
- `setInterval()`
- `setImmediate()` (Node.js only)
- I/O operations
- UI rendering
- User interactions (clicks, keyboard events)

### Key characteristics:

- **Lower priority** than microtasks
- **One macrotask** is executed per event loop cycle
- After each macrotask, all microtasks are processed before the next macrotask

### Example:

```javascript
console.log('1: Synchronous');

setTimeout(() => {
    console.log('5: Macrotask');
}, 0);

Promise.resolve().then(() => {
    console.log('3: Microtask');
});

console.log('2: Synchronous');

// Output:
// 1: Synchronous
// 2: Synchronous
// 3: Microtask
// 5: Macrotask (even though timeout is 0!)
```

---

## Execution Order: The Complete Picture

### Priority hierarchy:

1. **Synchronous code** (call stack) - Highest priority
2. **Microtasks** (promises, queueMicrotask)
3. **Macrotasks** (setTimeout, setInterval) - Lowest priority

### Detailed event loop cycle:

```
1. Execute synchronous code until call stack is empty
2. Process ALL microtasks in the microtask queue
3. Render UI (if needed, in browsers)
4. Execute ONE macrotask from the macrotask queue
5. Go back to step 2
```

---

## Complex Example

Let's see everything working together:

```javascript
console.log('1: Start');

setTimeout(() => {
    console.log('7: Timeout 1');
    Promise.resolve().then(() => {
        console.log('8: Promise inside timeout');
    });
}, 0);

Promise.resolve()
    .then(() => {
        console.log('4: Promise 1');
        setTimeout(() => {
            console.log('9: Timeout inside promise');
        }, 0);
    })
    .then(() => {
        console.log('5: Promise 2');
    });

setTimeout(() => {
    console.log('10: Timeout 2');
}, 0);

Promise.resolve().then(() => {
    console.log('6: Promise 3');
});

console.log('2: End');

queueMicrotask(() => {
    console.log('3: Microtask');
});
```

### Output and explanation:

```
1: Start                      // Synchronous
2: End                        // Synchronous
3: Microtask                  // Microtask (queueMicrotask)
4: Promise 1                  // Microtask (Promise.then)
5: Promise 2                  // Microtask (chained .then)
6: Promise 3                  // Microtask (Promise.then)
7: Timeout 1                  // Macrotask (setTimeout)
8: Promise inside timeout     // Microtask (created by macrotask)
9: Timeout inside promise     // Macrotask (created by microtask earlier)
10: Timeout 2                 // Macrotask (setTimeout)
```

### Step-by-step breakdown:

1. **Call Stack Phase**: Execute all synchronous code (logs 1 and 2)
2. **Microtask Phase**: Process all microtasks (logs 3, 4, 5, 6)
   - Note: Promise 1's `.then()` creates a new timeout (scheduled as macrotask)
3. **Macrotask Phase**: Execute first macrotask - "Timeout 1" (logs 7)
4. **Microtask Phase**: Process microtask created by Timeout 1 (logs 8)
5. **Macrotask Phase**: Execute next macrotask - "Timeout inside promise" (logs 9)
6. **Macrotask Phase**: Execute next macrotask - "Timeout 2" (logs 10)

---

## Common Patterns and Gotchas

### Gotcha 1: setTimeout with 0ms is not immediate

```javascript
console.log('First');

setTimeout(() => {
    console.log('Third');
}, 0);

Promise.resolve().then(() => {
    console.log('Second');
});

// Output: First, Second, Third
// Even with 0ms, setTimeout is a macrotask!
```

### Gotcha 2: Microtasks can starve macrotasks

```javascript
function createMicrotasks() {
    Promise.resolve().then(() => {
        console.log('Microtask');
        createMicrotasks(); // Creates another microtask!
    });
}

setTimeout(() => {
    console.log('This may never run!');
}, 0);

createMicrotasks();

// The timeout might never execute because microtasks keep creating more microtasks
```

### Gotcha 3: Async/await and the event loop

```javascript
async function asyncFunction() {
    console.log('2: Inside async function');
    
    await Promise.resolve();
    
    console.log('4: After await');
}

console.log('1: Before async call');
asyncFunction();
console.log('3: After async call');

// Output:
// 1: Before async call
// 2: Inside async function
// 3: After async call
// 4: After await

// Everything after 'await' is like a .then() - it's a microtask!
```

---

## Practical Implications

### 1. Use Promises for responsive UIs

Promises (microtasks) execute before the next render, making your app feel more responsive:

```javascript
// ❌ Bad: Blocks UI
for (let i = 0; i < 1000000; i++) {
    // Heavy computation
}

// ✅ Better: Break into chunks with setTimeout
function processChunk(start) {
    const end = Math.min(start + 1000, 1000000);
    for (let i = start; i < end; i++) {
        // Process chunk
    }
    if (end < 1000000) {
        setTimeout(() => processChunk(end), 0);
    }
}
processChunk(0);
```

### 2. Order matters for dependent operations

```javascript
// ❌ Race condition potential
setTimeout(() => updateUI(), 0);
setTimeout(() => fetchData(), 0);

// ✅ Use promises to ensure order
fetchData()
    .then(() => updateUI());
```

### 3. Error handling in async code

```javascript
// Errors in microtasks need to be caught
Promise.resolve()
    .then(() => {
        throw new Error('Oops!');
    })
    .catch(err => {
        console.error('Caught:', err.message);
    });

// Errors in macrotasks need try-catch or error handlers
setTimeout(() => {
    try {
        throw new Error('Oops!');
    } catch (err) {
        console.error('Caught:', err.message);
    }
}, 0);
```

---

## Summary Table

| Feature | Call Stack | Microtasks | Macrotasks |
|---------|-----------|------------|------------|
| **Execution** | Immediate | After current script, before macrotasks | After all microtasks |
| **Priority** | Highest | High | Low |
| **Examples** | Function calls | Promises, queueMicrotask | setTimeout, I/O |
| **Quantity per cycle** | All until empty | All in queue | One per cycle |
| **Can create more?** | Yes (function calls) | Yes (can queue more) | Yes (can schedule more) |

---

## Key Takeaways

1. **JavaScript is single-threaded** but handles async operations via the event loop
2. **Call stack** executes synchronous code first (highest priority)
3. **Microtasks** (promises) run before macrotasks (higher priority)
4. **Macrotasks** (setTimeout) run one per event loop cycle (lower priority)
5. The event loop constantly checks: Call Stack → Microtasks → One Macrotask → Repeat
6. Understanding this helps you write predictable async code and avoid race conditions

---

## Further Reading

- [Jake Archibald's Event Loop Visualization](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
- [MDN: Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
- [Philip Roberts: What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)