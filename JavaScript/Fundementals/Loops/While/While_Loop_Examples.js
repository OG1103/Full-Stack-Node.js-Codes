
// Complex Examples of While Loop in JavaScript

// Example 1: Calculating the factorial of a number
let number = 5;
let factorial = 1;

while (number > 1) {
    factorial *= number;
    number--;
}
console.log("Factorial:", factorial);
// Output: Factorial: 120

// Example 2: Simulating a countdown timer
let timer = 10;

while (timer > 0) {
    console.log(`Time left: ${timer} seconds`);
    timer--;
}
console.log("Countdown complete!");
// Output:
// Time left: 10 seconds
// Time left: 9 seconds
// ...
// Countdown complete!

// Example 3: Extracting digits from a number
let num = 12345;
let digits = [];

while (num > 0) {
    digits.push(num % 10);
    num = Math.floor(num / 10);
}
console.log("Digits in reverse order:", digits);
// Output: Digits in reverse order: [5, 4, 3, 2, 1]

// Example 4: Filtering even numbers from an array
let values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let evenNumbers = [];
let index = 0;

while (index < values.length) {
    if (values[index] % 2 === 0) {
        evenNumbers.push(values[index]);
    }
    index++;
}
console.log("Even numbers:", evenNumbers);
// Output: Even numbers: [2, 4, 6, 8]

// Example 5: Reversing a string using a while loop
let str = "JavaScript";
let reversedStr = "";
let i = str.length - 1;

while (i >= 0) {
    reversedStr += str[i];
    i--;
}
console.log("Reversed string:", reversedStr);
// Output: Reversed string: tpircSavaJ
