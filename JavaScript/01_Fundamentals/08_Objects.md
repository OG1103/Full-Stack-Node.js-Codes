# JavaScript Objects

Objects are the most important data structure in JavaScript. They store collections of key-value pairs and are the building blocks for almost everything in the language.

---

## 1. Creating Objects

### Object Literal (Most Common)

```javascript
const person = {
  name: "Alice",
  age: 30,
  isActive: true,
  greet() {
    return `Hi, I'm ${this.name}`;
  }
};
```

### Using `new Object()`

```javascript
const obj = new Object();
obj.name = "Alice";
obj.age = 30;
```

### Using `Object.create()`

```javascript
const proto = {
  greet() {
    return `Hello, ${this.name}`;
  }
};

const person = Object.create(proto);
person.name = "Alice";
console.log(person.greet()); // "Hello, Alice"
```

---

## 2. Accessing Properties

### Dot Notation

```javascript
const user = { name: "Alice", age: 30 };

console.log(user.name); // "Alice"
user.age = 31;          // Modify
user.email = "a@b.com"; // Add new property
```

### Bracket Notation

Use when the key is dynamic, contains special characters, or is stored in a variable.

```javascript
const user = { "first name": "Alice", age: 30 };

console.log(user["first name"]); // "Alice" (spaces in key)

const key = "age";
console.log(user[key]); // 30 (dynamic key from variable)

// Dynamic property access
function getProp(obj, prop) {
  return obj[prop];
}
```

---

## 3. Computed Property Names (ES6)

Use expressions as property names inside `[]`.

```javascript
const field = "color";

const config = {
  [field]: "blue",                    // color: "blue"
  [`${field}Hex`]: "#0000FF",        // colorHex: "#0000FF"
  [`get${field.charAt(0).toUpperCase() + field.slice(1)}`]() {
    return this.color;                // getColor() method
  }
};

console.log(config.color);      // "blue"
console.log(config.colorHex);   // "#0000FF"
console.log(config.getColor()); // "blue"
```

---

## 4. Shorthand Properties (ES6)

When the variable name matches the property name, you can use shorthand.

```javascript
const name = "Alice";
const age = 30;

// Without shorthand
const person1 = { name: name, age: age };

// With shorthand (ES6)
const person2 = { name, age };
// Same result: { name: "Alice", age: 30 }

// Shorthand methods
const calculator = {
  // Old way
  add: function(a, b) { return a + b; },
  // Shorthand (ES6)
  subtract(a, b) { return a - b; }
};
```

---

## 5. Object Destructuring

Extract properties into variables.

### Basic Destructuring

```javascript
const user = { name: "Alice", age: 30, city: "NYC" };

const { name, age, city } = user;
console.log(name); // "Alice"
console.log(age);  // 30
```

### Renaming Variables

```javascript
const user = { name: "Alice", age: 30 };

const { name: userName, age: userAge } = user;
console.log(userName); // "Alice"
console.log(userAge);  // 30
```

### Default Values

```javascript
const user = { name: "Alice" };

const { name, age = 25, role = "user" } = user;
console.log(age);  // 25 (default used)
console.log(role); // "user" (default used)
```

### Nested Destructuring

```javascript
const user = {
  name: "Alice",
  address: {
    city: "NYC",
    zip: "10001"
  }
};

const { name, address: { city, zip } } = user;
console.log(city); // "NYC"
```

### In Function Parameters

```javascript
function greet({ name, age }) {
  return `${name} is ${age} years old`;
}

greet({ name: "Alice", age: 30 }); // "Alice is 30 years old"

// With defaults
function createUser({ name = "Guest", role = "user" } = {}) {
  return { name, role };
}

createUser();                    // { name: "Guest", role: "user" }
createUser({ name: "Alice" });   // { name: "Alice", role: "user" }
```

---

## 6. `this` in Object Methods

In object methods, `this` refers to the object that owns the method.

```javascript
const user = {
  name: "Alice",
  greet() {
    console.log(`Hello, ${this.name}`); // 'this' refers to 'user'
  }
};

user.greet(); // "Hello, Alice"
```

> **Arrow functions** do NOT have their own `this`. They inherit from the surrounding scope. See `03_This_Keyword/01_This_Keyword.md` for full details.

```javascript
const user = {
  name: "Alice",
  // Arrow function - 'this' is NOT the object
  greet: () => {
    console.log(this.name); // undefined (inherits global/outer this)
  },
  // Regular function - 'this' IS the object
  greetCorrect() {
    console.log(this.name); // "Alice"
  }
};
```

### `this` in Callbacks (Common Pitfall)

```javascript
const user = {
  name: "Alice",
  friends: ["Bob", "Charlie"],
  showFriends() {
    // Arrow function inherits 'this' from showFriends
    this.friends.forEach((friend) => {
      console.log(`${this.name} is friends with ${friend}`); // Works!
    });
  }
};

