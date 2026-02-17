# AJAX, Fetch API, and Axios

These are tools and techniques for making HTTP requests from JavaScript, enabling dynamic web pages that communicate with servers without full page reloads.

---

## 1. AJAX (Asynchronous JavaScript and XML)

### What is AJAX?

AJAX is a **technique** (not a tool) for making asynchronous HTTP requests from the browser. It allows web pages to send and receive data from servers without reloading the page.

### How AJAX Works

1. **User triggers an action** (button click, form submit, page load)
2. **JavaScript sends an HTTP request** to the server asynchronously
3. **Server processes the request** and sends back a response (usually JSON)
4. **JavaScript receives the response** and updates the page dynamically

### AJAX Implementations

AJAX is the concept; these are the tools that implement it:

| Tool | Type | Description |
|------|------|-------------|
| `XMLHttpRequest` | Built-in (legacy) | Traditional, callback-based, verbose |
| `fetch()` | Built-in (modern) | Promise-based, cleaner syntax |
| **Axios** | Third-party library | Feature-rich, automatic JSON, better error handling |

---

## 2. Fetch API

The `fetch()` API is a modern, built-in JavaScript API for making HTTP requests. It is **Promise-based** and provides a cleaner syntax than `XMLHttpRequest`.

### Basic GET Request

```javascript
fetch("https://api.example.com/users")
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Parse response body as JSON
  })
  .then(data => {
    console.log("Users:", data);
  })
  .catch(error => {
    console.error("Fetch failed:", error);
  });
```

### With async/await (Recommended)

```javascript
async function getUsers() {
  try {
    const response = await fetch("https://api.example.com/users");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Users:", data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}
```

### Response Object Properties and Methods

```javascript
const response = await fetch(url);

// Properties
response.ok;         // true if status is 200-299
response.status;     // HTTP status code (200, 404, 500, etc.)
response.statusText; // Status text ("OK", "Not Found", etc.)
response.headers;    // Response headers
response.url;        // Final URL (after redirects)
response.type;       // "basic", "cors", "opaque", etc.

// Methods (each returns a Promise)
response.json();     // Parse body as JSON
response.text();     // Parse body as plain text
response.blob();     // Parse body as binary Blob (for files/images)
response.formData(); // Parse body as FormData
response.arrayBuffer(); // Parse body as ArrayBuffer
```

> **Important**: Response body can only be read **once**. If you call `.json()`, you cannot call `.text()` on the same response.

### POST Request

```javascript
async function createUser(userData) {
  const response = await fetch("https://api.example.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

await createUser({ name: "Alice", email: "alice@test.com" });
```

### PUT, PATCH, DELETE Requests

```javascript
// PUT - Replace entire resource
await fetch("/api/users/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice", age: 31, email: "alice@test.com" })
});

// PATCH - Partial update
await fetch("/api/users/1", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ age: 31 }) // Only update age
});

// DELETE
await fetch("/api/users/1", {
  method: "DELETE"
});
```

### Fetch Error Handling Quirk

**`fetch()` does NOT throw errors for HTTP error status codes** (400, 404, 500, etc.). It only throws on **network failures** (DNS errors, server unreachable, CORS issues).

```javascript
// BAD - catch block won't fire for 404 or 500 responses
try {
  const response = await fetch("/api/nonexistent");
  const data = await response.json(); // May fail if response is error HTML
} catch (error) {
  // Only catches NETWORK errors, not HTTP errors!
}

// GOOD - manually check response.ok
try {
  const response = await fetch("/api/nonexistent");

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
} catch (error) {
  console.error(error.message); // "HTTP 404: Not Found"
}
```

---

## 3. Axios

Axios is a popular third-party HTTP client library with built-in features like automatic JSON parsing, error throwing on non-2xx responses, interceptors, and more.

### Installation and Import

```javascript
// npm install axios
import axios from "axios";
```

### GET Request

```javascript
// Basic GET
const response = await axios.get("https://api.example.com/users");
console.log(response.data); // Automatically parsed JSON

// With query parameters
const response = await axios.get("https://api.example.com/users", {
  params: {
    page: 1,
    limit: 10,
    role: "admin"
  }
});
// Request URL: /users?page=1&limit=10&role=admin

// Array query parameters
const response = await axios.get("/api/courses", {
  params: {
    tags: ["js", "react"] // Becomes: ?tags=js&tags=react
  }
});
```

### POST Request

```javascript
// With body only
await axios.post("/api/users", {
  name: "Alice",
  email: "alice@test.com"
});

// With body AND query parameters
await axios.post("/api/users",
  { name: "Alice", email: "alice@test.com" },  // Body (2nd arg)
  { params: { admin: true } }                   // Config (3rd arg)
);

// With no body, only query params
await axios.post("/api/users", null, {
  params: { action: "invite" }
});
```

