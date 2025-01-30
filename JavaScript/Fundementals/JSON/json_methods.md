# JSON in JavaScript

JSON (JavaScript Object Notation) is a lightweight data interchange format. It is used to store and exchange data, especially between a client and a server. JSON is easy to read and write and is supported by most programming languages.

## JSON Syntax
JSON is structured as key-value pairs, similar to JavaScript objects but with stricter syntax rules:

- Keys must be strings enclosed in double quotes (`""`).
- Values can be strings, numbers, objects, arrays, `true`, `false`, or `null`.
- JSON does not support functions or `undefined` values.

### Example JSON Data
```json
{
  "name": "John",
  "age": 30,
  "isStudent": false,
  "courses": ["Math", "Science"],
  "address": {
    "city": "New York",
    "zip": "10001"
  }
}
```

## JSON Methods in JavaScript
JavaScript provides built-in methods to work with JSON:

### 1. `JSON.stringify()`
Converts a JavaScript object or array into a JSON string.

#### Syntax:
```js
JSON.stringify(value, replacer, space)
```
- `value`: The object/array to convert.
- `replacer` (optional): A function or array to filter keys.
- `space` (optional): Number of spaces for formatting output.

#### Example:
```js
const person = { name: "Alice", age: 25, city: "London" };
const jsonString = JSON.stringify(person);
console.log(jsonString); // Output: '{"name":"Alice","age":25,"city":"London"}'
```

With formatting:
```js
const formattedJson = JSON.stringify(person, null, 2);
console.log(formattedJson);
```
Output:
```json
{
  "name": "Alice",
  "age": 25,
  "city": "London"
}
```

### 2. `JSON.parse()`
Converts a JSON string back into a JavaScript object.

#### Syntax:
```js
JSON.parse(text, reviver)
```
- `text`: The JSON string to parse.
- `reviver` (optional): A function to transform parsed values.

#### Example:
```js
const jsonString = '{"name":"Alice","age":25,"city":"London"}';
const personObject = JSON.parse(jsonString);
console.log(personObject.name); // Output: Alice
```

With a reviver function:
```js
const parsedData = JSON.parse(jsonString, (key, value) =>
  typeof value === "number" ? value * 2 : value
);
console.log(parsedData.age); // Output: 50
```

### 3. Handling Errors with `JSON.parse()`
If JSON is malformed, parsing will throw an error. It is good practice to use `try...catch`:

```js
const invalidJson = "{ name: 'John' }"; // Invalid due to missing quotes
try {
  JSON.parse(invalidJson);
} catch (error) {
  console.log("Invalid JSON:", error.message);
}
```

## JSON and Local Storage
JSON is commonly used with `localStorage` and `sessionStorage` in browsers.

### Example:
```js
const user = { username: "JohnDoe", score: 100 };
localStorage.setItem("user", JSON.stringify(user));
const storedUser = JSON.parse(localStorage.getItem("user"));
console.log(storedUser.username); // Output: JohnDoe
```

## Summary
| Method | Description |
|--------|-------------|
| `JSON.stringify(obj)` | Converts an object to a JSON string. |
| `JSON.parse(jsonString)` | Converts a JSON string into an object. |

JSON is widely used in APIs, configuration files, and data storage, making it a fundamental concept in JavaScript development.
