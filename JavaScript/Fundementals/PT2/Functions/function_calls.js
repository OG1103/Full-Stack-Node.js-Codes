// Example of a JavaScript file demonstrating function calls

// Function declaration
function greet() {
  console.log("Hello, World!");
}

// Calling the function
greet(); // This will print "Hello, World!" to the console

// Function with parameters
const greetUser = (name) => {
  console.log("Hello, " + name + "!");
};

// Calling the function with an argument
greetUser("Alice"); // This will print "Hello, Alice!" to the console

// Function with multiple parameters
function addNumbers(a, b) {
  return a + b;
}

// Calling the function and storing the result
let sum = addNumbers(5, 3);
console.log("Sum: " + sum); // This will print "Sum: 8"

// Anonymous function stored in a variable
let multiply = function (a, b) {
  return a * b;
};

// Calling the anonymous function
let product = multiply(4, 7);
console.log("Product: " + product); // This will print "Product: 28"

// Arrow function (ES6+ syntax)
let divide = (a, b) => {
  return a / b;
};

// Calling the arrow function
let result = divide(10, 2);
console.log("Result: " + result); // This will print "Result: 5"

// Function with a default parameter
function greetWithDefault(name = "Guest") {
  console.log("Hello, " + name + "!");
}

// Calling the function without passing an argument (uses default)
greetWithDefault(); // This will print "Hello, Guest!" to the console

// Calling the function with an argument
greetWithDefault("Bob"); // This will print "Hello, Bob!" to the console

// Immediately Invoked Function Expression (IIFE)
(function () {
  console.log("This function runs immediately!");
})(); // This will run immediately and print "This function runs immediately!"

// Function that returns another function (Higher-Order Function)
function outerFunction() {
  return function innerFunction() {
    console.log("Inner function called!");
  };
}

// Calling the outer function and then calling the returned inner function
let innerFunc = outerFunction();
innerFunc(); // This will print "Inner function called!"

// Function with a callback (passing a function as an argument)
function doOperation(a, b, operation) {
  return operation(a, b);
}

// Defining a callback function
function subtract(a, b) {
  return a - b;
}

// Calling the function with a callback
let difference = doOperation(10, 5, subtract);
console.log("Difference: " + difference); // This will print "Difference: 5"

/*
it’s a common best practice to store the result of a function in a const when the function returns a value that won’t change, ensuring immutability and making your code more predictable. 
Using const for variables that won't be reassigned reduces the chance of accidental mutations and can help you catch potential bugs early in development.
 */
