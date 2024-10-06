// TypeScript Interfaces Overview

// 1. Basic Interface Example
// An interface defines the structure of an object with specific types for properties
interface person {
  name: string;
  age: number;
  isStudent: boolean;
}

let Student: person = {
  name: "Alice",
  age: 22,
  isStudent: true,
};

// 2. Optional Properties in Interfaces
// Optional properties are marked with a '?' and are not required in objects implementing the interface
interface Car {
  make: string;
  model: string;
  year?: number; // 'year' is optional
}

let car1: Car = { make: "Toyota", model: "Corolla" };
let car2: Car = { make: "Ford", model: "Mustang", year: 2020 };

// 3. Read-Only Properties in Interfaces
// Read-only properties are marked with 'readonly' and cannot be modified after initialization
interface User {
  readonly id: number;
  name: string;
}

let user: User = { id: 1, name: "John" };
// user.id = 2; // Error: Cannot assign to 'id' because it is a read-only property

// 4. Method Signatures in Interfaces
// You can define methods with parameter types and return types in an interface
interface Animal {
  name: string;
  speak(): void; // Method signature: speak() must return void
}

class Dog implements Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  // Implementing the 'speak' method as required by the 'Animal' interface
  speak(): void {
    console.log(`${this.name} barks.`);
  }
}

let dog = new Dog("Buddy");
dog.speak(); // Output: Buddy barks.

// 5. Missing Method Implementation (Error Example)
// If a class implements an interface but does not implement all required methods, TypeScript will throw an error.
// Uncommenting the following code will cause an error:
//
// class Cat implements Animal {
//   name: string;
//   constructor(name: string) {
//     this.name = name;
//   }
//   // Missing 'speak' method will result in an error
// }

// 6. Interface for Function Types
// Interfaces can also define the structure of functions, specifying parameters and return types
interface Add {
  (a: number, b: number): number; // Function signature: takes two numbers, returns a number
}

const addNumberss: Add = (a, b) => a + b;
console.log(addNumberss(5, 10)); // Output: 15

// 7. Extending Interfaces
// One interface can extend another to inherit its properties and methods
interface Animal {
  species: string;
}

interface Dog extends Animal {
  breed: string;
  name: string; // Added 'name' to the Dog interface
  speak(): void; // Added 'speak' method to the Dog interface
}

let myDog: Dog = {
  species: "Canine",
  breed: "Labrador",
  name: "Buddy", // Now we have the 'name' property
  speak(): void {
    console.log(`${this.name} barks!`);
  },
};
// Calling the method to check if it works
myDog.speak(); // Output: Buddy barks!

// 8. Interfaces with Classes
// Classes can implement interfaces, forcing them to conform to the defined structure
interface Shape {
  area(): number; // Method signature: area() must return a number
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}

  // Implementing the 'area' method as required by the 'Shape' interface
  area(): number {
    return this.width * this.height;
  }
}

let rect = new Rectangle(10, 20);
console.log(rect.area()); // Output: 200
