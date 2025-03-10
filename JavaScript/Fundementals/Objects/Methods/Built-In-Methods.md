# JavaScript Object Methods

Objects in JavaScript are collections of key-value pairs. They store data and can also contain methods, which are functions associated with an object. JavaScript provides several built-in methods for working with objects.

---

## 1. Creating Objects

### Using Object Literal Syntax
```javascript
let person = {
  name: "John Doe",
  age: 30,
  job: "Software Developer"
};
```

### Using the `new Object()` Constructor
```javascript
let person = new Object();
person.name = "John Doe";
person.age = 30;
person.job = "Software Developer";
```

### Using Object.create()
```javascript
let prototypePerson = {
  greet: function() {
    console.log("Hello!");
  }
};

let person = Object.create(prototypePerson);
person.name = "John Doe";
console.log(person.name); // Output: John Doe
person.greet(); // Output: Hello!
```

---

## 2. Built-in Object Methods

### `Object.keys()`
Returns an array of an object's own property names (keys).
```javascript
let person = { name: "John", age: 30, job: "Developer" };
console.log(Object.keys(person)); // Output: ["name", "age", "job"]
```

### `Object.values()`
Returns an array of an object's own values.
```javascript
console.log(Object.values(person)); // Output: ["John", 30, "Developer"]
```

### `Object.entries()`
Returns an array of key-value pairs.
```javascript
console.log(Object.entries(person));
// Output: [["name", "John"], ["age", 30], ["job", "Developer"]]
```

### `Object.assign()`
Copies properties from one or more source objects to a target object.
```javascript
let obj1 = { a: 1, b: 2 };
let obj2 = { c: 3 };
let combined = Object.assign({}, obj1, obj2);
console.log(combined); // Output: { a: 1, b: 2, c: 3 }
```

### `Object.freeze()`
Prevents modification of an object's properties.
```javascript
let obj = { name: "John" };
Object.freeze(obj);
obj.name = "Jane"; // This will not change the object
console.log(obj.name); // Output: John
```

### `Object.seal()`
Prevents adding or removing properties but allows modifying existing properties.
```javascript
let obj = { name: "John" };
Object.seal(obj);
obj.age = 30; // This will not be added
obj.name = "Jane"; // This is allowed
console.log(obj); // Output: { name: "Jane" }
```

### `Object.hasOwnProperty()`
Checks if an object has a specific property (ignores inherited properties).
```javascript
console.log(person.hasOwnProperty("name")); // Output: true
console.log(person.hasOwnProperty("toString")); // Output: false
```

### `Object.getOwnPropertyNames()`
Returns an array of all property names (including non-enumerable properties).
```javascript
console.log(Object.getOwnPropertyNames(person)); // Output: ["name", "age", "job"]
```

### `Object.fromEntries()`
Converts an array of key-value pairs into an object.
```javascript
let entries = [["name", "John"], ["age", 30]];
let personObj = Object.fromEntries(entries);
console.log(personObj); // Output: { name: "John", age: 30 }
```

---

## 3. Checking for Key Existence

### Using `in` Operator
Checks if a key exists in an object (including inherited properties).
```javascript
console.log("name" in person); // Output: true
console.log("salary" in person); // Output: false
```

### Using `hasOwnProperty()`
Checks if a key exists only in the object's own properties.
```javascript
console.log(person.hasOwnProperty("name")); // Output: true
console.log(person.hasOwnProperty("toString")); // Output: false
```

---

## Summary
- Objects store key-value pairs and can have methods.
- `Object.keys()`, `Object.values()`, and `Object.entries()` help retrieve object properties.
- `Object.assign()` copies properties between objects.
- `Object.freeze()` and `Object.seal()` control object modifications.
- Use `in` or `hasOwnProperty()` to check if a key exists in an object.

JavaScript provides many built-in object methods to efficiently manipulate and interact with objects!

