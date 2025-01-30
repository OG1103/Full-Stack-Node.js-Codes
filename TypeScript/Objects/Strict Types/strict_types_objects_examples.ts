
// Example: Strict Typing for Objects

// Define an interface for a user
interface User {
    id: number;
    name: string;
}

// Valid object
const user: User = { id: 1, name: "Alice" };

// Missing a property
// const invalidUser: User = { id: 1 }; // ❌ Error: Property 'name' is missing

// Extra property
// const extraUser: User = { id: 1, name: "Alice", age: 25 }; // ❌ Error

// Read-Only Properties
interface Config {
    readonly apiUrl: string;
}

const config: Config = { apiUrl: "https://api.example.com" };
// config.apiUrl = "https://another-api.com"; // ❌ Error

// Optional Properties
interface Book {
    title: string;
    author?: string; // Optional property
}

const book1: Book = { title: "TypeScript Handbook" }; // ✅ Valid
const book2: Book = { title: "TypeScript Handbook", author: "John Doe" }; // ✅ Valid

// Index Signatures
interface Dictionary {
    [key: string]: string;
}

const translations: Dictionary = {
    hello: "hola",
    goodbye: "adios",
};

// Handling Excess Properties
interface Person {
    name: string;
    age: number;
}

// const person: Person = { name: "John", age: 30, address: "123 Street" }; // ❌ Error

// Workaround: Assigning object literals
const extraProperties = { name: "John", age: 30, address: "123 Street" };
const person: Person = extraProperties; // ✅ Valid

// Strict Type with Functions and Objects
function greet(user: { name: string }): string {
    return `Hello, ${user.name}!`;
}

console.log(greet({ name: "Alice" })); // ✅ Outputs: Hello, Alice!
// console.log(greet({ firstName: "Alice" })); // ❌ Error
