
// 1. Creating Arrays
let fruits = ["apple", "banana", "cherry"];
let people = [
  { name: "John Doe", age: 30, job: "Software Developer" },
  { name: "Jane Smith", age: 25, job: "Graphic Designer" },
];
let numbers = new Array(1, 2, 3, 4, 5);

// 2. Accessing Array Elements
console.log(fruits[0]); // Output: "apple"
console.log(numbers[2]); // Output: 3

// 3. Modifying Array Elements
fruits[1] = "blueberry";
console.log(fruits); // Output: ["apple", "blueberry", "cherry"]

// 4. Adding Elements
fruits.push("date");
console.log(fruits); // Output: ["apple", "blueberry", "cherry", "date"]

// 5. Removing Elements
fruits.pop();
console.log(fruits); // Output: ["apple", "blueberry", "cherry"]

// 6. Checking Length
console.log(fruits.length); // Output: 3

// 7. Outputting Arrays
console.table(fruits);

// 8. Converting Arrays to Strings
let fruitString = fruits.join(", ");
console.log(fruitString); // Output: "apple, blueberry, cherry"

// 9. Nested Arrays
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log(matrix[0][0]); // Output: 1

// 10. Sorting Arrays
let unsortedNumbers = [40, 100, 1, 5, 25, 10];
unsortedNumbers.sort((a, b) => a - b);
console.log(unsortedNumbers); // Output: [1, 5, 10, 25, 40, 100]
