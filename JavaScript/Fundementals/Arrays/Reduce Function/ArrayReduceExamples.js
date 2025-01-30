
// Example 1: Summing Numbers
const numbers = [1, 2, 3, 4, 5];

const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
console.log("Sum:", sum); // Output: 15

// Example 2: Finding the Maximum Value
const max = numbers.reduce((acc, num) => (num > acc ? num : acc), numbers[0]);
console.log("Maximum Value:", max); // Output: 5

// Example 3: Counting Occurrences
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];

const fruitCount = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});

console.log("Fruit Count:", fruitCount); // Output: { apple: 3, banana: 2, orange: 1 }

// Example 4: Flattening an Array
const nestedArray = [[1, 2], [3, 4], [5]];

const flattened = nestedArray.reduce((acc, arr) => acc.concat(arr), []);
console.log("Flattened Array:", flattened); // Output: [1, 2, 3, 4, 5]

// Example 5: Transforming an Array of Objects
const transactions = [
  { type: "income", amount: 100 },
  { type: "expense", amount: 50 },
  { type: "income", amount: 200 },
];

const balance = transactions.reduce((acc, transaction) => {
  return transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount;
}, 0);

console.log("Balance:", balance); // Output: 250

// Example 6: Grouping Data
const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 25 },
];

const groupedByAge = people.reduce((acc, person) => {
  const ageGroup = person.age;
  acc[ageGroup] = acc[ageGroup] || [];
  acc[ageGroup].push(person);
  return acc;
}, {});

console.log("Grouped by Age:", groupedByAge);
// Output:
// {
//   25: [{ name: "Alice", age: 25 }, { name: "Charlie", age: 25 }],
//   30: [{ name: "Bob", age: 30 }]
// }
