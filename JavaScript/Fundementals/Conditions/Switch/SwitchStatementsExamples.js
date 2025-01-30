
// Basic Switch Statement
let day = 5;

switch (day) {
  case 1:
    console.log("Monday");
    break;
  case 2:
    console.log("Tuesday");
    break;
  case 3:
    console.log("Wednesday");
    break;
  case 4:
    console.log("Thursday");
    break;
  case 5:
    console.log("Friday"); // Output: Friday
    break;
  default:
    console.log("Invalid day");
}

// Default Case Example
let color = "purple";

switch (color) {
  case "red":
    console.log("Color is red.");
    break;
  case "blue":
    console.log("Color is blue.");
    break;
  default:
    console.log("Unknown color."); // Output: Unknown color.
}

// Multiple Cases with Same Code
let grade = "B";

switch (grade) {
  case "A":
  case "B":
    console.log("Excellent!"); // Output: Excellent!
    break;
  case "C":
    console.log("Good.");
    break;
  default:
    console.log("Try harder.");
}

// Using Expressions in Cases
let score = 85;

switch (true) {
  case score >= 90:
    console.log("Grade: A");
    break;
  case score >= 80:
    console.log("Grade: B"); // Output: Grade: B
    break;
  case score >= 70:
    console.log("Grade: C");
    break;
  default:
    console.log("Grade: F");
}

// Nested Switch Statement
let role = "user";
let action = "view";

switch (role) {
  case "admin":
    switch (action) {
      case "edit":
        console.log("Admin can edit.");
        break;
      case "delete":
        console.log("Admin can delete.");
        break;
      default:
        console.log("Admin action not recognized.");
    }
    break;
  case "user":
    switch (action) {
      case "view":
        console.log("User can view."); // Output: User can view.
        break;
      case "comment":
        console.log("User can comment.");
        break;
      default:
        console.log("User action not recognized.");
    }
    break;
  default:
    console.log("Role not recognized.");
}
