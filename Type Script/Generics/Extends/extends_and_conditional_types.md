# Understanding `extends` in Generics and Conditional Types in TypeScript

## 1. `extends` in Generics

In TypeScript, `extends` is used in generics to **constrain** a generic type, meaning that it enforces that the generic type must extend (or be a subtype of) a certain type.

### Example: Basic Constrained Generics
```ts
function getLength<T extends { length: number }>(item: T): number {
    return item.length;
}

console.log(getLength("Hello")); // ✅ Works: string has length
console.log(getLength([1, 2, 3])); // ✅ Works: array has length
// console.log(getLength(42)); // ❌ Error: number doesn't have 'length' property
```
### Explanation:
- The function `getLength` only accepts arguments that **have a `length` property**.
- Strings and arrays have `length`, so they are valid.
- A number **does not** have a `length` property, so it's rejected.

### Multiple Constraints (`extends` with `&`)
You can enforce multiple constraints using `&` (intersection types).

```ts
type NamedEntity = { name: string };
type Identifiable = { id: number };

type Person<T extends NamedEntity & Identifiable> = {
    details: T;
};

const user: Person<{ name: string; id: number; age: number }> = {
    details: { name: "John", id: 123, age: 30 },
};
```
### Explanation:
- `T extends NamedEntity & Identifiable` ensures that `T` **must have** `name` and `id` properties.
- `age` is allowed but **not required**.

---

## 2. Conditional Types with `extends`

Conditional types allow **checking if a type satisfies a condition** using `extends`.

```ts
type CheckType<T> = T extends string ? "String Type" : "Other Type";

type Test1 = CheckType<string>; // "String Type"
type Test2 = CheckType<number>; // "Other Type"
```

### Explanation:
- If `T extends string`, return `"String Type"`.
- Otherwise, return `"Other Type"`.

### Conditional Types with Properties

We can use conditional types to check if an object type **has a specific property**.

```ts
type HasName<T> = T extends { name: string } ? "Has name" : "No name";

type Test3 = HasName<{ name: "Alice"; age: 25 }>; // "Has name"
type Test4 = HasName<{ age: 30 }>; // "No name"
```

### Extracting a Specific Property Type

We can use conditional types to extract the type of a property:

```ts
type PropertyType<T, K extends keyof T> = T[K];

type User = { id: number; username: string };

type IDType = PropertyType<User, "id">; // number
type UsernameType = PropertyType<User, "username">; // string
```

### Using `infer` with Conditional Types

`infer` can be used to extract types dynamically.

```ts
type ExtractReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Func = () => number;

type Result = ExtractReturnType<Func>; // number
```

### Explanation:
- `infer R` captures the **return type** of the function.
- If `T` is a function, it extracts its return type; otherwise, it returns `never`.

---

## 3. Combining `extends` and Conditional Types

We can combine `extends` with conditional types for more complex scenarios.

```ts
type IsArray<T> = T extends any[] ? "Array" : "Not an Array";

type Test5 = IsArray<number[]>; // "Array"
type Test6 = IsArray<string>; // "Not an Array"
```

### Checking for Optional Properties

We can use conditional types to detect if a property is optional.

```ts
type IsOptional<T, K extends keyof T> = {} extends Pick<T, K> ? "Optional" : "Required";

type User2 = { id: number; name?: string };

type Test7 = IsOptional<User2, "name">; // "Optional"
type Test8 = IsOptional<User2, "id">; // "Required"
```

---

## Conclusion

- **`extends` in generics** is used to **constrain types**.
- **Conditional types** use `extends` to **choose a type based on a condition**.
- **Combining `extends` with `infer`** allows **extracting types dynamically**.
- These techniques are powerful for **type safety and code flexibility**.

