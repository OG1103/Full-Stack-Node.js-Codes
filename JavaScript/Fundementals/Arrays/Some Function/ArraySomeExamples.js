
// Example 1: Basic usage with numbers
const numbers = [1, 2, 3, 4, 5];

// Check if there's at least one number greater than 3
const hasNumberGreaterThanThree = numbers.some(num => num > 3);
console.log(hasNumberGreaterThanThree); // Output: true

// Example 2: Using some() to check an array of objects
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

// Check if at least one user has the name 'Bob'
const hasBob = users.some(user => user.name === 'Bob');
console.log(hasBob); // Output: true

// Example 3: No elements pass the test
const evenNumbers = [2, 4, 6, 8];

// Check if there's any number less than 0
const hasNegativeNumber = evenNumbers.some(num => num < 0);
console.log(hasNegativeNumber); // Output: false

// Example 4: some() with index and array arguments
const letters = ['a', 'b', 'c', 'd'];

// Check if the letter at index 1 is 'b'
const hasBAtIndex1 = letters.some((letter, index) => index === 1 && letter === 'b');
console.log(hasBAtIndex1); // Output: true
