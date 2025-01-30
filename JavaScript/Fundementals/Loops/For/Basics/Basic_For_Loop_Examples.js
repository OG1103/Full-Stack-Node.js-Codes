
// Complex Examples of Basic For Loop in JavaScript

// Example 1: Calculating the sum of numbers from 1 to 100
let sum = 0;
for (let i = 1; i <= 100; i++) {
    sum += i;
}
console.log("Sum of numbers from 1 to 100:", sum);
// Output: Sum of numbers from 1 to 100: 5050

// Example 2: Nested for loop to generate a multiplication table
for (let i = 1; i <= 5; i++) {
    for (let j = 1; j <= 5; j++) {
        console.log(`${i} x ${j} = ${i * j}`);
    }
}
// Output: Multiplication table for numbers 1 to 5

// Example 3: Iterating over a 2D array
let matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];
for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
        console.log(`Element at (${i}, ${j}):`, matrix[i][j]);
    }
}
// Output: Each element of the 2D array with its indices

// Example 4: Reversing a string
let str = "JavaScript";
let reversedStr = "";
for (let i = str.length - 1; i >= 0; i--) {
    reversedStr += str[i];
}
console.log("Reversed String:", reversedStr);
// Output: Reversed String: tpircSavaJ
