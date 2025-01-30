# Generics in TypeScript

## **Overview**

Generics in TypeScript provide a way to create **reusable** and **type-safe** functions, classes, and interfaces. They allow defining **placeholder types** (`T`, `U`, etc.), which can be replaced with specific types when the function or class is used.

---

## **Why Use Generics?**

1. **Code Reusability** – No need to create separate functions for different types.
2. **Type Safety** – Prevents unexpected runtime errors.
3. **Better Readability** – More maintainable and expressive code.

---

## **1. Generic Functions (Arrow Functions Preferred)**

A generic function allows dynamically specifying a type.

### **Example: Arrow Function**

```typescript
const identity = <T>(arg: T): T => arg;

console.log(identity(42)); // Output: 42 (Type: number)
console.log(identity("Hello")); // Output: Hello (Type: string)

// Explicitly specifying the type
console.log(identity<number>(42)); // Output: 42 (Type: number)
console.log(identity<string>("Hello")); // Output: Hello (Type: string)
console.log(identity<boolean>(true)); // Output: true (Type: boolean)
```

- `<T>` is a **type parameter** acting as a placeholder.
- TypeScript **infers** the type based on usage.

---

## **2. Generic Functions with Multiple Type Parameters**

Generics can take multiple types.

### **Example**

```typescript
const pair = <T, U>(first: T, second: U): [T, U] => [first, second];

console.log(pair(10, "TypeScript")); // Output: [10, "TypeScript"]
```

- `<T, U>` allows two different types.
- Returns a tuple `[T, U]`.

---

## **3. Generics with Arrays**

Generic types enforce type safety in arrays.

### **Example**

```typescript
const getFirstElement = <T>(arr: T[]): T => arr[0];

console.log(getFirstElement([10, 20, 30])); // Output: 10
console.log(getFirstElement(["A", "B", "C"])); // Output: "A"
```

- `<T[]>` ensures the function returns an element of the same type.

---

## **4. Generics with Objects**

Generics are useful for working with objects while ensuring type safety.

### **Example**

```typescript
const merge = <T, U>(obj1: T, obj2: U): T & U => ({ ...obj1, ...obj2 });

const person = { name: "Alice" };
const details = { age: 25 };

const merged = merge(person, details);
console.log(merged); // Output: { name: "Alice", age: 25 }
```

- `<T, U>` allows merging two different object types.

---

## **5. Generic Interfaces**

Interfaces can be generic to ensure type safety.

### **Example**

```typescript
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 100 };
const stringBox: Box<string> = { value: "Hello" };
```

---

## **6. Generic Classes**

Classes can use generics to work with multiple data types.

### **Example**

```typescript
class Container<T> {
  private item: T;

  constructor(item: T) {
    this.item = item;
  }

  getItem(): T {
    return this.item;
  }
}

const numberContainer = new Container<number>(42);
console.log(numberContainer.getItem()); // Output: 42
```

- `Container<T>` ensures that `getItem` always returns the correct type.

---

## **7. Generic Constraints**

Sometimes, you want to **restrict** what types can be used.

### **Example**

```typescript
const getLength = <T extends { length: number }>(item: T): number => item.length;

console.log(getLength("TypeScript")); // Works: "length" exists
console.log(getLength([1, 2, 3])); // Works: Arrays have "length"
// console.log(getLength(42)); // ❌ Error: Number has no "length" property
```

- `<T extends { length: number }>` restricts `T` to types that have a `length` property.

---

## **8. Strictly Typing Generics**

You can **strictly type** generics instead of using `any`.

### **Example**

```typescript
const toUpperCase = <T extends string>(text: T): string => text.toUpperCase();

console.log(toUpperCase("hello")); // Output: "HELLO"
// console.log(toUpperCase(100)); // ❌ Error: Argument must be a string
```

- `<T extends string>` enforces that `T` must be a string.

---

## **9. Using Default Types in Generics**

You can specify a **default type** if none is provided.

### **Example**

```typescript
const defaultGeneric = <T = string>(value: T): T => value;

console.log(defaultGeneric()); // Defaults to string
console.log(defaultGeneric(100)); // Uses number
```

- If no type is provided, TypeScript assumes `string`.

---

## **10. Generic Utility Types**

TypeScript provides built-in generic utilities.

### **Example: `Partial<T>`**

```typescript
interface User {
  name: string;
  age: number;
}

const partialUser: Partial<User> = { name: "Alice" }; // `age` is optional
```

### **Example: `Readonly<T>`**

```typescript
const readOnlyUser: Readonly<User> = { name: "Bob", age: 30 };
// readOnlyUser.age = 31; // ❌ Error: Cannot assign to 'age'
```

---

## **Summary**

- **Generics** make functions, classes, and interfaces flexible and type-safe.
- They **preserve types**, improving maintainability.
- Use **constraints** to limit types (`extends`).
- Utilize **utility types** like `Partial<T>` and `Readonly<T>`.
- Prefer **arrow functions** for generic functions.

Generics are **essential** for writing scalable and reusable TypeScript code!
