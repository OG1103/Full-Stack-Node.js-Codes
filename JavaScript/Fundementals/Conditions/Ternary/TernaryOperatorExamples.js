
// Basic Ternary Operator Example
let age = 20;
let eligibility = age >= 18 ? "Eligible to vote" : "Not eligible to vote";
console.log(eligibility); // Output: "Eligible to vote"

// Nested Ternary Operator Example
let score = 75;
let grade = score >= 90
  ? "A"
  : score >= 80
  ? "B"
  : score >= 70
  ? "C"
  : "F";
console.log(grade); // Output: "C"

// Ternary Operator with Function Return
function checkNumber(num) {
  return num > 0 ? "Positive" : num < 0 ? "Negative" : "Zero";
}
console.log(checkNumber(5)); // Output: "Positive"
console.log(checkNumber(-3)); // Output: "Negative"
console.log(checkNumber(0)); // Output: "Zero"

// Ternary Operator with Logical Operators
let userRole = "editor";
let canEdit = userRole === "admin" || userRole === "editor" ? "Yes" : "No";
console.log(canEdit); // Output: "Yes"

// Ternary Operator in a Loop
let numbers = [10, 15, 20];
let results = numbers.map(num => (num % 2 === 0 ? "Even" : "Odd"));
console.log(results); // Output: ["Even", "Odd", "Even"]

// Complex Example with Multiple Conditions
let isLoggedIn = true;
let hasAccess = true;
let accessMessage = isLoggedIn
  ? hasAccess
    ? "Welcome, you have access."
    : "Logged in but no access."
  : "Please log in.";
console.log(accessMessage); // Output: "Welcome, you have access."
