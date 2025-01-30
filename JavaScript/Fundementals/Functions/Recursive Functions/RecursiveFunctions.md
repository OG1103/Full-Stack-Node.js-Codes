
# Recursive Functions in JavaScript

Recursive functions call themselves to solve a problem. They must have a base case to prevent infinite recursion.

## Example: Factorial Calculation
```javascript
function factorial(n) {
  if (n === 0) return 1; // Base case
  return n * factorial(n - 1);
}
console.log(factorial(5)); // Output: 120
```

## Summary
- Recursive functions solve problems by breaking them into smaller subproblems.
- Always include a base case to avoid infinite recursion.
