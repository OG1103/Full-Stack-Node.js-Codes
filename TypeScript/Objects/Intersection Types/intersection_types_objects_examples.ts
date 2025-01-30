
// Combining Two Object Types
type User = {
    id: number;
    name: string;
};

type Role = {
    role: string;
};

type UserWithRole = User & Role;

const userWithRole: UserWithRole = {
    id: 1,
    name: "Alice",
    role: "Admin",
};

// Handling Common Properties
type A = {
    id: number;
    value: string;
};

type B = {
    id: number;
    description: string;
};

type AB = A & B;

const ab: AB = {
    id: 1,
    value: "Test",
    description: "Description",
};

// Nested Intersection Types
type Address = {
    street: string;
    city: string;
};

type UserWithAddress = {
    name: string;
} & {
    address: Address;
};

const userWithAddress: UserWithAddress = {
    name: "Bob",
    address: {
        street: "123 Main St",
        city: "Springfield",
    },
};

// Using Intersection Types with Functions
type Admin = {
    admin: true;
    permissions: string[];
};

type SuperUser = User & Admin;

function greetSuperUser(user: SuperUser): void {
    console.log(`Hello, ${user.name}. You have ${user.permissions.length} permissions.`);
}

const superUser: SuperUser = {
    id: 2,
    name: "Charlie",
    admin: true,
    permissions: ["read", "write"],
};

greetSuperUser(superUser); // ✅ Outputs: Hello, Charlie. You have 2 permissions.
