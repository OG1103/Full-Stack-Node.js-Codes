//utils.js
// Named exports at the declaration
export const PI = 3.14159; // Named export: PI
export const E = 2.718; // Named export: E
export const add = (a, b) => a + b; // Named export: add function
export const subtract = (a, b) => a - b; // Named export: subtract function

// A simple square function declared and exported at the end of the file
const square = (x) => x * x;

// Anonymous default export (arrow function)
// This function doubles each number in the array
export default (numbers) => {
  return numbers.map((num) => num * 2);
};

export { square };
//----------------------------------------------------------------------------
//main.js
// Importing default and named exports
import processNumbers, { PI, E, add, subtract, square } from "./utils.js";
//import

const nums = [1, 2, 3, 4, 5];

// Using the default export (anonymous arrow function)
const doubled = processNumbers(nums); // this is the default function i imported, i gave it that name since its a default function
console.log(doubled); // Output: [2, 4, 6, 8, 10]

// Using named exports
console.log(PI); // Output: 3.14159 // had to import it following the same naming convention as declared in the file that exported it as its not a default
console.log(E); // Output: 2.718
console.log(add(10, 5)); // Output: 15
console.log(subtract(10, 5)); // Output: 5
console.log(square(4)); // Output: 16

//--------------------------------------------------------------------------
// USING IMPORT * EXAMPLE
// main.js
// Importing all named exports under 'utils' and the default export separately
import processNumbers from "./utils.js"; // Default export
import * as utils from "./utils.js"; // Named exports

const nums1 = [1, 2, 3, 4, 5];

// Using the default export (anonymous arrow function)
const doubled1 = processNumbers(nums); // The default export function
console.log(doubled1); // Output: [2, 4, 6, 8, 10]

// Using named exports via the 'utils' namespace
console.log(utils.PI); // Output: 3.14159
console.log(utils.E); // Output: 2.718
console.log(utils.add(10, 5)); // Output: 15
console.log(utils.subtract(10, 5)); // Output: 5
console.log(utils.square(4)); // Output: 16

//--------------------------------------------------------------------------

//another example of exporting defined consts as default

// mathUtils.js
const add = (a, b) => a + b;
//export default add;

// when importing
import sum from "./mathUtils.js";

console.log(sum(2, 3)); // Output: 5
