# The `this` Keyword in JavaScript: Complete Guide

## Table of Contents

1. [What Is `this`?](#1-what-is-this)
2. [`this` in Global Scope](#2-this-in-global-scope)
3. [`this` in Regular Functions](#3-this-in-regular-functions)
4. [`this` in Object Methods](#4-this-in-object-methods)
5. [`this` in Arrow Functions](#5-this-in-arrow-functions)
6. [`this` in Constructor Functions](#6-this-in-constructor-functions)
7. [`this` in Classes](#7-this-in-classes)
8. [`this` in Event Handlers](#8-this-in-event-handlers)
9. [`this` in Callbacks: The Lost Context Pitfall](#9-this-in-callbacks-the-lost-context-pitfall)
10. [Explicit Binding: `bind()`, `call()`, `apply()`](#10-explicit-binding-bind-call-apply)
11. [Method Borrowing](#11-method-borrowing)
12. [Summary Table](#12-summary-table)

---

## 1. What Is `this`?

In JavaScript, `this` is a special keyword that refers to the **object that is currently executing the code**. Unlike most variables, `this` is not assigned a value at the time a function is written -- it is determined **at call time** (when the function is invoked).

### The Golden Rule

> The value of `this` depends on **how** a function is called, not **where** it is defined.

This is the single most important concept to understand about `this`. The same function can have different `this` values depending on the invocation pattern.

```javascript
function showThis() {
    console.log(this);
}

const obj = { name: "Alice", showThis };

showThis();       // `this` = global object (or undefined in strict mode)
obj.showThis();   // `this` = obj { name: "Alice", showThis: [Function] }
```

Same function, two different `this` values -- because the **call site** differs.

### The Five Binding Rules (In Order of Precedence)

| # | Rule | Description | Example |
|---|------|-------------|---------|
| 1 | **`new` Binding** | Called with `new` keyword | `new Foo()` |
| 2 | **Explicit Binding** | Called with `call`, `apply`, or `bind` | `fn.call(obj)` |
| 3 | **Implicit Binding** | Called as a method on an object | `obj.fn()` |
| 4 | **Default Binding** | Plain function call | `fn()` |
| 5 | **Arrow Function** | Lexical `this` (inherits from enclosing scope) | `() => this` |

When multiple rules could apply, the **higher-numbered rule** in the precedence list does NOT override a lower-numbered one. The list goes from highest to lowest priority: `new` > explicit > implicit > default. Arrow functions are a special case since they have no own `this` at all.

---

## 2. `this` in Global Scope

When `this` is used outside of any function, it refers to the **global object**. The global object depends on the runtime environment.

### In the Browser

```javascript
console.log(this);             // Window {...}
console.log(this === window);  // true

this.myGlobal = "Hello";
console.log(window.myGlobal);  // "Hello"
```

### In Node.js

```javascript
// In a Node.js module (CommonJS), `this` at the top level refers to `module.exports`
console.log(this);                    // {} (module.exports)
console.log(this === module.exports); // true

// In the Node.js REPL, `this` at the top level refers to the `global` object
// > this === global  // true
```

**Note:** In Node.js files, the top-level `this` is `module.exports` (an empty object `{}`), NOT `global`. This is because Node.js wraps each file in a module function. In the Node.js REPL, `this` at the top level is `global`.

### In Strict Mode

```javascript
"use strict";

// In a browser's global scope, `this` is still `window`
console.log(this); // Window {...} (in a script at the top level)

// However, inside a function in strict mode, `this` is undefined
// (see Section 3)
```

**Important distinction:** Strict mode does NOT change `this` in the global scope itself. It changes `this` inside **functions** that are called without explicit context.

---

## 3. `this` in Regular Functions

The value of `this` in a regular function depends on **how** the function is called and whether strict mode is active.

### Non-Strict Mode: Default Binding to Global Object

When a regular function is called as a **standalone function** (not as a method, not with `new`, not with `call`/`apply`/`bind`), `this` defaults to the **global object**.

```javascript
function showThis() {
    console.log(this);
}

showThis(); // Window {...} (in browser) or `global` (in Node.js REPL)
```

```javascript
function greet() {
    console.log(`Hello, I am ${this.name}`);
}

// In non-strict mode, `this.name` looks up `window.name` (or global.name)
var name = "Global Name"; // `var` at top level attaches to the global object
greet(); // "Hello, I am Global Name"
```

### Strict Mode: `this` Is `undefined`

In strict mode, standalone function calls do NOT default to the global object. Instead, `this` is `undefined`.

```javascript
"use strict";

function showThis() {
    console.log(this);
}

showThis(); // undefined
```

```javascript
"use strict";

function greet() {
    console.log(this);         // undefined
    console.log(this.name);    // TypeError: Cannot read properties of undefined
}

greet();
```

### Why Strict Mode Matters

Strict mode prevents accidental global object mutation. Without it, assigning `this.property` in a standalone function silently creates/modifies global variables:

```javascript
// Non-strict mode -- DANGEROUS
function setName() {
    this.name = "Oops"; // Silently sets window.name / global.name
}
setName();
console.log(window.name); // "Oops" -- unintended global pollution

// Strict mode -- SAFE
"use strict";
function setNameStrict() {
    this.name = "Oops"; // TypeError: Cannot set properties of undefined
}
setNameStrict(); // Throws an error, preventing the bug
```

### Nested Functions Lose Context

A regular function nested inside a method loses the method's `this`:

```javascript
const person = {
    name: "Alice",
    greet() {
        console.log(this.name); // "Alice" (implicit binding)

        function inner() {
            console.log(this.name); // undefined (default binding!)
        }
        inner(); // Called as standalone -- `this` is global/undefined
    }
};

person.greet();
```

This is one of the most common pitfalls in JavaScript. Solutions include arrow functions, `bind`, or saving `this` to a variable (see Sections 5, 9, and 10).

---

## 4. `this` in Object Methods

When a function is called **as a method of an object** (using dot notation or bracket notation), `this` refers to the **object that owns the method** (the object to the left of the dot).

### Basic Object Method

```javascript
const user = {
    name: "Alice",
    age: 30,
    introduce() {
        console.log(`Hi, I'm ${this.name} and I'm ${this.age} years old.`);
    }
};

user.introduce(); // "Hi, I'm Alice and I'm 30 years old."
// `this` === user
```

### Bracket Notation Works the Same Way

```javascript
const obj = {
    x: 42,
    getX() {
        return this.x;
    }
};

console.log(obj["getX"]()); // 42
// `this` === obj (bracket notation still counts as method call)
```

### Nested Objects: `this` Refers to the Immediate Owner

```javascript
const company = {
    name: "Acme Corp",
    department: {
        name: "Engineering",
        getName() {
            return this.name;
        }
    }
};

console.log(company.department.getName()); // "Engineering" (NOT "Acme Corp")
// `this` === company.department (the immediate object to the left of the dot)
```

### Method Assigned to a Variable Loses Context

When you extract a method from an object and call it as a standalone function, `this` is no longer the object:

```javascript
const calculator = {
    value: 100,
    getValue() {
        return this.value;
    }
};

console.log(calculator.getValue()); // 100 (implicit binding)

const getValue = calculator.getValue; // Extracting the method
console.log(getValue());             // undefined (default binding -- `this` is global/undefined)
```

This happens because `getValue` is now a plain function reference. The **call site** determines `this`, and calling `getValue()` is a standalone call, not a method call.

### Method Shorthand vs. Function Expression

Both behave identically for `this`:

```javascript
const obj = {
    // Method shorthand (ES6)
    greetShort() {
        console.log(this);
    },
    // Function expression (ES5)
    greetLong: function() {
        console.log(this);
    }
};

obj.greetShort(); // obj
obj.greetLong();  // obj
// Both are regular functions; `this` is determined by the call site.
```

---

## 5. `this` in Arrow Functions

Arrow functions are fundamentally different from regular functions when it comes to `this`. They do **not** have their own `this` binding. Instead, they **lexically inherit** `this` from the enclosing scope at the time they are defined.

### The Key Difference

| Feature | Regular Function | Arrow Function |
|---------|-----------------|----------------|
| Has own `this`? | Yes | No |
| `this` determined by | Call site (how it is called) | Lexical scope (where it is defined) |
| Can be changed with `bind`/`call`/`apply`? | Yes | No (silently ignored) |
| Can be used as constructor? | Yes | No (`new` throws TypeError) |
| Has `arguments` object? | Yes | No (inherits from enclosing scope) |

### Lexical `this`: Inheriting from Surrounding Scope

```javascript
const person = {
    name: "Alice",
    greet() {
        // `this` here is `person` (implicit binding on the method)

        const arrowFn = () => {
            // Arrow function inherits `this` from `greet()`
            console.log(this.name); // "Alice"
        };

        arrowFn();
    }
};

person.greet(); // "Alice"
```

Compare this with a regular nested function:

```javascript
const person = {
    name: "Alice",
    greet() {
        const regularFn = function() {
            console.log(this.name); // undefined (default binding)
        };

        regularFn();
    }
};

person.greet(); // undefined (or throws in strict mode)
```

### Arrow Functions as Object Methods: A Common Mistake

**Do NOT use arrow functions as object methods.** Since they inherit `this` from the enclosing scope (which is the global scope or module scope for an object literal), they will not refer to the object.

```javascript
const user = {
    name: "Bob",
    // BAD: Arrow function as a method
    greet: () => {
        console.log(this.name); // undefined!
        // `this` is the enclosing scope (global/module), NOT `user`
    }
};

user.greet(); // undefined (or Window in browser non-strict)
```

```javascript
const user = {
    name: "Bob",
    // GOOD: Regular function as a method
    greet() {
        console.log(this.name); // "Bob"
    }
};

user.greet(); // "Bob"
```

### Arrow Functions Solve Callback Context Issues

The most powerful use case for arrow functions is preserving `this` in callbacks:

```javascript
class Timer {
    constructor() {
        this.seconds = 0;
    }

    start() {
        // Arrow function inherits `this` from start(), which is the Timer instance
        setInterval(() => {
            this.seconds++;
            console.log(`${this.seconds} seconds elapsed`);
        }, 1000);
    }
}

const timer = new Timer();
timer.start();
// 1 seconds elapsed
// 2 seconds elapsed
// ...
```

Without the arrow function:

```javascript
class Timer {
    constructor() {
        this.seconds = 0;
    }

    start() {
        // BROKEN: Regular function loses `this` context
        setInterval(function() {
            this.seconds++;  // `this` is the global object, not Timer!
            console.log(this.seconds); // NaN
        }, 1000);
    }
}
```

### `bind`, `call`, `apply` Have No Effect on Arrow Functions

```javascript
const arrowFn = () => {
    console.log(this);
};

const obj = { name: "Alice" };

arrowFn.call(obj);    // Still the enclosing `this`, NOT obj
arrowFn.apply(obj);   // Still the enclosing `this`, NOT obj

const bound = arrowFn.bind(obj);
bound();              // Still the enclosing `this`, NOT obj
```

The explicit binding methods are silently ignored. This is by design -- arrow functions are meant to have a fixed, lexical `this`.

---

## 6. `this` in Constructor Functions

When a function is called with the `new` keyword, it becomes a **constructor**. JavaScript automatically:

1. Creates a **new empty object** `{}`.
2. Sets `this` to point to that new object.
3. Executes the constructor body (which typically assigns properties to `this`).
4. Returns `this` implicitly (unless the function explicitly returns a different object).

### Basic Constructor Function

```javascript
function Person(name, age) {
    // `this` refers to the newly created object
    this.name = name;
    this.age = age;
    this.greet = function() {
        console.log(`Hi, I'm ${this.name}`);
    };
}

const alice = new Person("Alice", 30);
const bob = new Person("Bob", 25);

console.log(alice.name);  // "Alice"
console.log(bob.name);    // "Bob"
alice.greet();             // "Hi, I'm Alice"
bob.greet();               // "Hi, I'm Bob"

console.log(alice instanceof Person); // true
```

### What `new` Does Step by Step

```javascript
function Car(make, model) {
    // Step 1: JavaScript creates {} and assigns it to `this`
    // (Implicitly: this = {})

    // Step 2: We add properties to `this`
    this.make = make;
    this.model = model;

    // Step 3: `this` is returned implicitly
    // (Implicitly: return this)
}

const myCar = new Car("Toyota", "Camry");
// myCar is now { make: "Toyota", model: "Camry" }
```

### Forgetting `new`: A Dangerous Bug

If you call a constructor without `new`, `this` follows the default binding rule:

```javascript
function User(name) {
    this.name = name;
}

// With `new` -- correct
const user1 = new User("Alice");
console.log(user1.name); // "Alice"

// Without `new` -- BUG!
const user2 = User("Bob");
console.log(user2);       // undefined (no return value)
console.log(window.name); // "Bob" (polluted the global object!)
```

**Safeguard pattern:**

```javascript
function User(name) {
    if (!(this instanceof User)) {
        return new User(name); // Self-correct if `new` is forgotten
    }
    this.name = name;
}

const user = User("Alice"); // Works even without `new`
console.log(user.name);     // "Alice"
```

### Constructor Returning an Object Overrides `this`

If a constructor explicitly returns an **object**, that object replaces `this`. Returning a **primitive** is ignored.

```javascript
function Strange() {
    this.name = "Original";
    return { name: "Override" }; // Returning an object overrides `this`
}

const s = new Strange();
console.log(s.name); // "Override" (NOT "Original")

function Normal() {
    this.name = "Original";
    return 42; // Returning a primitive is ignored
}

const n = new Normal();
console.log(n.name); // "Original" (primitive return is ignored)
```

---

## 7. `this` in Classes

ES6 classes are syntactic sugar over constructor functions and prototypes. The rules for `this` inside a class are essentially the same as for constructor functions, but with some additional nuances.

### Basic Class

```javascript
class Animal {
    constructor(name, sound) {
        // `this` refers to the new instance being created
        this.name = name;
        this.sound = sound;
    }

    speak() {
        // `this` refers to the instance that calls the method
        console.log(`${this.name} says ${this.sound}`);
    }
}

const dog = new Animal("Dog", "Woof");
const cat = new Animal("Cat", "Meow");

dog.speak(); // "Dog says Woof"
cat.speak(); // "Cat says Meow"
```

### `this` in Inherited Classes

```javascript
class Vehicle {
    constructor(type) {
        this.type = type;
    }

    describe() {
        return `This is a ${this.type}`;
    }
}

class Car extends Vehicle {
    constructor(brand) {
        super("car");      // Must call super() before using `this`
        this.brand = brand; // `this` refers to the Car instance
    }

    describe() {
        // `this` has access to both Car and Vehicle properties
        return `${super.describe()} made by ${this.brand}`;
    }
}

const myCar = new Car("Toyota");
console.log(myCar.describe()); // "This is a car made by Toyota"
console.log(myCar.type);       // "car"
console.log(myCar.brand);      // "Toyota"
```

### Losing `this` in Class Methods

Just like object methods, class methods lose their `this` when extracted:

```javascript
class Logger {
    constructor(prefix) {
        this.prefix = prefix;
    }

    log(message) {
        console.log(`[${this.prefix}] ${message}`);
    }
}

const logger = new Logger("APP");
logger.log("Hello");         // "[APP] Hello"

const logFn = logger.log;
logFn("Hello");              // TypeError: Cannot read properties of undefined
                             // (reading 'prefix') -- strict mode in classes!
```

**Note:** Class bodies are implicitly in strict mode, so `this` is `undefined` (not the global object) when a method is called without its object.

### Fix: Bind in the Constructor or Use Arrow Fields

```javascript
class Logger {
    constructor(prefix) {
        this.prefix = prefix;
        // Option 1: Bind the method in the constructor
        this.log = this.log.bind(this);
    }

    log(message) {
        console.log(`[${this.prefix}] ${message}`);
    }
}

// Option 2: Use a class field with an arrow function
class LoggerV2 {
    constructor(prefix) {
        this.prefix = prefix;
    }

    // Arrow function class field -- `this` is always the instance
    log = (message) => {
        console.log(`[${this.prefix}] ${message}`);
    };
}

const logger2 = new LoggerV2("APP");
const logFn2 = logger2.log;
logFn2("Hello"); // "[APP] Hello" -- works!
```

### `this` in Static Methods

Static methods are called on the **class itself**, not on instances. `this` inside a static method refers to the **class** (the constructor function).

```javascript
class MathUtils {
    static PI = 3.14159;

    static circleArea(radius) {
        // `this` refers to the MathUtils class
        return this.PI * radius * radius;
    }

    static describe() {
        console.log(`Class name: ${this.name}`); // `this.name` is "MathUtils"
    }
}

console.log(MathUtils.circleArea(5)); // 78.53975
MathUtils.describe();                  // "Class name: MathUtils"
```

---

## 8. `this` in Event Handlers

Event handlers are one of the most common places where `this` causes confusion. The behavior differs based on whether you use a regular function or an arrow function.

### Regular Function: `this` Is the Element

When a regular function is used as an event handler, `this` refers to the **DOM element** that the event listener is attached to.

```javascript
const button = document.querySelector("#myButton");

button.addEventListener("click", function(event) {
    console.log(this);            // <button id="myButton">...</button>
    console.log(this === event.currentTarget); // true
    this.style.backgroundColor = "red"; // Directly modify the element
});
```

### Arrow Function: `this` Is Lexical (Enclosing Scope)

Arrow functions do not bind their own `this`. They inherit `this` from wherever they are defined.

```javascript
const button = document.querySelector("#myButton");

button.addEventListener("click", (event) => {
    console.log(this);            // Window {...} (or the enclosing `this`)
    console.log(this === window); // true (if at top-level in browser)
    // `this` does NOT refer to the button!
    // Use `event.currentTarget` or `event.target` instead
    event.currentTarget.style.backgroundColor = "red";
});
```

### Practical Comparison

```javascript
class ToggleButton {
    constructor(selector) {
        this.isOn = false;
        this.button = document.querySelector(selector);

        // BROKEN: Regular function -- `this` will be the button element
        this.button.addEventListener("click", function() {
            this.isOn = !this.isOn; // `this` is the DOM element, not the class!
            console.log(this.isOn); // Sets a property on the button element
        });
    }
}

class ToggleButtonFixed {
    constructor(selector) {
        this.isOn = false;
        this.button = document.querySelector(selector);

        // FIXED: Arrow function -- `this` is the class instance
        this.button.addEventListener("click", () => {
            this.isOn = !this.isOn; // `this` is the ToggleButtonFixed instance
            console.log(this.isOn); // true, false, true, false, ...
        });
    }
}
```

### Inline Event Handlers (HTML Attribute)

```html
<!-- `this` refers to the element itself -->
<button onclick="console.log(this)">Click me</button>
<!-- Output: <button onclick="...">Click me</button> -->

<!-- But if you call a function, `this` inside that function follows default binding -->
<button onclick="handleClick()">Click me</button>
<script>
function handleClick() {
    console.log(this); // Window (not the button!)
}
</script>
```

### `removeEventListener` and `this`

When using `bind` to fix `this` for event listeners, remember that `bind` creates a **new function**. You must store the reference to remove it later.

```javascript
class Component {
    constructor() {
        this.name = "MyComponent";
        // Store the bound reference
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log(this.name); // "MyComponent"
    }

    mount() {
        document.addEventListener("click", this.handleClick);
    }

    unmount() {
        // Must use the SAME reference to remove the listener
        document.removeEventListener("click", this.handleClick);
    }
}
```

---

## 9. `this` in Callbacks: The Lost Context Pitfall

One of the most common bugs in JavaScript is losing `this` when passing a method as a callback. This happens because callbacks are invoked as **standalone functions**, not as methods on an object.

### The Problem

```javascript
const user = {
    name: "Alice",
    hobbies: ["reading", "gaming", "cooking"],

    showHobbies() {
        this.hobbies.forEach(function(hobby) {
            // BUG: `this` is undefined (strict mode) or global (non-strict)
            console.log(`${this.name} likes ${hobby}`);
        });
    }
};

user.showHobbies();
// Output (non-strict):
// "undefined likes reading"
// "undefined likes gaming"
// "undefined likes cooking"
```

**Why?** The function passed to `forEach` is called as a **standalone function** internally by `forEach`. It is not called as `user.function()`, so `this` is not `user`.

### Solution 1: Arrow Function (Recommended)

```javascript
const user = {
    name: "Alice",
    hobbies: ["reading", "gaming", "cooking"],

    showHobbies() {
        this.hobbies.forEach((hobby) => {
            // Arrow function inherits `this` from showHobbies()
            console.log(`${this.name} likes ${hobby}`);
        });
    }
};

user.showHobbies();
// "Alice likes reading"
// "Alice likes gaming"
// "Alice likes cooking"
```

### Solution 2: `bind(this)`

```javascript
const user = {
    name: "Alice",
    hobbies: ["reading", "gaming", "cooking"],

    showHobbies() {
        this.hobbies.forEach(function(hobby) {
            console.log(`${this.name} likes ${hobby}`);
        }.bind(this)); // Explicitly bind `this`
    }
};

user.showHobbies();
// "Alice likes reading"
// "Alice likes gaming"
// "Alice likes cooking"
```

### Solution 3: `thisArg` Parameter (forEach, map, filter, etc.)

Many array methods accept an optional `thisArg` parameter:

```javascript
const user = {
    name: "Alice",
    hobbies: ["reading", "gaming", "cooking"],

    showHobbies() {
        this.hobbies.forEach(function(hobby) {
            console.log(`${this.name} likes ${hobby}`);
        }, this); // Pass `this` as the second argument to forEach
    }
};

user.showHobbies();
// "Alice likes reading"
// "Alice likes gaming"
// "Alice likes cooking"
```

### Solution 4: Store `this` in a Variable (Legacy Pattern)

Before arrow functions existed, developers commonly saved `this` to a variable named `self`, `that`, or `_this`:

```javascript
const user = {
    name: "Alice",
    hobbies: ["reading", "gaming", "cooking"],

    showHobbies() {
        const self = this; // Store reference to `this`

        this.hobbies.forEach(function(hobby) {
            console.log(`${self.name} likes ${hobby}`);
        });
    }
};

user.showHobbies();
// "Alice likes reading"
// "Alice likes gaming"
// "Alice likes cooking"
```

This pattern is considered outdated. Prefer arrow functions or `bind`.

### Losing `this` in `setTimeout` / `setInterval`

```javascript
const countdown = {
    count: 5,

    start() {
        // BROKEN: Regular function
        const intervalId = setInterval(function() {
            console.log(this.count); // NaN or undefined
            this.count--;
        }, 1000);

        // FIXED: Arrow function
        const intervalIdFixed = setInterval(() => {
            console.log(this.count); // 5, 4, 3, 2, 1
            this.count--;
            if (this.count <= 0) clearInterval(intervalIdFixed);
        }, 1000);
    }
};

countdown.start();
```

### Losing `this` When Passing Methods as Callbacks

```javascript
class EventTracker {
    constructor() {
        this.events = [];
    }

    addEvent(eventName) {
        this.events.push(eventName);
        console.log(`Added: ${eventName}. Total: ${this.events.length}`);
    }
}

const tracker = new EventTracker();

// BROKEN: Passing the method reference loses `this`
["click", "scroll", "resize"].forEach(tracker.addEvent);
// TypeError: Cannot read properties of undefined (reading 'push')

// FIXED: Wrap in arrow function
["click", "scroll", "resize"].forEach((event) => tracker.addEvent(event));
// Added: click. Total: 1
// Added: scroll. Total: 2
// Added: resize. Total: 3

// FIXED: Use bind
["click", "scroll", "resize"].forEach(tracker.addEvent.bind(tracker));
// Added: click. Total: 1
// Added: scroll. Total: 2
// Added: resize. Total: 3
```

---

## 10. Explicit Binding: `bind()`, `call()`, `apply()`

JavaScript provides three methods to explicitly set the value of `this` when calling a function: `call()`, `apply()`, and `bind()`.

### 10.1 `Function.prototype.call()`

`call()` invokes a function **immediately** with a specified `this` value and **individual arguments**.

**Syntax:**
```javascript
function.call(thisArg, arg1, arg2, ...argN)
```

**Example:**

```javascript
function introduce(greeting, punctuation) {
    console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const person = { name: "Alice" };

introduce.call(person, "Hello", "!");
// "Hello, I'm Alice!"

introduce.call({ name: "Bob" }, "Hey", ".");
// "Hey, I'm Bob."
```

### 10.2 `Function.prototype.apply()`

`apply()` is identical to `call()` except it takes arguments as an **array** (or array-like object).

**Syntax:**
```javascript
function.apply(thisArg, [arg1, arg2, ...argN])
```

**Example:**

```javascript
function introduce(greeting, punctuation) {
    console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const person = { name: "Alice" };

introduce.apply(person, ["Hello", "!"]);
// "Hello, I'm Alice!"
```

### 10.3 `call()` vs `apply()`: Key Difference

The only difference is how arguments are passed:

| Method | `this` | Arguments | Mnemonic |
|--------|--------|-----------|----------|
| `call()` | First argument | Individual arguments: `arg1, arg2, ...` | **C**omma-separated |
| `apply()` | First argument | Single array: `[arg1, arg2, ...]` | **A**rray |

```javascript
function sum(a, b, c) {
    return `${this.label}: ${a + b + c}`;
}

const context = { label: "Total" };

// call: pass arguments individually
console.log(sum.call(context, 1, 2, 3));    // "Total: 6"

// apply: pass arguments as an array
console.log(sum.apply(context, [1, 2, 3])); // "Total: 6"
```

**Practical use of `apply` with dynamic argument arrays:**

```javascript
const numbers = [5, 2, 8, 1, 9, 3];

// Math.max expects individual arguments, not an array
// apply spreads the array as arguments
const max = Math.max.apply(null, numbers);
console.log(max); // 9

// Modern alternative using spread operator (preferred)
const maxSpread = Math.max(...numbers);
console.log(maxSpread); // 9
```

### 10.4 `Function.prototype.bind()`

`bind()` does NOT invoke the function immediately. It returns a **new function** with `this` permanently set to the specified value.

**Syntax:**
```javascript
const boundFn = function.bind(thisArg, arg1, arg2, ...argN)
```

**Example:**

```javascript
function greet(greeting) {
    console.log(`${greeting}, ${this.name}`);
}

const alice = { name: "Alice" };
const bob = { name: "Bob" };

const greetAlice = greet.bind(alice);
const greetBob = greet.bind(bob);

greetAlice("Hello"); // "Hello, Alice"
greetBob("Hi");      // "Hi, Bob"

// The original function is unaffected
greet.call({ name: "Charlie" }, "Hey"); // "Hey, Charlie"
```

### `bind()` Is Permanent

Once a function is bound, it cannot be re-bound:

```javascript
function sayName() {
    console.log(this.name);
}

const alice = { name: "Alice" };
const bob = { name: "Bob" };

const boundToAlice = sayName.bind(alice);
const tryRebind = boundToAlice.bind(bob); // Attempting to rebind

boundToAlice();  // "Alice"
tryRebind();     // "Alice" (still Alice! The first bind wins)
```

### Partial Application with `bind()`

`bind()` can also pre-fill arguments (partial application):

```javascript
function multiply(a, b) {
    return a * b;
}

const double = multiply.bind(null, 2);  // Pre-fill `a` as 2
const triple = multiply.bind(null, 3);  // Pre-fill `a` as 3

console.log(double(5));  // 10 (2 * 5)
console.log(double(10)); // 20 (2 * 10)
console.log(triple(5));  // 15 (3 * 5)
```

### Comparison Table: `call()` vs `apply()` vs `bind()`

| Feature | `call()` | `apply()` | `bind()` |
|---------|----------|-----------|----------|
| **Invokes function?** | Yes, immediately | Yes, immediately | No, returns a new function |
| **Sets `this`?** | Yes | Yes | Yes (permanently) |
| **Arguments** | Comma-separated | Array | Comma-separated (partial application) |
| **Returns** | Function's return value | Function's return value | A new bound function |
| **Use case** | Invoke with specific `this` | Invoke with `this` + array args | Create reusable function with fixed `this` |

### Complete Example: All Three Together

```javascript
const mathTeacher = {
    subject: "Math",
    grade(student, score) {
        console.log(`${this.subject}: ${student} scored ${score}`);
    }
};

const scienceTeacher = {
    subject: "Science"
};

// call -- invoke immediately with individual args
mathTeacher.grade.call(scienceTeacher, "Alice", 95);
// "Science: Alice scored 95"

// apply -- invoke immediately with args as array
mathTeacher.grade.apply(scienceTeacher, ["Bob", 88]);
// "Science: Bob scored 88"

// bind -- create a new function for later use
const gradeScience = mathTeacher.grade.bind(scienceTeacher);
gradeScience("Charlie", 92);
// "Science: Charlie scored 92"
```

---

## 11. Method Borrowing

Method borrowing is a technique where you use a method from one object on another object using `call()` or `apply()`. This is especially useful for reusing methods without duplicating code.

### Borrowing Array Methods for Array-Like Objects

The `arguments` object and NodeLists are array-like but do not have array methods. You can borrow them:

```javascript
function listArgs() {
    // `arguments` is array-like but not an Array
    // Borrow Array.prototype.slice to convert it to a real array
    const argsArray = Array.prototype.slice.call(arguments);
    console.log(argsArray);

    // Borrow forEach
    Array.prototype.forEach.call(arguments, function(arg) {
        console.log("Arg:", arg);
    });
}

listArgs("a", "b", "c");
// ["a", "b", "c"]
// Arg: a
// Arg: b
// Arg: c

// Modern alternative: Array.from() or spread
function listArgsModern(...args) {
    console.log(args); // Already a real array
}
```

### Borrowing Methods Between Objects

```javascript
const person = {
    firstName: "Alice",
    lastName: "Smith",
    fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
};

const anotherPerson = {
    firstName: "Bob",
    lastName: "Johnson"
};

// Borrow fullName() from person and use it with anotherPerson
console.log(person.fullName.call(anotherPerson));
// "Bob Johnson"
```

### Borrowing `toString` for Type Checking

A classic pattern for reliable type checking:

```javascript
function getType(value) {
    return Object.prototype.toString.call(value);
}

console.log(getType([]));         // "[object Array]"
console.log(getType({}));         // "[object Object]"
console.log(getType("hello"));   // "[object String]"
console.log(getType(42));        // "[object Number]"
console.log(getType(null));      // "[object Null]"
console.log(getType(undefined)); // "[object Undefined]"
console.log(getType(new Date)); // "[object Date]"
```

### Borrowing `Math.max` and `Math.min`

```javascript
const scores = [72, 85, 90, 68, 95, 77];

// Borrow Math.max using apply (classic technique)
const highest = Math.max.apply(null, scores);
const lowest = Math.min.apply(null, scores);

console.log(highest); // 95
console.log(lowest);  // 68

// Modern alternative with spread
console.log(Math.max(...scores)); // 95
console.log(Math.min(...scores)); // 68
```

### Borrowing with `bind` for Reusable Utilities

```javascript
// Create a reusable "hasOwnProperty" check that is safe
// (in case an object overrides hasOwnProperty)
const hasOwn = Object.prototype.hasOwnProperty.call.bind(
    Object.prototype.hasOwnProperty
);

const obj = { a: 1, b: 2 };

console.log(hasOwn(obj, "a")); // true
console.log(hasOwn(obj, "c")); // false

// This is safer than obj.hasOwnProperty("a") because
// it works even if obj has overridden hasOwnProperty
const tricky = { hasOwnProperty: () => false, a: 1 };
console.log(tricky.hasOwnProperty("a")); // false (broken!)
console.log(hasOwn(tricky, "a"));        // true (correct!)
```

---

## 12. Summary Table

| Context | `this` Value | Can Be Changed? | Notes |
|---------|-------------|-----------------|-------|
| **Global scope (browser, non-strict)** | `window` | N/A | Top-level code |
| **Global scope (Node.js module)** | `module.exports` (`{}`) | N/A | Not `global` in files |
| **Global scope (Node.js REPL)** | `global` | N/A | REPL only |
| **Regular function (non-strict)** | Global object (`window`/`global`) | Yes (`call`/`apply`/`bind`) | Default binding |
| **Regular function (strict mode)** | `undefined` | Yes (`call`/`apply`/`bind`) | Prevents accidental globals |
| **Object method** | The owning object (left of the dot) | Yes (re-assignable) | Implicit binding |
| **Arrow function** | Inherited from enclosing lexical scope | No (ignored by `call`/`apply`/`bind`) | No own `this` |
| **Constructor (`new`)** | The newly created instance | No (unless returning an object) | `new` binding (highest priority) |
| **Class constructor** | The newly created instance | No | Same as constructor function |
| **Class method** | The instance (when called on instance) | Yes (can lose context) | Strict mode by default |
| **Static method** | The class itself | Yes | Called on the class, not instances |
| **Event handler (regular function)** | The DOM element | Yes (`bind`) | `event.currentTarget` |
| **Event handler (arrow function)** | Enclosing lexical scope | No | Use `event.currentTarget` instead |
| **Callback (regular function)** | Global/`undefined` (lost context) | Yes (`bind`, arrow fn) | Most common `this` bug |
| **`call(thisArg, ...args)`** | `thisArg` | -- | Invokes immediately |
| **`apply(thisArg, [args])`** | `thisArg` | -- | Invokes immediately, args as array |
| **`bind(thisArg, ...args)`** | `thisArg` (permanent) | No (cannot rebind) | Returns new function |

---

## Quick Reference: Decision Flowchart

```
How is the function called?
          |
          v
   +------+------+
   | Is it an    |--- Yes ---> `this` = lexical (enclosing) scope
   | arrow fn?   |             (cannot be changed)
   +------+------+
          | No
          v
   +------+------+
   | Called with  |--- Yes ---> `this` = the new instance
   | `new`?      |
   +------+------+
          | No
          v
   +------+------+
   | Called with  |--- Yes ---> `this` = the specified thisArg
   | call/apply/ |
   | bind?       |
   +------+------+
          | No
          v
   +------+------+
   | Called as    |--- Yes ---> `this` = the owning object
   | obj.method()|
   +------+------+
          | No
          v
   +------+------+
   | Strict mode? |--- Yes ---> `this` = undefined
   +------+------+
          | No
          v
     `this` = global object (window / global)
```

---

## Key Takeaways

1. **`this` is determined at call time**, not at definition time (except for arrow functions).
2. **Arrow functions** have no own `this` -- they always inherit from their enclosing lexical scope.
3. **Object methods** bind `this` to the object only when called via dot/bracket notation.
4. **Extracting a method** from an object loses its `this` context -- use `bind`, arrow functions, or wrapper functions to fix it.
5. **`new`** creates a fresh object and binds `this` to it (highest binding priority).
6. **`call` and `apply`** invoke immediately with explicit `this`; the difference is argument format (comma-separated vs array).
7. **`bind`** returns a new permanently-bound function without invoking it.
8. **In callbacks** (forEach, setTimeout, event handlers), `this` is the most common source of bugs -- arrow functions are the cleanest fix.
9. **Strict mode** changes default binding from the global object to `undefined`, catching bugs early.
10. **Classes are strict by default**, so extracted methods have `this` as `undefined`, not the global object.

---

## Further Reading

- [MDN: `this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [MDN: `Function.prototype.bind()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind)
- [MDN: `Function.prototype.call()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/call)
- [MDN: `Function.prototype.apply()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/apply)
- [MDN: Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/this-object-prototypes)