### PUT, PATCH, DELETE

```javascript
// PUT - Replace entire resource
await axios.put("/api/users/1", {
  name: "Alice",
  age: 31,
  email: "alice@test.com"
});

// PATCH - Partial update
await axios.patch("/api/users/1", {
  age: 31 // Only update age
});

// DELETE - Basic
await axios.delete("/api/users/1");

// DELETE - With query params
await axios.delete("/api/users", {
  params: { id: "123" }
});

// DELETE - With body (if backend allows)
await axios.delete("/api/users/1", {
  data: { reason: "Account deactivated" }
});
```

### Axios Method Syntax Summary

| Method | Syntax |
|--------|--------|
| GET | `axios.get(url, { params })` |
| POST | `axios.post(url, body, { params })` |
| PUT | `axios.put(url, body, { params })` |
| PATCH | `axios.patch(url, body, { params })` |
| DELETE | `axios.delete(url, { params, data })` |

---

### Axios Response Object

```javascript
const response = await axios.get("/api/users");

response.data;       // Parsed response data (auto JSON)
response.status;     // HTTP status code (200, 201, etc.)
response.statusText; // Status text ("OK", "Created")
response.headers;    // Response headers
response.config;     // Axios request configuration
response.request;    // The underlying request object
```

### Axios Error Object

Axios automatically throws for non-2xx responses (unlike fetch).

```javascript
try {
  const response = await axios.get("/api/users/999");
  console.log(response.data);
} catch (error) {
  if (error.response) {
    // Server responded with non-2xx status
    console.log(error.response.data);    // Error body from server
    console.log(error.response.status);  // 404, 500, etc.
    console.log(error.response.headers); // Response headers
  } else if (error.request) {
    // Request was made but no response received (network error)
    console.log(error.request);
  } else {
    // Something else went wrong
    console.log(error.message);
  }

  console.log(error.isAxiosError); // true (confirms it's an Axios error)
}
```

---

## 4. Fetch vs Axios Comparison

| Feature | `fetch()` | Axios |
|---------|----------|-------|
| **Type** | Built-in browser API | Third-party library (npm install) |
| **JSON parsing** | Manual (`response.json()`) | Automatic (`response.data`) |
| **Error on non-2xx** | No - must check `response.ok` manually | Yes - automatically throws |
| **Request body** | Must `JSON.stringify()` manually | Automatic serialization |
| **Query params** | Must build URL string manually | `{ params: {} }` object |
| **Timeout** | Use `AbortController` | Built-in `timeout` option |
| **Interceptors** | Not available | Built-in request/response interceptors |
| **Cancel requests** | `AbortController` | `CancelToken` or `AbortController` |
| **Progress tracking** | Limited | Built-in upload/download progress |
| **Browser support** | Modern browsers only | All browsers (includes polyfill) |
| **Node.js** | Requires `node-fetch` or Node 18+ | Works natively |
| **Bundle size** | 0 KB (built-in) | ~13 KB |

---

## 5. When to Use Which

### Use `fetch()` When:
- Building lightweight projects with minimal dependencies
- Targeting modern browsers only
- You don't need interceptors, timeouts, or progress tracking
- Bundle size is a concern

### Use Axios When:
- Building larger applications with complex API interactions
- You need interceptors for auth tokens, logging, etc.
- You want automatic error handling for non-2xx responses
- You need request cancellation or timeout support
- You need to support older browsers
- Working with both browser and Node.js environments

---

## 6. Complete Examples

### Fetch - Full CRUD

```javascript
const API = "https://api.example.com";

// GET
async function getUsers() {
  const res = await fetch(`${API}/users`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// POST
async function createUser(data) {
  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// PUT
async function updateUser(id, data) {
  const res = await fetch(`${API}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// DELETE
async function deleteUser(id) {
  const res = await fetch(`${API}/users/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
```

### Axios - Full CRUD

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: { "Content-Type": "application/json" }
});

// GET
const getUsers = () => api.get("/users").then(res => res.data);

// POST
const createUser = (data) => api.post("/users", data).then(res => res.data);

// PUT
const updateUser = (id, data) => api.put(`/users/${id}`, data).then(res => res.data);

// DELETE
const deleteUser = (id) => api.delete(`/users/${id}`);
```

---

## 7. Summary

- **AJAX** is the technique/concept for making async HTTP requests from the browser
- **`fetch()`** is the modern built-in API - lightweight, promise-based, but requires manual JSON parsing and error checking
- **Axios** is a third-party library - feature-rich, automatic JSON, automatic error throwing, interceptors, and more
- Both `fetch()` and Axios work with **Promises** and **async/await**
- Choose `fetch()` for simplicity and small projects; choose Axios for larger apps needing advanced features
