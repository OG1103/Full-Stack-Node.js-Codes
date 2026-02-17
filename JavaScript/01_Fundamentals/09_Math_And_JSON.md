# JavaScript Math Object and JSON

---

## Part 1: The Math Object

The `Math` object provides mathematical constants and functions. It is a **static object** - you cannot create an instance of it. All methods and properties are accessed directly on `Math`.

---

### 1.1 Mathematical Constants

```javascript
Math.PI;      // 3.141592653589793 - Ratio of circle's circumference to diameter
Math.E;       // 2.718281828459045 - Euler's number (base of natural logarithms)
Math.LN2;     // 0.6931471805599453 - Natural logarithm of 2
Math.LN10;    // 2.302585092994046 - Natural logarithm of 10
Math.SQRT2;   // 1.4142135623730951 - Square root of 2
Math.SQRT1_2; // 0.7071067811865476 - Square root of 1/2
```

---

### 1.2 Rounding Methods

```javascript
Math.round(4.5);   // 5   - Rounds to nearest integer (0.5 rounds up)
Math.round(4.4);   // 4
Math.round(-4.5);  // -4  (rounds toward positive infinity)

Math.ceil(4.1);    // 5   - Always rounds UP (ceiling)
Math.ceil(-4.1);   // -4

Math.floor(4.9);   // 4   - Always rounds DOWN (floor)
Math.floor(-4.1);  // -5

Math.trunc(4.9);   // 4   - Removes decimal part (truncates toward zero)
Math.trunc(-4.9);  // -4  (different from floor for negatives!)
```

| Method | 4.3 | 4.7 | -4.3 | -4.7 |
|--------|-----|-----|------|------|
| `Math.round()` | 4 | 5 | -4 | -5 |
| `Math.ceil()` | 5 | 5 | -4 | -4 |
| `Math.floor()` | 4 | 4 | -5 | -5 |
| `Math.trunc()` | 4 | 4 | -4 | -4 |

---

### 1.3 Absolute Value and Sign

```javascript
Math.abs(-7);    // 7   - Absolute value (removes sign)
Math.abs(7);     // 7
Math.abs(-3.5);  // 3.5

Math.sign(10);   // 1   - Returns 1 (positive), -1 (negative), or 0
Math.sign(-10);  // -1
Math.sign(0);    // 0
```

---

### 1.4 Min, Max, and Power

```javascript
Math.max(1, 5, 3, 9, 2);   // 9   - Returns the largest value
Math.min(1, 5, 3, 9, 2);   // 1   - Returns the smallest value

// With arrays (use spread operator)
const numbers = [10, 20, 5, 30];
Math.max(...numbers);  // 30
Math.min(...numbers);  // 5

Math.pow(2, 3);   // 8   - 2 to the power of 3 (same as 2 ** 3)
Math.pow(9, 0.5); // 3   - Square root of 9

Math.sqrt(16);    // 4   - Square root
Math.sqrt(2);     // 1.4142135623730951

Math.cbrt(27);    // 3   - Cube root
Math.cbrt(64);    // 4
```

---

### 1.5 Logarithms

```javascript
Math.log(1);     // 0   - Natural logarithm (base e)
Math.log(Math.E); // 1

Math.log2(8);    // 3   - Logarithm base 2
Math.log2(1024); // 10

Math.log10(100);  // 2  - Logarithm base 10
Math.log10(1000); // 3
```

---

### 1.6 Random Numbers

`Math.random()` returns a random floating-point number between 0 (inclusive) and 1 (exclusive).

```javascript
Math.random();  // e.g., 0.7352946284718395

// Random float between 0 and max
Math.random() * 10;  // 0 to 9.999...

// Random integer between 0 and max (inclusive)
Math.floor(Math.random() * 11);  // 0 to 10

// Random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
getRandomInt(1, 6);   // 1 to 6 (like a dice roll)
getRandomInt(10, 20); // 10 to 20

// Random element from array
const colors = ["red", "green", "blue", "yellow"];
const randomColor = colors[Math.floor(Math.random() * colors.length)];

// Random boolean
const coinFlip = Math.random() < 0.5; // true or false

// Generate random hex color
function randomHexColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}
```

---

### 1.7 Trigonometric Functions

```javascript
Math.sin(Math.PI / 2);  // 1   - Sine (radians)
Math.cos(0);             // 1   - Cosine
Math.tan(Math.PI / 4);  // ~1  - Tangent

// Convert degrees to radians
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
Math.sin(toRadians(90)); // 1
```

---

## Part 2: JSON (JavaScript Object Notation)

JSON is a lightweight text-based data format used for storing and exchanging data. Despite its name, JSON is language-independent and used across virtually all programming languages.

---

### 2.1 JSON Syntax Rules

```json
{
  "name": "Alice",
  "age": 30,
  "isActive": true,
  "address": {
    "city": "NYC",
    "zip": "10001"
  },
  "hobbies": ["reading", "coding"],
  "spouse": null
}
```

**Rules:**
- Keys must be **double-quoted strings**
- Values can be: string, number, boolean, null, object, array
- No trailing commas allowed
- No comments allowed
- No `undefined`, functions, or `Date` objects
- No single quotes (must use double quotes)

### JSON vs JavaScript Object

