/**
 * JAVASCRIPT NOTES: FUNCTIONS
 *
 * This file provides a comprehensive overview of functions in JavaScript, including:
 * - What functions are and why they are used
 * - Different ways to declare and define functions
 * - Parameters, arguments, and return values
 * - Arrow functions and their differences from traditional functions
 * - Higher-order functions and function expressions
 * - Closures and their uses
 * - IIFE (Immediately Invoked Function Expressions)
 * - Function scope, hoisting, and best practices
 */

/**
 * WHAT ARE FUNCTIONS?
 * ---------------------------------
 * A function is a reusable block of code designed to perform a specific task.
 * Functions allow you to write modular, reusable, and maintainable code.
 */

// Basic Function Declaration
function greet() {
  console.log("Hello, World!");
}

// Calling the function
greet(); // Output: Hello, World!

// Explanation:
// - The `function` keyword is used to declare a function named `greet`.
// - The function is called using its name followed by parentheses `()`.

/**
 * FUNCTION PARAMETERS AND ARGUMENTS
 * ---------------------------------
 * Functions can accept parameters (inputs) and return a value (output).
 * Parameters are specified in the function definition, and arguments are the actual values passed to the function.
 */

// Function with Parameters
function add(a, b) {
  return a + b;
}

// Calling the function with arguments
const sum = add(5, 3);
console.log(sum); // Output: 8

// Explanation:
// - `a` and `b` are parameters that the function `add` accepts.
// - The function returns the sum of `a` and `b` using the `return` keyword.

/**
 * FUNCTION EXPRESSIONS
 * ---------------------------------
 * Function expressions are functions defined as part of a larger expression, like a variable assignment.
 */

const multiply = function (x, y) {
  return x * y;
};

// Calling the function expression
const product = multiply(4, 5);
console.log(product); // Output: 20

// Explanation:
// - `multiply` is a variable that stores an anonymous function (a function without a name).
// - Function expressions are not hoisted, meaning they cannot be called before they are defined.

/**
 * ARROW FUNCTIONS
 * ---------------------------------
 * Arrow functions provide a more concise syntax for writing function expressions.
 * They are particularly useful for inline functions and are often used in higher-order functions.
 * Syntax : (parameters)=>{code}
 * WE STORE OUR ARROW FUNCTION IN A CONST (CONST X = (PARMS)=>{CODE}) UNLESS IT IS A NESTED FUNCTION/CALLBACK FUNCTION THEN JUST (parameters)=>{code}
 */

const subtract = (a, b) => {
  return a - b;
};

console.log(subtract(10, 4)); // Output: 6

// Shorter syntax for a single-line arrow function
const square = (x) => x * x;
console.log(square(5)); // Output: 25

// Explanation:
// - Arrow functions use the `=>` syntax to define functions.
// - If there is only one parameter, parentheses `()` around the parameter can be omitted.
// - If the function body has only one expression, the curly braces `{}` and `return` keyword can be omitted.

/**
 * DIFFERENCES BETWEEN REGULAR FUNCTIONS AND ARROW FUNCTIONS
 * ---------------------------------
 * - **`this` Keyword**: Arrow functions do not have their own `this` context; they inherit `this` from the parent scope.
 * - **Syntax**: Arrow functions provide a shorter syntax.
 * - **No `arguments` Object**: Arrow functions do not have an `arguments` object.
 */

// Example of `this` in Regular vs. Arrow Functions
const person = {
  name: "John",
  regularFunction: function () {
    console.log(`Hello, my name is ${this.name}.`); // `this` refers to `person`
  },
  arrowFunction: () => {
    console.log(`Hello, my name is ${this.name}.`); // `this` does not refer to `person`
  },
};

person.regularFunction(); // Output: Hello, my name is John.
person.arrowFunction(); // Output: Hello, my name is undefined.

// Explanation:
// - In `regularFunction`, `this` refers to the `person` object.
// - In `arrowFunction`, `this` refers to the global object (or `undefined` in strict mode), not `person`.

/**
 * HIGHER-ORDER FUNCTIONS
 * ---------------------------------
 * Higher-order functions are functions that accept other functions as arguments or return functions as their result.
 * They are a powerful feature in JavaScript and are used extensively in functional programming.
 */

const numbers = [1, 2, 3, 4, 5];

// Using a higher-order function (map) to square each number
const squares = numbers.map((num) => num * num);
console.log(squares); // Output: [1, 4, 9, 16, 25]

const fruits = ["apple", "banana", "cherry"];
const upperCaseFruits = fruits.map((fruit) => fruit.toUpperCase());
console.log(upperCaseFruits); // Output: ["APPLE", "BANANA", "CHERRY"]

// Example with more parameters
const doubles = numbers.map((num, index) => {
  //call back function to be applied to each element of the array
  console.log(`Doubling element at index ${index}: ${num}`);
  return num * 2;
});
//num: The current element being processed in the array.
//index: The index of the current element being processed.
console.log(doubles); // Output: [2, 4, 6, 8, 10]

// Explanation:
// - The `map` function is a higher-order function that takes a callback function (`num => num * num`) as its argument.
// - It applies the callback to each element of the array `numbers` and returns a new array with the results.

/**
 * CLOSURES
 * ---------------------------------
 * A closure is a function that has access to its own scope, the scope of the outer function, and the global scope.
 * Closures allow a function to access variables from an enclosing scope, even after the outer function has finished executing.
 */

function outerFunction(outerVariable) {
  return function innerFunction(innerVariable) {
    console.log(`Outer variable: ${outerVariable}`);
    console.log(`Inner variable: ${innerVariable}`);
  };
}

