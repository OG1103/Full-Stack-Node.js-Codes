# JWT (JSON Web Token) — Overview

JWT is a compact, URL-safe token format used for authentication and information exchange. It allows the server to verify a user's identity without storing session data — the token itself contains all the necessary information.

---

## 1. Installation

```bash
npm install jsonwebtoken
```

---

## 2. What is a JWT?

A JWT is a string with three parts separated by dots:

```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjM0NSJ9.DGk4wsCHYj4FRVK8X6mN1WJjMeaP-FcSJJvJ6Wopk4o
|_________________________|.___________________________|._______________________________________|
        Header                      Payload                         Signature
```

### Header

```json
{
  "alg": "HS256",    // Signing algorithm
  "typ": "JWT"       // Token type
}
```

### Payload

```json
{
  "userId": "12345",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1696000000,     // Issued at (auto-added)
  "exp": 1696086400      // Expires at
}
```

The payload contains **claims** — pieces of information about the user. Common claims:

| Claim | Name | Description |
|-------|------|-------------|
| `iat` | Issued At | When the token was created (auto-added) |
| `exp` | Expiration | When the token expires |
| `sub` | Subject | Usually the user ID |
| `iss` | Issuer | Who created the token |

### Signature

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

The signature ensures the token hasn't been tampered with. It's created by hashing the header + payload with a **secret key**.

---

## 3. How JWT Authentication Works

```
1. User logs in with email + password
2. Server validates credentials
3. Server creates a JWT with user data and signs it with a secret
4. Server sends the JWT to the client
5. Client stores the JWT (usually in localStorage or a cookie)
6. Client sends the JWT in the Authorization header with each request
7. Server verifies the JWT signature and extracts user data
8. Server processes the request if the token is valid
```

### Why Stateless?

Traditional sessions store user data on the server. JWTs are **stateless** — the server doesn't store anything. All the data is in the token itself, and the server just verifies the signature.

---

## 4. JWT Secret and Lifetime

### Environment Variables

```
# .env
JWT_SECRET=a-very-long-random-string-at-least-32-characters
JWT_LIFETIME=7d
```

### Secret Key Guidelines

| Guideline | Detail |
|-----------|--------|
| Length | At least 32 characters |
| Content | Random alphanumeric string |
| Storage | Environment variable only (never in code) |
| Uniqueness | Different for each environment (dev, staging, prod) |

### Lifetime Options

| Value | Meaning |
|-------|---------|
| `'15m'` | 15 minutes |
| `'1h'` | 1 hour |
| `'7d'` | 7 days |
| `'30d'` | 30 days |
| `3600` | 3600 seconds (1 hour) |

---

## 5. Sign (Create a Token)

```javascript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: '12345', email: 'user@example.com' },  // Payload
  process.env.JWT_SECRET,                            // Secret key
  { expiresIn: '7d' }                               // Options
);

console.log(token);
// "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjM0NSJ9..."
```

### Sign Options

```javascript
jwt.sign(payload, secret, {
  expiresIn: '7d',          // Token lifetime
  algorithm: 'HS256',       // Signing algorithm (default)
  issuer: 'my-app',         // Optional: who issued the token
  subject: '12345',         // Optional: user ID
});
```

**Important:** Never put sensitive data (passwords, credit cards) in the payload. JWTs are **encoded**, not encrypted — anyone can decode and read the payload.

---

## 6. Verify (Validate a Token)

```javascript
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  // { userId: '12345', email: 'user@example.com', iat: 1696000000, exp: 1696604800 }
} catch (err) {
  console.log('Invalid token');
}
```

`jwt.verify()` does two things:
1. **Checks the signature** — ensures the token hasn't been tampered with
2. **Checks expiration** — ensures the token hasn't expired

### Common Errors

| Error | Cause |
|-------|-------|
| `JsonWebTokenError` | Invalid token or wrong secret |
| `TokenExpiredError` | Token has expired |
| `NotBeforeError` | Token not yet active (`nbf` claim) |

```javascript
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
} catch (err) {
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

---

## 7. Decode (Read Without Verifying)

```javascript
const decoded = jwt.decode(token);
console.log(decoded);
// { userId: '12345', email: 'user@example.com', iat: 1696000000, exp: 1696604800 }
```

**Warning:** `jwt.decode()` does **NOT** verify the signature. It just reads the payload. Never use it for authentication — always use `jwt.verify()`.

---

## 8. Summary

| Method | Purpose | Verifies Signature? |
|--------|---------|-------------------|
| `jwt.sign(payload, secret, options)` | Create a token | — |
| `jwt.verify(token, secret)` | Validate and decode a token | Yes |
| `jwt.decode(token)` | Read payload without validation | No |

### JWT vs Sessions

| Feature | JWT | Sessions |
|---------|-----|---------|
| Server storage | None (stateless) | Server-side (database/memory) |
| Scalability | Scales easily (no shared state) | Requires shared session store |
| Revocation | Difficult (token is self-contained) | Easy (delete from store) |
| Data location | In the token (client-side) | On the server |
| Best for | APIs, microservices, mobile apps | Traditional web apps |
