# Arrays in JavaScript

Arrays are ordered, indexed collections of values. They are one of the most commonly used data structures in JavaScript, providing a rich set of built-in methods for traversal, transformation, searching, and mutation. JavaScript arrays are dynamic (they can grow and shrink), can hold mixed types, and are technically objects.

---

## Table of Contents

1. [Array Creation](#1-array-creation)
2. [Accessing and Modifying Elements](#2-accessing-and-modifying-elements)
3. [Array Properties: length](#3-array-properties-length)
4. [Mutating Methods](#4-mutating-methods)
5. [Non-Mutating Methods](#5-non-mutating-methods)
6. [Iteration Methods](#6-iteration-methods)
7. [The reduce Method In Depth](#7-the-reduce-method-in-depth)
8. [Sorting with Custom Comparators](#8-sorting-with-custom-comparators)
9. [Destructuring Arrays](#9-destructuring-arrays)
10. [Spread Operator with Arrays](#10-spread-operator-with-arrays)
11. [Array-Like Objects](#11-array-like-objects)
12. [Chaining Array Methods](#12-chaining-array-methods)
13. [Multidimensional Arrays](#13-multidimensional-arrays)

---

## 1. Array Creation

There are several ways to create arrays in JavaScript, each with different use cases.

### Array Literal (Most Common)

```js
const empty = [];
const numbers = [1, 2, 3, 4, 5];
const mixed = [1, "hello", true, null, { name: "Alice" }, [1, 2]];
const withHoles = [1, , 3]; // Sparse array (avoid this)
```

### Array Constructor

```js
const arr1 = new Array(); // []
const arr2 = new Array(5); // [empty x 5] -- creates array with length 5, no actual elements
const arr3 = new Array(1, 2, 3); // [1, 2, 3]

// Gotcha: single numeric argument creates an empty array of that length
const gotcha = new Array(3); // [empty x 3], NOT [3]
console.log(gotcha.length); // 3
console.log(gotcha[0]); // undefined
```

### Array.from()

Creates a new array from an array-like or iterable object. Accepts an optional mapping function as the second argument.

```js
// From a string
const chars = Array.from("hello");
console.log(chars); // ['h', 'e', 'l', 'l', 'o']

// From a Set
const unique = Array.from(new Set([1, 2, 2, 3, 3]));
console.log(unique); // [1, 2, 3]

// From a Map
const map = new Map([["a", 1], ["b", 2]]);
console.log(Array.from(map)); // [['a', 1], ['b', 2]]

// With mapping function (second argument)
const squares = Array.from({ length: 5 }, (_, i) => (i + 1) ** 2);
console.log(squares); // [1, 4, 9, 16, 25]

// From NodeList (DOM)
// const divs = Array.from(document.querySelectorAll('div'));

// From arguments object
function example() {
  return Array.from(arguments);
}
console.log(example(1, 2, 3)); // [1, 2, 3]

// Generate a range
const range = Array.from({ length: 10 }, (_, i) => i);
console.log(range); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### Array.of()

Creates a new array from its arguments. Unlike `new Array()`, a single numeric argument is treated as an element, not a length.

```js
console.log(Array.of(3)); // [3] (NOT an empty array of length 3)
console.log(Array.of(1, 2, 3)); // [1, 2, 3]
console.log(Array.of("a", "b")); // ['a', 'b']

// Compare with Array constructor
console.log(new Array(3)); // [empty x 3]
console.log(Array.of(3)); // [3]
```

### Comparison Table

| Method            | Syntax                            | Use Case                          |
| ----------------- | --------------------------------- | --------------------------------- |
| Literal `[]`      | `[1, 2, 3]`                      | Most common, simple creation      |
| `new Array()`     | `new Array(1, 2, 3)`             | Rarely used; confusing with single arg |
| `Array.from()`    | `Array.from(iterable, mapFn)`    | Converting iterables/array-likes  |
| `Array.of()`      | `Array.of(1, 2, 3)`              | Creating arrays from arguments    |

---

## 2. Accessing and Modifying Elements

Arrays are zero-indexed: the first element is at index `0`, the second at index `1`, and so on.

```js
const fruits = ["apple", "banana", "cherry", "date"];

// Accessing elements
console.log(fruits[0]); // "apple"
console.log(fruits[2]); // "cherry"
console.log(fruits[fruits.length - 1]); // "date" (last element)
console.log(fruits[99]); // undefined (out of bounds, no error)

// Negative indexing with .at() (ES2022)
console.log(fruits.at(0)); // "apple"
console.log(fruits.at(-1)); // "date" (last element)
console.log(fruits.at(-2)); // "cherry" (second to last)

// Modifying elements
fruits[1] = "blueberry";
console.log(fruits); // ["apple", "blueberry", "cherry", "date"]

// Adding to a specific index (creates holes if index > length)
fruits[10] = "elderberry";
console.log(fruits.length); // 11
console.log(fruits[5]); // undefined (sparse array)
```

---

## 3. Array Properties: length

The `length` property returns the number of elements in the array. It is dynamic and automatically updates. It can also be set manually to truncate or extend an array.

```js
const arr = [1, 2, 3, 4, 5];
console.log(arr.length); // 5

// length updates automatically
arr.push(6);
console.log(arr.length); // 6

// Truncating by setting length
arr.length = 3;
console.log(arr); // [1, 2, 3] -- elements 4, 5, 6 are removed permanently

// Extending by setting length
arr.length = 6;
console.log(arr); // [1, 2, 3, empty x 3]
console.log(arr[4]); // undefined

// Clearing an array
arr.length = 0;
console.log(arr); // []

// length with sparse arrays
const sparse = [1, , , 4];
console.log(sparse.length); // 4 (counts the holes)
```

---

## 4. Mutating Methods

These methods **modify the original array in place** and may or may not return a value.

### push() -- Add to End

```js
const arr = [1, 2, 3];
const newLength = arr.push(4); // Returns new length
console.log(arr); // [1, 2, 3, 4]
console.log(newLength); // 4

// Push multiple elements
arr.push(5, 6, 7);
console.log(arr); // [1, 2, 3, 4, 5, 6, 7]
```

### pop() -- Remove from End

```js
const arr = [1, 2, 3, 4];
const removed = arr.pop(); // Returns removed element
console.log(removed); // 4
console.log(arr); // [1, 2, 3]
```

### unshift() -- Add to Beginning

```js
const arr = [2, 3, 4];
const newLength = arr.unshift(0, 1); // Returns new length
console.log(arr); // [0, 1, 2, 3, 4]
console.log(newLength); // 5
```

### shift() -- Remove from Beginning

```js
const arr = [1, 2, 3, 4];
const removed = arr.shift(); // Returns removed element
console.log(removed); // 1
console.log(arr); // [2, 3, 4]
```

### splice() -- Add, Remove, or Replace Elements

`splice(startIndex, deleteCount, ...itemsToInsert)` is the most versatile mutating method. It modifies the array in place and returns an array of deleted elements.

```js
const arr = ["a", "b", "c", "d", "e"];

// Remove 2 elements starting at index 1
const removed = arr.splice(1, 2);
console.log(removed); // ['b', 'c']
console.log(arr); // ['a', 'd', 'e']

// Insert without removing (deleteCount = 0)
arr.splice(1, 0, "x", "y");
console.log(arr); // ['a', 'x', 'y', 'd', 'e']

// Replace elements
arr.splice(1, 2, "B", "C");
console.log(arr); // ['a', 'B', 'C', 'd', 'e']

// Remove from the end using negative index
const arr2 = [1, 2, 3, 4, 5];
arr2.splice(-2, 2); // Remove last 2 elements
console.log(arr2); // [1, 2, 3]

// Remove all elements from index 2 onward (omit deleteCount)
const arr3 = [1, 2, 3, 4, 5];
arr3.splice(2);
console.log(arr3); // [1, 2]
```

### sort() -- Sort In Place

Sorts the array in place and returns the sorted array. **By default, it converts elements to strings and sorts lexicographically (Unicode order).**

```js
// Default string sort (WARNING: not numeric!)
const nums = [10, 5, 40, 25, 100, 1];
nums.sort();
console.log(nums); // [1, 10, 100, 25, 40, 5] -- lexicographic order!

// Numeric sort (ascending)
nums.sort((a, b) => a - b);
console.log(nums); // [1, 5, 10, 25, 40, 100]

// Numeric sort (descending)
nums.sort((a, b) => b - a);
console.log(nums); // [100, 40, 25, 10, 5, 1]

// String sort (case-insensitive)
const words = ["Banana", "apple", "Cherry"];
words.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
console.log(words); // ['apple', 'Banana', 'Cherry']
```

> See [Section 8: Sorting with Custom Comparators](#8-sorting-with-custom-comparators) for detailed coverage.

### reverse() -- Reverse In Place

```js
const arr = [1, 2, 3, 4, 5];
arr.reverse();
console.log(arr); // [5, 4, 3, 2, 1]

// To reverse without mutating:
const original = [1, 2, 3];
const reversed = [...original].reverse();
console.log(original); // [1, 2, 3] (unchanged)
console.log(reversed); // [3, 2, 1]
```

### fill() -- Fill with a Static Value

`fill(value, start?, end?)` fills all elements from `start` (inclusive) to `end` (exclusive) with the given value.

```js
const arr = [1, 2, 3, 4, 5];

// Fill all
arr.fill(0);
console.log(arr); // [0, 0, 0, 0, 0]

// Fill from index 2 to end
arr.fill(9, 2);
console.log(arr); // [0, 0, 9, 9, 9]

// Fill from index 1 to 3 (exclusive)
arr.fill(5, 1, 3);
console.log(arr); // [0, 5, 5, 9, 9]

// Create an array filled with a value
const zeros = new Array(5).fill(0);
console.log(zeros); // [0, 0, 0, 0, 0]

// WARNING: fill with objects shares the same reference
const matrix = new Array(3).fill([]);
matrix[0].push(1);
console.log(matrix); // [[1], [1], [1]] -- all reference the same array!

// Correct way to fill with distinct objects
const matrixCorrect = Array.from({ length: 3 }, () => []);
matrixCorrect[0].push(1);
console.log(matrixCorrect); // [[1], [], []]
```

### Mutating Methods Summary

| Method      | Purpose                  | Returns                  | Modifies Original |
| ----------- | ------------------------ | ------------------------ | ----------------- |
| `push()`    | Add to end               | New length               | Yes               |
| `pop()`     | Remove from end          | Removed element          | Yes               |
| `unshift()` | Add to beginning         | New length               | Yes               |
| `shift()`   | Remove from beginning    | Removed element          | Yes               |
| `splice()`  | Add/remove/replace       | Array of removed items   | Yes               |
| `sort()`    | Sort elements            | The sorted array         | Yes               |
| `reverse()` | Reverse order            | The reversed array       | Yes               |
| `fill()`    | Fill with a value        | The modified array       | Yes               |

---

## 5. Non-Mutating Methods

These methods return a new value or array without modifying the original.

### slice() -- Extract a Portion

`slice(start?, end?)` returns a shallow copy of a portion of the array from `start` (inclusive) to `end` (exclusive).

```js
const arr = ["a", "b", "c", "d", "e"];

console.log(arr.slice(1, 3)); // ['b', 'c']
console.log(arr.slice(2)); // ['c', 'd', 'e'] (from index 2 to end)
console.log(arr.slice(-2)); // ['d', 'e'] (last 2 elements)
console.log(arr.slice(-3, -1)); // ['c', 'd']
console.log(arr.slice()); // ['a', 'b', 'c', 'd', 'e'] (shallow copy)
console.log(arr); // ['a', 'b', 'c', 'd', 'e'] (unchanged)
```

### concat() -- Merge Arrays

```js
const arr1 = [1, 2];
const arr2 = [3, 4];
const arr3 = [5, 6];

const merged = arr1.concat(arr2, arr3);
console.log(merged); // [1, 2, 3, 4, 5, 6]
console.log(arr1); // [1, 2] (unchanged)

// Can also concat individual values
const withValues = arr1.concat(10, 20);
console.log(withValues); // [1, 2, 10, 20]
```

### includes() -- Check If Element Exists

```js
const fruits = ["apple", "banana", "cherry"];

console.log(fruits.includes("banana")); // true
console.log(fruits.includes("grape")); // false

// With fromIndex (start searching from this index)
console.log(fruits.includes("apple", 1)); // false (starts from index 1)

// NaN handling (includes can find NaN, unlike indexOf)
const nums = [1, 2, NaN, 4];
console.log(nums.includes(NaN)); // true
console.log(nums.indexOf(NaN)); // -1 (indexOf cannot find NaN)
```

### indexOf() and lastIndexOf() -- Find Index of Element

```js
const arr = ["a", "b", "c", "b", "a"];

console.log(arr.indexOf("b")); // 1 (first occurrence)
console.log(arr.indexOf("b", 2)); // 3 (searching from index 2)
console.log(arr.indexOf("z")); // -1 (not found)

console.log(arr.lastIndexOf("b")); // 3 (last occurrence)
console.log(arr.lastIndexOf("a")); // 4 (last occurrence)
```

### find() -- Find First Matching Element

Returns the first element that satisfies the provided testing function, or `undefined` if none is found.

```js
const users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 35 },
];

const bob = users.find((user) => user.name === "Bob");
console.log(bob); // { id: 2, name: "Bob", age: 30 }

const adult = users.find((user) => user.age > 28);
console.log(adult); // { id: 2, name: "Bob", age: 30 } (first match)

const notFound = users.find((user) => user.age > 50);
console.log(notFound); // undefined
```

### findIndex() -- Find Index of First Match

```js
const numbers = [5, 12, 8, 130, 44];

const index = numbers.findIndex((num) => num > 10);
console.log(index); // 1 (index of 12)

const noMatch = numbers.findIndex((num) => num > 200);
console.log(noMatch); // -1
```

### flat() -- Flatten Nested Arrays

`flat(depth?)` creates a new array with all sub-array elements concatenated up to the specified depth (default: 1).

```js
const nested = [1, [2, 3], [4, [5, 6]]];

console.log(nested.flat()); // [1, 2, 3, 4, [5, 6]] (depth 1)
console.log(nested.flat(2)); // [1, 2, 3, 4, 5, 6] (depth 2)

// Flatten completely with Infinity
const deeplyNested = [1, [2, [3, [4, [5]]]]];
console.log(deeplyNested.flat(Infinity)); // [1, 2, 3, 4, 5]

// flat() also removes empty slots
const sparse = [1, , 2, , 3];
console.log(sparse.flat()); // [1, 2, 3]
```

### flatMap() -- Map Then Flatten (Depth 1)

`flatMap()` is equivalent to calling `map()` followed by `flat(1)`. It is more efficient than calling both separately.

```js
const sentences = ["Hello world", "How are you"];

// Split each sentence into words and flatten
const words = sentences.flatMap((s) => s.split(" "));
console.log(words); // ['Hello', 'world', 'How', 'are', 'you']

// Without flatMap, you'd need:
const wordsOld = sentences.map((s) => s.split(" ")).flat();
console.log(wordsOld); // Same result

// Useful for filtering and mapping simultaneously
const nums = [1, 2, 3, 4, 5, 6];
const evenDoubled = nums.flatMap((n) => (n % 2 === 0 ? [n * 2] : []));
console.log(evenDoubled); // [4, 8, 12]

// Expanding elements
const pairs = [1, 2, 3];
const duplicated = pairs.flatMap((n) => [n, n]);
console.log(duplicated); // [1, 1, 2, 2, 3, 3]
```

### Non-Mutating Methods Summary

| Method         | Purpose                      | Returns                       |
| -------------- | ---------------------------- | ----------------------------- |
| `slice()`      | Extract a portion            | New array                     |
| `concat()`     | Merge arrays                 | New array                     |
| `includes()`   | Check if element exists      | Boolean                       |
| `indexOf()`    | Find index of element        | Index or -1                   |
| `lastIndexOf()`| Find last index of element   | Index or -1                   |
| `find()`       | Find first matching element  | Element or undefined          |
| `findIndex()`  | Find index of first match    | Index or -1                   |
| `flat()`       | Flatten nested arrays        | New flattened array            |
| `flatMap()`    | Map then flatten (depth 1)   | New flattened array            |

---

## 6. Iteration Methods

These methods execute a callback function for each element and are among the most used array methods.

### forEach() -- Execute for Each Element

`forEach()` calls a provided function once for each element. It always returns `undefined` and **cannot be stopped** (unlike `for` loops with `break`).

```js
const fruits = ["apple", "banana", "cherry"];

fruits.forEach((fruit, index, array) => {
  console.log(`${index}: ${fruit}`);
});
// 0: apple
// 1: banana
// 2: cherry

// forEach returns undefined -- do not assign it
const result = fruits.forEach((f) => f.toUpperCase());
console.log(result); // undefined
```

> **Note:** `forEach` cannot be broken out of early. Use `for...of` or `some`/`every` if you need early termination.

### map() -- Transform Each Element

`map()` creates a **new array** by applying a function to every element. The original array is unchanged.

```js
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map((n) => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]
console.log(numbers); // [1, 2, 3, 4, 5] (unchanged)

// Transform objects
const users = [
  { first: "Alice", last: "Smith" },
  { first: "Bob", last: "Jones" },
];
const fullNames = users.map((u) => `${u.first} ${u.last}`);
console.log(fullNames); // ['Alice Smith', 'Bob Jones']

// Using index parameter
const indexed = ["a", "b", "c"].map((val, i) => `${i + 1}. ${val}`);
console.log(indexed); // ['1. a', '2. b', '3. c']
```

### filter() -- Select Elements That Pass a Test

`filter()` creates a new array with all elements that pass the test implemented by the provided function.

```js
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const evens = numbers.filter((n) => n % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]

const greaterThan5 = numbers.filter((n) => n > 5);
console.log(greaterThan5); // [6, 7, 8, 9, 10]

// Filter objects
const products = [
  { name: "Laptop", price: 999 },
  { name: "Mouse", price: 25 },
  { name: "Keyboard", price: 75 },
  { name: "Monitor", price: 450 },
];

const expensive = products.filter((p) => p.price > 100);
console.log(expensive);
// [{ name: "Laptop", price: 999 }, { name: "Monitor", price: 450 }]

// Remove falsy values
const mixed = [0, 1, "", "hello", null, undefined, false, true, NaN];
const truthy = mixed.filter(Boolean);
console.log(truthy); // [1, 'hello', true]
```

### reduce() -- Accumulate to a Single Value

`reduce()` executes a reducer function on each element, resulting in a single output value. See the next section for a detailed breakdown.

```js
const numbers = [1, 2, 3, 4, 5];

const sum = numbers.reduce((accumulator, current) => accumulator + current, 0);
console.log(sum); // 15
```

### some() -- Test If At Least One Element Passes

Returns `true` if at least one element passes the test. **Short-circuits** on the first truthy result.

```js
const numbers = [1, 3, 5, 7, 8, 9];

console.log(numbers.some((n) => n % 2 === 0)); // true (8 is even)
console.log(numbers.some((n) => n > 10)); // false

// Useful for validation
const users = [
  { name: "Alice", active: false },
  { name: "Bob", active: true },
  { name: "Charlie", active: false },
];

const hasActiveUser = users.some((u) => u.active);
console.log(hasActiveUser); // true
```

### every() -- Test If All Elements Pass

Returns `true` only if **all** elements pass the test. **Short-circuits** on the first falsy result.

```js
const ages = [18, 21, 25, 30, 16];

console.log(ages.every((age) => age >= 18)); // false (16 fails)
console.log(ages.every((age) => age > 0)); // true

// Check if array is sorted
function isSorted(arr) {
  return arr.every((val, i) => i === 0 || arr[i - 1] <= val);
}

console.log(isSorted([1, 2, 3, 4, 5])); // true
console.log(isSorted([1, 3, 2, 4, 5])); // false
```

### Iteration Methods Summary

| Method      | Purpose                    | Returns         | Modifies Original |
| ----------- | -------------------------- | --------------- | ----------------- |
| `forEach()` | Execute for each element   | `undefined`     | No                |
| `map()`     | Transform each element     | New array       | No                |
| `filter()`  | Select matching elements   | New array       | No                |
| `reduce()`  | Accumulate to single value | Accumulated value | No              |
| `some()`    | Test if any element passes | Boolean         | No                |
| `every()`   | Test if all elements pass  | Boolean         | No                |

---

## 7. The reduce Method In Depth

`reduce()` is arguably the most powerful array method. It processes each element and accumulates a result, which can be any type -- a number, string, object, array, or even a function.

### Syntax

```js
array.reduce(callback(accumulator, currentValue, currentIndex, array), initialValue);
```

| Parameter      | Description                                                                      |
| -------------- | -------------------------------------------------------------------------------- |
| `accumulator`  | The running total / accumulated result from previous iterations                  |
| `currentValue` | The current element being processed                                              |
| `currentIndex` | The index of the current element (optional)                                      |
| `array`        | The array `reduce` was called on (optional)                                      |
| `initialValue` | The starting value for the accumulator (highly recommended to always provide)    |

### How It Works Step by Step

```js
const numbers = [1, 2, 3, 4, 5];

const sum = numbers.reduce((acc, curr) => {
  console.log(`acc: ${acc}, curr: ${curr}, result: ${acc + curr}`);
  return acc + curr;
}, 0);

// acc: 0, curr: 1, result: 1
// acc: 1, curr: 2, result: 3
// acc: 3, curr: 3, result: 6
// acc: 6, curr: 4, result: 10
// acc: 10, curr: 5, result: 15

console.log(sum); // 15
```

### Without Initial Value

If no `initialValue` is provided, the first element is used as the initial accumulator, and iteration starts from the second element. **This is risky with empty arrays** (throws `TypeError`).

```js
const numbers = [1, 2, 3];

// Without initial value: acc starts as numbers[0], iteration starts at index 1
const sum = numbers.reduce((acc, curr) => acc + curr);
console.log(sum); // 6

// DANGER: Empty array with no initial value
// [].reduce((acc, curr) => acc + curr); // TypeError: Reduce of empty array with no initial value

// SAFE: Always provide an initial value
[].reduce((acc, curr) => acc + curr, 0); // 0
```

### Common Use Cases

```js
// 1. Sum / Product
const nums = [1, 2, 3, 4, 5];
const sum = nums.reduce((acc, n) => acc + n, 0); // 15
const product = nums.reduce((acc, n) => acc * n, 1); // 120

// 2. Find maximum
const max = nums.reduce((acc, n) => (n > acc ? n : acc), -Infinity);
console.log(max); // 5

// 3. Count occurrences
const fruits = ["apple", "banana", "apple", "cherry", "banana", "apple"];
const counts = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log(counts); // { apple: 3, banana: 2, cherry: 1 }

// 4. Flatten an array
const nested = [[1, 2], [3, 4], [5, 6]];
const flat = nested.reduce((acc, curr) => acc.concat(curr), []);
console.log(flat); // [1, 2, 3, 4, 5, 6]

// 5. Group by a property
const people = [
  { name: "Alice", department: "Engineering" },
  { name: "Bob", department: "Marketing" },
  { name: "Charlie", department: "Engineering" },
  { name: "Diana", department: "Marketing" },
  { name: "Eve", department: "Engineering" },
];

const byDepartment = people.reduce((acc, person) => {
  const dept = person.department;
  if (!acc[dept]) acc[dept] = [];
  acc[dept].push(person.name);
  return acc;
}, {});

console.log(byDepartment);
// { Engineering: ['Alice', 'Charlie', 'Eve'], Marketing: ['Bob', 'Diana'] }

// 6. Pipeline / compose functions
const pipeline = [
  (x) => x + 1,
  (x) => x * 2,
  (x) => x - 3,
];

const result = pipeline.reduce((acc, fn) => fn(acc), 5);
console.log(result); // ((5 + 1) * 2) - 3 = 9

// 7. Remove duplicates
const dupes = [1, 2, 2, 3, 3, 3, 4];
const unique = dupes.reduce((acc, val) => {
  if (!acc.includes(val)) acc.push(val);
  return acc;
}, []);
console.log(unique); // [1, 2, 3, 4]

// 8. Build an object from key-value pairs
const entries = [["name", "Alice"], ["age", 30], ["role", "admin"]];
const obj = entries.reduce((acc, [key, value]) => {
  acc[key] = value;
  return acc;
}, {});
console.log(obj); // { name: "Alice", age: 30, role: "admin" }
```

### reduceRight()

`reduceRight()` works identically to `reduce()` but processes the array from right to left.

```js
const arr = [[1, 2], [3, 4], [5, 6]];

const leftToRight = arr.reduce((acc, curr) => acc.concat(curr), []);
console.log(leftToRight); // [1, 2, 3, 4, 5, 6]

const rightToLeft = arr.reduceRight((acc, curr) => acc.concat(curr), []);
console.log(rightToLeft); // [5, 6, 3, 4, 1, 2]
```

---

## 8. Sorting with Custom Comparators

The `sort()` method takes an optional comparator function `(a, b) => number`:

- **Negative return:** `a` comes before `b`
- **Zero return:** Order unchanged
- **Positive return:** `b` comes before `a`

### Numeric Sorting

```js
const numbers = [10, 5, 40, 25, 100, 1];

// Ascending
numbers.sort((a, b) => a - b);
console.log(numbers); // [1, 5, 10, 25, 40, 100]

// Descending
numbers.sort((a, b) => b - a);
console.log(numbers); // [100, 40, 25, 10, 5, 1]
```

### String Sorting

```js
const names = ["Charlie", "alice", "Bob", "diana"];

// Default (case-sensitive, uppercase first in Unicode)
names.sort();
console.log(names); // ['Bob', 'Charlie', 'alice', 'diana']

// Case-insensitive
names.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
console.log(names); // ['alice', 'Bob', 'Charlie', 'diana']

// Using localeCompare for proper internationalization
const german = ["ä", "z", "a"];
german.sort((a, b) => a.localeCompare(b, "de"));
console.log(german); // ['a', 'ä', 'z']
```

### Sorting Objects

```js
const users = [
  { name: "Charlie", age: 25 },
  { name: "Alice", age: 30 },
  { name: "Bob", age: 20 },
  { name: "Diana", age: 25 },
];

// Sort by age (ascending)
users.sort((a, b) => a.age - b.age);
console.log(users.map((u) => `${u.name}(${u.age})`));
// ['Bob(20)', 'Charlie(25)', 'Diana(25)', 'Alice(30)']

// Sort by name (ascending)
users.sort((a, b) => a.name.localeCompare(b.name));
console.log(users.map((u) => u.name));
// ['Alice', 'Bob', 'Charlie', 'Diana']

// Multi-level sort: by age, then by name
users.sort((a, b) => {
  if (a.age !== b.age) return a.age - b.age;
  return a.name.localeCompare(b.name);
});
console.log(users.map((u) => `${u.name}(${u.age})`));
// ['Bob(20)', 'Charlie(25)', 'Diana(25)', 'Alice(30)']
```

### Stable Sort

As of ES2019, `Array.prototype.sort` is guaranteed to be **stable**, meaning elements that compare equal retain their original relative order.

### Non-Mutating Sort with toSorted() (ES2023)

```js
const original = [3, 1, 4, 1, 5];
const sorted = original.toSorted((a, b) => a - b);
console.log(original); // [3, 1, 4, 1, 5] (unchanged)
console.log(sorted); // [1, 1, 3, 4, 5]

// Also: toReversed(), toSpliced(), with() -- ES2023 non-mutating counterparts
```

---

## 9. Destructuring Arrays

Array destructuring lets you unpack values from arrays into distinct variables using a concise syntax.

### Basic Destructuring

```js
const colors = ["red", "green", "blue"];

const [first, second, third] = colors;
console.log(first); // "red"
console.log(second); // "green"
console.log(third); // "blue"
```

### Skipping Elements

```js
const [a, , c] = [1, 2, 3, 4, 5];
console.log(a); // 1
console.log(c); // 3
```

### Default Values

```js
const [x = 10, y = 20, z = 30] = [1, 2];
console.log(x); // 1
console.log(y); // 2
console.log(z); // 30 (default used)
```

### Rest Pattern in Destructuring

```js
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]
```

### Swapping Variables

```js
let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(a); // 2
console.log(b); // 1
```

### Nested Destructuring

```js
const matrix = [[1, 2], [3, 4], [5, 6]];
const [[a, b], [c, d]] = matrix;
console.log(a, b, c, d); // 1 2 3 4

// Destructuring return values
function getCoordinates() {
  return [10, 20];
}
const [x, y] = getCoordinates();
console.log(x, y); // 10 20
```

---

## 10. Spread Operator with Arrays

The spread operator (`...`) expands an iterable (like an array) into individual elements.

### Copying Arrays (Shallow)

```js
const original = [1, 2, 3];
const copy = [...original];
copy.push(4);
console.log(original); // [1, 2, 3] (unchanged)
console.log(copy); // [1, 2, 3, 4]
```

### Merging Arrays

```js
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2];
console.log(merged); // [1, 2, 3, 4, 5, 6]

// Insert in the middle
const withMiddle = [1, ...arr2, 2, 3];
console.log(withMiddle); // [1, 4, 5, 6, 2, 3]
```

### Passing Array Elements as Function Arguments

```js
const numbers = [3, 1, 4, 1, 5, 9];
console.log(Math.max(...numbers)); // 9

// Before spread, you'd use apply:
console.log(Math.max.apply(null, numbers)); // 9
```

### Converting Iterables to Arrays

```js
const str = "hello";
const chars = [...str];
console.log(chars); // ['h', 'e', 'l', 'l', 'o']

const set = new Set([1, 2, 3, 2, 1]);
const unique = [...set];
console.log(unique); // [1, 2, 3]
```

> **Important:** Spread creates a **shallow copy**. Nested objects/arrays are still references.

```js
const nested = [[1, 2], [3, 4]];
const shallowCopy = [...nested];
shallowCopy[0].push(99);
console.log(nested[0]); // [1, 2, 99] -- the nested array is shared!
```

---

## 11. Array-Like Objects

An **array-like object** has a `length` property and indexed elements but does **not** inherit from `Array.prototype`. Common examples include `arguments`, NodeLists, and strings.

### Identifying Array-Like Objects

```js
// arguments object
function example() {
  console.log(arguments.length); // 3
  console.log(arguments[0]); // 'a'
  console.log(Array.isArray(arguments)); // false
  // arguments.map(x => x); // TypeError: arguments.map is not a function
}
example("a", "b", "c");

// NodeList from DOM
// const divs = document.querySelectorAll('div');
// console.log(divs.length); // number
// console.log(Array.isArray(divs)); // false
```

### Converting Array-Like Objects to Arrays

```js
// Method 1: Array.from()
function sumArgs() {
  const args = Array.from(arguments);
  return args.reduce((a, b) => a + b, 0);
}
console.log(sumArgs(1, 2, 3)); // 6

// Method 2: Spread operator
function sumArgs2() {
  return [...arguments].reduce((a, b) => a + b, 0);
}
console.log(sumArgs2(1, 2, 3)); // 6

// Method 3: Array.prototype.slice.call() (legacy)
function sumArgs3() {
  const args = Array.prototype.slice.call(arguments);
  return args.reduce((a, b) => a + b, 0);
}
console.log(sumArgs3(1, 2, 3)); // 6

// Custom array-like object
const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };
const realArray = Array.from(arrayLike);
console.log(realArray); // ['a', 'b', 'c']
```

---

## 12. Chaining Array Methods

Since methods like `map`, `filter`, `slice`, and `concat` return new arrays, they can be **chained** together to build complex transformations in a readable, declarative style.

```js
const orders = [
  { product: "Laptop", price: 999, quantity: 1 },
  { product: "Mouse", price: 25, quantity: 3 },
  { product: "Keyboard", price: 75, quantity: 2 },
  { product: "Monitor", price: 450, quantity: 1 },
  { product: "USB Cable", price: 10, quantity: 5 },
];

// Find total cost of all orders over $50, sorted by total (descending)
const result = orders
  .map((order) => ({
    product: order.product,
    total: order.price * order.quantity,
  }))
  .filter((order) => order.total > 50)
  .sort((a, b) => b.total - a.total)
  .map((order) => `${order.product}: $${order.total}`);

console.log(result);
// ['Laptop: $999', 'Monitor: $450', 'Keyboard: $150', 'Mouse: $75']
```

```js
// More chaining examples
const students = [
  { name: "Alice", grades: [90, 85, 92] },
  { name: "Bob", grades: [70, 75, 68] },
  { name: "Charlie", grades: [95, 98, 100] },
  { name: "Diana", grades: [60, 55, 65] },
];

// Get names of students with average grade >= 80, sorted alphabetically
const honorRoll = students
  .map((s) => ({
    name: s.name,
    avg: s.grades.reduce((a, b) => a + b, 0) / s.grades.length,
  }))
  .filter((s) => s.avg >= 80)
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((s) => `${s.name} (${s.avg.toFixed(1)})`);

console.log(honorRoll); // ['Alice (89.0)', 'Charlie (97.7)']
```

```js
// Chaining with reduce for a single result
const inventory = [
  { name: "Apples", category: "fruit", count: 50 },
  { name: "Bananas", category: "fruit", count: 30 },
  { name: "Carrots", category: "vegetable", count: 40 },
  { name: "Broccoli", category: "vegetable", count: 20 },
];

const totalFruitCount = inventory
  .filter((item) => item.category === "fruit")
  .reduce((total, item) => total + item.count, 0);

console.log(totalFruitCount); // 80
```

> **Performance Note:** Each chained method creates an intermediate array. For very large datasets, a single `reduce` or a `for` loop may be more efficient since it avoids multiple passes over the data.

---

## 13. Multidimensional Arrays

JavaScript does not have true multidimensional arrays, but you can create arrays of arrays to simulate them.

### Creating 2D Arrays

```js
// Literal
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// Accessing elements
console.log(matrix[0][0]); // 1
console.log(matrix[1][2]); // 6
console.log(matrix[2][1]); // 8

// Modifying
matrix[1][1] = 99;
console.log(matrix[1]); // [4, 99, 6]
```

### Creating Dynamically

```js
// Create a 3x4 matrix filled with zeros
const rows = 3;
const cols = 4;
const grid = Array.from({ length: rows }, () => new Array(cols).fill(0));
console.log(grid);
// [[0, 0, 0, 0],
//  [0, 0, 0, 0],
//  [0, 0, 0, 0]]

// WARNING: Incorrect way (shared reference)
const badGrid = new Array(3).fill(new Array(4).fill(0));
badGrid[0][0] = 1;
console.log(badGrid);
// [[1, 0, 0, 0],
//  [1, 0, 0, 0],  <-- all rows share the same array!
//  [1, 0, 0, 0]]
```

### Iterating Multidimensional Arrays

```js
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// Nested for loop
for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[i].length; j++) {
    process.stdout.write(`${matrix[i][j]} `);
  }
  console.log(); // newline
}
// 1 2 3
// 4 5 6
// 7 8 9

// Using for...of
for (const row of matrix) {
  for (const cell of row) {
    process.stdout.write(`${cell} `);
  }
  console.log();
}

// Using forEach
matrix.forEach((row) => {
  console.log(row.join(" "));
});

// Flatten and process
const allValues = matrix.flat();
console.log(allValues); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### Practical Example: Matrix Operations

```js
// Transpose a matrix
function transpose(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

const original = [
  [1, 2, 3],
  [4, 5, 6],
];

const transposed = transpose(original);
console.log(transposed);
// [[1, 4],
//  [2, 5],
//  [3, 6]]

// Matrix addition
function addMatrices(a, b) {
  return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}

const matA = [[1, 2], [3, 4]];
const matB = [[5, 6], [7, 8]];
console.log(addMatrices(matA, matB));
// [[6, 8], [10, 12]]
```
