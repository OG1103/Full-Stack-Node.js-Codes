// const numbers = [10, 20, 30, 40, 50];

// // Use a `for` loop to iterate through the array
// for (let i = 0; i < numbers.length; i++) {
//   // Access the current element using the index `i`
//   const currentNumber = numbers[i];
//   // Print the current element to the console
//   console.log(`Element at index ${i}: ${currentNumber}`);
//   //or
//   console.log("Element at index:", i, "is", currentNumber);
//   //or
//   console.log("Element at index:" + i + "is" + currentNumber);
//   //this concatinates doesn't leave space since its concatinates, the line before it leaves space as , sperates them.
// }

let fruit = "apple";
switch (fruit) {
  case "banana":
    console.log("banana");
    break;
  case "apple":
    console.log("apple");
    break;
  default:
    console.log("default");
}

let y = parseInt(prompt("Enter number"));

switch (y) {
  case 1:
    console.log("test");
    break;
  default:
    console.log(y);
}