| Feature | JSON | JS Object |
|---------|------|-----------|
| Keys | Must be double-quoted | Can be unquoted |
| Strings | Double quotes only | Single or double quotes |
| Functions | Not allowed | Allowed |
| Trailing commas | Not allowed | Allowed (ES2017+) |
| Comments | Not allowed | Allowed |
| `undefined` | Not allowed | Allowed |

---

### 2.2 `JSON.stringify()` - Object to JSON String

Converts a JavaScript value to a JSON string.

```javascript
const user = { name: "Alice", age: 30, isActive: true };

// Basic usage
const jsonStr = JSON.stringify(user);
// '{"name":"Alice","age":30,"isActive":true}'

// With pretty printing (indentation)
const pretty = JSON.stringify(user, null, 2);
/*
{
  "name": "Alice",
  "age": 30,
  "isActive": true
}
*/

// With 4 spaces
JSON.stringify(user, null, 4);

// With tab indentation
JSON.stringify(user, null, "\t");
```

#### Replacer Function

Filter or transform properties during stringification.

```javascript
const user = { name: "Alice", password: "secret123", age: 30 };

// Replacer as function - exclude sensitive data
const safe = JSON.stringify(user, (key, value) => {
  if (key === "password") return undefined; // Exclude this property
  return value;
});
// '{"name":"Alice","age":30}'

// Replacer as array - include only specified keys
const partial = JSON.stringify(user, ["name", "age"]);
// '{"name":"Alice","age":30}'
```

#### Values That Are Excluded

```javascript
const obj = {
  name: "Alice",
  func: function() {},   // Functions are excluded
  sym: Symbol("id"),     // Symbols are excluded
  undef: undefined       // undefined is excluded
};

JSON.stringify(obj); // '{"name":"Alice"}'
```

---

### 2.3 `JSON.parse()` - JSON String to Object

Converts a JSON string back to a JavaScript value.

```javascript
const jsonStr = '{"name":"Alice","age":30}';

const user = JSON.parse(jsonStr);
console.log(user.name); // "Alice"
console.log(user.age);  // 30
```

#### Reviver Function

Transform values during parsing.

```javascript
const jsonStr = '{"name":"Alice","birthDate":"1990-05-15T00:00:00.000Z"}';

const user = JSON.parse(jsonStr, (key, value) => {
  // Convert date strings back to Date objects
  if (key === "birthDate") return new Date(value);
  return value;
});

console.log(user.birthDate instanceof Date); // true
```

#### Error Handling

```javascript
try {
  const data = JSON.parse("invalid json");
} catch (error) {
  console.error("Invalid JSON:", error.message);
  // "Invalid JSON: Unexpected token i in JSON at position 0"
}
```

---

### 2.4 JSON with localStorage

LocalStorage only stores strings, so JSON methods are essential.

```javascript
// Save object to localStorage
const user = { name: "Alice", preferences: { theme: "dark" } };
localStorage.setItem("user", JSON.stringify(user));

// Retrieve object from localStorage
const storedUser = JSON.parse(localStorage.getItem("user"));
console.log(storedUser.preferences.theme); // "dark"

// Handle missing data
const data = JSON.parse(localStorage.getItem("nonexistent") || "null");
// Returns null if key doesn't exist
```

---

### 2.5 Deep Cloning with JSON

A simple (but limited) way to deep clone objects.

```javascript
const original = {
  name: "Alice",
  address: { city: "NYC", zip: "10001" },
  hobbies: ["reading", "coding"]
};

const deepClone = JSON.parse(JSON.stringify(original));
deepClone.address.city = "LA";
console.log(original.address.city); // "NYC" (not affected)
```

#### Limitations of JSON Deep Clone

```javascript
const obj = {
  date: new Date(),        // Becomes a string
  func: function() {},     // Lost entirely
  undef: undefined,        // Lost entirely
  regex: /test/g,          // Becomes empty object {}
  infinity: Infinity,      // Becomes null
  nan: NaN,                // Becomes null
  map: new Map(),          // Becomes empty object {}
  set: new Set()           // Becomes empty object {}
};

// For these cases, use structuredClone() instead
const properClone = structuredClone(obj);
// Handles Date, Map, Set, ArrayBuffer, etc. (but not functions)
```

---

### 2.6 Common JSON Patterns

#### API Response Handling

```javascript
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json(); // Parses JSON response body
  return data;
}
```

#### Configuration Files

```javascript
// Reading a JSON config (Node.js)
const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));

// package.json is a JSON file
// tsconfig.json is a JSON file (with comments extension)
```

#### Comparing Objects

```javascript
// Simple object comparison (order-dependent)
const obj1 = { a: 1, b: 2 };
const obj2 = { a: 1, b: 2 };

obj1 === obj2; // false (different references)
JSON.stringify(obj1) === JSON.stringify(obj2); // true (same content)

// Note: This fails if properties are in different order
const obj3 = { b: 2, a: 1 };
JSON.stringify(obj1) === JSON.stringify(obj3); // false!
```

---

### 2.7 Summary

| Method | Purpose | Returns |
|--------|---------|---------|
| `JSON.stringify(value)` | Convert JS value to JSON string | String |
| `JSON.stringify(value, replacer)` | Convert with filtering | String |
| `JSON.stringify(value, null, spaces)` | Convert with formatting | String |
| `JSON.parse(string)` | Convert JSON string to JS value | Any JS value |
| `JSON.parse(string, reviver)` | Convert with transformation | Any JS value |
