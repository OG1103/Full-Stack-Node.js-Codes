
# Basic For Loop Syntax in JavaScript

The `for` loop in JavaScript is used to repeat a block of code a specified number of times. It is often used when you know how many iterations you want to perform.

## Syntax
```javascript
for (initialization; condition; increment/decrement) {
    // Code to be executed in each iteration
}
```

### Explanation of Components
1. **Initialization**: This is executed before the loop starts. It is used to initialize the loop variable.
2. **Condition**: The loop continues to execute as long as this condition evaluates to `true`.
3. **Increment/Decrement**: This is executed at the end of each loop iteration. It is typically used to update the loop variable.

### Simple Examples

#### Example 1: Counting from 1 to 5
```javascript
for (let i = 1; i <= 5; i++) {
    console.log(i); // Outputs: 1, 2, 3, 4, 5
}
```

#### Example 2: Printing an array
```javascript
let fruits = ["Apple", "Banana", "Cherry"];
for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]); // Outputs: Apple, Banana, Cherry
}
```

#### Example 3: Looping backward
```javascript
for (let i = 5; i > 0; i--) {
    console.log(i); // Outputs: 5, 4, 3, 2, 1
}
```

The `for` loop is highly versatile and can be used for various tasks such as iterating over arrays, performing calculations, or executing repetitive tasks.
