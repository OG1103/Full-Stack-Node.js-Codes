
// Objects: Pass By Reference
const user = { name: "John", age: 30 };
const copy = user; // References the same object
copy.age = 31;
console.log(user); // Output: { name: 'John', age: 31 }

// Shallow Copy with Object.assign
const shallowCopy = Object.assign({}, user);
shallowCopy.name = "Alice";
console.log(user); // Output: { name: 'John', age: 31 }
console.log(shallowCopy); // Output: { name: 'Alice', age: 31 }

// Shallow Copy with Spread Operator
const anotherCopy = { ...user };
anotherCopy.age = 25;
console.log(user); // Output: { name: 'John', age: 31 }
console.log(anotherCopy); // Output: { name: 'John', age: 25 }

// Arrays: Pass By Reference
const numbers = [1, 2, 3];
const newNumbers = numbers; // References the same array
newNumbers.push(4);
console.log(numbers); // Output: [1, 2, 3, 4]

// Shallow Copy of Array
const copyOfNumbers = [...numbers];
copyOfNumbers.push(5);
console.log(numbers); // Output: [1, 2, 3, 4]
console.log(copyOfNumbers); // Output: [1, 2, 3, 4, 5]

// Deep Copy: Nested Objects
const nestedObject = { name: "John", address: { city: "New York" } };
const shallowCopyOfNested = { ...nestedObject };
shallowCopyOfNested.address.city = "Los Angeles";
console.log(nestedObject.address.city); // Output: "Los Angeles"

// Deep Copy with JSON.stringify & JSON.parse
const deepCopy = JSON.parse(JSON.stringify(nestedObject));
deepCopy.address.city = "San Francisco";
console.log(nestedObject.address.city); // Output: "Los Angeles"
console.log(deepCopy.address.city); // Output: "San Francisco"

// JSON.stringify and JSON.parse Explained
const jsonString = JSON.stringify(nestedObject);
console.log(jsonString); // Output: '{"name":"John","address":{"city":"New York"}}'
const deepCopyFromJson = JSON.parse(jsonString);
console.log(deepCopyFromJson); // Output: { name: 'John', address: { city: 'New York' } }
