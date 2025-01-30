# Union Types with Objects in TypeScript

Union types in TypeScript allow a value to be one of several types. When used with objects, union types enable you to define multiple possible shapes for an object, providing flexibility while maintaining type safety.

---

## **What are Union Types?**

A union type is defined using the `|` operator, meaning "or". A variable of a union type can hold any value that matches one of the types in the union.

### **Syntax**

```typescript
type A = Type1 | Type2;
```

### **Example**

```typescript
type StringOrNumber = string | number;

let value: StringOrNumber;
value = "Hello"; // ✅ Valid
value = 42; // ✅ Valid
value = true; // ❌ Error: Type 'boolean' is not assignable to type 'string | number'
```

---

## **Union Types with Objects**

Union types can describe objects with different shapes, ensuring that a variable can hold any of the specified object types.
In a union type in Objects, The Object with the union type should have all the properties of one Object and some or None of another object.

### **1. Basic Example**

```typescript
type Admin = {
  role: "admin";
  permissions: string[];
};

type User = {
  role: "user";
  name: string;
};

type AdminOrUser = Admin | User;

// Here an object can either have all properties of admin and some/none of user OR all properties of user and some/none of admin

const user1: AdminOrUser = { role: "user", name: "Alice" }; // ✅ Valid
const user2: AdminOrUser = { role: "admin", permissions: ["read", "write"] }; // ✅ Valid
const invalidUser: AdminOrUser = { role: "guest" }; // ❌ Error: Type '"guest"' is not assignable
```

---

## **Narrowing Union Types**

When working with union types, you can use **type narrowing** to identify which type you are dealing with.

### **Example: Narrowing with `if` Statements**

```typescript
type Admin = {
  role: "admin";
  permissions: string[];
};

type User = {
  role: "user";
  name: string;
};

type AdminOrUser = Admin | User;

function handleUser(user: AdminOrUser): void {
  if (user.role === "admin") {
    console.log(`Admin with permissions: ${user.permissions.join(", ")}`);
  } else {
    console.log(`User with name: ${user.name}`);
  }
}
```

**Explanation**:

- TypeScript narrows the type of `user` based on the `role` property.
- If `user.role === "admin"`, TypeScript knows the type is `Admin`.

---

## **Using Union Types in Functions**

Union types are particularly useful for defining flexible function parameters.

### **Example**

```typescript
type StringOrNumber = string | number;

function printValue(value: StringOrNumber): void {
  if (typeof value === "string") {
    console.log(`String value: ${value}`);
  } else {
    console.log(`Number value: ${value}`);
  }
}

printValue("Hello"); // ✅ Outputs: String value: Hello
printValue(42); // ✅ Outputs: Number value: 42
// printValue(true); // ❌ Error: Type 'boolean' is not assignable
```

---

## **Union Types with Discriminated Unions**

A **discriminated union** uses a common property (discriminator) to narrow down types in a union.

### **Example**

```typescript
type Shape = { type: "circle"; radius: number } | { type: "rectangle"; width: number; height: number };

function calculateArea(shape: Shape): number {
  if (shape.type === "circle") {
    return Math.PI * shape.radius ** 2;
  } else {
    return shape.width * shape.height;
  }
}

const circle: Shape = { type: "circle", radius: 10 };
const rectangle: Shape = { type: "rectangle", width: 5, height: 8 };

console.log(calculateArea(circle)); // ✅ Outputs: 314.1592653589793
console.log(calculateArea(rectangle)); // ✅ Outputs: 40
```

---

## **Best Practices for Union Types**

1. **Use Discriminators**: Include a common property to distinguish between types in a union.
2. **Narrow the Type**: Use `if` statements or `switch` cases to handle specific types.
3. **Handle All Cases**: Ensure all possible cases in the union are covered to avoid runtime errors.

---

Union types provide flexibility while maintaining type safety, making them ideal for scenarios where variables can have multiple possible shapes or values. By combining union types with type narrowing, you can create robust and type-safe code.
