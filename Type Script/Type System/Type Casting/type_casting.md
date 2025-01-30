
# Type Casting in TypeScript

Type casting allows you to tell the TypeScript compiler that you know the type of a value better than it does.

## **Why Use Type Casting?**
- When TypeScript cannot infer the type correctly.
- To avoid type errors when you are confident of the type.

## **Syntax**
- **Angle Bracket Syntax**:
  ```typescript
  let someValue: any = "Hello, world!";
  let strLength: number = (<string>someValue).length;
  ```
- **`as` Syntax**:
  ```typescript
  let someValue: any = "Hello, world!";
  let strLength: number = (someValue as string).length;
  ```

### **When to Use?**
- When dealing with `any` or `unknown` types.
- Accessing properties of objects from external sources (e.g., APIs).

### **Example: Casting `any` to a Specific Type**
```typescript
let someValue: any = "This is a string";
let length: number = (someValue as string).length;
console.log(length); // Outputs: 16
```

---
