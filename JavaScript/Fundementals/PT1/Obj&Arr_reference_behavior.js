
// JavaScript Reference Behavior: Arrays and Objects
// =================================================

// In JavaScript, objects and arrays are passed by reference, not by value.
// This means that when you assign an array or an object to another variable, 
// you are pointing to the same memory location, NOT creating a new independent copy.

// --- Objects Example ---
// Let's say we have an object 'user' defined below:

const user = { name: 'John', age: 30 };

// Now, if we assign 'user' to another variable 'copy', like this:
const copy = user;

// Both 'user' and 'copy' reference the SAME object in memory.
// Any changes made to 'copy' will affect 'user' as well because they point to the same object.

copy.age = 31; // We change the 'age' property in 'copy'.

console.log(user); // Output: { name: 'John', age: 31 }
// Notice that the 'user' object is also modified, even though we only changed 'copy'.
// This happens because both 'copy' and 'user' are just references to the same object.

// --- How to create a true copy (shallow copy) of an object ---
// If you want to make a copy that does NOT affect the original object, you need to explicitly create a new object.

// Option 1: Using Object.assign()
const shallowCopy = Object.assign({}, user);
shallowCopy.age = 25;
console.log(user); // Output: { name: 'John', age: 31 } (unchanged)
console.log(shallowCopy); // Output: { name: 'John', age: 25 }

// Option 2: Using the spread operator (...)
const anotherCopy = { ...user };
anotherCopy.name = 'Alice';
console.log(user); // Output: { name: 'John', age: 31 } (unchanged)
console.log(anotherCopy); // Output: { name: 'Alice', age: 31 }

// --- Arrays Example ---
// The same behavior applies to arrays in JavaScript.

const numbers = [1, 2, 3];

// If we assign 'numbers' to 'newNumbers', we are NOT creating a new array.
// 'newNumbers' will reference the same array as 'numbers'.
const newNumbers = numbers;

newNumbers.push(4); // Adding an element to 'newNumbers'.
console.log(numbers); // Output: [1, 2, 3, 4]
// The 'numbers' array is also modified because 'newNumbers' points to the same array.

// --- How to create a shallow copy of an array ---
// To avoid this, you can create a shallow copy using the spread operator.

const copyOfNumbers = [...numbers];
copyOfNumbers.push(5);
console.log(numbers); // Output: [1, 2, 3, 4] (unchanged)
console.log(copyOfNumbers); // Output: [1, 2, 3, 4, 5]

// --- Deep Copy ---
// A shallow copy only copies one level deep. If your object or array has nested objects or arrays,
// you will need to create a deep copy to avoid reference issues.

const nestedObject = { name: 'John', address: { city: 'New York' } };
const shallowCopyOfNested = { ...nestedObject };
shallowCopyOfNested.address.city = 'Los Angeles';
console.log(nestedObject.address.city); // Output: 'Los Angeles' (nested object is still referenced)

// For a deep copy, you can use JSON.stringify() and JSON.parse(), but this only works for simple objects.

const deepCopy = JSON.parse(JSON.stringify(nestedObject));
deepCopy.address.city = 'San Francisco';
console.log(nestedObject.address.city); // Output: 'Los Angeles' (unchanged)
console.log(deepCopy.address.city); // Output: 'San Francisco'

// Summary:
// - Objects and arrays are assigned by reference in JavaScript.
// - Changes to a reference affect the original object/array unless you create a true copy.
// - Use Object.assign() or the spread operator for shallow copies.
// - Use JSON.stringify() and JSON.parse() for deep copies in simple cases.

// 1. JSON.stringify(nestedObject):
    // Purpose: This function converts a JavaScript object into a JSON string (a string representation of the object in JSON format).
    // What Happens: It takes the nestedObject (which might have properties that include other objects or arrays) and transforms the entire object into a string.
    const jsonString = JSON.stringify(nestedObject);
    console.log(jsonString); 
    //// Output: '{"name":"John","address":{"city":"New York"}}' this is a string 
    // This is the JSON string representation of the object.
// 2. JSON.parse(jsonString):
    //Purpose: This function takes a JSON string (like the one produced by JSON.stringify) and converts it back into a JavaScript object.
    // What Happens: It parses the JSON string and recreates the object, producing a new, separate object with no reference to the original one.
    const deepCopy = JSON.parse(jsonString); 
    console.log(deepCopy); 
    // Output: { name: 'John', address: { city: 'New York' } }
    // A brand-new object is created, independent of the original nestedObject. Therefore creating a deep copy