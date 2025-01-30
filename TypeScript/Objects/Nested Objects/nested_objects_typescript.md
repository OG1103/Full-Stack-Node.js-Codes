
# Nested Objects in TypeScript

In TypeScript, nested objects refer to objects containing other objects as their properties. By defining nested structures explicitly, you can ensure type safety and provide clear documentation for your code.

---

## **What Are Nested Objects?**

Nested objects are objects that contain one or more objects as their properties. TypeScript allows you to define the shape of these nested objects using **interfaces** or **type aliases**.

### **Example**
```typescript
type Address = {
    street: string;
    city: string;
    zipCode: number;
};

type User = {
    id: number;
    name: string;
    address: Address;
};

const user: User = {
    id: 1,
    name: "Alice",
    address: {
        street: "123 Main St",
        city: "Springfield",
        zipCode: 12345,
    },
};
```

---

## **How to Define Nested Objects in TypeScript**

### **1. Using Type Aliases**
```typescript
type Address = {
    street: string;
    city: string;
};

type User = {
    id: number;
    name: string;
    address: Address;
};
```

### **2. Using Interfaces**
```typescript
interface Address {
    street: string;
    city: string;
}

interface User {
    id: number;
    name: string;
    address: Address;
}
```

Both approaches are valid. The choice depends on your preference and the specific requirements of your project.

---

## **Working with Optional Nested Properties**

Use the `?` symbol to make nested properties optional.

### **Example**
```typescript
type Address = {
    street: string;
    city?: string; // Optional property
};

type User = {
    id: number;
    name: string;
    address?: Address; // Optional property
};

const user1: User = { id: 1, name: "Alice" }; // ✅ Valid
const user2: User = {
    id: 2,
    name: "Bob",
    address: { street: "456 Elm St" },
}; // ✅ Valid
```

---

## **Read-Only Nested Properties**

You can make nested properties `readonly` to prevent modification.

### **Example**
```typescript
type Address = {
    readonly street: string;
    readonly city: string;
};

type User = {
    readonly id: number;
    name: string;
    address: Address;
};

const user: User = {
    id: 1,
    name: "Alice",
    address: { street: "123 Main St", city: "Springfield" },
};

// user.id = 2; // ❌ Error: Cannot assign to 'id' because it is a read-only property
// user.address.city = "New City"; // ❌ Error: Cannot assign to 'city' because it is a read-only property
```

---

## **Deeply Nested Objects**

When working with deeply nested objects, you can define multiple nested types.

### **Example**
```typescript
type Coordinates = {
    latitude: number;
    longitude: number;
};

type Address = {
    street: string;
    city: string;
    coordinates: Coordinates;
};

type User = {
    id: number;
    name: string;
    address: Address;
};

const user: User = {
    id: 1,
    name: "Alice",
    address: {
        street: "123 Main St",
        city: "Springfield",
        coordinates: { latitude: 40.7128, longitude: -74.006 },
    },
};
```

---

## **Accessing and Modifying Nested Properties**

Use dot notation or optional chaining (`?.`) to access properties safely.

### **Example**
```typescript
const user: User = {
    id: 1,
    name: "Alice",
    address: {
        street: "123 Main St",
        city: "Springfield",
        coordinates: { latitude: 40.7128, longitude: -74.006 },
    },
};

console.log(user.address.city); // Outputs: Springfield
console.log(user.address.coordinates?.latitude); // Outputs: 40.7128
```

### **Scenario: Safely Accessing Optional Properties**
```typescript
type User = {
    id: number;
    name: string;
    address?: {
        street: string;
        city?: string;
    };
};

const user: User = { id: 1, name: "Alice" };

console.log(user.address?.city); // Outputs: undefined (no error)
```

---

## **Practical Use Cases**

1. **User Management**:
   - Nested objects are ideal for modeling users with addresses, roles, and preferences.

2. **APIs**:
   - Representing nested JSON structures received from APIs.

3. **State Management**:
   - Defining application state with nested objects.

---

## **Best Practices**

1. **Use Optional Properties for Flexibility**:
   - Use `?` for properties that may not always exist.

2. **Use Read-Only Properties for Constants**:
   - Mark properties `readonly` when immutability is required.

3. **Handle Deeply Nested Objects Carefully**:
   - Use helper functions or libraries like `lodash` to avoid deeply nested property access issues.

---

Nested objects in TypeScript allow you to create detailed and type-safe models, ensuring better code clarity and fewer runtime errors.
