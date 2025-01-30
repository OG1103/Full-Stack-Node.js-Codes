
// 1. Basic Function Overloading
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any): any {
    return a + b;
}

console.log(add(1, 2));           // Output: 3
console.log(add("Hello, ", "World")); // Output: "Hello, World"

// 2. Handling Multiple Data Types
function format(input: number): string;
function format(input: string): string;
function format(input: any): string {
    return input.toString();
}

console.log(format(123));       // Output: "123"
console.log(format("Hello"));   // Output: "Hello"

// 3. Varying Numbers of Parameters
function greet(name: string): string;
function greet(firstName: string, lastName: string): string;
function greet(firstName: any, lastName?: any): string {
    return lastName ? `Hello, ${firstName} ${lastName}` : `Hello, ${firstName}`;
}

console.log(greet("Alice"));             // Output: "Hello, Alice"
console.log(greet("John", "Doe"));       // Output: "Hello, John Doe"

// 4. Function Overloading with Classes
class Calculator {
    add(a: number, b: number): number;
    add(a: string, b: string): string;
    add(a: any, b: any): any {
        return a + b;
    }
}

const calc = new Calculator();
console.log(calc.add(1, 2));           // Output: 3
console.log(calc.add("Hello, ", "World")); // Output: "Hello, World"

// 5. Function Overloading with Interfaces
interface Formatter {
    (input: number): string;
    (input: string): string;
}

const formatWithInterface: Formatter = (input: any): string => {
    return input.toString();
};

console.log(formatWithInterface(123));        // Output: "123"
console.log(formatWithInterface("Test"));     // Output: "Test"

// 6. Function Overloading with Arrow Functions
type Add = {
    (a: number, b: number): number;
    (a: string, b: string): string;
};

const addArrow: Add = (a: any, b: any): any => a + b;

console.log(addArrow(1, 2));           // Output: 3
console.log(addArrow("Hello, ", "World")); // Output: "Hello, World"

// 7. Practical Use Case: Fetching Data
function fetchData(id: number): string;
function fetchData(url: string): string;
function fetchData(input: any): string {
    return typeof input === "number"
        ? `Fetching data for ID: ${input}`
        : `Fetching data from URL: ${input}`;
}

console.log(fetchData(101));            // Output: "Fetching data for ID: 101"
console.log(fetchData("https://api"));  // Output: "Fetching data from URL: https://api"
