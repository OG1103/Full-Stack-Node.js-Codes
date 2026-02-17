# Functions in JavaScript

Functions are one of the most fundamental building blocks in JavaScript. A function is a reusable block of code designed to perform a particular task. Understanding functions deeply is essential for writing clean, maintainable, and efficient JavaScript.

---

## Table of Contents

1. [Function Declaration vs Function Expression](#1-function-declaration-vs-function-expression)
2. [Named Functions vs Anonymous Functions](#2-named-functions-vs-anonymous-functions)
3. [Arrow Functions](#3-arrow-functions)
4. [Parameters: Default, Rest, and the Arguments Object](#4-parameters-default-rest-and-the-arguments-object)
5. [The Return Keyword](#5-the-return-keyword)
6. [Callbacks](#6-callbacks)
7. [Higher-Order Functions](#7-higher-order-functions)
8. [Closures](#8-closures)
9. [IIFE (Immediately Invoked Function Expressions)](#9-iife-immediately-invoked-function-expressions)
10. [Recursive Functions](#10-recursive-functions)
11. [Function Hoisting](#11-function-hoisting)
12. [Pure Functions and Side Effects](#12-pure-functions-and-side-effects)

---

## 1. Function Declaration vs Function Expression

There are two primary ways to define a function in JavaScript: **declarations** and **expressions**. They differ in syntax, hoisting behavior, and how they are used.

### Function Declaration

A function declaration (also called a function statement) defines a named function using the `function` keyword. It is **hoisted** entirely, meaning both the name and the body are available before the line of code where the function is defined.

```js
// Function Declaration
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet("Alice")); // "Hello, Alice!"
```

**Key characteristics:**

- Must have a name.
- Hoisted to the top of their scope (can be called before the declaration).
- Creates a variable in the current scope with the same name as the function.

### Function Expression

A function expression defines a function as part of an expression, typically by assigning it to a variable. The function itself can be named or anonymous.

```js
// Function Expression (anonymous)
const greet = function (name) {
  return `Hello, ${name}!`;
};

console.log(greet("Bob")); // "Hello, Bob!"
```

**Key characteristics:**

- Can be named or anonymous.
- **Not hoisted** -- only the variable declaration is hoisted (as `undefined` with `var`, or placed in the Temporal Dead Zone with `let`/`const`).
- Often used when passing functions as arguments or assigning them conditionally.

### Comparison Table

| Feature                | Function Declaration          | Function Expression               |
| ---------------------- | ----------------------------- | --------------------------------- |
| Syntax                 | `function name() {}`          | `const name = function() {}`      |
| Hoisting               | Fully hoisted (name + body)   | Variable hoisted, not the function|
| Name requirement       | Required                      | Optional (can be anonymous)       |
| Use before definition  | Yes                           | No (ReferenceError or undefined)  |
| Use as argument        | Possible but uncommon         | Very common                       |

```js
// Hoisting difference demonstrated
sayHello(); // Works fine: "Hello!"
// sayGoodbye(); // TypeError: sayGoodbye is not a function (with var)
// sayGoodbye(); // ReferenceError: Cannot access before initialization (with const/let)

function sayHello() {
  console.log("Hello!");
}

var sayGoodbye = function () {
  console.log("Goodbye!");
};
```

---

## 2. Named Functions vs Anonymous Functions

### Named Functions

A named function has an explicit name identifier after the `function` keyword. This name is accessible inside the function body (useful for recursion) and appears in stack traces for easier debugging.

```js
// Named function declaration
function calculateArea(width, height) {
  return width * height;
}

// Named function expression
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // 'fact' is accessible inside the function
};

console.log(factorial(5)); // 120
// console.log(fact(5)); // ReferenceError: fact is not defined (outside the expression)
```

> **Note:** In a named function expression, the name (`fact` above) is only available inside the function body. It is **not** added to the enclosing scope.

### Anonymous Functions

An anonymous function has no name identifier. They are commonly used as:

- Callback arguments
- Immediately invoked function expressions (IIFEs)
- Values assigned to variables

```js
// Anonymous function assigned to a variable
const multiply = function (a, b) {
  return a * b;
};

// Anonymous function as a callback
setTimeout(function () {
  console.log("This runs after 1 second");
}, 1000);

// Anonymous arrow function
const numbers = [1, 2, 3];
const doubled = numbers.map((n) => n * 2);
```

### When to Prefer Named Functions

| Scenario                        | Recommendation |
| ------------------------------- | -------------- |
| Debugging / stack traces        | Named          |
| Self-referencing (recursion)    | Named          |
| Short inline callbacks          | Anonymous / Arrow |
| Event handlers you may remove   | Named          |
| General reusable logic          | Named          |

```js
// Stack trace benefit of named functions
const processData = function processData(data) {
  // If an error occurs here, the stack trace shows "processData"
  // instead of "anonymous"
  if (!data) throw new Error("No data provided");
  return data;
};
```

---

## 3. Arrow Functions

Arrow functions, introduced in ES6, provide a shorter syntax for writing function expressions. However, they are **not** just syntactic sugar -- they have significant behavioral differences from regular functions.

### Syntax Variations

```js
// 1. Full syntax with body block
const add = (a, b) => {
  return a + b;
};

// 2. Implicit return (single expression, no braces)
const addShort = (a, b) => a + b;

// 3. Single parameter (parentheses optional)
const double = (x) => x * 2;
// or: const double = x => x * 2;

// 4. No parameters (parentheses required)
const greet = () => "Hello!";

// 5. Returning an object literal (wrap in parentheses to avoid ambiguity)
const makeUser = (name, age) => ({ name, age });
console.log(makeUser("Alice", 30)); // { name: "Alice", age: 30 }
```

### Implicit Return

When an arrow function has a single expression (no curly braces), that expression is automatically returned. This is called **implicit return**.

```js
// Implicit return -- the expression after => is returned
const square = (x) => x * 2;

// Equivalent with explicit return
const squareExplicit = (x) => {
  return x * 2;
};

// Common use in array methods
const names = ["alice", "bob", "charlie"];
const capitalized = names.map((name) => name.charAt(0).toUpperCase() + name.slice(1));
console.log(capitalized); // ["Alice", "Bob", "Charlie"]
```

> **Gotcha:** If you use curly braces `{}`, you must use an explicit `return` statement. Forgetting `return` inside braces is a common bug.

```js
// Bug: no return, so this returns undefined
const buggyAdd = (a, b) => {
  a + b;
};
console.log(buggyAdd(2, 3)); // undefined

// Fix: add return
const fixedAdd = (a, b) => {
  return a + b;
};
```

### Differences from Regular Functions

Arrow functions differ from regular functions in several critical ways:

#### 1. No Own `this` Binding

Arrow functions do not have their own `this`. They **lexically** inherit `this` from the enclosing scope at the time they are defined.

```js
const person = {
  name: "Alice",
  // Regular function: 'this' refers to the calling object
  greetRegular: function () {
    console.log(`Hello, I'm ${this.name}`);
  },
  // Arrow function: 'this' is inherited from the enclosing scope (not the object)
  greetArrow: () => {
    console.log(`Hello, I'm ${this.name}`); // 'this' is the outer scope (e.g., window/global)
  },
};

person.greetRegular(); // "Hello, I'm Alice"
person.greetArrow(); // "Hello, I'm undefined" (in non-strict mode, this = window/global)
```

**Practical benefit:** Arrow functions are ideal inside methods where you need to preserve the outer `this`.

```js
function Timer() {
  this.seconds = 0;

  // Arrow function inherits 'this' from Timer
  setInterval(() => {
    this.seconds++;
    console.log(this.seconds);
  }, 1000);
}

const timer = new Timer(); // Logs 1, 2, 3, ... every second
```

#### 2. No `arguments` Object

Arrow functions do not have their own `arguments` object. If you reference `arguments` inside an arrow function, it resolves to the `arguments` of the nearest enclosing regular function (or throws a ReferenceError if none exists).

```js
function regularFunc() {
  console.log(arguments); // [Arguments] { '0': 1, '1': 2, '2': 3 }
}
regularFunc(1, 2, 3);

const arrowFunc = () => {
  // console.log(arguments); // ReferenceError in modules / strict mode,
  // or refers to enclosing function's arguments
};

// Use rest parameters instead
const arrowWithRest = (...args) => {
  console.log(args); // [1, 2, 3] -- a real array
};
arrowWithRest(1, 2, 3);
```

#### 3. Cannot Be Used as Constructors

Arrow functions cannot be called with `new`. They do not have a `[[Construct]]` internal method or a `prototype` property.

```js
const Person = (name) => {
  this.name = name;
};

// const p = new Person("Alice"); // TypeError: Person is not a constructor
```

#### 4. No `prototype` Property

```js
function regularFunc() {}
console.log(regularFunc.prototype); // {}

const arrowFunc = () => {};
console.log(arrowFunc.prototype); // undefined
```

### Summary: Arrow vs Regular Functions

| Feature               | Regular Function | Arrow Function         |
| --------------------- | ---------------- | ---------------------- |
| `this` binding        | Dynamic (caller) | Lexical (enclosing scope) |
| `arguments` object    | Yes              | No                     |
| Can use `new`         | Yes              | No                     |
| `prototype` property  | Yes              | No                     |
| Suitable as methods   | Yes              | Avoid (no own `this`)  |
| Syntax                | Verbose          | Concise                |

---

## 4. Parameters: Default, Rest, and the Arguments Object

### Default Parameters

ES6 introduced default parameter values, which are used when an argument is `undefined` or not provided.

```js
function greet(name = "World") {
  return `Hello, ${name}!`;
}

console.log(greet()); // "Hello, World!"
console.log(greet("Alice")); // "Hello, Alice!"
console.log(greet(undefined)); // "Hello, World!" (undefined triggers the default)
console.log(greet(null)); // "Hello, null!" (null does NOT trigger the default)
```

Default parameters can reference earlier parameters and even be expressions:

```js
function createUser(name, role = "user", greeting = `Welcome, ${name}`) {
  return { name, role, greeting };
}

console.log(createUser("Alice"));
// { name: "Alice", role: "user", greeting: "Welcome, Alice" }

// Default parameter as a function call
function getDefaultId() {
  return Math.random().toString(36).slice(2, 9);
}

function createItem(name, id = getDefaultId()) {
  return { name, id };
}

console.log(createItem("Widget")); // { name: "Widget", id: "a1b2c3d" } (random)
console.log(createItem("Gadget", "custom-123")); // { name: "Gadget", id: "custom-123" }
```

### Rest Parameters (`...args`)

The rest parameter syntax collects all remaining arguments into a **real array**. It must be the last parameter in the function signature.

```js
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3)); // 6
console.log(sum(10, 20, 30, 40)); // 100

// Combining regular and rest parameters
function logInfo(level, ...messages) {
  messages.forEach((msg) => console.log(`[${level}] ${msg}`));
}

logInfo("ERROR", "File not found", "Check path", "Retry later");
// [ERROR] File not found
// [ERROR] Check path
// [ERROR] Retry later
```

**Rest parameters vs `arguments`:**

| Feature          | `arguments`          | Rest Parameters (`...args`) |
| ---------------- | -------------------- | --------------------------- |
| Type             | Array-like object    | Real Array                  |
| Array methods    | Not available directly | `.map`, `.filter`, etc.    |
| Arrow functions  | Not available        | Available                   |
| Named reference  | Always `arguments`   | You choose the name         |
| Subset of args   | No (all arguments)   | Yes (remaining arguments)   |

### The `arguments` Object

The `arguments` object is an array-like object available inside all **regular** (non-arrow) functions. It contains all the arguments passed to the function, regardless of the defined parameters.

```js
function showArgs() {
  console.log(arguments); // [Arguments] { '0': 'a', '1': 'b', '2': 'c' }
  console.log(arguments.length); // 3
  console.log(arguments[0]); // 'a'

  // Convert to a real array
  const argsArray = Array.from(arguments);
  // or: const argsArray = [...arguments];
  console.log(argsArray); // ['a', 'b', 'c']
}

showArgs("a", "b", "c");
```

> **Best Practice:** Prefer rest parameters over `arguments`. Rest parameters produce a real array, work in arrow functions, and make the function signature more explicit.

```js
// Old pattern (avoid)
function oldSum() {
  return Array.from(arguments).reduce((a, b) => a + b, 0);
}

// Modern pattern (prefer)
function newSum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
```

---

## 5. The Return Keyword

Every function in JavaScript returns a value. If no `return` statement is used (or `return` is used without a value), the function returns `undefined`.

### Explicit Return

```js
function add(a, b) {
  return a + b; // Explicit return
}

console.log(add(2, 3)); // 5
```

### Implicit Return (Arrow Functions)

Arrow functions with a single expression (no braces) automatically return that expression's value.

```js
const multiply = (a, b) => a * b; // Implicit return
console.log(multiply(4, 5)); // 20

// Returning an object literal implicitly requires parentheses
const makePoint = (x, y) => ({ x, y });
console.log(makePoint(10, 20)); // { x: 10, y: 20 }
```

### Return Stops Execution

The `return` statement immediately exits the function. Any code after `return` within the same block is unreachable.

```js
function checkAge(age) {
  if (age < 0) {
    return "Invalid age"; // Function exits here if age < 0
  }
  if (age >= 18) {
    return "Adult";
  }
  return "Minor"; // Default return
  console.log("This never runs"); // Unreachable code
}

console.log(checkAge(-1)); // "Invalid age"
console.log(checkAge(25)); // "Adult"
console.log(checkAge(10)); // "Minor"
```

### Returning Multiple Values

JavaScript functions can only return a single value, but you can return arrays or objects to effectively return multiple values.

```js
// Using an array
function getMinMax(arr) {
  return [Math.min(...arr), Math.max(...arr)];
}
const [min, max] = getMinMax([3, 1, 4, 1, 5, 9]);
console.log(min, max); // 1 9

// Using an object
function getUserInfo() {
  return { name: "Alice", age: 30, role: "admin" };
}
const { name, age, role } = getUserInfo();
console.log(name, age, role); // Alice 30 admin
```

### No Return = `undefined`

```js
function doSomething() {
  console.log("Working...");
  // No return statement
}

const result = doSomething(); // logs "Working..."
console.log(result); // undefined
```

---

## 6. Callbacks

A **callback** is a function passed as an argument to another function, to be "called back" (invoked) at a later time. Callbacks are one of the foundational patterns in JavaScript, especially for asynchronous operations.

### Basic Callback Pattern

```js
function processUserInput(callback) {
  const name = "Alice"; // Simulating user input
  callback(name);
}

function greetUser(name) {
  console.log(`Hello, ${name}!`);
}

processUserInput(greetUser); // "Hello, Alice!"

// With an anonymous callback
processUserInput(function (name) {
  console.log(`Welcome back, ${name}!`);
});

// With an arrow function callback
processUserInput((name) => console.log(`Hi there, ${name}!`));
```

### Synchronous Callbacks

Synchronous callbacks are executed immediately within the function they are passed to. Array methods like `map`, `filter`, and `forEach` use synchronous callbacks.

```js
const numbers = [1, 2, 3, 4, 5];

// forEach uses a synchronous callback
numbers.forEach((num) => {
  console.log(num * 2);
});
// 2, 4, 6, 8, 10 (all printed immediately)

// sort uses a synchronous callback (comparator)
const sorted = [3, 1, 4, 1, 5].sort((a, b) => a - b);
console.log(sorted); // [1, 1, 3, 4, 5]
```

### Asynchronous Callbacks

Asynchronous callbacks are invoked after an asynchronous operation completes (e.g., timers, file I/O, network requests).

```js
// setTimeout -- the callback runs after the delay
console.log("Start");

setTimeout(() => {
  console.log("This runs after 2 seconds");
}, 2000);

console.log("End");
// Output order: "Start", "End", "This runs after 2 seconds"
```

### Error-First Callback Pattern (Node.js Convention)

In Node.js, callbacks conventionally follow the "error-first" pattern: the first argument is an error (or `null` if successful), and subsequent arguments are the result.

```js
function readFile(path, callback) {
  // Simulating async file read
  setTimeout(() => {
    if (path === "") {
      callback(new Error("Path cannot be empty"), null);
    } else {
      callback(null, `Contents of ${path}`);
    }
  }, 100);
}

readFile("data.txt", (err, data) => {
  if (err) {
    console.error("Error:", err.message);
    return;
  }
  console.log("Data:", data);
});
// Data: Contents of data.txt

readFile("", (err, data) => {
  if (err) {
    console.error("Error:", err.message);
    return;
  }
  console.log("Data:", data);
});
// Error: Path cannot be empty
```

### Callback Hell and How to Avoid It

Deeply nested callbacks become hard to read and maintain -- this is known as "callback hell" or the "pyramid of doom."

```js
// Callback hell example
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getOrderDetails(orders[0].id, (err, details) => {
      if (err) return handleError(err);
      console.log(details);
      // Even deeper nesting...
    });
  });
});
```

**Solutions:**

1. **Named functions** -- Extract callbacks into named functions.
2. **Promises** -- Chain `.then()` calls instead of nesting.
3. **Async/Await** -- Write asynchronous code that reads like synchronous code.

---

## 7. Higher-Order Functions

A **higher-order function** is a function that does at least one of the following:

1. **Takes one or more functions as arguments** (i.e., accepts callbacks).
2. **Returns a function** as its result.

Higher-order functions enable powerful patterns like composition, currying, and abstraction over actions.

### Functions That Take Functions as Arguments

```js
// Array.prototype.map is a higher-order function
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n) => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Custom higher-order function
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

repeat(3, (i) => console.log(`Iteration ${i}`));
// Iteration 0
// Iteration 1
// Iteration 2
```

### Functions That Return Functions

```js
// Function factory
function createMultiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// With arrow functions
const createGreeter = (greeting) => (name) => `${greeting}, ${name}!`;

const sayHello = createGreeter("Hello");
const sayHi = createGreeter("Hi");

console.log(sayHello("Alice")); // "Hello, Alice!"
console.log(sayHi("Bob")); // "Hi, Bob!"
```

### Practical Examples

```js
// Compose: combine two functions
function compose(f, g) {
  return function (x) {
    return f(g(x));
  };
}

const addOne = (x) => x + 1;
const doubleIt = (x) => x * 2;

const doubleAndAddOne = compose(addOne, doubleIt);
console.log(doubleAndAddOne(5)); // 11 (5 * 2 = 10, 10 + 1 = 11)

// Currying: transforming f(a, b) into f(a)(b)
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}

const curriedAdd = curry((a, b, c) => a + b + c);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
```

---

## 8. Closures

A **closure** is formed when a function "remembers" and continues to access variables from its **lexical scope** (the scope in which it was defined), even after the outer function has finished executing.

### Lexical Scope

JavaScript uses lexical (static) scoping: a function's scope is determined by where it is written in the source code, not where it is called.

```js
const outerVar = "I'm outer";

function outerFunction() {
  const innerVar = "I'm inner";

  function innerFunction() {
    console.log(outerVar); // Accessible (lexical scope)
    console.log(innerVar); // Accessible (lexical scope)
  }

  innerFunction();
}

outerFunction();
// "I'm outer"
// "I'm inner"
```

### Closure Creation

A closure is created every time a function is created. The inner function retains a reference to the variables of the outer function, even after the outer function returns.

```js
function createCounter() {
  let count = 0; // This variable is "enclosed" by the returned function

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    },
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount()); // 1
// 'count' is not accessible directly -- it's private
// console.log(count); // ReferenceError: count is not defined
```

### Practical Uses of Closures

#### 1. Data Privacy / Encapsulation

Closures allow you to create private variables that cannot be accessed from outside.

```js
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private variable

  return {
    deposit(amount) {
      if (amount <= 0) throw new Error("Deposit must be positive");
      balance += amount;
      return `Deposited $${amount}. New balance: $${balance}`;
    },
    withdraw(amount) {
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
      return `Withdrew $${amount}. New balance: $${balance}`;
    },
    getBalance() {
      return `$${balance}`;
    },
  };
}

