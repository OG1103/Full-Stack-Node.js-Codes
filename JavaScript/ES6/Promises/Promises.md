# Promises in JavaScript ES6

## Overview

- Promises are a way to handle asynchronous operations in JavaScript. A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value.
- Promises help avoid callback hell and make asynchronous code easier to read and maintain.
- Promises in JavaScript are asynchronous, meaning they allow code to execute in the background without blocking the main thread.

---

## 1. Basic Concept of a Promise

A Promise in JavaScript is like a placeholder for a value that will be available at some point in the future. It has three states:

- **Pending**: The promise is still executing and has not been fulfilled or rejected.
- **Fulfilled**: The operation completed successfully, and the promise now has a value.
- **Rejected**: The operation failed, and the promise has a reason for the failure.

---

## 2. Creating a Promise

You can create a promise using the `new Promise()` constructor. The promise constructor takes a function as an argument, which has two parameters: `resolve` and `reject`.

### Example:

```javascript
const myPromise = new Promise((resolve, reject) => {
  let success = true;

  if (success) {
    resolve("Operation was successful!");
  } else {
    reject("There was an error.");
  }
});

// Using Async
async function myAsyncFunction() {
  let success = true;

  if (success) {
    return "Operation was successful!"; // Implicitly resolves the promise
  } else {
    throw new Error("There was an error."); // Implicitly rejects the promise
  }
}

myAsyncFunction()
  .then((response) => console.log(response)) // Output: Operation was successful!
  .catch((error) => console.error(error));
```

---

## 3. Using Promises

After creating a promise, you can handle its result using `.then()`, `.catch()`, and `.finally()`.

- **`.then(onFulfilled)`**: This method is used to handle the promise when it is resolved. You can use arrow functions inside it.

- **`.catch(onRejected)`**: This method is used to handle promise rejection (failure).

- **`.finally()`**: This method is called after the promise is settled, whether fulfilled or rejected.

### Example:

```javascript
myPromise
  .then((message) => {
    console.log(message); // Output: Operation was successful!
  })
  .catch((error) => {
    console.error(error); // Output: There was an error.
  })
  .finally(() => {
    console.log("Promise settled.");
  });
```

---

## 4. Chaining Promises

One of the powerful features of promises is chaining. You can chain multiple `.then()` calls to perform operations sequentially.

### Example:

```javascript
fetchData()
  .then((data) => processData(data))
  .then((processedData) => saveData(processedData))
  .catch((error) => console.error("Error:", error));
```

---

## 5. Promise Combinators

### a) `Promise.all()`

- `Promise.all()` takes an array of promises and returns a single promise. This returned promise resolves when **all** the promises in the array have resolved.
- If **one** promise rejects, then the entire `Promise.all()` rejects, and the rejection reason (the error from the rejected promise) is returned.

### Example:

```javascript
const promise1 = Promise.resolve(10);
const promise2 = Promise.resolve(20);
const promise3 = Promise.resolve(30);

Promise.all([promise1, promise2, promise3])
  .then((results) => console.log(results)) // Output: [10, 20, 30]
  .catch((error) => console.error(error));
```

### b) `Promise.race()`

- `Promise.race()` returns a promise that resolves or rejects as soon as **one** of the promises in the array resolves or rejects.

### Example:

```javascript
const promise1 = new Promise((resolve) => setTimeout(resolve, 100, "First"));
const promise2 = new Promise((resolve) => setTimeout(resolve, 200, "Second"));

Promise.race([promise1, promise2]).then((result) => console.log(result)); // Output: First
```

### c) `Promise.allSettled()`

- `Promise.allSettled()` returns a promise that resolves when **all** the given promises have either resolved or rejected.
- The result is an array of objects, each describing the outcome of each promise.

### Example:

```javascript
const promise1 = Promise.resolve(10);
const promise2 = Promise.reject("Error occurred");
const promise3 = Promise.resolve(30);

Promise.allSettled([promise1, promise2, promise3]).then((results) => console.log(results));
/*
Output:
[
  { status: 'fulfilled', value: 10 },
  { status: 'rejected', reason: 'Error occurred' },
  { status: 'fulfilled', value: 30 }
]
*/
```

---

## Summary

- **Promise States**: `pending`, `fulfilled`, `rejected`.
- **Methods**:
  - `.then()`: for handling fulfillment.
  - `.catch()`: for handling rejection.
  - `.finally()`: for cleanup after either fulfillment or rejection.
- **Async/Await**: Simplifies working with promises and makes the code look synchronous.
