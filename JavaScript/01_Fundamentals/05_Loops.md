# JavaScript Loops

Loops allow you to execute a block of code repeatedly. JavaScript provides several loop types, each suited for different scenarios.

---

## 1. The `for` Loop

The most common loop. Use when you know the number of iterations in advance.

### Syntax

```javascript
for (initialization; condition; increment) {
  // code to execute each iteration
}
```

### How It Works

1. **Initialization** - Runs once before the loop starts
2. **Condition** - Checked before each iteration; loop stops when `false`
3. **Increment** - Runs after each iteration

### Examples

```javascript
// Basic counting
for (let i = 0; i < 5; i++) {
  console.log(i); // 0, 1, 2, 3, 4
}

// Iterating an array
const fruits = ["apple", "banana", "cherry"];
for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]);
}

// Reverse iteration
for (let i = fruits.length - 1; i >= 0; i--) {
  console.log(fruits[i]); // cherry, banana, apple
}

// Custom step
for (let i = 0; i <= 20; i += 5) {
  console.log(i); // 0, 5, 10, 15, 20
}

// Multiple variables
for (let i = 0, j = 10; i < j; i++, j--) {
  console.log(i, j); // 0 10, 1 9, 2 8, 3 7, 4 6
}
```

### Performance Tip: Cache Array Length

```javascript
// Less efficient - length checked every iteration
for (let i = 0; i < arr.length; i++) { }

// More efficient - length cached
for (let i = 0, len = arr.length; i < len; i++) { }
```

---

## 2. The `for...in` Loop

Iterates over the **enumerable property keys** of an object. Returns **keys** (property names).

### Syntax

```javascript
for (let key in object) {
  // code using key
}
```

### With Objects (Primary Use Case)

```javascript
const person = { name: "Alice", age: 30, city: "NYC" };

for (let key in person) {
  console.log(`${key}: ${person[key]}`);
}
// name: Alice
// age: 30
// city: NYC
```

### With Arrays (Not Recommended)

```javascript
const colors = ["red", "green", "blue"];

for (let index in colors) {
  console.log(index);        // "0", "1", "2" (strings, not numbers!)
  console.log(colors[index]); // red, green, blue
}
```

> **Warning**: `for...in` iterates over ALL enumerable properties, including inherited ones. It also returns indices as **strings**, not numbers. Use `for...of` or `.forEach()` for arrays instead.

### Filtering Inherited Properties

```javascript
const obj = { a: 1, b: 2 };

for (let key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key, obj[key]); // Only own properties
  }
}
```

---

## 3. The `for...of` Loop

Iterates over **iterable objects** (Arrays, Strings, Maps, Sets, NodeLists, arguments). Returns **values** directly.

### Syntax

```javascript
for (let value of iterable) {
  // code using value
}
```

### With Arrays

```javascript
const fruits = ["apple", "banana", "cherry"];

for (let fruit of fruits) {
  console.log(fruit); // apple, banana, cherry
}
```

### With Strings

```javascript
const name = "Hello";

for (let char of name) {
  console.log(char); // H, e, l, l, o
}
```

### With Maps and Sets

```javascript
// Map
const map = new Map([["name", "Alice"], ["age", 30]]);
for (let [key, value] of map) {
  console.log(`${key}: ${value}`);
}

// Set
const set = new Set([1, 2, 3, 3, 4]);
for (let value of set) {
  console.log(value); // 1, 2, 3, 4 (duplicates removed)
}
```

### Getting Index with `entries()`

```javascript
const fruits = ["apple", "banana", "cherry"];

for (let [index, fruit] of fruits.entries()) {
  console.log(`${index}: ${fruit}`);
}
// 0: apple
// 1: banana
// 2: cherry
```

> **Note**: `for...of` does NOT work with plain objects. Use `for...in` or `Object.entries()` for objects.

---

## 4. `for...in` vs `for...of` Comparison

| Feature | `for...in` | `for...of` |
|---------|-----------|-----------|
| **Iterates over** | Enumerable property **keys** | Iterable **values** |
| **Works with objects** | Yes (primary use) | No (objects are not iterable) |
| **Works with arrays** | Yes, but not recommended | Yes (preferred) |
| **Returns** | Keys as strings | Values directly |
| **Includes inherited** | Yes (prototype chain) | No |
| **Works with strings** | Yes (indices) | Yes (characters) |
| **Works with Map/Set** | No | Yes |

```javascript
const arr = ["a", "b", "c"];

for (let x in arr) console.log(x);  // "0", "1", "2" (indices as strings)
for (let x of arr) console.log(x);  // "a", "b", "c" (values)
```

---

## 5. The `while` Loop

Executes as long as the condition is `true`. Use when the number of iterations is unknown.

### Syntax

