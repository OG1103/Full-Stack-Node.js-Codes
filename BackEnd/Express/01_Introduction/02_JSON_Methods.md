# JSON Object and Methods

## 1. What is JSON?

**JSON (JavaScript Object Notation)** is a lightweight data-interchange format that is easy for humans to read and write, and easy for machines to parse and generate. It is the standard format for data exchange in web APIs.

When an Express API sends data to a client or receives data from a client, the data is typically in JSON format.

---

## 2. JSON.stringify()

Converts a JavaScript value (object, array, etc.) to a JSON string.

### Syntax

```javascript
JSON.stringify(value, replacer, space);
```

- **value**: The JavaScript value to convert
- **replacer** (optional): A function or array to filter/transform properties
- **space** (optional): Number or string for indentation (pretty-printing)

### Basic Usage

```javascript
const user = { name: 'Alice', age: 25 };
const jsonString = JSON.stringify(user);
console.log(jsonString); // '{"name":"Alice","age":25}'
```

### With Indentation

```javascript
const user = { name: 'Alice', age: 25 };
const formatted = JSON.stringify(user, null, 2);
console.log(formatted);
// {
//   "name": "Alice",
//   "age": 25
// }
```

### With Replacer Function

```javascript
const user = { name: 'Alice', age: 25, password: 'secret123' };

// Filter out sensitive fields
const safe = JSON.stringify(user, (key, value) => {
  if (key === 'password') return undefined; // Exclude this field
  return value;
});

console.log(safe); // '{"name":"Alice","age":25}'
```

---

## 3. JSON.parse()

Converts a JSON string into a JavaScript object.

### Syntax

```javascript
JSON.parse(text, reviver);
```

- **text**: The JSON string to parse
- **reviver** (optional): A function to transform values during parsing

### Basic Usage

```javascript
const jsonString = '{"name":"Alice","age":25}';
const user = JSON.parse(jsonString);
console.log(user.name); // 'Alice'
console.log(user.age);  // 25
```

### With Reviver Function

```javascript
const jsonString = '{"name":"Alice","birthYear":1998}';
const user = JSON.parse(jsonString, (key, value) => {
  if (key === 'birthYear') return new Date().getFullYear() - value;
  return value;
});
console.log(user); // { name: 'Alice', birthYear: 28 }
```

---

## 4. Common Use Cases

### Sending Data to a Server

```javascript
const data = { username: 'Alice', score: 100 };
fetch('/api/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

### Storing Data in Local Storage

```javascript
const user = { name: 'Alice', age: 25 };

// Store
localStorage.setItem('user', JSON.stringify(user));

// Retrieve
const stored = JSON.parse(localStorage.getItem('user'));
console.log(stored.name); // 'Alice'
```

### Deep Copying an Object

```javascript
const original = { name: 'Alice', details: { age: 25, city: 'NYC' } };
const deepCopy = JSON.parse(JSON.stringify(original));

deepCopy.details.city = 'LA';
console.log(original.details.city); // 'NYC' (unchanged)
```

---

## 5. Limitations

### Unsupported Data Types

JSON does not support functions, `undefined`, `Symbol`, `Date` objects, `Map`, `Set`, or circular references.

```javascript
const obj = {
  name: 'Alice',
  greet: () => 'Hello',    // Function - will be dropped
  age: undefined,           // undefined - will be dropped
  date: new Date(),         // Date - becomes a string
};

console.log(JSON.stringify(obj));
// '{"name":"Alice","date":"2026-02-14T10:30:00.000Z"}'
```

### Large Number Precision Loss

```javascript
const data = { value: 123456789012345678901234567890n };
// BigInt values throw a TypeError with JSON.stringify
// Large regular numbers may lose precision
```

---

## 6. JSON in Express

Express provides built-in support for JSON:

```javascript
import express from 'express';
const app = express();

// Middleware: automatically parses JSON request bodies
// Sets req.body to the parsed JavaScript object
app.use(express.json());

app.post('/api/users', (req, res) => {
  // req.body is already a JavaScript object (parsed from JSON)
  const { name, email } = req.body;

  // res.json() automatically:
  // 1. Calls JSON.stringify() on the argument
  // 2. Sets Content-Type to application/json
  // 3. Sends the response
  res.json({ message: 'User created', name, email });
});
```

- `express.json()` calls `JSON.parse()` on incoming request bodies
- `res.json()` calls `JSON.stringify()` on the response data
