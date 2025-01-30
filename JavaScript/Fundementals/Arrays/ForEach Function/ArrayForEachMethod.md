
# JavaScript Array.prototype.forEach() Method

The `forEach()` method executes a provided function once for each element in an array.

## Key Points:
- `forEach()` is used to iterate over the elements of an array.
- It calls a provided callback function for each element in the array in the order they appear.
- Unlike `map()`, `forEach()` does not create a new array—it simply performs operations on the elements of the array.
- `forEach()` does not return a value (its return value is always `undefined`).

## Syntax
```javascript
array.forEach(function(currentValue, index, array), thisArg);
```

### Parameters:
- `currentValue` (required): The current element being processed in the array.
- `index` (optional): The index of the current element.
- `array` (optional): The array that `forEach()` is being called on.
- `thisArg` (optional): Value to use as `this` when executing the callback function.

---

## Examples and Explanations

### Basic Example
```javascript
const numbers = [1, 2, 3, 4, 5];

numbers.forEach(function (number) {
  console.log(number);
});
// Output: 1, 2, 3, 4, 5 (each on a new line)
```
**Explanation:**
- `forEach()` iterates through each element in the `numbers` array.
- The callback function logs each element to the console.

---

### Using Arrow Function
```javascript
numbers.forEach((number) => console.log(number));
// Output: 1, 2, 3, 4, 5
```

---

### Accessing the Index in `forEach()`
```javascript
numbers.forEach((number, index) => {
  console.log(`Index ${index}: ${number}`);
});
/*
Output:
Index 0: 1
Index 1: 2
Index 2: 3
Index 3: 4
Index 4: 5
*/
```

---

### Modifying Array Elements with `forEach()`
```javascript
const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 },
];

people.forEach((person) => {
  person.age += 1;
});

console.log(people);
/*
Output:
[
  { name: 'Alice', age: 26 },
  { name: 'Bob', age: 31 },
  { name: 'Charlie', age: 36 }
]
*/
```
**Explanation:**
- The callback function increments the `age` property of each `person` by 1.
- Since objects are passed by reference, the original array is modified.

---

### Using `thisArg` in `forEach()`
```javascript
const multiplier = {
  factor: 2,
  multiply(number) {
    console.log(number * this.factor);
  },
};

numbers.forEach(function (number) {
  this.multiply(number);
}, multiplier);
// Output: 2, 4, 6, 8, 10
```

---

### `forEach()` vs. `for` Loop
```javascript
// Traditional for loop
for (let i = 0; i < numbers.length; i++) {
  console.log(numbers[i]);
}
// Output: 1, 2, 3, 4, 5

// Same result using forEach
numbers.forEach((number) => console.log(number));
// Output: 1, 2, 3, 4, 5
```

---

## Key Differences Between `forEach()` and `for` Loops
- `forEach()` is more readable and eliminates the need for loop counters.
- You cannot break out of a `forEach()` loop early—it will iterate over the entire array.
- `forEach()` does not return a value.

---

## Conclusion
`forEach()` is a powerful and simple method for iterating over arrays in JavaScript. It is best used when you want to perform an operation on each element of an array without needing to return a new array or break out of the loop early.
