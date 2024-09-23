/**
 * Ternary Operator in JavaScript
 * ------------------------------
 * The ternary operator is a shorthand way to write an `if...else` statement.
 * It evaluates a condition and returns one value if the condition is true,
 * and another value if the condition is false.
 *
 * Syntax:
 * --------
 * condition ? expressionIfTrue : expressionIfFalse;
 *
 * - `condition`: The expression to evaluate (returns either `true` or `false`).
 * - `expressionIfTrue`: This expression is executed and returned if the condition is true.
 * - `expressionIfFalse`: This expression is executed and returned if the condition is false.
 *
 * The ternary operator is useful for writing concise, inline conditional expressions.
 */

// Example 1: Basic ternary operator usage
let age = 18;
let canVote = age >= 18 ? "Eligible to vote" : "Not eligible to vote";
console.log(canVote); // Output: "Eligible to vote"

// Explanation:
// - The condition `age >= 18` is checked. If true, "Eligible to vote" is returned.
// - If false, "Not eligible to vote" is returned.

// Example 2: Ternary operator with a boolean value
let isLoggedIn = true;
let greeting = isLoggedIn ? "Welcome back!" : "Please log in.";
console.log(greeting); // Output: "Welcome back!"

// Example 3: Nested ternary operator (though it can be hard to read)
let score = 85;
let grade = score >= 90 ? "A" : score >= 80 ? "B" : "C";
console.log(grade); // Output: "B"

// Explanation:
// - The first condition checks if the score is 90 or higher. If true, "A" is returned.
// - If false, it moves on to check if the score is 80 or higher. If true, "B" is returned.
// - If neither condition is true, "C" is returned as the final value.
