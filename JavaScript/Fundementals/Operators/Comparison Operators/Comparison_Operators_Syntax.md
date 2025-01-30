
# Comparison Operators in JavaScript

Comparison operators in JavaScript are used to compare two values. The result of a comparison is always a boolean value: `true` or `false`.

## Common Comparison Operators

| Operator   | Description                             | Example                 | Result |
|------------|-----------------------------------------|-------------------------|--------|
| `==`       | Equal (value only)                     | `5 == "5"`             | `true` |
| `===`      | Strict Equal (value and type)          | `5 === "5"`            | `false`|
| `!=`       | Not Equal (value only)                 | `5 != "5"`             | `false`|
| `!==`      | Strict Not Equal (value and type)      | `5 !== "5"`            | `true` |
| `>`        | Greater Than                           | `10 > 5`               | `true` |
| `<`        | Less Than                              | `10 < 5`               | `false`|
| `>=`       | Greater Than or Equal                  | `5 >= 5`               | `true` |
| `<=`       | Less Than or Equal                     | `5 <= 10`              | `true` |

### Special Operator: Modulus (`%`)
The modulus operator returns the remainder of a division.

Example:
```javascript
console.log(10 % 3); // Outputs: 1
```

## Key Differences Between `==` and `===`

1. **`==` (Abstract Equality Comparison)**:
   - Performs type coercion before comparing.
   - Example:
     ```javascript
     console.log(5 == "5"); // true
     ```

2. **`===` (Strict Equality Comparison)**:
   - Does not perform type coercion; checks both value and type.
   - Example:
     ```javascript
     console.log(5 === "5"); // false
     ```

### Use Cases
- Use `==` for loose comparisons where type conversion is acceptable.
- Use `===` for strict comparisons to avoid unexpected results due to type coercion.

## Examples and Explanations

### Example 1: Basic Comparisons
```javascript
let x = 5;
let y = "5";

console.log(x == y); // true
console.log(x === y); // false
console.log(x != y); // false
console.log(x !== y); // true
```

### Example 2: Greater and Less Comparisons
```javascript
let a = 10;
let b = 20;

console.log(a > b);  // false
console.log(a < b);  // true
console.log(a >= 10); // true
console.log(b <= 15); // false
```

### Example 3: Type Coercion in Comparisons
```javascript
let num = 0;
let str = "0";

console.log(num == str);  // true (type coercion occurs)
console.log(num === str); // false (no type coercion)
```

### Example 4: Boolean Conversion in Conditions
```javascript
let emptyString = "";

if (emptyString) {
    console.log("This will not print because empty string is falsy.");
} else {
    console.log("Empty string is considered falsy.");
}
// Output: Empty string is considered falsy.
```

### Falsy Values in JavaScript
Values considered "falsy" (evaluate to `false` in a boolean context):
- `false`
- `0`
- `""` (empty string)
- `null`
- `undefined`
- `NaN`
