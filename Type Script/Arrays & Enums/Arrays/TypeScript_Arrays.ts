
// Arrays in TypeScript: Extended Examples

// 1. Number Array
let numbers: number[] = [1, 2, 3, 4, 5];

// 2. String Array
let names: string[] = ["Alice", "Bob", "Charlie"];

// 3. Boolean Array
let flags: boolean[] = [true, false, true];

// 4. Mixed Array
let mixed: (number | string)[] = [1, "two", 3];

// 5. Custom Type Array
type Product = {
    id: number;
    name: string;
    price: number;
};

let products: Product[] = [
    { id: 1, name: "Laptop", price: 999 },
    { id: 2, name: "Phone", price: 499 },
];

// 6. Tuples
let person: [number, string, boolean] = [1, "Alice", true];

// Optional Tuple Elements
let employee: [number, string, string?] = [1, "John"];
employee = [2, "Jane", "Manager"];

// Key-Value Pair Tuple
let keyValue: [string, number] = ["Age", 25];

// 7. 2D Arrays
let matrix: number[][] = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
];

// Accessing Elements in a 2D Array
console.log(matrix[0][1]); // Output: 2
console.log(matrix[2][0]); // Output: 7

// 8. Readonly Arrays
const readonlyArray: readonly string[] = ["read", "only"];

// 9. Generic Function with Arrays
function reverseArray<T>(arr: T[]): T[] {
    return arr.reverse();
}

let reversedNumbers = reverseArray<number>([1, 2, 3]);

// 10. Destructuring Arrays
const [first, second, ...rest] = numbers;
console.log(first, second, rest); // Output: 1, 2, [3, 4, 5]

// 11. Combining Arrays with Spread Operator
const array1 = [10, 20];
const array2 = [30, 40];
const combinedArray = [...array1, ...array2];
console.log(combinedArray); // Output: [10, 20, 30, 40]

// 12. Advanced Mapping
const squaredNumbers = numbers.map(num => num * num);
console.log(squaredNumbers); // Output: [1, 4, 9, 16, 25]
