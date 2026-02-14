# SameSite Attribute and Cookie Security

## Table of Contents

1. [The SameSite Attribute](#the-samesite-attribute)
2. [SameSite Values Comparison](#samesite-values-comparison)
3. [Same-Site vs Cross-Site Determination](#same-site-vs-cross-site-determination)
4. [Scenario Examples](#scenario-examples)
5. [Scenario 1: Same Domain](#scenario-1-same-domain)
6. [Scenario 2: Subdomains](#scenario-2-subdomains)
7. [Scenario 3: Different Domains (Cross-Origin API)](#scenario-3-different-domains-cross-origin-api)
8. [Recommendations](#recommendations)
9. [Debugging with DevTools](#debugging-with-devtools)
10. [Common Issues and Fixes](#common-issues-and-fixes)

---

## The SameSite Attribute

The `SameSite` attribute on a cookie controls **whether the browser sends the cookie with cross-site requests**. It is the primary defense against Cross-Site Request Forgery (CSRF) attacks.

CSRF attacks exploit the fact that browsers automatically attach cookies to requests. If a user is logged into `bank.com` and visits `evil.com`, a malicious form on `evil.com` could submit a POST request to `bank.com/transfer`. Without `SameSite` protection, the browser would attach the session cookie, and the request would succeed.

### Setting SameSite in Express

```javascript
res.cookie("sessionId", "abc123", {
  httpOnly: true,
  secure: true,
  sameSite: "strict", // "strict", "lax", or "none"
});
```

---

## SameSite Values Comparison

| SameSite Value | Cross-Site POST/Fetch | Cross-Site Top-Level Navigation (GET) | Same-Site Requests | Requires `secure` | CSRF Protection Level |
| -------------- | --------------------- | ------------------------------------- | ------------------ | ------------------ | --------------------- |
| `"strict"`     | Cookie NOT sent       | Cookie NOT sent                       | Cookie sent        | No (but recommended) | Highest              |
| `"lax"`        | Cookie NOT sent       | Cookie IS sent                        | Cookie sent        | No (but recommended) | Moderate             |
| `"none"`       | Cookie IS sent        | Cookie IS sent                        | Cookie sent        | **Yes (required)**   | None (rely on other measures) |

### Detailed Breakdown

**`SameSite: "strict"`**

The cookie is **never** sent with any cross-site request. This includes clicking a link from another site to your site. If a user is on `other.com` and clicks a link to `yourapp.com`, the cookie will NOT be sent on that first navigation. The user will appear logged out until they navigate within your site.

```javascript
res.cookie("token", value, { sameSite: "strict" });
```

**`SameSite: "lax"`**

The cookie is sent when the user **navigates to your site** via a top-level GET request (clicking a link, typing the URL, or following a redirect). However, it is NOT sent with cross-site subrequests like `fetch()`, `XMLHttpRequest`, form POSTs, or iframes.

```javascript
res.cookie("token", value, { sameSite: "lax" });
```

**`SameSite: "none"`**

The cookie is sent with **all requests**, including cross-site ones. This is required for cross-origin APIs, third-party integrations, and iframes. The `secure` flag **must** be set to `true` -- browsers reject `SameSite=None` cookies without `secure`.

```javascript
res.cookie("token", value, { sameSite: "none", secure: true });
```

---

## Same-Site vs Cross-Site Determination

The browser determines whether a request is "same-site" or "cross-site" based on the **registrable domain** (also called eTLD+1). This is the effective top-level domain (like `.com`, `.co.uk`) plus one additional label.

### How the Browser Decides

| Request Origin          | Request Destination     | Registrable Domain Match? | Classification |
| ----------------------- | ----------------------- | ------------------------- | -------------- |
| `app.example.com`       | `api.example.com`       | Both `example.com`        | **Same-site**  |
| `www.example.com`       | `example.com`           | Both `example.com`        | **Same-site**  |
| `example.com`           | `example.com`           | Both `example.com`        | **Same-site**  |
| `example.com`           | `different.com`         | Different                 | **Cross-site** |
| `myapp.com`             | `myapi.io`              | Different                 | **Cross-site** |
| `app.example.com`       | `app.example.org`       | Different                 | **Cross-site** |
| `localhost:3000`        | `localhost:5173`        | Both `localhost`          | **Same-site**  |

**Key insight:** Subdomains of the same registrable domain are considered **same-site**. Different ports on the same host are also considered **same-site**.

---

## Scenario Examples

| Scenario | Frontend URL | Backend URL | Relationship | SameSite Needed | Notes |
| -------- | ------------ | ----------- | ------------ | --------------- | ----- |
| Monolith | `website.com` | `website.com` | Same origin | `"strict"` or `"lax"` | Simplest setup |
| Subdomains | `app.website.com` | `api.website.com` | Same-site, cross-origin | `"lax"` works | Need `domain: ".website.com"` |
| Dev environment | `localhost:5173` | `localhost:3000` | Same-site, cross-origin | `"lax"` works | Different ports are same-site |
| Separate domains | `myapp.com` | `myapi.io` | Cross-site | `"none"` + `secure` | Full CORS setup needed |
| Third-party embed | `other.com` (iframe) | `yourapp.com` | Cross-site | `"none"` + `secure` | Iframe context |

---

## Scenario 1: Same Domain

**Setup:** Both frontend and backend are served from the same domain.

```
Frontend: https://website.com
Backend:  https://website.com/api
```

This is the simplest case. Cookies flow naturally because everything is same-origin.

### Configuration

```javascript
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

app.post("/api/login", (req, res) => {
  res.cookie("sessionId", "abc123", {
    httpOnly: true,
    secure: true,
    sameSite: "strict", // Strictest setting works fine here
    domain: ".website.com", // Available to website.com and all subdomains
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Logged in" });
});

app.get("/api/profile", (req, res) => {
  const { sessionId } = req.cookies; // Cookie is always sent
  // ... verify session
  res.json({ user: "john" });
});
```

### Why `domain: ".website.com"` is Useful

Setting `domain: ".website.com"` (with the leading dot) makes the cookie available to:
- `website.com`
- `www.website.com`
- `api.website.com`
- `app.website.com`
- Any other subdomain of `website.com`

Without setting the domain, the cookie is scoped to the exact hostname that set it.

---

## Scenario 2: Subdomains

**Setup:** Frontend and backend are on different subdomains of the same registrable domain.

```
Frontend: https://app.website.com
Backend:  https://api.website.com
```

These are **same-site** but **cross-origin**. The `SameSite=Lax` setting works because the browser considers them the same site.

### Configuration

```javascript
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(cookieParser());

// CORS is needed because subdomains are cross-origin
app.use(
  cors({
    origin: "https://app.website.com",
    credentials: true, // Allow cookies
  })
);

app.post("/api/login", (req, res) => {
  res.cookie("sessionId", "abc123", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",           // Lax works for same-site subdomains
    domain: ".website.com",    // Share cookie across subdomains
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Logged in" });
});
```

### Frontend (on app.website.com)

```javascript
// The cookie is sent automatically because SameSite=Lax allows
// same-site requests (subdomains are same-site)
const response = await fetch("https://api.website.com/api/profile", {
  credentials: "include", // Still needed for cross-origin requests
});
```

### Why "strict" Can Cause Issues Here

With `SameSite: "strict"`, if a user clicks a link from an external site (like an email link) to `app.website.com`, the cookie will NOT be sent on the first request. The user will appear logged out momentarily. `"lax"` avoids this because it allows cookies on top-level navigations.

---

## Scenario 3: Different Domains (Cross-Origin API)

**Setup:** Frontend and backend are on completely different domains.

```
Frontend: https://myapp.com
Backend:  https://myapi.io
```

These are **cross-site**. Only `SameSite=None` allows the cookie to be sent. The `secure` flag is mandatory.

### Backend Configuration

```javascript
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(cookieParser());

// CORS must allow the specific frontend origin with credentials
app.use(
  cors({
    origin: "https://myapp.com", // Must be specific, not "*"
    credentials: true,
  })
);

app.post("/api/login", (req, res) => {
  res.cookie("sessionId", "abc123", {
    httpOnly: true,
    secure: true,              // REQUIRED for SameSite=None
    sameSite: "none",          // Only option for cross-site cookies
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Logged in" });
});

app.get("/api/profile", (req, res) => {
  const { sessionId } = req.cookies;
  if (!sessionId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({ user: "john" });
});
```

### Frontend Configuration (on myapp.com)

```javascript
// Every request must include credentials
const response = await fetch("https://myapi.io/api/profile", {
  method: "GET",
  credentials: "include", // Mandatory for cross-site cookies
});

const data = await response.json();
```

### Important Requirements for Cross-Site Cookies

1. `SameSite` must be `"none"`
2. `secure` must be `true` (HTTPS only)
3. CORS `origin` must be a specific URL (not `"*"`)
4. CORS `credentials` must be `true`
5. Frontend requests must include `credentials: "include"`

---

## Recommendations

| Scenario | Recommended SameSite | secure | domain | CORS Needed |
| -------- | -------------------- | ------ | ------ | ----------- |
| Same domain (monolith) | `"strict"` | `true` | Not needed or `.domain.com` | No |
| Subdomains | `"lax"` | `true` | `".domain.com"` | Yes |
| Different ports (dev) | `"lax"` | `false` (HTTP) | Not needed | Yes |
| Cross-site API | `"none"` | `true` (required) | Not needed | Yes |
| OAuth/SSO redirects | `"lax"` | `true` | Depends on setup | Depends |
| Embedded iframe | `"none"` | `true` (required) | Not needed | Yes |

### General Rule of Thumb

Use the **strictest** `SameSite` value that works for your architecture:

```
"strict"  -->  Use if you can (same-domain apps, no external navigation concerns)
"lax"     -->  Use for most web apps (handles OAuth redirects, email links gracefully)
"none"    -->  Use only when required (cross-site APIs, third-party embeds)
```

---

## Debugging with DevTools

### Viewing Cookies in Chrome DevTools

1. Open DevTools (F12 or Ctrl+Shift+I).
2. Go to the **Application** tab.
3. In the left sidebar, expand **Cookies**.
4. Click on the domain to see all cookies.

### What to Check

- **Name / Value:** Verify the cookie is set with the correct name and value.
- **Domain:** Ensure the domain matches what you expect.
- **Path:** Verify the path scope.
- **Expires / Max-Age:** Check the expiration time.
- **Size:** Monitor cookie sizes (keep under 4KB).
- **HttpOnly:** Should show a checkmark for sensitive cookies.
- **Secure:** Should show a checkmark for production cookies.
- **SameSite:** Shows Strict, Lax, or None.

### Viewing Set-Cookie Headers in the Network Tab

1. Open DevTools > **Network** tab.
2. Click on the request/response.
3. Look at **Response Headers** for `Set-Cookie`.
4. Look at **Request Headers** for `Cookie` to see what the browser is sending.

### Checking Why a Cookie Was Blocked

1. Open DevTools > **Console** tab or **Issues** tab.
2. Chrome shows warnings like:
   - "This Set-Cookie was blocked because it had the 'SameSite=None' attribute but did not have the 'Secure' attribute."
   - "This Set-Cookie was blocked because it was not sent over a secure connection."

### Filtering Network Requests

In the Network tab, you can filter for `Set-Cookie` in response headers:
1. Click the filter icon.
2. Type `set-cookie` in the filter bar to find which requests are setting cookies.

---

## Common Issues and Fixes

| Issue | Symptom | Cause | Fix |
| ----- | ------- | ----- | --- |
| Cookie not being set | `Set-Cookie` in response but cookie not in Application tab | `SameSite=None` without `Secure` | Add `secure: true` or change `sameSite` to `"lax"` |
| Cookie not being sent | Cookie exists in browser but not in `req.cookies` | Missing `credentials: "include"` on frontend | Add `credentials: "include"` (fetch) or `withCredentials: true` (axios) |
| CORS error with cookies | Browser blocks the request entirely | `Access-Control-Allow-Origin` is `"*"` with credentials | Set `origin` to a specific URL in CORS config |
| Cookie disappears on refresh | Cookie is gone after page reload | No `maxAge` or `expires` set (session cookie) and browser was closed | Set `maxAge` for persistent cookies |
| Cookie not shared across subdomains | `api.site.com` cannot read cookie set by `app.site.com` | `domain` not set (defaults to exact hostname) | Set `domain: ".site.com"` |
| Cookie not cleared | `res.clearCookie()` called but cookie persists | `path` or `domain` in `clearCookie` does not match the original | Pass the same `path`, `domain`, `httpOnly`, `secure`, `sameSite` options |
| `req.cookies` is undefined | Cannot read property of undefined | `cookie-parser` middleware is not installed or not used | Install and add `app.use(cookieParser())` |
| Cookie works in Postman but not browser | API works in Postman, fails in browser | Browsers enforce SameSite, CORS, and Secure rules; Postman does not | Ensure all browser-required settings are in place |
| Cookie blocked in iframe | Third-party context blocked by browser | Modern browsers block third-party cookies by default | Use `SameSite=None; Secure` and consider browser-specific policies |
| "Schemeful SameSite" warning | Cookie blocked between HTTP and HTTPS on same domain | Chrome treats `http://` and `https://` as different schemes | Use HTTPS in development (or both on HTTP) |
