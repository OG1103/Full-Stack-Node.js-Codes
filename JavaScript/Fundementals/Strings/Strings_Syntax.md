
# JavaScript Strings and String Manipulation

Strings in JavaScript are sequences of characters enclosed in single quotes (`'`), double quotes (`"`), or backticks (```).

## String Basics

### Declaring Strings
```javascript
let singleQuote = 'Single Quote String';
let doubleQuote = "Double Quote String";
let backtickString = \`Template Literal String\`;
```

### String Length
Use `.length` to find the length of a string.
```javascript
let str = "Hello, world!";
console.log(str.length); // Output: 13
```

### Accessing Characters
Use bracket notation to access individual characters by their index.
```javascript
console.log(str[0]); // Output: H
console.log(str[str.length - 1]); // Output: !
```

### Strings are Immutable
Strings cannot be changed after they are created.
```javascript
let myStr = "hello";
myStr[0] = "H"; // This will not work
console.log(myStr); // Output: hello
```

## Common String Methods

### Case Conversion
```javascript
str.toUpperCase(); // Converts to uppercase
str.toLowerCase(); // Converts to lowercase
```

### Searching Strings
- `.indexOf()` returns the index of the first occurrence of a value.
- `.includes()` checks if a string contains a value.
```javascript
str.indexOf("world"); // Output: 7
str.includes("world"); // Output: true
```

### Extracting Substrings
- `.slice(start, end)` extracts a section of a string.
- `.substring(start, end)` extracts characters between indices.
```javascript
str.slice(7, 12); // Output: "world"
str.substring(7, 12); // Output: "world"
```

### Replacing Substrings
- `.replace()` replaces the first occurrence.
- `.replaceAll()` replaces all occurrences.
```javascript
str.replace("world", "there"); // Output: "Hello, there!"
str.replaceAll("o", "0"); // Output: "Hell0, w0rld!"
```

### Splitting Strings
Split a string into an array of substrings.
```javascript
let fruits = "apple,banana,orange".split(",");
console.log(fruits); // Output: ['apple', 'banana', 'orange']
```

### Joining Strings
Use `.concat()` or template literals.
```javascript
"Hello".concat(", ", "World!"); // Output: "Hello, World!"
\`Hello, \${name}!\`; // Output: "Hello, John!"
```

## Advanced String Manipulations

### Reversing a String
```javascript
let reversed = "JavaScript".split("").reverse().join("");
console.log(reversed); // Output: tpircSavaJ
```

### Checking for Palindromes
```javascript
let isPalindrome = "racecar" === "racecar".split("").reverse().join("");
console.log(isPalindrome); // Output: true
```

### Trimming Whitespace
```javascript
let padded = "   Hello   ";
console.log(padded.trim()); // Output: "Hello"
console.log(padded.trimStart()); // Output: "Hello   "
console.log(padded.trimEnd()); // Output: "   Hello"
```

### Padding Strings
```javascript
"5".padStart(3, "0"); // Output: "005"
"5".padEnd(3, "*"); // Output: "5**"
```

### Template Literals
```javascript
let name = "John";
let age = 25;
console.log(`My name is ${name} and I am ${age} years old.`);
// Output: My name is John and I am 25 years old.
```

## Conclusion
JavaScript provides a powerful set of methods for working with strings, making it easy to manipulate and transform them for various use cases.
