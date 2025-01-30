
// 1. Generic Function
function identity<T>(arg: T): T {
    return arg;
}
console.log(identity(42)); // Output: 42
console.log(identity("Hello")); // Output: "Hello"

// 2. Multiple Generic Types
function pair<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}
console.log(pair(10, "TypeScript")); // Output: [10, "TypeScript"]

// 3. Generics with Arrays
function getFirstElement<T>(arr: T[]): T {
    return arr[0];
}
console.log(getFirstElement([10, 20, 30])); // Output: 10

// 4. Generic Interface
interface Box<T> {
    value: T;
}
const numberBox: Box<number> = { value: 100 };
const stringBox: Box<string> = { value: "Hello" };

// 5. Generic Class
class Container<T> {
    private item: T;
    
    constructor(item: T) {
        this.item = item;
    }

    getItem(): T {
        return this.item;
    }
}
const numberContainer = new Container<number>(42);
console.log(numberContainer.getItem()); // Output: 42

// 6. Generic Constraints
function getLength<T extends { length: number }>(item: T): number {
    return item.length;
}
console.log(getLength("TypeScript")); // Output: 10

// 7. Default Generic Type
function defaultGeneric<T = string>(value: T): T {
    return value;
}
console.log(defaultGeneric()); // Output: ""
console.log(defaultGeneric<number>(100)); // Output: 100

// 8. Utility Types with Generics
interface User {
    name: string;
    age: number;
}
const partialUser: Partial<User> = { name: "Alice" }; // Partial allows missing properties

const readOnlyUser: Readonly<User> = { name: "Bob", age: 30 };
// readOnlyUser.age = 31; // ❌ Error: Readonly prevents modification
