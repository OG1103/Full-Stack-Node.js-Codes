
# Discriminators in Union Types for Objects in TypeScript

In TypeScript, **discriminated unions** (also known as **tagged unions** or **algebraic data types**) are a powerful pattern for defining objects with multiple possible shapes. They use a shared property, called a **discriminator**, to determine which type a value belongs to.

---

## **What are Discriminated Unions?**

A discriminated union is a union type where:
1. Each type in the union includes a shared property (the discriminator).
2. The discriminator has a unique literal value for each type.

This pattern allows TypeScript to narrow the type of an object based on the value of the discriminator.

### **Syntax**
```typescript
type UnionName =
    | { discriminator: "value1"; otherProperty: Type1 }
    | { discriminator: "value2"; otherProperty: Type2 };
```

---

## **How Discriminated Unions Work**

When you check the value of the discriminator, TypeScript automatically narrows the type of the object, enabling precise type checks and ensuring type safety.

### **Example**
```typescript
type Shape =
    | { type: "circle"; radius: number }
    | { type: "rectangle"; width: number; height: number };

function calculateArea(shape: Shape): number {
    if (shape.type === "circle") {
        // TypeScript knows shape is { type: "circle"; radius: number }
        return Math.PI * shape.radius ** 2;
    } else {
        // TypeScript knows shape is { type: "rectangle"; width: number; height: number }
        return shape.width * shape.height;
    }
}
```

**Explanation**:
- The `type` property acts as the discriminator.
- TypeScript narrows the type of `shape` based on the value of `shape.type`.

---

## **Benefits of Discriminated Unions**

1. **Type Safety**:
   - Ensures that all cases in the union are handled.
   - Provides compile-time errors if a case is missing.

2. **Readability**:
   - Improves code clarity by explicitly defining the possible shapes of an object.

3. **Ease of Maintenance**:
   - Adding new types to the union is straightforward and won't break existing code.

---

## **Using Discriminated Unions in Functions**

### **1. Simple Example**
```typescript
type Animal =
    | { species: "dog"; bark: () => void }
    | { species: "cat"; meow: () => void };

function makeSound(animal: Animal): void {
    if (animal.species === "dog") {
        animal.bark(); // TypeScript knows it's a dog
    } else if (animal.species === "cat") {
        animal.meow(); // TypeScript knows it's a cat
    }
}
```

### **2. Using a `switch` Statement**
A `switch` statement is often used for cleaner handling of discriminated unions.

```typescript
type Vehicle =
    | { type: "car"; speed: number }
    | { type: "bicycle"; gear: number };

function describeVehicle(vehicle: Vehicle): string {
    switch (vehicle.type) {
        case "car":
            return `A car moving at ${vehicle.speed} km/h.`;
        case "bicycle":
            return `A bicycle in gear ${vehicle.gear}.`;
    }
}
```

---

## **Exhaustiveness Checking**

TypeScript ensures that all possible cases in a discriminated union are handled. If a case is missing, you’ll get a compile-time error.

### **Example**
```typescript
function handleShape(shape: Shape): void {
    switch (shape.type) {
        case "circle":
            console.log(`Circle with radius ${shape.radius}`);
            break;
        case "rectangle":
            console.log(`Rectangle with width ${shape.width} and height ${shape.height}`);
            break;
        default:
            const _exhaustiveCheck: never = shape; // ❌ Compile-time error if a new type is added and not handled
            throw new Error("Unhandled shape type");
    }
}
```

---

## **Practical Use Cases**

1. **Shape Calculations**:
   - Discriminated unions are perfect for defining geometric shapes with different properties.

2. **API Responses**:
   - Represent success and error responses with a shared discriminator.
   ```typescript
   type ApiResponse =
       | { status: "success"; data: string }
       | { status: "error"; message: string };

   function handleResponse(response: ApiResponse): void {
       if (response.status === "success") {
           console.log(`Data: ${response.data}`);
       } else {
           console.error(`Error: ${response.message}`);
       }
   }
   ```

3. **State Management**:
   - Model the different states of an application (e.g., loading, success, error).

---

## **Best Practices**

1. **Use Literal Values for Discriminators**:
   - Use string or number literals for discriminators to ensure uniqueness.

2. **Always Handle All Cases**:
   - Use `switch` statements with `default` and `never` to ensure no cases are missed.

3. **Avoid Overlapping Properties**:
   - Keep properties unique across types to avoid confusion and ambiguity.

---

Discriminated unions in TypeScript provide a structured way to define flexible yet type-safe object types. By leveraging this pattern, you can write robust and maintainable code while reducing runtime errors.
