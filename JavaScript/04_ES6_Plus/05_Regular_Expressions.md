# JavaScript Regular Expressions (RegEx)

Regular expressions are patterns used to match character combinations in strings. They are powerful tools for searching, validating, and manipulating text.

---

## 1. Creating Regular Expressions

### Literal Syntax (Most Common)

```javascript
const regex = /pattern/flags;
```

### Constructor Syntax

```javascript
const regex = new RegExp("pattern", "flags");

// Useful when pattern is dynamic
const searchTerm = "hello";
const dynamicRegex = new RegExp(searchTerm, "gi");
```

---

## 2. Flags (Modifiers)

| Flag | Name | Description |
|------|------|-------------|
| `i` | Case-insensitive | Matches regardless of case |
| `g` | Global | Finds all matches, not just the first |
| `m` | Multiline | `^` and `$` match start/end of each line |
| `s` | DotAll | `.` matches newline characters too |
| `u` | Unicode | Enables full Unicode support |
| `y` | Sticky | Matches only from `lastIndex` position |

```javascript
/hello/i.test("Hello World");  // true (case-insensitive)
"hello hello".match(/hello/g); // ["hello", "hello"] (global)
```

---

## 3. Metacharacters

Special characters with specific meanings:

| Character | Meaning | Example |
|-----------|---------|---------|
| `.` | Any character except newline | `/h.t/` matches "hat", "hit", "hot" |
| `^` | Start of string (or line with `m`) | `/^Hello/` matches "Hello world" |
| `$` | End of string (or line with `m`) | `/world$/` matches "Hello world" |
| `\` | Escape special character | `/\./` matches a literal dot |
| `\|` | Alternation (OR) | `/cat\|dog/` matches "cat" or "dog" |

```javascript
/^Hello$/.test("Hello");       // true (exact match)
/^Hello$/.test("Hello World"); // false
/h.t/.test("hat");             // true
/h.t/.test("ht");              // false (. needs exactly one char)
```

---

## 4. Character Classes

Define a set of characters to match.

| Pattern | Meaning |
|---------|---------|
| `[abc]` | Any one of a, b, or c |
| `[a-z]` | Any lowercase letter |
| `[A-Z]` | Any uppercase letter |
| `[0-9]` | Any digit |
| `[a-zA-Z0-9]` | Any alphanumeric character |
| `[^abc]` | Any character NOT a, b, or c (negation) |

```javascript
/[aeiou]/.test("hello");  // true (contains a vowel)
/[^0-9]/.test("abc123");  // true (contains non-digit characters)
/[a-z]/.test("Hello");    // true (contains lowercase)
```

### Predefined Character Classes (Shorthand)

| Shorthand | Equivalent | Meaning |
|-----------|-----------|---------|
| `\d` | `[0-9]` | Any digit |
| `\D` | `[^0-9]` | Any non-digit |
| `\w` | `[a-zA-Z0-9_]` | Any word character |
| `\W` | `[^a-zA-Z0-9_]` | Any non-word character |
| `\s` | `[ \t\n\r\f\v]` | Any whitespace |
| `\S` | `[^ \t\n\r\f\v]` | Any non-whitespace |
| `\b` | - | Word boundary |
| `\B` | - | Non-word boundary |

```javascript
/\d{3}/.test("abc123");        // true (3 consecutive digits)
/\w+@\w+\.\w+/.test("a@b.c"); // true (simple email pattern)
/\bword\b/.test("a word here"); // true (whole word match)
/\bword\b/.test("sword");      // false (not a whole word)
```

---

## 5. Quantifiers

Control how many times a pattern should match.

| Quantifier | Meaning | Example |
|-----------|---------|---------|
| `*` | 0 or more | `/ab*c/` matches "ac", "abc", "abbc" |
| `+` | 1 or more | `/ab+c/` matches "abc", "abbc" (not "ac") |
| `?` | 0 or 1 (optional) | `/colou?r/` matches "color" and "colour" |
| `{n}` | Exactly n times | `/\d{4}/` matches "2024" |
| `{n,}` | n or more times | `/\d{2,}/` matches "12", "123", "1234" |
| `{n,m}` | Between n and m times | `/\d{2,4}/` matches "12", "123", "1234" |

```javascript
/go*gle/.test("ggle");     // true (* = 0 or more o's)
/go+gle/.test("ggle");     // false (+ = 1 or more o's)
/go+gle/.test("google");   // true
/https?:\/\//.test("http://"); // true (s is optional)
```

### Greedy vs Lazy Matching

By default, quantifiers are **greedy** (match as much as possible). Add `?` to make them **lazy** (match as little as possible).

```javascript
const html = "<div>Hello</div><div>World</div>";

// Greedy (default) - matches as much as possible
html.match(/<div>.*<\/div>/);    // "<div>Hello</div><div>World</div>"

// Lazy - matches as little as possible
html.match(/<div>.*?<\/div>/);   // "<div>Hello</div>"
html.match(/<div>.*?<\/div>/g);  // ["<div>Hello</div>", "<div>World</div>"]
```

---

## 6. Groups and Capturing

### Capturing Groups `()`

Parentheses create groups that capture matched content.

```javascript
const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
const match = "2024-01-15".match(dateRegex);

console.log(match[0]); // "2024-01-15" (full match)
console.log(match[1]); // "2024" (first group)
console.log(match[2]); // "01" (second group)
console.log(match[3]); // "15" (third group)
```

### Named Capturing Groups

```javascript
const dateRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = "2024-01-15".match(dateRegex);

