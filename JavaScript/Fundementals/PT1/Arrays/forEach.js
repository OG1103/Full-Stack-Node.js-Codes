//------------------------
// JavaScript Array forEach() Method
//------------------------

/*
The `forEach()` method in JavaScript executes a provided function once for each element in an array.

Key Points:
- `forEach()` is a method used to iterate over the elements of an array.
- It calls a provided callback function for each element in the array in the order they appear.
- Unlike `map()`, `forEach()` does not create a new array—it simply performs operations on the elements of the array.
- `forEach()` does not return a value (its return value is always `undefined`).

Syntax:
  array.forEach(function(currentValue, index, array), thisArg);

Parameters:
  - `currentValue` (required): The current element being processed in the array.
  - `index` (optional): The index of the current element.
  - `array` (optional): The array that `forEach()` is being called on.
  - `thisArg` (optional): Value to use as `this` when executing the callback function.
*/

//------------------------
// Basic Example
//------------------------

const numbers = [1, 2, 3, 4, 5];

// Example 1: Printing each number in the array using forEach
numbers.forEach(function (number) {
  console.log(number); // Output: 1, 2, 3, 4, 5 (each on a new line)
});

/*
Explanation:
- `forEach()` iterates through each element in the `numbers` array.
- The callback function logs each element (number) to the console.
- `forEach()` does not return a new array, it just iterates over the original array.
*/

//------------------------
// Example with Arrow Function
//------------------------

/*
You can use arrow functions with `forEach()` for more concise syntax.
*/

numbers.forEach((number) => console.log(number));
// Output: 1, 2, 3, 4, 5

//------------------------
// Accessing the Index in forEach()
//------------------------

/*
You can also access the index of each element during iteration by adding a second argument to the callback function.
*/

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

//------------------------
// Example: Modifying Array Elements with forEach()
//------------------------

/*
`forEach()` is often used to perform operations on the elements of an array, such as updating object properties.
*/

const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 },
];

// Increase the age of each person by 1 using forEach
people.forEach((person) => {
  person.age += 1; // Modifies the original object
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

/*
Explanation:
- The `forEach()` method iterates over each object in the `people` array.
- The callback function increments the `age` property of each `person` by 1.
- Since objects are passed by reference, the original array is modified.
*/

//------------------------
// Using thisArg in forEach()
//------------------------

/*
The `thisArg` parameter can be used to specify the value of `this` inside the callback function.
If `thisArg` is provided, it will be used as the value of `this` in the callback function.
*/

const multiplier = {
  factor: 2,
  multiply(number) {
    console.log(number * this.factor);
  },
};

numbers.forEach(function (number) {
  this.multiply(number); // Multiplies each number by `this.factor`
}, multiplier); // `thisArg` is set to the `multiplier` object, so The this keyword refrence the multiper Object as its the second parameter.

// Using an arrow function with `forEach` and manually binding `this`
numbers.forEach((number) => {
  multiplier.multiply(number); // `this` is ignored, so we explicitly call `multiplier.multiply()`
});
/*
Output:
2
4
6
8
10
*/

//------------------------
// forEach() vs. for Loop
//------------------------

/*
The `forEach()` method is often compared with traditional `for` loops.

Advantages of `forEach()`:
- Cleaner and more readable for performing actions on array elements.
- Eliminates the need for managing loop counters like in `for` loops.

Disadvantages:
- Cannot break out of a `forEach()` loop early. It will always iterate over every element.
- Does not return a value. If you need to return a new array or data structure, consider using `map()`, `filter()`, or other methods.

Example of a `for` loop:
*/

for (let i = 0; i < numbers.length; i++) {
  console.log(numbers[i]);
}
// Output: 1, 2, 3, 4, 5

/*
The same can be achieved with `forEach()` in fewer lines of code and with clearer intent:
*/

numbers.forEach((number) => console.log(number));
// Output: 1, 2, 3, 4, 5

//------------------------
// Conclusion
//------------------------

/*
`forEach()` is a powerful and simple method for iterating over arrays in JavaScript. 
It is best used when you want to perform an operation on each element of an array without needing to return a new array or break out of the loop early.
Remember:
- It doesn’t return any value.
- It iterates over the entire array.
- It is especially useful for performing side effects, such as updating objects or logging values.
*/
