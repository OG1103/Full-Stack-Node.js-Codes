// JavaScript Notes: Array.prototype.some()

/**
 * The `some()` method checks if **at least one element** in an array
 * satisfies a provided testing function (callback). It returns `true`
 * if at least one element passes the test; otherwise, it returns `false`.
 *
 * Syntax:
 * array.some(callback(element, index, array), thisArg);
 *
 * Parameters:
 * - `callback`: A function to test each element of the array. It accepts three arguments:
 *    - `element`: The current element being processed.
 *    - `index` (optional): The index of the current element.
 *    - `array` (optional): The array `some()` was called upon.
 * - `thisArg` (optional): Value to use as `this` inside the callback function.
 *
 * Return Value:
 * - Returns `true` if the callback function returns `true` for at least one element.
 * - Returns `false` if none of the elements pass the test.
 *
 * Important:
 * - `some()` will stop iterating once it finds a matching element that satisfies the condition.
 * - It does not modify the original array.
 */

// Example 1: Basic usage with numbers
const numbers = [1, 2, 3, 4, 5];

// Check if there's at least one number greater than 3
const hasNumberGreaterThanThree = numbers.some(num => num > 3);
console.log(hasNumberGreaterThanThree); // Output: true

// Explanation:
// The callback checks each number. Since 4 and 5 are greater than 3, 
// the `.some()` method returns `true` after finding the first match (4).

// Example 2: Using some() to check an array of objects
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

// Check if at least one user has the name 'Bob'
const hasBob = users.some(user => user.name === 'Bob');
console.log(hasBob); // Output: true

// Explanation:
// The callback tests if any user object has the name 'Bob'. Since user with id 2 has 
// this name, `.some()` returns `true`.

// Example 3: No elements pass the test
const evenNumbers = [2, 4, 6, 8];

// Check if there's any number less than 0
const hasNegativeNumber = evenNumbers.some(num => num < 0);
console.log(hasNegativeNumber); // Output: false

// Explanation:
// None of the numbers in the `evenNumbers` array are less than 0, so the `.some()` method
// returns `false`.

// Example 4: `some()` with index and array arguments
const letters = ['a', 'b', 'c', 'd'];

// Check if the letter at index 1 is 'b'
const hasBAtIndex1 = letters.some((letter, index) => index === 1 && letter === 'b');
console.log(hasBAtIndex1); // Output: true

// Explanation:
// The callback checks if the index is 1 and the letter is 'b'. When the second element 
// is evaluated (index 1), it matches the condition, so `.some()` returns `true`.

