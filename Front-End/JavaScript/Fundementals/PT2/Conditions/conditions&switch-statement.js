/**
 * JAVASCRIPT NOTES: IF CONDITIONS, COMPARISON OPERATORS, AND DATA TYPES
 *
 * This file explains the usage of if conditions, comparison operators,
 * and how different data types behave in JavaScript. It also covers the
 * differences between '==' and '===' and when to use each.
 */

/**
 * IF CONDITIONS
 * -------------------------------
 * The 'if' statement is used to execute a block of code if a specified condition evaluates to true.
 * It is a fundamental building block in JavaScript for decision-making.
 */

// Basic if statement
console.log("Basic if Statement Example:");
let age = 20;

if (age >= 18) {
  console.log("You are eligible to vote.");
}
// Explanation:
// - The condition 'age >= 18' checks if the age is greater than or equal to 18.
// - If the condition is true, it prints "You are eligible to vote."

// if...else statement
console.log("\nIf...Else Statement Example:");
let isStudent = false;

if (isStudent) {
  console.log("You are a student.");
} else {
  console.log("You are not a student.");
}
// Explanation:
// - The 'if' checks if 'isStudent' is true.
// - If true, it prints "You are a student."
// - If false, it prints "You are not a student."

// if...else if...else statement
console.log("\nIf...Else If...Else Statement Example:");
let score = 75;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else if (score >= 70) {
  console.log("Grade: C");
} else {
  console.log("Grade: F");
}
// Explanation:
// - Multiple conditions are checked in order.
// - The first condition that evaluates to true has its block executed.
// - If no condition is true, the 'else' block is executed.

/**
 * SWITCH STATEMENTS
 * -------------------------------
 * A 'switch' statement is used to perform different actions based on different conditions.
 * It is a cleaner way to compare the same expression against multiple values.
 *
 * Basic Syntax:
 * switch (expression) {
 *   case value1 :
 *     // Code to execute if expression === value1
 *     break;
 *   case value2 :
 *     // Code to execute if expression === value2
 *     break;
 *   ...
 *   default :
 *     // Code to execute if none of the above cases match
 * }
 *
 * - 'expression' is evaluated once and compared with the values of each case.
 * - 'case valueX:' defines a block of code to execute if the expression matches the valueX.
 * - 'break' statement exits the switch block. Without it, execution falls through to the next case.
 * - 'default:' block is optional and executes if none of the cases match.
 */

console.log("\nSwitch Statement Example:");
let fruit = "apple";

switch (fruit) {
  case "banana":
    console.log("Banana is $1.00 per pound.");
    break;
  case "apple":
    console.log("Apple is $2.00 per pound.");
    break;
  case "orange":
    console.log("Orange is $1.50 per pound.");
    break;
  default:
    console.log("Sorry, we don't have that fruit.");
}
// Explanation:
// - The 'switch' statement evaluates the expression 'fruit'.
// - It compares 'fruit' with each 'case' value ('banana', 'apple', 'orange').
// - When a match is found, the corresponding block of code is executed.
// - The 'break' statement prevents the execution from falling through to the next case.
// - If no cases match, the 'default' block is executed.
