
// Inline Object Types
let user: { id: number; name: string };
user = { id: 1, name: "Alice" }; // ✅ Valid

// Using Interfaces
interface User {
    id: number;
    name: string;
}

const user1: User = { id: 1, name: "Alice" }; // ✅ Valid

// Using Type Aliases
type Book = {
    title: string;
    author?: string; // Optional property
};

const book1: Book = { title: "TypeScript Handbook" }; // ✅ Valid
const book2: Book = { title: "TypeScript Handbook", author: "John Doe" }; // ✅ Valid

// Read-Only Properties
interface Config {
    readonly apiUrl: string;
}

const config: Config = { apiUrl: "https://api.example.com" };
// config.apiUrl = "https://new-api.com"; // ❌ Error

// Index Signatures
interface Dictionary {
    [key: string]: string;
}

const translations: Dictionary = {
    hello: "hola",
    goodbye: "adios",
};

// Combining Object Types with Intersection
type Timestamps = { createdAt: Date; updatedAt: Date };
type AdvancedUser = { id: number; name: string } & Timestamps;

const advancedUser: AdvancedUser = {
    id: 1,
    name: "Alice",
    createdAt: new Date(),
    updatedAt: new Date(),
};

// Extending Interfaces
interface BaseUser {
    id: number;
    name: string;
}

interface Admin extends BaseUser {
    isAdmin: boolean;
}

const admin: Admin = { id: 1, name: "Alice", isAdmin: true }; // ✅ Valid
