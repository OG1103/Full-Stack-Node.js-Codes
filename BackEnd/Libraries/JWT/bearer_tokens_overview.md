
# Creating, Sending, and Comparing Bearer Tokens in Node.js

## Introduction

Bearer tokens are commonly used in modern web applications to provide secure, stateless authentication. A **Bearer token** is a type of token that can be sent in an HTTP header to verify the identity of the user making the request.

In this guide, we’ll cover:

1. How to create a Bearer token using the `jsonwebtoken` package.
2. How to send a Bearer token from the client.
3. How to compare and verify the Bearer token on the server.

---

## 1. Creating a Bearer Token

To create a Bearer token, we use the `jwt.sign()` method provided by the `jsonwebtoken` package.

```javascript
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  const payload = { userId: user.id, role: user.role };
  const secret = process.env.JWT_SECRET; // Use an environment variable for the secret
  const options = { expiresIn: "1h" };    // Token expires in 1 hour

  return jwt.sign(payload, secret, options);
};
```

### Explanation:

- **`payload`**: Contains the user’s data (e.g., `userId`, `role`). Only include non-sensitive information.
- **`secret`**: Used to sign the token and should be kept secure (e.g., in an environment variable).
- **`options`**: Additional settings like `expiresIn`, which defines how long the token is valid.

---

## 2. Sending a Bearer Token from the Client

Once the token is created, it needs to be sent with each request to protected routes. The token is typically sent in the `Authorization` header as a Bearer token.

### Example Request with Bearer Token

```javascript
const token = "your-generated-jwt-token";

fetch("https://api.example.com/protected", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((err) => console.error("Error:", err));
```

### Explanation:

- The `Authorization` header includes the token with the prefix `Bearer`.
- The server will extract and verify the token before granting access to the requested resource.

---

## 3. Comparing and Verifying Bearer Tokens on the Server

On the server, we verify the token using the `jwt.verify()` method provided by the `jsonwebtoken` package.

### Middleware for Verifying Bearer Tokens

```javascript
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from the header

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded payload to the request object
    next(); // Pass control to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};
```

### Explanation:

1. **Checking the Authorization Header**:
   - The middleware checks if the `Authorization` header is present and starts with `Bearer`.
   - If not, it returns a `401 Unauthorized` response.

2. **Extracting the Token**:
   - The token is extracted by splitting the header string at the space (`" "`).

3. **Verifying the Token**:
   - `jwt.verify()` is used to verify the token with the secret.
   - If the token is valid, the decoded payload is attached to the `req` object for use in subsequent middleware or route handlers.

4. **Error Handling**:
   - If verification fails, a `403 Forbidden` response is returned.

---

## 4. Example Route Using the Middleware

```javascript
app.get("/api/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Access granted", user: req.user });
});
```

### Explanation:

- The `verifyToken` middleware is applied to the `/api/protected` route.
- If the token is valid, the route handler sends a success response along with the decoded user information.

---

## Notes and Best Practices

1. **Use Strong Secrets**: Always use a strong, random secret for signing tokens and store it securely (e.g., in environment variables).
2. **Set Expiration Times**: Tokens should have a reasonable expiration time to limit their validity and reduce the risk of misuse.
3. **Use HTTPS**: Always use HTTPS to transmit tokens securely over the network.
4. **Handle Token Expiry Gracefully**: When a token expires, prompt the user to log in again or refresh the token using a refresh token mechanism.
5. **Do Not Store Tokens in Local Storage**: It’s safer to store tokens in **HTTP-only cookies** to prevent XSS attacks.

---

## Conclusion

Bearer tokens, combined with JWTs, provide a simple and stateless way to implement authentication in modern web applications. By understanding how to create, send, and verify tokens, you can build secure APIs that handle user authentication efficiently.

---

## References

- [jsonwebtoken on npm](https://www.npmjs.com/package/jsonwebtoken)
- [MDN: HTTP Authorization Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)
