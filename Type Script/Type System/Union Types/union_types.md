
# Union Types in TypeScript

Union types allow a variable to hold one of several types. This is useful for cases where a value can logically belong to multiple types.
Usually used along side type alias to define a custom type. 

## **Syntax**
```typescript
let variableName: Type1 | Type2 | Type3;
```

### **When to Use Union Types?**
- When a function argument or variable can accept multiple types.
- When dealing with data from external sources that might have varying formats.

### **Example: Union with Primitive Types**
```typescript
let id: string | number;
id = "123"; // Valid
id = 123;   // Valid
```

### **Example: Function with Union Types**
```typescript
function formatId(id: string | number): string {
    return `ID: ${id}`;
}
console.log(formatId(123));       // "ID: 123"
console.log(formatId("ABC123")); // "ID: ABC123"
```

### **Scenarios**
- Combine types for flexibility without compromising safety.
- Handle cases where multiple types are logically expected.
