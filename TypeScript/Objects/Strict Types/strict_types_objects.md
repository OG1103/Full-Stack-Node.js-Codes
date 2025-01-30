
# Strict Types for Objects in TypeScript

In TypeScript, **strict type-checking for objects** ensures that the structure and types of an object are well-defined and adhere to the specified type or interface. This is part of TypeScript's goal to create safer, more predictable code.

---

## **What is Strict Typing for Objects?**

Strict typing for objects ensures that:
1. The object must include all required properties defined in the type or interface.
2. The types of the object's properties must match exactly as defined.
3. Extra properties that are not defined in the type or interface are not allowed (with some exceptions).

### **Example**
```typescript
interface User {
    id: number;
    name: string;
}

const user: User = { id: 1, name: "Alice" }; // ✅ Valid
const invalidUser: User = { id: 1 }; // ❌ Error: Property 'name' is missing
const extraUser: User = { id: 1, name: "Alice", age: 25 }; // ❌ Error: Object literal may only specify known properties
```

---

## **Key Features of Strict Typing for Objects**

### **1. Exact Structure**
The object's structure must match the type exactly.
```typescript
type Point = { x: number; y: number };
const p: Point = { x: 0, y: 0 }; // ✅ Valid
const invalidPoint: Point = { x: 0 }; // ❌ Error: Property 'y' is missing
```

### **2. Read-Only Properties**
You can mark properties as `readonly` to prevent modification.
```typescript
interface Config {
    readonly apiUrl: string;
}

const config: Config = { apiUrl: "https://api.example.com" };
// config.apiUrl = "https://another-api.com"; // ❌ Error: Cannot assign to 'apiUrl' because it is a read-only property
```

### **3. Optional Properties**
Use `?` to define optional properties that may or may not exist on an object.
```typescript
interface Book {
    title: string;
    author?: string; // Optional property
}

const book1: Book = { title: "TypeScript Handbook" }; // ✅ Valid
const book2: Book = { title: "TypeScript Handbook", author: "John Doe" }; // ✅ Valid
```

### **4. Index Signatures**
Index signatures allow objects to have properties with dynamic keys of a specific type.
```typescript
interface Dictionary {
    [key: string]: string; // All keys must be strings, and all values must be strings
}

const translations: Dictionary = {
    hello: "hola",
    goodbye: "adios",
};
```

---

## **Handling Excess Properties**

By default, TypeScript does not allow excess properties in object literals.

### **Example**
```typescript
interface Person {
    name: string;
    age: number;
}

const person: Person = { name: "John", age: 30, address: "123 Street" }; // ❌ Error: Object literal may only specify known properties
```

### **Workaround: Assigning Object Literals**
```typescript
const extraProperties = { name: "John", age: 30, address: "123 Street" };
const person: Person = extraProperties; // ✅ Valid because it's not a direct object literal
```

---

## **Strict Type with Functions and Objects**

You can define function parameters to accept only strictly typed objects.

### Example
```typescript
function greet(user: { name: string }): string {
    return `Hello, ${user.name}!`;
}

greet({ name: "Alice" }); // ✅ Valid
greet({ firstName: "Alice" }); // ❌ Error: Object literal may only specify known properties
```

---

## **Best Practices for Strict Typing with Objects**

1. **Use Interfaces or Types**: Define clear structures for objects to ensure consistency.
2. **Use `readonly` for Constants**: Prevent accidental modifications.
3. **Leverage Optional Properties**: Use `?` to mark optional fields for flexible object structures.
4. **Handle Excess Properties**: Ensure that all properties passed to a function or assignment are valid.

Strict typing for objects in TypeScript helps catch potential errors during development, making your applications more robust and maintainable.
