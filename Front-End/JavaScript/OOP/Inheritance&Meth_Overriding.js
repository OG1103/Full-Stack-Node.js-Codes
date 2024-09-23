/**
 * JavaScript Classes - Inheritance, Method Overriding, and Polymorphism
 * ---------------------------------------------------------------------
 * Inheritance allows a class to inherit properties and methods from another class.
 * Method overriding lets a subclass provide a specific implementation for a method already defined in its parent class.
 * Polymorphism allows the same method to behave differently on different objects, typically through inheritance and overriding.
 *
 * Key concepts covered:
 * - Inheritance with `extends`
 * - Calling the parent class constructor using `super()`
 * - Method Overriding
 * - Polymorphism
 * - Calling parent class methods from the subclass
 */

/**
 * 1. Basic Inheritance with `extends` and `super()`
 * -------------------------------------------------
 * The `extends` keyword is used to create a subclass (child class) that inherits from a superclass (parent class).
 * The `super()` function is used in the subclass's constructor to call the parent class's constructor.
 */

class Vehicle {
  constructor(make, model) {
    this.make = make; // Vehicle make
    this.model = model; // Vehicle model
  }

  // Instance method
  getDetails() {
    return `Vehicle: ${this.make} ${this.model}`;
  }
}

// Subclass inheriting from Vehicle
class Car extends Vehicle {
  constructor(make, model, doors) {
    // Call the parent class constructor using super()
    super(make, model);
    this.doors = doors; // Additional property specific to Car
  }

  // Override the parent method
  getDetails() {
    return `Car: ${this.make} ${this.model} with ${this.doors} doors`;
  }
}

const myCar = new Car("Honda", "Civic", 4);
console.log(myCar.getDetails()); // Output: Car: Honda Civic with 4 doors

/**
 * Explanation:
 * - The `Car` class extends the `Vehicle` class, inheriting its properties (`make` and `model`).
 * - `super(make, model)` is used to call the parent class's constructor and initialize `make` and `model`.
 * - The `Car` class adds its own property (`doors`) and overrides the `getDetails()` method to include additional information.
 */

/**
 * 2. Method Overriding with `super()` to Call Parent Methods
 * -----------------------------------------------------------
 * Subclasses can override methods defined in their parent class by redefining the method.
 * In some cases, a subclass might want to call the parent class's method while still overriding it.
 * This is done using `super.methodName()`.
 */

class Truck extends Vehicle {
  constructor(make, model, capacity) {
    super(make, model); // Call parent constructor
    this.capacity = capacity; // Truck-specific property
  }

  // Overriding the getDetails method
  getDetails() {
    // Call the parent class's getDetails method using super
    const parentDetails = super.getDetails(); // This will return `Vehicle: make model`
    return `${parentDetails}, Capacity: ${this.capacity} tons`; // Adding additional Truck-specific details
  }
}

const myTruck = new Truck("Ford", "F-150", 2);
console.log(myTruck.getDetails());
// Output: Vehicle: Ford F-150, Capacity: 2 tons

/**
 * Explanation:
 * - The `Truck` class overrides the `getDetails()` method, but it also calls the parent `Vehicle` class's `getDetails()` method using `super.getDetails()`.
 * - This allows the `Truck` class to extend the functionality of `getDetails()` by adding truck-specific details while still using part of the logic from the parent class.
 * - This is an example of how method overriding can work together with the parent class's methods.
 */

/**
 * 3. Behavior When a Method Is Not Overridden
 * -------------------------------------------
 * If a subclass does not override a method from its parent class, the method will be inherited automatically.
 * This means that when you call the method on an instance of the subclass, the version of the method from the parent class (superclass) will be executed.
 *
 * In this case, if the `Truck` class did not override the `getDetails()` method, it would automatically use the `getDetails()` method
 * defined in the `Vehicle` class.
 */

// Parent class Vehicle
class Vehicle {
  constructor(make, model) {
    this.make = make;
    this.model = model;
  }

  // Parent class method
  getDetails() {
    return `Vehicle: ${this.make} ${this.model}`;
  }
}

// Subclass Truck, without overriding getDetails
class Truck extends Vehicle {
  constructor(make, model, capacity) {
    super(make, model); // Call parent constructor
    this.capacity = capacity; // Truck-specific property
  }

