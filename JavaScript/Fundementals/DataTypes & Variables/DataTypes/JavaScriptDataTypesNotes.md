
# JavaScript Data Types Explained

JavaScript is a dynamically typed language. When you declare a variable using `var`, `let`, or `const`, you do not specify its data type. The type is inferred from the assigned value.

---

## Primitive Data Types
JavaScript has 7 primitive data types:

1. **Number**
   - Represents both integers and floating-point numbers.
   ```javascript
   let num = 42; // integer
   let floatNum = 3.14; // floating-point number
   console.log(typeof num); // Output: "number"
   console.log(typeof floatNum); // Output: "number"
   ```

   ### Special Number Values
   - `Infinity`: Represents positive infinity.
   - `-Infinity`: Represents negative infinity.
   - `NaN`: Stands for "Not a Number."
   ```javascript
   let infinity = Infinity;
   let negativeInfinity = -Infinity;
   let notANumber = NaN;
   console.log(typeof notANumber); // Output: "number"
   ```

2. **String**
   - A sequence of characters used to represent text. Strings can be defined using single quotes, double quotes, or backticks.
   ```javascript
   let singleQuoteString = 'Hello, World!';
   let doubleQuoteString = "JavaScript is fun!";
   let templateLiteral = `The result is: ${num + floatNum}`;
   console.log(typeof singleQuoteString); // Output: "string"
   console.log(templateLiteral); // Output: "The result is: 45.14"
   ```

3. **Boolean**
   - Represents logical values: `true` or `false`.
   ```javascript
   let isJavaScriptFun = true;
   let isCodingHard = false;
   console.log(typeof isJavaScriptFun); // Output: "boolean"
   ```

4. **Undefined**
   - A variable that has been declared but has not yet been assigned a value.
   ```javascript
   let undefinedVariable;
   console.log(typeof undefinedVariable); // Output: "undefined"
   ```

5. **Null**
   - Represents the intentional absence of any object value. It is considered a primitive type.
   ```javascript
   let emptyValue = null;
   console.log(typeof emptyValue); // Output: "object"
   ```
   **Note**: `typeof null` returning `"object"` is a historical bug in JavaScript.

6. **Symbol**
   - A unique and immutable primitive value, often used as keys for object properties.
   ```javascript
   let uniqueId = Symbol("id");
   console.log(typeof uniqueId); // Output: "symbol"
   ```

7. **BigInt**
   - Represents whole numbers larger than `2^53 - 1` (Number.MAX_SAFE_INTEGER).
   ```javascript
   let largeNumber = 1234567890123456789012345678901234567890n;
   console.log(typeof largeNumber); // Output: "bigint"
   ```

---

## Non-Primitive Data Types
Non-primitive types include **Objects**, **Arrays**, and **Functions**.

1. **Objects**
   - A collection of properties and methods.
   ```javascript
   let person = {
     name: "John Doe",
     age: 30,
     isDeveloper: true,
   };
   console.log(typeof person); // Output: "object"
   ```

2. **Arrays**
   - A special type of object that stores ordered collections of data.
   ```javascript
   let array = [1, 2, 3, 4, 5];
   console.log(typeof array); // Output: "object"
   console.log(Array.isArray(array)); // Output: true
   ```

3. **Functions**
   - Functions are objects but have their own type: `function`.
   ```javascript
   function greet() {
     return "Hello!";
   }
   console.log(typeof greet); // Output: "function"
   ```

---

## Special Cases
### Type Checking
```javascript
console.log(typeof undefined); // Output: "undefined"
console.log(typeof null); // Output: "object"
console.log(typeof NaN); // Output: "number"
```

---

## Summary
- JavaScript has 7 primitive data types: **Number**, **String**, **Boolean**, **Undefined**, **Null**, **Symbol**, and **BigInt**.
- All other types, such as **Objects**, **Arrays**, and **Functions**, are considered objects.
