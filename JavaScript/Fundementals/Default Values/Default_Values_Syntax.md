
# Default Values in JavaScript

Default values in JavaScript are used to provide a fallback when a value is not passed or is `undefined`. Default values are commonly used in functions, destructuring, and other contexts.

## 1. Default Parameters in Functions
You can set default values for function parameters.

### Syntax
```javascript
function funcName(param = defaultValue) {
    // Function body
}
```

### Example
```javascript
function greet(name = "Guest") {
    console.log(`Hello, ${name}!`);
}
greet("John"); // Output: Hello, John!
greet();       // Output: Hello, Guest!
```

## 2. Default Values in Destructuring

### a. Arrays
You can assign default values when destructuring arrays.
```javascript
let [a = 1, b = 2] = [undefined, 5];
console.log(a, b); // Output: 1 5
```

### b. Objects
Default values can also be set when destructuring objects.
```javascript
let { name = "Anonymous", age = 30 } = { age: 25 };
console.log(name, age); // Output: Anonymous 25
```

## 3. Default Values in Function Arguments with Destructuring
You can combine default function parameters with destructuring.

### Example
```javascript
function createUser({ name = "Guest", age = 18 } = {}) {
    console.log(`Name: ${name}, Age: ${age}`);
}
createUser({ name: "Alice" }); // Output: Name: Alice, Age: 18
createUser();                  // Output: Name: Guest, Age: 18
```

## 4. Logical OR (`||`) for Default Values
The `||` operator is often used to provide default values.

### Example
```javascript
let userName = null;
let defaultName = userName || "Guest";
console.log(defaultName); // Output: Guest
```

## 5. Nullish Coalescing (`??`) for Default Values
The `??` operator is used to assign default values when the value is `null` or `undefined` (but not `false` or `0`).

### Example
```javascript
let userRole = null;
let defaultRole = userRole ?? "User";
console.log(defaultRole); // Output: User
```

## 6. Default Values in Array Methods
Array methods like `.map()` can use default parameters for callback functions.

### Example
```javascript
let arr = [1, 2, 3];
arr.map((x = 0) => x * 2); // Output: [2, 4, 6]
```

## Summary
Default values in JavaScript improve code readability and provide fallback values to avoid errors. They can be used in functions, destructuring, logical operations, and more.
