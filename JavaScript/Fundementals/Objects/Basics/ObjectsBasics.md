
# JavaScript Objects Basics

Objects in JavaScript are fundamental building blocks used to store collections of key-value pairs. They can contain data (properties) and operations (methods).

---

## 1. What Are Objects?
- An object is a collection of **key-value pairs**, where the keys are strings (or Symbols) and the values can be of any data type (numbers, strings, arrays, objects, functions, etc.).
- Objects are created using:
  - **Object literal syntax**: `{ key: value, key: value, ... }`
  - **Object constructor**: `new Object()`

---

## 2. Creating Objects

### Using Object Literal Syntax:
```javascript
let person = {
  name: "John Doe",
  age: 30,
  isDeveloper: true,
  greet: function () {
    console.log("Hello, my name is " + this.name);
  },
  introduce() {
    console.log("I am " + this.age + " years old.");
  },
};
```

### Using the Object Constructor:
```javascript
let car = new Object();
car.brand = "Toyota";
car.model = "Corolla";
car.year = 2021;
car.start = function () {
  console.log("The car has started.");
};
```

---

## 3. Accessing and Modifying Object Properties

### Accessing Properties:
- **Dot Notation**: `object.propertyName`
- **Bracket Notation**: `object["propertyName"]`

### Examples:
```javascript
console.log(person.name); // Output: "John Doe"
console.log(person["age"]); // Output: 30
```

### Modifying Properties:
```javascript
person.age = 31;
car["year"] = 2022;
console.log(person.age); // Output: 31
console.log(car.year); // Output: 2022
```

---

## 4. Adding and Deleting Properties

### Adding Properties:
```javascript
person.job = "Software Developer";
car.color = "Red";
console.log(person.job); // Output: "Software Developer"
```

### Deleting Properties:
```javascript
delete person.isDeveloper;
console.log(person.isDeveloper); // Output: undefined
```

---

## 5. Nested Objects
Objects can contain other objects as properties.
```javascript
let employee = {
  name: "Alice",
  position: "Manager",
  contact: {
    email: "alice@example.com",
    phone: "123-456-7890",
  },
};
console.log(employee.contact.email); // Output: "alice@example.com"
```

---

## 6. Object Methods and `this`

- **Methods**: Functions defined inside objects.
- The `this` keyword refers to the object calling the method.

### Example:
```javascript
person.greet(); // Output: "Hello, my name is John Doe"
```

---

## 7. Object Destructuring
Destructuring simplifies extracting values from objects.

### Example:
```javascript
let { name, age } = person;
console.log(name); // Output: "John Doe"
console.log(age); // Output: 30
```

---

## 8. Functions in Objects (Methods)
- Functions within objects are called methods.
- Inside a method, `this` refers to the current object.

### Example:
```javascript
let book = {
  title: "JavaScript Essentials",
  author: "Jane Smith",
  getSummary: function () {
    return `${this.title} by ${this.author}`;
  },
};
console.log(book.getSummary()); // Output: "JavaScript Essentials by Jane Smith"
```

---

## 9. Using Objects as Classes
Objects can act as blueprints for creating reusable structures.

### Example:
```javascript
let dog = {
  name: "Buddy",
  breed: "Golden Retriever",
  speak: function () {
    console.log(`${this.name} says woof!`);
  },
};
dog.speak(); // Output: "Buddy says woof!"
```

---

## 10. Arrow Functions and `this`
Arrow functions do not bind their own `this`; they inherit it from their enclosing scope.

### Example (Incorrect):
```javascript
let animal = {
  species: "Cat",
  sound: "Meow",
  makeSound: () => {
    console.log(`${this.species} makes ${this.sound}`);
  },
};
animal.makeSound(); // Output: "undefined makes undefined"
```

### Correct Use:
```javascript
let animalCorrect = {
  species: "Cat",
  sound: "Meow",
  makeSound: function () {
    console.log(`${this.species} makes ${this.sound}`);
  },
};
animalCorrect.makeSound(); // Output: "Cat makes Meow"
```

---

## Summary
- Objects store data and methods in key-value pairs.
- Use **dot notation** or **bracket notation** to access or modify properties.
- Methods allow objects to perform operations using `this`.
- Arrow functions inside objects require caution when using `this`.

---

## Example Table View of Object:
```javascript
console.table(person);
// Outputs the object as a table in the console.
```
