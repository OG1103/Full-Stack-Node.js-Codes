
// Example 1: Filtering even numbers from an array
const numbers = [1, 2, 3, 4, 5, 6];
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

// Example 3: Using a long callback function
const arr = [1, 2, 3, 4, 5, 6, 7, 8];

const filteredArr = arr.filter((num) => {
  const isEven = num % 2 === 0;
  const isDivisibleBy3 = num % 3 === 0;

  // Now decide whether to include the number or not
  return isEven || isDivisibleBy3;
});
console.log(filteredArr); // Output: [2, 3, 4, 6, 8]
