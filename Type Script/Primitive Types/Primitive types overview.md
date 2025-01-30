# Primitive Types in TypeScript

TypeScript has several **primitive types** that represent the most basic forms of data. These types are the foundation of TypeScript and allow you to define variables with specific types.
Assigning types to certain variables is considered annotations

---

## **1. `number`**

The `number` type is used to represent both integers and floating-point numbers.

### Example:

```typescript
let age: number = 25;
let temperature: number = 36.5;
```

---

## **2. `string`**

The `string` type is used for text or strings of characters. You can use single quotes, double quotes, or backticks.

### Example:

```typescript
let name: string = "Alice";
let greeting: string = `Hello, ${name}!`;
```

---

## **3. `boolean`**

The `boolean` type represents a true/false value.

### Example:

```typescript
let isStudent: boolean = true;
let hasGraduated: boolean = false;
```

---

## **4. `null`**

The `null` type represents the absence of a value.

### Example:

```typescript
let emptyValue: null = null;
```

---

## **5. `undefined`**

The `undefined` type represents a variable that has been declared but not assigned a value.

### Example:

```typescript
let uninitializedValue: undefined = undefined;
```

---

## **6. `bigint`**

The `bigint` type is used to represent large integers that cannot be represented by the `number` type.

### Example:

```typescript
let bigNumber: bigint = 123456789012345678901234567890n;
```

---

## **7. `symbol`**

The `symbol` type is used to create unique values, often used as object property keys.

### Example:

```typescript
let uniqueId: symbol = Symbol("id");
```

---

## **8. `any`**

The `any` type can hold any value. It disables type checking, so use it sparingly.

### Example:

```typescript
let randomValue: any = 42;
randomValue = "A string";
randomValue = true;
```

---

## **9. `unknown`**

The `unknown` type is a safer alternative to `any`. You cannot perform operations on `unknown` values without type-checking them first.

### Example:

```typescript
let unknownValue: unknown = "Hello";

if (typeof unknownValue === "string") {
  console.log(unknownValue.toUpperCase());
}
```

---

## **10. `void`**

The `void` type represents the absence of a value, often used as a return type for functions that do not return anything.

### Example:

```typescript
function logMessage(message: string): void {
  console.log(message);
}
```

---

## **11. `never`**

The `never` type represents values that never occur, often used for functions that throw errors or have infinite loops.

### Example:

```typescript
function throwError(message: string): never {
  throw new Error(message);
}
```

---

## Summary of Primitive Types

| **Type**    | **Description**                                      |
| ----------- | ---------------------------------------------------- |
| `number`    | Represents numeric values (integers and floats).     |
| `string`    | Represents text or character data.                   |
| `boolean`   | Represents true/false values.                        |
| `null`      | Represents the absence of a value.                   |
| `undefined` | Represents a variable that hasn't been initialized.  |
| `bigint`    | Represents large integers.                           |
| `symbol`    | Represents unique values.                            |
| `any`       | Can hold any value (disables type checking).         |
| `unknown`   | Can hold any value but requires type-checking first. |
| `void`      | Represents no value (used for functions).            |
| `never`     | Represents values that never occur.                  |

---

TypeScript's primitive types help developers write more predictable and type-safe code by clearly defining what kinds of data variables can hold.
