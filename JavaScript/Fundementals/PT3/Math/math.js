// mathFunctions.js
// A simple guide to some common JavaScript Math functions

// 1. Math.abs(x)
// Returns the absolute value of a number, which means it removes any negative sign.
let number = -7;
console.log(`Math.abs(${number}) =`, Math.abs(number)); // Output: 7

// 2. Math.ceil(x)
// Rounds a number up to the next largest integer.
let decimal1 = 4.2;
console.log(`Math.ceil(${decimal1}) =`, Math.ceil(decimal1)); // Output: 5

// 3. Math.floor(x)
// Rounds a number down to the nearest integer.
let decimal2 = 4.9;
console.log(`Math.floor(${decimal2}) =`, Math.floor(decimal2)); // Output: 4

// 4. Math.round(x)
// Rounds a number to the nearest integer. It rounds up if the decimal is 0.5 or greater.
let decimal3 = 4.5;
console.log(`Math.round(${decimal3}) =`, Math.round(decimal3)); // Output: 5

// 5. Math.max(...numbers)
// Returns the largest value from a list of numbers.
console.log(`Math.max(3, 9, 1, 8, 4) =`, Math.max(3, 9, 1, 8, 4)); // Output: 9

// 6. Math.min(...numbers)
// Returns the smallest value from a list of numbers.
console.log(`Math.min(3, 9, 1, 8, 4) =`, Math.min(3, 9, 1, 8, 4)); // Output: 1

// 7. Math.pow(base, exponent)
// Returns the result of raising the base to the power of the exponent.
let base = 2;
let exponent = 3;
console.log(`Math.pow(${base}, ${exponent}) =`, Math.pow(base, exponent)); // Output: 8

// 8. Math.sqrt(x)
// Returns the square root of a number.
let num = 16;
console.log(`Math.sqrt(${num}) =`, Math.sqrt(num)); // Output: 4

// 9. Math.random()
// Returns a random number between 0 (inclusive) and 1 (exclusive).
console.log(`Math.random() =`, Math.random()); // Output: Random number between 0 and 1

// To get a random number in a range (e.g., between 1 and 10):
let min = 1;
let max = 10;
let randomInRange = Math.floor(Math.random() * (max - min + 1)) + min;
console.log(`Random number between ${min} and ${max} =`, randomInRange);

// 10. Math.PI
// Math.PI is a constant that represents the value of Pi (approximately 3.14159).
console.log(`Math.PI =`, Math.PI); // Output: 3.141592653589793

// 11. Math.E
// Math.E is a constant representing Euler's number (approximately 2.718).
console.log(`Math.E =`, Math.E); // Output: 2.718281828459045

// 12. Math.log(x)
// Returns the natural logarithm (base E) of a number.
console.log(`Math.log(${Math.E}) =`, Math.log(Math.E)); // Output: 1 (logarithm base E of E)

// 13. Math.exp(x)
// Returns E raised to the power of x (the inverse of Math.log).
console.log(`Math.exp(1) =`, Math.exp(1)); // Output: 2.718281828459045 (which is Math.E)

// 14. Math.sin(x), Math.cos(x), Math.tan(x)
// These functions return the sine, cosine, and tangent of an angle (in radians).
let angle = Math.PI / 2; // 90 degrees in radians
console.log(`Math.sin(${angle}) =`, Math.sin(angle)); // Output: 1
console.log(`Math.cos(${angle}) =`, Math.cos(angle)); // Output: 0
console.log(`Math.tan(${angle}) =`, Math.tan(angle)); // Output: Infinity (undefined)

// 15. Math.sign(x)
// Returns the sign of a number: 1 for positive, -1 for negative, and 0 for zero.
let positiveNumber = 10;
let negativeNumber = -10;
console.log(`Math.sign(${positiveNumber}) =`, Math.sign(positiveNumber)); // Output: 1
console.log(`Math.sign(${negativeNumber}) =`, Math.sign(negativeNumber)); // Output: -1

// Summary:
// Math functions allow you to perform a wide range of mathematical operations in JavaScript.
// You can work with absolute values, rounding, exponents, random numbers, trigonometric functions, and more.
