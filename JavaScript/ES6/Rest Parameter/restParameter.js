function sum(...theArgs) {
  let total = 0;
  for (const arg of theArgs) {
    total += arg;
  }
  return total;
}

console.log(sum(1, 2, 3)); // Expected output: 6

console.log(sum(1, 2, 3, 4)); // Expected output: 10

//In this example, sumAll takes any number of arguments. Inside the function, numbers is an array that collects all the arguments passed, and reduce is used to sum them up.

const logNumbers = (...numbers) => {
  console.log(numbers);
};

logNumbers(); // Output: []
logNumbers(10, 20); // Output: [10, 20]
//The rest parameter is a real array, so you can use array methods like map, filter, reduce directly on it.
