# Variables and Data Types in JavaScript

JavaScript is a **dynamically typed**, **weakly typed** language. Variables do not have fixed types -- a variable that holds a number today can hold a string tomorrow. Understanding data types, how they interact, and how variables behave is foundational to writing robust JavaScript.

---

## Table of Contents

1. [Data Types Overview](#1-data-types-overview)
2. [Primitive Data Types](#2-primitive-data-types)
3. [Non-Primitive (Reference) Data Types](#3-non-primitive-reference-data-types)
4. [The typeof Operator and Its Quirks](#4-the-typeof-operator-and-its-quirks)
5. [Type Coercion](#5-type-coercion)
6. [Truthy and Falsy Values](#6-truthy-and-falsy-values)
7. [Variables: var, let, const](#7-variables-var-let-const)
8. [Scope](#8-scope)
9. [Hoisting](#9-hoisting)
10. [Variable Shadowing](#10-variable-shadowing)

---

## 1. Data Types Overview

JavaScript has **two categories** of data types:

| Category | Types | Stored As |
|---|---|---|
| **Primitive** (7 types) | `String`, `Number`, `BigInt`, `Boolean`, `undefined`, `null`, `Symbol` | Stored **by value** on the stack |
| **Non-Primitive** (Reference) | `Object`, `Array`, `Function`, `Date`, `RegExp`, `Map`, `Set`, etc. | Stored **by reference** on the heap |

**Key difference:** When you assign a primitive to another variable, a **copy** of the value is made. When you assign a non-primitive, both variables point to the **same object in memory**.

```js
// Primitive -- copy by value
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 (unchanged)

// Non-primitive -- copy by reference
let obj1 = { name: "Alice" };
let obj2 = obj1;
obj2.name = "Bob";
console.log(obj1.name); // "Bob" (both point to the same object)
```

---

## 2. Primitive Data Types

### 2.1 String

Strings represent textual data. They are **immutable** -- once created, their characters cannot be changed in place.

```js
let greeting = "Hello, World!";
let single = 'Single quotes work too';
let template = `Template literals allow ${greeting}`;

// Strings are immutable
let str = "hello";
str[0] = "H";       // Silently fails (no error, but no effect)
console.log(str);    // "hello" -- unchanged
```

### 2.2 Number

JavaScript uses **IEEE 754 double-precision 64-bit** floating point for all numbers. This means:

- Integers are accurate up to `2^53 - 1` (i.e., `Number.MAX_SAFE_INTEGER` = `9007199254740991`).
- Floating-point arithmetic can produce unexpected results.

```js
let integer = 42;
let float = 3.14;
let negative = -100;
let exponential = 2.5e6;    // 2,500,000

// Special numeric values
let inf = Infinity;          // 1 / 0
let negInf = -Infinity;     // -1 / 0
let notANumber = NaN;       // 0 / 0, parseInt("abc"), etc.

// Floating-point gotcha
console.log(0.1 + 0.2);             // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);     // false

// Safe comparison for floating point
console.log(Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON); // true
```

**NaN Quirks:**

```js
console.log(NaN === NaN);       // false (NaN is not equal to itself!)
console.log(Number.isNaN(NaN)); // true (preferred way to check)
console.log(isNaN("hello"));    // true (coerces string first -- avoid this)
console.log(Number.isNaN("hello")); // false (does NOT coerce -- use this)
```

### 2.3 BigInt

`BigInt` was introduced in ES2020 to handle integers **larger than `Number.MAX_SAFE_INTEGER`**. A `BigInt` is created by appending `n` to an integer or calling `BigInt()`.

```js
let big = 9007199254740991n;
let bigger = big + 1n;
console.log(bigger); // 9007199254740992n

// Cannot mix BigInt and Number
// console.log(big + 1); // TypeError!
console.log(big + BigInt(1)); // 9007199254740992n

// Comparison works across types
console.log(1n === 1);  // false (different types)
console.log(1n == 1);   // true  (abstract equality coerces)
```

### 2.4 Boolean

Booleans have only two values: `true` and `false`.

```js
let isActive = true;
let isDeleted = false;

// Boolean conversion
console.log(Boolean(0));         // false
console.log(Boolean(""));        // false
console.log(Boolean("hello"));   // true
console.log(Boolean([]));        // true (empty array is truthy!)
console.log(Boolean({}));        // true (empty object is truthy!)
```

### 2.5 undefined

A variable that has been **declared but not assigned** a value has the value `undefined`. It is also the default return value of functions that do not explicitly return anything.

```js
let x;
console.log(x);          // undefined
console.log(typeof x);   // "undefined"

function doNothing() {}
console.log(doNothing()); // undefined
```

### 2.6 null

`null` represents the **intentional absence of any object value**. It is explicitly assigned by the programmer.

```js
let user = null; // intentionally empty
console.log(user);        // null
console.log(typeof user); // "object" (this is a known bug/quirk!)

// Checking for null
console.log(user === null);    // true (use strict equality)
console.log(user == undefined); // true (null and undefined are loosely equal)
```

### 2.7 Symbol

Symbols are **unique, immutable identifiers** introduced in ES6. They are primarily used as property keys to avoid name collisions.

```js
let sym1 = Symbol("description");
let sym2 = Symbol("description");
console.log(sym1 === sym2); // false (every Symbol is unique)

// Using Symbols as object keys
const ID = Symbol("id");
let user = {
  [ID]: 12345,
  name: "Alice"
};

console.log(user[ID]);          // 12345
console.log(Object.keys(user)); // ["name"] -- Symbols are NOT enumerable

// Global Symbol registry
let globalSym1 = Symbol.for("app.id");
let globalSym2 = Symbol.for("app.id");
console.log(globalSym1 === globalSym2); // true (same key in global registry)
```

---

## 3. Non-Primitive (Reference) Data Types

### 3.1 Object

Objects are **collections of key-value pairs**. Keys are strings (or Symbols), and values can be anything.

```js
let person = {
  name: "Alice",
  age: 30,
  greet() {
    return `Hi, I'm ${this.name}`;
  }
};

console.log(person.name);      // "Alice"
console.log(person["age"]);    // 30
console.log(person.greet());   // "Hi, I'm Alice"
```

### 3.2 Array

Arrays are **ordered, indexed collections**. They are actually objects under the hood with numeric keys.

```js
let fruits = ["apple", "banana", "cherry"];
console.log(fruits[0]);       // "apple"
console.log(fruits.length);   // 3
console.log(typeof fruits);   // "object"
console.log(Array.isArray(fruits)); // true (proper way to check)
```

### 3.3 Function

Functions are **first-class objects** -- they can be assigned to variables, passed as arguments, and returned from other functions.

```js
// Function declaration
function add(a, b) {
  return a + b;
}

// Function expression
const multiply = function (a, b) {
  return a * b;
};

// Arrow function
const divide = (a, b) => a / b;

// Functions are objects
console.log(typeof add); // "function"
add.customProp = "hello";
console.log(add.customProp); // "hello"
```

### 3.4 Reference vs Value -- Deep Dive

```js
// Primitives: independent copies
let x = "hello";
let y = x;
y = "world";
console.log(x); // "hello" (unaffected)

// Objects: shared reference
let arr1 = [1, 2, 3];
let arr2 = arr1;
arr2.push(4);
console.log(arr1); // [1, 2, 3, 4] (affected!)

// To create a true copy:
let arr3 = [...arr1];           // shallow copy via spread
let arr4 = JSON.parse(JSON.stringify(arr1)); // deep copy (simple cases)
let arr5 = structuredClone(arr1);            // deep copy (modern, handles more types)
```

---

## 4. The typeof Operator and Its Quirks

`typeof` returns a string indicating the type of its operand.

| Expression | Result | Notes |
|---|---|---|
| `typeof "hello"` | `"string"` | |
| `typeof 42` | `"number"` | |
| `typeof 42n` | `"bigint"` | |
| `typeof true` | `"boolean"` | |
| `typeof undefined` | `"undefined"` | |
| `typeof null` | `"object"` | **Bug from JS v1 -- never fixed for backward compatibility** |
| `typeof Symbol()` | `"symbol"` | |
| `typeof {}` | `"object"` | |
| `typeof []` | `"object"` | Arrays are objects; use `Array.isArray()` |
| `typeof function(){}` | `"function"` | Functions get their own typeof result |
| `typeof NaN` | `"number"` | NaN is technically a numeric value |
| `typeof Infinity` | `"number"` | |
| `typeof undeclaredVar` | `"undefined"` | Does NOT throw ReferenceError (unique behavior) |

```js
// The null quirk
console.log(typeof null);       // "object"
// Proper null check:
console.log(null === null);     // true

// The NaN quirk
console.log(typeof NaN);        // "number"
console.log(NaN === NaN);       // false
console.log(Number.isNaN(NaN)); // true

// The function quirk
console.log(typeof function(){}); // "function" (not "object", even though functions ARE objects)

// Safe variable existence check
if (typeof someVar !== "undefined") {
  // someVar exists and has been assigned a value
}
```

---

## 5. Type Coercion

Type coercion is JavaScript's automatic (implicit) or manual (explicit) conversion of values from one type to another.

### 5.1 Explicit Coercion (Type Casting)

You deliberately convert types using built-in functions.

```js
// To String
String(123);        // "123"
String(true);       // "true"
String(null);       // "null"
String(undefined);  // "undefined"
(123).toString();   // "123"

// To Number
Number("42");       // 42
Number("3.14");     // 3.14
Number("");         // 0
Number("hello");    // NaN
Number(true);       // 1
Number(false);      // 0
Number(null);       // 0
Number(undefined);  // NaN
parseInt("42px");   // 42 (parses until non-numeric character)
parseFloat("3.14"); // 3.14

// To Boolean
Boolean(0);         // false
Boolean("");        // false
Boolean(null);      // false
Boolean(undefined); // false
Boolean(NaN);       // false
Boolean("0");       // true (non-empty string!)
Boolean([]);        // true (any object is truthy!)
Boolean({});        // true
```

### 5.2 Implicit Coercion

JavaScript automatically converts types in certain contexts.

```js
// String coercion with + operator
console.log("5" + 3);       // "53" (number coerced to string)
console.log("5" + true);    // "5true"
console.log("5" + null);    // "5null"
console.log("5" + undefined); // "5undefined"

// Numeric coercion with other operators
console.log("5" - 3);       // 2 (string coerced to number)
console.log("5" * 2);       // 10
console.log("5" / 2);       // 2.5
console.log("5" - true);    // 4 (true becomes 1)
console.log("abc" - 1);     // NaN

// Boolean coercion in conditions
if ("hello") { /* runs -- non-empty string is truthy */ }
if (0) { /* does NOT run -- 0 is falsy */ }

// Equality coercion
console.log("5" == 5);      // true (string coerced to number)
console.log(null == undefined); // true (special case)
console.log(null == 0);     // false (null only equals undefined)
```

### 5.3 The + Operator Ambiguity

The `+` operator is **both addition and concatenation**. If **either** operand is a string, it concatenates.

```js
console.log(1 + 2);          // 3
console.log("1" + 2);        // "12"
console.log(1 + "2");        // "12"
console.log(1 + 2 + "3");    // "33" (left-to-right: 1+2=3, then 3+"3"="33")
console.log("1" + 2 + 3);    // "123" (left-to-right: "1"+2="12", "12"+3="123")

// Force numeric addition
console.log(+"5" + 3);       // 8 (unary + converts string to number)
console.log(Number("5") + 3); // 8
```

---

## 6. Truthy and Falsy Values

In a boolean context (like an `if` condition), JavaScript coerces values to `true` or `false`.

### Falsy Values (Complete List)

There are exactly **8 falsy values** in JavaScript:

| Value | Type | Notes |
|---|---|---|
| `false` | Boolean | The literal false |
| `0` | Number | Zero |
| `-0` | Number | Negative zero |
| `0n` | BigInt | BigInt zero |
| `""` | String | Empty string (single, double, or backtick quotes) |
| `null` | null | Absence of value |
| `undefined` | undefined | Uninitialized variable |
| `NaN` | Number | Not a Number |

### Everything Else Is Truthy

Some **surprising truthy** values:

```js
Boolean("0");           // true  (non-empty string)
Boolean("false");       // true  (non-empty string)
Boolean([]);            // true  (empty array is an object)
Boolean({});            // true  (empty object)
Boolean(function(){}); // true  (function is an object)
Boolean(-1);            // true  (any non-zero number)
Boolean(Infinity);      // true
Boolean(new Date());    // true
Boolean(" ");           // true  (string with a space)
```

### Practical Usage

```js
// Checking if a string is non-empty
let name = "";
if (name) {
  console.log("Name is provided");
} else {
  console.log("Name is empty"); // This runs
}

// Default values using ||
let input = "";
let username = input || "Anonymous"; // "Anonymous" (because "" is falsy)

// Gotcha: 0 is falsy!
let count = 0;
let displayCount = count || "No items"; // "No items" (0 is falsy -- probably NOT intended)
let safeCount = count ?? "No items";    // 0 (nullish coalescing only checks null/undefined)
```

---

## 7. Variables: var, let, const

### Comparison Table

| Feature | `var` | `let` | `const` |
|---|---|---|---|
| **Introduced** | ES1 (1997) | ES6 (2015) | ES6 (2015) |
| **Scope** | Function scope | Block scope | Block scope |
| **Hoisting** | Hoisted and initialized to `undefined` | Hoisted but **not initialized** (TDZ) | Hoisted but **not initialized** (TDZ) |
| **Re-declaration** | Allowed in same scope | Not allowed in same scope | Not allowed in same scope |
| **Re-assignment** | Allowed | Allowed | **Not allowed** |
| **Global object property** | Yes (`window.x` in browser) | No | No |

### 7.1 var

```js
// Function scoped (NOT block scoped)
function example() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 (var leaks out of the block)
}

// Can be re-declared
var name = "Alice";
var name = "Bob"; // No error
console.log(name); // "Bob"

// Hoisted with undefined
console.log(y); // undefined (no error!)
var y = 5;

// Added to global object in browser
var globalVar = "hello";
console.log(window.globalVar); // "hello" (in browsers)
```

### 7.2 let

```js
// Block scoped
if (true) {
  let x = 10;
}
// console.log(x); // ReferenceError: x is not defined

// Cannot re-declare in same scope
let name = "Alice";
// let name = "Bob"; // SyntaxError: Identifier 'name' has already been declared

// Can be reassigned
let count = 0;
count = 1; // Fine

// Not hoisted in a usable way (Temporal Dead Zone)
// console.log(z); // ReferenceError: Cannot access 'z' before initialization
let z = 5;
```

### 7.3 const

```js
// Must be initialized at declaration
const PI = 3.14159;
// const x; // SyntaxError: Missing initializer in const declaration

// Cannot be reassigned
// PI = 3.14; // TypeError: Assignment to constant variable.

// BUT: const objects/arrays CAN be mutated!
const user = { name: "Alice" };
user.name = "Bob";       // Allowed! (mutating the object, not reassigning the variable)
console.log(user.name);  // "Bob"

// user = { name: "Charlie" }; // TypeError: Assignment to constant variable (reassignment)

const arr = [1, 2, 3];
arr.push(4);             // Allowed!
console.log(arr);        // [1, 2, 3, 4]

// To make an object truly immutable:
const frozen = Object.freeze({ name: "Alice", age: 30 });
frozen.name = "Bob";     // Silently fails (or throws in strict mode)
console.log(frozen.name); // "Alice"
// Note: Object.freeze is shallow -- nested objects are NOT frozen
```

### When to Use Each

```
const  -->  Default choice. Use for all variables that won't be reassigned.
let    -->  Use when you need to reassign (counters, accumulators, flags).
var    -->  Avoid in modern code. Only use if you specifically need function scope or global object binding.
```

---

## 8. Scope

Scope determines where variables are accessible in your code.

### 8.1 Global Scope

Variables declared outside any function or block are in the global scope.

```js
var globalVar = "I'm global (var)";
let globalLet = "I'm global (let)";
const globalConst = "I'm global (const)";

function test() {
  console.log(globalVar);   // Accessible
  console.log(globalLet);   // Accessible
  console.log(globalConst); // Accessible
}

// In browsers, var adds to window object
console.log(window.globalVar);   // "I'm global (var)"
console.log(window.globalLet);   // undefined (let does NOT attach to window)
console.log(window.globalConst); // undefined (const does NOT attach to window)
```

### 8.2 Function Scope

Variables declared with `var` inside a function are scoped to that function.

```js
function myFunction() {
  var functionScoped = "Only accessible inside this function";

  if (true) {
    var alsoFunctionScoped = "var ignores block boundaries";
  }

  console.log(functionScoped);     // Works
  console.log(alsoFunctionScoped); // Works (var is function-scoped, not block-scoped)
}

// console.log(functionScoped);    // ReferenceError
// console.log(alsoFunctionScoped); // ReferenceError
```

### 8.3 Block Scope

Variables declared with `let` and `const` are scoped to the nearest `{}` block.

```js
if (true) {
  let blockLet = "block scoped";
  const blockConst = "also block scoped";
  var notBlockScoped = "function/global scoped";
}

// console.log(blockLet);      // ReferenceError
// console.log(blockConst);    // ReferenceError
console.log(notBlockScoped);   // "function/global scoped"

// Classic loop example
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Output: 3, 3, 3 (var is shared across iterations)

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 100);
}
// Output: 0, 1, 2 (let creates a new binding per iteration)
```

### 8.4 Scope Chain (Lexical Scope)

Inner scopes can access variables from outer scopes, forming a **scope chain**.

```js
const outerVar = "outer";

function outerFunc() {
  const middleVar = "middle";

  function innerFunc() {
    const innerVar = "inner";
    console.log(innerVar);  // "inner"   (own scope)
    console.log(middleVar); // "middle"  (parent scope)
    console.log(outerVar);  // "outer"   (global scope)
  }

  innerFunc();
  // console.log(innerVar); // ReferenceError (cannot access child scope)
}

outerFunc();
```

---

## 9. Hoisting

Hoisting is JavaScript's behavior of moving **declarations** (not initializations) to the top of their scope during the compilation phase.

### 9.1 var Hoisting

`var` declarations are hoisted **and initialized to `undefined`**.

```js
console.log(x); // undefined (not an error!)
var x = 5;
console.log(x); // 5

// The engine interprets it as:
// var x;           // declaration hoisted
// console.log(x);  // undefined
// x = 5;           // assignment stays in place
// console.log(x);  // 5
```

### 9.2 let/const and the Temporal Dead Zone (TDZ)

`let` and `const` are **hoisted** but remain in the **Temporal Dead Zone** from the start of the block until the declaration is encountered. Accessing them in the TDZ throws a `ReferenceError`.

```js
// console.log(a); // ReferenceError: Cannot access 'a' before initialization
let a = 10;

// The TDZ exists from the start of the block to the declaration
{
  // TDZ for `b` starts here
  // console.log(b); // ReferenceError
  let b = 20;       // TDZ for `b` ends here
  console.log(b);   // 20
}
```

### 9.3 Function Hoisting

**Function declarations** are fully hoisted -- both the name and the body.

```js
// Works! Function declarations are fully hoisted.
greet(); // "Hello!"

function greet() {
  console.log("Hello!");
}

// Function expressions are NOT fully hoisted
// sayHi(); // TypeError: sayHi is not a function (var) or ReferenceError (let/const)

var sayHi = function () {
  console.log("Hi!");
};
```

### 9.4 Hoisting Summary Table

| Declaration | Hoisted? | Initialized? | Accessible Before Declaration? |
|---|---|---|---|
| `var` | Yes | Yes (to `undefined`) | Yes (value is `undefined`) |
| `let` | Yes | No (TDZ) | No (`ReferenceError`) |
| `const` | Yes | No (TDZ) | No (`ReferenceError`) |
| `function` declaration | Yes | Yes (full body) | Yes (fully usable) |
| `function` expression (`var`) | Partially | `undefined` | TypeError when called |
| `function` expression (`let`/`const`) | Yes (but TDZ) | No | ReferenceError |
| `class` | Yes | No (TDZ) | No (`ReferenceError`) |

---

## 10. Variable Shadowing

Variable shadowing occurs when a variable in an inner scope has the **same name** as a variable in an outer scope. The inner variable **shadows** (hides) the outer one within its scope.

```js
let x = "global";

function outer() {
  let x = "outer"; // Shadows global x

  function inner() {
    let x = "inner"; // Shadows outer x
    console.log(x);  // "inner"
  }

  inner();
  console.log(x); // "outer"
}

outer();
console.log(x); // "global"
```

### Shadowing with Different Keywords

```js
// let can shadow var
var a = 1;
{
  let a = 2; // Valid: let shadows var
  console.log(a); // 2
}
console.log(a); // 1

// var CANNOT shadow let in the same function scope (illegal shadowing)
// let b = 1;
// {
//   var b = 2; // SyntaxError: Identifier 'b' has already been declared
// }
// This is because var would try to "escape" the block into the function scope
// where let already declared b.
```

### Practical Shadowing Example

```js
const config = {
  debug: false,
  maxRetries: 3,
};

function processRequest(config) {
  // Parameter `config` shadows the outer `config`
  console.log(config); // The argument passed to the function, not the outer object
}

processRequest({ debug: true, maxRetries: 5 });
console.log(config.debug); // false (outer config is unaffected)
```

### Accidental Shadowing in Loops

```js
let i = 100;

for (let i = 0; i < 3; i++) {
  console.log(i); // 0, 1, 2 (loop's i shadows outer i)
}

console.log(i); // 100 (outer i unaffected)
```

---

## Summary

- JavaScript has **7 primitive types** (stored by value) and **non-primitive/reference types** (stored by reference).
- `typeof` has notable quirks: `typeof null === "object"` and `typeof NaN === "number"`.
- **Implicit coercion** can cause surprising results -- prefer **explicit coercion** and **strict equality** (`===`).
- Use `const` by default, `let` when reassignment is needed, and avoid `var` in modern code.
- Understand scope (global, function, block) and hoisting (especially the Temporal Dead Zone for `let`/`const`) to avoid subtle bugs.
- Be aware of variable shadowing and its implications when naming variables.
