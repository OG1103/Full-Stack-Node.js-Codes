##  Using Slice and Splice

### `slice()` Method
The `slice()` method extracts a portion of an array without modifying the original array.

```javascript
let numbers = [1, 2, 3, 4, 5];
let sliced = numbers.slice(1, 4);
console.log(sliced); // Output: [2, 3, 4]
```

- The original array remains unchanged.
- The `slice()` method does not include the end index.

### `splice()` Method
The `splice()` method modifies an array by adding, removing, or replacing elements.

#### Removing Elements
```javascript
let numbers = [1, 2, 3, 4, 5];
numbers.splice(2, 2); // Removes two elements starting from index 2
console.log(numbers); // Output: [1, 2, 5]
```

#### Replacing Elements
```javascript
let numbers = [1, 2, 3, 4, 5];
numbers.splice(2, 1, "a"); // Replaces one element at index 2
console.log(numbers); // Output: [1, 2, "a", 4, 5]
```

#### Adding Elements Without Removing Any
```javascript
let numbers = [1, 2, 3, 4, 5];
numbers.splice(2, 0, "x", "y"); // Adds elements at index 2 without removal
console.log(numbers); // Output: [1, 2, "x", "y", 3, 4, 5]
```

- The `splice()` method modifies the original array directly.
- You can use it to remove, replace, or add elements in place.

---