const account = createBankAccount(100);
console.log(account.deposit(50)); // "Deposited $50. New balance: $150"
console.log(account.withdraw(30)); // "Withdrew $30. New balance: $120"
console.log(account.getBalance()); // "$120"
// console.log(account.balance); // undefined -- cannot access directly
```

#### 2. Factory Functions

Closures let you create specialized functions from a general template.

```js
function createLogger(prefix) {
  return function (message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${prefix}] ${message}`);
  };
}

const infoLog = createLogger("INFO");
const errorLog = createLogger("ERROR");
const debugLog = createLogger("DEBUG");

infoLog("Server started"); // [2025-01-01T...] [INFO] Server started
errorLog("Connection failed"); // [2025-01-01T...] [ERROR] Connection failed
debugLog("Variable x = 42"); // [2025-01-01T...] [DEBUG] Variable x = 42
```

#### 3. Memoization

Memoization is an optimization technique that caches the results of expensive function calls. Closures are perfect for storing the cache.

```js
function memoize(fn) {
  const cache = {}; // Closed over by the returned function

  return function (...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      console.log(`Cache hit for args: ${key}`);
      return cache[key];
    }
    console.log(`Computing for args: ${key}`);
    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

const expensiveAdd = memoize((a, b) => {
  // Simulate expensive computation
  return a + b;
});

console.log(expensiveAdd(1, 2)); // Computing for args: [1,2] => 3
console.log(expensiveAdd(1, 2)); // Cache hit for args: [1,2] => 3
console.log(expensiveAdd(3, 4)); // Computing for args: [3,4] => 7
```

### Common Closure Pitfall: Loop Variables

```js
// Classic pitfall with var in loops
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 (all closures share the same 'i')

// Fix 1: Use let (block-scoped)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2

// Fix 2: Use an IIFE to create a new scope
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(() => console.log(j), 100);
  })(i);
}
// Output: 0, 1, 2
```

---

## 9. IIFE (Immediately Invoked Function Expressions)

An **IIFE** (pronounced "iffy") is a function that is defined and executed immediately. It creates its own scope, preventing variables from polluting the global scope.

### Syntax

```js
// Standard IIFE
(function () {
  const message = "I run immediately!";
  console.log(message);
})();

// Arrow function IIFE
(() => {
  const message = "Arrow IIFE!";
  console.log(message);
})();

// IIFE with parameters
(function (name) {
  console.log(`Hello, ${name}!`);
})("Alice");

// Named IIFE (the name is only accessible inside the IIFE)
(function myIIFE() {
  console.log("Named IIFE");
})();

// Alternative syntax (wrapping the entire expression)
(function () {
  console.log("Alternative syntax");
})();
```

### Use Cases

#### 1. Avoiding Global Scope Pollution

```js
// Without IIFE -- 'config' leaks into the global scope
// const config = { debug: true };

// With IIFE -- 'config' is local to the IIFE
(function () {
  const config = { debug: true };
  // Use config here...
  console.log(config.debug); // true
})();
// console.log(config); // ReferenceError: config is not defined
```

#### 2. Module Pattern (Pre-ES6)

Before ES6 modules, IIFEs were the standard way to create modules with private and public members.

```js
const myModule = (function () {
  // Private
  let privateCounter = 0;
  function privateLog(msg) {
    console.log(`[Private] ${msg}`);
  }

  // Public API
  return {
    increment() {
      privateCounter++;
      privateLog(`Counter: ${privateCounter}`);
    },
    getCount() {
      return privateCounter;
    },
  };
})();

myModule.increment(); // [Private] Counter: 1
myModule.increment(); // [Private] Counter: 2
console.log(myModule.getCount()); // 2
// myModule.privateCounter; // undefined
// myModule.privateLog; // undefined
```

#### 3. Initialization Code

```js
const app = (function () {
  // Initialization logic that runs once
  const startTime = Date.now();
  console.log("App initialized");

  return {
    getUptime() {
      return Date.now() - startTime;
    },
  };
})();

// Later...
console.log(`Uptime: ${app.getUptime()}ms`);
```

> **Note:** With ES6 modules and `let`/`const` (which are block-scoped), the need for IIFEs has decreased. However, they still appear in legacy code and in specific patterns like the module pattern or when you need to execute code immediately in a script.

---

## 10. Recursive Functions

A **recursive function** is a function that calls itself to solve a problem by breaking it down into smaller sub-problems. Every recursive function must have:

1. **Base case:** The condition under which the recursion stops.
2. **Recursive case:** The part where the function calls itself with a simpler/smaller input.

### Factorial

```js
// factorial(5) = 5 * 4 * 3 * 2 * 1 = 120
function factorial(n) {
  // Base case
  if (n <= 1) return 1;

  // Recursive case
  return n * factorial(n - 1);
}

console.log(factorial(0)); // 1
console.log(factorial(1)); // 1
console.log(factorial(5)); // 120
console.log(factorial(10)); // 3628800
```

**Execution trace for `factorial(4)`:**

```
factorial(4)
  => 4 * factorial(3)
    => 3 * factorial(2)
      => 2 * factorial(1)
        => 1            (base case reached)
      => 2 * 1 = 2
    => 3 * 2 = 6
  => 4 * 6 = 24
```

### Fibonacci

```js
// 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...
function fibonacci(n) {
  // Base cases
  if (n === 0) return 0;
  if (n === 1) return 1;

  // Recursive case
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(0)); // 0
console.log(fibonacci(1)); // 1
console.log(fibonacci(6)); // 8
console.log(fibonacci(10)); // 55
```

> **Warning:** The naive Fibonacci implementation has exponential time complexity O(2^n). Use memoization or iteration for larger values.

```js
// Optimized Fibonacci with memoization
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

console.log(fibMemo(50)); // 12586269025 (instant, not billions of years)
```

### More Recursive Examples

```js
// Sum of an array
function sumArray(arr) {
  if (arr.length === 0) return 0; // Base case
  return arr[0] + sumArray(arr.slice(1)); // Recursive case
}

console.log(sumArray([1, 2, 3, 4, 5])); // 15

// Flatten nested arrays
function flattenDeep(arr) {
  return arr.reduce((acc, val) => {
    if (Array.isArray(val)) {
      return acc.concat(flattenDeep(val));
    }
    return acc.concat(val);
  }, []);
}

console.log(flattenDeep([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]

// Deep clone an object
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

const original = { a: 1, b: { c: 2, d: [3, 4] } };
const clone = deepClone(original);
clone.b.c = 99;
console.log(original.b.c); // 2 (unaffected)
console.log(clone.b.c); // 99
```

### Stack Overflow and Tail Call Optimization

Recursion uses the call stack, and too many recursive calls cause a **stack overflow**.

```js
// This will cause a stack overflow for large n
function countDown(n) {
  if (n === 0) return;
  countDown(n - 1);
}

// countDown(100000); // RangeError: Maximum call stack size exceeded

// Iterative alternative (no stack overflow)
function countDownIterative(n) {
  while (n > 0) {
    n--;
  }
}
```

> **Note:** ECMAScript 2015 specifies Tail Call Optimization (TCO) for strict mode, but only Safari currently implements it. In practice, prefer iteration for deeply recursive problems or use techniques like trampolining.

---

## 11. Function Hoisting

JavaScript **hoists** function declarations -- both the name and the entire function body are moved to the top of their scope during the compilation phase. Function expressions are **not** hoisted in the same way.

### Function Declarations Are Fully Hoisted

```js
// This works because function declarations are hoisted
console.log(add(2, 3)); // 5

function add(a, b) {
  return a + b;
}
```

The engine effectively interprets this as:

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // 5
```

### Function Expressions Are NOT Hoisted

With `var`, only the variable declaration is hoisted (initialized to `undefined`). With `let`/`const`, the variable is in the Temporal Dead Zone until the declaration.

```js
// With var
console.log(typeof subtract); // "undefined" (variable hoisted, but not the function)
// subtract(5, 3); // TypeError: subtract is not a function

var subtract = function (a, b) {
  return a - b;
};

// With const/let
// console.log(multiply); // ReferenceError: Cannot access 'multiply' before initialization

const multiply = function (a, b) {
  return a * b;
};
```

### Arrow Functions Follow Expression Rules

Since arrow functions are always expressions (assigned to variables), they follow the same hoisting rules as function expressions.

```js
// greetArrow(\"Alice\"); // ReferenceError or TypeError depending on var/const

const greetArrow = (name) => `Hello, ${name}!`;
console.log(greetArrow("Alice")); // "Hello, Alice!"
```

### Hoisting Summary

| Type                              | Hoisted?         | Usable Before Declaration? |
| --------------------------------- | ---------------- | -------------------------- |
| Function declaration              | Yes (fully)      | Yes                        |
| `var` function expression         | Partially (as `undefined`) | No (TypeError)   |
| `let`/`const` function expression | No (TDZ)         | No (ReferenceError)        |
| Arrow function (any binding)      | Same as expression | No                       |

---

## 12. Pure Functions and Side Effects

### Pure Functions

A **pure function** is a function that:

1. **Deterministic:** Always returns the same output for the same inputs.
2. **No side effects:** Does not modify any external state or cause any observable effects outside the function.

```js
// Pure function
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // Always 5
console.log(add(2, 3)); // Always 5

// Pure function -- depends only on its inputs
function formatName(first, last) {
  return `${first} ${last}`;
}

// Pure function -- does not modify the original array
function sortArray(arr) {
  return [...arr].sort((a, b) => a - b);
}

const original = [3, 1, 4, 1, 5];
const sorted = sortArray(original);
console.log(original); // [3, 1, 4, 1, 5] (unchanged)
console.log(sorted); // [1, 1, 3, 4, 5]
```

### Side Effects

A **side effect** is any observable change outside the function's scope. Common side effects include:

- Modifying a global variable or external state
- Modifying an input argument (mutation)
- Writing to the console (`console.log`)
- Making network requests (API calls)
- Modifying the DOM
- Writing to a file or database
- Setting timers (`setTimeout`, `setInterval`)

```js
// Impure: modifies external state
let total = 0;
function addToTotal(amount) {
  total += amount; // Side effect: modifying external variable
  return total;
}

console.log(addToTotal(5)); // 5
console.log(addToTotal(5)); // 10 (different result for same input!)

// Impure: modifies the input
function addItem(arr, item) {
  arr.push(item); // Side effect: mutating the input array
  return arr;
}

// Pure alternative
function addItemPure(arr, item) {
  return [...arr, item]; // Returns a new array, original unchanged
}

const items = [1, 2, 3];
const newItems = addItemPure(items, 4);
console.log(items); // [1, 2, 3] (unchanged)
console.log(newItems); // [1, 2, 3, 4]
```

### Why Pure Functions Matter

| Benefit           | Description                                                           |
| ----------------- | --------------------------------------------------------------------- |
| Predictability    | Same inputs always produce same outputs; easier to reason about       |
| Testability       | No setup or teardown of external state; just assert input => output   |
| Cacheability      | Results can be memoized since they depend only on inputs              |
| Parallelization   | No shared state means no race conditions                              |
| Debugging         | Easier to isolate bugs since functions don't affect each other        |

```js
// Pure functions are easy to test
function calculateDiscount(price, discountPercent) {
  return price - price * (discountPercent / 100);
}

// Test cases
console.assert(calculateDiscount(100, 10) === 90, "10% off $100 should be $90");
console.assert(calculateDiscount(200, 25) === 150, "25% off $200 should be $150");
console.assert(calculateDiscount(50, 0) === 50, "0% off $50 should be $50");
```

> **In practice:** Not all functions can be pure. Programs must perform I/O, update the DOM, and communicate over networks. The goal is to **isolate** side effects and keep the core logic pure. Functional programming libraries and patterns (like Redux reducers) leverage this approach extensively.
