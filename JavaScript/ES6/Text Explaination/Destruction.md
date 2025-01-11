# Destructuring in JavaScript (ES6)

## Introduction
**Destructuring** in **ES6 (ECMAScript 6)** allows you to extract values from arrays or properties from objects and assign them to variables in a clean and concise way. This reduces the need for verbose code and makes variable assignments more readable.

---

## 1. Destructuring with Objects

### Basic Syntax
- When destructuring an object, you can extract specific properties and assign them to variables with the **same names** as the object keys.

#### Example:
```javascript
const person = {
    name: "John",
    age: 30,
    city: "New York"
};

const { name, age } = person;
console.log(name);  // Output: John
console.log(age);   // Output: 30
```
- **Explanation**:
  - The key `name` from the `person` object is destructured into the `name` variable.
  - The key `age` from the `person` object is destructured into the `age` variable.

### Function with Destructured Parameters
- You can pass an object directly as a parameter and destructure it inside the function.

#### Example:
```javascript
function greet({ name, age }) {
    console.log(`Hello, my name is ${name} and I am ${age} years old.`);
}

const person = {
    name: "John",
    age: 30
};

greet(person);  // Output: Hello, my name is John and I am 30 years old.
```
- **Explanation**:
  - The function automatically extracts the `name` and `age` properties from the object passed as an argument.

### Assigning Properties to Variables with Different Names
- You can assign properties to variables with different names by specifying new names in the destructuring syntax.

#### Example:
```javascript
const person = {
    name: "John",
    age: 30
};

const { name: fullName, age: years } = person;
console.log(fullName);  // Output: John
console.log(years);     // Output: 30
```

### Default Values in Object Destructuring
- You can assign default values to variables if the property doesn’t exist in the object.

#### Example:
```javascript
const person = {
    name: "John"
};

const { name, city = "Unknown" } = person;
console.log(name);  // Output: John
console.log(city);  // Output: Unknown
```

### Nested Object Destructuring
- You can also destructure nested objects.

#### Example:
```javascript
const person = {
    name: "John",
    age: 30,
    details: {
        occupation: "Engineer",
        city: "New York"
    }
};

const { name, details: { occupation, city } } = person;
console.log(name);       // Output: John
console.log(occupation); // Output: Engineer
console.log(city);       // Output: New York
```

### Passing Destructured Objects to Functions
- You can destructure an object into variables and pass them to a function.

#### Example:
```javascript
const person = {
    name: "John",
    age: 30,
    details: {
        occupation: "Engineer",
        city: "New York"
    }
};

const { name, age, details } = person;
greet({ name, age, details });

// Equivalent to:
greet({ name: "John", age: 30, details: { occupation: "Engineer", city: "New York" } });
```

---

## 2. Destructuring with Arrays

### Basic Syntax
- Array destructuring allows you to extract values from arrays based on their **position**.

#### Example:
```javascript
const numbers = [1, 2, 3];
const [first, second] = numbers;
console.log(first);  // Output: 1
console.log(second); // Output: 2
```

### Skipping Elements
- You can skip elements in an array by leaving the space between commas empty.

#### Example:
```javascript
const numbers = [1, 2, 3, 4];
const [first, , third] = numbers;
console.log(first);  // Output: 1
console.log(third);  // Output: 3
```

### Using the Rest Operator
- You can use the **rest operator (`...`)** to capture the remaining elements of the array into a new array.

#### Example:
```javascript
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log(first);  // Output: 1
console.log(second); // Output: 2
console.log(rest);   // Output: [3, 4, 5]
```

---

## Summary
- **Destructuring** is a powerful feature in ES6 that simplifies extracting values from arrays and objects.
- It improves code readability and reduces the need for repetitive assignments.
- You can assign default values, rename variables, and handle nested structures with destructuring.
- Destructuring can be used in function parameters, making it easier to handle complex objects.

---

## References
- [MDN Web Docs - Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