```javascript
while (condition) {
  // code to execute
  // must update condition to avoid infinite loop
}
```

### Examples

```javascript
// Basic counter
let count = 0;
while (count < 5) {
  console.log(count); // 0, 1, 2, 3, 4
  count++;
}

// Reading until a condition is met
let input;
while (input !== "quit") {
  input = prompt("Enter command (type 'quit' to exit):");
  console.log(`You entered: ${input}`);
}

// Processing a queue
const queue = [1, 2, 3, 4, 5];
while (queue.length > 0) {
  const item = queue.shift();
  console.log(`Processing: ${item}`);
}
```

> **Warning**: Always ensure the condition will eventually become `false`, otherwise you create an **infinite loop** that freezes the program.

---

## 6. The `do...while` Loop

Similar to `while`, but the code block executes **at least once** before the condition is checked.

### Syntax

```javascript
do {
  // code to execute (runs at least once)
} while (condition);
```

### Examples

```javascript
// Always runs at least once
let num = 10;
do {
  console.log(num); // 10 (runs once even though 10 >= 5)
  num++;
} while (num < 5);

// User input validation
let userInput;
do {
  userInput = prompt("Enter a number greater than 10:");
} while (Number(userInput) <= 10);

// Menu system
let choice;
do {
  choice = prompt("1) Start\n2) Settings\n3) Quit");
  switch (choice) {
    case "1": console.log("Starting..."); break;
    case "2": console.log("Settings..."); break;
    case "3": console.log("Goodbye!"); break;
    default:  console.log("Invalid choice");
  }
} while (choice !== "3");
```

### `while` vs `do...while`

| Feature | `while` | `do...while` |
|---------|---------|-------------|
| **Condition check** | Before each iteration | After each iteration |
| **Minimum executions** | 0 (may never run) | 1 (always runs once) |
| **Use case** | When you may not need to run | When at least one run is needed |

---

## 7. `break` and `continue`

### `break` - Exit the Loop Entirely

```javascript
for (let i = 0; i < 10; i++) {
  if (i === 5) break; // Stops the loop at 5
  console.log(i); // 0, 1, 2, 3, 4
}

// Finding an element
const users = ["Alice", "Bob", "Charlie"];
let found;
for (let user of users) {
  if (user === "Bob") {
    found = user;
    break; // Stop searching once found
  }
}
```

### `continue` - Skip to Next Iteration

```javascript
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue; // Skip even numbers
  console.log(i); // 1, 3, 5, 7, 9
}

// Skip invalid data
const data = [1, null, 3, undefined, 5];
for (let item of data) {
  if (item == null) continue; // Skip null and undefined
  console.log(item); // 1, 3, 5
}
```

---

## 8. Labeled Statements

Labels allow `break` and `continue` to target a specific outer loop in nested loops.

### Syntax

```javascript
labelName: for (...) {
  for (...) {
    break labelName;    // Breaks out of the labeled outer loop
    continue labelName; // Continues the labeled outer loop
  }
}
```

### Example

```javascript
outerLoop: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) {
      break outerLoop; // Breaks out of BOTH loops
    }
    console.log(`i=${i}, j=${j}`);
  }
}
// i=0, j=0
// i=0, j=1
// i=0, j=2
// i=1, j=0
// (stops here because break outerLoop)
```

---

## 9. Looping Best Practices

### Arrays - Prefer `for...of` or Array Methods

```javascript
const items = [1, 2, 3, 4, 5];

// Good - for...of for simple iteration
for (let item of items) {
  console.log(item);
}

// Good - forEach for side effects
items.forEach(item => console.log(item));

// Good - map for transformation
const doubled = items.map(item => item * 2);

// Good - filter for selection
const evens = items.filter(item => item % 2 === 0);

// Avoid - for...in for arrays (returns string indices, includes inherited)
```

### Objects - Prefer `for...in` or `Object` Methods

```javascript
const obj = { a: 1, b: 2, c: 3 };

// Good - for...in with hasOwnProperty
for (let key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key, obj[key]);
  }
}

// Good - Object.entries for key-value pairs
for (let [key, value] of Object.entries(obj)) {
  console.log(key, value);
}

// Good - Object.keys for keys only
Object.keys(obj).forEach(key => console.log(key));
```

---

## 10. Summary

| Loop Type | Use Case | Iterates Over |
|-----------|----------|---------------|
| `for` | Known iteration count, need index | Anything (manual control) |
| `for...in` | Object properties | Enumerable property **keys** |
| `for...of` | Arrays, strings, Maps, Sets | Iterable **values** |
| `while` | Unknown iterations, condition-based | Until condition is false |
| `do...while` | At least one execution needed | Until condition is false |
| `forEach` | Array iteration (no break/continue) | Array elements |
| `map/filter/reduce` | Transforming/filtering data | Array elements |
