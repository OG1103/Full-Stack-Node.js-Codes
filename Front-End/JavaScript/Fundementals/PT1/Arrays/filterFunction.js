/**
 * Array.prototype.filter()
 * ------------------------
 * The `filter()` method creates a new array with all elements that pass the test
 * implemented by the provided function (callback function).
 *
 * Syntax:
 * --------
 * array.filter(callback(element, index, array), thisArg)
 * - `callback`: A function that tests each element. Return `true` to keep the element, `false` to filter it out.
 *   - `element`: The current element in the array being processed. It is the element of the array that is being tested against a condition. If it passes it is added to the array returned as the result
 *   - `index` (optional): The index of the current element.
 *   - `array` (optional): The array on which `filter()` is called.
 * - `thisArg` (optional): Value to use as `this` when executing the callback.
 *
 * If the condition inside the callback returns true, the element is included in the new array that filter produces. If it returns false, the element is excluded.
 * In the filter method, the callback function can be as long or complex as you need it to be.
 * However, regardless of what logic you include inside the callback, the ultimate goal is to return either true or false for each element in the array.
 * Returns:
 * --------
 * - A new array with the elements that pass the test.
 */

// Example 1: Filtering even numbers from an array
const numbers = [1, 2, 3, 4, 5, 6];
//num is the parameter representing each individual element in the numbers array.
const evenNumbers = numbers.filter((num) => num % 2 === 0);
console.log(evenNumbers); // Output: [2, 4, 6]

// Example 2: Filtering objects based on a condition
const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 17 },
  { name: "Charlie", age: 22 },
];

const adults = people.filter((person) => person.age >= 18);
console.log(adults);
// Output: [{ name: "Alice", age: 25 }, { name: "Charlie", age: 22 }]

/**
 * Key points:
 * -----------
 * - `filter()` doesn't modify the original array; it returns a new array.
 * - It only includes elements for which the callback returns `true`.
 * - It's useful for creating subsets of arrays based on specific conditions.
 */

//long call back function
const arr = [1, 2, 3, 4, 5, 6, 7, 8];

const filteredArr = arr.filter((num) => {
  const isEven = num % 2 === 0;
  const isDivisibleBy3 = num % 3 === 0;

  // Do something else if needed (extra conditions on each element)

  // Now decide whether to include the number or not
  return isEven || isDivisibleBy3;
}); // Filters based on the conditions
console.log(filteredArr); // Output: [2, 3, 4, 6, 8]
