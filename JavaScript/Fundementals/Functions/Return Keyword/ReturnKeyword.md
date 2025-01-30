
# The `return` Keyword in JavaScript

The `return` keyword is used to:
1. Stop the execution of a function.
2. Specify a value to return to the function caller.

## Syntax
```javascript
function functionName() {
  return value;
}
```

## Example: Returning a Value
```javascript
function add(a, b) {
  return a + b;
}
console.log(add(3, 5)); // Output: 8
```

## Example: Conditional Return
```javascript
function checkAge(age) {
  if (age >= 18) {
    return "You are an adult.";
  } else {
    return "You are a minor.";
  }
}
console.log(checkAge(20)); // Output: You are an adult.
```

## Summary
- The `return` keyword allows functions to output a value to their caller.
- If no `return` is provided, the function returns `undefined` by default.
