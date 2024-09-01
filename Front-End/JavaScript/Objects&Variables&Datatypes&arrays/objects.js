/*
Objects in JavaScript:
----------------------
- Objects are used to store collections of data and more complex entities.
- An object is a collection of key-value pairs, where the keys are strings (or Symbols) and the values can be any type, including other objects.
- Objects can be created using the object literal syntax `{}` or with the `new Object()` constructor.
*/

// 1. Creating Objects

// Using object literal syntax: { key:value, key:value...};
let person = {
  name: "John Doe",
  age: 30,
  isDeveloper: true,
  greet: function () {
    console.log("Hello, my name is " + this.name);
  },
  //key:value;
};
// the variable person is storing an object

// Using the Object constructor
let car = new Object();
car.brand = "Toyota";
car.model = "Corolla";
car.year = 2021;
car.start = function () {
  console.log("The car has started.");
};

// 2. Accessing Object Properties
// - Dot notation: `object.propertyName`
// - Bracket notation: `object["propertyName"]`

console.log(person.name); // Output: "John Doe"
console.log(person["age"]); // Output: 30

console.log(car.brand); // Output: "Toyota"
console.log(car["model"]); // Output: "Corolla"

// 3. Modifying Object Properties
person.age = 31; // Using dot notation
car["year"] = 2022; // Using bracket notation

console.log(person.age); // Output: 31
console.log(car.year); // Output: 2022

// 4. Adding New Properties to Objects
person.job = "Software Developer"; // Adding new property
car.color = "Red"; // Adding new property using dot notation

console.log(person.job); // Output: "Software Developer"
console.log(car.color); // Output: "Red"

// 5. Deleting Object Properties
delete person.isDeveloper;
console.log(person.isDeveloper); // Output: undefined

// 6. Nested Objects
// Objects can contain other objects as properties.
let employee = {
  name: "Alice",
  position: "Manager",
  contact: {
    email: "alice@example.com",
    phone: "123-456-7890",
  },
};

// Accessing nested object properties
console.log(employee.contact.email); // Output: "alice@example.com"

// 7. Object Methods and `this` Keyword
// - Methods are functions that belong to an object.
// - The `this` keyword refers to the current object within its method.

person.greet(); // Output: "Hello, my name is John Doe"

// 8. Object Destructuring
// - Object destructuring is a convenient way of extracting multiple properties from an object and assigning them to variables.
// - This allows for cleaner and more readable code when you need to use multiple properties of an object.
// - Destructuring works by matching variable names with property names in the object.
//when using object destructuring in JavaScript, the variables you declare must have the same names as the object's properties that you want to extract.
//The destructuring syntax relies on matching the names of the properties in the object with the variable names you provide.

let { name, age } = person; // Extracts `name` and `age` from `person` and assigns them to variables `name` and `age`
console.log(name); // Output: "John Doe"
console.log(age); // Output: 30

// Output the entire object
console.log(person);
// Output the object as a table
console.table(person);

/*
  Summary:
  --------
  - Objects are key-value pairs used to store data and methods.
  - Access and modify object properties using dot notation or bracket notation.
  - Objects can contain nested objects for complex structures.
  - Methods are functions inside objects, and `this` refers to the object itself.
  - Destructuring is a shorthand way to extract properties from objects.
  */
