
// Example: Union Types

// Union with primitive types
let id: string | number;
id = "123";
id = 123;

// Function with union types
function formatId(id: string | number): string {
    return `ID: ${id}`;
}

console.log(formatId(123));       // "ID: 123"
console.log(formatId("ABC123")); // "ID: ABC123"
