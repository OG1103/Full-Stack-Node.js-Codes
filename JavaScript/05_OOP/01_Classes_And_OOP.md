# JavaScript Object-Oriented Programming (OOP)

JavaScript classes, introduced in ES6, provide a structured way to create objects using OOP principles. Classes are syntactic sugar over JavaScript's prototype-based inheritance.

---

## 1. OOP Principles

| Principle | Description |
|-----------|-------------|
| **Encapsulation** | Bundling data and methods that operate on that data within a single unit (class), hiding internal details |
| **Inheritance** | A class can inherit properties and methods from another class, promoting code reuse |
| **Polymorphism** | The same method can behave differently depending on which class it belongs to |
| **Abstraction** | Hiding complex implementation details and exposing only the necessary interface |

---

## 2. Basic Class Syntax

```javascript
class Person {
  // Constructor - called automatically when creating an instance with 'new'
  constructor(name, age) {
    this.name = name; // 'this' refers to the instance being created
    this.age = age;
  }

  // Instance method - available on every instance
  greet() {
    return `Hello, I'm ${this.name} and I'm ${this.age} years old.`;
  }

  // Another instance method
  isAdult() {
    return this.age >= 18;
  }
}

// Create instances using 'new'
const alice = new Person("Alice", 30);
const bob = new Person("Bob", 16);

console.log(alice.greet());   // "Hello, I'm Alice and I'm 30 years old."
console.log(bob.isAdult());   // false
```

**Key Points:**
- The `constructor` runs automatically when you use `new ClassName()`
- `this` inside the class refers to the specific instance (object) being created
- Every `new` creates an independent object with its own properties
- Instance methods are shared across all instances via the prototype

---

## 3. Getters and Setters

Getters and setters allow controlled access to properties. They are accessed **like properties** (no parentheses), not like methods.

```javascript
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  // Getter - computed property, accessed without ()
  get area() {
    return this.width * this.height;
  }

  // Getter
  get perimeter() {
    return 2 * (this.width + this.height);
  }

  // Setter - validates or transforms before setting
  set dimensions({ width, height }) {
    if (width <= 0 || height <= 0) {
      throw new Error("Dimensions must be positive");
    }
    this.width = width;
    this.height = height;
  }
}

const rect = new Rectangle(10, 5);
console.log(rect.area);       // 50 (accessed like a property, no ())
console.log(rect.perimeter);  // 30

rect.dimensions = { width: 15, height: 7 }; // Setter syntax: = value
console.log(rect.area);       // 105
```

### Naming Convention with Getters/Setters

Use `_` prefix for the internal property to avoid naming conflicts.

```javascript
class Book {
  constructor(author) {
    this._author = author; // Internal property with _ prefix
  }

  get writer() {
    return this._author;
  }

  set writer(newAuthor) {
    if (typeof newAuthor !== "string" || newAuthor.trim() === "") {
      throw new Error("Author must be a non-empty string");
    }
    this._author = newAuthor;
  }
}

const novel = new Book("J.K. Rowling");
console.log(novel.writer);   // "J.K. Rowling" (getter)
novel.writer = "George Orwell"; // (setter)
console.log(novel.writer);   // "George Orwell"
```

---

## 4. Static Methods and Properties

Static members belong to the **class itself**, not to instances. They cannot be called on instances.

```javascript
class MathUtils {
  // Static method
  static add(a, b) {
    return a + b;
  }

  static subtract(a, b) {
    return a - b;
  }

  // Static property
  static PI = 3.14159;

  // Static factory method (common pattern)
  static createFromArray([a, b]) {
    return new MathUtils(a, b);
  }
}

// Called on the CLASS, not on instances
console.log(MathUtils.add(5, 3));    // 8
console.log(MathUtils.PI);           // 3.14159

// Cannot call on instances
const math = new MathUtils();
// math.add(5, 3); // TypeError: math.add is not a function
```

**Use Cases for Static Methods:**
- Utility/helper functions that don't need instance data
- Factory methods that create instances
- Constants and configuration values

---

## 5. Private Fields (ES2022)

Private fields use the `#` prefix and can only be accessed within the class.

