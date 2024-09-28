/**
 * JavaScript Classes - In-depth Explanation
 * -----------------------------------------
 * JavaScript classes, introduced in ES6 (ECMAScript 2015), are syntactic sugar over JavaScript's prototype-based inheritance.
 * Classes provide a structured way to create and manage objects using Object-Oriented Programming (OOP) principles such as
 * inheritance, encapsulation, and polymorphism.
 * When we create an instance of a class in JavaScript, we are generating a new object of that class type with its own unique properties
 * This approach is more efficient and organized than manually creating multiple objects with the same properties
 *  In classes, the this keyword refers to the specific instance (object) that is created when the class is instantiated.
 *  Every time you create a new object using the new keyword, this inside the class methods or constructor refers to that new object.
 *
 * Basic concepts covered:
 * - Basic Class Syntax
 * - Constructors
 * - Getters and Setters
 * - Static Methods
 * - Encapsulation
 * - Private fields (ES2022+)
 *
 * Let's start with the basic syntax and build up from there.
 */

/**
 * 1. Basic Class Syntax
 * ---------------------
 * A class in JavaScript is declared using the `class` keyword. Classes encapsulate properties and methods.
 * The `constructor` is a special method that initializes the properties of an object when a new instance is created.
 *
 * Syntax:
 * --------
 * class ClassName {
 *   constructor(parameters) {
 *     // Initialize properties
 *   }
 *
 *  getters&setters
 *
 *   method1() {
 *     // Define behavior
 *   }
 * }
 */

// Basic Example:
class Person {
  // Constructor initializes properties when an object is created
  constructor(name, age) {
    this.name = name; // the 'name' property of the instantiated object is set to the 'name' argument passed to the constructor
    this.age = age;
  }

  // Instance method
  greet() {
    return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
  }
}

// Create an instance of the Person class (we create an object)
const person1 = new Person("Alice", 30);
console.log(person1.greet()); // Output: Hello, my name is Alice and I am 30 years old.

/**
 * Key Points:
 * -----------
 * - The `constructor` method is called automatically when an object is created using the `new` keyword.
 * - Instance methods are defined within the class and can be called on objects (instances).
 */

/**
 * 2. Getters and Setters
 * ----------------------
 * Getters and setters allow you to control how properties are accessed and modified.
 * - A getter (`get`) retrieves a property value.
 * - A setter (`set`) defines how a property value is changed.
 * - Can not name the getters and setters the same name as an attribute/propery
 */

class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  // Getter to calculate the area of the rectangle
  get area() {
    return this.width * this.height;
  }

  // Setter to update dimensions
  //In this example i'm passing by an object
  set dimensions({ width, height }) {
    this.width = width;
    this.height = height;
  }
}

const rect = new Rectangle(10, 5);
console.log(rect.area); // Output: 50 (getter is called)

rect.dimensions = { width: 15, height: 7 }; // Setter is called to update width and height and pass by the object  { width: 15, height: 7 } as the parameter
console.log(rect.area); // Output: 105

/**
 * Key Points:
 * -----------
 * - `get` allows you to define a property that is calculated dynamically.
 * - `set` provides control over how a property can be updated.
 * - Getters and setters are accessed as PROPERTIES, not as methods (no parentheses are needed).
 */
class Book {
  constructor(author) {
    this._author = author;
  }
  // getter
  get writer() {
    return this._author;
  }
  // setter
  set writer(updatedAuthor) {
    //additional logic
    this._author = updatedAuthor;
  }
}
const novel = new Book("anonymous");
console.log(novel.writer); // anonymous
// set syntax: object.setmethodname= "parameter im passing to the method/value im setting";
novel.writer = "newAuthor";
console.log(novel.writer); // syntax for getter

/**
 * 3. Static Methods
 * -----------------
 * Static methods belong to the class itself rather than to instances of the class.
 * They are used for functionality that doesn't rely on instance-specific data.
 */

class MathUtils {
  // Static method for addition
  static add(a, b) {
    return a + b;
  }

  // Static method for subtraction
  static subtract(a, b) {
    return a - b;
  }
}

// Static methods are called on the class itself, not on instances
console.log(MathUtils.add(5, 3)); // Output: 8
console.log(MathUtils.subtract(10, 7)); // Output: 3

/**
 * Key Points:
 * -----------
 * - Static methods cannot be called on instances of the class; they are called on the class itself.
 * - Static methods are useful for utility functions.
 */

/**
 * 6. Encapsulation with Private Fields (ES2022+)
 * ----------------------------------------------
 * Encapsulation is the practice of restricting access to certain properties or methods. In ES2022, private fields were introduced.
 * Private fields are prefixed with a `#` and cannot be accessed or modified outside of the class.
 */

class Counter {
  // Private field
  #count = 0;

  // Increment the counter
  increment() {
    this.#count++;
  }

  // Get the current count
  getCount() {
    return this.#count;
  }
}

const counter = new Counter();
counter.increment();
console.log(counter.getCount()); // Output: 1
// console.log(counter.#count); // Error: Private field '#count' must be declared in an enclosing class

/**
 * Key Points:
 * -----------
 * - Private fields (prefixed with `#`) are only accessible within the class.
 * - Encapsulation helps hide the internal state of an object and only expose necessary methods for interacting with it.
 */

/**
 * 7. Class Expressions
 * --------------------
 * You can define classes using expressions, which can be either named or anonymous.
 */

// Anonymous class expression
const Square = class {
  constructor(side) {
    this.side = side;
  }

  getArea() {
    return this.side * this.side;
  }
};

const square1 = new Square(4);
console.log(square1.getArea()); // Output: 16

/**
 * Key Points:
 * -----------
 * - Class expressions can be anonymous or named.
 * - Class expressions provide flexibility in where and how classes are defined.
 */

/**
 * Summary:
 * ---------
 * - **Classes** provide a clear and structured way to define objects in JavaScript.
 * - Key features include: constructors, instance methods, static methods, inheritance, method overriding, and polymorphism.
 * - **Getters and Setters** allow controlled access and updates to object properties.
 * - **Static methods** belong to the class itself and are not tied to instances.
 * - **Inheritance** with `extends` and `super()` allows for code reuse and method overriding.
 * - **Polymorphism** enables different behaviors for the same method in different classes.
 * - **Encapsulation** is achieved with private fields (introduced in ES2022) to protect internal states.
 * - **Class expressions** offer flexibility in how classes are defined and used.
 */
