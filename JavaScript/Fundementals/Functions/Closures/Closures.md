
# Closures in JavaScript

A closure is a function that has access to its own scope, the scope of the outer function, and the global scope. Closures are created every time a function is defined.

## Example: Basic Closure
```javascript
function outerFunction(outerVariable) {
  return function innerFunction(innerVariable) {
    console.log(`Outer: ${outerVariable}`);
    console.log(`Inner: ${innerVariable}`);
  };
}

const closureExample = outerFunction("Outer Value");
closureExample("Inner Value");
// Output:
// Outer: Outer Value
// Inner: Inner Value
```

## Example: Closure with Counter
```javascript
function createCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // Output: 1
console.log(counter()); // Output: 2
```

## Summary
- Closures allow functions to "remember" variables from their outer scope.
- They are widely used in callbacks, event handlers, and factory functions.
