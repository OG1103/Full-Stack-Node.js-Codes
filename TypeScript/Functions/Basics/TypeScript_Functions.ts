
// 1. Function Declaration
function add(a: number, b: number): number {
    return a + b;
}
console.log(add(2, 3)); // Output: 5

// 2. Function Expression
const multiply = function (a: number, b: number): number {
    return a * b;
};
console.log(multiply(4, 5)); // Output: 20

// 3. Arrow Function
const divide = (a: number, b: number): number => a / b;
console.log(divide(10, 2)); // Output: 5

// 4. Optional Parameters
function greet(name: string, age?: number): string {
    return age ? `Hello ${name}, you are ${age} years old.` : `Hello ${name}`;
}
console.log(greet("Alice")); // Output: Hello Alice
console.log(greet("Bob", 25)); // Output: Hello Bob, you are 25 years old.

// 5. Default Parameters
function greetWithDefault(name: string, age: number = 30): string {
    return `Hello ${name}, you are ${age} years old.`;
}
console.log(greetWithDefault("Alice")); // Output: Hello Alice, you are 30 years old.

// 6. Rest Parameters
function sumAll(...numbers: number[]): number {
    return numbers.reduce((sum, num) => sum + num, 0);
}
console.log(sumAll(1, 2, 3, 4)); // Output: 10

// 7. Return Types
function subtract(a: number, b: number): number {
    return a - b;
}
console.log(subtract(10, 3)); // Output: 7

// Void Return Type
function logMessage(message: string): void {
    console.log(message);
}
logMessage("This is a message."); // Output: This is a message.

// 8. Function Overloading
function getValue(value: string): string;
function getValue(value: number): number;
function getValue(value: any): any {
    return value;
}
console.log(getValue("Hello")); // Output: Hello
console.log(getValue(42));      // Output: 42

// 9. Anonymous Functions
setTimeout(() => {
    console.log("This is an anonymous function.");
}, 1000);

// 10. Functions as Types
type MathOperation = (a: number, b: number) => number;

const multiplyOperation: MathOperation = (a, b) => a * b;
console.log(multiplyOperation(6, 7)); // Output: 42

// 11. Async Functions
async function fetchData(url: string): Promise<string> {
    const response = await fetch(url);
    return response.text();
}

// Usage of fetchData:
// (Uncomment the following lines if running in an environment that supports fetch)
// fetchData("https://jsonplaceholder.typicode.com/todos/1").then(data => console.log(data));
