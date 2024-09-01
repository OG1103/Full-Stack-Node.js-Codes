//Array of objects, where the objects contains a nested array of objects
// Array of departments, where each department has an array of employees (each employee is an object)
// The array of deparment it self is an array of objects. Inside each object is a nested array of objects
let departments = [
  {
    name: "Engineering",
    employees: [
      //attribute employees of the object is storing a nested array of objects
      { name: "Alice", age: 30, role: "Frontend Developer" },
      { name: "Bob", age: 25, role: "Backend Developer" },
    ],
  },
  {
    name: "Human Resources",
    employees: [
      { name: "Charlie", age: 35, role: "HR Manager" },
      { name: "David", age: 28, role: "Recruiter" },
    ],
  },
  {
    name: "Sales",
    employees: [
      { name: "Eve", age: 40, role: "Sales Executive" },
      { name: "Frank", age: 32, role: "Account Manager" },
    ],
  },
];

// Output the entire array structure
console.log(departments);
// Accessing a specific department
console.log(departments[0].name); // Output: "Engineering"
// Accessing the employees array of a specific department
console.log(departments[0].employees);

//In json files as a response they are returned as an array of object or a single object.
