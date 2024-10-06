"use strict";
class Restaurant {
    constructor(name, location, capacity) {
        this.name = name;
        this.location = location;
        this.capacity = capacity;
    }
    getDetails() {
        return `${this.name} located at ${this.location}, Capacity: ${this.capacity}`;
    }
    isFull(currentGuests) {
        return currentGuests >= this.capacity;
    }
}
const restaurant1 = new Restaurant("Sunset Grill", "Downtown", 50);
console.log(restaurant1.getDetails());
console.log(restaurant1.isFull(60));
class FastFoodRestaurant extends Restaurant {
    constructor(name, location, capacity, driveThrough) {
        super(name, location, capacity);
        this.driveThrough = driveThrough;
    }
    getRestaurantDetails() {
        return `Fast Food Restaurant: ${this.getDetails()}, Drive-Through: ${this.driveThrough}`;
    }
}
const fastFood1 = new FastFoodRestaurant("Burger Palace", "Suburbs", 100, true);
console.log(fastFood1.getRestaurantDetails());
class MenuItem {
    constructor(price) {
        this._price = price;
    }
    get price() {
        return this._price;
    }
    set price(value) {
        if (value < 0) {
            throw new Error("Price cannot be negative");
        }
        this._price = value;
    }
}
const menuItem = new MenuItem(10);
console.log(menuItem.price);
menuItem.price = 15;
console.log(menuItem.price);
class Chef {
    prepareOrder() {
        console.log("Preparing the order...");
    }
}
class ItalianChef extends Chef {
    cookSpecialDish() {
        console.log("Cooking pasta with a secret sauce!");
    }
}
const chef = new ItalianChef();
chef.cookSpecialDish();
chef.prepareOrder();
