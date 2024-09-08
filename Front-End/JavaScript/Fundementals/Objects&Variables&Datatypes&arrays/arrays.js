/*
Arrays in JavaScript:
----------------------
- Arrays are a type of object in JavaScript used to store an ordered collection of values (elements).
- Each element in an array has a numbered index, starting from 0.
- Arrays can store elements of any type, including numbers, strings, objects, other arrays, or mixed types.
- Arrays are created using square brackets `[]` or with the `new Array()` constructor.
*/

// 1. Creating Arrays

// Using array literal syntax xx= [-,-,-,-]
let fruits = ["apple", "banana", "cherry"];
// Creating an array of objects
let people = [
  {
    name: "John Doe",
    age: 30,
    job: "Software Developer",
  },
  {
    name: "Jane Smith",
    age: 25,
    job: "Graphic Designer",
  },
  {
    name: "Emily Johnson",
    age: 35,
    job: "Project Manager",
  },
];
// Using the Array constructor
let numbers = new Array(1, 2, 3, 4, 5);

// Creating an array with mixed types however not advised
let mixedArray = [
  42, // Number
  "Hello, World!", // String
  true, // Boolean
  { name: "Omar", age: 21 }, // Object
  [1, 2, 3], // Array
  function () {
    // Function
    console.log("This is a function inside an array!");
  },
  null, // Null
  undefined, // Undefined
];

// Output the entire array
console.log(mixedArray);

/*
  Console Output:
  [
    42,
    'Hello, World!',
    true,
    { name: 'Omar', age: 21 },
    [ 1, 2, 3 ],
    [Function (anonymous)],
    null,
    undefined
  ]
  */

//-----------------------------------------------------------------

// 2. Accessing Array Elements
// - Use the index of the element to access it, starting with 0 for the first element.

console.log(fruits[0]); // Output: "apple"
console.log(numbers[2]); // Output: 3
// Accessing individual objects in the array
console.log(people[0]); // Output: { name: 'John Doe', age: 30, job: 'Software Developer' }
console.log(people[1].name); // Output: "Jane Smith"
console.log(people[2].job); // Output: "Project Manager"

//--------------------------------------------------------------------

// 3. Modifying Array Elements
// - Assign a new value to the element at a specific index.

fruits[1] = "blueberry"; // Changing "banana" to "blueberry"
console.log(fruits); // Output: ["apple", "blueberry", "cherry"]

//--------------------------------------------------------------------

// 4. Adding New Elements to Arrays
// - Use the `push()` method to add an element to the end of an array.
// - Use the `unshift()` method to add an element to the beginning of an array.

fruits.push("date");
console.log(fruits); // Output: ["apple", "blueberry", "cherry", "date"]

numbers.unshift(0);
console.log(numbers); // Output: [0, 1, 2, 3, 4, 5]

/**
 * Using `splice()` to Insert Elements:
 * ------------------------------------
 * - The `splice()` method can be used to add, remove, or replace elements in an array.
 * - To insert new elements, provide the start index and specify 0 for the number of elements to remove.
 * - Syntax: array.splice(startIndex, deleteCount, item1, item2, ..., itemN)
 * - `startIndex`: The index at which to start changing the array.
 * - `deleteCount`: An integer indicating the number of old array elements to remove (if 0, no elements are removed).
 * - `item1, item2, ..., itemN`: The elements to add to the array at the `startIndex`.
 */

// Example: Using `splice()` to insert elements into an array

let colors = ["red", "green", "blue"];

// Insert "yellow" and "orange" at index 1 (after "red")
colors.splice(1, 0, "yellow", "orange");

console.log(colors); // Output: ["red", "yellow", "orange", "green", "blue"]

// Explanation:
// - `colors.splice(1, 0, "yellow", "orange")` starts at index 1.
// - `0` indicates that no elements should be removed.
// - `"yellow"` and `"orange"` are inserted starting at index 1.
// - The array is modified to include the new elements in the specified positions.

//--------------------------------------------------------------------

// 5. Removing Elements from Arrays
// - Use the `pop()` method to remove the last element from an array.
// - Use the `shift()` method to remove the first element from an array.
// - Use the `splice(startIndex, deleteCount)` method to remove a specific element from an array at a given index and returns an array of the deleted elements.

fruits.pop();
console.log(fruits); // Output: ["apple", "blueberry", "cherry"]

numbers.shift();
console.log(numbers); // Output: [1, 2, 3, 4, 5]

// Remove the element "banana" (index 1)
fruits.splice(1, 1);
console.log(fruits); // Output: ["apple", "cherry", "date"]

// Remove the element "3" (index 2)
numbers.splice(2, 1);
console.log(numbers); // Output: [1, 2, 4, 5]

//--------------------------------------------------------------------

// 6. Checking the Length of an Array
// - The `length` property returns the number of elements in an array.

console.log(fruits.length); // Output: 3
console.log(numbers.length); // Output: 5

//--------------------------------------------------------------------

// 7. Outputting an Entire Array
// - Using `console.log()` to output the whole array in a readable format.

console.log(fruits); // Output: ["apple", "blueberry", "cherry"]
console.log(numbers); // Output: [1, 2, 3, 4, 5]

//--------------------------------------------------------------------

// 8. Converting Arrays to Strings
// - Use `join()` to convert an array to a string, with elements separated by a specified delimiter.

let fruitString = fruits.join(", ");
console.log(fruitString); // Output: "apple, blueberry, cherry"

//--------------------------------------------------------------------

// 9. Using `console.table()`
// - `console.table()` displays an array (or object) in a tabular format.

console.table(fruits);
// Output (as a table):
// ┌─────────┬───────────┐
// │ (index) │  Values   │
// ├─────────┼───────────┤
// │    0    │  'apple'  │
// │    1    │ 'blueberry' │
// │    2    │ 'cherry'  │
// └─────────┴───────────┘

// 10. Nested Arrays (Multi-dimensional Arrays)
// - Arrays can contain other arrays, which is useful for representing matrices or grids.

let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// Accessing elements in nested arrays
console.log(matrix[0][0]); // Output: 1
console.log(matrix[1][2]); // Output: 6

/*
Summary:
--------
- Arrays store ordered collections of elements and are created using literals `[]` or constructors `new Array()`.
- Access, modify, and manage arrays using various methods like `push()`, `pop()`, `shift()`, and `unshift()`.
- Output entire arrays using `console.log()` or `console.table()` for a structured view.
- Convert arrays to strings using `join()` or display them using `JSON.stringify()` in different environments.
*/
