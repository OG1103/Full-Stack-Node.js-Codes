
// Basic Union Type with Objects
type Admin = {
    role: "admin";
    permissions: string[];
};

type User = {
    role: "user";
    name: string;
};

type AdminOrUser = Admin | User;

const user1: AdminOrUser = { role: "user", name: "Alice" }; // ✅ Valid
const user2: AdminOrUser = { role: "admin", permissions: ["read", "write"] }; // ✅ Valid
// const invalidUser: AdminOrUser = { role: "guest" }; // ❌ Error

// Narrowing Union Types
function handleUser(user: AdminOrUser): void {
    if (user.role === "admin") {
        console.log(`Admin with permissions: ${user.permissions.join(", ")}`);
    } else {
        console.log(`User with name: ${user.name}`);
    }
}

handleUser(user1); // ✅ Outputs: User with name: Alice
handleUser(user2); // ✅ Outputs: Admin with permissions: read, write

// Union Types in Functions
type StringOrNumber = string | number;

function printValue(value: StringOrNumber): void {
    if (typeof value === "string") {
        console.log(`String value: ${value}`);
    } else {
        console.log(`Number value: ${value}`);
    }
}

printValue("Hello"); // ✅ Outputs: String value: Hello
printValue(42);      // ✅ Outputs: Number value: 42

// Union Types with Discriminated Unions
type Shape =
    | { type: "circle"; radius: number }
    | { type: "rectangle"; width: number; height: number };

function calculateArea(shape: Shape): number {
    if (shape.type === "circle") {
        return Math.PI * shape.radius ** 2;
    } else {
        return shape.width * shape.height;
    }
}

const circle: Shape = { type: "circle", radius: 10 };
const rectangle: Shape = { type: "rectangle", width: 5, height: 8 };

console.log(calculateArea(circle));    // ✅ Outputs: 314.1592653589793
console.log(calculateArea(rectangle)); // ✅ Outputs: 40
