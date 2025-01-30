 
// Closure Examples

// Basic Closure
function outerFunction(outerVariable) {
  return function innerFunction(innerVariable) {
    console.log(`Outer: ${outerVariable}`);
    console.log(`Inner: ${innerVariable}`);
  };
}
const closureExample = outerFunction("Outer Value");
closureExample("Inner Value");

// Closure with Counter
function createCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}
const counter = createCounter();
console.log(counter()); // Output: 1
console.log(counter()); // Output: 2
