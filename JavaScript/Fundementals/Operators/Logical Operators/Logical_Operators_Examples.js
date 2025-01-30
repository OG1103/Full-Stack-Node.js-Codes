
// Complex Examples of Logical Operators in JavaScript

// Example 1: Nested logical operators
let age = 30;
let hasID = true;
let isVIP = false;

if ((age >= 21 && hasID) || isVIP) {
    console.log("You can enter the club.");
} else {
    console.log("Access denied.");
}
// Output: You can enter the club.

// Example 2: Providing default values with ||
let userInput = null;
let defaultValue = "Default";
let result = userInput || defaultValue;

console.log("Result:", result);
// Output: Result: Default

// Example 3: Using logical NOT to toggle a boolean value
let isActive = false;
console.log("Before toggle:", isActive);

isActive = !isActive;
console.log("After toggle:", isActive);
// Output:
// Before toggle: false
// After toggle: true

// Example 4: Short-circuit evaluation with AND (&&)
let isReady = true;
let message = isReady && "Ready to proceed!";
console.log(message);
// Output: Ready to proceed!

// Example 5: Combining truthy and falsy values
let a = 0;
let b = "Hello";
let c = null;

console.log(a || b); // Outputs: Hello (first truthy value)
console.log(a && b); // Outputs: 0 (first falsy value)

// Example 6: Logical operators with functions
function isEven(num) {
    return num % 2 === 0;
}

let number = 8;
if (isEven(number) && number > 5) {
    console.log(`${number} is even and greater than 5.`);
}
// Output: 8 is even and greater than 5.

// Example 7: Using AND and OR together
let score = 85;
if (score >= 90 || (score >= 80 && score < 90)) {
    console.log("You passed with a good score!");
}
// Output: You passed with a good score!
