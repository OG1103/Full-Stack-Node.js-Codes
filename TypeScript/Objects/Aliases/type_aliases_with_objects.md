
# Type Aliases with Objects in TypeScript

In TypeScript, **type aliases** provide a way to give a type a custom, reusable name. They are particularly useful when working with complex object structures, allowing you to simplify and reuse those structures throughout your code.

---

## **What is a Type Alias?**

A type alias is a custom name for a type. It can be used to define a type for primitive values, objects, arrays, functions, and more.

### **Syntax**
```typescript
type AliasName = Type;
```

---

## **Type Aliases for Objects**

You can use type aliases to define the structure of objects. This is similar to interfaces but offers additional flexibility.

### **Example: Basic Object Type Alias**
```typescript
type User = {
    id: number;
    name: string;
    email: string;
};

const user: User = { id: 1, name: "Alice", email: "alice@example.com" }; // ✅ Valid
```

---

## **Optional Properties in Object Type Aliases**

You can make properties optional using the `?` symbol.

```typescript
type Book = {
    title: string;
    author?: string; // Optional property
};

const book1: Book = { title: "TypeScript Handbook" }; // ✅ Valid
const book2: Book = { title: "TypeScript Handbook", author: "John Doe" }; // ✅ Valid
```

---

## **Read-Only Properties in Type Aliases**

To prevent modifications to certain properties, you can mark them as `readonly`.
The readonly modifier in TypeScript ensures that the property cannot be modified after the object is created. However, you can initialize the value when creating the object.

```typescript
type Config = {
    readonly apiUrl: string;
};

const config: Config = { apiUrl: "https://api.example.com" };
// config.apiUrl = "https://new-api.com"; // ❌ Error: Cannot assign to 'apiUrl' because it is a read-only property
```

---

## **Combining Type Aliases**

You can combine multiple type aliases using **intersection (`&`)** or **union (`|`)**.

### **1. Intersection Types**
An intersection type combines multiple types into one.

```typescript
type Timestamps = {
    createdAt: Date;
    updatedAt: Date;
};

type User = {
    id: number;
    name: string;
} & Timestamps;

const user: User = {
    id: 1,
    name: "Alice",
    createdAt: new Date(),
    updatedAt: new Date(),
};
```

### **2. Union Types**
A union type allows a value to be one of several types.

```typescript
type Status = "active" | "inactive" | "suspended";

type User = {
    id: number;
    name: string;
    status: Status;
};

const user: User = { id: 1, name: "Alice", status: "active" }; // ✅ Valid
// const invalidUser: User = { id: 1, name: "Alice", status: "deleted" }; // ❌ Error
```

---

## **Type Aliases vs Interfaces**

| **Aspect**        | **Type Alias**                              | **Interface**                          |
|--------------------|---------------------------------------------|----------------------------------------|
| **Syntax**         | `type` keyword                             | `interface` keyword                   |
| **Extensibility**  | Cannot be extended after definition         | Can be extended with `extends`         |
| **Flexibility**    | Can define unions, intersections, etc.      | Primarily used for objects and classes |
| **Use Cases**      | Flexible type combinations                 | Describing object shapes               |

---

## **Best Practices**

1. **Use Type Aliases for Flexibility**: When you need to define unions or intersections, prefer type aliases.
2. **Combine with Objects**: Simplify complex object structures using type aliases.
3. **Avoid Overusing Aliases**: Use interfaces for objects where inheritance is needed.

---

Type aliases provide a powerful way to simplify and manage complex types in TypeScript, especially when working with objects. By using type aliases, you can make your code more readable and maintainable.
