 
// Higher-Order Function Examples

// Passing a Function as an Argument
function greet(callback) {
  const name = "Alice";
  callback(name);
}

function sayHello(name) {
  console.log(`Hello, ${name}!`);
}
greet(sayHello); // Output: Hello, Alice!

// Returning a Function
function multiplyBy(factor) {
  return function (number) {
    return number * factor;
  };
}
const double = multiplyBy(2);
console.log(double(5)); // Output: 10

// Higher-Order Function with Arrays
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map((num) => num * num);
console.log(squared); // Output: [1, 4, 9, 16, 25]
