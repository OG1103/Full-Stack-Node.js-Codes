# JWT Authentication Flow

This guide covers the complete JWT authentication flow — from login to protected routes, including the access + refresh token pattern.

---

## 1. Basic Flow (Single Token)

```
1. POST /api/login  →  { email, password }
2. Server validates credentials
3. Server signs a JWT  →  { userId, email }
4. Server sends token to client
5. Client stores token (localStorage or cookie)
6. Client sends token in Authorization header
7. Server verifies token in middleware
8. Protected route processes the request
```

---

## 2. Login Route

```javascript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Find the user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // 2. Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // 3. Create JWT
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME || '7d' }
  );

  // 4. Send token
  res.json({ token, user: { id: user._id, email: user.email } });
};
```

---

## 3. Auth Middleware

Extract and verify the token from the `Authorization` header:

```javascript
import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // 1. Get the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // 2. Extract the token (remove "Bearer ")
  const token = authHeader.split(' ')[1];

  // 3. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach user data to the request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authMiddleware;
```

### The Authorization Header Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOi...
               ^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
               Prefix  Token
```

---

## 4. Protected Routes

```javascript
import authMiddleware from '../middleware/auth.js';

// Apply to specific routes
app.get('/api/profile', authMiddleware, (req, res) => {
  // req.user contains the decoded token payload
  res.json({ userId: req.user.userId, email: req.user.email });
});

// Apply to all routes in a router
const router = express.Router();
router.use(authMiddleware);  // All routes below require auth
router.get('/dashboard', getDashboard);
router.put('/settings', updateSettings);
```

---

## 5. Client-Side: Sending the Token

### Using Axios

```javascript
import axios from 'axios';

// Option 1: Per-request
const response = await axios.get('http://localhost:5000/api/profile', {
  headers: { Authorization: `Bearer ${token}` },
});

// Option 2: Axios instance with interceptor (recommended)
const api = axios.create({ baseURL: 'http://localhost:5000' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const response = await api.get('/api/profile');
```

### Using Fetch

```javascript
const response = await fetch('http://localhost:5000/api/profile', {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

---

## 6. Token Storage Options

| Storage | Pros | Cons |
|---------|------|------|
| `localStorage` | Easy to use, persists across tabs | Vulnerable to XSS attacks |
| `httpOnly` cookie | Not accessible via JS (XSS safe) | Requires CORS + cookie config |
| Memory (variable) | Most secure | Lost on page refresh |

### Storing in localStorage

```javascript
// Save
localStorage.setItem('token', token);

// Read
const token = localStorage.getItem('token');

// Remove (logout)
localStorage.removeItem('token');
```

### Storing in httpOnly Cookie

```javascript
// Server sets the cookie
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

// Server reads the cookie
const token = req.cookies.token;
```

---

## 7. Access + Refresh Token Pattern

For better security, use short-lived **access tokens** and long-lived **refresh tokens**:

```
Access Token:  Short-lived (15 min) — used for API requests
Refresh Token: Long-lived (7 days) — used only to get new access tokens
```

### Login (Issue Both Tokens)

```javascript
const login = async (req, res) => {
  // ... validate credentials ...

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  // Store refresh token in httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
};
```

### Refresh Route (Get New Access Token)

```javascript
const refresh = (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
};
```

### Client-Side: Auto-Refresh with Axios Interceptor

```javascript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Get new access token
      const { data } = await axios.post('/api/refresh', null, {
        withCredentials: true,
      });

      // Update stored token
      localStorage.setItem('token', data.accessToken);

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);
```

### The Flow

```
1. Client sends request with access token
2. Access token expired → Server returns 401
3. Client calls /api/refresh with refresh token (cookie)
4. Server verifies refresh token → Issues new access token
5. Client retries original request with new access token
```

---

## 8. Logout

```javascript
// Server
const logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};

// Client
localStorage.removeItem('token');
```

---

## 9. Complete Example

```javascript
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser());

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Login
app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.json({ token });
});

// Protected route
app.get('/api/profile', auth, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.json({ user });
});

app.listen(5000);
```

---

## 10. Summary

| Step | Action | Who |
|------|--------|-----|
| Login | Sign JWT with user data | Server |
| Store token | Save in localStorage or cookie | Client |
| Send token | `Authorization: Bearer <token>` | Client |
| Verify token | `jwt.verify()` in middleware | Server |
| Access `req.user` | Decoded payload available | Server |
| Refresh | Exchange refresh token for new access token | Both |
| Logout | Clear tokens (cookie + localStorage) | Both |
