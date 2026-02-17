# Spread and Rest Operators — Complete Guide

> The `...` (three dots) syntax serves two opposite roles in JavaScript depending on **context**: the **spread** operator expands an iterable or object into individual elements, while the **rest** parameter/pattern collects multiple elements into a single array or object.

---

## Table of Contents

1. [Rest Parameter (`...args`)](#1-rest-parameter-args)
   - [Basic Syntax](#11-basic-syntax)
   - [Must Be the Last Parameter](#12-must-be-the-last-parameter)
   - [Rest vs `arguments` Object](#13-rest-vs-the-arguments-object)
   - [Rest with Destructuring](#14-rest-with-destructuring)
2. [Spread Operator for Arrays](#2-spread-operator-for-arrays)
   - [Copying Arrays](#21-copying-arrays-shallow-clone)
   - [Merging Arrays](#22-merging-arrays)
   - [Converting Iterables to Arrays](#23-converting-iterables-to-arrays)
   - [Inserting into Arrays](#24-inserting-elements-into-arrays)
3. [Spread Operator for Objects](#3-spread-operator-for-objects)
   - [Copying Objects](#31-copying-objects-shallow-clone)
   - [Merging Objects](#32-merging-objects)
   - [Overriding Properties](#33-overriding-properties)
   - [Conditional Properties](#34-conditional-properties-with-spread)
4. [Spread for Strings](#4-spread-for-strings)
5. [Spread in Function Calls](#5-spread-in-function-calls)
6. [Rest vs Spread — Comparison](#6-rest-vs-spread--comparison)
7. [Advanced Patterns](#7-advanced-patterns)
8. [Common Pitfalls](#8-common-pitfalls)

---

## 1. Rest Parameter (`...args`)

The **rest parameter** syntax allows a function to accept an indefinite number of arguments as an **array**.

### 1.1 Basic Syntax

```js
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3));       // 6
console.log(sum(10, 20, 30, 40)); // 100
console.log(sum());               // 0

// `numbers` is a real Array
function inspect(...args) {
  console.log(Array.isArray(args)); // true
  console.log(args.length);
}
inspect("a", "b", "c"); // true, 3
```

### Collecting Remaining Arguments

The rest parameter can be combined with named parameters to capture "the rest":

```js
function logMessage(level, timestamp, ...messages) {
  console.log(`[${level}] ${timestamp}`);
  messages.forEach((msg) => console.log(`  - ${msg}`));
}

logMessage("ERROR", "2024-01-15T10:30:00", "Disk full", "Cannot write logs", "Retrying...");
// [ERROR] 2024-01-15T10:30:00
//   - Disk full
//   - Cannot write logs
//   - Retrying...
```

### 1.2 Must Be the Last Parameter

The rest parameter **must** be the last parameter in the function signature. Placing it elsewhere results in a `SyntaxError`.

```js
// Correct
function valid(a, b, ...rest) { }

// SyntaxError: Rest parameter must be last formal parameter
// function invalid(...rest, a, b) { }

// SyntaxError: Can only have one rest parameter
// function alsoInvalid(...a, ...b) { }
```

### 1.3 Rest vs the `arguments` Object

Before rest parameters, the `arguments` object was the only way to access variable-length arguments. However, `arguments` has several disadvantages:

| Feature | Rest Parameter (`...args`) | `arguments` Object |
| ------- | -------------------------- | ------------------- |
| Type | Real `Array` | Array-like object (not a true Array) |
| Array methods | `.map()`, `.filter()`, `.reduce()`, etc. | None — must convert first |
| Arrow functions | Works | Not available in arrow functions |
| Named subset | `(a, b, ...rest)` collects only remaining | Contains ALL arguments including named ones |
| Clarity | Explicitly declared in signature | Implicit, hidden |
| `length` reflects | Only collected args | All args |

```js
// Old way — using arguments
function oldSum() {
  // arguments is array-like, not a real array
  const args = Array.prototype.slice.call(arguments); // or Array.from(arguments)
  return args.reduce((total, n) => total + n, 0);
}

// Modern way — using rest
function newSum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

// Arrow functions do NOT have arguments
const arrowFn = () => {
  // console.log(arguments); // ReferenceError
};

const arrowFnRest = (...args) => {
  console.log(args); // Works!
};
```

### Converting `arguments` to a Real Array (Legacy Code)

```js
// Method 1: Array.from()
function example1() {
  const args = Array.from(arguments);
  return args;
}

// Method 2: Spread
function example2() {
  const args = [...arguments];
  return args;
}

// Method 3: Array.prototype.slice (oldest approach)
function example3() {
  const args = Array.prototype.slice.call(arguments);
  return args;
}
```

### 1.4 Rest with Destructuring

#### In Array Destructuring

```js
const [first, second, ...others] = [1, 2, 3, 4, 5];

console.log(first);  // 1
console.log(second); // 2
console.log(others); // [3, 4, 5]
```

#### In Object Destructuring

```js
const user = { id: 1, name: "Alice", email: "alice@test.com", role: "admin" };

const { id, ...userDetails } = user;

console.log(id);          // 1
console.log(userDetails); // { name: "Alice", email: "alice@test.com", role: "admin" }
```

---

## 2. Spread Operator for Arrays

The spread operator **expands** an iterable into individual elements.

### 2.1 Copying Arrays (Shallow Clone)

```js
const original = [1, 2, 3];
const copy = [...original];

copy.push(4);
console.log(original); // [1, 2, 3] — unchanged
console.log(copy);     // [1, 2, 3, 4]
```

**Warning: Shallow copy only.** Nested objects/arrays share the same reference:

```js
const nested = [{ a: 1 }, { b: 2 }];
const shallowCopy = [...nested];

shallowCopy[0].a = 999;
console.log(nested[0].a); // 999 — the inner object was mutated!
```

### 2.2 Merging Arrays

```js
const frontend = ["React", "Vue", "Angular"];
const backend = ["Node", "Django", "Rails"];
const fullstack = [...frontend, ...backend];

console.log(fullstack);
// ["React", "Vue", "Angular", "Node", "Django", "Rails"]

// With additional elements
const all = ["HTML", ...frontend, "Express", ...backend, "Docker"];
console.log(all);
// ["HTML", "React", "Vue", "Angular", "Express", "Node", "Django", "Rails", "Docker"]
```

### Merging with Deduplication

```js
const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];

const unique = [...new Set([...arr1, ...arr2])];
console.log(unique); // [1, 2, 3, 4, 5, 6]
```

### 2.3 Converting Iterables to Arrays

Spread works with **any iterable** — strings, Sets, Maps, NodeLists, generators, etc.

```js
// Set to Array
const mySet = new Set([1, 2, 3]);
const arrFromSet = [...mySet]; // [1, 2, 3]

// Map to Array (of [key, value] pairs)
const myMap = new Map([["a", 1], ["b", 2]]);
const arrFromMap = [...myMap]; // [["a", 1], ["b", 2]]

// NodeList to Array (browser)
// const divs = [...document.querySelectorAll("div")];

// Generator to Array
function* range(start, end) {
  for (let i = start; i <= end; i++) yield i;
}
const nums = [...range(1, 5)]; // [1, 2, 3, 4, 5]

// arguments to Array
function toArray() {
  return [...arguments];
}
console.log(toArray(1, 2, 3)); // [1, 2, 3]
```

### 2.4 Inserting Elements into Arrays

```js
const original = [1, 2, 5, 6];

// Insert elements at a specific position
const withInsert = [...original.slice(0, 2), 3, 4, ...original.slice(2)];
console.log(withInsert); // [1, 2, 3, 4, 5, 6]

// Prepend
const prepended = [0, ...original];
console.log(prepended); // [0, 1, 2, 5, 6]

// Append
const appended = [...original, 7, 8];
console.log(appended); // [1, 2, 5, 6, 7, 8]
```

---

## 3. Spread Operator for Objects

Object spread was introduced in **ES2018** and is now universally supported.

### 3.1 Copying Objects (Shallow Clone)

```js
const original = { name: "Alice", age: 30 };
const copy = { ...original };

copy.name = "Bob";
console.log(original.name); // "Alice" — unchanged
console.log(copy.name);     // "Bob"
```

### 3.2 Merging Objects

```js
const defaults = {
  theme: "light",
  language: "en",
  notifications: true,
};

const userPrefs = {
  theme: "dark",
  fontSize: 16,
};

const merged = { ...defaults, ...userPrefs };

console.log(merged);
// {
//   theme: "dark",          // overridden by userPrefs
//   language: "en",         // from defaults
//   notifications: true,    // from defaults
//   fontSize: 16            // from userPrefs
// }
```

### 3.3 Overriding Properties

**The last spread wins** — properties from later spreads override earlier ones.

```js
const base = { a: 1, b: 2, c: 3 };

// Override specific properties
const modified = { ...base, b: 20, c: 30 };
console.log(modified); // { a: 1, b: 20, c: 30 }

// Multiple overrides — last spread wins
const obj1 = { x: 1, y: 2 };
const obj2 = { y: 3, z: 4 };
const obj3 = { z: 5 };

const result = { ...obj1, ...obj2, ...obj3 };
console.log(result); // { x: 1, y: 3, z: 5 }
```

### Common Pattern: Defaults + Overrides

```js
function createConfig(options) {
  const defaults = {
    host: "localhost",
    port: 3000,
    debug: false,
    timeout: 5000,
  };

  // User options override defaults
  return { ...defaults, ...options };
}

const config = createConfig({ port: 8080, debug: true });
console.log(config);
// { host: "localhost", port: 8080, debug: true, timeout: 5000 }
```

### 3.4 Conditional Properties with Spread

A powerful pattern for conditionally including properties.

```js
const includeEmail = true;
const includePhone = false;

const user = {
  name: "Alice",
  ...(includeEmail && { email: "alice@test.com" }),
  ...(includePhone && { phone: "555-0123" }),
};

console.log(user);
// { name: "Alice", email: "alice@test.com" }
// phone is NOT included because `false` spreads to nothing
```

> **How it works:** `false && { ... }` evaluates to `false`. Spreading `false` (or any non-object primitive) into an object literal is a no-op — it simply does nothing.

### Adding / Removing Properties Immutably

```js
const user = { id: 1, name: "Alice", password: "secret" };

// Add a property
const withRole = { ...user, role: "admin" };
console.log(withRole); // { id: 1, name: "Alice", password: "secret", role: "admin" }

// Remove a property (using rest destructuring)
const { password, ...safeUser } = user;
console.log(safeUser); // { id: 1, name: "Alice" }
```

---

## 4. Spread for Strings

When spread is used on a string, it splits the string into individual characters.

```js
const greeting = "Hello";
const chars = [...greeting];

console.log(chars); // ["H", "e", "l", "l", "o"]
console.log(chars.length); // 5
```

### Handling Unicode Properly

Spread handles multi-byte Unicode characters correctly, unlike `string.split("")`:

```js
const emoji = "Hello 🌍!";

// split("") breaks surrogate pairs
console.log(emoji.split("").length); // 9 (wrong for emoji)

// Spread handles Unicode correctly
console.log([...emoji].length); // 8 (correct)
console.log([...emoji]); // ["H", "e", "l", "l", "o", " ", "🌍", "!"]
```

### Practical Example: Reverse a String (Unicode-Safe)

```js
function reverseString(str) {
  return [...str].reverse().join("");
}

console.log(reverseString("Hello"));  // "olleH"
console.log(reverseString("Hello 🌍")); // "🌍 olleH" (correct!)
```

---

## 5. Spread in Function Calls

Spread can pass array elements as individual arguments to a function.

### Basic Usage

```js
const numbers = [3, 1, 4, 1, 5, 9];

// Without spread
console.log(Math.max.apply(null, numbers)); // 9

// With spread — much cleaner
console.log(Math.max(...numbers)); // 9
console.log(Math.min(...numbers)); // 1
```

### Multiple Spreads in One Call

```js
const first = [1, 2, 3];
const second = [4, 5, 6];

console.log(Math.max(...first, ...second)); // 6
console.log(Math.max(...first, 100, ...second)); // 100
```

### With `new` Constructor

```js
const dateArgs = [2024, 0, 15]; // Jan 15, 2024

// Cannot use apply with new — but spread works!
const date = new Date(...dateArgs);
console.log(date); // Mon Jan 15 2024
```

### Passing Object Methods

```js
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const args = ["Hello", "!"];
const user = { name: "Alice" };

// Using apply
console.log(greet.apply(user, args)); // "Hello, Alice!"

// Using spread with call
console.log(greet.call(user, ...args)); // "Hello, Alice!"
```

---

## 6. Rest vs Spread — Comparison

The `...` syntax looks identical but behaves **oppositely** based on context:

| Aspect | Rest | Spread |
| ------ | ---- | ------ |
| **Context** | In function parameters or destructuring patterns (left-hand side) | In function calls, array/object literals (right-hand side) |
| **Action** | **Collects** multiple elements into one array/object | **Expands** one array/object into multiple elements |
| **Position** | Must be **last** in parameter list / destructuring | Can appear **anywhere** |
| **Creates** | A new array or object | Individual values |

### Visual Comparison

```js
// ============ REST: Collecting ============

// In function parameters: collects remaining args into an array
function example(a, b, ...rest) {
  //                    ^^^^^^^ REST — collects [3, 4, 5]
  console.log(rest); // [3, 4, 5]
}
example(1, 2, 3, 4, 5);

// In destructuring: collects remaining elements/properties
const [first, ...others] = [10, 20, 30];
//            ^^^^^^^^^^ REST — collects [20, 30]

const { name, ...meta } = { name: "Alice", age: 30, role: "admin" };
//            ^^^^^^^^ REST — collects { age: 30, role: "admin" }


// ============ SPREAD: Expanding ============

// In function calls: expands array into individual arguments
const nums = [1, 2, 3];
Math.max(...nums);
//       ^^^^^^^^ SPREAD — expands to Math.max(1, 2, 3)

// In array literals: expands into individual elements
const merged = [...nums, 4, 5];
//              ^^^^^^^^ SPREAD — expands to [1, 2, 3, 4, 5]

// In object literals: expands into individual properties
const obj = { ...{ a: 1, b: 2 }, c: 3 };
//            ^^^^^^^^^^^^^^^^^^^^ SPREAD — expands to { a: 1, b: 2, c: 3 }
```

### A Single Expression Using Both

```js
function collectAndExpand(first, ...rest) {
  //                             ^^^^^^^ REST: collects remaining args
  return [first, ...rest.map((x) => x * 2)];
  //              ^^^^^^^^^^^^^^^^^^^^^^^^^ SPREAD: expands the mapped array
}

console.log(collectAndExpand(1, 2, 3, 4));
// [1, 4, 6, 8]
```

---

## 7. Advanced Patterns

### 7.1 Deep Clone (Spread + JSON — Simple Cases)

```js
const original = {
  name: "Alice",
  address: { city: "NYC", zip: "10001" },
  scores: [90, 85, 92],
};

// Spread only does shallow copy — nested objects are shared
const shallow = { ...original };
shallow.address.city = "LA";
console.log(original.address.city); // "LA" — mutated!

// For deep clone (simple cases without functions, Dates, etc.)
const deep = JSON.parse(JSON.stringify(original));
deep.address.city = "SF";
console.log(original.address.city); // "LA" — unaffected

// Modern approach (Node 17+ / modern browsers)
const deep2 = structuredClone(original);
```

### 7.2 Pipeline / Compose with Spread

```js
function pipe(...fns) {
  return (input) => fns.reduce((acc, fn) => fn(acc), input);
}

const double = (x) => x * 2;
const addTen = (x) => x + 10;
const square = (x) => x * x;

const transform = pipe(double, addTen, square);
console.log(transform(3)); // ((3 * 2) + 10)^2 = 256
```

### 7.3 Immutable Array Operations

```js
const todos = [
  { id: 1, text: "Learn JS", done: false },
  { id: 2, text: "Learn React", done: false },
  { id: 3, text: "Build App", done: false },
];

// Add item (immutable)
const added = [...todos, { id: 4, text: "Deploy", done: false }];

// Remove item by id (immutable)
const removed = todos.filter((t) => t.id !== 2);

// Update item by id (immutable)
const updated = todos.map((t) =>
  t.id === 1 ? { ...t, done: true } : t
);

// Replace item at index (immutable)
const index = 1;
const replaced = [
  ...todos.slice(0, index),
  { id: 2, text: "Learn Vue", done: false },
  ...todos.slice(index + 1),
];
```

### 7.4 Merging Config Objects with Nested Overrides

```js
function deepMerge(target, ...sources) {
  for (const source of sources) {
    for (const key of Object.keys(source)) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key]) &&
        target[key] &&
        typeof target[key] === "object"
      ) {
        target[key] = deepMerge({ ...target[key] }, source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

const defaults = {
  server: { host: "localhost", port: 3000 },
  logging: { level: "info", file: "app.log" },
};

const overrides = {
  server: { port: 8080 },
  logging: { level: "debug" },
};

const config = deepMerge({}, defaults, overrides);
console.log(config);
// {
//   server: { host: "localhost", port: 8080 },
//   logging: { level: "debug", file: "app.log" }
// }
```

---

## 8. Common Pitfalls

### 8.1 Shallow Copy Trap

Both array and object spread create **shallow copies**. Nested references are shared.

```js
const original = { data: [1, 2, 3] };
const copy = { ...original };

copy.data.push(4);
console.log(original.data); // [1, 2, 3, 4] — oops, mutated!

// Fix: also spread the nested array
const safeCopy = { ...original, data: [...original.data] };
safeCopy.data.push(5);
console.log(original.data); // [1, 2, 3, 4] — not mutated
```

### 8.2 Spread of `null` and `undefined`

- **Array spread:** Throws `TypeError` — `null` and `undefined` are not iterable.
- **Object spread:** Silently does nothing.

```js
// Array context
// const arr = [...null];      // TypeError: null is not iterable
// const arr2 = [...undefined]; // TypeError: undefined is not iterable

// Object context — safe
const obj1 = { ...null };      // {}
const obj2 = { ...undefined }; // {}
```

### 8.3 Spread Order Matters for Objects

```js
// Defaults first, overrides second
const safe = { ...defaults, ...userOptions }; // user options win

// Wrong order — defaults override user options
const wrong = { ...userOptions, ...defaults }; // defaults always win
```

### 8.4 Performance with Very Large Arrays

Spreading very large arrays creates new arrays in memory. For performance-critical code, consider alternatives:

```js
// Instead of spreading to concatenate huge arrays:
const huge1 = new Array(1_000_000).fill(0);
const huge2 = new Array(1_000_000).fill(1);

// Avoid: const merged = [...huge1, ...huge2]; // 2 million element copy

// Better for large data:
const merged = huge1.concat(huge2); // More memory-efficient in many engines
```

### 8.5 Rest Parameter `length`

The rest parameter is **not counted** in the function's `.length` property:

```js
function example(a, b, ...rest) {}
console.log(example.length); // 2 (only a and b counted)
```

---

## Summary

| Pattern | Syntax | Context | Effect |
| ------- | ------ | ------- | ------ |
| Rest in params | `function f(...args)` | Function definition | Collects args into array |
| Rest in array destructuring | `[a, ...rest] = arr` | Destructuring | Collects remaining elements |
| Rest in object destructuring | `{a, ...rest} = obj` | Destructuring | Collects remaining properties |
| Spread in array literal | `[...arr1, ...arr2]` | Array creation | Expands elements |
| Spread in object literal | `{...obj1, ...obj2}` | Object creation | Expands properties |
| Spread in function call | `fn(...arr)` | Function invocation | Expands args |
| Spread on string | `[..."hello"]` | Array creation | Splits into characters |