```javascript
class BankAccount {
  // Private fields
  #balance = 0;
  #owner;

  constructor(owner, initialBalance) {
    this.#owner = owner;
    this.#balance = initialBalance;
  }

  // Public method to interact with private data
  deposit(amount) {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.#balance += amount;
    return this.#balance;
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
    return this.#balance;
  }

  get balance() {
    return this.#balance;
  }

  // Private method
  #logTransaction(type, amount) {
    console.log(`${type}: $${amount} by ${this.#owner}`);
  }
}

const account = new BankAccount("Alice", 1000);
account.deposit(500);
console.log(account.balance);  // 1500

// Cannot access private fields from outside
// console.log(account.#balance);  // SyntaxError
// account.#logTransaction();      // SyntaxError
```

---

## 6. Class Expressions

Classes can be defined as expressions, similar to function expressions.

```javascript
// Anonymous class expression
const Square = class {
  constructor(side) {
    this.side = side;
  }
  getArea() {
    return this.side ** 2;
  }
};

const sq = new Square(5);
console.log(sq.getArea()); // 25

// Named class expression (name is only available inside the class)
const MyClass = class NamedClass {
  getName() {
    return NamedClass.name; // "NamedClass"
  }
};
```

---

## 7. Inheritance with `extends` and `super()`

Inheritance allows a child class to reuse properties and methods from a parent class.

```javascript
// Parent class (superclass)
class Vehicle {
  constructor(make, model) {
    this.make = make;
    this.model = model;
  }

  getDetails() {
    return `Vehicle: ${this.make} ${this.model}`;
  }

  start() {
    return `${this.make} ${this.model} is starting...`;
  }
}

// Child class (subclass)
class Car extends Vehicle {
  constructor(make, model, doors) {
    super(make, model); // MUST call super() before using 'this'
    this.doors = doors; // Child-specific property
  }

  // Override parent method (completely replace)
  getDetails() {
    return `Car: ${this.make} ${this.model} with ${this.doors} doors`;
  }
}

const car = new Car("Honda", "Civic", 4);
console.log(car.getDetails()); // "Car: Honda Civic with 4 doors"
console.log(car.start());      // "Honda Civic is starting..." (inherited)
```

### Rules for `super()`

- **Must** call `super()` in the child constructor before using `this`
- `super()` calls the parent class's constructor
- `super.methodName()` calls a parent class method from within the child

---

## 8. Method Overriding

### Complete Override

The child class replaces the parent method entirely.

```javascript
class Car extends Vehicle {
  getDetails() {
    // Completely new implementation
    return `Car: ${this.make} ${this.model} with ${this.doors} doors`;
  }
}
```

### Extending with `super.method()`

The child class builds on the parent method.

```javascript
class Truck extends Vehicle {
  constructor(make, model, capacity) {
    super(make, model);
    this.capacity = capacity;
  }

  getDetails() {
    // Call parent's method and extend it
    const parentDetails = super.getDetails();
    return `${parentDetails}, Capacity: ${this.capacity} tons`;
  }
}

const truck = new Truck("Ford", "F-150", 2);
console.log(truck.getDetails());
// "Vehicle: Ford F-150, Capacity: 2 tons"
```

### No Override (Inherited As-Is)

If a child class does not define a method, it inherits the parent's version.

```javascript
class Motorcycle extends Vehicle {
  constructor(make, model) {
    super(make, model);
  }
  // No getDetails() here - uses Vehicle's getDetails()
}

const bike = new Motorcycle("Harley", "Davidson");
console.log(bike.getDetails()); // "Vehicle: Harley Davidson"
```

---

## 9. Polymorphism

The same method name behaves differently across different classes. This enables treating different objects uniformly.

```javascript
class Animal {
  speak() {
    return "Some sound";
  }
}

class Dog extends Animal {
  speak() {
    return "Woof!";
  }
}

class Cat extends Animal {
  speak() {
    return "Meow!";
  }
}

class Duck extends Animal {
  speak() {
    return "Quack!";
  }
}

// Polymorphism in action - same method, different behavior
const animals = [new Dog(), new Cat(), new Duck(), new Animal()];

animals.forEach(animal => {
  console.log(animal.speak());
});
// "Woof!"
// "Meow!"
// "Quack!"
// "Some sound"

