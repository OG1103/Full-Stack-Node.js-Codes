// The 'find' function in JavaScript is used to search through an array
// and return the first element that satisfies a specified condition.
// It takes a callback function as an argument. This callback function
// is executed for each element of the array until a match is found.
// If no match is found, 'find' returns 'undefined'.

// Syntax:
// array.find(callback(element, index, array));

// Parameters:
// - element: The current element being processed in the array.
// - index (optional): The index of the current element being processed.
// - array (optional): The array find was called upon.

// The 'find' function will return the first element that returns 'true' for the condition,
// or 'undefined' if no such element exists.

// Example: Find the first even number in an array

const numbers = [1, 3, 7, 8, 10, 12];

// Using 'find' to get the first even number
const firstEven = numbers.find((number) => number % 2 === 0);

console.log(firstEven); // Output: 8

// Explanation:
// - We have an array of numbers: [1, 3, 7, 8, 10, 12].
// - The callback function checks if the current 'number' is even (i.e., number % 2 === 0).
// - The 'find' function starts checking from the beginning of the array.
// - It will return '8' because 8 is the first number that satisfies the condition of being even.

// If no elements match the condition, 'find' will return 'undefined':
const oddNumbers = [1, 3, 7];

// Trying to find an even number in an array of odd numbers
const noEvenNumber = oddNumbers.find((number) => number % 2 === 0);

console.log(noEvenNumber); // Output: undefined

// Using an if condition to check if an even number was found
if (noEvenNumber !== undefined) {
  console.log(`Found an even number: ${noEvenNumber}`);
} else {
  console.log("No even number found in the array.");
}
