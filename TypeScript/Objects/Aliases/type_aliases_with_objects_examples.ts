
// Basic Object Type Alias
type User = {
    id: number;
    name: string;
    email: string;
};

const user: User = { id: 1, name: "Alice", email: "alice@example.com" }; // ✅ Valid

// Optional Properties
type Book = {
    title: string;
    author?: string; // Optional property
};

const book1: Book = { title: "TypeScript Handbook" }; // ✅ Valid
const book2: Book = { title: "TypeScript Handbook", author: "John Doe" }; // ✅ Valid

// Read-Only Properties
type Config = {
    readonly apiUrl: string;
};

const config: Config = { apiUrl: "https://api.example.com" };
// config.apiUrl = "https://new-api.com"; // ❌ Error

// Intersection Types
type Timestamps = {
    createdAt: Date;
    updatedAt: Date;
};

type AdvancedUser = {
    id: number;
    name: string;
} & Timestamps;

const advancedUser: AdvancedUser = {
    id: 1,
    name: "Alice",
    createdAt: new Date(),
    updatedAt: new Date(),
};

// Union Types
type Status = "active" | "inactive" | "suspended";

type UserWithStatus = {
    id: number;
    name: string;
    status: Status;
};

const activeUser: UserWithStatus = { id: 1, name: "Alice", status: "active" }; // ✅ Valid
// const invalidUser: UserWithStatus = { id: 1, name: "Alice", status: "deleted" }; // ❌ Error