// Works because they all share the same interface (speak method)
```

---

## 10. The `instanceof` Operator

Checks if an object is an instance of a class. Works through the entire inheritance chain.

```javascript
const car = new Car("Honda", "Civic", 4);

console.log(car instanceof Car);      // true
console.log(car instanceof Vehicle);  // true (parent class)
console.log(car instanceof Object);   // true (everything extends Object)
console.log(car instanceof Array);    // false

// Useful for conditional logic
function processVehicle(vehicle) {
  if (vehicle instanceof Car) {
    console.log(`Car with ${vehicle.doors} doors`);
  } else if (vehicle instanceof Truck) {
    console.log(`Truck with ${vehicle.capacity} ton capacity`);
  } else if (vehicle instanceof Vehicle) {
    console.log("Generic vehicle");
  }
}
```

---

## 11. Prototype Chain (Under the Hood)

Classes are syntactic sugar over JavaScript's prototype-based inheritance. Every class has a `.prototype` object that instances link to.

```javascript
class Animal {
  speak() { return "..."; }
}

class Dog extends Animal {
  bark() { return "Woof!"; }
}

const rex = new Dog();

// Prototype chain: rex → Dog.prototype → Animal.prototype → Object.prototype → null

// Methods are looked up through the chain:
rex.bark();     // Found on Dog.prototype
rex.speak();    // Not on Dog.prototype → found on Animal.prototype
rex.toString(); // Not on Dog/Animal → found on Object.prototype
rex.unknown();  // Not found anywhere → TypeError
```

```javascript
// Verify the chain
console.log(rex.__proto__ === Dog.prototype);            // true
console.log(Dog.prototype.__proto__ === Animal.prototype); // true
console.log(Animal.prototype.__proto__ === Object.prototype); // true
```

---

## 12. Complete Example

```javascript
class Shape {
  #color;

  constructor(color = "black") {
    this.#color = color;
  }

  get color() {
    return this.#color;
  }

  set color(newColor) {
    this.#color = newColor;
  }

  area() {
    throw new Error("area() must be implemented by subclass");
  }

  describe() {
    return `A ${this.#color} shape with area ${this.area().toFixed(2)}`;
  }

  static compare(shape1, shape2) {
    return shape1.area() - shape2.area();
  }
}

class Circle extends Shape {
  #radius;

  constructor(radius, color) {
    super(color);
    this.#radius = radius;
  }

  area() {
    return Math.PI * this.#radius ** 2;
  }

  describe() {
    return `${super.describe()} (Circle, radius: ${this.#radius})`;
  }
}

class Rectangle extends Shape {
  constructor(width, height, color) {
    super(color);
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}

const circle = new Circle(5, "red");
const rect = new Rectangle(4, 6, "blue");

console.log(circle.describe());
// "A red shape with area 78.54 (Circle, radius: 5)"

console.log(rect.describe());
// "A blue shape with area 24.00"

// Static method
console.log(Shape.compare(circle, rect) > 0 ? "Circle is larger" : "Rect is larger");
// "Circle is larger"

// Polymorphism
const shapes = [circle, rect];
shapes.forEach(s => console.log(`Area: ${s.area().toFixed(2)}`));
// "Area: 78.54"
// "Area: 24.00"

// instanceof
console.log(circle instanceof Circle);  // true
console.log(circle instanceof Shape);   // true
console.log(rect instanceof Circle);    // false
```

---

## 13. Summary

| Feature | Syntax | Purpose |
|---------|--------|---------|
| Class | `class Name {}` | Define a blueprint for objects |
| Constructor | `constructor()` | Initialize instance properties |
| Instance method | `method() {}` | Behavior shared by all instances |
| Getter | `get prop() {}` | Computed property access |
| Setter | `set prop(val) {}` | Controlled property assignment |
| Static | `static method() {}` | Class-level methods/properties |
| Private field | `#field` | Encapsulated data (ES2022) |
| Inheritance | `class Child extends Parent` | Code reuse via parent class |
| super() | `super()` / `super.method()` | Call parent constructor/methods |
| Override | Redefine method in child | Customize inherited behavior |
| Polymorphism | Same method, different classes | Uniform interface, varied behavior |
| instanceof | `obj instanceof Class` | Type checking through chain |
