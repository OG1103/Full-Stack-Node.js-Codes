
# Function Overloading in TypeScript

Function overloading in TypeScript allows you to define multiple function signatures for a single function. This feature enables you to handle different types or numbers of arguments while maintaining type safety and flexibility.

---

## **What is Function Overloading?**

Function overloading means defining multiple method signatures for a function but implementing only one function body. TypeScript uses these signatures to determine how the function should be called and what arguments it expects.

TypeScript enforces that function calls must match one of the overloaded signatures, even if the implementation signature uses any.

---

## **1. Basic Syntax of Function Overloading**

### Example
```typescript
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any): any {
    return a + b;
}
```

### Explanation:
- The first two lines are **overload signatures**, which define how the function can be called.
- The last line is the **implementation signature**, which contains the actual logic.
- If you pass a parameter that is not a number or string. TypeScript will throw a compile-time error when calling the function with an unsupported type.
- When you declare overloaded function signatures, TypeScript uses them to strictly type-check function calls. It does not consider the implementation signature (any) when validating arguments.

---

## **2. Use Cases for Function Overloading**

### a. Handling Multiple Data Types
You can overload functions to handle multiple data types.
```typescript
function format(input: number): string;
function format(input: string): string;
function format(input: any): string {
    return input.toString();
}

console.log(format(123));       // Output: "123"
console.log(format("Hello"));   // Output: "Hello"
```

### b. Varying Numbers of Parameters
You can overload functions to handle a variable number of arguments.
```typescript
function greet(name: string): string;
function greet(firstName: string, lastName: string): string;
function greet(firstName: any, lastName?: any): string {
    return lastName ? `Hello, ${firstName} ${lastName}` : `Hello, ${firstName}`;
}

console.log(greet("Alice"));             // Output: "Hello, Alice"
console.log(greet("John", "Doe"));       // Output: "Hello, John Doe"
```

---

## **3. Rules for Function Overloading**

1. **Implementation Signature Must Be Compatible**:
   - The implementation signature must handle all overload cases.
   
2. **Order of Overload Signatures Matters**:
   - More specific signatures should come before more general ones.

### Example (Incorrect Overload Order)
```typescript
function print(input: any): string;
function print(input: number): string; // Error: This overload is never called
function print(input: any): string {
    return input.toString();
}
```

---

## **4. Function Overloading with Classes**

Overloading can also be applied to methods in classes.
```typescript
class Calculator {
    add(a: number, b: number): number;
    add(a: string, b: string): string;
    add(a: any, b: any): any {
        return a + b;
    }
}

const calc = new Calculator();
console.log(calc.add(1, 2));           // Output: 3
console.log(calc.add("Hello, ", "World")); // Output: "Hello, World"
```

---

## **5. Function Overloading with Interfaces**

You can use interfaces to define overloaded function signatures.
```typescript
interface Formatter {
    (input: number): string;
    (input: string): string;
}

const format: Formatter = (input: any): string => {
    return input.toString();
};

console.log(format(123));        // Output: "123"
console.log(format("Test"));     // Output: "Test"
```

---

## **6. Function Overloading with Arrow Functions**

Function overloading cannot be directly applied to arrow functions, but you can use union types or custom interfaces instead.

### Example
```typescript
type Add = {
    (a: number, b: number): number;
    (a: string, b: string): string;
};

const add: Add = (a: any, b: any): any => a + b;

console.log(add(1, 2));           // Output: 3
console.log(add("Hello, ", "World")); // Output: "Hello, World"
```

---

## **7. Practical Use Cases**

### Example: Fetching Data
```typescript
function fetchData(id: number): string;
function fetchData(url: string): string;
function fetchData(input: any): string {
    return typeof input === "number"
        ? `Fetching data for ID: ${input}`
        : `Fetching data from URL: ${input}`;
}

console.log(fetchData(101));            // Output: "Fetching data for ID: 101"
console.log(fetchData("https://api"));  // Output: "Fetching data from URL: https://api"
```

---

## **Summary**

Function overloading in TypeScript provides a way to define multiple behaviors for a single function. It enhances flexibility and type safety, making your code easier to read and maintain. By understanding its rules and use cases, you can handle complex scenarios effectively.
