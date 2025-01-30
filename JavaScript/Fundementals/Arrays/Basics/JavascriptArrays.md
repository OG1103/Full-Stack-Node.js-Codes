
# JavaScript Arrays with Basic Methods

Arrays in JavaScript are objects used to store an ordered collection of values (elements). They can hold elements of any type, including numbers, strings, objects, arrays, or mixed types.

---

## 1. Creating Arrays

### Using Array Literal Syntax
```javascript
let fruits = ["apple", "banana", "cherry"];
```

### Creating an Array of Objects
```javascript
let people = [
  { name: "John Doe", age: 30, job: "Software Developer" },
  { name: "Jane Smith", age: 25, job: "Graphic Designer" },
  { name: "Emily Johnson", age: 35, job: "Project Manager" },
];
```

### Using the Array Constructor
```javascript
let numbers = new Array(1, 2, 3, 4, 5);
```

### Mixed-Type Arrays (Not Recommended)
```javascript
let mixedArray = [
  42,
  "Hello, World!",
  true,
  { name: "Omar", age: 21 },
  [1, 2, 3],
  function () {
    console.log("This is a function inside an array!");
  },
  null,
  undefined,
];
```

---

## 2. Checking the Length of an Array
The `length` property returns the number of elements in an array.

```javascript
let fruits = ["apple", "banana", "cherry"];
console.log(fruits.length); // Output: 3
```

---

## 3. Combining Arrays
The `concat()` method is used to merge two or more arrays. This method does not modify the existing arrays; it returns a new array.

```javascript
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let combined = arr1.concat(arr2);
console.log(combined); // Output: [1, 2, 3, 4, 5, 6]
```

---

## 4. Splitting Strings into Arrays
The `split()` method splits a string into an array of substrings.

```javascript
let sentence = "The quick brown fox";
let words = sentence.split(" ");
console.log(words); // Output: ["The", "quick", "brown", "fox"]
```

---

## 5. Joining Arrays into Strings
The `join()` method joins all elements of an array into a string, separated by a specified delimiter.

```javascript
let fruits = ["apple", "banana", "cherry"];
let fruitString = fruits.join(", ");
console.log(fruitString); // Output: "apple, banana, cherry"
```

---

## 6. Reversing an Array
The `reverse()` method reverses the order of elements in an array.

```javascript
let numbers = [1, 2, 3, 4, 5];
let reversed = numbers.reverse();
console.log(reversed); // Output: [5, 4, 3, 2, 1]
```

---

## 7. Sorting an Array
The `sort()` method sorts the elements of an array in place. By default, it sorts elements as strings lexicographically.

```javascript
let fruits = ["banana", "apple", "cherry"];
fruits.sort();
console.log(fruits); // Output: ["apple", "banana", "cherry"]
```

### Sorting with a Comparison Function
To sort numbers correctly, provide a comparison function.

```javascript
let numbers = [40, 100, 1, 5, 25, 10];
numbers.sort((a, b) => a - b); // Ascending order
console.log(numbers); // Output: [1, 5, 10, 25, 40, 100]
```

---

## 8. Checking if an Array Includes an Element
The `includes()` method checks if an array contains a certain element, returning `true` or `false`.

```javascript
let fruits = ["apple", "banana", "cherry"];
console.log(fruits.includes("banana")); // Output: true
console.log(fruits.includes("grape")); // Output: false
```

---

## 9. Accessing and Modifying Array Elements

### Accessing Elements
Array elements can be accessed using their index, starting from 0.

```javascript
console.log(fruits[0]); // Output: "apple"
```

### Modifying Elements
Array elements can be updated by assigning new values to their specific index.

```javascript
fruits[1] = "blueberry";
console.log(fruits); // Output: ["apple", "blueberry", "cherry"]
```

---

## 10. Adding and Removing Elements

### Adding Elements

#### Adding at the End
```javascript
fruits.push("date");
console.log(fruits); // Output: ["apple", "blueberry", "cherry", "date"]
```

#### Adding at the Beginning
```javascript
fruits.unshift("kiwi");
console.log(fruits); // Output: ["kiwi", "apple", "blueberry", "cherry", "date"]
```

### Removing Elements

#### Removing from the End
```javascript
fruits.pop();
console.log(fruits); // Output: ["kiwi", "apple", "blueberry", "cherry"]
```

#### Removing from the Beginning
```javascript
fruits.shift();
console.log(fruits); // Output: ["apple", "blueberry", "cherry"]
```

---

## 11. Nested Arrays (Multi-Dimensional Arrays)
Arrays can contain other arrays, useful for representing grids or matrices.

```javascript
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(matrix[0][0]); // Output: 1
console.log(matrix[1][2]); // Output: 6
```

---

## Summary
- Arrays in JavaScript store ordered collections of elements and can contain mixed types.
- Use `.concat()`, `.join()`, `.split()`, `.includes()`, `.reverse()`, and `.sort()` for common operations.
- Access and modify elements directly using their index.
- Arrays are a versatile and essential part of JavaScript for managing collections of data.
