
# Rest Parameter in JavaScript

## Overview
The rest parameter in JavaScript allows a function to accept an indefinite number of arguments and places them in an array.

- It provides a way to represent any number of arguments as an array inside a function, making it easier to handle multiple inputs without explicitly defining each one.

---

## Syntax
The rest parameter syntax uses three dots (`...`) followed by a parameter name:

```javascript
function functionName(...parameterName) {
    // function body
}
```

---

## Key Points
- **`parameterName`** is the name of the array that stores the arguments/values passed to the function whenever it is called.
- The rest parameter **must be the last parameter** in the function definition.
- It gathers the remaining arguments passed to the function into an array.
- The rest parameter is a **real array**, so you can use array methods like `map`, `filter`, `reduce` directly on it.

---

## Example
### Example 1: Summing Numbers
```javascript
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4)); // Output: 10
```

### Example 2: Collecting Remaining Arguments
```javascript
function display(first, second, ...others) {
    console.log("First:", first);
    console.log("Second:", second);
    console.log("Others:", others);
}

display(10, 20, 30, 40, 50);
// Output:
// First: 10
// Second: 20
// Others: [30, 40, 50]
```

