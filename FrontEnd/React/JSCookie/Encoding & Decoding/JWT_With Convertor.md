# Encoding and Decoding in Terms of JWT (Base64) in React with js-cookie

## Introduction to Encoding and Decoding in JWT (Base64)
JWT (JSON Web Token) is a widely used authentication mechanism that encodes user information in a token format. JWTs are encoded using Base64 and consist of three parts:

- **Header**: Contains metadata about the token and the signing algorithm.
- **Payload**: Contains user information (claims) such as `userId` and `role`.
- **Signature**: Ensures the integrity of the token, created using a secret key.

A JWT looks like this:

```text
header.payload.signature
```

The **payload** and **header** are Base64-encoded strings, and the signature is generated using a cryptographic algorithm.

## How to Use `withConverter()` for JWT Handling in Cookies
Since JWTs are encoded in Base64, we can use `js-cookie` with a custom **read** and **write** converter to automatically encode and decode JWTs when storing and retrieving them in cookies.

### **Installation**
First, install the `js-cookie` package:

```sh
npm install js-cookie
```

Then, import it in your React component:

```js
import Cookies from 'js-cookie';
```

## **Encoding and Decoding JWT in Cookies**
We will use `withConverter()` to create a new cookie instance that automatically decodes JWTs when reading and encodes payloads into JWT format when setting.

### **Example: Storing and Retrieving JWTs Automatically**

```js
// Function to encode an object into a JWT-like Base64 token
const encodeJWT = (payload) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })); // Fake header
  const payloadEncoded = btoa(JSON.stringify(payload));
  return `${header}.${payloadEncoded}.signature-placeholder`; // Simulating a JWT
};

// Function to decode a JWT-like Base64 token into an object
const decodeJWT = (token) => {
  try {
    const payload = token.split('.')[1]; // Extract payload part
    return JSON.parse(atob(payload)); // Decode and parse JSON
  } catch (error) {
    return null; // Return null if decoding fails
  }
};

// Create a new cookie instance with JWT encoding/decoding
const jwtCookies = Cookies.withConverter({
  read: (value) => decodeJWT(value), // Decodes JWT when retrieving cookies
  write: (value) => encodeJWT(value) // Encodes payload into JWT when setting cookies
});

// Store user data as a JWT
jwtCookies.set('authToken', { userId: 123, role: 'admin' }, { expires: 7 });

// Retrieve and decode the JWT
const userData = jwtCookies.get('authToken');
console.log(userData); // { userId: 123, role: 'admin' }
```

## **Detailed Explanation of Execution Flow**

1️⃣ **Setting the JWT Cookie**
```js
jwtCookies.set('authToken', { userId: 123, role: 'admin' }, { expires: 7 });
```
- The **write function (`encodeJWT`)** converts `{ userId: 123, role: 'admin' }` into a **Base64-encoded JWT string**.
- The generated token is stored in the cookie:
  ```text
  authToken=eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ1c2VySWQiOiAxMjMsICJyb2xlIjogImFkbWluIn0.signature-placeholder;
  ```

2️⃣ **Retrieving and Decoding the JWT Cookie**
```js
const userData = jwtCookies.get('authToken');
```
- The **read function (`decodeJWT`)** extracts the payload part of the token and decodes it from Base64.
- It converts:
  ```text
  eyJ1c2VySWQiOiAxMjMsICJyb2xlIjogImFkbWluIn0 → { userId: 123, role: 'admin' }
  ```

3️⃣ **Console Output**
```js
console.log(userData);
```
📌 **Logs:**
```js
{ userId: 123, role: 'admin' }
```

## **What Does `withConverter()` Do in This Example?**
The `withConverter()` method:
- **Encodes payloads into JWT format** when setting cookies.
- **Decodes JWTs into objects** when retrieving cookies.
- Ensures **automatic JWT handling** without manually calling `JSON.parse()` or `btoa/atob`.

## **Why Use This Approach?**
✅ **Automatically encodes/decodes JWTs** when setting/retrieving cookies.  
✅ **Simplifies authentication management** in React.  
✅ **Prevents errors** by automatically handling Base64 encoding/decoding.  
✅ **Ensures a structured and secure format** for authentication tokens.

## **Common Use Cases**
✔ Storing **user authentication tokens** securely.  
✔ Automatically decoding **JWTs for authorization checks**.  
✔ Reducing manual parsing and encoding steps in authentication logic.  

## **Conclusion**
By using `js-cookie` with `withConverter()`, we can **seamlessly handle JWT encoding and decoding** in React applications. This approach ensures that tokens are stored in cookies in a structured format and can be retrieved in their decoded form without extra processing.

---
This guide provides a complete overview of handling JWTs in cookies using Base64 encoding/decoding with `js-cookie` in React.
