// restaurant-classes.ts

// A basic class in TypeScript
class Restaurant {
  // Properties of the class (also called fields or attributes)
  private name: string; // 'private' keyword restricts access to this property within the class
  private location: string;
  protected capacity: number; // 'protected' allows access in derived (child) classes

  // Constructor to initialize the properties
  constructor(name: string, location: string, capacity: number) {
    this.name = name;
    this.location = location;
    this.capacity = capacity;
  }

  // A public method that returns the restaurant's full description
  public getDetails(): string {
    return `${this.name} located at ${this.location}, Capacity: ${this.capacity}`;
  }

  // Another public method that checks if the restaurant is full
  public isFull(currentGuests: number): boolean {
    return currentGuests >= this.capacity;
  }
}

// Creating an instance (object) of the Restaurant class
const restaurant1 = new Restaurant("Sunset Grill", "Downtown", 50);
console.log(restaurant1.getDetails()); // Output: Sunset Grill located at Downtown, Capacity: 50
console.log(restaurant1.isFull(60)); // Output: true

// Inheritance in TypeScript (Extending a class)
class FastFoodRestaurant extends Restaurant {
  // Additional property for FastFoodRestaurant class
  private driveThrough: boolean;

  // Constructor for the derived class
  constructor(name: string, location: string, capacity: number, driveThrough: boolean) {
    // Call the parent class (Restaurant) constructor using 'super'
    super(name, location, capacity);
    this.driveThrough = driveThrough;
  }

  // Method to return fast food restaurant details
  public getRestaurantDetails(): string {
    return `Fast Food Restaurant: ${this.getDetails()}, Drive-Through: ${this.driveThrough}`;
  }
}

// Creating an instance of the FastFoodRestaurant class
const fastFood1 = new FastFoodRestaurant("Burger Palace", "Suburbs", 100, true);
console.log(fastFood1.getRestaurantDetails());
// Output: Fast Food Restaurant: Burger Palace located at Suburbs, Capacity: 100, Drive-Through: true

// Access Modifiers
// Public: Accessible from anywhere.
// Protected: Accessible within the class and its subclasses.
// Private: Accessible only within the class where it is declared.

// Getter and Setter Example with Menu Item
class MenuItem {
  private _price: number;

  constructor(price: number) {
    this._price = price;
  }

  // Getter method for price
  public get price(): number {
    return this._price;
  }

  // Setter method for price with validation
  public set price(value: number) {
    if (value < 0) {
      throw new Error("Price cannot be negative");
    }
    this._price = value;
  }
}

const menuItem = new MenuItem(10);
console.log(menuItem.price); // Output: 10
menuItem.price = 15; // Setting a new price using the setter
console.log(menuItem.price); // Output: 15

// Abstract Classes Example with Chef
abstract class Chef {
  abstract cookSpecialDish(): void; // Abstract method, no implementation here

  public prepareOrder(): void {
    console.log("Preparing the order...");
  }
}

// Class inheriting from an abstract class
class ItalianChef extends Chef {
  // Must implement the abstract method
  public cookSpecialDish(): void {
    console.log("Cooking pasta with a secret sauce!");
  }
}

const chef = new ItalianChef();
chef.cookSpecialDish(); // Output: Cooking pasta with a secret sauce!
chef.prepareOrder(); // Output: Preparing the order...