user.showFriends();
// Alice is friends with Bob
// Alice is friends with Charlie
```

---

## 7. Enums Pattern with `Object.freeze`

JavaScript doesn't have a built-in enum type, but you can simulate one.

```javascript
const STATUS = Object.freeze({
  PENDING: "pending",
  ACTIVE: "active",
  INACTIVE: "inactive"
});

// Cannot modify
STATUS.PENDING = "something";  // Silently fails (strict mode: throws)
STATUS.NEW = "new";            // Cannot add new properties

console.log(STATUS.ACTIVE); // "active"

// Use in conditions
if (user.status === STATUS.ACTIVE) {
  // ...
}
```

---

## 8. Spread Operator with Objects

### Shallow Copy

```javascript
const original = { a: 1, b: 2, c: 3 };
const copy = { ...original };

copy.a = 10;
console.log(original.a); // 1 (not affected - it's a copy)
```

### Merging Objects

```javascript
const defaults = { theme: "light", lang: "en", debug: false };
const userPrefs = { theme: "dark", lang: "fr" };

const settings = { ...defaults, ...userPrefs };
// { theme: "dark", lang: "fr", debug: false }
// Later properties override earlier ones
```

### Adding/Overriding Properties

```javascript
const user = { name: "Alice", age: 30 };
const updatedUser = { ...user, age: 31, email: "alice@test.com" };
// { name: "Alice", age: 31, email: "alice@test.com" }
```

> **Warning**: Spread creates a **shallow copy**. Nested objects are still referenced.

---

## 9. Pass by Reference

Objects are passed by reference, not by value. Modifying a referenced object affects the original.

```javascript
const original = { name: "Alice", scores: [90, 85] };

// Assigning to another variable does NOT copy
const ref = original;
ref.name = "Bob";
console.log(original.name); // "Bob" (original modified!)

// Spread creates shallow copy (top-level only)
const shallow = { ...original };
shallow.name = "Charlie";
console.log(original.name); // "Bob" (not affected)

shallow.scores.push(70);
console.log(original.scores); // [90, 85, 70] (nested array IS affected!)
```

### Deep Copy Solutions

```javascript
// JSON method (simple objects only, no functions/dates/undefined)
const deep1 = JSON.parse(JSON.stringify(original));

// structuredClone (modern, handles more types)
const deep2 = structuredClone(original);

deep2.scores.push(100);
console.log(original.scores); // Not affected
```

---

## 10. Built-In Object Methods

### `Object.keys()` - Get Property Names

```javascript
const obj = { a: 1, b: 2, c: 3 };
console.log(Object.keys(obj)); // ["a", "b", "c"]
```

### `Object.values()` - Get Property Values

```javascript
console.log(Object.values(obj)); // [1, 2, 3]
```

### `Object.entries()` - Get Key-Value Pairs

```javascript
console.log(Object.entries(obj)); // [["a", 1], ["b", 2], ["c", 3]]

// Great for iteration
for (let [key, value] of Object.entries(obj)) {
  console.log(`${key}: ${value}`);
}
```

### `Object.assign()` - Copy/Merge Properties

```javascript
const target = { a: 1 };
const source = { b: 2, c: 3 };
const result = Object.assign(target, source);
// target is now { a: 1, b: 2, c: 3 }
// result === target (same reference, target is mutated)

// Non-mutating copy
const copy = Object.assign({}, source);
```

### `Object.freeze()` - Make Immutable

```javascript
const config = Object.freeze({ port: 3000, host: "localhost" });
config.port = 8080;     // Silently fails
config.newProp = "test"; // Silently fails
delete config.host;      // Silently fails
// Note: Shallow freeze only - nested objects can still be modified
```

### `Object.seal()` - Prevent Add/Delete, Allow Modify

```javascript
const user = Object.seal({ name: "Alice", age: 30 });
user.name = "Bob";     // Allowed (modifying existing)
user.email = "a@b.com"; // Not allowed (adding new)
delete user.name;       // Not allowed (deleting)
```

### `Object.create()` - Create with Prototype

```javascript
const animal = {
  speak() { return `${this.name} makes a sound`; }
};

