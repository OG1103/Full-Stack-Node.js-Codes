
# Understanding Type Hierarchy in TypeScript

TypeScript has a type hierarchy where all types can be broadly categorized into two main types: `any` and `unknown`. These types branch into further subsets.

## **Type Hierarchy Overview**
1. **`any`**: The supertype of all types; disables type checking.
2. **`unknown`**: Safer alternative to `any`—requires explicit type-checking before doing any operations on them.
3. **Primitive Types**: Includes `number`, `string`, `boolean`, `symbol`, `bigint`, `null`, and `undefined`.
4. **Object Types**: Includes arrays, functions, and objects.

### **Hierarchy Visualization**
```plaintext
            any
             |
        -------------
       |             |
    unknown       primitive
                      |
             ----------------
            |        |       |
         number   string   boolean
```

---

## **Scenarios**
- Use `unknown` when handling dynamic input but enforce type safety.
- Avoid `any` unless absolutely necessary.
