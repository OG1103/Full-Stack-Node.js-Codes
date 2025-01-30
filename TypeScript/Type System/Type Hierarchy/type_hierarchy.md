
# Understanding Type Hierarchy in TypeScript

TypeScript has a type hierarchy where all types can be broadly categorized into two main types: `any` and `unknown`. These types branch into further subsets.

## **Type Hierarchy Overview**
1. **`any`**: The supertype of all types; disables type checking.
2. **`unknown`**: Safer alternative to `any`—requires explicit type-checking before doing any operations on them.
3. **Primitive Types**: Includes `number`, `string`, `boolean`, `symbol`, `bigint`, `null`, and `undefined`.
4. **Object Types**: Includes arrays, functions, and objects.

## **Notes**
1. As we move down in types, we are getting stricter with types. 
2. A stricter type is a subtype of it's parent type. Ex: String extends any & any extends unknown
3. This means that a parent type can always be used instead of a subtype. Ex: any can be used instead of string and so on..
4. null, void, undefined are subtypes of any
5. undefined is a subtype of void 

### **Hierarchy Visualization**

![alt text](<Screenshot 2025-01-24 213342.png>)
---

## **Scenarios**
- Use `unknown` when handling dynamic input but enforce type safety.
- Avoid `any` unless absolutely necessary.
