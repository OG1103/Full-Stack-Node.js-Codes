# Operators in JavaScript

Operators are special symbols or keywords that perform operations on values (operands). JavaScript provides a rich set of operators for arithmetic, comparison, logical operations, and more. Mastering operators -- especially their coercion behavior and short-circuit semantics -- is essential for writing clean, idiomatic JavaScript.

---

## Table of Contents

1. [Arithmetic Operators](#1-arithmetic-operators)
2. [Assignment Operators](#2-assignment-operators)
3. [Comparison Operators](#3-comparison-operators)
4. [Falsy Values and How They Affect Comparisons](#4-falsy-values-and-how-they-affect-comparisons)
5. [Logical Operators](#5-logical-operators)
6. [Short-Circuit Evaluation](#6-short-circuit-evaluation)
7. [Spread Operator (...)](#7-spread-operator-)
8. [Optional Chaining (?.)](#8-optional-chaining-)
9. [Nullish Coalescing (??)](#9-nullish-coalescing-)
10. [Ternary Operator](#10-ternary-operator)
11. [Bitwise Operators](#11-bitwise-operators)
12. [Operator Precedence](#12-operator-precedence)

---

## 1. Arithmetic Operators

| Operator | Name | Example | Result |
|---|---|---|---|
| `+` | Addition | `5 + 3` | `8` |
| `-` | Subtraction | `5 - 3` | `2` |
| `*` | Multiplication | `5 * 3` | `15` |
| `/` | Division | `10 / 3` | `3.3333...` |
| `%` | Modulus (Remainder) | `10 % 3` | `1` |
| `**` | Exponentiation | `2 ** 10` | `1024` |
| `+` | Unary Plus | `+"5"` | `5` (number) |
| `-` | Unary Negation | `-5` | `-5` |
| `++` | Increment | `x++` or `++x` | See below |
| `--` | Decrement | `x--` or `--x` | See below |

### Addition and String Concatenation

The `+` operator serves double duty: numeric addition and string concatenation. If **either** operand is a string, it concatenates.

```js
console.log(5 + 3);        // 8
console.log("5" + 3);      // "53" (string concatenation)
console.log(5 + "3");      // "53"
console.log(5 + 3 + "2");  // "82" (left-to-right: 5+3=8, then 8+"2"="82")
console.log("2" + 5 + 3);  // "253" (left-to-right: "2"+5="25", then "25"+3="253")
console.log(true + 1);     // 2 (true coerced to 1)
console.log(null + 5);     // 5 (null coerced to 0)
```

### Other Arithmetic Operators (Always Numeric)

Unlike `+`, the operators `-`, `*`, `/`, `%`, and `**` always attempt numeric conversion.

```js
console.log("10" - 5);     // 5
console.log("10" * 2);     // 20
console.log("10" / "2");   // 5
console.log("hello" - 1);  // NaN
console.log(true * 10);    // 10
console.log(null * 10);    // 0
```

### Increment and Decrement

```js
let a = 5;

// Postfix: returns current value THEN increments
console.log(a++); // 5 (returns 5, then a becomes 6)
console.log(a);   // 6

// Prefix: increments FIRST then returns the new value
console.log(++a); // 7 (increments to 7, then returns 7)
console.log(a);   // 7

// Same logic applies to --
let b = 10;
console.log(b--); // 10 (returns 10, then b becomes 9)
console.log(--b); // 8  (decrements to 8, then returns 8)
```

### Exponentiation

```js
console.log(2 ** 3);    // 8
console.log(2 ** 0.5);  // 1.4142... (same as Math.sqrt(2))
console.log((-2) ** 3); // -8
// Note: -2 ** 3 is a SyntaxError; must use parentheses (-2) ** 3
```

### Modulus (Remainder)

```js
console.log(10 % 3);  // 1
console.log(10 % 2);  // 0 (useful for checking even/odd)
console.log(-10 % 3); // -1 (sign follows the dividend in JS)

// Practical: check if number is even
function isEven(n) {
  return n % 2 === 0;
}
```

---

## 2. Assignment Operators

| Operator | Example | Equivalent To |
|---|---|---|
| `=` | `x = 5` | `x = 5` |
| `+=` | `x += 3` | `x = x + 3` |
| `-=` | `x -= 3` | `x = x - 3` |
| `*=` | `x *= 3` | `x = x * 3` |
| `/=` | `x /= 3` | `x = x / 3` |
| `%=` | `x %= 3` | `x = x % 3` |
| `**=` | `x **= 3` | `x = x ** 3` |
| `&&=` | `x &&= 3` | `x = x && 3` (logical AND assignment) |
| `\|\|=` | `x \|\|= 3` | `x = x \|\| 3` (logical OR assignment) |
| `??=` | `x ??= 3` | `x = x ?? 3` (nullish coalescing assignment) |
| `<<=` | `x <<= 2` | `x = x << 2` |
| `>>=` | `x >>= 2` | `x = x >> 2` |

### Logical Assignment Operators (ES2021)

```js
// Logical OR assignment: assigns if current value is falsy
let a = 0;
a ||= 10;
console.log(a); // 10 (0 is falsy, so assignment happens)

let b = 5;
b ||= 10;
console.log(b); // 5 (5 is truthy, so assignment is skipped)

// Logical AND assignment: assigns if current value is truthy
let c = 5;
c &&= 10;
console.log(c); // 10 (5 is truthy, so assignment happens)

let d = 0;
d &&= 10;
console.log(d); // 0 (0 is falsy, so assignment is skipped)

// Nullish coalescing assignment: assigns if current value is null or undefined
let e = null;
e ??= 10;
console.log(e); // 10

let f = 0;
f ??= 10;
console.log(f); // 0 (0 is NOT null/undefined, so assignment is skipped)
```

---

## 3. Comparison Operators

### Overview Table

| Operator | Name | Example | Description |
|---|---|---|---|
| `==` | Abstract Equality | `5 == "5"` --> `true` | Compares with type coercion |
| `===` | Strict Equality | `5 === "5"` --> `false` | Compares without type coercion |
| `!=` | Abstract Inequality | `5 != "5"` --> `false` | Inverse of `==` |
| `!==` | Strict Inequality | `5 !== "5"` --> `true` | Inverse of `===` |
| `>` | Greater Than | `5 > 3` --> `true` | |
| `<` | Less Than | `3 < 5` --> `true` | |
| `>=` | Greater Than or Equal | `5 >= 5` --> `true` | |
| `<=` | Less Than or Equal | `3 <= 5` --> `true` | |

### Abstract Equality (`==`) vs Strict Equality (`===`)

`==` performs **type coercion** before comparing. `===` compares both **value and type** with no coercion.

```js
// == (abstract equality) -- performs type coercion
console.log(5 == "5");        // true  (string "5" coerced to number 5)
console.log(0 == false);      // true  (false coerced to 0)
console.log("" == false);     // true  (both coerce to 0)
console.log(null == undefined); // true (special case in the spec)
console.log(null == 0);       // false (null only equals undefined with ==)
console.log(NaN == NaN);      // false (NaN is never equal to anything)

// === (strict equality) -- no type coercion
console.log(5 === "5");       // false (different types)
console.log(0 === false);     // false (different types)
console.log("" === false);    // false (different types)
console.log(null === undefined); // false (different types)
console.log(NaN === NaN);     // false (NaN is still not equal to itself)
```

**Best Practice:** Always use `===` and `!==` to avoid unexpected coercion.

### The `==` Coercion Algorithm (Simplified)

When comparing `x == y`:

1. If both are the same type, compare directly.
2. `null == undefined` returns `true`.
3. If one is a number and the other a string, convert the string to a number.
4. If one is a boolean, convert it to a number (true->1, false->0) and compare again.
5. If one is an object and the other a primitive, convert the object via `valueOf()` or `toString()`.

```js
// Step-by-step: "" == false
// 1. false is boolean -> convert to number: 0
// 2. Now: "" == 0
// 3. "" is string, 0 is number -> convert "" to number: 0
// 4. Now: 0 == 0 -> true

// Step-by-step: [] == false
// 1. false -> 0: [] == 0
// 2. [] is object -> [].toString() = "": "" == 0
// 3. "" -> 0: 0 == 0 -> true
console.log([] == false); // true
console.log([] == 0);     // true
console.log([] == "");    // true
```

### Comparing Objects

Objects are compared **by reference**, not by value:

```js
console.log({} === {});   // false (different objects in memory)
console.log([] === []);   // false
const a = { x: 1 };
const b = a;
console.log(a === b);     // true (same reference)
```

---

## 4. Falsy Values and How They Affect Comparisons

### Complete Falsy Values List

| Value | Type | `== false` | `=== false` |
|---|---|---|---|
| `false` | Boolean | `true` | `true` |
| `0` | Number | `true` | `false` |
| `-0` | Number | `true` | `false` |
| `0n` | BigInt | `true` | `false` |
| `""` | String | `true` | `false` |
| `null` | null | `false` | `false` |
| `undefined` | undefined | `false` | `false` |
| `NaN` | Number | `false` | `false` |

**Important:** `null` and `undefined` are falsy, but `null == false` is `false` and `undefined == false` is `false`. They only loosely equal each other.

```js
console.log(null == false);      // false
console.log(undefined == false); // false
console.log(null == undefined);  // true
console.log(null == null);       // true
console.log(undefined == undefined); // true
```

### Comparison Gotchas

```js
// These are all true with ==
console.log(0 == "");       // true
console.log(0 == "0");      // true
console.log("" == "0");     // false (both strings, compared as strings)
// This violates transitivity! 0 == "" and 0 == "0" but "" != "0"

// Relational operators with null/undefined
console.log(null > 0);      // false (null becomes 0, 0 > 0 is false)
console.log(null == 0);     // false (special rule: null only == undefined)
console.log(null >= 0);     // true  (null becomes 0, 0 >= 0 is true)
// This is contradictory! null is not > 0, not == 0, but IS >= 0

console.log(undefined > 0);  // false (undefined becomes NaN)
console.log(undefined == 0); // false
console.log(undefined < 0);  // false (NaN comparisons are always false)
```

---

## 5. Logical Operators

| Operator | Name | Description |
|---|---|---|
| `&&` | Logical AND | Returns first falsy value or last value |
| `\|\|` | Logical OR | Returns first truthy value or last value |
| `!` | Logical NOT | Returns the boolean inverse |

### How They Actually Work

Logical operators in JavaScript do **not** necessarily return `true` or `false`. They return **one of the operand values**.

```js
// && returns the first FALSY value, or the last value if all are truthy
console.log(1 && 2 && 3);       // 3 (all truthy, returns last)
console.log(1 && 0 && 3);       // 0 (first falsy value)
console.log(1 && "" && 3);      // "" (first falsy value)
console.log(null && "hello");   // null (first falsy value)

// || returns the first TRUTHY value, or the last value if all are falsy
console.log(0 || "" || "hello"); // "hello" (first truthy value)
console.log(0 || "" || null);    // null (all falsy, returns last)
console.log("first" || "second"); // "first" (already truthy)

// ! always returns a boolean
console.log(!0);        // true
console.log(!"hello");  // false
console.log(!null);     // true
console.log(!undefined); // true

// !! (double NOT) converts to boolean
console.log(!!0);       // false
console.log(!!"hello"); // true
console.log(!!null);    // false
console.log(!!{});      // true
```

---

## 6. Short-Circuit Evaluation

**Short-circuit evaluation** means the second operand is **not evaluated** if the first operand is sufficient to determine the result.

### && Short-Circuits on Falsy

```js
// If the left side is falsy, the right side is NEVER evaluated
false && console.log("This never runs");
0 && someUndefinedFunction(); // No error! Right side is skipped.

// Practical: conditional execution
const user = { name: "Alice", isAdmin: true };
user.isAdmin && console.log("Welcome, admin!"); // "Welcome, admin!"

// Guard clause
function getLength(str) {
  return str && str.length; // If str is null/undefined, returns null/undefined instead of crashing
}
console.log(getLength("hello")); // 5
console.log(getLength(null));    // null
```

### || Short-Circuits on Truthy

```js
// If the left side is truthy, the right side is NEVER evaluated
true || console.log("This never runs");
"hello" || someUndefinedFunction(); // No error!

// Practical: default values
function greet(name) {
  name = name || "Guest";
  return `Hello, ${name}!`;
}
console.log(greet("Alice")); // "Hello, Alice!"
console.log(greet(""));      // "Hello, Guest!" (GOTCHA: "" is falsy)
console.log(greet(0));       // "Hello, Guest!" (GOTCHA: 0 is falsy)
```

### Chaining Short-Circuit Operators

```js
// Complex conditional logic without if statements
const isLoggedIn = true;
const isAdmin = false;
const hasPermission = true;

// Equivalent to: if (isLoggedIn && (isAdmin || hasPermission))
const canAccess = isLoggedIn && (isAdmin || hasPermission);
console.log(canAccess); // true
```

---

## 7. Spread Operator (...)

The spread operator (`...`) expands an iterable (array, string, object) into individual elements.

### Spread with Arrays

```js
// Expanding arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2];
console.log(merged); // [1, 2, 3, 4, 5, 6]

// Copying arrays (shallow copy)
const original = [1, 2, 3];
const copy = [...original];
copy.push(4);
console.log(original); // [1, 2, 3] (unaffected)

// Inserting elements
const middle = [3, 4];
const full = [1, 2, ...middle, 5, 6];
console.log(full); // [1, 2, 3, 4, 5, 6]
```

### Spread with Objects

```js
// Merging objects
const defaults = { theme: "light", lang: "en", notifications: true };
const userPrefs = { theme: "dark", lang: "fr" };
const settings = { ...defaults, ...userPrefs };
console.log(settings);
// { theme: "dark", lang: "fr", notifications: true }
// Later properties override earlier ones

// Copying objects (shallow copy)
const user = { name: "Alice", age: 30 };
const userCopy = { ...user };

// Adding/overriding properties
const updated = { ...user, age: 31, email: "alice@example.com" };
console.log(updated); // { name: "Alice", age: 31, email: "alice@example.com" }
```

### Spread with Strings

```js
const str = "Hello";
const chars = [...str];
console.log(chars); // ["H", "e", "l", "l", "o"]
```

### Spread in Function Arguments

```js
function sum(a, b, c) {
  return a + b + c;
}

const numbers = [1, 2, 3];
console.log(sum(...numbers)); // 6

// With Math functions
const scores = [85, 92, 78, 96, 88];
console.log(Math.max(...scores)); // 96
console.log(Math.min(...scores)); // 78
```

### Rest Parameters (... in Function Definitions)

The same syntax `...` in a function parameter position **collects** arguments into an array (opposite of spread).

```js
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15

// Rest must be the last parameter
function logFirst(first, ...rest) {
  console.log("First:", first);
  console.log("Rest:", rest);
}
logFirst(1, 2, 3, 4); // First: 1, Rest: [2, 3, 4]
```

---

## 8. Optional Chaining (?.)

Optional chaining (`?.`) allows safe access to deeply nested properties without throwing an error if an intermediate property is `null` or `undefined`. It **short-circuits** and returns `undefined` if the left-hand side is nullish.

```js
const user = {
  name: "Alice",
  address: {
    street: "123 Main St",
    city: "Springfield"
  }
};

// Without optional chaining
// const zip = user.address.zip.code; // TypeError if zip is undefined

// With optional chaining
const zip = user.address?.zip?.code;
console.log(zip); // undefined (no error)

// With null
const noUser = null;
console.log(noUser?.name);          // undefined (no error)
console.log(noUser?.address?.city);  // undefined (no error)
```

### Optional Chaining with Methods

```js
const user = {
  name: "Alice",
  greet() {
    return `Hi, I'm ${this.name}`;
  }
};

console.log(user.greet?.());    // "Hi, I'm Alice"
console.log(user.farewell?.()); // undefined (method doesn't exist, no error)
```

### Optional Chaining with Bracket Notation

```js
const data = { users: { "alice-01": { age: 30 } } };
console.log(data.users?.["alice-01"]?.age); // 30
console.log(data.users?.["bob-02"]?.age);   // undefined
```

### Optional Chaining with Arrays

```js
const users = [{ name: "Alice" }, { name: "Bob" }];
console.log(users?.[0]?.name); // "Alice"
console.log(users?.[5]?.name); // undefined

const empty = null;
console.log(empty?.[0]);       // undefined
```

### Optional Chaining Does NOT Prevent All Errors

```js
// It only handles null/undefined on the LEFT side of ?.
const obj = { name: "Alice" };
// obj?.name.foo.bar // TypeError: Cannot read property 'bar' of undefined
// Because obj?.name returns "Alice", and "Alice".foo is undefined,
// then undefined.bar throws.

// Correct:
console.log(obj?.name?.foo?.bar); // undefined
```

---

## 9. Nullish Coalescing (??)

The nullish coalescing operator (`??`) returns the right-hand operand when the left-hand operand is **`null` or `undefined`** (and only those two values). This is different from `||`, which triggers on any falsy value.

### ?? vs ||

```js
// || returns the right side for ANY falsy value
console.log(0 || "default");         // "default" (0 is falsy)
console.log("" || "default");        // "default" ("" is falsy)
console.log(false || "default");     // "default" (false is falsy)
console.log(null || "default");      // "default"
console.log(undefined || "default"); // "default"

// ?? returns the right side ONLY for null or undefined
console.log(0 ?? "default");         // 0 (0 is NOT null/undefined)
console.log("" ?? "default");        // "" ("" is NOT null/undefined)
console.log(false ?? "default");     // false (false is NOT null/undefined)
console.log(null ?? "default");      // "default"
console.log(undefined ?? "default"); // "default"
```

### Practical Examples

```js
// User settings where 0 and "" are valid values
function getConfig(options) {
  const timeout = options.timeout ?? 3000;   // 0 is a valid timeout
  const label = options.label ?? "Untitled"; // "" is a valid label
  const retries = options.retries ?? 3;

  return { timeout, label, retries };
}

console.log(getConfig({ timeout: 0, label: "", retries: null }));
// { timeout: 0, label: "", retries: 3 }
// With ||, timeout would be 3000 and label would be "Untitled" -- incorrect!

// Combining with optional chaining
const user = { settings: { theme: null } };
const theme = user?.settings?.theme ?? "light";
console.log(theme); // "light" (theme exists but is null)
```

### Cannot Mix ?? with && or || Without Parentheses

```js
// SyntaxError: cannot mix ?? with && or || without parentheses
// const result = a || b ?? c;

// Must use explicit parentheses
const result = (a || b) ?? c;
// or
const result2 = a || (b ?? c);
```

---

## 10. Ternary Operator

The ternary (conditional) operator is the only JavaScript operator that takes three operands. It is a concise alternative to `if...else`.

```
condition ? expressionIfTrue : expressionIfFalse
```

### Basic Usage

```js
const age = 20;
const status = age >= 18 ? "Adult" : "Minor";
console.log(status); // "Adult"

// Equivalent if...else
let status2;
if (age >= 18) {
  status2 = "Adult";
} else {
  status2 = "Minor";
}
```

### Nested Ternary

Use sparingly for readability, but useful for mapping multiple conditions:

```js
const score = 85;
const grade =
  score >= 90 ? "A" :
  score >= 80 ? "B" :
  score >= 70 ? "C" :
  score >= 60 ? "D" : "F";

console.log(grade); // "B"
```

### Ternary with Function Calls

```js
const isLoggedIn = true;
isLoggedIn ? showDashboard() : showLogin();
```

### Ternary in Template Literals

```js
const count = 5;
console.log(`You have ${count} item${count === 1 ? "" : "s"}`);
// "You have 5 items"
```

### Ternary with Logical Operators

```js
const user = { name: "Alice", role: "admin" };
const greeting = user
  ? `Hello, ${user.role === "admin" ? "Admin " : ""}${user.name}!`
  : "Hello, Guest!";
console.log(greeting); // "Hello, Admin Alice!"
```

---

## 11. Bitwise Operators

Bitwise operators treat their operands as **32-bit signed integers** and operate on individual bits.

| Operator | Name | Example | Description |
|---|---|---|---|
| `&` | AND | `5 & 3` --> `1` | Sets bit to 1 if both bits are 1 |
| `\|` | OR | `5 \| 3` --> `7` | Sets bit to 1 if either bit is 1 |
| `^` | XOR | `5 ^ 3` --> `6` | Sets bit to 1 if bits are different |
| `~` | NOT | `~5` --> `-6` | Inverts all bits |
| `<<` | Left shift | `5 << 1` --> `10` | Shifts bits left, fills with 0 |
| `>>` | Right shift (sign-propagating) | `-8 >> 2` --> `-2` | Shifts bits right, preserves sign |
| `>>>` | Right shift (zero-fill) | `-8 >>> 2` --> `1073741822` | Shifts bits right, fills with 0 |

### Examples

```js
// Binary representations:
// 5  = 0101
// 3  = 0011

console.log(5 & 3);  // 1  (0101 & 0011 = 0001)
console.log(5 | 3);  // 7  (0101 | 0011 = 0111)
console.log(5 ^ 3);  // 6  (0101 ^ 0011 = 0110)
console.log(~5);      // -6 (inverts all 32 bits)
console.log(5 << 1);  // 10 (0101 -> 1010)
console.log(5 >> 1);  // 2  (0101 -> 0010)
```

### Practical Uses

```js
// Fast integer check (truncates decimals)
console.log(~~3.7);    // 3 (double NOT truncates to integer)
console.log(3.7 | 0);  // 3 (OR with 0 truncates to integer)
console.log(3.7 << 0); // 3

// Check if a number is even/odd (faster than modulus in tight loops)
console.log(4 & 1); // 0 (even)
console.log(5 & 1); // 1 (odd)

// Swap two variables without a temporary variable
let a = 5, b = 3;
a ^= b;  // a = 5 ^ 3 = 6
b ^= a;  // b = 3 ^ 6 = 5
a ^= b;  // a = 6 ^ 5 = 3
console.log(a, b); // 3, 5

// Permissions/flags
const READ = 1;    // 001
const WRITE = 2;   // 010
const EXECUTE = 4; // 100

let permissions = READ | WRITE; // 011 (3)
console.log(permissions & READ);    // 1 (truthy: has read)
console.log(permissions & EXECUTE); // 0 (falsy: no execute)

permissions |= EXECUTE; // Add execute: 111 (7)
permissions &= ~WRITE;  // Remove write: 101 (5)
```

---

## 12. Operator Precedence

Operators are evaluated in a specific order. Higher precedence executes first.

| Precedence | Operator(s) | Description | Associativity |
|---|---|---|---|
| 18 | `()` | Grouping | n/a |
| 17 | `.`, `?.`, `[]` | Member access, optional chaining | Left-to-right |
| 16 | `()` (call), `new` (with args) | Function call, constructor | Left-to-right |
| 15 | `new` (no args) | Constructor without arguments | Right-to-left |
| 14 | `++`, `--` (postfix) | Post-increment/decrement | n/a |
| 13 | `!`, `~`, `+`, `-`, `++`, `--` (prefix), `typeof`, `void`, `delete`, `await` | Unary operators | Right-to-left |
| 12 | `**` | Exponentiation | Right-to-left |
| 11 | `*`, `/`, `%` | Multiplication, division, remainder | Left-to-right |
| 10 | `+`, `-` | Addition, subtraction | Left-to-right |
| 9 | `<<`, `>>`, `>>>` | Bitwise shift | Left-to-right |
| 8 | `<`, `<=`, `>`, `>=`, `in`, `instanceof` | Relational | Left-to-right |
| 7 | `==`, `!=`, `===`, `!==` | Equality | Left-to-right |
| 6 | `&` | Bitwise AND | Left-to-right |
| 5 | `^` | Bitwise XOR | Left-to-right |
| 4 | `\|` | Bitwise OR | Left-to-right |
| 3 | `&&` | Logical AND | Left-to-right |
| 2 | `\|\|`, `??` | Logical OR, Nullish coalescing | Left-to-right |
| 1 | `? :` | Ternary | Right-to-left |
| 0 | `=`, `+=`, `-=`, etc. | Assignment | Right-to-left |

### Precedence Examples

```js
// Multiplication before addition
console.log(2 + 3 * 4);   // 14 (not 20)
console.log((2 + 3) * 4); // 20 (parentheses override)

// && before ||
console.log(true || false && false); // true
// Evaluated as: true || (false && false) -> true || false -> true

// Comparison before logical
console.log(1 + 2 > 2 && 3 * 2 === 6);
// Evaluated as: ((1 + 2) > 2) && ((3 * 2) === 6) -> (3 > 2) && (6 === 6) -> true

// Assignment is right-to-left
let a, b, c;
a = b = c = 5;
console.log(a, b, c); // 5, 5, 5

// Exponentiation is right-to-left
console.log(2 ** 3 ** 2); // 512 (evaluated as 2 ** (3 ** 2) = 2 ** 9)
```

**Best Practice:** When in doubt, use parentheses. They make your intent explicit and code more readable.

---

## Summary

- The `+` operator is the most error-prone due to its dual role (addition and concatenation).
- Always use `===` and `!==` over `==` and `!=` to avoid coercion surprises.
- Logical operators (`&&`, `||`) return operand values, not booleans -- this enables powerful short-circuit patterns.
- Use `??` instead of `||` when `0`, `""`, or `false` are valid values.
- Use `?.` to safely navigate nested objects without verbose null checks.
- The spread operator (`...`) is essential for immutable data patterns.
- Use parentheses liberally to make operator precedence explicit and code readable.
