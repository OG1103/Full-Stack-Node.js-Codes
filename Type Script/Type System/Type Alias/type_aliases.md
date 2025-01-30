
# Type Aliases in TypeScript

Type aliases allow you to create a custom name for a type. This is especially useful for simplifying complex types or giving semantic meaning to a type.

## **What is a Type Alias?**
A type alias is a name for a type. You define it using the `type` keyword.

### **Syntax**
```typescript
type AliasName = ExistingType;
```

### **When to Use?**
- Simplify complex types like objects or function signatures.
- Reuse types across your codebase.

### **Example: Alias for a Primitive Type**
```typescript
type UserID = string;
let id: UserID = "12345"; // Valid
```

### **Example: Alias for Object Types**
```typescript
type Point = {
    x: number;
    y: number;
};

const point: Point = { x: 10, y: 20 };
```

### **Scenarios**
- Use aliases for API responses to make types clearer.
- Use for readability when working with nested or complex types.

---
