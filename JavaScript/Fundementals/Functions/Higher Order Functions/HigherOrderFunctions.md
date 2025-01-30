
# Higher-Order Functions in JavaScript

A higher-order function is a function that either:
1. Accepts other functions as arguments.
2. Returns a function as its result.

Higher-order functions are a key concept in functional programming and are widely used in JavaScript.

## Example: Passing a Function as an Argument
```javascript
function greet(callback) {
  const name = "Alice";
  callback(name);
}

function sayHello(name) {
  console.log(`Hello, ${name}!`);
}

greet(sayHello); // Output: Hello, Alice!
```

## Example: Returning a Function
```javascript
// This can also be an arrow function
function multiplyBy(factor) {
  return (number) => {
    return number * factor;
  };
}

const double = multiplyBy(2);
console.log(double(5)); // Output: 10
```

## Example: Higher-Order Function with Arrays
```javascript
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map((num) => num * num);
console.log(squared); // Output: [1, 4, 9, 16, 25]
```

## Summary
- Higher-order functions increase modularity and reusability.
- They are often used with array methods like `map`, `filter`, and `reduce`.
