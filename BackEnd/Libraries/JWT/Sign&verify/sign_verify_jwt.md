
# Understanding `sign()` and `verify()` Methods in `jsonwebtoken`

## Introduction

The `jsonwebtoken` package provides two main methods for working with JSON Web Tokens (JWTs) in Node.js:

1. **`jwt.sign()`**: Used to create (or sign) a new JWT.
2. **`jwt.verify()`**: Used to verify the validity of a JWT and decode its payload.

This guide explains both methods in detail, including their syntax, return values, error handling, and practical examples.

---

## 1. `jwt.sign()`

### Purpose
The `jwt.sign()` method generates a new JWT by signing a payload using a secret key or a private key. This token can be sent to clients and used for authentication or authorization.

### Syntax

```javascript
jwt.sign(payload, secretOrPrivateKey, [options, callback])
```

- **`payload`**: An object or string containing the data you want to include in the token.
- **`secretOrPrivateKey`**: A string or buffer containing the secret key (for HMAC algorithms) or a private key (for RSA or ECDSA algorithms).
- **`options`** (optional): An object specifying additional options like token expiration, audience, etc.
- **`callback`** (optional): A function that is called asynchronously with the token if provided.

### Example

```javascript
const jwt = require("jsonwebtoken");

const payload = { userId: "12345", role: "admin" };
const secret = "mySecretKey";
const options = { expiresIn: "1h" }; // Token expires in 1 hour

// For a never expiring token dont include the expiresIn option
const token = jwt.sign(payload, secret, options);

console.log("Generated Token:", token);
```

#### Output
```
Generated Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYyODg0ODgwMCwiZXhwIjoxNjEyODUyNDAwfQ.4XrBpkIY2vXWQY_jzVhUQ6mjAOgYZpqVFpIq6HKVR-0
```

### Return Value

- The `jwt.sign()` method returns a **string**, which is the signed JWT.
- The JWT consists of three parts:
  1. **Header** (encoded in Base64)
  2. **Payload** (encoded in Base64)
  3. **Signature** (generated using the secret key)

---

### Options in `jwt.sign()`

The `options` parameter allows you to specify additional settings for the token:

1. **`expiresIn`**: Sets the token expiration time.
   - Example: `"1h"` (1 hour), `"2d"` (2 days), `"3600"` (3600 seconds).
2. **`issuer`**: Specifies the issuer of the token.
3. **`audience`**: Specifies the intended audience for the token.
4. **`subject`**: Specifies the subject of the token.
5. **`notBefore`**: Delays the validity of the token until a specified time.

Example with multiple options:

```javascript
const token = jwt.sign(payload, secret, {
  expiresIn: "2h",
  issuer: "myApp",
  audience: "myUsers",
});
```

---

## 2. `jwt.verify()`

### Purpose
The `jwt.verify()` method checks the validity of a JWT by verifying its signature and decoding its payload. This is typically used on the server to ensure that a token sent by a client is valid.

### Syntax

```javascript
jwt.verify(token, secretOrPublicKey, [options, callback])
```

- **`token`**: The JWT to be verified.
- **`secretOrPublicKey`**: The secret key or public key to verify the token’s signature.
- **`options`** (optional): An object specifying additional verification options.
- **`callback`** (optional): A function that is called asynchronously with the decoded payload if verification succeeds.

### Example

```javascript
const token = "your-jwt-token";

try {
  const decoded = jwt.verify(token, secret);
  console.log("Decoded Payload:", decoded);
} catch (err) {
  console.error("Token verification failed:", err.message);
}
```

### Return Value

- If the token is valid, `jwt.verify()` returns the **decoded payload**.
- If the token is invalid, expired, or tampered with, it throws an **error**.

#### Output (if valid token)
```
Decoded Payload: { userId: '12345', role: 'admin', iat: 1628848800, exp: 1628852400 }
```

---

### Error Handling in `jwt.verify()`

Common errors include:

1. **`TokenExpiredError`**: Thrown when the token has expired.
2. **`JsonWebTokenError`**: Thrown when the token is invalid (e.g., malformed or signed with a different secret).
3. **`NotBeforeError`**: Thrown when the token is used before its valid time (`nbf` claim).

Example:

```javascript
try {
  const decoded = jwt.verify(token, secret);
} catch (err) {
  if (err.name === "TokenExpiredError") {
    console.error("Token has expired");
  } else {
    console.error("Token verification failed:", err.message);
  }
}
```

---

## Practical Use Case

### Creating and Verifying Tokens in an Express App

```javascript
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

const secret = "mySecretKey";

// Route to create a token
app.post("/login", (req, res) => {
  const user = { id: "12345", role: "admin" };
  const token = jwt.sign(user, secret, { expiresIn: "1h" });
  res.json({ token });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};

// Middleware to verify if user is an admin based on token
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // Check if the Authorization header exists and starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from header

  try {
    const decoded = jwt.verify(token, secret); // Verify the token

    // Check if the user has an admin role
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    req.user = decoded; // Attach decoded payload to the request object
    next(); // Pass control to the next middleware or route handler
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Protected route
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

## Conclusion

The `jwt.sign()` and `jwt.verify()` methods are essential for working with JSON Web Tokens in Node.js applications. By using these methods, you can implement secure, stateless authentication and authorization systems.

---

## References

- [jsonwebtoken on npm](https://www.npmjs.com/package/jsonwebtoken)
- [JWT.io](https://jwt.io/)
