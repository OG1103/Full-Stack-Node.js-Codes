
// Basic If Statement Example
let age = 20;

if (age >= 18) {
  console.log("You are eligible to vote."); // Output: You are eligible to vote.
}

// If...Else Statement Example
let isStudent = false;

if (isStudent) {
  console.log("You are a student.");
} else {
  console.log("You are not a student."); // Output: You are not a student.
}

// If...Else If...Else Statement Example
let score = 85;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B"); // Output: Grade: B
} else if (score >= 70) {
  console.log("Grade: C");
} else {
  console.log("Grade: F");
}

// Nested If Statement Example
let ageForAccess = 25;
let isMember = true;

if (ageForAccess >= 18) {
  if (isMember) {
    console.log("Welcome to the members' lounge."); // Output: Welcome to the members' lounge.
  } else {
    console.log("Please register to become a member.");
  }
} else {
  console.log("You must be 18 or older to enter.");
}

// Logical Operators Example
let loggedIn = true;
let hasPermission = false;

if (loggedIn && hasPermission) {
  console.log("Access granted.");
} else {
  console.log("Access denied."); // Output: Access denied.
}

// Edge Case: Truthy and Falsy Values
if ("") {
  console.log("Falsy condition will not execute.");
} else {
  console.log("Empty strings are falsy."); // Output: Empty strings are falsy.
}

if ("hello") {
  console.log("Non-empty strings are truthy."); // Output: Non-empty strings are truthy.
}

// Strict Equality Example
let num = "5";

if (num == 5) {
  console.log("'==' allows type coercion."); // Output: '==' allows type coercion.
}

if (num === 5) {
  console.log("'===' ensures strict equality.");
} else {
  console.log("'===' prevents type coercion."); // Output: '===' prevents type coercion.
}
