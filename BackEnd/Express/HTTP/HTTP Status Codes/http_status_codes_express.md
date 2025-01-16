
# **Using `http-status-codes` NPM Package**

The `http-status-codes` package provides a convenient way to work with HTTP status codes in a readable and maintainable manner. Instead of hardcoding status codes (e.g., `200`, `404`, `500`), you can use descriptive constants.

---

## **Installation**

To install the package, use the following command:

```bash
npm install http-status-codes
```

---

## **Importing in ES6 Syntax**

After installing the package, you can import it using ES6 syntax:

```javascript
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
```

- `StatusCodes`: Provides a set of constants for commonly used HTTP status codes.
- `getReasonPhrase()`: Returns the human-readable reason phrase for a given status code.

---

## **Usage Examples**

### **1. Using `StatusCodes` for Responses**

Instead of hardcoding status codes like `200` or `404`, use the constants provided by `StatusCodes`:

```javascript
import express from 'express';
import { StatusCodes } from 'http-status-codes';

const app = express();

app.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Welcome!' }); // 200 OK
});

app.get('/not-found', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ error: 'Resource not found' }); // 404 Not Found
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### **2. Using `getReasonPhrase()` to Get Reason Phrases**

You can use `getReasonPhrase()` to retrieve the standard reason phrase for a specific status code:

```javascript
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

const statusCode = StatusCodes.BAD_REQUEST; // 400
console.log(`Status: ${statusCode}, Reason: ${getReasonPhrase(statusCode)}`);
// Output: Status: 400, Reason: Bad Request
```

### **3. Handling Errors with `StatusCodes`**

Using `StatusCodes` improves code readability and maintainability when handling errors:

```javascript
import express from 'express';
import { StatusCodes } from 'http-status-codes';

const app = express();

app.get('/error', (req, res) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong' }); // 500 Internal Server Error
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

## **Available Constants in `StatusCodes`**

Here are some commonly used constants provided by `StatusCodes`:

| **Constant**                | **Value** | **Reason Phrase**       |
|-----------------------------|-----------|-------------------------|
| `StatusCodes.OK`            | `200`     | OK                      |
| `StatusCodes.CREATED`       | `201`     | Created                 |
| `StatusCodes.BAD_REQUEST`   | `400`     | Bad Request             |
| `StatusCodes.UNAUTHORIZED`  | `401`     | Unauthorized            |
| `StatusCodes.FORBIDDEN`     | `403`     | Forbidden               |
| `StatusCodes.NOT_FOUND`     | `404`     | Not Found               |
| `StatusCodes.INTERNAL_SERVER_ERROR` | `500` | Internal Server Error   |

For a full list of available status codes, refer to the [http-status-codes documentation](https://www.npmjs.com/package/http-status-codes).

---

## **Benefits of Using `http-status-codes`**

1. **Improved Readability**:
   - Instead of using magic numbers (e.g., `404`, `500`), you use descriptive constants like `StatusCodes.NOT_FOUND` and `StatusCodes.INTERNAL_SERVER_ERROR`.

2. **Easier Maintenance**:
   - When using constants, your code becomes self-explanatory and easier to maintain.

3. **Reduced Errors**:
   - Using predefined constants minimizes the chances of typos or incorrect status codes.

---

## **Summary**

- The `http-status-codes` package provides a set of constants and utility functions to handle HTTP status codes in a more readable and maintainable way.
- Use `StatusCodes` to refer to commonly used HTTP status codes.
- Use `getReasonPhrase()` to get the standard reason phrase for a specific status code.
- Always prefer using constants over hardcoding status codes for better code clarity.

---

## **References**

- [http-status-codes NPM Package](https://www.npmjs.com/package/http-status-codes)
- [Express.js Documentation](https://expressjs.com/en/guide/routing.html)
