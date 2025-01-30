 
// Examples for `return`

// Returning a Value
function add(a, b) {
  return a + b;
}
console.log(add(3, 5)); // Output: 8

// Conditional Return
function checkAge(age) {
  if (age >= 18) {
    return "You are an adult.";
  } else {
    return "You are a minor.";
  }
}
console.log(checkAge(20)); // Output: You are an adult.
