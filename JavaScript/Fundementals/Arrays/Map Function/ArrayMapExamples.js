
// Basic Example
const numbers = [1, 2, 3, 4, 5];

const doubledNumbers = numbers.map(function (number) {
  return number * 2;
});

console.log("Original array:", numbers); // Output: [1, 2, 3, 4, 5]
console.log("Doubled array:", doubledNumbers); // Output: [2, 4, 6, 8, 10]

// Using Arrow Functions
const tripledNumbers = numbers.map((num) => num * 3);
console.log("Tripled array:", tripledNumbers); // Output: [3, 6, 9, 12, 15]

// Example with Index
const multipliedByIndex = numbers.map((num, index) => num * index);
console.log("Numbers multiplied by their index:", multipliedByIndex); // Output: [0, 2, 6, 12, 20]

// Example with Array of Objects
const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 },
];

const names = people.map((person) => person.name);
console.log("Names array:", names); // Output: ['Alice', 'Bob', 'Charlie']

// Transforming Data
const products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Phone", price: 500 },
];

const productSummaries = products.map((product) => ({
  productName: product.name,
  productPrice: product.price,
}));

console.log("Product summaries:", productSummaries);
// Output: [{ productName: 'Laptop', productPrice: 1000 }, { productName: 'Phone', productPrice: 500 }]

// Chaining map() with Other Array Methods
const mixedNumbers = [1, 2, 3, 4, 5, 6];

const evenDoubled = mixedNumbers
  .filter((num) => num % 2 === 0) // Filters out odd numbers
  .map((num) => num * 2); // Doubles the remaining numbers

console.log("Doubled even numbers:", evenDoubled); // Output: [4, 8, 12]

// Advanced Example: Calculating Average Grades
const students = [
  { id: 1, name: "Alice", grades: [85, 92, 78] },
  { id: 2, name: "Bob", grades: [88, 79, 94] },
  { id: 3, name: "Charlie", grades: [95, 89, 90] },
];

const studentsWithAverage = students.map((student) => {
  const totalGrades = student.grades.reduce((sum, grade) => sum + grade, 0);
  const averageGrade = totalGrades / student.grades.length;

  return {
    id: student.id,
    name: student.name,
    average: averageGrade.toFixed(2),
  };
});

console.log("Students with average grades:", studentsWithAverage);
// Output:
// [
//   { id: 1, name: 'Alice', average: '85.00' },
//   { id: 2, name: 'Bob', average: '87.00' },
//   { id: 3, name: 'Charlie', average: '91.33' }
// ]
