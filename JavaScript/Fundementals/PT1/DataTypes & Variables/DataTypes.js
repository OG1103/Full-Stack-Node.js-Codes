// JavaScript Data Types Explained
//When you declare a variable using var, let, or const, you do not specify its datatype. The type is inferred from the assigned value.

// 1. Number
// JavaScript has one number type. It can be an integer or a floating-point number.
let num = 42; // integer
let floatNum = 3.14; // floating-point number
console.log(typeof num); // Output: "number"
console.log(typeof floatNum); // Output: "number"

// Special number values
let infinity = Infinity;
let negativeInfinity = -Infinity;
let notANumber = NaN; // NaN stands for "Not a Number"
console.log(typeof notANumber); // Output: "number"

// 2. String
// A sequence of characters used to represent text. Strings can be defined using single quotes, double quotes, or backticks.
let singleQuoteString = "Hello, World!";
let doubleQuoteString = "JavaScript is fun!";
let templateLiteral = `The result is: ${num + floatNum}`; // Template literals can include expressions
console.log(typeof singleQuoteString); // Output: "string"
console.log(templateLiteral); // Output: "The result is: 45.14"

// 3. Boolean
// Represents logical values: true or false.
let isJavaScriptFun = true;
let isCodingHard = false;
console.log(typeof isJavaScriptFun); // Output: "boolean"

// 4. Undefined
// A variable that has been declared but has not yet been assigned a value.
let undefinedVariable;
console.log(typeof undefinedVariable); // Output: "undefined"

// 5. Null
// Represents the intentional absence of any object value. It's considered a primitive data type.
let emptyValue = null;
console.log(typeof emptyValue); // Output: "object"
// Note: This is a quirk in JavaScript; `null` is a primitive but `typeof null` returns "object".

// 6. Object
// A collection of properties and methods. Objects can be created using the object literal syntax {} or with the `new` keyword.
let person = {
  name: "John Doe",
  age: 30,
  isDeveloper: true,
};
console.log(typeof person); // Output: "object"

// 7. Symbol
// A unique and immutable primitive value, often used as the key for object properties.
let uniqueId = Symbol("id");
console.log(typeof uniqueId); // Output: "symbol"

// 8. BigInt
// Represents whole numbers larger than 2^53 - 1 (Number.MAX_SAFE_INTEGER). BigInts are created by appending 'n' to the end of an integer or using the BigInt constructor.
let largeNumber = 1234567890123456789012345678901234567890n;
console.log(typeof largeNumber); // Output: "bigint"

// Special Cases:

// Arrays
// Arrays are a special type of object in JavaScript that store ordered collections of data.
let array = [1, 2, 3, 4, 5];
console.log(typeof array); // Output: "object"
console.log(Array.isArray(array)); // Output: true (to check if it's actually an array)

// Functions
// Functions in JavaScript are objects but have their own type, 'function'.
function greet() {
  return "Hello!";
}
console.log(typeof greet); // Output: "function"

// Conclusion:
// JavaScript has 7 primitive data types: Number, String, Boolean, Undefined, Null, Symbol, and BigInt.
// All other types are considered objects.
