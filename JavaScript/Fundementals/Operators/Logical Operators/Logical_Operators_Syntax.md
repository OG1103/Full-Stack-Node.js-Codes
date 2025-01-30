
# Logical Operators in JavaScript

Logical operators in JavaScript are used to combine or invert boolean expressions. They return a boolean value (`true` or `false`) based on the conditions.

## Types of Logical Operators

| Operator | Description                  | Example          | Result |
|----------|------------------------------|------------------|--------|
| `&&`     | Logical AND                  | `true && false`  | `false`|
| `||`     | Logical OR                   | `true || false`  | `true` |
| `!`      | Logical NOT                  | `!true`          | `false`|

### 1. Logical AND (`&&`)
- Returns `true` if **both** operands are `true`.
- If the first operand is falsy, it immediately returns that value.

Example:
```javascript
console.log(true && true);  // true
console.log(true && false); // false
console.log(false && "Hello"); // false
```

### 2. Logical OR (`||`)
- Returns `true` if **at least one** operand is `true`.
- If the first operand is truthy, it immediately returns that value.

Example:
```javascript
console.log(true || false); // true
console.log(false || true); // true
console.log(false || 42);   // 42 (returns the first truthy value)
```

### 3. Logical NOT (`!`)
- Returns the inverse of the operand. If the operand is `true`, it returns `false`, and vice versa.

Example:
```javascript
console.log(!true);  // false
console.log(!false); // true
```

## Truthy and Falsy Values

### Truthy Values
All values are considered "truthy" unless they are defined as "falsy." Examples of truthy values:
- `true`
- Non-empty strings (`"hello"`)
- Numbers other than `0` (`42`)
- Arrays (`[]`) and objects (`{}`)

### Falsy Values
These values are considered "falsy":
- `false`
- `0`
- `""` (empty string)
- `null`
- `undefined`
- `NaN`

## Short-Circuit Evaluation

1. **Logical AND (`&&`)** stops and returns the first falsy value.
2. **Logical OR (`||`)** stops and returns the first truthy value.

Example:
```javascript
console.log(false && "Hello"); // false
console.log(true || "World");  // true
```

## Examples

### Example 1: Checking multiple conditions
```javascript
let age = 25;
let hasLicense = true;

if (age >= 18 && hasLicense) {
    console.log("You can drive.");
} else {
    console.log("You cannot drive.");
}
```

### Example 2: Providing a default value with `||`
```javascript
let username = "";
let displayName = username || "Guest";

console.log(displayName); // Outputs: Guest
```

### Example 3: Inverting a condition with `!`
```javascript
let isComplete = false;

if (!isComplete) {
    console.log("Task is not complete.");
} else {
    console.log("Task is complete.");
}
```

### Example 4: Combining logical operators
```javascript
let x = 10;
let y = 5;

if (x > y && y > 0) {
    console.log("Both conditions are true.");
}
```

### Example 5: Using logical operators in assignments
```javascript
let value = 0;
let result = value || 42;

console.log(result); // Outputs: 42 (default value)
```

### Notes
- Logical operators are commonly used in conditional statements (`if`, `while`, etc.).
- Always test the truthy or falsy nature of your variables when using logical operators.
