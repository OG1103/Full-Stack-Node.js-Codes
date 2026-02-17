# Strings in JavaScript

Strings are one of the most commonly used data types in JavaScript. They represent textual data as a sequence of UTF-16 code units. Understanding string creation, immutability, template literals, and the full suite of string methods is critical for everyday JavaScript development.

---

## Table of Contents

1. [String Creation](#1-string-creation)
2. [String Immutability](#2-string-immutability)
3. [Template Literals](#3-template-literals)
4. [String Properties and Access Methods](#4-string-properties-and-access-methods)
5. [Searching Within Strings](#5-searching-within-strings)
6. [Extracting Substrings: slice, substring, substr](#6-extracting-substrings-slice-substring-substr)
7. [Case Conversion](#7-case-conversion)
8. [Trimming Whitespace](#8-trimming-whitespace)
9. [Splitting and Joining](#9-splitting-and-joining)
10. [Replacing Content](#10-replacing-content)
11. [Padding](#11-padding)
12. [Repeating and Other Methods](#12-repeating-and-other-methods)
13. [String Comparison](#13-string-comparison)

---

## 1. String Creation

### String Literals

The most common way to create strings is with **literals** using single quotes, double quotes, or backticks.

```js
const single = 'Hello, World!';
const double = "Hello, World!";
const backtick = `Hello, World!`;

// All three produce the same string value
console.log(single === double);   // true
console.log(double === backtick); // true
```

### String Constructor

You can also use the `String()` constructor, but this is rarely needed.

```js
// String() as a function (returns a primitive string)
const str1 = String(123);      // "123"
const str2 = String(true);     // "true"
const str3 = String(null);     // "null"
const str4 = String(undefined); // "undefined"
const str5 = String([1,2,3]);  // "1,2,3"
const str6 = String({});       // "[object Object]"

// new String() as a constructor (returns a String object -- avoid this!)
const strObj = new String("hello");
console.log(typeof strObj);     // "object" (NOT "string")
console.log(strObj == "hello"); // true (abstract equality coerces)
console.log(strObj === "hello"); // false (object vs primitive)
console.log(strObj.valueOf());  // "hello" (unwrap to primitive)
```

**Best Practice:** Always use string literals. Avoid `new String()` -- it creates wrapper objects that behave unexpectedly.

### Escape Characters

| Escape Sequence | Character |
|---|---|
| `\'` | Single quote |
| `\"` | Double quote |
| `` \` `` | Backtick |
| `\\` | Backslash |
| `\n` | Newline |
| `\r` | Carriage return |
| `\t` | Tab |
| `\uXXXX` | Unicode code point (4 hex digits) |
| `\u{XXXXX}` | Unicode code point (1-6 hex digits, ES6) |
| `\0` | Null character |

```js
console.log("Line 1\nLine 2");
// Line 1
// Line 2

console.log("Column1\tColumn2");
// Column1    Column2

console.log("She said \"hello\"");
// She said "hello"

console.log("\u0048\u0065\u006C\u006C\u006F"); // "Hello"
console.log("\u{1F600}"); // emoji (grinning face)
```

---

## 2. String Immutability

Strings in JavaScript are **immutable**. Once created, the characters of a string cannot be changed. Any operation that appears to modify a string actually **creates a new string**.

```js
let str = "Hello";

// Attempting to change a character
str[0] = "h";
console.log(str); // "Hello" (unchanged, no error in non-strict mode)

// String methods return NEW strings
const upper = str.toUpperCase();
console.log(str);   // "Hello" (original unchanged)
console.log(upper); // "HELLO" (new string)

// Reassignment is NOT mutation -- it points the variable to a new string
str = "World";    // This is fine; we are not mutating "Hello",
                  // we are creating "World" and pointing str to it.
```

### Why Immutability Matters

- **Performance:** JavaScript engines can optimize immutable strings (e.g., string interning).
- **Safety:** Strings passed to functions cannot be inadvertently modified.
- **Comparison:** Two strings with the same characters are always equal (`===`), unlike objects.

```js
const a = "hello";
const b = "hel" + "lo";
console.log(a === b); // true (same characters, same value)
```

---

## 3. Template Literals

Template literals (backtick strings) were introduced in ES6 and provide powerful features beyond regular strings.

### Expression Interpolation

```js
const name = "Alice";
const age = 30;

// Old way (concatenation)
const msg1 = "Hello, " + name + "! You are " + age + " years old.";

// Template literal
const msg2 = `Hello, ${name}! You are ${age} years old.`;

// Any expression works inside ${}
const msg3 = `Next year you'll be ${age + 1}.`;
const msg4 = `Is adult: ${age >= 18 ? "Yes" : "No"}`;
const msg5 = `Uppercase: ${name.toUpperCase()}`;

console.log(msg2); // "Hello, Alice! You are 30 years old."
console.log(msg4); // "Is adult: Yes"
```

### Multiline Strings

```js
// Old way
const oldMultiline = "Line 1\n" +
                     "Line 2\n" +
                     "Line 3";

// Template literal (preserves line breaks as-is)
const newMultiline = `Line 1
Line 2
Line 3`;

console.log(newMultiline);
// Line 1
// Line 2
// Line 3
```

**Caution:** Template literals preserve **all whitespace**, including indentation.

```js
function getHTML() {
  return `
    <div>
      <p>Hello</p>
    </div>
  `;
}
// The returned string has leading newline and indentation spaces.
// Use .trim() if you want to remove leading/trailing whitespace.
```

### Nested Template Literals

```js
const items = ["apple", "banana", "cherry"];
const html = `
  <ul>
    ${items.map(item => `<li>${item}</li>`).join("\n    ")}
  </ul>
`;
console.log(html);
```

### Tagged Templates

Tagged templates let you process template literals with a **tag function**. The function receives the string parts and the interpolated values as separate arguments.

```js
function highlight(strings, ...values) {
  // strings: array of static string parts
  // values: array of interpolated expression results
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] !== undefined ? `**${values[i]}**` : "");
  }, "");
}

const name = "Alice";
const role = "admin";
const msg = highlight`User ${name} has role ${role}.`;
console.log(msg); // "User **Alice** has role **admin**."
```

### Practical Tagged Template: SQL Escaping

```js
function sql(strings, ...values) {
  return strings.reduce((query, str, i) => {
    const escapedValue = values[i] !== undefined
      ? typeof values[i] === "string"
        ? `'${values[i].replace(/'/g, "''")}'`
        : values[i]
      : "";
    return query + str + escapedValue;
  }, "");
}

const table = "users";
const name = "O'Brien";
const query = sql`SELECT * FROM ${table} WHERE name = ${name}`;
console.log(query); // "SELECT * FROM users WHERE name = 'O''Brien'"
```

### String.raw

`String.raw` is a built-in tag function that returns the raw string without processing escape sequences.

```js
console.log(`Hello\nWorld`);
// Hello
// World

console.log(String.raw`Hello\nWorld`);
// Hello\nWorld (the \n is literal, not a newline)

// Useful for regex, file paths (Windows), etc.
const path = String.raw`C:\Users\Alice\Documents`;
console.log(path); // C:\Users\Alice\Documents
```

---

## 4. String Properties and Access Methods

### length

`length` returns the number of **UTF-16 code units** in the string (not necessarily the number of visible characters for emoji or other multi-byte characters).

```js
console.log("Hello".length);    // 5
console.log("".length);         // 0
console.log("Hello World".length); // 11 (space counts)

// Emoji gotcha
console.log("a]".length);       // 3 (emoji uses 2 code units -- a surrogate pair)
```

### charAt(index)

Returns the character at the given index. Returns an empty string if the index is out of range.

```js
const str = "Hello";
console.log(str.charAt(0));   // "H"
console.log(str.charAt(4));   // "o"
console.log(str.charAt(10));  // "" (out of range)
console.log(str.charAt(-1));  // "" (negative index)
```

### Bracket Notation (str[index])

Similar to `charAt`, but returns `undefined` for out-of-range indices.

```js
const str = "Hello";
console.log(str[0]);   // "H"
console.log(str[4]);   // "o"
console.log(str[10]);  // undefined (not "")
console.log(str[-1]);  // undefined
```

### at(index) (ES2022)

Like bracket notation, but supports **negative indices** (counting from the end).

```js
const str = "Hello";
console.log(str.at(0));   // "H"
console.log(str.at(-1));  // "o" (last character)
console.log(str.at(-2));  // "l" (second to last)
console.log(str.at(10));  // undefined
```

---

## 5. Searching Within Strings

### indexOf(searchValue, fromIndex?)

Returns the **first index** where the search value is found, or `-1` if not found.

```js
const str = "Hello, World! Hello, JavaScript!";

console.log(str.indexOf("Hello"));       // 0
console.log(str.indexOf("Hello", 1));    // 14 (starts searching from index 1)
console.log(str.indexOf("hello"));       // -1 (case-sensitive)
console.log(str.indexOf("xyz"));         // -1 (not found)
console.log(str.indexOf(""));           // 0 (empty string found at start)
```

### lastIndexOf(searchValue, fromIndex?)

Returns the **last index** where the search value is found, or `-1` if not found. Searches **backward** from `fromIndex`.

```js
const str = "Hello, World! Hello, JavaScript!";

console.log(str.lastIndexOf("Hello"));   // 14
console.log(str.lastIndexOf("Hello", 13)); // 0 (searches backward from index 13)
console.log(str.lastIndexOf("xyz"));     // -1
```

### includes(searchValue, fromIndex?) (ES6)

Returns `true` if the string contains the search value, `false` otherwise.

```js
const str = "Hello, World!";

console.log(str.includes("World"));     // true
console.log(str.includes("world"));     // false (case-sensitive)
console.log(str.includes("World", 8));  // false (starts searching from index 8)
console.log(str.includes(""));          // true (empty string is always found)
```

### startsWith(searchValue, position?) (ES6)

Returns `true` if the string begins with the search value.

```js
const str = "Hello, World!";

console.log(str.startsWith("Hello"));    // true
console.log(str.startsWith("hello"));    // false (case-sensitive)
console.log(str.startsWith("World", 7)); // true (check starting from position 7)
```

### endsWith(searchValue, length?) (ES6)

Returns `true` if the string ends with the search value. The optional `length` parameter treats the string as if it were only that many characters long.

```js
const str = "Hello, World!";

console.log(str.endsWith("World!"));     // true
console.log(str.endsWith("world!"));     // false (case-sensitive)
console.log(str.endsWith("Hello", 5));   // true (considers only first 5 chars: "Hello")
```

### Search Methods Summary

| Method | Returns | Case-Sensitive | Regex Support |
|---|---|---|---|
| `indexOf()` | First index or `-1` | Yes | No |
| `lastIndexOf()` | Last index or `-1` | Yes | No |
| `includes()` | `true`/`false` | Yes | No |
| `startsWith()` | `true`/`false` | Yes | No |
| `endsWith()` | `true`/`false` | Yes | No |
| `search()` | First index or `-1` | Configurable | Yes |
| `match()` | Array or `null` | Configurable | Yes |
| `matchAll()` | Iterator | Configurable | Yes (requires `g` flag) |

---

## 6. Extracting Substrings: slice, substring, substr

### slice(start, end?)

Extracts a section of the string from `start` up to (but **not including**) `end`. Supports **negative indices**.

```js
const str = "Hello, World!";

console.log(str.slice(0, 5));    // "Hello"
console.log(str.slice(7));       // "World!" (from index 7 to end)
console.log(str.slice(-6));      // "orld!" -- wait, let's recount
// str = "Hello, World!" (length 13)
// -6 = index 13 - 6 = index 7 -> "World!"
console.log(str.slice(-6));      // "orld!" is wrong, let me recalculate:
// Index:  0  1  2  3  4  5  6  7  8  9 10 11 12
// Char:   H  e  l  l  o  ,     W  o  r  l  d  !
// -6 -> 13 - 6 = 7 -> from index 7: "World!"
console.log(str.slice(-6));      // "orld!" -- index 7="W" so actually "World!"

console.log(str.slice(0, -1));   // "Hello, World" (everything except last char)
console.log(str.slice(-6, -1));  // "World" (from index 7 to index 12, not including 12)
```

Let me correct that with a cleaner example:

```js
const str = "Hello, World!";
// Indices: H(0) e(1) l(2) l(3) o(4) ,(5) (6) W(7) o(8) r(9) l(10) d(11) !(12)

console.log(str.slice(0, 5));    // "Hello"
console.log(str.slice(7));       // "World!"
console.log(str.slice(7, 12));   // "World"
console.log(str.slice(-6));      // "orld!" -> actually "World!" since -6 = index 7
console.log(str.slice(-6, -1));  // "World"
console.log(str.slice(0, -1));   // "Hello, World"

// If start > end, returns empty string
console.log(str.slice(5, 2));    // ""
```

### substring(start, end?)

Similar to `slice`, but:
- Does **not** support negative indices (treats them as 0).
- If `start > end`, it **swaps** them automatically.

```js
const str = "Hello, World!";

console.log(str.substring(0, 5));  // "Hello"
console.log(str.substring(7));     // "World!"
console.log(str.substring(5, 0));  // "Hello" (swapped: same as substring(0, 5))
console.log(str.substring(-3));    // "Hello, World!" (negative treated as 0)
```

### substr(start, length?) -- DEPRECATED

Extracts `length` characters from `start`. **Deprecated** -- do not use in new code.

```js
const str = "Hello, World!";

console.log(str.substr(0, 5));   // "Hello" (5 characters from index 0)
console.log(str.substr(7, 5));   // "World" (5 characters from index 7)
console.log(str.substr(-6, 5));  // "World" (negative index supported)
```

### Comparison Table

| Feature | `slice(start, end)` | `substring(start, end)` | `substr(start, length)` |
|---|---|---|---|
| Second parameter | End index (exclusive) | End index (exclusive) | **Length** of extraction |
| Negative indices | Supported (counts from end) | Treated as 0 | Supported for start |
| start > end | Returns `""` | **Swaps** start and end | n/a |
| Status | Recommended | Acceptable | **Deprecated** |

**Best Practice:** Use `slice()` -- it is the most flexible and predictable.

---

## 7. Case Conversion

### toUpperCase() and toLowerCase()

```js
const str = "Hello, World!";

console.log(str.toUpperCase()); // "HELLO, WORLD!"
console.log(str.toLowerCase()); // "hello, world!"

// Original is unchanged (strings are immutable)
console.log(str); // "Hello, World!"
```

### Practical: Case-Insensitive Comparison

```js
function equalsIgnoreCase(str1, str2) {
  return str1.toLowerCase() === str2.toLowerCase();
}

console.log(equalsIgnoreCase("Hello", "hello"));   // true
console.log(equalsIgnoreCase("Hello", "HELLO"));   // true
```

### Capitalize First Letter

```js
function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

console.log(capitalize("hello"));    // "Hello"
console.log(capitalize(""));         // ""
console.log(capitalize("a"));        // "A"

// Title case (capitalize each word)
function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

console.log(titleCase("hello world foo bar")); // "Hello World Foo Bar"
```

---

## 8. Trimming Whitespace

### trim(), trimStart(), trimEnd()

These methods remove whitespace (spaces, tabs, newlines) from the string.

```js
const str = "   Hello, World!   ";

console.log(str.trim());      // "Hello, World!"
console.log(str.trimStart()); // "Hello, World!   " (also: trimLeft())
console.log(str.trimEnd());   // "   Hello, World!" (also: trimRight())

// Removes all whitespace types
const messy = " \t\n  Hello  \n\t ";
console.log(messy.trim()); // "Hello"

// Common use: cleaning user input
function cleanInput(input) {
  return input.trim();
}
console.log(cleanInput("  alice@example.com  ")); // "alice@example.com"
```

**Note:** `trimLeft()` and `trimRight()` are aliases for `trimStart()` and `trimEnd()` respectively. The `trimStart`/`trimEnd` names are preferred as they follow the logical direction standard used by `padStart`/`padEnd`.

---

## 9. Splitting and Joining

### split(separator, limit?)

Splits a string into an array of substrings based on a separator.

```js
const csv = "apple,banana,cherry,date";
console.log(csv.split(","));       // ["apple", "banana", "cherry", "date"]
console.log(csv.split(",", 2));    // ["apple", "banana"] (limit to 2 elements)

// Split by whitespace
const sentence = "Hello World Foo Bar";
console.log(sentence.split(" "));  // ["Hello", "World", "Foo", "Bar"]

// Split every character
console.log("Hello".split(""));   // ["H", "e", "l", "l", "o"]

// Split with no separator (returns array with original string)
console.log("Hello".split());     // ["Hello"]

// Split with regex
const data = "one1two2three3four";
console.log(data.split(/\d/));    // ["one", "two", "three", "four"]

// Handle edge cases
console.log("".split(","));       // [""] (array with one empty string)
console.log(",,,".split(","));    // ["", "", "", ""] (4 empty strings)
```

### Array.prototype.join(separator?)

Joins array elements into a string with a separator (default is `,`).

```js
const fruits = ["apple", "banana", "cherry"];

console.log(fruits.join());       // "apple,banana,cherry" (default comma)
console.log(fruits.join(", "));   // "apple, banana, cherry"
console.log(fruits.join(" - "));  // "apple - banana - cherry"
console.log(fruits.join(""));     // "applebananacherry"

// Practical: split, transform, rejoin
const kebab = "hello-world-foo-bar";
const camel = kebab
  .split("-")
  .map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
  .join("");
console.log(camel); // "helloWorldFooBar"
```

### split() and join() as Inverses

```js
const original = "Hello, World!";
const parts = original.split(", ");
console.log(parts);                // ["Hello", "World!"]
console.log(parts.join(", "));     // "Hello, World!" (back to original)
```

---

## 10. Replacing Content

### replace(searchValue, replacement)

Replaces the **first** occurrence of `searchValue` with `replacement`. The search value can be a string or a RegExp.

```js
const str = "Hello, World! Hello, JavaScript!";

// Replace first occurrence only
console.log(str.replace("Hello", "Hi"));
// "Hi, World! Hello, JavaScript!"

// With regex (no g flag = first match only)
console.log(str.replace(/hello/i, "Hi"));
// "Hi, World! Hello, JavaScript!" (i flag for case-insensitive)

// With regex (g flag = all matches)
console.log(str.replace(/Hello/g, "Hi"));
// "Hi, World! Hi, JavaScript!"
```

### replaceAll(searchValue, replacement) (ES2021)

Replaces **all** occurrences. When using a string as the search value, it replaces every instance without needing regex.

```js
const str = "Hello, World! Hello, JavaScript!";

console.log(str.replaceAll("Hello", "Hi"));
// "Hi, World! Hi, JavaScript!"

// With regex (MUST use g flag with replaceAll)
console.log(str.replaceAll(/Hello/g, "Hi"));
// "Hi, World! Hi, JavaScript!"
// console.log(str.replaceAll(/Hello/, "Hi")); // TypeError! Missing g flag.
```

### Replacement Patterns

The replacement string can include special patterns:

| Pattern | Inserts |
|---|---|
| `$$` | Literal `$` |
| `$&` | The matched substring |
| `` $` `` | The portion before the match |
| `$'` | The portion after the match |
| `$1`, `$2`, ... | Captured group contents |

```js
const str = "John Smith";
// Swap first and last name using capture groups
console.log(str.replace(/(\w+) (\w+)/, "$2, $1"));
// "Smith, John"

// Wrap matches in brackets
const text = "foo bar baz";
console.log(text.replace(/bar/, "[$&]"));
// "foo [bar] baz"
```

### Replacement with a Function

```js
const str = "hello world foo bar";
const result = str.replace(/\b\w/g, (match) => match.toUpperCase());
console.log(result); // "Hello World Foo Bar"

// More complex: template variable replacement
const template = "Hello, {name}! You have {count} messages.";
const data = { name: "Alice", count: 5 };
const filled = template.replace(/\{(\w+)\}/g, (match, key) => {
  return data[key] !== undefined ? data[key] : match;
});
console.log(filled); // "Hello, Alice! You have 5 messages."
```

---

## 11. Padding

### padStart(targetLength, padString?)

Pads the **beginning** of the string with `padString` until the string reaches `targetLength`.

```js
console.log("5".padStart(3, "0"));      // "005"
console.log("42".padStart(5, "0"));     // "00042"
console.log("Hello".padStart(10));      // "     Hello" (default pad is space)
console.log("Hello".padStart(3));       // "Hello" (already >= target length)
console.log("abc".padStart(8, "12345")); // "12345abc" (padString is truncated)
```

### padEnd(targetLength, padString?)

Pads the **end** of the string.

```js
console.log("5".padEnd(3, "0"));       // "500"
console.log("Hello".padEnd(10, "."));  // "Hello....."
console.log("Hello".padEnd(10));       // "Hello     "
```

### Practical Examples

```js
// Format numbers with leading zeros
function formatTime(hours, minutes, seconds) {
  return [hours, minutes, seconds]
    .map(n => String(n).padStart(2, "0"))
    .join(":");
}
console.log(formatTime(9, 5, 3)); // "09:05:03"

// Align console output
const items = [
  { name: "Apple", price: 1.5 },
  { name: "Banana", price: 0.75 },
  { name: "Cherry", price: 3.0 },
];
items.forEach(item => {
  const name = item.name.padEnd(10);
  const price = item.price.toFixed(2).padStart(6);
  console.log(`${name} $${price}`);
});
// Apple      $  1.50
// Banana     $  0.75
// Cherry     $  3.00

// Mask credit card number
function maskCard(number) {
  const last4 = number.slice(-4);
  return last4.padStart(number.length, "*");
}
console.log(maskCard("4111111111111111")); // "************1111"
```

---

## 12. Repeating and Other Methods

### repeat(count)

Returns a new string with the original string repeated `count` times.

```js
console.log("ha".repeat(3));    // "hahaha"
console.log("abc".repeat(0));   // ""
console.log("-".repeat(20));    // "--------------------"

// Practical: indentation
function indent(text, level) {
  return "  ".repeat(level) + text;
}
console.log(indent("Hello", 0)); // "Hello"
console.log(indent("Hello", 2)); // "    Hello"
console.log(indent("Hello", 4)); // "        Hello"
```

### at(index) (ES2022)

Returns the character at the given index, supporting negative indices.

```js
const str = "JavaScript";
console.log(str.at(0));   // "J"
console.log(str.at(4));   // "S"
console.log(str.at(-1));  // "t" (last character)
console.log(str.at(-4));  // "r"
```

### concat()

Concatenates strings. Rarely used -- the `+` operator or template literals are preferred.

```js
const str1 = "Hello";
const str2 = " World";
console.log(str1.concat(str2));               // "Hello World"
console.log(str1.concat(", ", "World", "!")); // "Hello, World!"

// Preferred alternatives:
console.log(str1 + str2);        // "Hello World"
console.log(`${str1}${str2}`);   // "Hello World"
```

### charCodeAt(index) and codePointAt(index)

```js
console.log("A".charCodeAt(0));     // 65
console.log("a".charCodeAt(0));     // 97
console.log("Z".charCodeAt(0));     // 90

// For characters outside the Basic Multilingual Plane, use codePointAt
console.log("A".codePointAt(0));    // 65 (same for BMP characters)
```

### String.fromCharCode() and String.fromCodePoint()

```js
console.log(String.fromCharCode(72, 101, 108, 108, 111)); // "Hello"
console.log(String.fromCodePoint(128512));                  // emoji (grinning face)
```

---

## 13. String Comparison

### Default Comparison (Lexicographic)

JavaScript compares strings **character by character** using their UTF-16 code unit values.

```js
console.log("a" > "b");      // false (97 > 98 is false)
console.log("b" > "a");      // true
console.log("abc" > "abd");  // false (first difference: 'c' < 'd')
console.log("abc" > "ab");   // true (longer string wins when prefix matches)

// Uppercase letters have LOWER code points than lowercase
console.log("a" > "Z");      // true (97 > 90)
console.log("Apple" > "apple"); // false (65 < 97)

// Numbers in strings
console.log("9" > "10");     // true! (compares "9" vs "1", since "9" > "1")
console.log("100" > "99");   // false! ("1" < "9")
```

### localeCompare(compareString, locales?, options?)

Compares strings according to **locale-specific** rules. Returns:
- Negative number if the string comes **before** `compareString`.
- `0` if they are equal.
- Positive number if the string comes **after** `compareString`.

```js
// Basic usage
console.log("a".localeCompare("b"));  // -1 (a comes before b)
console.log("b".localeCompare("a"));  // 1 (b comes after a)
console.log("a".localeCompare("a"));  // 0 (equal)

// Case-insensitive comparison
console.log("a".localeCompare("A", undefined, { sensitivity: "base" })); // 0

// Sorting with locale awareness
const cities = ["Zurich", "Aachen", "Orebro", "Berlin"];
cities.sort((a, b) => a.localeCompare(b));
console.log(cities); // ["Aachen", "Berlin", "Orebro", "Zurich"]

// Numeric sorting
const files = ["file10", "file2", "file1", "file20"];
files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
console.log(files); // ["file1", "file2", "file10", "file20"]
```

### localeCompare Options

| Option | Values | Description |
|---|---|---|
| `sensitivity` | `"base"`, `"accent"`, `"case"`, `"variant"` | How differences are handled |
| `numeric` | `true`, `false` | Whether to compare numeric substrings as numbers |
| `ignorePunctuation` | `true`, `false` | Whether to ignore punctuation |
| `caseFirst` | `"upper"`, `"lower"`, `"false"` | Whether upper or lower case sorts first |

```js
// sensitivity examples
// "base": a = A = a (with accent) = A (with accent)
// "accent": a = A, a (with accent) != A (with accent)
// "case": a != A, a (with accent) = A (with accent)
// "variant": a != A != a (with accent) != A (with accent) (most strict)

console.log("a".localeCompare("A", undefined, { sensitivity: "base" }));    // 0
console.log("a".localeCompare("A", undefined, { sensitivity: "variant" })); // -1
```

---

## String Methods Quick Reference

| Method | Returns | Description |
|---|---|---|
| `length` | Number | Number of UTF-16 code units |
| `charAt(i)` | String | Character at index |
| `at(i)` | String | Character at index (supports negative) |
| `indexOf(s)` | Number | First index of `s`, or `-1` |
| `lastIndexOf(s)` | Number | Last index of `s`, or `-1` |
| `includes(s)` | Boolean | Whether string contains `s` |
| `startsWith(s)` | Boolean | Whether string starts with `s` |
| `endsWith(s)` | Boolean | Whether string ends with `s` |
| `slice(start, end)` | String | Extract substring (supports negative indices) |
| `substring(start, end)` | String | Extract substring (swaps if start > end) |
| `toUpperCase()` | String | Convert to uppercase |
| `toLowerCase()` | String | Convert to lowercase |
| `trim()` | String | Remove leading/trailing whitespace |
| `trimStart()` | String | Remove leading whitespace |
| `trimEnd()` | String | Remove trailing whitespace |
| `split(sep)` | Array | Split into array by separator |
| `replace(s, r)` | String | Replace first match |
| `replaceAll(s, r)` | String | Replace all matches |
| `padStart(len, s)` | String | Pad start to target length |
| `padEnd(len, s)` | String | Pad end to target length |
| `repeat(n)` | String | Repeat string `n` times |
| `concat(s)` | String | Concatenate strings |
| `localeCompare(s)` | Number | Locale-aware comparison |
| `search(regex)` | Number | Search with regex, returns index |
| `match(regex)` | Array/null | Match against regex |
| `matchAll(regex)` | Iterator | All matches (requires `g` flag) |

---

## Summary

- Strings are **immutable** -- all methods return new strings.
- Use **template literals** for interpolation, multiline strings, and tagged templates.
- Prefer `slice()` over `substring()` and `substr()` for extracting substrings.
- Use `includes()`, `startsWith()`, and `endsWith()` for readable membership checks.
- Use `replaceAll()` when you need to replace every occurrence without regex.
- Use `localeCompare()` for culturally correct string sorting.
- Remember that string comparison is **lexicographic** by default, which can produce surprising results with mixed-case or numeric strings.
