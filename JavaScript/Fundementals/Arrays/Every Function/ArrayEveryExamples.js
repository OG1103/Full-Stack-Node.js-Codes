
// Example 1: Simple example with numbers
const numbers = [2, 4, 6, 8, 10];
const allEven = numbers.every((num) => num % 2 === 0);
console.log(allEven); // Output: true

// Example 2: Mixed numbers
const mixedNumbers = [2, 4, 5, 8, 10];
const allEvenMixed = mixedNumbers.every((num) => num % 2 === 0);
console.log(allEvenMixed); // Output: false

// Example 3: Checking array elements with a condition
const ages = [18, 21, 25, 32];
const allAdults = ages.every((age) => age >= 18);
console.log(allAdults); // Output: true

// Example 4: More complex example with objects
const users = [
  { name: "Alice", age: 25, active: true },
  { name: "Bob", age: 30, active: true },
  { name: "Charlie", age: 22, active: false },
];

const allActive = users.every((user) => user.active === true);
console.log(allActive); // Output: false

// Example 5: Checking nested properties in objects
const teams = [
  { name: "Team A", members: [{ name: "Alice" }, { name: "Bob" }] },
  { name: "Team B", members: [{ name: "Charlie" }, { name: "David" }] },
];

const hasMultipleMembers = teams.every((team) => team.members.length > 1);
console.log(hasMultipleMembers); // Output: true

// Example 6: Checking arrays with mixed data types
const mixedArray = [2, "hello", true, {}, null];
const allNumbers = mixedArray.every((element) => typeof element === "number");
console.log(allNumbers); // Output: false

// Example 7: Combining `every()` with other methods (e.g., `filter()`)
const products = [
  { name: "Laptop", price: 1000, available: true },
  { name: "Phone", price: 500, available: false },
  { name: "Tablet", price: 800, available: true },
];

const areAllExpensiveAvailableProducts = products
  .filter((product) => product.available === true)
  .every((product) => product.price > 700);
console.log(areAllExpensiveAvailableProducts); // Output: true

// Example 8: Using index and array parameters
const numbersWithIndexCheck = [1, 2, 3, 4, 5];
const greaterThanIndex = numbersWithIndexCheck.every(
  (num, index) => num > index
);
console.log(greaterThanIndex); // Output: true

// Complex Example
// Comparing Two Objects
const objA = { a: 1, b: 1, c: 1 };
const objB = { a: 1, b: 1, c: 1 };
const objC = { a: 1, b: 1, d: 1 };

const objEqual1 = (obj1, obj2) => {
  return Object.keys(obj1).every((key) => obj2[key]);
};

console.log(objEqual1(objA, objB)); // Output: true
console.log(objEqual1(objA, objC)); // Output: false
