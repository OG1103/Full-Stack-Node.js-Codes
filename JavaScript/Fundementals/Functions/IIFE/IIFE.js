 
// IIFE Examples

// Basic IIFE
(function () {
  console.log("This is an IIFE!");
})();

// IIFE with Parameters
(function (name) {
  console.log(`Hello, ${name}!`);
})("Alice");

// Preventing Global Scope Pollution
(function () {
  const privateVariable = "This is private";
  console.log(privateVariable);
})();
// console.log(privateVariable); // Error
