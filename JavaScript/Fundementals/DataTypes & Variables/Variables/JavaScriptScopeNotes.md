
# JavaScript Scope and Variables

In JavaScript, scope determines the accessibility of variables, objects, and functions at various parts of the code.

---

## 1. Console Log
`console.log()` is used to print statements in JavaScript. The output is visible in the browser's console or the terminal (if using Node.js).

```javascript
console.log("Hello, world!");
```

Example with concatenation:
```javascript
var x = 2 + "2"; // Outputs: "22" (string concatenation)
console.log(x); // Output: "22"
console.log(typeof x); // Output: "string"
```

---

## 2. JavaScript Variables: `var`, `let`, and `const`

### `var`
- Function-scoped: Accessible anywhere within the function.
- Hoisted: Declaration is moved to the top of its scope, but initialization is not.
- Can be re-declared and re-assigned within the same scope.

```javascript
var x = 3;
console.log(x); // Output: 3
```

### `let`
- Block-scoped: Accessible only within the block it is defined in.
- Hoisted but not initialized: Cannot be used before declaration.
- Cannot be re-declared in the same scope, but can be reassigned.

```javascript
let a = 5;
console.log(a); // Output: 5
```

### `const`
- Block-scoped: Like `let`, accessible only within the block.
- Hoisted but not initialized: Cannot be used before declaration.
- Must be initialized at the time of declaration.
- Cannot be re-assigned but the contents of objects or arrays can be modified.

```javascript
const pi = 3.14;
console.log(pi); // Output: 3.14
```

---

## 3. Hoisting

### `var` Hoisting
- Variable declarations are hoisted to the top, but initialization remains in place.
```javascript
console.log(y); // Output: undefined
var y = 5;
console.log(y); // Output: 5
```

### `let` and `const` Hoisting
- Variables are hoisted but not initialized, leading to a "temporal dead zone" error if accessed before declaration.

```javascript
// console.log(y); // Error: Cannot access 'y' before initialization
let y = 10;
const z = 20;
```

### Function Hoisting
- Function declarations are fully hoisted, including their definitions.
```javascript
sayHello(); // Output: "Hello, world!"

function sayHello() {
  console.log("Hello, world!");
}
```

---

## 4. JavaScript Scopes

### Global Scope
- Variables declared outside any block or function are globally accessible.

```javascript
var globalVar = "I am global";
console.log(globalVar); // Output: "I am global"
```

### Script Scope (Browser-Specific)
- Variables declared with `let` or `const` at the top level are in the script scope and are not attached to the `window` object.

```javascript
let scriptLet = "I am script scoped";
console.log(scriptLet); // Output: "I am script scoped"
console.log(window.scriptLet); // Output: undefined
```

### Block Scope
- Variables declared with `let` and `const` are block-scoped.
```javascript
if (true) {
  let blockLet = "I am block scoped";
  const blockConst = "I am also block scoped";
}
// console.log(blockLet); // Error: blockLet is not defined
```

### Function Scope
- Variables declared inside a function are accessible only within that function.
```javascript
function myFunction() {
  var functionVar = "I am function scoped";
  console.log(functionVar); // Output: "I am function scoped"
}
// console.log(functionVar); // Error: functionVar is not defined
```

---

## 5. Temporal Dead Zone
- `let` and `const` variables exist in a "temporal dead zone" from the start of their scope until they are declared.

```javascript
// console.log(x); // Error: Cannot access 'x' before initialization
let x = 5;
```

---

## Summary
- **Global Scope**: Accessible everywhere.
- **Block Scope**: Variables declared with `let` and `const` are limited to the block.
- **Function Scope**: Variables declared within a function are accessible only within it.
- Hoisting applies to both variables and functions, but `let` and `const` have stricter rules than `var`.
