
// Complex Examples of Do...While Loop in JavaScript

// Example 1: Generating random numbers until a specific value is reached
let randomNum;
do {
    randomNum = Math.floor(Math.random() * 10);
    console.log("Generated number:", randomNum);
} while (randomNum !== 7);
// Output: Random numbers until 7 is generated

// Example 2: Reversing a number
let number = 12345;
let reversedNumber = 0;

do {
    reversedNumber = reversedNumber * 10 + (number % 10);
    number = Math.floor(number / 10);
} while (number > 0);
console.log("Reversed number:", reversedNumber);
// Output: Reversed number: 54321

// Example 3: Validating user input
let input;
do {
    input = prompt("Enter a number greater than 10:");
} while (input !== null && Number(input) <= 10);
console.log("Valid input received:", input);
// Output: Depends on user input

// Example 4: Simulating a countdown timer with a condition
let timer = 5;
do {
    console.log(`Time left: ${timer} seconds`);
    timer--;
} while (timer > 0);
console.log("Timer complete!");
// Output:
// Time left: 5 seconds
// Time left: 4 seconds
// ...
// Timer complete!

// Example 5: Summing an array with a do...while loop
let values = [1, 2, 3, 4, 5];
let sum = 0;
let index = 0;

do {
    sum += values[index];
    index++;
} while (index < values.length);
console.log("Sum of array:", sum);
// Output: Sum of array: 15
