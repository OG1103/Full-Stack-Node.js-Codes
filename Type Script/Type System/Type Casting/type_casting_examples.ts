
// Example: Type Casting

let someValue: any = "This is a string";
let length1: number = (<string>someValue).length; // Angle bracket syntax
let length2: number = (someValue as string).length; // `as` syntax

console.log(length1); // Outputs: 16
console.log(length2); // Outputs: 16
