"use strict";
let Student = {
    name: "Alice",
    age: 22,
    isStudent: true,
};
let car1 = { make: "Toyota", model: "Corolla" };
let car2 = { make: "Ford", model: "Mustang", year: 2020 };
let user = { id: 1, name: "John" };
class Dog {
    constructor(name) {
        this.name = name;
    }
    speak() {
        console.log(`${this.name} barks.`);
    }
}
let dog = new Dog("Buddy");
dog.speak();
const addNumberss = (a, b) => a + b;
console.log(addNumberss(5, 10));
let myDog = {
    species: "Canine",
    breed: "Labrador",
    name: "Buddy",
    speak() {
        console.log(`${this.name} barks!`);
    },
};
myDog.speak();
class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    area() {
        return this.width * this.height;
    }
}
let rect = new Rectangle(10, 20);
console.log(rect.area());
