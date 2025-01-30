
// Example 1: Basic usage of findIndex
const numbers = [10, 20, 30, 40, 50];

const index = numbers.findIndex((number) => number > 25);
console.log("Index of the first number greater than 25:", index); // Output: 2

// Example 2: Using findIndex to search for an object in an array
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

const userIndex = users.findIndex((user) => user.name === 'Bob');
console.log("Index of the user named 'Bob':", userIndex); // Output: 1

// Example 3: When no element matches the condition
const noMatchIndex = numbers.findIndex((number) => number > 100);
console.log("Index when no element matches the condition:", noMatchIndex); // Output: -1
