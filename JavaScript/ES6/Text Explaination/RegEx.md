
# Basic Components of Regular Expressions

## 1. Delimiters
In JavaScript, a regex is defined between two slashes (/).

### Example:
```javascript
const regex = /pattern/;
```

---

## 2. Characters

### a) Literal Characters
Characters that match themselves.

### Example:
```javascript
const regex = /abc/;
console.log(regex.test("abc")); // Output: true
```

### b) Metacharacters
Special characters that have specific meanings:

- **`.`**: Matches any single character except newline.

- **`^`**: Matches the start of a string.

- **`$`**: Matches the end of a string.

- **`*`**: Matches zero or more occurrences of the preceding element.

- **`+`**: Matches one or more occurrences of the preceding element.

- **`?`**: Matches zero or one occurrence of the preceding element.

- **`{n}`**: Matches exactly **n** occurrences of the preceding element.

- **`{n,}`**: Matches **n** or more occurrences of the preceding element.

- **`{n,m}`**: Matches between **n** and **m** occurrences of the preceding element.

---

## 3. Character Classes
Character classes are defined using square brackets `[]` and match any one of the enclosed characters.

### Examples:
- `/[abc]/`: Matches any single `"a"`, `"b"`, or `"c"`.

- `/[a-z]/`: Matches any lowercase letter.

---

## 4. Negated Character Classes
Negated character classes are defined using `[^...]`. They match any character not listed inside the brackets.

### Example:
```javascript
const regex = /[^abc]/;
console.log(regex.test("d")); // Output: true
```

---

## 5. Groups and Ranges

### a) Grouping
Parentheses `()` can group patterns together.

### Example:
```javascript
const regex = /(abc)+/;
console.log(regex.test("abcabc")); // Output: true
```

### b) Alternation
The pipe symbol `|` allows you to specify alternatives.

### Example:
```javascript
const regex = /cat|dog/;
console.log(regex.test("cat")); // Output: true
console.log(regex.test("dog")); // Output: true
```

---

## 6. Modifiers (Flags)
Modifiers change the way the regex is interpreted:

- **`i`**: Case-insensitive matching.

- **`g`**: Global search (find all matches rather than stopping after the first).

- **`m`**: Multiline matching.

### Example:
```javascript
const regex = /hello/i;
console.log(regex.test("Hello")); // Output: true
```

