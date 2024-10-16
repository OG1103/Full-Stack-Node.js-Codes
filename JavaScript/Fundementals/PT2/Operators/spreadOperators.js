// JavaScript Notes: Spread Operator (`...`)

// Overview:
// The spread operator (`...`) allows you to expand (or "spread") elements of an array or object into individual elements.
// It is commonly used to copy, merge, or combine arrays and objects in a concise manner.

// Spread Operator with Arrays

// 1. Copying an Array
// The spread operator can create a shallow copy of an array, which is helpful when you want to duplicate an array without modifying the original.

const originalArray = [1, 2, 3];
const copiedArray = [...originalArray];

console.log(copiedArray); // [1, 2, 3]

// Modifying the copied array does not affect the original array
copiedArray.push(4);
console.log(copiedArray); // [1, 2, 3, 4]
console.log(originalArray); // [1, 2, 3] (remains unchanged)

// 2. Merging Arrays
// The spread operator allows you to easily combine two or more arrays into one.

const array1 = [1, 2, 3];
const array2 = [4, 5, 6];
const mergedArray = [...array1, ...array2];

console.log(mergedArray); // [1, 2, 3, 4, 5, 6]

// You can also add extra elements during the merge.
const combinedArray = [0, ...array1, 7, 8];
console.log(combinedArray); // [0, 1, 2, 3, 7, 8]

// 3. Using the Spread Operator in Function Arguments
// The spread operator can also be used to pass an array of values as arguments to a function.

function sum(x, y, z) {
  return x + y + z;
}

const numbers = [1, 2, 3];
console.log(sum(...numbers)); // 6

// Spread Operator with Objects

// 1. Copying an Object
// Similar to arrays, the spread operator can copy an object. This is a shallow copy, so only the top-level properties are copied.

const originalObject = { name: "John", age: 30 };
const copiedObject = { ...originalObject };

console.log(copiedObject); // { name: 'John', age: 30 }

// Modifying the copied object does not affect the original object
copiedObject.age = 31;
console.log(copiedObject); // { name: 'John', age: 31 }
console.log(originalObject); // { name: 'John', age: 30 } (remains unchanged)

// 2. Merging Objects
// You can merge multiple objects into one using the spread operator.

const obj1 = { name: "Alice" };
const obj2 = { age: 25 };
const mergedObject = { ...obj1, ...obj2 };

console.log(mergedObject); // { name: 'Alice', age: 25 }

// When properties have the same key, the later object in the spread will overwrite the earlier one.
const obj3 = { name: "Bob" };
const mergedWithConflict = { ...obj1, ...obj3 };

console.log(mergedWithConflict); // { name: 'Bob' } (name is overwritten)

// 3. Adding or Updating Properties in an Object
// You can use the spread operator to add or update properties in an object without modifying the original.

const user = { name: "John", age: 30 };
const updatedUser = { ...user, age: 31, city: "New York" };

console.log(updatedUser); // { name: 'John', age: 31, city: 'New York' }
console.log(user); // { name: 'John', age: 30 } (remains unchanged)

// 4. Spread Operator with Nested Objects (Shallow Copy)
// The spread operator creates a shallow copy, which means it only copies the top-level properties.
// If an object contains nested objects, those will still reference the original object.

const nestedObject = { name: "John", address: { city: "New York", zip: 10001 } };
const copiedNestedObject = { ...nestedObject };

copiedNestedObject.address.city = "Los Angeles";
console.log(copiedNestedObject.address.city); // 'Los Angeles'
console.log(nestedObject.address.city); // 'Los Angeles' (both are affected because the copy is shallow)

// To perform a deep copy of an object (including nested objects), you can use other methods like `JSON.parse(JSON.stringify(object))` or libraries like `lodash`.
