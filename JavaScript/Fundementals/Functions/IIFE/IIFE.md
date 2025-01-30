
# Immediately Invoked Function Expressions (IIFE)

An IIFE (pronounced "iffy") is a JavaScript function that runs as soon as it is defined. It is often used to create isolated scopes.

## Syntax
```javascript
(function () {
  console.log("This is an IIFE!");
})();
```

## Example: IIFE with Parameters
```javascript
(function (name) {
  console.log(`Hello, ${name}!`);
})("Alice");
// Output: Hello, Alice!
```

## Use Case: Preventing Global Scope Pollution
```javascript
(function () {
  const privateVariable = "This is private";
  console.log(privateVariable);
})();
// console.log(privateVariable); // Error: privateVariable is not defined
```

## Summary
- IIFEs are useful for creating isolated scopes.
- They help avoid polluting the global namespace.
