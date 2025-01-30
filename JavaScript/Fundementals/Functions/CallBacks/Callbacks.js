
// Callback Function Examples

// Basic Callback
function greet(name, callback) {
  console.log(`Hello, ${name}!`);
  callback();
}

function farewell() {
  console.log("Goodbye!");
}

greet("Charlie", farewell);
// Output:
// Hello, Charlie!
// Goodbye!

// Callback with Array
const numbers = [1, 2, 3];
numbers.forEach((num) => {
  console.log(num * 2);
});
// Output: 2, 4, 6
