
# JavaScript Array.prototype.findIndex() Method

The `findIndex()` method returns the **index** of the first element in an array that satisfies the provided testing function. If no elements match the condition, it returns `-1`.

## Syntax
```javascript
array.findIndex(callback(element, index, array));
```

### Parameters:
- `callback`: A function executed for each element in the array.
  - `element`: The current element being processed.
  - `index` (optional): The index of the current element being processed.
  - `array` (optional): The array `findIndex` was called upon.

### Returns:
- The **index** of the first element that satisfies the condition.
- Returns `-1` if no elements match the condition.

---

### Examples and Explanations

#### Example 1: Basic usage of `findIndex`
```javascript
const numbers = [10, 20, 30, 40, 50];

const index = numbers.findIndex((number) => number > 25);
console.log("Index of the first number greater than 25:", index); // Output: 2
```
**Explanation:**
- The `findIndex` method iterates through the array: `[10, 20, 30, 40, 50]`.
- The callback checks if each number is greater than `25`.
- It returns `2` because `30` is the first element that satisfies the condition.

---

#### Example 2: Using `findIndex` to search for an object in an array
```javascript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

const userIndex = users.findIndex((user) => user.name === 'Bob');
console.log("Index of the user named 'Bob':", userIndex); // Output: 1
```
**Explanation:**
- This example demonstrates how to use `findIndex` with an array of objects.
- The callback checks if `user.name === 'Bob'`.
- It finds the object `{ id: 2, name: 'Bob' }` at index `1`.

---

#### Example 3: When no element matches the condition
```javascript
const noMatchIndex = numbers.findIndex((number) => number > 100);
console.log("Index when no element matches the condition:", noMatchIndex); // Output: -1
```
**Explanation:**
- The array `[10, 20, 30, 40, 50]` does not contain any element greater than `100`.
- The `findIndex` method returns `-1` when no match is found.

---

### Key Points:
- Use `findIndex` to locate the position of an element in an array based on a condition.
- The method stops searching once it finds the first match, making it efficient for large arrays.
- If no match is found, it returns `-1`.

---

### When to Use:
- To get the **index** of the first matching element in an array.
- To identify the position of an object or element when working with complex arrays.
