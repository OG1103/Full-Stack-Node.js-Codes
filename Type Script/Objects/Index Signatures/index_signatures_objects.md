
# Index Signatures in TypeScript

Index signatures in TypeScript allow you to define the shape of objects with dynamically named properties. They are particularly useful when the exact property names of an object are not known in advance.

---

## **What Are Index Signatures?**

An index signature specifies the type of keys and values in an object. This is helpful when working with objects that have a dynamic set of properties.

### **Syntax**
```typescript
type TypeName = {
    [key: KeyType]: ValueType;
};
```

- **`key`**: The type of the keys, usually `string` or `number`.
- **`value`**: The type of the values.

### **Example**
```typescript
type Dictionary = {
    [key: string]: string;
};

const translations: Dictionary = {
    hello: "hola",
    goodbye: "adios",
};
```

---

## **Basic Example**

```typescript
type Config = {
    [key: string]: string;
};

const config: Config = {
    apiUrl: "https://api.example.com",
    timeout: "5000ms",
};
```

**Explanation**:
- The `Config` type allows any `string` key with a `string` value.

---

## **Restricting Key Types**

You can restrict keys to specific types, such as `number`.

### **Example**
```typescript
type Scores = {
    [key: number]: string;
};

const scores: Scores = {
    1: "Alice",
    2: "Bob",
    3: "Charlie",
};
```

**Note**: JavaScript treats object keys as strings, even when declared as `number`. However, TypeScript will enforce type safety.

---

## **Combining Index Signatures with Specific Properties**

You can combine index signatures with explicitly defined properties.

### **Example**
```typescript
type Config = {
    appName: string;
    [key: string]: string;
};

const config: Config = {
    appName: "MyApp",
    apiUrl: "https://api.example.com",
    timeout: "5000ms",
};
```

**Explanation**:
- The `appName` property is explicitly defined.
- Additional properties can have any key of type `string` with a `string` value.

---

## **Read-Only Index Signatures**

You can use the `readonly` modifier to prevent modifications to indexed properties.

### **Example**
```typescript
type ReadOnlyConfig = {
    readonly [key: string]: string;
};

const config: ReadOnlyConfig = {
    apiUrl: "https://api.example.com",
};

// config.apiUrl = "https://new-api.com"; // ❌ Error: Cannot assign to 'apiUrl' because it is a read-only property
```

---

## **Optional Index Signatures**

You can use optional properties with index signatures to make some properties optional.

### **Example**
```typescript
type OptionalConfig = {
    [key: string]: string | undefined;
};

const config: OptionalConfig = {
    apiUrl: "https://api.example.com",
    timeout: undefined, // ✅ Valid
};
```

---

## **Using Index Signatures with Functions**

Index signatures can also be used for objects representing function dictionaries.

### **Example**
```typescript
type FunctionMap = {
    [key: string]: () => void;
};

const handlers: FunctionMap = {
    onClick: () => console.log("Clicked"),
    onHover: () => console.log("Hovered"),
};

handlers.onClick(); // ✅ Outputs: Clicked
handlers.onHover(); // ✅ Outputs: Hovered
```

---

## **Best Practices**

1. **Be Specific with Types**:
   - Use precise types for keys and values to ensure type safety.
2. **Combine with Explicit Properties**:
   - Use index signatures alongside explicitly defined properties for hybrid structures.
3. **Use Read-Only Indexes**:
   - Prevent accidental modifications with `readonly`.

---

Index signatures in TypeScript are a powerful way to define objects with dynamic properties. They provide flexibility while maintaining type safety, making them ideal for use cases like dictionaries, configurations, and dynamic property objects.
