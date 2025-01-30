
// Examples: Implicit vs Explicit Returns

// Implicit Return in Arrow Functions
const add = (a, b) => a + b; // Implicit return
console.log(add(2, 3)); // Output: 5

const greet = (name) => `Hello, ${name}!`; // Implicit return with a string
console.log(greet("Alice")); // Output: "Hello, Alice!"

// Explicit Return in Arrow Functions
const multiply = (a, b) => {
  return a * b; // Explicit return
};
console.log(multiply(2, 3)); // Output: 6

const divide = (a, b) => {
  if (b === 0) {
    return "Cannot divide by zero"; // Explicit return
  }
  return a / b; // Explicit return
};
console.log(divide(6, 2)); // Output: 3
console.log(divide(6, 0)); // Output: "Cannot divide by zero"

// Explicit Return in Regular Functions
function subtract(a, b) {
  return a - b; // Explicit return
}
console.log(subtract(5, 3)); // Output: 2
