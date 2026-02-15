# Crypto (Node.js Built-in)

The `crypto` module is built into Node.js — no installation needed. It provides cryptographic functions for generating random values, hashing data, and creating tokens.

---

## 1. Import

```javascript
import crypto from 'crypto';
```

No `npm install` required — `crypto` ships with Node.js.

---

## 2. Generating Random Bytes

`crypto.randomBytes()` generates cryptographically secure random data. It's commonly used to create tokens for password resets, email verification, API keys, etc.

### Async

```javascript
crypto.randomBytes(32, (err, buffer) => {
  if (err) throw err;
  const token = buffer.toString('hex');
  console.log(token);
  // "a3f5c8d9e1b2a4f6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9"
});
```

### Sync

```javascript
const token = crypto.randomBytes(32).toString('hex');
// 64-character hex string
```

### Common Output Formats

```javascript
const buffer = crypto.randomBytes(32);

buffer.toString('hex');     // Hexadecimal (most common for tokens)
buffer.toString('base64');  // Base64 (shorter, URL-safe with encoding)
buffer.toString('base64url'); // URL-safe Base64
```

| Byte Size | Hex Length | Use Case |
|-----------|-----------|----------|
| 16 | 32 chars | Short tokens |
| 32 | 64 chars | Password reset tokens (recommended) |
| 48 | 96 chars | API keys |
| 64 | 128 chars | High-security tokens |

---

## 3. Hashing Data

`crypto.createHash()` creates a one-way hash of data. Unlike bcrypt, this is for **non-password** data (tokens, file checksums, data integrity).

```javascript
const hash = crypto.createHash('sha256')
  .update('data to hash')
  .digest('hex');

console.log(hash);
// "a1b2c3d4..." (64-character hex string for sha256)
```

### Chain Breakdown

```javascript
crypto.createHash('sha256')   // Choose algorithm
  .update('data to hash')     // Provide data
  .digest('hex');              // Output format
```

### Available Algorithms

| Algorithm | Output Length | Use Case |
|-----------|-------------|----------|
| `sha256` | 64 hex chars | General hashing (recommended) |
| `sha512` | 128 hex chars | Higher security |
| `md5` | 32 hex chars | Checksums only (not secure) |

### Digest Formats

```javascript
.digest('hex');    // Hexadecimal string
.digest('base64'); // Base64 string
.digest();         // Raw Buffer
```

---

## 4. Practical Example: Password Reset Token

A common pattern — generate a random token, hash it for storage, and send the original to the user:

```javascript
import crypto from 'crypto';

// 1. Generate a random token
const resetToken = crypto.randomBytes(32).toString('hex');

// 2. Hash it for database storage (prevents token theft if DB is compromised)
const hashedToken = crypto.createHash('sha256')
  .update(resetToken)
  .digest('hex');

// 3. Save the HASHED token to the database
await User.findByIdAndUpdate(userId, {
  passwordResetToken: hashedToken,
  passwordResetExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
});

// 4. Send the UNHASHED token to the user (via email)
const resetURL = `https://myapp.com/reset-password?token=${resetToken}`;
```

### When the User Clicks the Reset Link

```javascript
// 1. Get the token from the URL
const { token } = req.query;

// 2. Hash it the same way
const hashedToken = crypto.createHash('sha256')
  .update(token)
  .digest('hex');

// 3. Find the user with the matching hashed token
const user = await User.findOne({
  passwordResetToken: hashedToken,
  passwordResetExpires: { $gt: Date.now() },  // Not expired
});

if (!user) {
  return res.status(400).json({ error: 'Invalid or expired token' });
}

// 4. Update password and clear the token
user.password = req.body.newPassword;
user.passwordResetToken = undefined;
user.passwordResetExpires = undefined;
await user.save();
```

### Why Hash the Token in the Database?

```
User receives:  "a3f5c8d9e1b2..."  (plain token in email link)
Database stores: "7d8e9f0a1b2c..."  (hashed version)
```

If the database is breached, attackers can't use the stored hashed tokens — they need the original token that was sent to the user's email.

---

## 5. Hashing vs Bcrypt

| Feature | `crypto.createHash()` | `bcrypt.hash()` |
|---------|----------------------|-----------------|
| Speed | Very fast | Intentionally slow |
| Salt | Not included | Built-in |
| Use for | Tokens, checksums, data integrity | Passwords |
| Brute-force resistant | No | Yes (configurable cost) |

**Rule:** Use `bcrypt` for passwords, `crypto` for everything else.

---

## 6. Other Useful Methods

### UUID-like Random IDs

```javascript
const id = crypto.randomUUID();
// "550e8400-e29b-41d4-a716-446655440000"
```

### HMAC (Hash-based Message Authentication Code)

```javascript
const hmac = crypto.createHmac('sha256', 'secret-key')
  .update('message')
  .digest('hex');
```

HMACs are used to verify both the integrity and authenticity of a message (e.g., webhook signature verification).

---

## 7. Summary

| Method | Purpose | Example Use |
|--------|---------|-------------|
| `crypto.randomBytes(size)` | Generate random data | Tokens, API keys |
| `crypto.createHash(algo)` | Hash data (one-way) | Token storage, checksums |
| `crypto.randomUUID()` | Generate UUID v4 | Unique identifiers |
| `crypto.createHmac(algo, key)` | Keyed hash (HMAC) | Webhook verification |

### Key Points

1. `crypto` is built into Node.js — no installation needed
2. Use `randomBytes()` for generating secure tokens
3. Use `createHash('sha256')` for hashing tokens before storing in the database
4. **Never use `crypto` for password hashing** — use `bcrypt` instead
5. Store the **hashed** token in the database, send the **plain** token to the user
