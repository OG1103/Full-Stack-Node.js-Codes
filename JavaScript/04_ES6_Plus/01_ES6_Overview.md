# ES6+ Overview — A Comprehensive Quick Reference

> **ECMAScript 2015 (ES6)** and its subsequent editions introduced a massive overhaul to the JavaScript language. This file provides a concise yet thorough overview of every major feature. Each topic listed here has its own dedicated deep-dive file where applicable.

---

## Table of Contents

1. [let and const (Block Scoping)](#1-let-and-const-block-scoping)
2. [Arrow Functions](#2-arrow-functions)
3. [Template Literals](#3-template-literals)
4. [Destructuring](#4-destructuring)
5. [Spread and Rest Operators](#5-spread-and-rest-operators)
6. [Default Parameters](#6-default-parameters)
7. [Classes](#7-classes)
8. [Modules (import / export)](#8-modules-import--export)
9. [Promises and async / await](#9-promises-and-async--await)
10. [Symbol, Map, Set, WeakMap, WeakSet](#10-symbol-map-set-weakmap-weakset)
11. [for...of Loop](#11-forof-loop)
12. [Optional Chaining and Nullish Coalescing](#12-optional-chaining-and-nullish-coalescing)

---

## 1. let and const (Block Scoping)

### The Problem with `var`

`var` is **function-scoped** (or globally scoped when declared outside a function). It is also **hoisted** to the top of its scope and initialized with `undefined`, which leads to subtle bugs.

```js
if (true) {
  var x = 10;
}
console.log(x); // 10 — leaked out of the block
```

### `let` — Block-Scoped Variable

- Scoped to the nearest enclosing `{ }` block.
- **Not** initialized during hoisting — accessing it before the declaration throws a `ReferenceError` (Temporal Dead Zone).
- Can be reassigned but not re-declared in the same scope.

```js
if (true) {
  let y = 20;
}
console.log(y); // ReferenceError: y is not defined
```

### `const` — Block-Scoped Constant

- Same block-scoping rules as `let`.
- **Must** be initialized at declaration time.
- The *binding* is immutable — you cannot reassign the variable. However, the **value itself** (if it is an object or array) is still mutable.

```js
const PI = 3.14159;
PI = 3; // TypeError: Assignment to constant variable

const user = { name: "Alice" };
user.name = "Bob"; // Allowed — mutating the object, not the binding
```

### Quick Comparison

| Feature           | `var`            | `let`            | `const`          |
| ----------------- | ---------------- | ---------------- | ---------------- |
| Scope             | Function         | Block            | Block            |
| Hoisting          | Yes (undefined)  | Yes (TDZ)        | Yes (TDZ)        |
| Re-declaration    | Allowed          | Not allowed      | Not allowed      |
| Re-assignment     | Allowed          | Allowed          | Not allowed      |
| Must initialize   | No               | No               | Yes              |

---

## 2. Arrow Functions

Arrow functions provide a shorter syntax and, critically, **do not bind their own `this`** — they inherit `this` from the enclosing lexical scope.

```js
// Traditional function expression
const add = function (a, b) {
  return a + b;
};

// Arrow function equivalent
const addArrow = (a, b) => a + b;

// Single parameter — parentheses optional
const double = n => n * 2;

// No parameters — parentheses required
const greet = () => "Hello!";

// Multi-line body — needs braces and explicit return
const process = (x) => {
  const result = x * 2;
  return result + 1;
};
```

### Lexical `this`

```js
function Timer() {
  this.seconds = 0;

  // Arrow function captures `this` from Timer's constructor
  setInterval(() => {
    this.seconds++;
    console.log(this.seconds);
  }, 1000);
}

const t = new Timer(); // 1, 2, 3, ...
```

### When NOT to Use Arrow Functions

| Scenario                  | Reason                                                        |
| ------------------------- | ------------------------------------------------------------- |
| Object methods            | `this` won't refer to the object                              |
| `prototype` methods       | Same reason — lexical `this`                                  |
| Constructors (`new`)      | Arrow functions cannot be used with `new`                     |
| `arguments` object needed | Arrow functions do not have their own `arguments`             |
| Dynamic context callbacks | e.g., DOM event handlers where `this` should be the element   |

---

## 3. Template Literals

Template literals use **backticks** (`` ` ``) instead of quotes, supporting:

- **String interpolation** via `${expression}`
- **Multi-line strings** without escape characters
- **Tagged templates** for advanced processing

```js
const name = "World";
const greeting = `Hello, ${name}!`; // "Hello, World!"

// Multi-line
const html = `
  <div>
    <h1>${greeting}</h1>
  </div>
`;

// Expressions inside interpolation
const price = 9.99;
const qty = 3;
console.log(`Total: $${(price * qty).toFixed(2)}`); // "Total: $29.97"
```

### Tagged Templates

A **tag function** receives the literal strings and interpolated values separately.

```js
function highlight(strings, ...values) {
  return strings.reduce(
    (result, str, i) => `${result}${str}<mark>${values[i] || ""}</mark>`,
    ""
  );
}

const item = "JavaScript";
const ver = 6;
console.log(highlight`Learning ${item} version ${ver}`);
// "Learning <mark>JavaScript</mark> version <mark>6</mark>"
```

---

## 4. Destructuring

Destructuring extracts values from objects and arrays into distinct variables using a mirror-image syntax of their literal forms.

> **Deep dive:** See `02_Destructuring.md`

### Object Destructuring

```js
const user = { name: "Alice", age: 30, role: "admin" };

const { name, age } = user;
console.log(name); // "Alice"
console.log(age);  // 30

// Renaming + default value
const { role: userRole, country = "US" } = user;
console.log(userRole); // "admin"
console.log(country);  // "US"
```

### Array Destructuring

```js
const rgb = [255, 128, 0];
const [red, green, blue] = rgb;

// Swap
let a = 1, b = 2;
[a, b] = [b, a]; // a = 2, b = 1
```

---

## 5. Spread and Rest Operators

Both use the `...` syntax but serve opposite purposes depending on context.

> **Deep dive:** See `03_Spread_And_Rest.md`

### Rest — Collecting Values

```js
function sum(...nums) {
  return nums.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4); // 10
```

### Spread — Expanding Values

```js
const arr1 = [1, 2];
const arr2 = [3, 4];
const merged = [...arr1, ...arr2]; // [1, 2, 3, 4]

const original = { a: 1, b: 2 };
const clone = { ...original, c: 3 }; // { a: 1, b: 2, c: 3 }
```

---

## 6. Default Parameters

Functions can specify default values for parameters. Defaults are evaluated **at call time**, not at definition time.

```js
function createUser(name, role = "viewer", active = true) {
  return { name, role, active };
}

createUser("Alice");              // { name: "Alice", role: "viewer", active: true }
createUser("Bob", "admin");       // { name: "Bob", role: "admin", active: true }
createUser("Eve", undefined, false); // uses default for role
```

### Defaults Can Reference Earlier Parameters

```js
function createElement(tag, id = tag) {
  return `<${tag} id="${id}"></${tag}>`;
}
createElement("div");       // '<div id="div"></div>'
createElement("div", "app"); // '<div id="app"></div>'
```

### Defaults with Destructuring

```js
function connect({ host = "localhost", port = 3000 } = {}) {
  console.log(`${host}:${port}`);
}
connect();                    // "localhost:3000"
connect({ port: 8080 });     // "localhost:8080"
```

---

## 7. Classes

ES6 classes are **syntactic sugar** over JavaScript's prototype-based inheritance. They provide a cleaner, more intuitive syntax.

> **Deep dive:** See `../05_OOP/01_Classes_And_OOP.md`

```js
class Animal {
  #sound; // private field

  constructor(name, sound) {
    this.name = name;
    this.#sound = sound;
  }

  speak() {
    return `${this.name} says ${this.#sound}`;
  }

  static kingdom() {
    return "Animalia";
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name, "Woof");
  }

  fetch(item) {
    return `${this.name} fetches the ${item}`;
  }
}

const d = new Dog("Rex");
console.log(d.speak());        // "Rex says Woof"
console.log(d.fetch("ball"));  // "Rex fetches the ball"
console.log(Dog.kingdom());    // "Animalia"
```

---

## 8. Modules (import / export)

ES Modules provide a native way to split code into reusable, encapsulated files.

> **Deep dive:** See `04_Modules.md`

```js
// math.js — Named exports
export const PI = 3.14159;
export function add(a, b) { return a + b; }

// logger.js — Default export
export default class Logger {
  log(msg) { console.log(`[LOG] ${msg}`); }
}
```

```js
// app.js — Importing
import Logger from "./logger.js";           // default import
import { PI, add } from "./math.js";        // named imports
import * as MathUtils from "./math.js";     // namespace import

// Dynamic import (code-splitting)
const module = await import("./heavy.js");
```

---

## 9. Promises and async / await

### Promises

A `Promise` represents a value that may be available **now**, **later**, or **never**.

```js
const fetchData = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      success ? resolve({ id: 1, name: "Alice" }) : reject(new Error("Failed"));
    }, 1000);
  });

fetchData()
  .then((data) => console.log(data))
  .catch((err) => console.error(err))
  .finally(() => console.log("Done"));
```

### Promise Combinators

| Method              | Resolves when...                         | Rejects when...                     |
| ------------------- | ---------------------------------------- | ----------------------------------- |
| `Promise.all`       | **All** promises resolve                 | **Any** promise rejects             |
| `Promise.allSettled` | **All** promises settle (resolve/reject) | Never                               |
| `Promise.race`      | **First** promise settles                | **First** promise rejects           |
| `Promise.any`       | **First** promise resolves               | **All** promises reject             |

### async / await

`async`/`await` is syntactic sugar on top of Promises that makes asynchronous code read like synchronous code.

```js
async function getUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Fetch failed:", error);
    throw error;
  }
}
```

---

## 10. Symbol, Map, Set, WeakMap, WeakSet

### Symbol

A **Symbol** is a unique, immutable primitive value used primarily as object property keys to avoid name collisions.

```js
const id = Symbol("id");
const user = { [id]: 123, name: "Alice" };

console.log(user[id]);        // 123
console.log(Object.keys(user)); // ["name"] — Symbols are not enumerable

// Well-known Symbols
class MyArray {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}
console.log([] instanceof MyArray); // true
```

### Map

A `Map` holds key-value pairs where **keys can be any type** (unlike plain objects, whose keys are always strings or Symbols).

```js
const map = new Map();
const objKey = { id: 1 };

map.set("name", "Alice");
map.set(objKey, "object key value");
map.set(42, "numeric key");

console.log(map.get(objKey)); // "object key value"
console.log(map.size);        // 3
console.log(map.has(42));     // true

for (const [key, value] of map) {
  console.log(key, "=>", value);
}
```

### Set

A `Set` stores **unique values** of any type.

```js
const set = new Set([1, 2, 3, 3, 2, 1]);
console.log(set);       // Set { 1, 2, 3 }
console.log(set.size);  // 3

set.add(4);
set.delete(2);
console.log(set.has(3)); // true

// Deduplicate an array
const unique = [...new Set([1, 1, 2, 3, 3])]; // [1, 2, 3]
```

### WeakMap and WeakSet

| Feature        | `Map` / `Set`     | `WeakMap` / `WeakSet`                       |
| -------------- | ----------------- | ------------------------------------------- |
| Key types      | Any               | Objects only (WeakMap keys / WeakSet values) |
| Garbage collection | Keys held strongly | Keys held **weakly** — GC can collect them |
| Iterable       | Yes               | No                                          |
| `.size`        | Available         | Not available                               |
| Use case       | General storage   | Caching, private data, metadata on objects  |

```js
const weakMap = new WeakMap();
let element = document.querySelector("#app");
weakMap.set(element, { clicks: 0 });

// When `element` is removed from the DOM and no other references exist,
// the WeakMap entry becomes eligible for garbage collection automatically.
```

---

## 11. for...of Loop

The `for...of` statement iterates over **iterable** objects (Array, String, Map, Set, NodeList, generators, etc.).

```js
// Array
for (const item of [10, 20, 30]) {
  console.log(item); // 10, 20, 30
}

// String
for (const char of "Hello") {
  console.log(char); // H, e, l, l, o
}

// Map
const map = new Map([["a", 1], ["b", 2]]);
for (const [key, value] of map) {
  console.log(key, value); // a 1, b 2
}

// Set
for (const val of new Set([1, 2, 3])) {
  console.log(val); // 1, 2, 3
}
```

### for...of vs for...in

| Feature         | `for...of`                          | `for...in`                          |
| --------------- | ----------------------------------- | ----------------------------------- |
| Iterates over   | **Values** of iterable objects      | **Keys** (property names) of objects |
| Works with      | Arrays, Strings, Maps, Sets, etc.   | Plain objects (and arrays — inadvisable) |
| Includes inherited? | No                              | Yes — includes enumerable prototype properties |
| Order guarantee | Insertion order for most iterables  | Not guaranteed for integer-like keys |

---

## 12. Optional Chaining and Nullish Coalescing

### Optional Chaining (`?.`)

Safely access deeply nested properties without manual null checks at every level. Returns `undefined` if any link in the chain is `null` or `undefined`.

```js
const user = {
  name: "Alice",
  address: {
    street: "123 Main St",
  },
};

console.log(user.address?.street);    // "123 Main St"
console.log(user.address?.zip);       // undefined
console.log(user.phone?.mobile);      // undefined (no error)

// With methods
console.log(user.getName?.());        // undefined (method doesn't exist)

// With arrays / bracket notation
const arr = null;
console.log(arr?.[0]);                // undefined

// Chaining multiple levels
const company = {};
console.log(company?.departments?.[0]?.manager?.name); // undefined
```

### Nullish Coalescing (`??`)

Returns the right-hand operand when the left-hand operand is `null` or `undefined` (but **not** for other falsy values like `0`, `""`, or `false`).

```js
const count = 0;
console.log(count || 10);  // 10 — Wrong! 0 is falsy
console.log(count ?? 10);  // 0  — Correct! 0 is not null/undefined

const name = "";
console.log(name || "Anonymous");  // "Anonymous" — might not be desired
console.log(name ?? "Anonymous");  // "" — correct if empty string is intentional

const config = null;
console.log(config ?? { debug: false }); // { debug: false }
```

### Combining Optional Chaining with Nullish Coalescing

```js
const user = { settings: { theme: null } };

// Safely access nested value with a fallback
const theme = user.settings?.theme ?? "dark";
console.log(theme); // "dark" (because theme is null)

const fontSize = user.settings?.fontSize ?? 16;
console.log(fontSize); // 16 (because fontSize is undefined)
```

### Nullish Coalescing Assignment (`??=`)

```js
let a = null;
a ??= 42;
console.log(a); // 42

let b = 0;
b ??= 42;
console.log(b); // 0 — not overwritten because 0 is not nullish
```

---

## ES6+ Feature Timeline Summary

| Year | Edition | Key Features |
| ---- | ------- | ------------ |
| 2015 | ES6 / ES2015 | `let`, `const`, arrow functions, classes, modules, Promises, template literals, destructuring, spread/rest, `Symbol`, `Map`, `Set`, `for...of`, generators, iterators, default parameters |
| 2016 | ES2016 | `Array.prototype.includes()`, exponentiation operator (`**`) |
| 2017 | ES2017 | `async`/`await`, `Object.entries()`, `Object.values()`, string padding |
| 2018 | ES2018 | Rest/spread for objects, `Promise.finally()`, async iteration |
| 2019 | ES2019 | `Array.flat()`, `Array.flatMap()`, `Object.fromEntries()`, optional `catch` binding |
| 2020 | ES2020 | Optional chaining (`?.`), nullish coalescing (`??`), `BigInt`, `Promise.allSettled()`, `globalThis` |
| 2021 | ES2021 | `String.replaceAll()`, `Promise.any()`, logical assignment operators (`??=`, `&&=`, `\|\|=`), numeric separators |
| 2022 | ES2022 | Class private fields (`#`), `Array.at()`, top-level `await`, `Object.hasOwn()`, error `.cause` |
| 2023 | ES2023 | `Array.findLast()`, `Array.findLastIndex()`, hashbang grammar, `WeakMap` keys for Symbols |
| 2024 | ES2024 | `Object.groupBy()`, `Map.groupBy()`, `Promise.withResolvers()`, `ArrayBuffer.resize()` |

---

## Further Reading

- `02_Destructuring.md` — Deep dive into destructuring patterns
- `03_Spread_And_Rest.md` — Deep dive into spread and rest operators
- `04_Modules.md` — Deep dive into ES Modules and CommonJS
- `05_Regular_Expressions.md` — Complete guide to regular expressions in JavaScript
- `../05_OOP/01_Classes_And_OOP.md` — Deep dive into classes and OOP principles
