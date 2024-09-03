//CONSOLE LOG: Print statements in javascript
//SYNTAX: console.log(---);
// Go to inspect & console to see the print statement
console.log("omar");
var x = 2 + "2"; // will concatinate so will output 22 and the typeof the output will be string. Javascript values strings so its defualt will see it as string and concatinate.
console.log(x);
//TYPEOF KEYWORD:
console.log(typeof "test"); //this statement will print the type of the thing followed by the typeof keyword

console.log(5 * false);
//false is translate to 0 and true is translated to 1

//--------------------------------------------------------------------------
// //VARIABLES:
// //TO DECLARE VARIABLES WE USE: var, let, const

// // 1. var
// // - Function-scoped: Accessible anywhere within the function.
// // - Hoisted: The declaration is moved to the top of its scope, but not the initialization.
// // - Can be re-declared and re-assigned within the same scope.

// var x = 3;
// console.log(x);

// // 2. let
// // - Block-scoped: Accessible only within the block it is defined in (e.g., within { }).
// // - Hoisted but not initialized: You can't use it before declaration.
// // - Cannot be re-declared in the same scope, but can be reassigned.

// let a = 5; // Declared using let
// console.log(a); // Output: 5

// // 3. const
// // - Block-scoped: Like let, only accessible within the block it is defined in.
// // - Hoisted but not initialized: You can't use it before declaration.
// // - Cannot be re-declared or reassigned in the same scope. Must be initialized at the time of declaration.
// // - If the const is an object or array, the contents can be modified, but the variable cannot be reassigned.

// const pi = 3.14; // Declared using const
// console.log(pi); // Output: 3.14

// //What Does Hoisting Mean?

// //For variables declared using var, JavaScript hoists the declaration to the top of its scope but not the initialization.
// //This means that the variable is treated as if it was declared at the top of its scope, but its value remains undefined until the assignment line is executed.
// console.log(y); // Output: undefined (x is hoisted, but not initialized)
// var y = 5; // Declaration is hoisted, initialization is not
// console.log(y); // Output: 5

// //Variables declared with let and const are also hoisted, but they are not initialized. Accessing them before their declaration will result in a ReferenceError
// console.log(y); // Error: Cannot access 'y' before initialization
// let y = 10;

// console.log(z); // Error: Cannot access 'z' before initialization
// const z = 20;

// //Function declarations are fully hoisted, which means both the function definition and body are moved to the top of their scope.
// //This allows you to call a function before it is defined in the code.
// sayHello(); // Output: "Hello, world!" (function is fully hoisted)

// function sayHello() {
//   console.log("Hello, world!");
// }

//--------------------------------------------------------------------------------------
// JavaScript Scopes Explained

/*
Global Scope:
--------------
- Variables declared outside any function or block (using `let`, `const`, or `var`) exist in the global scope.
- A global variable is accessible from anywhere in the code.
- In the browser environment:
  - `var` declared at the top level attaches the variable to the `window` object.
  - `let` and `const` do not attach the variable to the `window` object.

Example:
*/

var globalVar = "I am a global variable"; // Accessible globally, also attached to `window`
let globalLet = "I am also global"; // Accessible globally, not attached to `window`
const globalConst = "I am a constant globally"; // Accessible globally, not attached to `window`

console.log(window.globalVar); // Output: "I am a global variable"
console.log(window.globalLet); // Output: undefined
console.log(window.globalConst); // Output: undefined

/*
Script Scope (Browser-Specific):
---------------------------------
- When running JavaScript in a browser, code that's not inside any function runs in the global context.
- However, variables declared with `let` or `const` at the top level are in the script scope.
- `let` and `const` variables are not attached to the `window` object.

Example:
*/

let scriptLet = "I am in script scope"; // Not attached to `window`
const scriptConst = "I am also in script scope"; // Not attached to `window`

console.log(scriptLet); // Output: "I am in script scope"
console.log(scriptConst); // Output: "I am also in script scope"
console.log(window.scriptLet); // Output: undefined
console.log(window.scriptConst); // Output: undefined

/*
Block Scope:
------------
- `let` and `const` are block-scoped, which means they are only accessible within the block (enclosed by `{}`) in which they are defined.
- Blocks are created by constructs like loops, `if` statements, and functions.
- Variables declared with `var` are NOT block-scoped and will leak out of the block into the function scope or global scope.

Example:
*/

if (true) {
  let blockLet = "I am block scoped!";
  const blockConst = "I am also block scoped!";
  var blockVar = "I am not block scoped!";
  console.log(blockLet); // Output: "I am block scoped!"
  console.log(blockConst); // Output: "I am also block scoped!"
}

console.log(blockVar); // Output: "I am not block scoped!"
// console.log(blockLet); // Error: blockLet is not defined
// console.log(blockConst); // Error: blockConst is not defined

/*
Function Scope:
---------------
- A variable declared inside a function is function-scoped, meaning it is only accessible within that function.
- `var` declarations are function-scoped. Variables declared with `var` inside a function are confined to that function.
- `let` and `const` are also function-scoped when declared within a function, but they also obey block scoping rules within the function.

Example:
*/

function myFunction() {
  var functionVar = "I am function scoped!";
  let functionLet = "I am also function scoped!";
  const functionConst = "I am a constant in function scope!";
  console.log(functionVar); // Output: "I am function scoped!"
  console.log(functionLet); // Output: "I am also function scoped!"
  console.log(functionConst); // Output: "I am a constant in function scope!";
}

myFunction();
// console.log(functionVar); // Error: functionVar is not defined
// console.log(functionLet); // Error: functionLet is not defined
// console.log(functionConst); // Error: functionConst is not defined

/*
Summary:
--------
- Global Scope: Accessible throughout the entire code.
- Script Scope: Browser-specific, `let` and `const` variables are not attached to `window`.
- Block Scope: Accessible only within the block in which they are defined (`let` and `const`).
- Function Scope: Accessible only within the function in which they are defined (`var`, `let`, and `const`).
*/
