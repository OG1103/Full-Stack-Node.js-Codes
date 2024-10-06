// Generics allow you to create flexible and reusable functions, interfaces, and classes that work with any data type.
// The type T is a placeholder that will be replaced with a specific type when the function, interface, or class is used.


// Basic Generics Example

// This function accepts an argument of any type and returns it.
// The type 'T' is a placeholder for any type (can be number, string, etc.).
function identity<T>(arg: T): T {
    return arg;
}

// Using the generic function with different types
let num = identity<number>(10); // num is of type number
let str = identity<string>("Hello"); // str is of type string
let arr = identity<number[]>([1, 2, 3]); // arr is of type number array

console.log(num); // Output: 10
console.log(str); // Output: Hello
console.log(arr); // Output: [1, 2, 3]


// Generic Types in Functions

// You can also declare the generic type inline while defining the function.
const getFirstElement = <T>(arr: T[]): T => {
    return arr[0];
};

// Using the generic function with arrays of different types
let firstNum = getFirstElement([10, 20, 30]); // First number
let firstStr = getFirstElement(["apple", "banana", "cherry"]); // First string

console.log(firstNum); // Output: 10
console.log(firstStr); // Output: apple


// Generics in Interfaces

// Generic interface that can hold a value of any type.
interface Box<T> {
    content: T;
}

// Creating boxes with different types of content
let numberBox: Box<number> = { content: 100 };
let stringBox: Box<string> = { content: "A box of chocolates" };

console.log(numberBox.content); // Output: 100
console.log(stringBox.content); // Output: A box of chocolates


// Generics in Classes

// A generic class that holds a value of type 'T'
class Container<T> {
    private value: T;

    constructor(value: T) {
        this.value = value;
    }

    getValue(): T {
        return this.value;
    }

    setValue(newValue: T): void {
        this.value = newValue;
    }
}

// Creating containers with different types of values
let numberContainer = new Container<number>(123);
let stringContainer = new Container<string>("Hello, World!");

console.log(numberContainer.getValue()); // Output: 123
console.log(stringContainer.getValue()); // Output: Hello, World!

numberContainer.setValue(456);
console.log(numberContainer.getValue()); // Output: 456


// Generics in Constraints

// You can also add constraints to generics so that they can only accept certain types.
interface HasLength {
    length: number;
}

// A generic function that requires the type to have a 'length' property
function logLength<T extends HasLength>(item: T): void {
    console.log(item.length);
}

// Works with strings (since strings have a length property)
logLength("Hello!"); // Output: 6

// Works with arrays (since arrays have a length property)
logLength([1, 2, 3, 4]); // Output: 4

// Fails with numbers (since numbers don't have a length property)
// logLength(123); // Error


// Using Multiple Generics

// A function that accepts two arguments of different types
function pair<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}

let mixedPair = pair<number, string>(1, "One");
console.log(mixedPair); // Output: [1, "One"]


// Default Generic Types

// You can provide default types for generics
function createList<T = string>(): T[] {
    return [];
}

// Since we provided a default, we don't need to specify the type explicitly
let defaultList = createList();
defaultList.push("apple", "banana");
console.log(defaultList); // Output: ["apple", "banana"]

// You can still specify a different type if needed
let numberList = createList<number>();
numberList.push(1, 2, 3);
console.log(numberList); // Output: [1, 2, 3]