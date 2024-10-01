// Basic Types in TypeScript with Examples

// 1. String
let name1: string = "Alice"; // This is a string type variable

// 2. Number
let age: number = 25; // This is a number type variable

// 3. Boolean
let isStudent: boolean = true; // This is a boolean type variable

// 4. Array
let scores: number[] = [90, 85, 88]; // This is an array of numbers
let arr1: (string | number)[] = [1, 2, 3, "A"]; // arr can elements of type string/number
let arr2: (string | number | string[] | boolean[])[] = [1, 2, 3, 4, "a", ["ss", "ss1"], [true, false]]; // arr can elements of type string/number/array of strings/array of booleans
// 5. Tuple
let person: [string, number] = ["Alice", 25]; // This is a tuple with a string and a number

//MIX USING OR
let varMix: string | number = 2;
varMix = "Omar"; // works since var can also be a string.

// 6. Enum
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
let move: Direction = Direction.Up; // Enum usage

// 7. Any
let randomValue: any = "Hello"; // Can be any type
randomValue = 10; // Reassigned to a number without error

// 8. Void (used for functions that do not return a value)
function logMessage(): void {
  console.log("Logging a message");
}

const arrowfunc = (): void => {
  console.log("test");
};

// 9. Null and Undefined
let emptyValue: null = null; // Null type
let uninitializedValue: undefined = undefined; // Undefined type
