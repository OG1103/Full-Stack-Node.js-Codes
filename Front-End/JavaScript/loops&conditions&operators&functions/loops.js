/**
 * LOOPS IN JAVASCRIPT
 *
 * A loop is a programming construct that repeats a block of code as long as a specified condition is true.
 * Loops help automate repetitive tasks and reduce redundancy in code.
 * There are several types of loops in JavaScript:
 * - for
 * - while
 * - do...while
 * - for...in
 * - for...of
 */

// 1. 'for' loop
// -------------------------------
// The 'for' loop is one of the most common looping constructs.
// It is generally used when the number of iterations is known beforehand.

// Syntax:
// for (initialization; condition; increment/decrement) {
//     // Code to be executed
// }

console.log("For Loop Example:");
for (let i = 0; i < 5; i++) {
  console.log("Iteration number: " + i);
}
// In this example:
// - 'let i = 0;' initializes the loop variable i and sets its value to 0.
// - 'i < 5;' is the condition that keeps the loop running as long as i is less than 5.
// - 'i++' increases the value of i by 1 after each iteration.

// 2. 'while' loop
// -------------------------------
// The 'while' loop is used when the number of iterations is not known beforehand.
// It continues to loop as long as the specified condition is true.
// Checks condition first before execution, if condition true go into loop & at each iteration checks the condition and so on...
// Syntax:
// while (condition) {
//     // Code to be executed
// }

console.log("\nWhile Loop Example:");
let count = 0;
while (count < 5) {
  console.log("Count is: " + count);
  count++;
}
// In this example:
// - 'count < 5' is the condition that keeps the loop running.
// - The loop continues until count is no longer less than 5.

// 3. 'do...while' loop
// -------------------------------
// The 'do...while' loop is similar to the 'while' loop, except it guarantees
// that the code block is executed at least once, regardless of the condition.

// Syntax:
// do {
//     // Code to be executed
// } while (condition);

console.log("\nDo...While Loop Example:");
let doCount = 0;
do {
  console.log("Do Count is: " + doCount);
  doCount++;
} while (doCount < 5);
// In this example:
// - The loop executes the code block first and then checks the condition.
// - The loop will continue until the condition (doCount < 5) is false.

// 6. Nested Loops
// -------------------------------
// Loops can be nested within each other. This means you can have a loop inside another loop.

console.log("\nNested Loops Example:");
for (let i = 1; i <= 3; i++) {
  console.log("Outer Loop iteration: " + i);
  for (let j = 1; j <= 3; j++) {
    console.log("   Inner Loop iteration: " + j);
  }
}
// In this example:
// - The outer loop runs 3 times, and for each iteration of the outer loop, the inner loop runs 3 times.

// 7. Breaking out of Loops
// -------------------------------
// The 'break' statement is used to exit a loop before it has completed all its iterations.

console.log("\nBreaking Out of Loops Example:");
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    break; // Exit the loop when i equals 3
  }
  console.log("i is: " + i);
}
// In this example:
// - The loop will stop executing once i equals 3 due to the 'break' statement.

// 8. Skipping Iterations
// -------------------------------
// The 'continue' statement is used to skip the current iteration and move to the next one.

console.log("\nSkipping Iterations Example:");
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    continue; // Skip the iteration when i equals 3, skip the rest of the code in this loop and begin a new iteration
  }
  console.log("i is: " + i);
}
// In this example:
// - The loop will skip the iteration where i equals 3 due to the 'continue' statement.
// the loop will not output 3 because when i equals 3, the continue statement is executed

//LOOP THROUGH ARRAY
// Define an array of numbers
const numbers = [10, 20, 30, 40, 50];

// Use a `for` loop to iterate through the array
for (let i = 0; i < numbers.length; i++) {
  // Access the current element using the index `i`
  const currentNumber = numbers[i];
  // Print the current element to the console
  console.log(`Element at index ${i}: ${currentNumber}`);
  //or
  console.log("Element at index:", i, "is", currentNumber);
  //or
  console.log("Element at index:" + i + "is" + currentNumber);
  //this concatinates doesn't leave space since its concatinates, the line before it leaves space as , sperates them.
}

// Output:
// Element at index 0: 10
// Element at index 1: 20
// Element at index 2: 30
// Element at index 3: 40
// Element at index 4: 50
