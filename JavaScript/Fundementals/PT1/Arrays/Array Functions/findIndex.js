
/*
  This file explains how the `findIndex` method works in JavaScript arrays, with examples and detailed comments.
  
  The `findIndex` method returns the index of the first element in an array that satisfies a provided testing function aka returns ture.
  If no elements satisfy the testing function, it returns -1.
*/

const numbers = [10, 20, 30, 40, 50];

// Example 1: Basic usage of findIndex
const index = numbers.findIndex((number) => number > 25); 
// In this example, the function looks for the first element greater than 25.
// It finds 30 at index 2, so it returns 2.

console.log("Index of the first number greater than 25:", index); // Output: 2

/*
  Explanation:
  - `findIndex` takes a callback function that runs on each element of the array.
  - The callback function checks a condition (in this case, `number > 25`).
  - It returns the index of the first element that meets the condition.
  - If no element matches the condition, `findIndex` returns -1.
*/

// Example 2: Using findIndex to search for an object in an array
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

const userIndex = users.findIndex((user) => user.name === 'Bob');
// This searches for the user object where the name is 'Bob'.
// It returns the index of Bob, which is 1.

console.log("Index of the user named 'Bob':", userIndex); // Output: 1

/*
  Explanation:
  - `findIndex` is useful when you need the position of an object or element in an array.
  - The callback function can access object properties to perform the search.
  - In this case, the function checks if `user.name === 'Bob'`, and when it finds the match, it returns the index.
*/

// Example 3: When no element matches the condition
const noMatchIndex = numbers.findIndex((number) => number > 100);
// Here, no element in the array is greater than 100, so `findIndex` returns -1.

console.log("Index when no element matches the condition:", noMatchIndex); // Output: -1

/*
  Conclusion:
  - Use `findIndex` when you need to find the position of an element in an array based on a condition.
  - The method stops searching once it finds the first match, which makes it efficient in large arrays.
  - If no match is found, it returns -1.
*/

