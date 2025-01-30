
# Basics of Working with Objects in TypeScript

In TypeScript, objects are one of the fundamental building blocks. An object is a collection of properties, where each property has a name (key) and a value. TypeScript enhances objects by allowing you to define strict types for their structure.

---

## **What is an Object in TypeScript?**

An object in TypeScript is similar to one in JavaScript, but with added type-checking capabilities. You can define the structure of an object using:

- **Inline object types**
- **Interfaces**
- **Type aliases**

---

## **Defining Object Types**

### **1. Inline Object Types**
You can define an object type directly using curly braces `{}`.

```typescript
let user: { id: number; name: string };
user = { id: 1, name: "Alice" }; // ✅ Valid
// user = { id: 1 }; // ❌ Error: Property 'name' is missing
```

### **2. Using Interfaces**
An interface is a reusable way to define the structure of an object.

```typescript
interface User {
    id: number;
    name: string;
}

const user: User = { id: 1, name: "Alice" }; // ✅ Valid
```

### **3. Using Type Aliases**
Type aliases can also define object types.

```typescript
type User = {
    id: number;
    name: string;
};

const user: User = { id: 1, name: "Alice" }; // ✅ Valid
```

---

## **Optional Properties**

You can make properties optional by appending `?` to their name.

```typescript
interface Book {
    title: string;
    author?: string; // Optional property
}

const book1: Book = { title: "TypeScript Handbook" }; // ✅ Valid
const book2: Book = { title: "TypeScript Handbook", author: "John Doe" }; // ✅ Valid
```

---

## **Read-Only Properties**

Properties can be marked as `readonly` to prevent modification after initialization.
The readonly modifier in TypeScript ensures that the property cannot be modified after the object is created. However, you can initialize the value when creating the object.

```typescript
interface Config {
    readonly apiUrl: string;
}

const config: Config = { apiUrl: "https://api.example.com" };
// config.apiUrl = "https://new-api.com"; // ❌ Error: Cannot assign to 'apiUrl'
```

---

## **Index Signatures**

Index signatures allow objects to have dynamic keys with specific types.

```typescript
interface Dictionary {
    [key: string]: string; // All keys are strings, and values are strings
}

const translations: Dictionary = {
    hello: "hola",
    goodbye: "adios",
};
```

---

## **Combining Object Types**

### **Intersection Types**
You can combine multiple object types using the `&` operator.

```typescript
type Timestamps = { createdAt: Date; updatedAt: Date };
type User = { id: number; name: string } & Timestamps;

const user: User = {
    id: 1,
    name: "Alice",
    createdAt: new Date(),
    updatedAt: new Date(),
};
```

### **Extending Interfaces**
You can extend interfaces to inherit properties.

```typescript
interface BaseUser {
    id: number;
    name: string;
}

interface Admin extends BaseUser {
    isAdmin: boolean;
}

const admin: Admin = { id: 1, name: "Alice", isAdmin: true };
```

---

## **Strict Object Types**

TypeScript enforces strict object typing by default, meaning extra properties that are not part of the defined type will cause an error.

```typescript
interface User {
    id: number;
    name: string;
}

// const invalidUser: User = { id: 1, name: "Alice", age: 25 }; // ❌ Error
```

You can avoid this error by using type assertions or by assigning the object to a variable first.

```typescript
const extraProperties = { id: 1, name: "Alice", age: 25 };
const user: User = extraProperties; // ✅ Valid
```

---

## **Best Practices**

1. **Use Interfaces or Type Aliases**: For reusable object structures.
2. **Leverage Optional Properties**: Add flexibility for fields that may not always exist.
3. **Mark Constants as `readonly`**: Prevent accidental modifications to immutable properties.
4. **Use Index Signatures**: When working with dynamic keys.

---

TypeScript provides robust tools for working with objects, ensuring strict type safety while maintaining flexibility for various use cases.
