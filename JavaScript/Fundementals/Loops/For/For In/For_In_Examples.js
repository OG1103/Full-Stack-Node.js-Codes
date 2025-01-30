
// Complex Examples of For...In Loop in JavaScript

// Example 1: Counting the number of properties in an object
let student = {
    name: "Emma",
    age: 21,
    major: "Computer Science"
};
let propertyCount = 0;
for (let key in student) {
    propertyCount++;
}
console.log("Number of properties in student object:", propertyCount);
// Output: Number of properties in student object: 3

// Example 2: Creating a copy of an object using for...in
let original = { a: 1, b: 2, c: 3 };
let copy = {};
for (let key in original) {
    copy[key] = original[key];
}
console.log("Copy of the object:", copy);
// Output: Copy of the object: { a: 1, b: 2, c: 3 }

// Example 3: Filtering inherited properties
let parentObject = { inheritedProp: "I am inherited" };
let childObject = Object.create(parentObject);
childObject.ownProp = "I am own property";

for (let key in childObject) {
    if (childObject.hasOwnProperty(key)) {
        console.log(key, "is an own property.");
    } else {
        console.log(key, "is an inherited property.");
    }
}
// Output:
// ownProp is an own property.
// inheritedProp is an inherited property.

// Example 4: Iterating over an array-like object
let arrayLike = { 0: "first", 1: "second", 2: "third", length: 3 };
for (let key in arrayLike) {
    console.log(`${key}: ${arrayLike[key]}`);
}
// Output:
// 0: first
// 1: second
// 2: third
// length: 3

// Example 5: Calculating the total from an object's values
let expenses = { rent: 1200, groceries: 300, transport: 150 };
let totalExpenses = 0;
for (let category in expenses) {
    totalExpenses += expenses[category];
}
console.log("Total expenses:", totalExpenses);
// Output: Total expenses: 1650
