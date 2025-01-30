
// Example: Number
let num = 42;
let floatNum = 3.14;
console.log(typeof num); // Output: "number"
console.log(typeof floatNum); // Output: "number"

// Special Number Values
let notANumber = NaN;
console.log(typeof notANumber); // Output: "number"

// Example: String
let templateLiteral = `The sum is ${num + floatNum}`;
console.log(typeof templateLiteral); // Output: "string"
console.log(templateLiteral); // Output: "The sum is 45.14"

// Example: Boolean
let isCodingFun = true;
console.log(typeof isCodingFun); // Output: "boolean"

// Example: Undefined
let undefinedVar;
console.log(typeof undefinedVar); // Output: "undefined"

// Example: Null
let emptyValue = null;
console.log(typeof emptyValue); // Output: "object"

// Example: Symbol
let uniqueId = Symbol("id");
console.log(typeof uniqueId); // Output: "symbol"

// Example: BigInt
let largeNumber = 1234567890123456789012345678901234567890n;
console.log(typeof largeNumber); // Output: "bigint"

// Example: Objects
let person = { name: "John", age: 30 };
console.log(typeof person); // Output: "object"

// Example: Arrays
let array = [1, 2, 3];
console.log(typeof array); // Output: "object"
console.log(Array.isArray(array)); // Output: true

// Example: Functions
function greet() {
  return "Hello!";
}
console.log(typeof greet); // Output: "function"
