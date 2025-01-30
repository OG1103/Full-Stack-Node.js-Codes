// Type Aliases with Generics - Examples

// 1. Basic Generic Wrapper
type Wrapper<T> = { value: T };
let stringWrapper: Wrapper<string> = { value: "Hello" };
let numberWrapper: Wrapper<number> = { value: 42 };

console.log(stringWrapper); // { value: "Hello" }
console.log(numberWrapper); // { value: 42 }

// 2. Multiple Generic Parameters
type Pair<T, U> = { first: T; second: U };
let pair: Pair<string, number> = { first: "Age", second: 25 };

console.log(pair); // { first: "Age", second: 25 }

// 3. Generic Function with Type Alias
type Identity<T> = (arg: T) => T;
const identity: Identity<number> = (arg) => arg;
console.log(identity(100)); // 100

// 4. Extending and Constraining Generics
type Lengthy<T extends { length: number }> = { value: T; length: number };
let strLength: Lengthy<string> = { value: "Hello", length: 5 };

console.log(strLength); // { value: "Hello", length: 5 }

// 5. Generic Type with Default Values
type Optional<T = string> = { value: T };
let defaultString: Optional = { value: "Default" }; // Implicitly string
let numberValue: Optional<number> = { value: 100 };

console.log(defaultString); // { value: "Default" }
console.log(numberValue); // { value: 100 }

// 6. Nested Generics
type Response<T> = { success: boolean; data: T };
type APIResponse<T> = Response<T[]>;
let response: APIResponse<number> = { success: true, data: [1, 2, 3] };

console.log(response); // { success: true, data: [1, 2, 3] }

// 7. Using Generics with Arrays
type ArrayWrapper<T> = T[];
let numArray: ArrayWrapper<number> = [1, 2, 3];

console.log(numArray); // [1, 2, 3]

// 8. Union Types with Generics
type Result<T> = { success: true; data: T } | { success: false; error: string };
let successResponse: Result<number> = { success: true, data: 100 };
let errorResponse: Result<number> = { success: false, error: "Failed" };

console.log(successResponse); // { success: true, data: 100 }
console.log(errorResponse); // { success: false, error: "Failed" }
