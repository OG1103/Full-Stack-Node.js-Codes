
# Conditional Types in TypeScript

Conditional types in TypeScript allow you to express logic within the type system. They enable type checks and transformations based on conditions, similar to conditional statements in JavaScript but applied to types.

---

## **Syntax**

```typescript
T extends U ? X : Y
```

- **`T`**: The type to check.
- **`U`**: The type to compare against.
- **`X`**: The type to return if the condition is true.
- **`Y`**: The type to return if the condition is false.

---

## **When to Use Conditional Types**

1. **Type Transformations**: Change a type based on a condition.
2. **Utility Types**: Create reusable and dynamic types.
3. **Generics**: Add logic to generic types to handle multiple cases.

---

## **Basic Example**

```typescript
type IsString<T> = T extends string ? "Yes" : "No";

type Test1 = IsString<string>; // "Yes"
type Test2 = IsString<number>; // "No"
```

---

## **Advanced Example: Extract and Exclude**

Conditional types can be combined with utility types like `Extract` and `Exclude`.

### **Example: Extract**
Extracts types that are assignable to a given type.

```typescript
type MyExtract<T, U> = T extends U ? T : never;
type Result = MyExtract<"a" | "b" | "c", "a" | "c">; // "a" | "c"
```

### **Example: Exclude**
Excludes types that are assignable to a given type.

```typescript
type MyExclude<T, U> = T extends U ? never : T;
type Result = MyExclude<"a" | "b" | "c", "a" | "c">; // "b"
```

---

## **Key Features of Conditional Types**

1. **Distributed Conditional Types**:
   - When applied to union types, conditional types distribute over each member of the union.
   - Example:
     ```typescript
     type Example<T> = T extends string ? "String" : "Other";
     type Result = Example<string | number>; // "String" | "Other"
     ```

2. **Infer Keyword**:
   - Used to infer types in conditional expressions.
   - Example:
     ```typescript
     type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

     type Result = GetReturnType<() => string>; // string
     ```

---

## **Utility Types Built on Conditional Types**

TypeScript provides many built-in utility types that leverage conditional types, such as:

- **`Exclude<T, U>`**: Excludes types from `T` that are assignable to `U`.
- **`Extract<T, U>`**: Extracts types from `T` that are assignable to `U`.
- **`ReturnType<T>`**: Gets the return type of a function.
- **`Parameters<T>`**: Gets the parameter types of a function.

---

## **Common Use Cases**

1. **Function Return Types**
   ```typescript
   type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

   type Example = ReturnType<() => string>; // string
   ```

2. **Filtering Types**
   ```typescript
   type Filter<T, U> = T extends U ? T : never;

   type Numbers = Filter<number | string | boolean, number>; // number
   ```

3. **Mapping Unions**
   ```typescript
   type MapUnion<T> = T extends string ? `Mapped ${T}` : never;

   type Result = MapUnion<"a" | "b" | "c">; // "Mapped a" | "Mapped b" | "Mapped c"
   ```

---

Conditional types add powerful capabilities to TypeScript, enabling complex type logic while keeping your codebase type-safe and maintainable.
