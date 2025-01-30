
// Example 1: Basic Nested Object
type Address = {
    street: string;
    city: string;
    zipCode: number;
};

type User = {
    id: number;
    name: string;
    address: Address;
};

const user: User = {
    id: 1,
    name: "Alice",
    address: {
        street: "123 Main St",
        city: "Springfield",
        zipCode: 12345,
    },
};

// Example 2: Optional Nested Properties
type Book = {
    title: string;
    author?: string; // Optional property
    publisher?: {
        name: string;
        year?: number;
    };
};

const book: Book = {
    title: "TypeScript Handbook",
    publisher: { name: "Tech Books", year: 2023 },
};

const bookWithoutPublisher: Book = { title: "JavaScript Basics" }; // ✅ Valid

// Example 3: Read-Only Nested Properties
type Config = {
    readonly apiUrl: string;
    readonly headers: {
        readonly authorization: string;
    };
};

const config: Config = {
    apiUrl: "https://api.example.com",
    headers: { authorization: "Bearer token" },
};

// config.apiUrl = "https://new-api.com"; // ❌ Error
// config.headers.authorization = "New token"; // ❌ Error

// Example 4: Deeply Nested Object
type Coordinates = {
    latitude: number;
    longitude: number;
};

type ExtendedAddress = {
    street: string;
    city: string;
    coordinates: Coordinates;
};

type AdvancedUser = {
    id: number;
    name: string;
    address: ExtendedAddress;
};

const advancedUser: AdvancedUser = {
    id: 2,
    name: "Bob",
    address: {
        street: "456 Elm St",
        city: "Metropolis",
        coordinates: { latitude: 35.6895, longitude: 139.6917 },
    },
};

console.log(advancedUser.address.coordinates.latitude); // Outputs: 35.6895

// Example 5: Safely Accessing Optional Properties
type OptionalUser = {
    id: number;
    name: string;
    address?: {
        street: string;
        city?: string;
    };
};

const optionalUser: OptionalUser = { id: 3, name: "Charlie" };
console.log(optionalUser.address?.city); // Outputs: undefined
