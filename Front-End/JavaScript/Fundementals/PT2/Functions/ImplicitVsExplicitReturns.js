/**
 * 1. Implicit vs Explicit Returns in JavaScript Functions
 * -------------------------------------------------------
 * In JavaScript, arrow functions can have two types of return behavior:
 * - **Implicit return**: When the function automatically returns the result of an expression.
 * - **Explicit return**: When the `return` keyword is used to return a value.
 *
 * Regular functions always require explicit returns.
 */

// 2. Arrow Functions with Implicit Return
// ---------------------------------------
// If the function body is a single expression, you can omit the curly braces
// and the result of that expression is automatically returned.

const add = (a, b) => a + b; // Implicit return
console.log(add(2, 3)); // Output: 5

// Another example of implicit return with a string:
const greet = (name) => `Hello, ${name}!`;
console.log(greet("Alice")); // Output: "Hello, Alice!"

// 3. Arrow Functions with Explicit Return
// ---------------------------------------
// If you use curly braces `{}`, you must explicitly return a value using the `return` keyword.

const multiply = (a, b) => {
  return a * b; // Explicit return
};
console.log(multiply(2, 3)); // Output: 6

// 4. Regular Functions with Explicit Return
// -----------------------------------------
// In regular functions (declared with the `function` keyword), the `return` keyword is always required.

function subtract(a, b) {
  return a - b; // Explicit return is necessary in regular functions
}
console.log(subtract(5, 3)); // Output: 2

// 5. Key Differences
// ------------------
// - Implicit return can only be used with arrow functions.
// - You can only have an implicit return if the function body is a single expression (no curly braces).
// - For more complex logic or multi-line function bodies, you must use explicit return with curly braces.

// 6. Example with multi-line logic (must use explicit return)

const divide = (a, b) => {
  if (b === 0) {
    return "Cannot divide by zero"; // Explicit return
  }
  return a / b; // Explicit return
};
console.log(divide(6, 2)); // Output: 3
console.log(divide(6, 0)); // Output: "Cannot divide by zero"
