# Understanding the `keyof` Operator in TypeScript with Generics

## 1. Introduction to `keyof`

The `keyof` operator in TypeScript is used to obtain the **keys of an object type** as a **union type**.

```ts
type User = { id: number; name: string; age: number };

type UserKeys = keyof User; // "id" | "name" | "age"
```

### Explanation:
- `keyof User` extracts the keys `"id" | "name" | "age"`.
- This can be used to **restrict values** to only valid property names.

---

## 2. Using `keyof` with Generics

### 2.1. Constraining Generic Types with `keyof`

We can use `keyof` to constrain generic types:

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user = { id: 1, name: "Alice", age: 25 };

console.log(getProperty(user, "name")); // "Alice"
console.log(getProperty(user, "id"));   // 1
// console.log(getProperty(user, "email")); // ❌ Error: Property 'email' does not exist
```

### Explanation:
- `T` is the object type.
- `K extends keyof T` ensures that `K` is a **valid key** of `T`.
- The function safely retrieves the property value.

---

### 2.2. Creating a Dynamic Type with `keyof`

We can create types that **only allow certain properties**:

```ts
type PickProperty<T, K extends keyof T> = { [P in K]: T[P] };

type User = { id: number; name: string; age: number };

type UserNameOnly = PickProperty<User, "name">;
// Equivalent to: { name: string }
```

### Explanation:
- `PickProperty<T, K>` creates a new type **only with the selected keys**.
- Here, `UserNameOnly` only contains `{ name: string }`.

---

## 3. Using `keyof` with Mapped Types

`keyof` is commonly used with **mapped types** to dynamically manipulate object structures.

### Example: Making All Properties Readonly

```ts
type ReadonlyProps<T> = { readonly [K in keyof T]: T[K] };

type User = { id: number; name: string };

type ReadonlyUser = ReadonlyProps<User>;
// Equivalent to: { readonly id: number; readonly name: string }
```

### Explanation:
- `{ readonly [K in keyof T]: T[K] }` makes **all properties** readonly.
- `ReadonlyUser` now ensures properties **cannot be changed**.

---

## 4. Filtering Keys Using Conditional Types

We can use `keyof` with conditional types to **filter keys**.

### Example: Extracting Only String Keys

```ts
type StringKeys<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T];

type User = { id: number; name: string; email: string };

type OnlyStringKeys = StringKeys<User>; // "name" | "email"
```

### Explanation:
- `{ [K in keyof T]: T[K] extends string ? K : never }` creates an object where **non-string keys become `never`**.
- `[keyof T]` extracts only the valid string keys.

---

## 5. Using `keyof` with Record Types

You can use `keyof` to work with **record types**.

```ts
type RecordExample = Record<string, number>;

type Keys = keyof RecordExample; // string | number
```

### Explanation:
- `Record<string, number>` defines an object **with string keys** and **number values**.
- `keyof RecordExample` results in `string | number`.

---

## 6. Combining `keyof` with `typeof`

We can combine `keyof` with `typeof` to extract keys from an actual object.

```ts
const settings = {
    theme: "dark",
    language: "en",
    notifications: true,
};

type SettingKeys = keyof typeof settings; // "theme" | "language" | "notifications"
```

### Explanation:
- `typeof settings` gets the type of `settings`.
- `keyof typeof settings` extracts the **keys as a union type**.

---

## 7. Conclusion

- `keyof` extracts keys from an object type.
- Used with generics, it helps **restrict and manipulate types**.
- Combined with mapped types, it enables **advanced type transformations**.

