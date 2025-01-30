
// Console Log Example
console.log("Hello, world!"); // Output: "Hello, world!"

// Example: Variable Scoping
function exampleVar() {
  var x = 10;
  if (true) {
    var x = 20; // Same variable (function scope)
    console.log(x); // Output: 20
  }
  console.log(x); // Output: 20
}
exampleVar();

function exampleLet() {
  let y = 10;
  if (true) {
    let y = 20; // Different variable (block scope)
    console.log(y); // Output: 20
  }
  console.log(y); // Output: 10
}
exampleLet();

// Example: Hoisting
console.log(z); // Output: undefined (hoisted declaration)
// console.log(a); // Error: Cannot access 'a' before initialization
var z = 5;
let a = 10;

// Example: Function Hoisting
sayHello(); // Output: "Hello, world!"
function sayHello() {
  console.log("Hello, world!");
}

// Example: Block Scope
if (true) {
  let blockScoped = "I am block scoped";
  const blockConst = "I am also block scoped";
  console.log(blockScoped); // Output: "I am block scoped"
  console.log(blockConst); // Output: "I am also block scoped"
}
// console.log(blockScoped); // Error: blockScoped is not defined

// Example: Global vs Block Scope
const myConst = 10;
function testScope() {
  const myConst = 20;
  console.log(myConst); // Output: 20
}
testScope();
console.log(myConst); // Output: 10
