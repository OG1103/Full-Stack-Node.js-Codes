/*
  Functions Inside Objects (Methods):
  -----------------------------------
  - Functions that are defined as a property of an object are called methods.
  - Methods can perform operations using the object's data.
  - Inside a method, 'this' refers to the object to which the method belongs.

  Example:
*/

let book = {
  title: "JavaScript Essentials",
  author: "Jane Smith",
  getSummary: function () {
    return `${this.title} by ${this.author}`;
  },
};

// Invoking the method
console.log(book.getSummary()); // Output: "JavaScript Essentials by Jane Smith"

/*
    Objects Representing Classes:
    -----------------------------
    - In JavaScript, objects can be used to represent classes.
    - A class is a blueprint for creating objects with similar properties and methods.
    - Functions inside objects can serve as methods that operate on the object's properties.
    - The 'this' keyword within methods provides a way to refer to the instance of the object.
  
    Example:
  */

let dog = {
  name: "Buddy",
  breed: "Golden Retriever",
  speak: function () {
    console.log(`${this.name} says woof!`);
  },
};

// Invoking the method
dog.speak(); // Output: "Buddy says woof!"

/*
    Understanding 'this' in Methods:
    -------------------------------
    - The 'this' keyword inside a method refers to the object that contains the method.
    - It allows access to the object's properties and other methods from within the object.
    - The value of 'this' is determined by how a function is called (runtime binding).
  
    Example:
  */

let student = {
  firstName: "Emily",
  lastName: "Johnson",
  fullName: function () {
    return this.firstName + " " + this.lastName;
  },
};

console.log(student.fullName()); // Output: "Emily Johnson"

/*
    Using 'this' with Arrow Functions:
    ----------------------------------
    - Arrow functions do not have their own 'this' context; they inherit 'this' from the enclosing function scope.
    - This makes arrow functions unsuitable as methods when you need to refer to the object's properties.
  
    Example:
  */

let animal = {
  species: "Cat",
  sound: "Meow",
  makeSound: () => {
    console.log(`${this.species} makes ${this.sound}`);
  },
};

animal.makeSound(); // Output: "undefined makes undefined" (because 'this' is not bound to 'animal')

// To correctly use 'this', use a regular function
let animalCorrect = {
  species: "Cat",
  sound: "Meow",
  makeSound: function () {
    console.log(`${this.species} makes ${this.sound}`);
  },
};

animalCorrect.makeSound(); // Output: "Cat makes Meow"
