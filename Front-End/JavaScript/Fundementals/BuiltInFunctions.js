/**
 * ==========================
 * Popular Built-in Functions in JavaScript
 * ==========================
 *
 * JavaScript provides a number of built-in functions to help with string manipulation,
 * working with arrays, numbers, objects, and more. This guide covers some of the
 * most commonly used functions, along with explanations and examples.
 */

/**
 * 1. String Functions
 * -------------------
 * JavaScript has several built-in functions for working with strings. Here are the most popular ones.
 */

// a) `String.prototype.length`
// Returns the length of a string.
const text = "Hello, World!";
console.log(text.length); // Output: 13

// b) `String.prototype.toUpperCase()`
// Converts a string to uppercase.
console.log(text.toUpperCase()); // Output: 'HELLO, WORLD!'

// c) `String.prototype.toLowerCase()`
// Converts a string to lowercase.
console.log(text.toLowerCase()); // Output: 'hello, world!'

// d) `String.prototype.trim()`
// Removes whitespace from both ends of a string.
const paddedText = "   Hello, World!   ";
console.log(paddedText.trim()); // Output: 'Hello, World!'

// e) `String.prototype.includes()`
// Checks if a string contains a specific substring.
console.log(text.includes("World")); // Output: true

// f) `String.prototype.replace()`
// Replaces occurrences of a substring with another substring.
console.log(text.replace("World", "JavaScript")); // Output: 'Hello, JavaScript!'

// g) `String.prototype.substring()`
// Extracts a part of a string between two specified indices.
console.log(text.substring(0, 5)); // Output: 'Hello'

/**
 * 2. Array Functions
 * ------------------
 * Arrays in JavaScript come with a set of powerful built-in functions that allow for easy manipulation.
 */

// a) `Array.prototype.push()`
// Adds one or more elements to the end of an array.
const fruits = ["apple", "banana"];
fruits.push("orange");
console.log(fruits); // Output: ['apple', 'banana', 'orange']

// b) `Array.prototype.pop()`
// Removes the last element from an array.
fruits.pop();
console.log(fruits); // Output: ['apple', 'banana']

// c) `Array.prototype.shift()`
// Removes the first element from an array.
fruits.shift();
console.log(fruits); // Output: ['banana']

// d) `Array.prototype.unshift()`
// Adds one or more elements to the beginning of an array.
fruits.unshift("apple");
console.log(fruits); // Output: ['apple', 'banana']

// e) `Array.prototype.forEach()`
// Executes a function once for each array element.
const numbers = [1, 2, 3, 4, 5];
numbers.forEach((num) => console.log(num * 2)); // Output: 2, 4, 6, 8, 10

// f) `Array.prototype.map()`
// Creates a new array with the results of calling a function for every array element.
const doubledNumbers = numbers.map((num) => num * 2);
console.log(doubledNumbers); // Output: [2, 4, 6, 8, 10]

// g) `Array.prototype.filter()`
// Creates a new array with all elements that pass the test implemented by the provided function.
const evenNumbers = numbers.filter((num) => num % 2 === 0);
console.log(evenNumbers); // Output: [2, 4]

// h) `Array.prototype.reduce()`
// Reduces the array to a single value by applying a function to each element.
const sum = numbers.reduce((total, num) => total + num, 0);
console.log(sum); // Output: 15

// i) `Array.prototype.find()`
// Returns the first element that passes the test function.
const found = numbers.find((num) => num > 3);
console.log(found); // Output: 4

// j) `Array.prototype.includes()`
// Checks if an array contains a specific element.
console.log(numbers.includes(3)); // Output: true

/**
 * 3. Number Functions
 * -------------------
 * JavaScript offers several methods for working with numbers.
 */

// a) `Number.isNaN()`
// Determines whether the passed value is NaN (Not-A-Number).
console.log(Number.isNaN(123)); // Output: false
console.log(Number.isNaN(NaN)); // Output: true

// b) `Math.max()`
// Returns the largest of the given numbers.
console.log(Math.max(1, 3, 7, 2)); // Output: 7

// c) `Math.min()`
// Returns the smallest of the given numbers.
console.log(Math.min(1, 3, 7, 2)); // Output: 1

// d) `Math.random()`
// Returns a random number between 0 (inclusive) and 1 (exclusive).
console.log(Math.random()); // Output: A random number, e.g., 0.23123

