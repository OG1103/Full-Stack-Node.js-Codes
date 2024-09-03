
const numbers = [10, 20, 30, 40, 50];

// Use a `for` loop to iterate through the array
for (let i = 0; i < numbers.length; i++) {
  // Access the current element using the index `i`
  const currentNumber = numbers[i];
  // Print the current element to the console
  console.log(`Element at index ${i}: ${currentNumber}`);
  //or
  console.log("Element at index:",i,"is",currentNumber);
  //or
  console.log("Element at index:"+i+"is"+currentNumber);
  //this concatinates doesn't leave space since its concatinates, the line before it leaves space as , sperates them.

}