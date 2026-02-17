# Destructuring in JavaScript — Complete Guide

> Destructuring is a concise syntax for extracting values from arrays and properties from objects into distinct variables. It mirrors the structure of array literals and object literals, making code more readable and reducing boilerplate.

---

## Table of Contents

1. [Object Destructuring](#1-object-destructuring)
   - [Basic Syntax](#11-basic-syntax)
   - [Renaming Variables](#12-renaming-variables-aliasing)
   - [Default Values](#13-default-values)
   - [Nested Object Destructuring](#14-nested-object-destructuring)
   - [Destructuring an Already-Declared Variable](#15-destructuring-into-already-declared-variables)
2. [Array Destructuring](#2-array-destructuring)
   - [Basic Syntax](#21-basic-syntax)
   - [Skipping Elements](#22-skipping-elements)
   - [Default Values](#23-default-values)
   - [Swapping Variables](#24-swapping-variables)
   - [Destructuring from Functions](#25-destructuring-return-values-from-functions)
3. [Mixed Destructuring](#3-mixed-destructuring)
4. [Destructuring in Function Parameters](#4-destructuring-in-function-parameters)
5. [Rest Pattern in Destructuring](#5-rest-pattern-in-destructuring)
6. [Computed Property Names](#6-computed-property-names-in-destructuring)
7. [Real-World Use Cases](#7-real-world-use-cases)
8. [Common Pitfalls](#8-common-pitfalls)

---

## 1. Object Destructuring

### 1.1 Basic Syntax

Object destructuring uses `{ }` on the left-hand side of an assignment. Variable names must **match** the property names of the object (by default).

```js
const person = {
  name: "Alice",
  age: 30,
  role: "engineer",
};

// Without destructuring
const name = person.name;
const age = person.age;

// With destructuring
const { name, age, role } = person;

console.log(name); // "Alice"
console.log(age);  // 30
console.log(role); // "engineer"
```

**Order does not matter** — object destructuring matches by property name, not position:

```js
const { role, name } = person; // Still works correctly
console.log(role); // "engineer"
console.log(name); // "Alice"
```

### 1.2 Renaming Variables (Aliasing)

Use the syntax `propertyName: newVariableName` to assign the value to a differently named variable.

```js
const response = {
  status: 200,
  data: { users: [] },
  error: null,
};

const { status: httpStatus, data: payload, error: err } = response;

console.log(httpStatus); // 200
console.log(payload);    // { users: [] }
console.log(err);        // null
// console.log(status);  // ReferenceError — `status` was not created
```

### 1.3 Default Values

When the destructured property is `undefined`, a default value kicks in.

```js
const config = {
  host: "localhost",
  port: 8080,
};

const { host, port, protocol = "https", retries = 3 } = config;

console.log(host);     // "localhost"
console.log(port);     // 8080
console.log(protocol); // "https" (default used — property missing)
console.log(retries);  // 3       (default used — property missing)
```

**Important:** Defaults are only applied when the value is `undefined`, **not** when it is `null` or other falsy values.

```js
const obj = { a: null, b: 0, c: "", d: false, e: undefined };

const { a = 1, b = 1, c = "default", d = true, e = 42 } = obj;

console.log(a); // null      — NOT the default
console.log(b); // 0         — NOT the default
console.log(c); // ""        — NOT the default
console.log(d); // false     — NOT the default
console.log(e); // 42        — default IS applied (value was undefined)
```

### Combining Renaming and Defaults

```js
const options = { width: 100 };

const { width: w = 640, height: h = 480 } = options;

console.log(w); // 100 (from object)
console.log(h); // 480 (default — property missing)
```

### 1.4 Nested Object Destructuring

Reach into nested structures by mirroring the nesting with `{ }`.

```js
const employee = {
  id: 101,
  name: "Bob",
  department: {
    name: "Engineering",
    location: {
      building: "A",
      floor: 3,
    },
  },
};

const {
  name: empName,
  department: {
    name: deptName,
    location: { building, floor },
  },
} = employee;

console.log(empName);  // "Bob"
console.log(deptName); // "Engineering"
console.log(building); // "A"
console.log(floor);    // 3
```

> **Note:** The intermediate variables (`department`, `location`) are **not** created. Only the leaf variables (`deptName`, `building`, `floor`) exist.

### Nested with Defaults

```js
const theme = {
  colors: {
    primary: "#007bff",
  },
};

const {
  colors: {
    primary = "#000",
    secondary = "#666",
    background = "#fff",
  } = {},
} = theme;

console.log(primary);    // "#007bff"
console.log(secondary);  // "#666"
console.log(background); // "#fff"
```

### 1.5 Destructuring into Already-Declared Variables

When destructuring into variables that already exist, you must wrap the statement in parentheses (otherwise the `{` is interpreted as a block statement).

```js
let name, age;

// Without parentheses: SyntaxError
// { name, age } = { name: "Alice", age: 30 };

// Correct — wrap in parentheses
({ name, age } = { name: "Alice", age: 30 });

console.log(name); // "Alice"
console.log(age);  // 30
```

---

## 2. Array Destructuring

### 2.1 Basic Syntax

Array destructuring uses `[ ]` on the left-hand side. Assignment is **positional** — the first variable gets the first element, the second variable gets the second, and so on.

```js
const colors = ["red", "green", "blue"];

const [first, second, third] = colors;

console.log(first);  // "red"
console.log(second); // "green"
console.log(third);  // "blue"
```

### Works with Any Iterable

Array destructuring works with any iterable (strings, Sets, Maps, generators):

```js
// String
const [a, b, c] = "Hey";
console.log(a, b, c); // "H" "e" "y"

// Set
const [x, y] = new Set([10, 20, 30]);
console.log(x, y); // 10 20

// Map
const [entry1, entry2] = new Map([["a", 1], ["b", 2]]);
console.log(entry1); // ["a", 1]
console.log(entry2); // ["b", 2]
```

### 2.2 Skipping Elements

Leave a "hole" (comma placeholder) to skip elements you don't need.

```js
const numbers = [1, 2, 3, 4, 5];

const [, second, , fourth] = numbers;
console.log(second); // 2
console.log(fourth); // 4

// Get only the third element
const [, , third] = numbers;
console.log(third); // 3
```

### 2.3 Default Values

Just like object destructuring, defaults apply when the value is `undefined`.

```js
const partial = [1];

const [a, b = 10, c = 20] = partial;

console.log(a); // 1
console.log(b); // 10 (default — index 1 is undefined)
console.log(c); // 20 (default — index 2 is undefined)
```

### 2.4 Swapping Variables

A classic use case — swap without a temporary variable.

```js
let x = 1;
let y = 2;

[x, y] = [y, x];

console.log(x); // 2
console.log(y); // 1

// Works for more than two variables
let a = 1, b = 2, c = 3;
[a, b, c] = [c, a, b];
console.log(a, b, c); // 3 1 2
```

### 2.5 Destructuring Return Values from Functions

Very common when functions return arrays (e.g., React's `useState`).

```js
function getMinMax(arr) {
  return [Math.min(...arr), Math.max(...arr)];
}

const [min, max] = getMinMax([3, 1, 4, 1, 5, 9]);
console.log(min); // 1
console.log(max); // 9
```

```js
// React-style hook pattern
function useState(initialValue) {
  let value = initialValue;
  const getter = () => value;
  const setter = (newVal) => { value = newVal; };
  return [getter, setter];
}

const [getCount, setCount] = useState(0);
console.log(getCount()); // 0
setCount(5);
console.log(getCount()); // 5
```

---

## 3. Mixed Destructuring

Real-world data often mixes objects and arrays. Destructuring handles this seamlessly.

### Object Containing Arrays

```js
const student = {
  name: "Charlie",
  scores: [85, 92, 78, 95],
  contact: {
    emails: ["charlie@work.com", "charlie@personal.com"],
  },
};

const {
  name,
  scores: [firstScore, ...otherScores],
  contact: {
    emails: [primaryEmail],
  },
} = student;

console.log(name);         // "Charlie"
console.log(firstScore);   // 85
console.log(otherScores);  // [92, 78, 95]
console.log(primaryEmail); // "charlie@work.com"
```

### Array Containing Objects

```js
const users = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "editor" },
  { id: 3, name: "Charlie", role: "viewer" },
];

const [{ name: firstName }, , { role: thirdRole }] = users;

console.log(firstName); // "Alice"
console.log(thirdRole); // "viewer"
```

### Deeply Nested Mixed Structures

```js
const apiResponse = {
  status: 200,
  data: {
    results: [
      {
        id: 1,
        attributes: {
          title: "Post 1",
          tags: ["js", "es6"],
        },
      },
    ],
    pagination: {
      page: 1,
      total: 42,
    },
  },
};

const {
  data: {
    results: [
      {
        id,
        attributes: {
          title,
          tags: [firstTag],
        },
      },
    ],
    pagination: { page, total },
  },
} = apiResponse;

console.log(id);       // 1
console.log(title);    // "Post 1"
console.log(firstTag); // "js"
console.log(page);     // 1
console.log(total);    // 42
```

---

## 4. Destructuring in Function Parameters

### Object Parameters

Instead of accepting many positional arguments, accept a single options object and destructure it in the parameter list.

```js
// Without destructuring — hard to remember parameter order
function createUser(name, age, role, active) { /* ... */ }

// With destructuring — self-documenting, order-independent
function createUser({ name, age, role = "viewer", active = true }) {
  return { name, age, role, active };
}

createUser({ name: "Alice", age: 30 });
// { name: "Alice", age: 30, role: "viewer", active: true }
```

### With a Fallback Default for the Entire Parameter

```js
function configure({ host = "localhost", port = 3000, debug = false } = {}) {
  console.log(`Server: ${host}:${port}, debug: ${debug}`);
}

configure();                    // "Server: localhost:3000, debug: false"
configure({ port: 8080 });     // "Server: localhost:8080, debug: false"
configure({ debug: true });    // "Server: localhost:3000, debug: true"
```

### Array Parameters

```js
function getDistance([x1, y1], [x2, y2]) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

console.log(getDistance([0, 0], [3, 4])); // 5
```

### Nested Destructuring in Parameters

```js
function renderUser({
  name,
  address: { city, zip } = {},
  preferences: { theme = "light" } = {},
} = {}) {
  return `${name} from ${city} ${zip} (${theme} mode)`;
}

renderUser({
  name: "Alice",
  address: { city: "NYC", zip: "10001" },
});
// "Alice from NYC 10001 (light mode)"
```

---

## 5. Rest Pattern in Destructuring

The rest element (`...`) collects the remaining properties (objects) or elements (arrays) into a new variable.

### Rest in Array Destructuring

```js
const numbers = [1, 2, 3, 4, 5, 6];

const [first, second, ...remaining] = numbers;

console.log(first);     // 1
console.log(second);    // 2
console.log(remaining); // [3, 4, 5, 6]
```

### Rest in Object Destructuring

```js
const user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  role: "admin",
  lastLogin: "2024-01-15",
};

const { id, name, ...metadata } = user;

console.log(id);       // 1
console.log(name);     // "Alice"
console.log(metadata); // { email: "alice@example.com", role: "admin", lastLogin: "2024-01-15" }
```

### Using Rest to Remove a Property (Immutably)

A common pattern to create a copy of an object without certain properties:

```js
const original = { a: 1, b: 2, c: 3, d: 4 };

const { b, d, ...withoutBandD } = original;

console.log(withoutBandD); // { a: 1, c: 3 }
// original is unchanged
```

### Rules for Rest

| Rule | Description |
| ---- | ----------- |
| Must be last | The rest element must be the **last** element in the destructuring pattern |
| Only one | You can only have **one** rest element per destructuring level |
| Creates a new object/array | The rest element always creates a **new** array or object (shallow copy) |

```js
// SyntaxError — rest must be last
// const [...first, last] = [1, 2, 3];

// SyntaxError — only one rest element allowed
// const [a, ...b, ...c] = [1, 2, 3, 4];
```

---

## 6. Computed Property Names in Destructuring

Use square brackets `[ ]` to destructure using a dynamic (computed) key.

```js
const key = "name";
const user = { name: "Alice", age: 30 };

const { [key]: value } = user;
console.log(value); // "Alice"
```

### Dynamic Keys from Variables

```js
function extractField(obj, fieldName) {
  const { [fieldName]: value } = obj;
  return value;
}

const product = { id: 1, title: "Widget", price: 9.99 };

console.log(extractField(product, "title")); // "Widget"
console.log(extractField(product, "price")); // 9.99
```

### Computed Keys with Default Values

```js
const settings = { theme: "dark" };
const prop = "language";

const { [prop]: lang = "en" } = settings;
console.log(lang); // "en" (default — property "language" doesn't exist)
```

### Using Template Literals as Computed Keys

```js
const prefix = "user";
const data = { userName: "Alice", userAge: 30 };

const { [`${prefix}Name`]: name, [`${prefix}Age`]: age } = data;
console.log(name); // "Alice"
console.log(age);  // 30
```

---

## 7. Real-World Use Cases

### 7.1 API Response Handling

```js
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  const {
    data: {
      attributes: { name, email },
      relationships: {
        team: { data: { id: teamId } },
      },
    },
  } = await response.json();

  return { name, email, teamId };
}
```

### 7.2 React Component Props

```js
function UserCard({ name, avatar = "/default.png", role, onEdit }) {
  return `
    <div class="card">
      <img src="${avatar}" alt="${name}" />
      <h2>${name}</h2>
      <span>${role}</span>
    </div>
  `;
}
```

### 7.3 Module Imports (Named Imports Are Destructuring-Like)

```js
// This looks like destructuring (and uses the same syntax) but is
// technically module binding syntax, not object destructuring
import { useState, useEffect, useCallback } from "react";
```

### 7.4 Configuration Objects

```js
function connectDB({
  host = "localhost",
  port = 5432,
  database = "mydb",
  ssl = false,
  pool: { min = 2, max = 10 } = {},
} = {}) {
  console.log(`Connecting to ${host}:${port}/${database}`);
  console.log(`SSL: ${ssl}, Pool: ${min}-${max}`);
}
```

### 7.5 Iterating with Destructuring

```js
const users = [
  { id: 1, name: "Alice", scores: [90, 85, 92] },
  { id: 2, name: "Bob", scores: [78, 88, 95] },
];

for (const { name, scores: [first, ...rest] } of users) {
  const avg = [first, ...rest].reduce((a, b) => a + b) / (rest.length + 1);
  console.log(`${name}: first score = ${first}, average = ${avg.toFixed(1)}`);
}
// Alice: first score = 90, average = 89.0
// Bob: first score = 78, average = 87.0
```

### 7.6 Regex Match Destructuring

```js
const dateStr = "2024-03-15";
const [, year, month, day] = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);

console.log(year);  // "2024"
console.log(month); // "03"
console.log(day);   // "15"
```

---

## 8. Common Pitfalls

### 8.1 Destructuring `null` or `undefined`

Attempting to destructure `null` or `undefined` throws a `TypeError`.

```js
// TypeError: Cannot destructure property 'name' of null
// const { name } = null;

// Fix: use a default
const { name } = null || {};
console.log(name); // undefined (but no error)
```

### 8.2 Forgetting Parentheses for Object Destructuring Assignments

```js
let a, b;

// SyntaxError — { is treated as block start
// { a, b } = { a: 1, b: 2 };

// Correct
({ a, b } = { a: 1, b: 2 });
```

### 8.3 Confusing Renaming with Default Syntax

```js
// Renaming:    { prop: newName }
// Default:     { prop = defaultValue }
// Both:        { prop: newName = defaultValue }

const obj = {};

const { x: renamedX = 10 } = obj;
console.log(renamedX); // 10
// console.log(x);     // ReferenceError — x was NOT created
```

### 8.4 Shallow Copy Only

Rest destructuring creates a **shallow** copy — nested objects still share references.

```js
const original = {
  name: "Alice",
  address: { city: "NYC" },
};

const { address, ...rest } = original;

// `rest` is a new object, but `address` is the SAME reference
address.city = "LA";
console.log(original.address.city); // "LA" — mutated!
```

### 8.5 Performance Consideration

Destructuring has no meaningful performance penalty in modern engines. However, deeply nested destructuring patterns can become **hard to read**. Consider breaking them into multiple statements when the nesting exceeds 3-4 levels.

---

## Summary Table

| Feature | Object | Array |
| ------- | ------ | ----- |
| Syntax | `const { a, b } = obj` | `const [a, b] = arr` |
| Matching by | Property name | Position (index) |
| Renaming | `{ name: alias }` | N/A (any name works) |
| Default values | `{ a = 10 }` | `[a = 10]` |
| Nested | `{ a: { b } }` | `[[a, b]]` |
| Rest | `{ a, ...rest }` | `[a, ...rest]` |
| Skip elements | N/A | `[, , third]` |
| Computed keys | `{ [expr]: val }` | N/A |
| Works with | Objects | Any iterable |
