# Understanding the Event Loop in Node.js

## Introduction
The event loop is a fundamental concept in Node.js, responsible for handling asynchronous operations. It allows Node.js to perform non-blocking I/O operations despite being single-threaded.

## How the Event Loop Works
The event loop in Node.js operates in phases, where each phase handles a specific type of task. The main phases are:
1. **Timers**: Executes callbacks scheduled by `setTimeout()` and `setInterval()`.
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration.
3. **Idle, Prepare**: Only used internally by Node.js.
4. **Poll**: Retrieves new I/O events and executes I/O-related callbacks.
5. **Check**: Executes callbacks scheduled by `setImmediate()`.
6. **Close Callbacks**: Executes `close` event callbacks (e.g., `socket.on('close')`).

## Example
Here's a simple example demonstrating the event loop phases:

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout callback');
}, 0);

setImmediate(() => {
  console.log('Immediate callback');
});

Promise.resolve().then(() => {
  console.log('Promise callback');
});

console.log('End');
```

### Expected Output
```
Start
End
Promise callback
Immediate callback
Timeout callback
```

### Explanation
1. **Synchronous Code**: `console.log('Start')` and `console.log('End')` execute first since they are synchronous.
2. **Microtasks**: The Promise callback runs next because microtasks (like promises) have higher priority than timers and `setImmediate()`.
3. **Check Phase**: `setImmediate()` callback runs next.
4. **Timers Phase**: Finally, the `setTimeout()` callback runs.

## Conclusion
The event loop is a powerful mechanism that enables Node.js to handle asynchronous operations efficiently. Understanding its phases and priority order is crucial for writing performant and non-blocking code.

## References
- [Node.js Event Loop Documentation](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