  // No getDetails method in this class (inherited from Vehicle)
}

const myTruck1 = new Truck("Ford", "F-150", 2);
console.log(myTruck1.getDetails());
// Output: Vehicle: Ford F-150

/**
 * Explanation:
 * - The `Truck` class inherits from `Vehicle` but does NOT override the `getDetails()` method.
 * - When `myTruck.getDetails()` is called, JavaScript does not find the `getDetails()` method in the `Truck` class.
 * - JavaScript looks up the prototype chain and finds `getDetails()` in the `Vehicle` class, and it calls that method.
 * - Therefore, the result is `Vehicle: Ford F-150`, which is the output of the `Vehicle` class's `getDetails()` method.
 *
 * Key Points:
 * -----------
 * - Inheritance automatically gives access to all non-private methods in the parent class.
 * - If a method is not overridden in the subclass, the method from the parent class will be used.
 * - JavaScript checks for the method in the subclass first. If not found, it checks the superclass.
 * - This behavior ensures that even without method overriding, the subclass still has functionality from the parent class.
 */

/**
 * 4. Polymorphism
 * ---------------
 * Polymorphism allows different classes to define the same method and provide their own implementation.
 * You can call the same method on objects of different classes, and the method will behave according to the object's class.
 */

const vehicles = [
  new Car("Honda", "Civic", 4),
  new Truck("Ford", "F-150", 2),
  new Vehicle("Tesla", "Model 3"),
];

vehicles.forEach((vehicle) => {
  console.log(vehicle.getDetails());
});

// Output:
// Car: Honda Civic with 4 doors
// Vehicle: Ford F-150, Capacity: 2 tons
// Vehicle: Tesla Model 3

/**
 * Explanation:
 * - Although all objects are of different classes (`Car`, `Truck`, and `Vehicle`), they all have a `getDetails()` method.
 * - This is an example of polymorphism: the same method (`getDetails`) is called on different types of objects, but each object provides its own specific implementation of that method.
 * - The behavior of `getDetails()` changes depending on whether it's called on a `Car`, `Truck`, or `Vehicle` object.
 */

/**
 * 5. Calling Parent Class Methods from Overridden Methods
 * -------------------------------------------------------
 * The `super.methodName()` can be used to call a method from the parent class within an overridden method in the child class.
 */

class SUV extends Vehicle {
  constructor(make, model, offRoad) {
    super(make, model); // Call the parent constructor
    this.offRoad = offRoad; // SUV-specific property
  }

  // Overriding getDetails but also calling parent method
  getDetails() {
    const parentDetails = super.getDetails(); // Call Vehicle's getDetails
    return `${parentDetails}, Off-road Capable: ${this.offRoad}`;
  }
}

const mySUV = new SUV("Jeep", "Wrangler", true);
console.log(mySUV.getDetails());
// Output: Vehicle: Jeep Wrangler, Off-road Capable: true

/**
 * Explanation:
 * - The `SUV` class overrides the `getDetails()` method to add off-road capabilities, but it still calls the parent class's `getDetails()` using `super.getDetails()`.
 * - This technique allows the child class to extend the functionality of the parent method while still using parts of the parent class logic.
 */

/**
 * 6. Superclass and Subclass Method Differences
 * ---------------------------------------------
 * It is important to understand that methods defined in the parent class can be overridden in the subclass,
 * but they can still be accessed using `super`. This allows you to decide whether or not to completely
 * override a method or extend it.
 *
 * Example:
 * - In some cases, you might want to completely override a method (as done in `Car`).
 * - In other cases, you might want to partially override the method but still use the parent method (as done in `Truck` and `SUV`).
 */

/**
 * Summary:
 * ---------
 * - **Inheritance** allows a class to inherit properties and methods from another class using `extends`.
 * - **Method overriding** allows a subclass to provide its own implementation for a method defined in the parent class.
 * - **Polymorphism** enables different classes to define the same method with different behaviors.
 * - The `super()` function is used to call the parent class's constructor or methods within the subclass.
 * - Polymorphism makes code more flexible and reusable, as the same method call can work differently depending on the object.
 */
