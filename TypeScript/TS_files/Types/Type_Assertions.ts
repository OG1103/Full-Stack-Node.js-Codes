// TypeScript Type Assertions Examples

// Type assertions in TypeScript allow you to tell the compiler that you know more about the type of a value than TypeScript can infer on its own.
// You can use type assertions when you are sure about the type of a value, but TypeScript cannot determine it accurately.

// 1. Basic Syntax of Type Assertion (using 'as' keyword)

// Example: A variable that can be of type 'unknown', but you know it is a string
let someValue: unknown = "Hello, TypeScript!";

// Using type assertion to tell TypeScript the variable is a string
let stringLength: number = (someValue as string).length;
console.log(stringLength); // Output: 17

// 2. Another syntax for Type Assertion (using angle-bracket notation)
// This works similarly to 'as' but isn't allowed in .tsx files (used with React)

// Example: Variable that can be of type 'any', but you know it is a number
let anotherValue: any = 100;

// Using type assertion to treat the variable as a number
let fixedValue: number = <number>anotherValue;
console.log(fixedValue.toFixed(2)); // Output: 100.00

// 3. Type Assertions with DOM Elements

// Example: Working with a DOM element where you know more about the element than TypeScript

let myCanvas = document.getElementById("canvas") as HTMLCanvasElement;
if (myCanvas) {
  let ctx = myCanvas.getContext("2d"); // Now TypeScript knows it's working with a canvas
}

let myimg = document.getElementById("img-id") as HTMLImageElement; // Asserting that this element of type HTMLImageElement
console.log(myimg.src);// now knows that this is a html image element, if i didn't assert the type it wouldn't know what myimg is. 

// 4. Type Assertions to Narrow Down Union Types

// Example: A union type variable where you want to treat it as a specific type

let value: string | number = "Hello";

// Type assertion to treat 'value' as a string
let strLength: number = (value as string).length;
console.log(strLength); // Output: 5

// If you know 'value' is a number at runtime, you can assert it as a number too
value = 42;
let numValue: number = value as number;
console.log(numValue); // Output: 42

// 5. Type Assertions Are Not Type Casting
// Note: Type assertions do not change the type at runtime; they are purely for TypeScript's type system at compile time.
// Example: Asserting a value from one type to another incompatible type without actual conversion
let numOrStr: any = "123";
// Here we assert that 'numOrStr' is a number (even though it's actually a string)
// TypeScript trusts us, but at runtime this won't actually convert the type
let numberValue = numOrStr as number;
console.log(numberValue); // Still a string, TypeScript won't enforce runtime conversion
