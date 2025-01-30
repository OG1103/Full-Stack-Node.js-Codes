
# Literal Types in TypeScript

Literal types in TypeScript allow you to define exact values that a variable, parameter, or return type can hold. This feature makes your code stricter, safer, and easier to maintain.

---

## **What are Literal Types?**

Literal types specify that a variable must have a specific value or a set of specific values. These can be applied to `string`, `number`, or `boolean` values.

### **Syntax**
```typescript
let variable: "specific_value";
let anotherVariable: "value1" | "value2" | "value3";
```

### **Examples**
```typescript
let status: "success" | "error";
status = "success"; // ✅ Valid
status = "pending"; // ❌ Error: Type '"pending"' is not assignable to type '"success" | "error"'
```

---

## **Why Use Literal Types?**

1. **Stricter Type Checking**: Restrict variables to specific values, reducing runtime errors.
2. **Improved Code Clarity**: Document intent with precise types.
3. **Discriminated Unions**: Build powerful, type-safe structures for conditional logic.
4. **Safer APIs**: Enforce valid arguments in functions and APIs.

---

## **Literal Types for Primitive Values**

### **1. Boolean Literal Types**
```typescript
let isEnabled: true;
isEnabled = true; // ✅ Valid
isEnabled = false; // ❌ Error: Type 'false' is not assignable to type 'true'
```

### **2. String Literal Types**
```typescript
type Direction = "left" | "right" | "up" | "down";
let move: Direction;
move = "left";  // ✅ Valid
move = "down";  // ✅ Valid
move = "forward"; // ❌ Error: Type '"forward"' is not assignable to type 'Direction'
```

### **3. Number Literal Types**
```typescript
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
let roll: DiceRoll;
roll = 3; // ✅ Valid
roll = 7; // ❌ Error: Type '7' is not assignable to type 'DiceRoll'
```

---

## **Literal Types in Functions**

### Example: Specifying Function Parameters
```typescript
function logStatus(status: "success" | "error"): void {
    console.log(`Status: ${status}`);
}

logStatus("success"); // ✅ Outputs: Status: success
logStatus("error");   // ✅ Outputs: Status: error
logStatus("pending"); // ❌ Error: Argument of type '"pending"' is not assignable to parameter of type '"success" | "error"'
```

**Explanation**: The function `logStatus` only accepts `"success"` or `"error"`. If you try to pass a value outside these, TypeScript will throw an error.

---

## **Literal Types with Conditional Types**

Conditional types can work alongside literal types for more powerful type transformations.

### Example: Conditional Types with Literal Types
```typescript
type IsString<T> = T extends string ? "String Type" : "Non-String Type";

type Test1 = IsString<"hello">;  // "String Type"
type Test2 = IsString<42>;       // "Non-String Type"
```

**Explanation**:
- If `T` extends `string`, the type evaluates to `"String Type"`.
- Otherwise, it evaluates to `"Non-String Type"`.

---

## **Discriminated Unions with Literal Types**

Discriminated unions are a common use case for literal types. They allow for precise control over data structures with clear type narrowing.

### Example: API Responses
```typescript
type ApiResponse =
    | { status: "success"; data: string }
    | { status: "error"; error: string };

function handleResponse(response: ApiResponse) {
    if (response.status === "success") {
        console.log("Data:", response.data); // TypeScript knows `data` exists here.
    } else {
        console.error("Error:", response.error); // TypeScript knows `error` exists here.
    }
}
```

**Explanation**: The `status` field acts as a discriminator. TypeScript narrows down the type based on its value.

---

## **Best Practices for Literal Types**

1. **Combine with Unions**: Use unions to define a set of allowed values.
2. **Document Intent**: Use literal types for clearer, self-documenting code.
3. **Discriminated Unions**: Combine with objects to handle complex logic safely.
4. **Use with Conditional Types**: Add type logic to make code more dynamic and reusable.

---

Literal types are a powerful way to enforce stricter constraints on your variables and functions, ensuring safer and more predictable code. They integrate seamlessly with TypeScript's advanced features like conditional types and discriminated unions.
