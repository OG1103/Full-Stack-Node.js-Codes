# The Response Object (`res`) in Express

## Table of Contents

- [Overview](#overview)
- [res.status() - Setting Status Codes](#resstatus---setting-status-codes)
- [res.json() - Sending JSON Responses](#resjson---sending-json-responses)
- [res.send() - Sending General Responses](#ressend---sending-general-responses)
- [res.sendFile() - Sending Files](#ressendfile---sending-files)
- [res.redirect() - Redirecting Requests](#resredirect---redirecting-requests)
- [res.setHeader() / res.set() - Setting Headers](#ressetheader--resset---setting-headers)
- [res.cookie() / res.clearCookie() - Managing Cookies](#rescookie--resclearcookie---managing-cookies)
- [Content-Type Headers](#content-type-headers)
- [Complete File Download Example](#complete-file-download-example)

---

## Overview

The `res` (response) object represents the HTTP response that the server sends back to the client. It provides methods to set status codes, headers, cookies, and send data in various formats.

Express creates this object for every incoming request and passes it as the second argument to route handlers and middleware functions.

```js
import express from "express";
const app = express();

app.get("/example", (req, res) => {
  // res is the response object
  // Use it to send data back to the client
  res.status(200).json({ message: "Hello" });
});
```

**Key rule**: You can only send **one** response per request. Calling `res.json()`, `res.send()`, or `res.end()` more than once will throw an error: `Error: Cannot set headers after they are sent to the client`.

---

## res.status() - Setting Status Codes

`res.status()` sets the HTTP status code for the response. It returns the `res` object, so it is chainable.

```js
// 200 - OK (default, so often omitted)
res.status(200).json({ message: "Success" });

// 201 - Created
res.status(201).json({ message: "Resource created", id: 42 });

// 204 - No Content (used for successful deletes)
res.status(204).send();

// 400 - Bad Request
res.status(400).json({ error: "Invalid input" });

// 401 - Unauthorized
res.status(401).json({ error: "Authentication required" });

// 403 - Forbidden
res.status(403).json({ error: "You do not have permission" });

// 404 - Not Found
res.status(404).json({ error: "Resource not found" });

// 500 - Internal Server Error
res.status(500).json({ error: "Something went wrong" });
```

### Common Status Codes Reference

| Code | Name                  | Usage                                      |
| ---- | --------------------- | ------------------------------------------ |
| 200  | OK                    | Successful GET, PUT, PATCH                 |
| 201  | Created               | Successful POST that creates a resource    |
| 204  | No Content            | Successful DELETE                          |
| 301  | Moved Permanently     | Permanent redirect                         |
| 302  | Found                 | Temporary redirect (default for `res.redirect`) |
| 400  | Bad Request           | Client sent invalid data                   |
| 401  | Unauthorized          | Missing or invalid authentication          |
| 403  | Forbidden             | Authenticated but not authorized           |
| 404  | Not Found             | Resource does not exist                    |
| 409  | Conflict              | Duplicate resource or version conflict     |
| 422  | Unprocessable Entity  | Validation errors                          |
| 500  | Internal Server Error | Unexpected server failure                  |

---

## res.json() - Sending JSON Responses

`res.json()` sends a JSON response. It automatically sets the `Content-Type` header to `application/json` and converts the JavaScript value to a JSON string using `JSON.stringify()`.

```js
// Send a simple object
app.get("/user", (req, res) => {
  res.json({ name: "Alice", age: 25 });
});

// Send an array
app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ]);
});

// Chain with status
app.post("/users", (req, res) => {
  const newUser = { id: 3, name: req.body.name };
  res.status(201).json(newUser);
});

// Send null or boolean values
app.get("/check", (req, res) => {
  res.json(null);  // Sends: null
  // res.json(true); // Sends: true
});
```

### res.json() vs res.send()

`res.json()` is preferred for API responses because:
- It explicitly signals that you are returning JSON.
- It calls `JSON.stringify()` with the `json replacer` and `json spaces` app settings if configured.
- It makes your intent clear in the code.

---

## res.send() - Sending General Responses

`res.send()` sends a response of any type. It automatically sets the `Content-Type` based on the argument type.

```js
// String -> Content-Type: text/html
app.get("/html", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

// Object or Array -> Content-Type: application/json (same as res.json)
app.get("/data", (req, res) => {
  res.send({ name: "Alice" });
});

// Buffer -> Content-Type: application/octet-stream
app.get("/buffer", (req, res) => {
  res.send(Buffer.from("raw data"));
});

// No body (just end the response)
app.delete("/users/:id", (req, res) => {
  res.status(204).send();
});
```

### When to Use Which

| Method       | Use When                                |
| ------------ | --------------------------------------- |
| `res.json()` | Returning JSON data (APIs)              |
| `res.send()` | Returning HTML, plain text, or buffers  |

---

## res.sendFile() - Sending Files

`res.sendFile()` sends a file as the response. It automatically sets the `Content-Type` header based on the file extension. **It requires an absolute path.**

```js
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Send an HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Send an image
app.get("/logo", (req, res) => {
  res.sendFile(path.join(__dirname, "assets", "logo.png"));
});

// Send a PDF
app.get("/report", (req, res) => {
  res.sendFile(path.join(__dirname, "files", "report.pdf"));
});
```

### Using the `root` Option

Instead of building absolute paths every time, you can set a root directory.

```js
app.get("/docs/:filename", (req, res) => {
  const { filename } = req.params;

  res.sendFile(filename, { root: path.join(__dirname, "documents") }, (err) => {
    if (err) {
      res.status(404).json({ error: "File not found" });
    }
  });
});
```

### Why Absolute Paths Are Required

`res.sendFile()` rejects relative paths for security reasons. A relative path could resolve differently depending on the current working directory, which could expose unintended files. Always use `path.join()` or `path.resolve()` to construct absolute paths.

---

## res.redirect() - Redirecting Requests

`res.redirect()` sends a redirect response, telling the client to navigate to a different URL.

```js
// Default 302 (temporary) redirect
app.get("/old-page", (req, res) => {
  res.redirect("/new-page");
});

// 301 (permanent) redirect
app.get("/legacy-api", (req, res) => {
  res.redirect(301, "/api/v2");
});

// Redirect to an external URL
app.get("/github", (req, res) => {
  res.redirect("https://github.com");
});

// Redirect back to the previous page (uses Referer header)
app.post("/login-failed", (req, res) => {
  res.redirect("back");
});
```

### 301 vs 302 Redirects

| Code | Type      | Browser Behavior                          | Use Case                    |
| ---- | --------- | ----------------------------------------- | --------------------------- |
| 301  | Permanent | Browser caches the redirect               | URL permanently changed     |
| 302  | Temporary | Browser does NOT cache the redirect       | Temporary rerouting         |

---

## res.setHeader() / res.set() - Setting Headers

Both methods set response headers. `res.set()` is an Express shorthand that also accepts an object for setting multiple headers at once.

```js
// Using res.setHeader() (Node.js native method)
app.get("/data", (req, res) => {
  res.setHeader("X-Request-Id", "abc-123");
  res.setHeader("Cache-Control", "no-store");
  res.json({ data: "value" });
});

// Using res.set() (Express shorthand) - single header
app.get("/data", (req, res) => {
  res.set("X-Request-Id", "abc-123");
  res.json({ data: "value" });
});

// Using res.set() - multiple headers at once
app.get("/data", (req, res) => {
  res.set({
    "X-Request-Id": "abc-123",
    "Cache-Control": "no-store",
    "X-Powered-By": "Express",
  });
  res.json({ data: "value" });
});
```

### Common Response Headers

| Header              | Purpose                                     | Example Value                |
| ------------------- | ------------------------------------------- | ---------------------------- |
| `Content-Type`      | MIME type of the response body               | `application/json`           |
| `Cache-Control`     | Caching directives                           | `no-store` or `max-age=3600` |
| `X-Request-Id`      | Unique ID for tracing requests               | `abc-123-def-456`            |
| `Access-Control-*`  | CORS headers                                 | `*` or specific origin       |
| `Content-Disposition`| How the browser should handle the file      | `attachment; filename="f.pdf"` |

---

## res.cookie() / res.clearCookie() - Managing Cookies

Express provides built-in methods for setting and clearing cookies on the response.

### Setting Cookies

```js
app.get("/login", (req, res) => {
  // Basic cookie
  res.cookie("username", "alice");

  // Cookie with options
  res.cookie("sessionId", "s3cr3tValue", {
    httpOnly: true,    // Not accessible via JavaScript (prevents XSS)
    secure: true,      // Only sent over HTTPS
    maxAge: 3600000,   // Expires in 1 hour (milliseconds)
    sameSite: "strict", // CSRF protection
  });

  // Signed cookie (requires cookie-parser with a secret)
  res.cookie("token", "abc123", { signed: true });

  res.json({ message: "Logged in" });
});
```

### Clearing Cookies

```js
app.get("/logout", (req, res) => {
  // Clear a cookie by name
  res.clearCookie("sessionId");

  // If the cookie was set with specific options (path, domain),
  // you must provide the same options when clearing
  res.clearCookie("sessionId", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.json({ message: "Logged out" });
});
```

### Cookie Options Reference

| Option     | Type    | Description                                          |
| ---------- | ------- | ---------------------------------------------------- |
| `httpOnly` | Boolean | Inaccessible to client-side JavaScript               |
| `secure`   | Boolean | Only sent over HTTPS                                 |
| `maxAge`   | Number  | Time to live in milliseconds                         |
| `expires`  | Date    | Specific expiration date                             |
| `path`     | String  | URL path the cookie is valid for (default: `"/"`)    |
| `domain`   | String  | Domain the cookie is valid for                       |
| `sameSite` | String  | `"strict"`, `"lax"`, or `"none"` (CSRF protection)  |
| `signed`   | Boolean | Whether to sign the cookie                           |

---

## Content-Type Headers

The `Content-Type` header tells the client what kind of data the response contains. Express sets it automatically for `res.json()` and `res.send()`, but you may need to set it manually for other types.

### JSON

```js
app.get("/api/data", (req, res) => {
  // res.json() sets Content-Type automatically
  res.json({ name: "Alice", age: 25 });
  // Content-Type: application/json; charset=utf-8
});
```

### Plain Text

```js
app.get("/health", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.send("OK");
  // Content-Type: text/plain
});
```

### HTML

```js
app.get("/page", (req, res) => {
  res.set("Content-Type", "text/html");
  res.send("<html><body><h1>Hello</h1></body></html>");
  // Content-Type: text/html
});
```

### PDF

```js
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/report", (req, res) => {
  const filePath = path.join(__dirname, "files", "report.pdf");

  res.set("Content-Type", "application/pdf");
  res.sendFile(filePath);
  // Content-Type: application/pdf
});
```

### Images

```js
app.get("/logo", (req, res) => {
  const filePath = path.join(__dirname, "assets", "logo.png");

  // sendFile auto-detects Content-Type from extension
  res.sendFile(filePath);
  // Content-Type: image/png (auto-detected)
});

// Explicitly setting for different image types
// image/png, image/jpeg, image/gif, image/svg+xml, image/webp
```

### CSV

```js
app.get("/export", (req, res) => {
  const csvData = "name,email,age\nAlice,alice@example.com,25\nBob,bob@example.com,30";

  res.set("Content-Type", "text/csv");
  res.set("Content-Disposition", 'attachment; filename="users.csv"');
  res.send(csvData);
});
```

### File Downloads with Content-Disposition

The `Content-Disposition` header controls whether the browser displays the file inline or prompts a download dialog.

```js
// Inline: browser tries to display it (default behavior)
res.set("Content-Disposition", "inline");

// Attachment: browser prompts a download dialog
res.set("Content-Disposition", "attachment");

// Attachment with filename: browser prompts download with suggested name
res.set("Content-Disposition", 'attachment; filename="report.pdf"');
```

### Content-Type Quick Reference

| Type          | Content-Type Value              | File Extension     |
| ------------- | ------------------------------- | ------------------ |
| JSON          | `application/json`              | `.json`            |
| Plain Text    | `text/plain`                    | `.txt`             |
| HTML          | `text/html`                     | `.html`            |
| CSS           | `text/css`                      | `.css`             |
| JavaScript    | `application/javascript`        | `.js`              |
| PDF           | `application/pdf`               | `.pdf`             |
| PNG Image     | `image/png`                     | `.png`             |
| JPEG Image    | `image/jpeg`                    | `.jpg`, `.jpeg`    |
| GIF Image     | `image/gif`                     | `.gif`             |
| SVG Image     | `image/svg+xml`                 | `.svg`             |
| WebP Image    | `image/webp`                    | `.webp`            |
| CSV           | `text/csv`                      | `.csv`             |
| XML           | `application/xml`               | `.xml`             |
| ZIP           | `application/zip`               | `.zip`             |
| Octet Stream  | `application/octet-stream`      | (binary default)   |

---

## Complete File Download Example

This example combines `res.sendFile()`, status codes, error handling, and proper headers to implement a complete file download endpoint.

```js
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "uploads", filename);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  // Get file stats for Content-Length
  const stats = fs.statSync(filePath);

  // Determine Content-Type based on extension
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".csv": "text/csv",
    ".txt": "text/plain",
    ".zip": "application/zip",
  };
  const contentType = mimeTypes[ext] || "application/octet-stream";

  // Set response headers
  res.set({
    "Content-Type": contentType,
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Content-Length": stats.size,
  });

  // Send the file
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      // Only send error if headers haven't been sent yet
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to download file" });
      }
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### Using res.download() Shorthand

Express also provides `res.download()`, which is a convenience method that combines `res.sendFile()` with the `Content-Disposition: attachment` header.

```js
app.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "uploads", filename);

  // res.download() sets Content-Disposition: attachment automatically
  // Second argument is the filename the client sees (optional)
  res.download(filePath, filename, (err) => {
    if (err) {
      if (!res.headersSent) {
        res.status(404).json({ error: "File not found" });
      }
    }
  });
});
```

### Streaming Large Files

For very large files, use streams instead of `sendFile` to avoid loading the entire file into memory.

```js
import fs from "fs";

app.get("/download-large/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "uploads", filename);

  // Check existence
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  const stats = fs.statSync(filePath);

  res.set({
    "Content-Type": "application/octet-stream",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Content-Length": stats.size,
  });

  // Create a read stream and pipe it to the response
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);

  readStream.on("error", (err) => {
    console.error("Stream error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to stream file" });
    }
  });
});
```
