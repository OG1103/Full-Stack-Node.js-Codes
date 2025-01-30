
// Basic Example
const numbers = [1, 2, 3, 4, 5];

numbers.forEach(function (number) {
  console.log(number);
});
// Output: 1, 2, 3, 4, 5

// Using Arrow Function
numbers.forEach((number) => console.log(number));
// Output: 1, 2, 3, 4, 5

// Accessing the Index in forEach()
numbers.forEach((number, index) => {
  console.log(`Index ${index}: ${number}`);
});
/*
Output:
Index 0: 1
Index 1: 2
Index 2: 3
Index 3: 4
Index 4: 5
*/

// Modifying Array Elements with forEach()
const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 },
];

people.forEach((person) => {
  person.age += 1;
});

console.log(people);
/*
Output:
[
  { name: 'Alice', age: 26 },
  { name: 'Bob', age: 31 },
  { name: 'Charlie', age: 36 }
]
*/

// Using thisArg in forEach()
const multiplier = {
  factor: 2,
  multiply(number) {
    console.log(number * this.factor);
  },
};

numbers.forEach(function (number) {
  this.multiply(number);
}, multiplier);
// Output: 2, 4, 6, 8, 10

// forEach vs. for Loop
for (let i = 0; i < numbers.length; i++) {
  console.log(numbers[i]);
}
// Output: 1, 2, 3, 4, 5

numbers.forEach((number) => console.log(number));
// Output: 1, 2, 3, 4, 5
