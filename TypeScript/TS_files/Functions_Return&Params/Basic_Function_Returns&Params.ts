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
