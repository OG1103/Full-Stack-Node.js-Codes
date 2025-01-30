// 1. number
let age: number = 25;
let temperature: number = 36.5;

// 2. string
let Name: string = "Alice";
let greeting: string = `Hello, ${Name}!`;

// 3. boolean
let isStudent: boolean = true;
let hasGraduated: boolean = false;

// 4. null
let emptyValue: null = null;

// 5. undefined
let uninitializedValue: undefined = undefined;

// 6. bigint
let bigNumber: bigint = 123456789012345678901234567890n;

// 7. symbol
let uniqueId: symbol = Symbol("id");

// 8. any
let randomValue: any = 42;
randomValue = "A string";
randomValue = true;

// 9. unknown
let unknownValue: unknown = "Hello";
if (typeof unknownValue === "string") {
  console.log(unknownValue.toUpperCase());
}

// 10. void
function logMessage(message: string): void {
  console.log(message);
}

// 11. never
function throwError(message: string): never {
  throw new Error(message);
}
