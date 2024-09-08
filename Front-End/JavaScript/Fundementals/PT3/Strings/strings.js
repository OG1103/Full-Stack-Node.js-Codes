// JavaScript Strings and String Manipulation

/* 
JavaScript strings are sequences of characters and are written inside quotes.
You can use single quotes (''), double quotes (""), or backticks (``) to define strings.
Example:
*/
let singleQuoteString = "This is a string in single quotes.";
let doubleQuoteString = "This is a string in double quotes.";
let templateString = `This is a string using backticks.`;

// String length property
// The length of a string can be found using the `.length` property.
let str = "Hello, world!";
console.log("String length:", str.length); // Output: 13

// Accessing characters in a string (indexing)
// You can access individual characters in a string using bracket notation.
console.log("First character:", str[0]); // Output: H
console.log("Last character:", str[str.length - 1]); // Output: !

// Strings are immutable in JavaScript. You cannot change individual characters in a string.
let myString = "hello";
myString[0] = "H"; // This will not change the string
console.log(myString); // Output: hello

// 1. String Methods

// a. toUpperCase() and toLowerCase()
// Converts a string to uppercase or lowercase.
console.log(str.toUpperCase()); // Output: HELLO, WORLD!
console.log(str.toLowerCase()); // Output: hello, world!

// b. indexOf()
// Returns the index of the first occurrence of a specified value. If not found, returns -1.
console.log("Index of 'world':", str.indexOf("world")); // Output: 7
console.log("Index of 'JavaScript':", str.indexOf("JavaScript")); // Output: -1 (not found)

// c. includes()
// Checks if a string contains a specified value, returns true or false.
console.log("Contains 'world':", str.includes("world")); // Output: true
console.log("Contains 'JavaScript':", str.includes("JavaScript")); // Output: false

// d. slice() and substring()
// Extracts a section of a string and returns it as a new string.
// slice(start, end) -> end is exclusive
// If the `end` argument is not specified, the slice continues to the end of the string.

console.log("Slice from index 7 to 12:", str.slice(7, 12)); // Output: world
console.log("Substring from index 7 to 12:", str.substring(7, 12)); // Output: world

// What happens if no end is specified?
console.log("Slice from index 7 to the end:", str.slice(7)); // Output: world!
console.log("Substring from index 7 to the end:", str.substring(7)); // Output: world!

// e. replace() and replaceAll()
// Replaces a specified value with another value in a string.
// replace() only replaces the first occurrence; replaceAll() replaces all occurrences.
let sentence = "The quick brown fox jumps over the lazy dog.";
console.log(sentence.replace("fox", "cat")); // Output: The quick brown cat jumps over the lazy dog.
console.log(sentence.replaceAll("o", "0")); // Output: The quick br0wn f0x jumps 0ver the lazy d0g.

// f. concat()
// Joins two or more strings.
let str1 = "Hello";
let str2 = "World";
console.log(str1.concat(", ", str2, "!")); // Output: Hello, World!

// g. trim(), trimStart(), trimEnd()
// Removes whitespace from both ends of a string, or from the start/end.
let paddedString = "   Hello World!   ";
console.log("Trimmed:", paddedString.trim()); // Output: "Hello World!"
console.log("Trimmed Start:", paddedString.trimStart()); // Output: "Hello World!   "
console.log("Trimmed End:", paddedString.trimEnd()); // Output: "   Hello World!"

// h. split()
// Splits a string into an array of substrings, based on a specified separator.
let csv = "apple,banana,orange";
let fruits = csv.split(",");
console.log(fruits); // Output: ['apple', 'banana', 'orange']

// i. repeat()
// Repeats a string a specified number of times.
console.log("Repeat 'Ha' 3 times:", "Ha".repeat(3)); // Output: HaHaHa

// j. startsWith() and endsWith()
// Checks if a string starts or ends with a specified value.
console.log("Starts with 'Hello':", str.startsWith("Hello")); // Output: true
console.log("Ends with '!':", str.endsWith("!")); // Output: true

// k. charAt() and charCodeAt()
// charAt(index) returns the character at a specified index.
// charCodeAt(index) returns the Unicode of the character at a specified index.
console.log("Character at index 1:", str.charAt(1)); // Output: e
console.log("Unicode of first character:", str.charCodeAt(0)); // Output: 72 (Unicode for 'H')

// l. padStart() and padEnd()
// Pads a string with another string until it reaches a specified length.
let paddedNumber = "5";
console.log(
  "Pad Start (with '0') to 3 characters:",
  paddedNumber.padStart(3, "0")
); // Output: 005
console.log("Pad End (with '*') to 5 characters:", paddedNumber.padEnd(5, "*")); // Output: 5****

// 2. String Manipulation and Common Tasks

// a. Reversing a string
let originalString = "JavaScript";
let reversedString = originalString.split("").reverse().join("");
console.log("Reversed String:", reversedString); // Output: tpircSavaJ

// b. Checking if a string is a palindrome (reads the same forwards and backwards)
let palindrome = "racecar";
let isPalindrome = palindrome === palindrome.split("").reverse().join("");
console.log(`Is "${palindrome}" a palindrome?`, isPalindrome); // Output: true

// c. Replacing multiple spaces with a single space
let textWithSpaces = "This   is   a   sentence  with  irregular   spaces.";
let normalizedText = textWithSpaces.replace(/\s+/g, " ");
console.log("Normalized Text:", normalizedText); // Output: This is a sentence with irregular spaces.

// d. Extracting a substring between two characters
let email = "example@gmail.com";
let domain = email.slice(email.indexOf("@") + 1);
console.log("Domain of email:", domain); // Output: gmail.com

// e. Capitalizing the first letter of a string
let lowercaseStr = "javascript";
let capitalizedStr =
  lowercaseStr.charAt(0).toUpperCase() + lowercaseStr.slice(1);
console.log("Capitalized String:", capitalizedStr); // Output: Javascript

// f. Converting a string to an array of characters
let charArray = "hello".split("");
console.log("Character Array:", charArray); // Output: ['h', 'e', 'l', 'l', 'o']

// g. Escaping special characters in a string
// Backslash (\) is used to escape special characters like quotes, newlines, etc.
let quote = 'He said, "JavaScript is fun!"';
console.log(quote); // Output: He said, "JavaScript is fun!"

// 3. Template Literals (Template Strings)

/* 
Template literals are enclosed by backticks (``) and allow for embedded expressions.
You can insert variables or expressions using `${}`.
They also support multi-line strings without needing special characters.
*/

let name = "John";
let greeting = `Hello, ${name}!`;
console.log(greeting); // Output: Hello, John!

let multilineString = `This is a
multi-line string
in JavaScript.`;
console.log(multilineString);
// Output:
// This is a
// multi-line string
// in JavaScript.

// Template literals can also include expressions
let x = 10;
let y = 20;
console.log(`The sum of ${x} and ${y} is ${x + y}.`); // Output: The sum of 10 and 20 is 30.

// Conclusion:
// JavaScript provides powerful methods and techniques for working with strings.
// These built-in methods make it easy to manipulate, transform, and work with string data.
