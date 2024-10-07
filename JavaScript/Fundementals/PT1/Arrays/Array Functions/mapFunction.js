//------------------------
// JavaScript Array map() Function
//------------------------

/*
The `map()` method creates a new array by applying a function to each element of the original array.
It does NOT modify the original array, but returns a new array with transformed values.

Syntax:
  array.map(function(currentValue, index, array), thisArg)

Parameters:
  - currentValue: The current element being processed in the array.
  - index (optional): The index of the current element.
  - array (optional): The array that `map()` is being called on.
  - thisArg (optional): Value to use as `this` when executing the callback function.

The callback function is applied to each element in the array, and the result is returned in a new array.
*/

//------------------------
// Basic Example
//------------------------

const numbers = [1, 2, 3, 4, 5];

/* 
Here, we are using `map()` to create a new array where each number is multiplied by 2.
*/
const doubledNumbers = numbers.map(function (number) {
  return number * 2;
});

console.log("Original array:", numbers); // Output: [1, 2, 3, 4, 5]
console.log("Doubled array:", doubledNumbers); // Output: [2, 4, 6, 8, 10]

/* 
Explanation:
- The `map()` method loops over each element in the `numbers` array.
- It applies the callback function, which multiplies each element by 2.
- The result of each function call is stored in a new array called `doubledNumbers`.
*/

//------------------------
// Example with Arrow Function
//------------------------

/*
You can use arrow functions for a shorter and more concise syntax.
*/
const tripledNumbers = numbers.map((num) => num * 3);
console.log("Tripled array:", tripledNumbers); // Output: [3, 6, 9, 12, 15]

//------------------------
// Example with Index
//------------------------

/*
You can also access the index of each element within the callback function.
In this example, we multiply each element by its index.
*/
const multipliedByIndex = numbers.map((num, index) => num * index);
console.log("Numbers multiplied by their index:", multipliedByIndex); // Output: [0, 2, 6, 12, 20]

/*
Explanation:
- The first element (1) is multiplied by its index (0), resulting in 0.
- The second element (2) is multiplied by its index (1), resulting in 2, and so on.
*/

//------------------------
// Example with Array of Objects
//------------------------

/*
The `map()` method is particularly useful when working with arrays of objects.
Here, we will extract a specific property from each object in the array.
*/

const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 },
];

/*
We use `map()` to create a new array that contains just the names of the people.
*/
const names = people.map((person) => person.name);
console.log("Names array:", names); // Output: ['Alice', 'Bob', 'Charlie']

/*
Explanation:
- We pass a function that returns the `name` property of each `person` object.
- The `map()` method returns a new array containing only the names.
*/

//------------------------
// Example: Transforming Data
//------------------------

/*
The `map()` method is useful for transforming the shape of data.
For example, we can transform an array of objects by changing their structure.
*/

const products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Phone", price: 500 },
];

/*
Here, we want to transform the `products` array into an array that only contains product names and prices.
*/
const productSummaries = products.map((product) => {
  return {
    productName: product.name,
    productPrice: product.price,
  };
});

console.log("Product summaries:", productSummaries);
// Output: [{ productName: 'Laptop', productPrice: 1000 }, { productName: 'Phone', productPrice: 500 }]

/*
Explanation:
- We use `map()` to create a new array of objects that contains only `productName` and `productPrice`.
- The original array is not modified.
*/

//------------------------
// Chaining map() with Other Array Methods
//------------------------

/*
You can chain `map()` with other array methods, such as `filter()` or `reduce()`.
In this example, we first filter out odd numbers and then double the even numbers using `map()`.
*/

const mixedNumbers = [1, 2, 3, 4, 5, 6];

const evenDoubled = mixedNumbers
  .filter((num) => num % 2 === 0) // Filters out odd numbers, keeping [2, 4, 6]
  .map((num) => num * 2); // Doubles the remaining numbers, resulting in [4, 8, 12]

console.log("Doubled even numbers:", evenDoubled); // Output: [4, 8, 12]

/*
Explanation:
- `filter()` first removes odd numbers.
- Then, `map()` is applied to double the values of the remaining even numbers.
*/

//------------------------
// Conclusion
//------------------------

/*
The `map()` function is a versatile tool in JavaScript for transforming arrays. It allows you to:
- Apply a function to each element in an array.
- Create a new array based on the results of that function.
- It’s non-destructive, meaning the original array is left unchanged.
This makes `map()` extremely useful for transforming data without altering the original structure.
*/

// ADVANCED EXAMPLE
const students = [
  { id: 1, name: "Alice", grades: [85, 92, 78] },
  { id: 2, name: "Bob", grades: [88, 79, 94] },
  { id: 3, name: "Charlie", grades: [95, 89, 90] },
];

/*
  Goal:
  We want to create a new array where each student object is transformed to include their average grade.
  Using map() with an arrow function, we will calculate the average grade for each student and add it as a new property.
  */

const studentsWithAverage = students.map((student) => {
  // Calculate average of grades
  const totalGrades = student.grades.reduce((sum, grade) => sum + grade, 0);
  const averageGrade = totalGrades / student.grades.length;

  // Return a new object with the original student details + average grade
  return {
    id: student.id,
    name: student.name,
    average: averageGrade.toFixed(2), // Keep 2 decimal places
  };
});

console.log("Students with average grades:", studentsWithAverage);
/* 
  Output:
  [
    { id: 1, name: 'Alice', average: '85.00' },
    { id: 2, name: 'Bob', average: '87.00' },
    { id: 3, name: 'Charlie', average: '91.33' }
  ]
  */

/*
.reduce() Method in JavaScript:
------------------------------
- The `reduce()` method executes a reducer function on each element of the array, resulting in a single output value.
- It is commonly used to accumulate values, such as summing numbers in an array.
- Syntax: 
  array.reduce((accumulator, currentValue, currentIndex, array) => { ... }, initialValue)
    - accumulator: The value that accumulates the result of the function.
    - currentValue: The current element being processed.
    - currentIndex (optional): The index of the current element.
    - array (optional): The array `reduce()` was called upon.
    - initialValue: The initial value for the accumulator. Without this, the first element is used as the initial value.

Example in context:
*/

const totalGrades = student.grades.reduce((sum, grade) => sum + grade, 0);

/*
Explanation of the line:

1. `student.grades`:
   - This accesses the `grades` array of the current student object (e.g., `[85, 92, 78]` for Alice).
   - `reduce()` is called on this array to sum all the values (grades).

2. `.reduce((sum, grade) => sum + grade, 0)`:
   - The `reduce()` method loops over each `grade` in the `grades` array.
   - It adds each `grade` to `sum`, which is the **accumulated total**.
   - `sum` starts at `0`, which is the **initial value** (provided as the second argument to `reduce()`).

3. **Arrow Function** `(sum, grade) => sum + grade`:
   - This function takes two arguments:
     - `sum`: The running total (accumulator).
     - `grade`: The current grade being processed.
   - It returns `sum + grade`, adding the current grade to the running total.

4. **Initial Value `0`**:
   - The second argument to `reduce()` is `0`, which serves as the initial value for `sum`. Without it, `reduce()` would take the first element of the array as the initial value.

In this case, if `student.grades = [85, 92, 78]`, the `reduce()` method would work as follows:

Step-by-step:
- Initial value of `sum` is 0.
- First iteration: `sum = 0 + 85` → `sum = 85`
- Second iteration: `sum = 85 + 92` → `sum = 177`
- Third iteration: `sum = 177 + 78` → `sum = 255`

Final result: `totalGrades = 255`, which is the sum of all grades for that student.
*/
