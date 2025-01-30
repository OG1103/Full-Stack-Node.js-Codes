# Functions in TypeScript

Functions in TypeScript are one of the fundamental building blocks of any application. They allow you to encapsulate logic, reuse code, and improve the modularity of your applications. TypeScript enhances JavaScript functions with type safety, providing better error checking during development.

---

## **1. Function Declaration**

### Basic Syntax

You can declare a function using the `function` keyword:

```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

### Explanation:

- **`a: number` and `b: number`**: These are parameter types, indicating that `a` and `b` must be numbers.
- **`: number` after the parentheses**: This specifies the return type of the function.

---

## **2. Function Expression**

Functions can also be assigned to variables:

```typescript
const multiply = function (a: number, b: number): number {
  return a * b;
};
```

---

## **3. Arrow Functions**
 
Arrow functions provide a concise syntax:

```typescript
const divide = (a: number, b: number): number => a / b;
```

---

## **4. Optional Parameters**

You can define parameters as optional using the `?` symbol:

```typescript
function greet(name: string, age?: number): string {
  return age ? `Hello ${name}, you are ${age} years old.` : `Hello ${name}`;
}
```

- If `age` is not provided, it defaults to `undefined`.

---

## **5. Default Parameters**

You can specify default values for parameters:

```typescript
function greetWithDefault(name: string, age: number = 30): string {
  return `Hello ${name}, you are ${age} years old.`;
}
```

---

## **6. Rest Parameters**

Rest parameters allow you to pass multiple arguments as an array:

```typescript
function sumAll(...numbers: number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0);
}
```

---

## **7. Return Types**

You can explicitly specify the return type of a function. If omitted, TypeScript infers it:

```typescript
function subtract(a: number, b: number): number {
  return a - b;
}

// Void Return Type
function logMessage(message: string): void {
  console.log(message);
}
```

---

## **8. Function Overloading**

TypeScript supports function overloading, allowing you to define multiple function signatures:

```typescript
function getValue(value: string): string;
function getValue(value: number): number;
function getValue(value: any): any {
  return value;
}
```

---

## **9. Anonymous Functions**

Functions without a name are called anonymous functions:

```typescript
setTimeout(() => {
  console.log("This is an anonymous function.");
}, 1000);
```

---

## **10. Functions as Types**

You can define a function type:

```typescript
type MathOperation = (a: number, b: number) => number;

const multiply: MathOperation = (a, b) => a * b;
```

---

## **11. Async Functions**

Async functions return a `Promise` where we identify the type being returned by the promise:

```typescript
async function fetchData(url: string): Promise<string> {
  const response = await fetch(url);
  return response.text();
}
```

---

## **12. Summary**

TypeScript provides robust features for functions, including parameter types, return types, optional parameters, rest parameters, default parameters, and more. Functions in TypeScript allow you to write safer, cleaner, and more maintainable code.
