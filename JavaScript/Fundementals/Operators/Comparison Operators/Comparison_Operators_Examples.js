
// Complex Examples of Comparison Operators in JavaScript

// Example 1: Comparing objects
let obj1 = { name: "Alice" };
let obj2 = { name: "Alice" };

console.log(obj1 == obj2);  // false (different memory references)
console.log(obj1 === obj2); // false (strict comparison of objects)

// Example 2: Comparing arrays
let arr1 = [1, 2, 3];
let arr2 = [1, 2, 3];

console.log(arr1 == arr2);  // false (different memory references)
console.log(arr1 === arr2); // false (strict comparison of arrays)

// Example 3: String and number comparisons
let num = 42;
let str = "42";

console.log(num == str);  // true (type coercion occurs)
console.log(num === str); // false (strict comparison)

// Example 4: Comparing null and undefined
console.log(null == undefined);  // true (type coercion)
console.log(null === undefined); // false (strict comparison)

// Example 5: Using modulus for even/odd checking
let number = 7;

if (number % 2 === 0) {
    console.log(`${number} is even.`);
} else {
    console.log(`${number} is odd.`);
}
// Output: 7 is odd.

// Example 6: Boolean comparison
let isActive = true;
let isComplete = false;

console.log(isActive && isComplete); // false
console.log(isActive || isComplete); // true

// Example 7: Comparing NaN
console.log(NaN == NaN);  // false (NaN is not equal to itself)
console.log(Number.isNaN(NaN)); // true (use Number.isNaN to check for NaN)