// e) `Math.floor()`
// Rounds a number down to the nearest integer.
console.log(Math.floor(4.7)); // Output: 4

// f) `Math.ceil()`
// Rounds a number up to the nearest integer.
console.log(Math.ceil(4.1)); // Output: 5

// g) `Math.round()`
// Rounds a number to the nearest integer.
console.log(Math.round(4.5)); // Output: 5

/**
 * 4. Object Functions
 * -------------------
 * JavaScript objects have several built-in functions that make working with properties and values easier.
 */

// a) `Object.keys()`
// Returns an array of a given object's property names (keys).
const person = { name: "John", age: 30 };
console.log(Object.keys(person)); // Output: ['name', 'age']

// b) `Object.values()`
// Returns an array of a given object's own property values.
console.log(Object.values(person)); // Output: ['John', 30]

// c) `Object.entries()`
// Returns an array of a given object's own enumerable string-keyed property [key, value] pairs.
console.log(Object.entries(person)); // Output: [['name', 'John'], ['age', 30]]

// d) `Object.assign()`
// Copies all enumerable own properties from one or more source objects to a target object.
const target = { name: "John" };
const source = { age: 30 };
const result = Object.assign(target, source);
console.log(result); // Output: { name: 'John', age: 30 }

/**
 * 5. JSON Functions
 * -----------------
 * JavaScript Object Notation (JSON) functions allow you to convert between strings and JavaScript objects.
 */

// a) `JSON.stringify()`
// Converts a JavaScript object into a JSON string.
const jsonString = JSON.stringify(person);
console.log(jsonString); // Output: '{"name":"John","age":30}'

// b) `JSON.parse()`
// Parses a JSON string and returns the corresponding JavaScript object.
const jsonObject = JSON.parse('{"name":"John","age":30}');
console.log(jsonObject); // Output: { name: 'John', age: 30 }

/**
 * 6. Date Functions
 * -----------------
 * JavaScript provides the `Date` object to work with dates and times.
 */

// a) `new Date()`
// Creates a new Date object representing the current date and time.
const now = new Date();
console.log(now); // Output: current date and time

// b) `Date.getFullYear()`
// Gets the full year (4 digits) of a Date object.
console.log(now.getFullYear()); // Output: e.g., 2024

// c) `Date.getMonth()`
// Gets the month (0-11) of a Date object. 0 = January, 11 = December.
console.log(now.getMonth()); // Output: e.g., 8 for September

// d) `Date.getDate()`
// Gets the day of the month (1-31) of a Date object.
console.log(now.getDate()); // Output: e.g., 17

// e) `Date.getHours()`
// Gets the hour (0-23) of a Date object.
console.log(now.getHours()); // Output: e.g., 14

// f) `Date.getMinutes()`
// Gets the minutes (0-59) of a Date object.
console.log(now.getMinutes()); // Output: e.g., 45

// g) `Date.now()`
// Returns the number of milliseconds since January 1, 1970.
console.log(Date.now()); // Output: milliseconds since epoch time

/**
 * 7. Control Flow and Timing Functions
 * ------------------------------------
 * JavaScript provides functions to control the flow of the code and manage timing.
 */

// a) `setTimeout()`
// Executes a function after a specified delay (in milliseconds).
setTimeout(() => {
  console.log("Executed after 2 seconds");
}, 2000); // Output: Executed after 2 seconds (after 2000ms delay)

// b) `setInterval()`
// Repeatedly executes a function with a fixed time delay between each call.
const intervalId = setInterval(() => {
  console.log("Repeated every 1 second");
}, 1000);

// c) `clearInterval()`
// Stops the execution of the function set by `setInterval()`.
setTimeout(() => {
  clearInterval(intervalId); // Stops the repeated messages
}, 5000); // Stops after 5 seconds

/**
 * 8. Error Handling Functions
 * ---------------------------
 * JavaScript has built-in functions for handling and throwing errors.
 */

// a) `try...catch`
// Used to handle exceptions (errors) in your code.
try {
  throw new Error("This is an error");
} catch (error) {
  console.log(error.message); // Output: 'This is an error'
}

/**
 * Conclusion:
 * ----------
 * These are some of the most commonly used built-in functions in JavaScript that make
 * working with data, arrays, strings, objects, and other types easier. Understanding how to
 * use them effectively will help you write cleaner and more efficient code.
 */
