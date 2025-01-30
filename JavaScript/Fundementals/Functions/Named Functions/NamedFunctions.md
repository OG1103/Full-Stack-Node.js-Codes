
# Named Functions in JavaScript

Named functions are functions declared using the `function` keyword followed by a name. They are the most common way to define functions in JavaScript and are hoisted, meaning they can be invoked before they are defined.

## Syntax
```javascript
function functionName(parameters) {
  // function body
  return value; // optional
}
```

## Key Features
- **Hoisting**: Named functions can be called before their definition in the code.
- **Reusable**: They are reusable blocks of code that can take parameters and return a value.
- **Descriptive Names**: Using descriptive names improves code readability.

## Example: Basic Named Function
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
console.log(greet("Alice")); // Output: Hello, Alice!
```

## Example: Function with Multiple Parameters
```javascript
function add(a, b) {
  return a + b;
}
console.log(add(3, 5)); // Output: 8
```

## Example: Using Functions for Calculations
```javascript
function calculateArea(length, width) {
  return length * width;
}
console.log(calculateArea(5, 3)); // Output: 15
```

## Summary
- Named functions are fundamental building blocks in JavaScript.
- They are hoisted and can be used anywhere in their scope.
- Always use descriptive names for functions to improve code readability.
