// JavaScript Errors Overview

// In JavaScript, errors are thrown when something goes wrong in the execution of code.
// There are several types of built-in errors in JavaScript:

// 1. SyntaxError: Thrown when there's a syntax mistake in your code.
let x = 5; // Missing semicolon, but no error here in most cases

// 2. ReferenceError: Thrown when a non-existent variable is referenced.
console.log(y); // ReferenceError: y is not defined

// 3. TypeError: Thrown when a value is not of the expected type.
let num = 5;
num.toUpperCase(); // TypeError: num.toUpperCase is not a function

// 4. RangeError: Thrown when a number is outside an allowed range.
let arr = new Array(-1); // RangeError: Invalid array length

// 5. EvalError: Thrown by the `eval()` function in certain cases (rarely used nowadays).
eval("foo bar"); // EvalError: Unexpected identifier

// 6. URIError: Thrown when there's an error in encoding or decoding a URI.
decodeURIComponent("%"); // URIError: URI malformed
