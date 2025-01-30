
// Example 1: Finding the first even number in an array
const numbers = [1, 3, 7, 8, 10, 12];

const firstEven = numbers.find((number) => number % 2 === 0);

console.log(firstEven); // Output: 8

// Example 2: No match found
const oddNumbers = [1, 3, 7];

const noEvenNumber = oddNumbers.find((number) => number % 2 === 0);

console.log(noEvenNumber); // Output: undefined

// Example 3: Using `if` to handle undefined results
if (noEvenNumber !== undefined) {
  console.log(`Found an even number: ${noEvenNumber}`);
} else {
  console.log("No even number found in the array.");
}
// Output: No even number found in the array.
