/**
 * JavaScript Array.prototype.every() Method
 * -----------------------------------------
 * The `every()` method tests whether all elements in the array pass the test implemented by the provided function (callback).
 *
 * Syntax:
 * --------
 * array.every(callback(element, index, array), thisArg)
 *
 * Parameters:
 * -----------
 * - `callback`: A function to test each element of the array.
 *   - `element`: The current element being processed in the array.
 *   - `index` (optional): The index of the current element.
 *   - `array` (optional): The array `every()` was called upon.
 * - `thisArg` (optional): Value to use as `this` when executing `callback`.
 *
 * Returns:
 * --------
 * - `true` if the callback returns `true` for every element.
 * - `false` if the callback returns `false` for at least one element.
 *
 * Important:
 * ----------
 * - `every()` does not mutate the original array.
 * - The `callback` function stops running as soon as it encounters a `false` result.
 */

// Example 1: Simple example with numbers
const numbers = [2, 4, 6, 8, 10];

// Test if every number is even
const allEven = numbers.every((num) => num % 2 === 0);
console.log(allEven); // Output: true

// Example 2: Simple example with mixed numbers
const mixedNumbers = [2, 4, 5, 8, 10];

// Test if every number is even
const allEvenMixed = mixedNumbers.every((num) => num % 2 === 0);
console.log(allEvenMixed); // Output: false (because 5 is not even)

// Example 3: Checking array elements with a condition
const ages = [18, 21, 25, 32];

// Test if every person is an adult (age >= 18)
const allAdults = ages.every((age) => age >= 18);
console.log(allAdults); // Output: true

// Example 4: More complex example with objects
const users = [
  { name: "Alice", age: 25, active: true },
  { name: "Bob", age: 30, active: true },
  { name: "Charlie", age: 22, active: false },
];

// Test if every user is active
const allActive = users.every((user) => user.active === true);
console.log(allActive); // Output: false (because Charlie is not active)

// Example 5: Checking nested properties in objects
const teams = [
  { name: "Team A", members: [{ name: "Alice" }, { name: "Bob" }] },
  { name: "Team B", members: [{ name: "Charlie" }, { name: "David" }] },
];

// Test if every team has more than one member
const hasMultipleMembers = teams.every((team) => team.members.length > 1);
console.log(hasMultipleMembers); // Output: true

// Example 6: Checking arrays with mixed data types
const mixedArray = [2, "hello", true, {}, null];

// Test if every element is a number
const allNumbers = mixedArray.every((element) => typeof element === "number");
console.log(allNumbers); // Output: false (because there are non-number elements)

// Example 7: Combining `every()` with other methods (e.g., `filter()`)
const products = [
  { name: "Laptop", price: 1000, available: true },
  { name: "Phone", price: 500, available: false },
  { name: "Tablet", price: 800, available: true },
];

// First, filter products that are available, then check if they all have a price greater than 700
const areAllExpensiveAvailableProducts = products
  .filter((product) => product.available === true)
  .every((product) => product.price > 700);
console.log(areAllExpensiveAvailableProducts); // Output: true

// Example 8: Using index and array parameters
const numbersWithIndexCheck = [1, 2, 3, 4, 5];

// Check if every number is greater than its index
const greaterThanIndex = numbersWithIndexCheck.every(
  (num, index) => num > index
);
console.log(greaterThanIndex); // Output: true

/**
 * Summary:
 * ---------
 * - `every()` is used to verify that all elements in an array meet a specific condition.
 * - It stops as soon as a single element fails the condition, making it efficient.
 * - It works well with simple values like numbers or strings, but can also be used with complex structures like objects and arrays.
 *
 * Usage Tips:
 * -----------
 * - Use `every()` when you need to ensure that **every element** in an array passes a given test.
 * - Be cautious when using with large arrays of objects to avoid performance issues in complex conditions.
 */

const objA = { a: 1, b: 1, c: 1 };
const objB = { a: 1, b: 1, c: 1 };
const objC = { a: 1, b: 1, d: 1 };

const objEqual1 = (obj1, obj2) => {
  //object.keys(object)=> returns an array of the keys of the objects
  return Object.keys(obj1).every((key) => obj2[key]);
  //If obj2 has a value for this key and it's truthy (e.g., a non-null value), the callback returns true.
  // If obj2[key] is null, undefined, or any other falsy value, the callback returns false.
};