const closureExample = outerFunction("outside");
closureExample("inside");

// Output:
// Outer variable: outside
// Inner variable: inside

// Explanation:
// - `innerFunction` is a closure that captures `outerVariable` from `outerFunction`.
// - Even after `outerFunction` has completed execution, `innerFunction` retains access to `outerVariable`.

/**
 * IMMEDIATELY INVOKED FUNCTION EXPRESSIONS (IIFE)
 * ---------------------------------
 * An IIFE is a function that is defined and executed immediately after it is created.
 * IIFEs are commonly used to create a new scope and avoid polluting the global scope.
 */

(function () {
  console.log("This is an IIFE.");
})();

// Output: This is an IIFE.

// Explanation:
// - The function is defined inside parentheses `()` to treat it as an expression.
// - It is immediately invoked by the following `()`.
// - Is immediately executed once the JavaScript interpreter encounters it.

/**
 * FUNCTION SCOPE AND HOISTING
 * ---------------------------------
 * - **Scope**: Functions create their own scope. Variables declared inside a function are not accessible outside of it.
 * - **Hoisting**: Function declarations are hoisted to the top of their scope, meaning they can be called before they are defined.
 */

// Example of function scope
function scopeExample() {
  var localVariable = "I'm local!";
  console.log(localVariable); // Output: I'm local!
}

// console.log(localVariable); // Error: localVariable is not defined

// Example of hoisting
hoistedFunction(); // Output: This function is hoisted!

function hoistedFunction() {
  console.log("This function is hoisted!");
}

/**
 * FUNCTION BEST PRACTICES
 * ---------------------------------
 * - Use descriptive names for functions to make your code more readable.
 * - Keep functions small and focused on a single task (Single Responsibility Principle).
 * - Use default parameters to handle undefined arguments gracefully.
 * - Avoid using too many parameters; consider using an object to group related parameters.
 */

// Example of default parameters
function greetUser(name = "Guest") {
  console.log(`Hello, ${name}!`);
}

greetUser(); // Output: Hello, Guest!
greetUser("Michael"); // Output: Hello, Michael!

// Example of using an object to group parameters
function createUser({ name, age, occupation }) {
  return {
    name: name,
    age: age,
    occupation: occupation,
  };
}

const user = createUser({ name: "Jane", age: 27, occupation: "Designer" });
console.log(user); // Output: { name: 'Jane', age: 27, occupation: 'Designer' }

/**
 * SUMMARY
 * ---------------------------------
 * - Functions are reusable blocks of code that perform specific tasks.
 * - Functions can be declared in multiple ways: function declarations, function expressions, and arrow functions.
 * - Arrow functions provide a concise syntax but have different behavior with `this` and do not have their own `arguments` object.
 * - Higher-order functions and closures are powerful features in JavaScript that enable functional programming patterns.
 * - IIFEs are useful for creating isolated scopes and avoiding global scope pollution.
 * - Understanding function scope and hoisting is key to writing predictable JavaScript code.
 * - Following best practices for functions improves code readability, maintainability, and reusability.
 */

/**
 * THE `return` KEYWORD
 * ---------------------------------
 * The `return` keyword is used in a function to:
 * - Stop the execution of the function
 * - Specify the value to be returned to the function caller
 *
 * When a `return` statement is executed, the function exits immediately, and the specified value is returned to the function caller.
 * If no `return` statement is provided, the function returns `undefined` by default.
 */

// Example demonstrating the use of `return`
function calculateRectangleArea(length, width) {
  // Calculate the area and store it in a variable
  const area = length * width;
  // Return the variable
  return area;
}
// Calling the function and storing the result in a variable
const rectangleArea = calculateRectangleArea(5, 3);
console.log(rectangleArea); // Output: 15

// Explanation:
// - The `return` keyword is used to return the result of area(length*width).
// - When the function `calculateRectangleArea` is called with arguments `5` and `3`, it returns `15`.

/**
 * IMPORTANCE OF THE `return` KEYWORD
 * ---------------------------------
 * - **Returns a Value**: `return` allows a function to send a value back to the part of the program that called it.
 * - **Ends Function Execution**: When a `return` statement is encountered, the function stops executing.
 * - **Can be Used Conditionally**: You can use `return` inside conditional statements to return different values based on conditions.
 */

function checkAge(age) {
  if (age >= 18) {
    return "You are an adult.";
  } else {
    return "You are a minor.";
  }
}

console.log(checkAge(20)); // Output: You are an adult.
console.log(checkAge(15)); // Output: You are a minor.

// Explanation:
// - The function `checkAge` uses `return` to output different messages based on the input `age`.
// - If `age` is 18 or more, it returns "You are an adult."; otherwise, it returns "You are a minor."

/**
 * NO RETURN STATEMENT
 * ---------------------------------
 * If a function does not explicitly return a value using the `return` keyword, it implicitly returns `undefined`.
 */

function ReturnExitExample() {
  const message = "This function does not return anything.";
  if (true) {
    return; // exit function
  }
  //rest of code
}

function noReturnExample() {
  const message = "This function does not return anything.";
}
console.log(noReturnExample()); // Output: undefined

// Explanation:
// - The function `noReturnExample` does not have a `return` statement.
// - Therefore, when the function is called, it returns `undefined` by default.

/**
 * SUMMARY
 * ---------------------------------
 * - Functions are essential building blocks in JavaScript, designed to perform specific tasks.
 * - The `return` keyword is used to stop the execution of a function and return a value to the caller.
 * - Using `return` allows functions to be more versatile and reusable, enabling them to perform calculations, make decisions, and return results.
 * - If no `return` statement is used, the function returns `undefined` by default.
 */
