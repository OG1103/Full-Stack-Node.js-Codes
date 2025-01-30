
# Arrays in TypeScript (Extended Guide)

This document provides a comprehensive guide to working with arrays in TypeScript, covering all array types, advanced features like tuples, 2D arrays, and custom types.

---

## **Array Types in TypeScript**
In TypeScript, arrays can store multiple values of a specific type. You can define arrays for various data types.

### **1. Number Arrays**
```typescript
let numbers: number[] = [1, 2, 3, 4, 5];
```

### **2. String Arrays**
```typescript
let names: string[] = ["Alice", "Bob", "Charlie"];
```

### **3. Boolean Arrays**
```typescript
let flags: boolean[] = [true, false, true];
```

### **4. Mixed Arrays**
You can allow arrays to hold multiple types using union types.
```typescript
let mixed: (number | string)[] = [1, "two", 3];
```

### **5. Custom Type Arrays**
Define arrays with custom types using interfaces or type aliases.
```typescript
type Product = {
    id: number;
    name: string;
    price: number;
};

let products: Product[] = [
    { id: 1, name: "Laptop", price: 999 },
    { id: 2, name: "Phone", price: 499 },
];
```

---

## **Tuples in TypeScript**

A **tuple** is a fixed-length array where each element can have a different type. Tuples are ideal for representing structured data.

### **Declaring a Tuple**
```typescript
let person: [number, string, boolean] = [1, "Alice", true];
```

### **Accessing Tuple Elements**
You can access tuple elements using their indices.
```typescript
console.log(person[0]); // Output: 1
console.log(person[1]); // Output: Alice
```

### **Adding Optional Elements to Tuples**
Use the `?` operator for optional elements in tuples.
```typescript
let employee: [number, string, string?] = [1, "John"];
employee = [2, "Jane", "Manager"];
```

### **Using Tuples for Key-Value Pairs**
Tuples are useful for representing pairs of values.
```typescript
let keyValue: [string, number] = ["Age", 25];
```

---

## **2D Arrays in TypeScript**

A **2D array** (or multidimensional array) is an array of arrays. It is often used to represent grids or tables.

### **Example: Declaring a 2D Array**
```typescript
let matrix: number[][] = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
];
```

### **Accessing Elements in a 2D Array**
```typescript
console.log(matrix[0][1]); // Output: 2
console.log(matrix[2][0]); // Output: 7
```

---

## **Readonly Arrays**

Readonly arrays are immutable, meaning their contents cannot be modified after initialization.

### **Example**
```typescript
const readonlyArray: readonly string[] = ["read", "only"];
// readonlyArray.push("error"); // Compilation Error
```

---

## **Generics with Arrays**
Generics allow arrays to handle flexible types while maintaining type safety.

### **Example**
```typescript
function reverseArray<T>(arr: T[]): T[] {
    return arr.reverse();
}

let reversed = reverseArray<number>([1, 2, 3]);
```

---

## **Destructuring Arrays**
Destructuring extracts values from an array into variables.

### **Example**
```typescript
const numbers = [10, 20, 30];
const [first, second, ...rest] = numbers;
console.log(first, second, rest); // Output: 10, 20, [30]
```

---

## **Combining Arrays with Spread Operator**
The spread operator (`...`) allows combining or copying arrays.

### **Example**
```typescript
let array1 = [1, 2];
let array2 = [3, 4];
let combined = [...array1, ...array2];
console.log(combined); // Output: [1, 2, 3, 4]
```

---

## **Summary**
TypeScript arrays provide a rich feature set, including tuples, 2D arrays, custom types, readonly arrays, and more. By leveraging these features, you can write robust and type-safe code for complex scenarios.
