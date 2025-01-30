
# Callbacks in JavaScript

A callback function is a function passed as an argument to another function and executed later. It is commonly used in asynchronous programming.

## Example: Basic Callback
```javascript
function greet(name, callback) {
  console.log(`Hello, ${name}!`);
  callback();
}

function farewell() {
  console.log("Goodbye!");
}

greet("Charlie", farewell);
// Output:
// Hello, Charlie!
// Goodbye!
```

## Example: Using Callbacks with Arrays
```javascript
const numbers = [1, 2, 3];
numbers.forEach((num) => {
  console.log(num * 2);
});
// Output: 2, 4, 6
```

## Summary
- Callbacks are essential for asynchronous operations.
- They are frequently used in array methods like `map` and `forEach`.
