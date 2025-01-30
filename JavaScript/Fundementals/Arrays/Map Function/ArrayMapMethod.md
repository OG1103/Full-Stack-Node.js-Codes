
# JavaScript Array.prototype.map() Method

The `map()` method creates a new array by applying a function to each element of the original array. It does **not** modify the original array but returns a transformed version of it.

## Syntax
```javascript
array.map(function(currentValue, index, array), thisArg);
```

### Parameters:
- `currentValue` (required): The current element being processed in the array.
- `index` (optional): The index of the current element.
- `array` (optional): The array that `map()` is being called on.
- `thisArg` (optional): Value to use as `this` when executing the callback function.

### Returns:
- A new array with the results of calling the provided function on every element.

---

## Examples and Explanations

### Basic Example
```javascript
const numbers = [1, 2, 3, 4, 5];

const doubledNumbers = numbers.map(function (number) {
  return number * 2;
});

console.log("Original array:", numbers); // Output: [1, 2, 3, 4, 5]
console.log("Doubled array:", doubledNumbers); // Output: [2, 4, 6, 8, 10]
```
**Explanation:**
- The `map()` method loops over each element in the `numbers` array.
- It applies the callback function, which multiplies each element by `2`.
- The resulting array is stored in `doubledNumbers`.

---

### Using Arrow Functions
```javascript
const tripledNumbers = numbers.map((num) => num * 3);
console.log("Tripled array:", tripledNumbers); // Output: [3, 6, 9, 12, 15]
```

---

### Example with Index
```javascript
const multipliedByIndex = numbers.map((num, index) => num * index);
console.log("Numbers multiplied by their index:", multipliedByIndex); // Output: [0, 2, 6, 12, 20]
```

---

### Example with Array of Objects
```javascript
const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 },
];

const names = people.map((person) => person.name);
console.log("Names array:", names); // Output: ['Alice', 'Bob', 'Charlie']
```

---

### Transforming Data
```javascript
const products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Phone", price: 500 },
];

const productSummaries = products.map((product) => ({
  productName: product.name,
  productPrice: product.price,
}));

console.log("Product summaries:", productSummaries);
// Output: [{ productName: 'Laptop', productPrice: 1000 }, { productName: 'Phone', productPrice: 500 }]
```

---

### Chaining map() with Other Array Methods
```javascript
const mixedNumbers = [1, 2, 3, 4, 5, 6];

const evenDoubled = mixedNumbers
  .filter((num) => num % 2 === 0) // Filters out odd numbers: [2, 4, 6]
  .map((num) => num * 2); // Doubles the remaining numbers: [4, 8, 12]

console.log("Doubled even numbers:", evenDoubled); // Output: [4, 8, 12]
```

---

### Advanced Example: Calculating Average Grades
```javascript
const students = [
  { id: 1, name: "Alice", grades: [85, 92, 78] },
  { id: 2, name: "Bob", grades: [88, 79, 94] },
  { id: 3, name: "Charlie", grades: [95, 89, 90] },
];

const studentsWithAverage = students.map((student) => {
  const totalGrades = student.grades.reduce((sum, grade) => sum + grade, 0);
  const averageGrade = totalGrades / student.grades.length;

  return {
    id: student.id,
    name: student.name,
    average: averageGrade.toFixed(2),
  };
});

console.log("Students with average grades:", studentsWithAverage);
// Output:
// [
//   { id: 1, name: 'Alice', average: '85.00' },
//   { id: 2, name: 'Bob', average: '87.00' },
//   { id: 3, name: 'Charlie', average: '91.33' }
// ]
```

---

## Key Points:
- `map()` is non-destructive: It does not change the original array.
- It is often used to transform arrays or extract specific properties from objects.
- It works well in combination with other array methods like `filter()` and `reduce()`.
