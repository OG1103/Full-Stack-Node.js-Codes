
// Complex Examples of Spread Operator in JavaScript

// Example 1: Combining arrays with unique elements
let array1 = [1, 2, 3];
let array2 = [3, 4, 5];

let combined = [...new Set([...array1, ...array2])];
console.log("Combined unique elements:", combined);
// Output: Combined unique elements: [1, 2, 3, 4, 5]

// Example 2: Deep merging nested objects (manual with spread operator)
let user = {
    name: "Alice",
    address: { city: "Wonderland", zip: "12345" }
};
let updates = {
    address: { zip: "67890" },
    age: 25
};

let mergedUser = {
    ...user,
    address: { ...user.address, ...updates.address },
    age: updates.age
};
console.log("Merged User:", mergedUser);
// Output: Merged User: { name: "Alice", address: { city: "Wonderland", zip: "67890" }, age: 25 }

// Example 3: Splitting strings into characters and recombining
let greeting = "Spread";
let characters = [...greeting];
let reversed = [...greeting].reverse().join("");
console.log("Characters:", characters); // Output: Characters: ['S', 'p', 'r', 'e', 'a', 'd']
console.log("Reversed:", reversed);    // Output: Reversed: daerpS

// Example 4: Removing duplicates from an array
let duplicates = [1, 2, 2, 3, 4, 4, 5];
let unique = [...new Set(duplicates)];
console.log("Unique elements:", unique);
// Output: Unique elements: [1, 2, 3, 4, 5]

// Example 5: Adding new properties to an object
let car = { brand: "Toyota", model: "Corolla" };
let updatedCar = { ...car, year: 2022, color: "Blue" };
console.log("Updated Car:", updatedCar);
// Output: Updated Car: { brand: "Toyota", model: "Corolla", year: 2022, color: "Blue" }

// Example 6: Cloning and modifying nested arrays
let matrix = [
    [1, 2, 3],
    [4, 5, 6]
];
let clonedMatrix = matrix.map(row => [...row]);
clonedMatrix[0][0] = 99;
console.log("Original Matrix:", matrix); // Unchanged original matrix
console.log("Cloned Matrix:", clonedMatrix);
// Output:
// Original Matrix: [[1, 2, 3], [4, 5, 6]]
// Cloned Matrix: [[99, 2, 3], [4, 5, 6]]
