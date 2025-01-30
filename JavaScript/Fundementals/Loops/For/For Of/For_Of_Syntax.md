
# For...Of Loop in JavaScript

The `for...of` loop in JavaScript is used to iterate over iterable objects, such as arrays, strings, maps, sets, and other iterable collections. Unlike `for...in`, which iterates over enumerable properties, `for...of` works directly with the values of the iterable.

## Syntax
```javascript
for (variable of iterable) {
    // Code to be executed for each value
}
```

### Explanation of Components
1. **Variable**: A variable that will hold the value of the current element being iterated over.
2. **Iterable**: An object that implements the iterable protocol (e.g., arrays, strings, maps, sets).

### Use Cases and Examples

#### Example 1: Iterating over an array
```javascript
let fruits = ["Apple", "Banana", "Cherry"];

for (let fruit of fruits) {
    console.log(fruit);
}
// Outputs:
// Apple
// Banana
// Cherry
```

#### Example 2: Iterating over a string
```javascript
let word = "Hello";

for (let char of word) {
    console.log(char);
}
// Outputs:
// H
// e
// l
// l
// o
```

#### Example 3: Iterating over a Map
```javascript
let scores = new Map([
    ["Alice", 90],
    ["Bob", 85],
    ["Charlie", 88]
]);

for (let [name, score] of scores) {
    console.log(`${name}: ${score}`);
}
// Outputs:
// Alice: 90
// Bob: 85
// Charlie: 88
```

#### Example 4: Iterating over a Set
```javascript
let uniqueNumbers = new Set([1, 2, 3, 4, 5]);

for (let num of uniqueNumbers) {
    console.log(num);
}
// Outputs:
// 1
// 2
// 3
// 4
// 5
```

#### Example 5: Using `for...of` with the `entries()` method
```javascript
let colors = ["Red", "Green", "Blue"];

for (let [index, color] of colors.entries()) {
    console.log(`${index}: ${color}`);
}
// Outputs:
// 0: Red
// 1: Green
// 2: Blue
```

### Notes
- The `for...of` loop works only with iterable objects.
- It does not iterate over object properties; for that, use `for...in`.
- Useful when you need to work directly with values instead of keys or indices.
