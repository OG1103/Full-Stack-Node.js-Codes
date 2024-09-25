const person = {
  name: "Alice",
  age: 25,
  city: "New York",
};

// Destructuring assignment
const { name, age } = person;

console.log(name); // Output: Alice
console.log(age); // Output: 25

// In this example, name and age are extracted from the person object and assigned to variables with the same names.
// when you pass {name, age} into a function, it is essentially like passing an object to the function. This pattern is known as object destructuring in function parameters.
//Function with Destructured Parameters:
function greet({ name, age }) {
  console.log(`Hello, my name is ${name} and I am ${age} years old.`);
}

// Passing the 'person' object
greet(person);

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
const numbers = [1, 2, 3, 4];

// Destructuring assignment
const [first, second] = numbers;

console.log(first); // Output: 1
console.log(second); // Output: 2
//Here, the variables first and second are assigned the first and second elements of the numbers array.

const [a, , c] = numbers;

console.log(a); // Output: 1
console.log(c); // Output: 3
//In this case, the second element is skipped, and c is assigned the value 3.

//You can use the rest operator (...) to capture the remaining elements of the array into a new array.
const [b, ...rest] = numbers;

console.log(b); // Output: 1
console.log(rest); // Output: [2, 3, 4]
//The variable rest contains an array of the remaining elements after the first one.

//----------------------------------------------------------------------------------------------------------------------------------------------------

// Destructuring Nested Objects
const user = {
  namee: "Bob",
  address: {
    city: "San Francisco",
    state: "CA",
  },
};

// Destructuring nested properties
const {
  namee,
  address: { city, state },
} = user;

console.log(city); // Output: San Francisco
console.log(state); // Output: CA
