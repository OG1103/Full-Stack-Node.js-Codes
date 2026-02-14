# Cookies Basics

## Table of Contents

1. [What Are Cookies](#what-are-cookies)
2. [How Cookies Work (Set-Cookie / Cookie Headers)](#how-cookies-work)
3. [Setting Cookies with res.cookie()](#setting-cookies-with-rescookie)
4. [Cookie Options In-Depth](#cookie-options-in-depth)
5. [Reading Cookies with req.cookies](#reading-cookies-with-reqcookies)
6. [Clearing Cookies with res.clearCookie()](#clearing-cookies-with-resclearcookie)
7. [Cookie Lifecycle](#cookie-lifecycle)
8. [httpOnly vs Frontend-Accessible Cookies](#httponly-vs-frontend-accessible-cookies)
9. [Cookie Flow Between Backend and Frontend](#cookie-flow-between-backend-and-frontend)
10. [Best Practices](#best-practices)

---

## What Are Cookies

Cookies are small pieces of data (key-value pairs) that a **server sends to the client's browser**. The browser then **automatically stores** these cookies and **sends them back** with every subsequent request to the same server.

They are the primary mechanism for maintaining state in the otherwise stateless HTTP protocol.

**Common use cases:**

- Session management (login tokens, shopping carts)
- User preferences (theme, language)
- Tracking and analytics

**Key characteristics:**

- Maximum size of approximately 4KB per cookie
- Browsers typically allow around 50 cookies per domain
- Stored on the client side (in the browser)
- Automatically attached to requests by the browser

---

## How Cookies Work

The entire cookie mechanism relies on two HTTP headers: `Set-Cookie` (response) and `Cookie` (request).

### Step 1: Server Sets the Cookie

When the server wants to store data on the client, it includes a `Set-Cookie` header in the HTTP response:

```
HTTP/1.1 200 OK
Set-Cookie: userId=abc123; HttpOnly; Secure; Max-Age=86400
Content-Type: application/json
```

### Step 2: Browser Stores the Cookie

The browser receives the response, reads the `Set-Cookie` header, and stores the cookie locally according to the options specified.

### Step 3: Browser Sends the Cookie Back

On every subsequent request to the same domain, the browser automatically includes all matching cookies in the `Cookie` header:

```
GET /dashboard HTTP/1.1
Host: example.com
Cookie: userId=abc123
```

### Visual Flow

```
FIRST REQUEST (no cookies yet):
Client  ------>  GET /login  ------>  Server
Client  <------  Set-Cookie: token=xyz  <------  Server

SUBSEQUENT REQUESTS (cookies sent automatically):
Client  ------>  GET /dashboard  ------>  Server
                 Cookie: token=xyz
Client  <------  200 OK  <------  Server
```

---

## Setting Cookies with res.cookie()

Express provides `res.cookie()` as a convenient method to set the `Set-Cookie` header.

### Syntax

```javascript
res.cookie(name, value, [options]);
```

### Basic Example

```javascript
import express from "express";

const app = express();

app.get("/set-cookie", (req, res) => {
  // Simple cookie
  res.cookie("username", "john_doe");

  // Cookie with options
  res.cookie("sessionId", "s3cr3t-s3ss10n-1d", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });

  res.json({ message: "Cookies have been set" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### Setting Multiple Cookies

Each call to `res.cookie()` adds another `Set-Cookie` header to the response. You can set multiple cookies in one response:

```javascript
app.get("/login", (req, res) => {
  res.cookie("accessToken", "eyJhbGciOi...", {
    httpOnly: true,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("theme", "dark", {
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  });

  res.cookie("language", "en");

  res.json({ message: "Logged in" });
});
```

---

## Cookie Options In-Depth

The options object controls cookie behavior, security, and scope.

### httpOnly

```javascript
res.cookie("token", "abc123", { httpOnly: true });
```

- **Type:** `boolean`
- **Default:** `false`
- When set to `true`, the cookie is **not accessible** via JavaScript in the browser (`document.cookie` will not include it).
- The cookie is only sent with HTTP requests to the server.
- **Primary defense against XSS attacks** -- even if an attacker injects a script, they cannot read the cookie.

### secure

```javascript
res.cookie("token", "abc123", { secure: true });
```

- **Type:** `boolean`
- **Default:** `false`
- When set to `true`, the cookie is **only sent over HTTPS** connections.
- The browser will refuse to send this cookie over plain HTTP.
- **Always use in production.** In development, you may need to set it to `false` since `localhost` often uses HTTP (though modern browsers treat `localhost` as a secure context).

### sameSite

```javascript
res.cookie("token", "abc123", { sameSite: "strict" });
```

- **Type:** `"strict"` | `"lax"` | `"none"`
- **Default:** `"lax"` (in most modern browsers)
- Controls whether the cookie is sent with cross-site requests.

| Value      | Behavior                                                                 |
| ---------- | ------------------------------------------------------------------------ |
| `"strict"` | Cookie is **never** sent with cross-site requests                        |
| `"lax"`    | Cookie is sent with top-level navigations (GET) but not with POST/fetch  |
| `"none"`   | Cookie is sent with **all** cross-site requests (requires `secure: true`)|

### maxAge

```javascript
res.cookie("token", "abc123", { maxAge: 3600000 }); // 1 hour
```

- **Type:** `number` (milliseconds)
- Sets the cookie's lifetime **relative to the current time**.
- The browser calculates the expiration from the moment the cookie is received.
- After the duration elapses, the browser automatically deletes the cookie.
- Takes precedence over `expires` if both are set.

### expires

```javascript
res.cookie("token", "abc123", {
  expires: new Date(Date.now() + 3600000), // 1 hour from now
});
```

- **Type:** `Date` object
- Sets an **absolute expiration date** for the cookie.
- If not set (and `maxAge` is also not set), the cookie becomes a **session cookie** -- it is deleted when the browser is closed.
- `maxAge` is generally preferred because it is simpler and avoids timezone issues.

### path

```javascript
res.cookie("token", "abc123", { path: "/api" });
```

- **Type:** `string`
- **Default:** `"/"`
- Defines the **URL path scope** where the cookie is valid.
- The browser **only sends the cookie** for requests whose path starts with this value.

**Detailed explanation:**

| `path` Value | Cookie Sent For               | Cookie NOT Sent For    |
| ------------ | ----------------------------- | ---------------------- |
| `"/"`        | All routes on the domain      | (none -- sent for all) |
| `"/api"`     | `/api`, `/api/users`, `/api/orders` | `/`, `/dashboard`, `/login` |
| `"/api/v1"`  | `/api/v1`, `/api/v1/users`    | `/api`, `/api/v2`      |

**Example use case:**

```javascript
// This cookie is only relevant for API routes
res.cookie("apiToken", "xyz", { path: "/api" });

// This cookie is only for admin routes
res.cookie("adminSession", "abc", { path: "/admin" });

// This cookie is available everywhere (default)
res.cookie("theme", "dark", { path: "/" });
```

**Important:** When clearing a cookie, you **must specify the same path** that was used when setting it. Otherwise, the browser will not match and remove the correct cookie.

### domain

```javascript
res.cookie("token", "abc123", { domain: ".example.com" });
```

- **Type:** `string`
- **Default:** The domain of the current request (without subdomains)
- Specifies **which domain(s)** can receive the cookie.
- A leading dot (`.example.com`) means the cookie is available to the domain and **all its subdomains** (`api.example.com`, `www.example.com`, etc.).
- Without a leading dot, only the exact domain receives the cookie.

**Example:**

```javascript
// Cookie available to example.com AND all subdomains
res.cookie("sharedSession", "abc", { domain: ".example.com" });

// Cookie only for the specific subdomain that set it (default behavior)
res.cookie("localToken", "xyz");
```

### Complete Options Reference

```javascript
res.cookie("token", "value", {
  httpOnly: true,                          // Not accessible via document.cookie
  secure: true,                            // HTTPS only
  sameSite: "strict",                      // No cross-site sending
  maxAge: 7 * 24 * 60 * 60 * 1000,        // 7 days in milliseconds
  expires: new Date("2025-12-31"),         // Absolute expiry (maxAge preferred)
  path: "/",                               // URL scope
  domain: ".example.com",                  // Domain scope
  signed: true,                            // Requires cookie-parser with secret
});
```

---

## Reading Cookies with req.cookies

To read cookies sent by the client, you need the `cookie-parser` middleware.

### Installation

```bash
npm install cookie-parser
```

### Setup

```javascript
import express from "express";
import cookieParser from "cookie-parser";

const app = express();

// Attach cookie-parser middleware
app.use(cookieParser());
```

### Reading Cookies

Once `cookie-parser` is configured, all cookies from the `Cookie` header are parsed into `req.cookies` as a plain JavaScript object:

```javascript
app.get("/profile", (req, res) => {
  console.log(req.cookies);
  // Output: { username: "john_doe", theme: "dark", sessionId: "s3cr3t..." }

  const { username, theme } = req.cookies;

  if (!username) {
    return res.status(401).json({ message: "No username cookie found" });
  }

  res.json({ username, theme });
});
```

### Without cookie-parser

Without the middleware, `req.cookies` is `undefined`. You would have to manually parse the `Cookie` header:

```javascript
// Manual parsing (not recommended -- use cookie-parser instead)
app.get("/manual", (req, res) => {
  const cookieHeader = req.headers.cookie; // "username=john_doe; theme=dark"

  const cookies = {};
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      cookies[name] = decodeURIComponent(value);
    });
  }

  res.json({ cookies });
});
```

---

## Clearing Cookies with res.clearCookie()

To delete a cookie, use `res.clearCookie()`. This tells the browser to remove the cookie by setting its expiration to a past date.

### Syntax

```javascript
res.clearCookie(name, [options]);
```

### Important Rule

**You must pass the same `path` and `domain` options that were used when setting the cookie.** The browser identifies cookies by name + path + domain. If these do not match, the cookie will not be removed.

### Example

```javascript
// Setting the cookie
app.post("/login", (req, res) => {
  res.cookie("authToken", "abc123", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api",
    maxAge: 86400000,
  });
  res.json({ message: "Logged in" });
});

// Clearing the cookie -- path must match
app.post("/logout", (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/api", // Must match the path used when setting the cookie
  });
  res.json({ message: "Logged out" });
});
```

### Common Mistake

```javascript
// WRONG -- path does not match, cookie will NOT be cleared
res.cookie("token", "abc", { path: "/api" });
res.clearCookie("token"); // Defaults to path: "/" -- does not match "/api"

// CORRECT -- path matches
res.clearCookie("token", { path: "/api" });
```

---

## Cookie Lifecycle

```
1. CREATION
   Server sends Set-Cookie header in response
   Browser stores the cookie with its options

2. ACTIVE PERIOD
   Browser sends the cookie with every matching request
   Server reads the cookie and acts accordingly
   Cookie can be updated by sending a new Set-Cookie with the same name

3. EXPIRATION / REMOVAL
   The cookie is removed when:
   a) maxAge / expires time is reached (browser auto-deletes)
   b) Server sends res.clearCookie() (sets expiry in the past)
   c) User manually clears cookies in browser settings
   d) Session cookie: browser is closed (if no maxAge/expires was set)
```

### Session Cookies vs Persistent Cookies

| Type       | Created When                      | Deleted When        |
| ---------- | --------------------------------- | ------------------- |
| Session    | No `maxAge` or `expires` is set   | Browser is closed   |
| Persistent | `maxAge` or `expires` is provided | Time limit reached  |

```javascript
// Session cookie -- dies when browser closes
res.cookie("tempData", "abc123");

// Persistent cookie -- survives browser restarts
res.cookie("remember", "true", {
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
});
```

---

## httpOnly vs Frontend-Accessible Cookies

| Feature                     | httpOnly Cookie             | Regular (Frontend-Accessible) Cookie |
| --------------------------- | --------------------------- | ------------------------------------ |
| Accessible via `document.cookie` | No                     | Yes                                  |
| Sent with HTTP requests     | Yes (automatically)         | Yes (automatically)                  |
| Readable by JavaScript      | No                          | Yes                                  |
| Modifiable by JavaScript    | No                          | Yes                                  |
| XSS attack exposure         | Protected (cannot be stolen via script) | Vulnerable (scripts can read/steal it) |
| Use case                    | Auth tokens, session IDs    | UI preferences, non-sensitive data   |
| Set by                      | Server only                 | Server or client-side JavaScript     |

### Example Comparison

```javascript
// Server-side: Setting both types
app.get("/set-both", (req, res) => {
  // httpOnly -- JavaScript CANNOT read this
  res.cookie("refreshToken", "secret_refresh_token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Regular -- JavaScript CAN read this
  res.cookie("theme", "dark", {
    httpOnly: false, // default
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Both cookies set" });
});
```

```javascript
// Client-side JavaScript
console.log(document.cookie);
// Output: "theme=dark"
// Notice: refreshToken is NOT visible here -- it is httpOnly
```

---

## Cookie Flow Between Backend and Frontend

### Complete Request/Response Cycle

```
STEP 1: User logs in
=========================================================
Frontend (POST /api/login) -------> Backend
                                    Backend creates token
Frontend <------- Set-Cookie: token=xyz; HttpOnly; Secure

STEP 2: Browser stores cookie automatically (no JS needed)

STEP 3: User requests protected resource
=========================================================
Frontend (GET /api/profile) -------> Backend
  Cookie: token=xyz (attached automatically)
                                     Backend reads req.cookies.token
                                     Backend verifies token
Frontend <------- { user: "john" }

STEP 4: User logs out
=========================================================
Frontend (POST /api/logout) -------> Backend
  Cookie: token=xyz (still attached)
                                     Backend calls res.clearCookie("token")
Frontend <------- Set-Cookie: token=; Expires=Thu, 01 Jan 1970

STEP 5: Browser deletes the cookie automatically
```

### Frontend Behavior

With httpOnly cookies, the frontend does **not** need to manually handle tokens. The browser does all the work:

```javascript
// Frontend -- no need to store or attach tokens manually
const response = await fetch("/api/profile", {
  method: "GET",
  credentials: "include", // Tells the browser to include cookies
});

const data = await response.json();
```

Compare this to the manual token approach:

```javascript
// Without cookies -- manual token management
const token = localStorage.getItem("token");

const response = await fetch("/api/profile", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`, // Must manually attach
  },
});
```

---

## Best Practices

### 1. Always Use httpOnly for Sensitive Data

```javascript
// Auth tokens, session IDs, refresh tokens
res.cookie("authToken", token, { httpOnly: true });
```

### 2. Always Use secure in Production

```javascript
const isProduction = process.env.NODE_ENV === "production";

res.cookie("token", value, {
  httpOnly: true,
  secure: isProduction, // true in prod, false for local dev over HTTP
});
```

### 3. Set Appropriate sameSite Values

```javascript
// For same-site auth cookies
res.cookie("token", value, { sameSite: "strict" });

// For cookies that need to work with OAuth redirects
res.cookie("token", value, { sameSite: "lax" });

// For cross-origin APIs (must also be secure)
res.cookie("token", value, { sameSite: "none", secure: true });
```

### 4. Set Reasonable Expiration Times

```javascript
// Short-lived for access tokens
res.cookie("accessToken", token, { maxAge: 15 * 60 * 1000 }); // 15 min

// Longer for refresh tokens
res.cookie("refreshToken", token, { maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
```

### 5. Use Specific Paths When Possible

```javascript
// Scope cookies to only where they are needed
res.cookie("apiKey", key, { path: "/api" });
```

### 6. Always Match Options When Clearing

```javascript
// Use the same options (path, domain, sameSite, secure, httpOnly)
res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/",
});
```

### 7. Do Not Store Sensitive Data Directly

Cookies should contain **references** (like session IDs or tokens) rather than sensitive data itself (like passwords or personal information). Even with httpOnly, cookie values are transmitted in every request and could be intercepted without HTTPS.
