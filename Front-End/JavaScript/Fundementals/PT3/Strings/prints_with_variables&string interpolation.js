/**
 * JAVASCRIPT NOTES: PRINT STATEMENTS, VARIABLES, AND STRING INTERPOLATION
 *
 * This file provides a comprehensive overview of:
 * - Printing statements in JavaScript using `console.log()`
 * - Different ways to concatenate strings and variables
 * - Using template literals for embedding variables and expressions
 * - Differences between concatenation methods
 * - Handling variables and expressions within strings
 */

/**
 * PRINTING OUTPUT TO THE CONSOLE
 * ---------------------------------
 * In JavaScript, the `console.log()` function is commonly used to print information to the console.
 * It is a debugging tool that helps developers understand what their code is doing.
 */

// Basic Usage of `console.log()` to Print a Message
console.log("Hello, World!"); // Output: Hello, World!

/**
 * VARIABLES AND PRINTING
 * ---------------------------------
 * Variables in JavaScript can hold different types of data such as strings, numbers, objects, etc.
 * You can print the value of variables using `console.log()`.
 */

const name = "Alice";
const age = 28;

// Printing variables directly
console.log(name); // Output: Alice
console.log(age); // Output: 28

// Printing variables with a message
console.log("Name:", name); // Output: Name: Alice
console.log("Age:", age); // Output: Age: 28

/**
 * STRING CONCATENATION
 * ---------------------------------
 * String concatenation means combining multiple strings or variables into one string.
 * This can be done using the `+` operator or with template literals.
 */

// Concatenation with the `+` Operator
const city = "New York";
const greeting = "Hello, my name is " + name + " and I live in " + city + ".";
console.log(greeting); // Output: Hello, my name is Alice and I live in New York.

// Explanation:
// - The `+` operator combines the strings and variables into a single string.
// - You need to manually add spaces and punctuation for correct formatting.

/**
 * TEMPLATE LITERALS
 * ---------------------------------
 * Template literals provide an alternative to string concatenation.
 * They are enclosed by backticks (`` ` ``) and can embed expressions inside `${}`.
 */

// Using Template Literals for String Interpolation
const message = `Hello, my name is ${name} and I am ${age} years old.`;
console.log(message); // Output: Hello, my name is Alice and I am 28 years old.

// Explanation:
// - Template literals use backticks (`` ` ``) to enclose the string.
// - `${}` is used to embed variables and expressions directly inside the string.
// - This method automatically handles spaces and formatting, making the code more readable.

// When wanting to write a string in a format where we have line under a line we use this format ex:
const str = `abc,def,ghi
jkl,mno,pqr
stu,vwx,yza`;
// this is equal to having a \n after each row as JavaScript's template literals (backticks `) preserve newlines and allow you to write multiline strings naturally.
//So, the above string is interpreted like this:
const str1 = "abc,def,ghi\njkl,mno,pqr\nstu,vwx,yza";

/**
 * USING EXPRESSIONS IN TEMPLATE LITERALS
 * ---------------------------------
 * Template literals can include any valid JavaScript expression inside `${}`.
 */

const a = 5;
const b = 10;
console.log(`The sum of ${a} and ${b} is ${a + b}.`); // Output: The sum of 5 and 10 is 15.

// Explanation:
// - The expression `${a + b}` calculates the sum of `a` and `b` directly inside the string.
// - The result of the expression is inserted into the string at runtime.

/**
 * COMPARING CONCATENATION METHODS
 * ---------------------------------
 * Both concatenation using the `+` operator and template literals can be used to combine strings and variables.
 * However, template literals are generally more readable and convenient, especially for complex strings.
 */

// Example using `+` Operator
const fruit = "apple";
const quantity = 5;
console.log("You have " + quantity + " " + fruit + "(s)."); // Output: You have 5 apple(s).

// Example using Template Literals
console.log(`You have ${quantity} ${fruit}(s).`); // Output: You have 5 apple(s).

// Key Differences:
// - The `+` operator requires careful management of spaces and concatenation, which can make the code less readable.
// - Template literals simplify the inclusion of variables and expressions, making the code cleaner and more readable.

/**
 * USING COMMAS IN `console.log()`
 * ---------------------------------
 * The comma (`,`) in `console.log()` allows you to print multiple arguments separated by a space.
 * This is different from concatenation, as it does not combine them into a single string.
 */

// Example with Comma in `console.log()`
const fruitPrices = {
  apple: 2,
  banana: 1,
  cherry: 3,
};

for (let fruit in fruitPrices) {
  console.log(fruit, fruitPrices[fruit]); // Output: apple 2, banana 1, cherry 3
}

// Explanation:
// - The comma separates multiple arguments in `console.log()`.
// - Each argument is printed with a space between them, not concatenated into a single string.
// - This is useful when printing different types of data (e.g., strings and numbers) together.

/**
 * PRINTING OBJECTS AND ARRAYS
 * ---------------------------------
 * `console.log()` can print entire objects and arrays in a readable format.
 */

const person = {
  name: "Bob",
  age: 35,
  occupation: "Engineer",
};

console.log(person); // Output: { name: 'Bob', age: 35, occupation: 'Engineer' }

// Explanation:
// - When printing objects, `console.log()` shows the structure and values in a readable format.

/**
 * SUMMARY
 * ---------------------------------
 * - `console.log()` is used to print messages, variables, and more to the console.
 * - Concatenation with the `+` operator requires manual string management, while template literals simplify string creation.
 * - Template literals (`${}`) are more readable and handle expressions directly inside strings.
 * - Using commas in `console.log()` prints multiple arguments with a space separator, maintaining their types.
 * - Understanding these methods helps in debugging and formatting output effectively in JavaScript.
 */
