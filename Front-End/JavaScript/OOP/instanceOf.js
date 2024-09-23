// INSTANCE OF
/**
 * The instanceof operator in JavaScript is used to check the type of an object at run time.
 * If It returns a boolean value of true then it indicates that the object is an instance of a particular class and if false then it is not.
 */

// Basic example
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}
const auto = new Car("Honda", "Accord", 1998);

console.log(auto instanceof Car);
// Expected output: true

console.log(auto instanceof Object);
// Expected output: true

//-----------------------------------------------------------------------------------------------------------------------------------------------

// INSTANCE OF with Class Inheritance
// If i have a object of type subclass, then it is also considered an object of type superclass

// Base class
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

// Derived class
class Dog extends Animal {
  constructor(name) {
    super(name); // Call the constructor of the parent class
  }

  speak() {
    console.log(`${this.name} barks.`);
  }
}

// Create an instance of Dog
const myDog = new Dog("Rex");

// Using instanceof to check types
console.log(myDog instanceof Dog); // Expected output: true
console.log(myDog instanceof Animal); // Expected output: true
console.log(myDog instanceof Object); // Expected output: true
console.log(myDog instanceof Array); // Expected output: false

// Call the speak method
// Since it's implemented in the dog class, it will override the one in the super class
myDog.speak(); // Expected output: "Rex barks."
