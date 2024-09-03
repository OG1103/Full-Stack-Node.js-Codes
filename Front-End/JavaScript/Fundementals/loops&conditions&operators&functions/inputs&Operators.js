// Using prompt to take input from the user
let userName = prompt("Please enter your name:");

// Checking if user provided input
if (userName) {
  console.log(`Hello, ${userName}!`);
} else {
  console.log("You didn't enter your name.");
}

/**
 * COMPARISON OPERATORS
 * -------------------------------
 * Comparison operators are used to compare two values.
 * The result of a comparison is always a boolean value: true or false.
 *
 * Common Comparison Operators:
 * - Equal (==)
 * - Strict Equal (===)
 * - Not Equal (!=)
 * - Strict Not Equal (!==)
 * - Greater Than (>)
 * - Greater Than or Equal (>=)
 * - Less Than (<)
 * - Less Than or Equal (<=)
 * - mod (%) remainder. e.g 2%2=0
 */

// Equal (==) and Not Equal (!=)
console.log("\nComparison Operators (== and !=) Example:");
let x = 5;
let y = "5";

console.log(x == y); // Output: true (== checks for equality of value, not type)
console.log(x != y); // Output: false (!= checks for inequality of value, not type)

// Strict Equal (===) and Strict Not Equal (!==)
console.log("\nComparison Operators (=== and !==) Example:");
console.log(x === y); // Output: false (=== checks for equality of both value and type)
console.log(x !== y); // Output: true (!== checks for inequality of both value and type)

/**
 * DIFFERENCE BETWEEN '==' AND '==='
 * -------------------------------
 * - '==' (Abstract Equality Comparison):
 *   - Checks for equality of value after converting both operands to a common type (type coercion).
 *   - Use '==' when you want to allow type conversion.
 *   - Example: 5 == "5" returns true because both are converted to the same type before comparison.
 *
 * - '===' (Strict Equality Comparison):
 *   - Checks for equality of both value and type without performing type conversion.
 *   - Use '===' when you want to avoid unexpected type coercion.
 *   - Example: 5 === "5" returns false because the types (number and string) are different.
 *
 * Use Cases:
 * - Use '==' when working with values where type coercion is acceptable or desired.
 *   Example: Comparing user input from a form (which is always a string) to a number.
 * - Use '===' when exact type and value matching is needed, and to avoid unexpected results due to type coercion.
 *   Example: Checking a user's role in a system ('admin' === userRole).
 */

// Greater Than (>) and Less Than (<)
console.log("\nComparison Operators (> and <) Example:");
let a = 10;
let b = 20;

console.log(a > b); // Output: false (a is not greater than b)
console.log(a < b); // Output: true (a is less than b)

// Greater Than or Equal (>=) and Less Than or Equal (<=)
console.log("\nComparison Operators (>= and <=) Example:");
console.log(a >= 10); // Output: true (a is equal to 10)
console.log(b <= 15); // Output: false (b is greater than 15)

/**
 * DATA TYPES AND CONDITIONS
 * -------------------------------
 * JavaScript is loosely typed, meaning variables can hold any data type.
 * When using conditions, JavaScript automatically converts types (type coercion) to evaluate the expression.
 * The '==' operator performs type coercion while '===' does not.
 */

// Example of type coercion
console.log("\nType Coercion Example:");
let num = 0;
let str = "0";

console.log(num == str); // Output: true (type coercion makes both sides equal)
console.log(num === str); // Output: false (no type coercion; different types)

// Boolean Conversion in Conditions
console.log("\nBoolean Conversion Example:");
let emptyString = "";

if (emptyString) {
  console.log("This will not print because empty string is falsy.");
} else {
  console.log("Empty string is considered falsy.");
}
// Explanation:
// - In JavaScript, certain values are considered "falsy" (false when converted to a boolean).
// - These include: false, 0, "", null, undefined, and NaN.

/**
 * LOGICAL OPERATORS
 * -------------------------------
 * Logical operators are used to combine or invert boolean values.
 * The result of a logical operation is always a boolean value: true or false.
 *
 * Common Logical Operators:
 * - Logical AND (&&)
 * - Logical OR (||)
 * - Logical NOT (!)
 */

/**
 * SUMMARY
 * -------------------------------
 * - Use 'if' to execute code blocks based on conditions.
 * - Use '==' for equality checks with type coercion, and '===' for strict equality without type coercion.
 * - Remember that JavaScript automatically converts types in conditions and comparisons.
 * - Understand falsy values (false, 0, "", null, undefined, NaN) when writing conditional statements.
 */
