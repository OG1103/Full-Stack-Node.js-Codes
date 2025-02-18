# Using the `converter` Method in js-cookie with React

## Introduction to the `converter` Method
The `converter` method in `js-cookie` allows customization of how cookies are read and written. This is useful when dealing with encoded values, data transformations, or specific formatting requirements.

By default, cookies store data as strings, but with the `converter` method, we can transform values when setting or retrieving cookies.

## How to Use `converter` in React
To use the `converter` method, first, install the `js-cookie` package (if not already installed):

```sh
npm install js-cookie
```

Then, import it in your React component:

```js
import Cookies from 'js-cookie';
```

## Custom Read and Write Converters
The `converter` method can be used to define how values should be encoded when setting cookies and how they should be decoded when reading them.

## Using `withConverter()` in js-cookie
The `withConverter()` method creates a new `Cookies` instance with custom **read** and **write** functions. This is particularly useful when dealing with objects, encryption, or other transformations.

### Example: Storing and Retrieving JSON Data Automatically

```js
const customCookies = Cookies.withConverter({
  read: (value) => JSON.parse(value), // Converts stored string to object
  write: (value) => JSON.stringify(value) // Converts object to string before storing
});

// Store an object as a cookie
customCookies.set('user', { name: 'Alice', role: 'admin' }, { expires: 7 });

// Read and automatically parse the cookie
const userData = customCookies.get('user');
console.log(userData); // { name: 'Alice', role: 'admin' }
```

### Breakdown of Execution Flow
1️⃣ **Set the Cookie**
```js
customCookies.set('user', { name: 'Alice', role: 'admin' }, { expires: 7 });
```
- The `write` function (`JSON.stringify(value)`) converts `{ name: 'Alice', role: 'admin' }` into a JSON string before storing it.
- The cookie is stored as:
  ```text
  user={"name":"Alice","role":"admin"};
  ```

2️⃣ **Get the Cookie**
```js
const userData = customCookies.get('user');
// retrieves the value associated with the cookie 'user'. Since i'm using custom cookie this value will be passed to the read function in the custom cookie and processed in that function. Once the function finishes execution the processed value is stored in userData aka the processed value is the one return not the direct value of the cookie. 
```
- The **stored cookie value** (which is a string) is retrieved and passed through the `read` function (`JSON.parse(value)`).
- It converts:
  ```text
  "{"name":"Alice","role":"admin"}" → { name: 'Alice', role: 'admin' }
  ```

3️⃣ **Console Output**
```js
console.log(userData);
```
- The final processed value is returned and logged:
  ```js
  { name: 'Alice', role: 'admin' }
  ```

## What Does `withConverter()` Do?
The `withConverter()` method:
- **Creates a new `Cookies` instance** with custom **read** and **write** transformations.
- **Applies the `write` function** when setting cookies (e.g., converting an object to a JSON string).
- **Applies the `read` function** when retrieving cookies (e.g., parsing a JSON string back to an object).

## Why Use `withConverter()`?
✅ Automatically **encodes/decodes** complex data (like objects).  
✅ Avoids the need to manually use `JSON.parse()` and `JSON.stringify()`.  
✅ Ensures **consistent data formatting** across cookies.  

## Common Use Cases
✔ Storing and retrieving **JSON objects** instead of plain strings.  
✔ Custom **encryption** or **hashing** before saving sensitive data.  
✔ Handling **base64 encoding** for compact data storage.  

## Conclusion
Using `withConverter()` in `js-cookie` provides a powerful way to customize how cookies are stored and retrieved in React applications. By defining custom read and write functions, we can seamlessly store, retrieve, and process structured data like objects and arrays, making cookie management much more efficient.

---
This guide provides a complete overview of using the `converter` method in `js-cookie` within a React environment.
