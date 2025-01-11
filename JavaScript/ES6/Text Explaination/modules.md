
# Key Concepts of ES6 Modules

## Export and Import
- **export**: Used to export functions, objects, or variables from a module so they can be imported and used in other files.
- **import**: Used to import functions, objects, or variables from other modules.

---

## Types of Exports
- **Named Exports**
- **Default Exports**

---

## Named Exports
Named exports allow you to export multiple values from a module. When using named exports, you have to use the same name when importing the values.

### Example:
**math.js**
```javascript
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
```

**main.js**
```javascript
import { add, subtract } from './math';
```

---

## Default Exports
Default exports are used when you want to export a single value from a module. Unlike named exports, the name used to import default exports can be different from the name of the exported value.

### Example:
**greet.js**
```javascript
export default function greet(name) {
    return `Hello, ${name}!`;
}
```

**main.js**
```javascript
import hey from './greet';
```

- There can only be **one default export per module**.

---

## Exporting a `const` Variable and Exporting it as Default at the End
You can declare a function or variable with `const` (or `let`/`var`) and export it as the default export at the end of the file.

### Example:
**mathUtils.js**
```javascript
const add = (a, b) => a + b;

export default add;
export default { anyOtherConstOrFunction };
```

**main.js**
```javascript
import sum, { anyOtherFunction } from './mathUtils';

console.log(sum(2, 3)); // Output: 5
```

---

## Exporting an Anonymous Arrow Function Directly
When you export an anonymous arrow function directly as a default export, you do it without giving the function a name or declaration.

### Syntax:
```javascript
export default (parameters) => {
    // function body
};
```

### Example:
**arrayUtils.js**
```javascript
export const PI = 3.14159;
export const E = 2.718;
export const square = (x) => x * x;

export default (numbers) => {
    return numbers.map((num) => num * 2);
};
```

**main.js**
```javascript
import processNumbers, { PI, E, square } from './arrayUtils';

const nums = [1, 2, 3, 4, 5];
const doubled = processNumbers(nums);

console.log(doubled); // Output: [2, 4, 6, 8, 10]
console.log(PI);      // Output: 3.14159
console.log(E);       // Output: 2.718
console.log(square(4)); // Output: 16
```

---

## Importing All Exports from a File
You can import all functions/constants that are exported (except default ones) from an entire file under one name as if it's an object and call the methods from there.

### Example:
```javascript
import * as Test from './filename.js';

// Call a function
Test.functionName(parameters);

// If you want to store something
const omar = Test.functionName(parameters);
```
