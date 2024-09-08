/**
 * LOOPING IN JAVASCRIPT: 'for...in' and 'for...of'
 *
 * JavaScript provides several ways to iterate through data structures.
 * Two commonly used loops are 'for...in' and 'for...of'.
 *
 * - 'for...in': Used for iterating over the properties/attributes (keys) of an object.
 * - 'for...of': Used for iterating over the values of an iterable object (like an array, string, etc.).
 */

/**
 * 4. 'for...in' Loop
 * -------------------------------
 * The 'for...in' loop is used to iterate over the **enumerable properties** (keys) of an object.
 * It is useful when you want to access both the property names (keys) and their values.
 *
 * Syntax:
 * for (key in object) {
 *     // Code to execute for each key
 * }
 */

console.log("\nFor...In Loop Example:");

const person = {
  name: "John",
  age: 30,
  occupation: "Developer",
};

// Using 'for...in' to iterate over the properties of the 'person' object
for (let key in person) {
  console.log(`${key}: ${person[key]}`);
}

// Explanation:
// - 'person' is an object with three properties: 'name', 'age', and 'occupation'.
// - The 'for...in' loop iterates over each property name (key) in the 'person' object.
// - 'key' represents the current property name during each iteration (e.g., 'name', 'age', 'occupation').
// - 'person[key]' is used to access the value associated with the current key.
// - The loop prints each property name and its corresponding value.

// Output:
// name: John
// age: 30
// occupation: Developer

//object of objects
const peoples = {
  person1: { name: "John", age: 30, occupation: "Developer" },
  person2: { name: "Jane", age: 25, occupation: "Designer" },
  person3: { name: "Mike", age: 35, occupation: "Manager" },
};

// Using 'for...in' to iterate over the keys of the 'people' object
for (let key in people) {
  console.log(`${key}:`, peoples[key]);
}

// Explanation:
// - 'people' is an object where each key ('person1', 'person2', 'person3') represents a nested object.
// - The 'for...in' loop iterates over the keys of the 'people' object.
// - 'key' represents the current key during each iteration (e.g., 'person1', 'person2', 'person3').
// - 'people[key]' accesses the nested object associated with the current key.
// - The loop prints each key and its corresponding nested object.

// Output:
// person1: { name: "John", age: 30, occupation: "Developer" }
// person2: { name: "Jane", age: 25, occupation: "Designer" }
// person3: { name: "Mike", age: 35, occupation: "Manager" }

/**
 * 5. 'for...of' Loop
 * -------------------------------
 * The 'for...of' loop is used to iterate over the **values** of an iterable object.
 * Iterable objects include arrays, strings, maps, sets, etc.
 * It is especially useful when you want to work directly with the values rather than the keys.
 *
 * Syntax:
 * for (variable of iterable) {
 *     // Code to execute for each value
 * }
 */

console.log("\nFor...Of Loop Example:");

const numbers = [1, 2, 3, 4, 5];

// Using 'for...of' to iterate over the values of the 'numbers' array
for (let number of numbers) {
  console.log(`Number: ${number}`);
}

// Explanation:
// - 'numbers' is an array containing five elements: [1, 2, 3, 4, 5].
// - The 'for...of' loop iterates over each value in the 'numbers' array.
// - 'number' represents the current value in the array during each iteration (e.g., 1, 2, 3, 4, 5).
// - The loop prints each value in the array.

// Output:
// Number: 1
// Number: 2
// Number: 3
// Number: 4
// Number: 5

// Example with a String

console.log("\nFor...Of Loop Example with a String:");

const text = "Hello";

// Using 'for...of' to iterate over each character in a string
for (let char of text) {
  console.log(`Character: ${char}`);
}

// Explanation:
// - 'text' is a string with the value "Hello".
// - The 'for...of' loop iterates over each character in the string 'text'.
// - 'char' represents the current character during each iteration (e.g., 'H', 'e', 'l', 'l', 'o').
// - The loop prints each character in the string.

// Output:
// Character: H
// Character: e
// Character: l
// Character: l
// Character: o

const people = [
  { name: "John", age: 30, occupation: "Developer" },
  { name: "Jane", age: 25, occupation: "Designer" },
  { name: "Mike", age: 35, occupation: "Manager" },
];

// Using 'for...of' to iterate over each object in the array
for (let person of people) {
  console.log(person);
}

// Explanation:
// - 'people' is an array containing three objects, each representing a person with properties like 'name', 'age', and 'occupation'.
// - The 'for...of' loop iterates over each element in the 'people' array. Since each element is an object, 'person' will be assigned to each object in turn.
// - The loop prints each object to the console.

// Output:
// { name: "John", age: 30, occupation: "Developer" }
// { name: "Jane", age: 25, occupation: "Designer" }
// { name: "Mike", age: 35, occupation: "Manager" }

/**
 * Summary:
 * - Use 'for...in' when you need to iterate over the properties (keys) of an object.
 * - Use 'for...of' when you need to iterate over the values of an iterable object like an array or string.
 */
