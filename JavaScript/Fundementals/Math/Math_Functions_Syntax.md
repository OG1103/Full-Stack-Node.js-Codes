
# JavaScript Math Functions

The JavaScript `Math` object provides a variety of methods and constants to perform mathematical operations.

## Common Math Functions

### 1. `Math.abs(x)`
Returns the absolute value of a number (removes any negative sign).
```javascript
Math.abs(-7); // Output: 7
```

### 2. `Math.ceil(x)`
Rounds a number up to the nearest integer.
```javascript
Math.ceil(4.2); // Output: 5
```

### 3. `Math.floor(x)`
Rounds a number down to the nearest integer.
```javascript
Math.floor(4.9); // Output: 4
```

### 4. `Math.round(x)`
Rounds a number to the nearest integer.
```javascript
Math.round(4.5); // Output: 5
```

### 5. `Math.max(...numbers)`
Returns the largest number from a list.
```javascript
Math.max(3, 9, 1, 8, 4); // Output: 9
```

### 6. `Math.min(...numbers)`
Returns the smallest number from a list.
```javascript
Math.min(3, 9, 1, 8, 4); // Output: 1
```

### 7. `Math.pow(base, exponent)`
Raises the base to the power of the exponent.
```javascript
Math.pow(2, 3); // Output: 8
```

### 8. `Math.sqrt(x)`
Returns the square root of a number.
```javascript
Math.sqrt(16); // Output: 4
```

### 9. `Math.random()`
Returns a random number between `0` (inclusive) and `1` (exclusive).
```javascript
Math.random(); // Output: Random number between 0 and 1
```

### 10. `Math.PI`
A constant that represents the value of Pi (3.14159).
```javascript
Math.PI; // Output: 3.141592653589793
```

### 11. `Math.E`
A constant that represents Euler's number (2.718).
```javascript
Math.E; // Output: 2.718281828459045
```

### 12. `Math.log(x)`
Returns the natural logarithm (base E) of a number.
```javascript
Math.log(Math.E); // Output: 1
```

### 13. `Math.exp(x)`
Returns E raised to the power of x.
```javascript
Math.exp(1); // Output: 2.718281828459045 (Math.E)
```

### 14. `Math.sin(x)`, `Math.cos(x)`, `Math.tan(x)`
Returns the sine, cosine, and tangent of an angle (in radians).
```javascript
Math.sin(Math.PI / 2); // Output: 1
Math.cos(Math.PI); // Output: -1
Math.tan(Math.PI / 4); // Output: 1
```

### 15. `Math.sign(x)`
Returns the sign of a number (`1`, `-1`, or `0`).
```javascript
Math.sign(-10); // Output: -1
```

## Examples for Random Numbers

### Random Number in a Range
To get a random number between two values (`min` and `max`):
```javascript
let min = 1;
let max = 10;
let random = Math.floor(Math.random() * (max - min + 1)) + min;
console.log(random); // Random number between 1 and 10
```

## Summary
The `Math` object in JavaScript is a powerful tool for mathematical operations. It includes constants like `Math.PI` and `Math.E`, and functions for absolute values, rounding, exponents, random numbers, and trigonometry.
