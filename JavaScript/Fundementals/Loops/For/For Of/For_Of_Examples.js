
// Complex Examples of For...Of Loop in JavaScript

// Example 1: Calculating the sum of numbers in an array
let numbers = [10, 20, 30, 40, 50];
let sum = 0;

for (let num of numbers) {
    sum += num;
}
console.log("Sum of numbers:", sum);
// Output: Sum of numbers: 150

// Example 2: Iterating over a Map to generate a string summary
let sales = new Map([
    ["January", 300],
    ["February", 400],
    ["March", 500]
]);
let summary = "";

for (let [month, amount] of sales) {
    summary += `${month}: $${amount}\n`;
}
console.log("Sales Summary:\n" + summary);
// Output:
// Sales Summary:
// January: $300
// February: $400
// March: $500

// Example 3: Flattening a 2D array
let matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];
let flattened = [];

for (let row of matrix) {
    for (let value of row) {
        flattened.push(value);
    }
}
console.log("Flattened array:", flattened);
// Output: Flattened array: [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Example 4: Counting characters in a string
let sentence = "for...of loop";
let charCount = {};

for (let char of sentence) {
    charCount[char] = (charCount[char] || 0) + 1;
}
console.log("Character count:", charCount);
// Output: Character count: { f: 1, o: 3, r: 1, '.': 3, ... }

// Example 5: Iterating over a Set to filter unique values
let values = new Set([2, 4, 6, 8, 10, 12]);
let filtered = [];

for (let value of values) {
    if (value > 6) {
        filtered.push(value);
    }
}
console.log("Filtered values greater than 6:", filtered);
// Output: Filtered values greater than 6: [8, 10, 12]
