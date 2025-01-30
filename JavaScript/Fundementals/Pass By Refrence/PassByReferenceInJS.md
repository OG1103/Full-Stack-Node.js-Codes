
# Pass By Reference in JavaScript

In JavaScript, **objects** and **arrays** are passed by reference, not by value. This means that when you assign an object or array to another variable, you are copying the reference to the same memory location, not creating an independent copy. Any changes to the new variable will reflect in the original.

---

## 1. Objects and Pass By Reference

### Example: Reference Behavior
```javascript
const user = { name: "John", age: 30 };
const copy = user; // 'copy' references the same object as 'user'

copy.age = 31; // Modifying the 'copy' object
console.log(user); // Output: { name: "John", age: 31 }
```

- **Why?** Both `user` and `copy` point to the same memory location.

---

## 2. Creating a Shallow Copy of an Object

### Using `Object.assign()`
```javascript
const user = { name: "John", age: 30 };
const shallowCopy = Object.assign({}, user); // Creates a shallow copy
shallowCopy.age = 25;
console.log(user); // Output: { name: "John", age: 30 } (unchanged)
console.log(shallowCopy); // Output: { name: "John", age: 25 }
```

### Using the Spread Operator
```javascript
const user = { name: "John", age: 30 };
const anotherCopy = { ...user }; // Creates a shallow copy
anotherCopy.name = "Alice";
console.log(user); // Output: { name: "John", age: 30 } (unchanged)
console.log(anotherCopy); // Output: { name: "Alice", age: 30 }
```

---

## 3. Arrays and Pass By Reference

### Example: Reference Behavior
```javascript
const numbers = [1, 2, 3];
const newNumbers = numbers; // Both reference the same array
newNumbers.push(4);
console.log(numbers); // Output: [1, 2, 3, 4]
```

---

## 4. Creating a Shallow Copy of an Array

### Using the Spread Operator
```javascript
const numbers = [1, 2, 3];
const copyOfNumbers = [...numbers];
copyOfNumbers.push(5);
console.log(numbers); // Output: [1, 2, 3]
console.log(copyOfNumbers); // Output: [1, 2, 3, 5]
```

---

## 5. Deep Copy

A **shallow copy** only copies the first level of the object or array. For nested objects, you need a **deep copy**.

### Example: Shallow Copy Issue
```javascript
const nestedObject = { name: "John", address: { city: "New York" } };
const shallowCopy = { ...nestedObject };
shallowCopy.address.city = "Los Angeles";
console.log(nestedObject.address.city); // Output: "Los Angeles"
```

### Creating a Deep Copy Using `JSON.stringify` and `JSON.parse`
```javascript
const nestedObject = { name: "John", address: { city: "New York" } };
const deepCopy = JSON.parse(JSON.stringify(nestedObject));
deepCopy.address.city = "San Francisco";
console.log(nestedObject.address.city); // Output: "New York" (unchanged)
console.log(deepCopy.address.city); // Output: "San Francisco"
```

---

## Summary

| Concept                | Example                         | Behavior          |
|------------------------|---------------------------------|-------------------|
| Pass By Reference      | `const copy = obj;`             | Points to same object |
| Shallow Copy (Object)  | `Object.assign({}, obj)` or `{ ...obj }` | Copies first level |
| Shallow Copy (Array)   | `[...array]`                   | Copies first level |
| Deep Copy (Object/Array) | `JSON.stringify` & `JSON.parse` | Independent copy  |

---

## Notes
- Use **shallow copies** for simple objects or arrays without nested structures.
- Use **deep copies** for complex, deeply nested objects or arrays.
