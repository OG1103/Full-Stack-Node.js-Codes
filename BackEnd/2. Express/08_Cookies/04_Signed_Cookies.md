# Signed Cookies

Signed cookies ensure the **integrity** of a cookie's value. Express adds a cryptographic signature (HMAC) so you can detect if the cookie has been tampered with by the client.

---

## 1. How Signed Cookies Work

1. Server sets a cookie with `signed: true`
2. Express appends an HMAC signature to the cookie value
3. Browser stores the cookie (value + signature)
4. On subsequent requests, Express verifies the signature
5. If the signature doesn't match (cookie was tampered with), the cookie is ignored

**Important:** Signed cookies are **not encrypted**. The value is still readable. Signing only protects against **tampering**, not **reading**.

---

## 2. Setup

Signed cookies require `cookie-parser` with a secret:

```bash
npm install cookie-parser
```

```javascript
import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

// Pass a secret string to cookie-parser
app.use(cookieParser('your-secret-key'));
```

The secret is used to generate and verify the HMAC signature. Use a strong, unique secret stored in environment variables.

---

## 3. Setting Signed Cookies

Use `res.cookie()` with `signed: true`:

```javascript
app.get('/set-cookie', (req, res) => {
  res.cookie('auth_token', 'user123', {
    signed: true,      // Sign this cookie
    httpOnly: true,     // Not accessible via JavaScript
    secure: true,       // HTTPS only
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  res.json({ message: 'Signed cookie set' });
});
```

---

## 4. Reading Signed Cookies

Signed cookies are accessed via `req.signedCookies` (not `req.cookies`):

```javascript
app.get('/read-cookie', (req, res) => {
  const token = req.signedCookies.auth_token;

  if (token) {
    res.json({ message: `Token: ${token}` });
  } else {
    res.json({ message: 'No valid signed cookie found' });
  }
});
```

### Where Cookies Appear

| Cookie Type | Access Via | When |
|-------------|-----------|------|
| Unsigned | `req.cookies` | Cookie set without `signed: true` |
| Signed (valid) | `req.signedCookies` | Cookie signature verified successfully |
| Signed (tampered) | Neither | Cookie was modified — `req.signedCookies` returns `false` |

---

## 5. Tamper Detection

If a client modifies the cookie value, the signature check fails:

```javascript
app.get('/check', (req, res) => {
  const value = req.signedCookies.auth_token;

  if (value === false) {
    // Signature verification failed - cookie was tampered with
    res.status(403).json({ error: 'Cookie tampered with' });
  } else if (value) {
    res.json({ token: value });
  } else {
    res.status(401).json({ error: 'No cookie found' });
  }
});
```

---

## 6. Complete Example

```javascript
import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));

// Set a signed cookie
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  // ... validate credentials ...

  res.cookie('session_id', 'abc123', {
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({ message: 'Logged in' });
});

// Read the signed cookie
app.get('/api/profile', (req, res) => {
  const sessionId = req.signedCookies.session_id;

  if (!sessionId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Look up session...
  res.json({ sessionId });
});

// Clear the signed cookie
app.post('/api/logout', (req, res) => {
  res.clearCookie('session_id');
  res.json({ message: 'Logged out' });
});

app.listen(3000);
```

---

## 7. Summary

| Feature | Signed Cookies | Unsigned Cookies |
|---------|---------------|-----------------|
| Tamper protection | Yes (HMAC signature) | No |
| Encryption | No (value is readable) | No |
| Access | `req.signedCookies` | `req.cookies` |
| Requires | `cookie-parser` with secret | `cookie-parser` |

### Best Practices

1. **Always use `httpOnly`** and **`secure`** for cookies with sensitive data
2. **Use a strong, unique secret** stored in environment variables
3. **Combine with `sameSite`** for CSRF protection
4. Signed cookies protect against **tampering**, not **reading** — encrypt values if confidentiality is needed
5. Use `req.signedCookies` (not `req.cookies`) to read signed cookies