console.log(match.groups.year);  // "2024"
console.log(match.groups.month); // "01"
console.log(match.groups.day);   // "15"
```

### Non-Capturing Groups `(?:)`

Group patterns without capturing them.

```javascript
// Capturing: /(https?):\/\//  → captures "http" or "https"
// Non-capturing: /(?:https?):\/\//  → groups but doesn't capture
const url = "https://example.com";
url.match(/(?:https?):\/\/(.+)/);
// match[1] = "example.com" (only the domain is captured)
```

### Alternation `|`

```javascript
/cat|dog/.test("I have a cat");  // true
/cat|dog/.test("I have a dog");  // true

// Group alternation
/(mon|tues|wednes|thurs|fri|satur|sun)day/;
```

### Backreferences

Reference a previously captured group within the same regex.

```javascript
// Match repeated words
/(\w+)\s\1/.test("the the");   // true (\1 references first capture)
/(\w+)\s\1/.test("the dog");   // false

// Named backreference
/(?<word>\w+)\s\k<word>/.test("the the"); // true
```

---

## 7. Lookahead and Lookbehind

Assert that a pattern exists (or doesn't exist) before or after the current position, without including it in the match.

| Type | Syntax | Meaning |
|------|--------|---------|
| Positive lookahead | `(?=...)` | Followed by... |
| Negative lookahead | `(?!...)` | NOT followed by... |
| Positive lookbehind | `(?<=...)` | Preceded by... |
| Negative lookbehind | `(?<!...)` | NOT preceded by... |

```javascript
// Positive lookahead: match number followed by "px"
"12px 5em 30px".match(/\d+(?=px)/g); // ["12", "30"]

// Negative lookahead: match number NOT followed by "px"
"12px 5em 30px".match(/\d+(?!px)/g); // ["1", "5", "3"]

// Positive lookbehind: match number preceded by "$"
"$100 200 $300".match(/(?<=\$)\d+/g); // ["100", "300"]

// Negative lookbehind: match number NOT preceded by "$"
"$100 200 $300".match(/(?<!\$)\d+/g); // ["00", "200", "00"]
```

---

## 8. JavaScript RegEx Methods

### `test()` - Returns Boolean

```javascript
const regex = /hello/i;
regex.test("Hello World"); // true
regex.test("Goodbye");     // false
```

### `exec()` - Returns Match Details

```javascript
const regex = /(\d{4})-(\d{2})-(\d{2})/;
const result = regex.exec("Date: 2024-01-15");

console.log(result[0]);     // "2024-01-15" (full match)
console.log(result[1]);     // "2024" (first group)
console.log(result.index);  // 6 (start position)
console.log(result.input);  // "Date: 2024-01-15"
```

### String Methods with RegEx

```javascript
const str = "Hello World, hello JavaScript";

// match() - find matches
str.match(/hello/gi);         // ["Hello", "hello"]

// matchAll() - iterator with details (requires g flag)
for (let match of str.matchAll(/hello/gi)) {
  console.log(match.index, match[0]);
}
// 0 "Hello"
// 13 "hello"

// search() - find index of first match
str.search(/world/i);         // 6

// replace() - replace first match
str.replace(/hello/i, "Hi");  // "Hi World, hello JavaScript"

// replaceAll() - replace all matches
str.replaceAll(/hello/gi, "Hi"); // "Hi World, Hi JavaScript"

// split() - split by pattern
"one, two,  three".split(/,\s*/); // ["one", "two", "three"]
```

---

## 9. Common Regex Patterns

### Email Validation

```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
emailRegex.test("user@example.com");  // true
emailRegex.test("invalid@.com");      // false
```

### Phone Number

```javascript
// US format: (123) 456-7890 or 123-456-7890
const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
phoneRegex.test("(123) 456-7890");  // true
phoneRegex.test("123-456-7890");    // true
```

### URL Validation

```javascript
const urlRegex = /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
urlRegex.test("https://example.com/path?q=1");  // true
```

### Password Strength

```javascript
// At least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
strongPassword.test("MyP@ss1!");  // true
strongPassword.test("weakpass");  // false
```

### Extract Numbers from String

```javascript
"Price: $49.99, Qty: 3".match(/\d+\.?\d*/g);
// ["49.99", "3"]
```

### Remove Extra Whitespace

```javascript
"  hello   world  ".replace(/\s+/g, " ").trim();
// "hello world"
```

---

## 10. Summary

| Concept | Syntax | Example |
|---------|--------|---------|
| Literal | `/pattern/flags` | `/hello/gi` |
| Character class | `[abc]` | `/[aeiou]/` |
| Negated class | `[^abc]` | `/[^0-9]/` |
| Any digit | `\d` | `/\d{3}/` |
| Any word char | `\w` | `/\w+/` |
| Any whitespace | `\s` | `/\s+/` |
| Word boundary | `\b` | `/\bword\b/` |
| 0 or more | `*` | `/ab*c/` |
| 1 or more | `+` | `/ab+c/` |
| Optional | `?` | `/colou?r/` |
| Exact count | `{n}` | `/\d{4}/` |
| Range | `{n,m}` | `/\d{2,4}/` |
| Capture group | `(...)` | `/(\d+)-(\d+)/` |
| Named group | `(?<name>...)` | `/(?<year>\d{4})/` |
| Non-capture | `(?:...)` | `/(?:https?)/` |
| Lookahead | `(?=...)` | `/\d+(?=px)/` |
| Lookbehind | `(?<=...)` | `/(?<=\$)\d+/` |
| Alternation | `a\|b` | `/cat\|dog/` |
