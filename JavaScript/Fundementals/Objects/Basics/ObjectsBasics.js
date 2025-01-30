
// Creating Objects
let person = {
  name: "John Doe",
  age: 30,
  greet() {
    console.log("Hello, my name is " + this.name);
  },
};
person.greet(); // Output: "Hello, my name is John Doe"

// Using Object Constructor
let car = new Object();
car.brand = "Toyota";
car.start = function () {
  console.log("The car has started.");
};
car.start(); // Output: "The car has started."

// Accessing and Modifying Properties
console.log(person.name); // Output: "John Doe"
person.age = 31;
console.log(person.age); // Output: 31

// Nested Objects
let employee = {
  name: "Alice",
  contact: {
    email: "alice@example.com",
  },
};
console.log(employee.contact.email); // Output: "alice@example.com"

// Object Destructuring
let { name, age } = person;
console.log(name); // Output: "John Doe"
console.log(age); // Output: 31

// Arrow Function and 'this' Issue
let animal = {
  species: "Cat",
  makeSound: () => {
    console.log(`${this.species} makes Meow`);
  },
};
animal.makeSound(); // Output: "undefined makes Meow"

// Correct use of 'this'
let correctAnimal = {
  species: "Dog",
  makeSound() {
    console.log(`${this.species} makes Woof`);
  },
};
correctAnimal.makeSound(); // Output: "Dog makes Woof"

// Object as Class
let book = {
  title: "JavaScript Basics",
  getSummary() {
    return `${this.title} is an amazing book.`;
  },
};
console.log(book.getSummary()); // Output: "JavaScript Basics is an amazing book."