const dog = Object.create(animal);
dog.name = "Rex";
console.log(dog.speak()); // "Rex makes a sound"
```

### `Object.is()` - Strict Equality (Better than ===)

```javascript
Object.is(NaN, NaN);   // true  (=== returns false)
Object.is(0, -0);      // false (=== returns true)
Object.is(42, 42);     // true
```

### `Object.defineProperty()` - Fine-Grained Control

```javascript
const obj = {};
Object.defineProperty(obj, "id", {
  value: 1,
  writable: false,      // Cannot change the value
  enumerable: false,     // Won't show in for...in or Object.keys
  configurable: false    // Cannot delete or reconfigure
});

console.log(obj.id);           // 1
obj.id = 2;                    // Silently fails
console.log(Object.keys(obj)); // [] (not enumerable)
```

### `Object.getOwnPropertyDescriptor()`

```javascript
const descriptor = Object.getOwnPropertyDescriptor(obj, "id");
// { value: 1, writable: false, enumerable: false, configurable: false }
```

### `Object.getOwnPropertyNames()` - All Own Properties

```javascript
console.log(Object.getOwnPropertyNames(obj)); // ["id"] (includes non-enumerable)
console.log(Object.keys(obj));                 // []     (only enumerable)
```

### `Object.preventExtensions()` - No New Properties

```javascript
const obj = { a: 1 };
Object.preventExtensions(obj);
obj.b = 2;     // Not allowed
obj.a = 10;    // Allowed (modify existing)
delete obj.a;  // Allowed (delete existing)
```

---

## 11. Iterating Objects

```javascript
const user = { name: "Alice", age: 30, city: "NYC" };

// for...in loop
for (let key in user) {
  console.log(`${key}: ${user[key]}`);
}

// Object.keys + forEach
Object.keys(user).forEach(key => {
  console.log(`${key}: ${user[key]}`);
});

// Object.entries + for...of (best for key-value pairs)
for (let [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}

// Object.values (when you only need values)
Object.values(user).forEach(value => {
  console.log(value);
});
```

---

## 12. Property Descriptors

Every property has a descriptor with these attributes:

| Attribute | Default | Description |
|-----------|---------|-------------|
| `value` | `undefined` | The property's value |
| `writable` | `true` | Can the value be changed? |
| `enumerable` | `true` | Shows in `for...in` and `Object.keys()`? |
| `configurable` | `true` | Can the property be deleted or reconfigured? |

```javascript
// Properties created normally have all attributes set to true
const obj = { name: "Alice" };

// Properties created with defineProperty have all false by default
Object.defineProperty(obj, "id", { value: 1 });
// writable: false, enumerable: false, configurable: false
```

---

## 13. Checking Properties

```javascript
const user = { name: "Alice", age: 30 };

// 'in' operator (checks own + inherited)
console.log("name" in user);     // true
console.log("toString" in user); // true (inherited from Object.prototype)

// hasOwnProperty (checks own only)
console.log(user.hasOwnProperty("name"));     // true
console.log(user.hasOwnProperty("toString")); // false

// Optional chaining for nested checks
const data = { user: { address: { city: "NYC" } } };
console.log(data?.user?.address?.city); // "NYC"
console.log(data?.user?.phone?.number); // undefined (no error)
```

---

## 14. Immutability Comparison

| Method | Add Props | Modify Props | Delete Props |
|--------|----------|-------------|-------------|
| `Object.preventExtensions()` | No | Yes | Yes |
| `Object.seal()` | No | Yes | No |
| `Object.freeze()` | No | No | No |

All three are **shallow** - nested objects are not affected.

```javascript
// Check immutability status
Object.isExtensible(obj);  // Can new properties be added?
Object.isSealed(obj);      // Is the object sealed?
Object.isFrozen(obj);      // Is the object frozen?
```

---

## 15. Summary

- Objects store key-value pairs and are JavaScript's most versatile data structure
- Access properties with **dot notation** (static) or **bracket notation** (dynamic)
- **Destructuring** extracts properties into variables concisely
- **Spread operator** creates shallow copies and merges objects
- Objects are **passed by reference** - use spread, `Object.assign()`, or `structuredClone()` for copies
- Use `Object.freeze()` for immutability, `Object.seal()` to prevent structural changes
- Use `Object.keys/values/entries` for iteration and data extraction
- Use `Object.defineProperty()` for fine-grained control over property behavior
