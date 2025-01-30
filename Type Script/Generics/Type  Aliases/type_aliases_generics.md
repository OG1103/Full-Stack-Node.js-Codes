# Type Aliases with Generics in TypeScript

## Introduction
Type aliases in TypeScript allow us to define custom types, and when combined with generics, they become powerful tools for creating reusable and flexible types.

## Basic Syntax
A generic type alias uses the `<T>` syntax, allowing us to define a type that can work with different data types.

```ts
type Wrapper<T> = { value: T };
```

Here, `T` is a placeholder for any type.

## Common Use Cases

### 1. **Wrapping Data** (Simple Generic Wrapper)
We can use a generic type alias to wrap any data type:

```ts
type Wrapper<T> = { value: T };
let stringWrapper: Wrapper<string> = { value: "Hello" };
let numberWrapper: Wrapper<number> = { value: 42 };
```

### 2. **Multiple Generic Parameters**
You can have multiple generic parameters to handle more complex types.

```ts
type Pair<T, U> = { first: T; second: U };
let pair: Pair<string, number> = { first: "Age", second: 25 };
```

### 3. **Generic Function with Type Alias**
A function can use a generic type alias:

```ts
type Identity<T> = (arg: T) => T;
const identity: Identity<number> = (arg) => arg;
const identity1: Identity<string> = (value) => value;// would return a string
console.log(identity(100)); // Output: 100
```

### 4. **Extending and Constraining Generics**
We can constrain the generic type using `extends`:

```ts
type Lengthy<T extends { length: number }> = { value: T; length: number };
let strLength: Lengthy<string> = { value: "Hello", length: 5 };
```

### 5. **Generic Type with Default Values**
Type aliases can have default generic types:

```ts
type Optional<T = string> = { value: T };
let defaultString: Optional = { value: "Default" }; // Implicitly string
let numberValue: Optional<number> = { value: 100 };
```

### 6. **Nested Generics**
You can nest generics inside each other:

```ts
type Response<T> = { success: boolean; data: T };
type APIResponse<T> = Response<T[]>;
let response: APIResponse<number> = { success: true, data: [1, 2, 3] };
```

### 7. **Using Generics with Arrays**
Generic types work well with arrays:

```ts
type ArrayWrapper<T> = T[];
let numArray: ArrayWrapper<number> = [1, 2, 3];
```

### 8. **Union Types with Generics**
Generics can also work with union types:

```ts
type Result<T> = { success: true; data: T } | { success: false, error: string };
let successResponse: Result<number> = { success: true, data: 100 };
let errorResponse: Result<number> = { success: false, error: "Failed" };
```

## Conclusion
Type aliases with generics provide a powerful way to create reusable, flexible types. They are useful in scenarios such as API responses, wrapper types, function signatures, and constraints.
