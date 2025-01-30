
# JavaScript Array.prototype.every() Method

The `every()` method tests whether all elements in the array pass the test implemented by the provided function (callback).

## Syntax
```javascript
array.every(callback(element, index, array), thisArg)
```

### Parameters:
- `callback`: A function to test each element of the array.
  - `element`: The current element being processed in the array.
  - `index` (optional): The index of the current element.
  - `array` (optional): The array `every()` was called upon.
- `thisArg` (optional): Value to use as `this` when executing `callback`.

### Returns:
- `true` if the callback returns `true` for every element.
- `false` if the callback returns `false` for at least one element.

### Important:
- `every()` does not mutate the original array.
- The `callback` function stops running as soon as it encounters a `false` result.

---

### Examples and Explanations

#### Example 1: Simple example with numbers
```javascript
const numbers = [2, 4, 6, 8, 10];
const allEven = numbers.every((num) => num % 2 === 0);
console.log(allEven); // Output: true
```
All elements in the array are even numbers.

---

#### Example 2: Mixed numbers
```javascript
const mixedNumbers = [2, 4, 5, 8, 10];
const allEvenMixed = mixedNumbers.every((num) => num % 2 === 0);
console.log(allEvenMixed); // Output: false
```
The number 5 is not even, so the result is `false`.

---

#### Example 3: Checking array elements with a condition
```javascript
const ages = [18, 21, 25, 32];
const allAdults = ages.every((age) => age >= 18);
console.log(allAdults); // Output: true
```
All elements satisfy the condition `age >= 18`.

---

#### Example 4: More complex example with objects
```javascript
const users = [
  { name: "Alice", age: 25, active: true },
  { name: "Bob", age: 30, active: true },
  { name: "Charlie", age: 22, active: false },
];

const allActive = users.every((user) => user.active === true);
console.log(allActive); // Output: false
```
`Charlie` is not active, so the result is `false`.

---

#### Example 5: Checking nested properties in objects
```javascript
const teams = [
  { name: "Team A", members: [{ name: "Alice" }, { name: "Bob" }] },
  { name: "Team B", members: [{ name: "Charlie" }, { name: "David" }] },
];

const hasMultipleMembers = teams.every((team) => team.members.length > 1);
console.log(hasMultipleMembers); // Output: true
```
Every team has more than one member.

---

#### Example 6: Checking arrays with mixed data types
```javascript
const mixedArray = [2, "hello", true, {}, null];
const allNumbers = mixedArray.every((element) => typeof element === "number");
console.log(allNumbers); // Output: false
```
Not all elements are numbers.

---

#### Example 7: Combining `every()` with other methods (e.g., `filter()`)
```javascript
const products = [
  { name: "Laptop", price: 1000, available: true },
  { name: "Phone", price: 500, available: false },
  { name: "Tablet", price: 800, available: true },
];

const areAllExpensiveAvailableProducts = products
  .filter((product) => product.available === true)
  .every((product) => product.price > 700);
console.log(areAllExpensiveAvailableProducts); // Output: true
```

---

#### Example 8: Using index and array parameters
```javascript
const numbersWithIndexCheck = [1, 2, 3, 4, 5];
const greaterThanIndex = numbersWithIndexCheck.every(
  (num, index) => num > index
);
console.log(greaterThanIndex); // Output: true
```

---

### Complex Example
#### Comparing Two Objects
```javascript
const objA = { a: 1, b: 1, c: 1 };
const objB = { a: 1, b: 1, c: 1 };
const objC = { a: 1, b: 1, d: 1 };

const objEqual1 = (obj1, obj2) => {
  return Object.keys(obj1).every((key) => obj2[key]);
};

console.log(objEqual1(objA, objB)); // Output: true
console.log(objEqual1(objA, objC)); // Output: false
```
In this example, we check if all keys in one object exist in the other and have truthy values.
