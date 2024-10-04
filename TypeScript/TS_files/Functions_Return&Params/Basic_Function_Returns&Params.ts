// 1. Normal Function Syntax with Parameter Types and Return Type
//If i don't pass by parameters then just (), no need to declare anything

// function functionName(param1: dataType, param2: dataType): returnType {
//     // Function body
//     return valueOfReturnType;
//   }

// Function that takes two numbers as parameters and returns a number
function addNumbers(a: number, b: number): number {
  return a + b;
}

// Function with no return value (void) and a string parameter
function printMessage(message: string): void {
  console.log(message);
}

//---------------------------------------------------------------------------------

// 2. Arrow Function Syntax with Parameter Types and Return Type
//If i don't pass by parameters then just (), no need to declare anything

//   const functionName = (param1: dataType, param2: dataType): returnType => {
//     // Function body
//     return valueOfReturnType;
//   };

// Arrow function that takes two numbers and returns a number
const multiplyNumbers = (a: number, b: number): number => {
  return a * b;
};

// Arrow function with no return value (void) and a string parameter
const printMessageArrow = (message: string): void => {
  console.log(message);
};

//--------------------------------------------------------------------------------------

// Function with optional parameters (? notation)
// The 'lastName' parameter is optional. If it is not provided, it will be 'undefined' by default.
//Optional parameters can have required parameters afdter it, therefore declared at the end when passing my parameters
function greetings(firstName: string, lastName?: string): string {
  // Check if 'lastName' is provided
  if (lastName) {
    return `Hello, ${firstName} ${lastName}!`; // If lastName is provided, use both names
  } else {
    return `Hello, ${firstName}!`; // If lastName is not provided, only use firstName
  }
}

// Calling the function with both parameters
let fullNameGreeting = greetings("John", "Doe");
console.log(fullNameGreeting); // Output: "Hello, John Doe!"

// Calling the function with only the first parameter
let firstNameGreeting = greetings("Alice");
console.log(firstNameGreeting); // Output: "Hello, Alice!"
