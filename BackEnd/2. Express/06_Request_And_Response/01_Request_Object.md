# The Request Object (`req`) in Express

## Table of Contents

- [Overview](#overview)
- [req.params - Route Parameters](#reqparams---route-parameters)
- [req.query - Query Strings](#reqquery---query-strings)
- [req.body - Request Body](#reqbody---request-body)
- [req.headers - Request Headers](#reqheaders---request-headers)
- [Comparison Table](#comparison-table)
- [Important Note: String Parsing](#important-note-string-parsing)

---

## Overview

The `req` (request) object represents the HTTP request received by the server. It contains all the data sent by the client, including URL parameters, query strings, body payload, headers, cookies, and more.

Express automatically creates this object for every incoming request and passes it as the first argument to route handlers and middleware functions.

```js
import express from "express";
const app = express();

app.get("/example", (req, res) => {
  // req is the request object
  // It holds everything about the incoming HTTP request
  console.log(req.method); // "GET"
  console.log(req.url); // "/example"
  console.log(req.path); // "/example"
  console.log(req.protocol); // "http" or "https"
  console.log(req.hostname); // "localhost"
  console.log(req.ip); // Client IP address
});
```

---

## req.params - Route Parameters

Route parameters are named URL segments used to capture values at specific positions in the URL. They are defined in the route path using a colon (`:`) prefix.

### Basic Usage

```js
// Route definition with a parameter
app.get("/users/:userId", (req, res) => {
  console.log(req.params); // { userId: "42" }
  console.log(req.params.userId); // "42"
  res.json({ userId: req.params.userId });
});

// GET /users/42 => req.params = { userId: "42" }
// GET /users/abc => req.params = { userId: "abc" }
```

### Multiple Route Parameters

```js
app.get("/users/:userId/posts/:postId", (req, res) => {
  console.log(req.params);
  // { userId: "5", postId: "12" }

  const { userId, postId } = req.params;
  res.json({ userId, postId });
});

// GET /users/5/posts/12 => { userId: "5", postId: "12" }
```

### Values Are Always Strings

This is a critical point. No matter what the URL contains, `req.params` values are **always strings**. You must parse them manually when you need a number.

```js
app.get("/products/:id", (req, res) => {
  const { id } = req.params;

  console.log(typeof id); // "string" -- always a string

  // Convert to a number when needed
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return res.status(400).json({ error: "ID must be a number" });
  }

  res.json({ id: numericId });
});
```

### Destructuring Params

Destructuring is the cleanest way to extract route parameters.

```js
app.get("/courses/:courseId/lessons/:lessonId", (req, res) => {
  // Destructure directly from req.params
  const { courseId, lessonId } = req.params;

  res.json({
    course: Number(courseId),
    lesson: Number(lessonId),
  });
});
```

### When to Use `req.params`

- Identifying a **specific resource** (e.g., a user, a product, a post).
- The value is **required** -- without it, the route simply does not match.
- Semantically part of the resource path: `/users/5` means "user number 5."

---

## req.query - Query Strings

Query strings are key-value pairs appended to the URL after a `?`. They are typically used for optional filtering, sorting, searching, and pagination.

### Basic Usage

```js
app.get("/search", (req, res) => {
  console.log(req.query);
  // For URL: /search?term=express&page=2
  // { term: "express", page: "2" }

  const { term, page } = req.query;
  res.json({ term, page });
});
```

### Query Parameters Are Optional

Unlike route parameters, query parameters are entirely optional. If the client does not provide them, they are `undefined`.

```js
app.get("/products", (req, res) => {
  const { category, sort, page } = req.query;

  // Provide defaults for missing values
  const currentPage = Number(page) || 1;
  const sortBy = sort || "createdAt";

  res.json({
    category: category || "all",
    sortBy,
    currentPage,
  });
});

// GET /products                     => { category: "all", sortBy: "createdAt", currentPage: 1 }
// GET /products?category=books      => { category: "books", sortBy: "createdAt", currentPage: 1 }
// GET /products?sort=price&page=3   => { category: "all", sortBy: "price", currentPage: 3 }
```

### Multiple Values for the Same Key

When the same query key appears more than once, Express can return it as an array or a single string depending on how many times it appears. This inconsistency requires careful handling.

```js
app.get("/filter", (req, res) => {
  const { color } = req.query;

  console.log(color);
  // GET /filter?color=red          => "red"       (string)
  // GET /filter?color=red&color=blue => ["red", "blue"] (array)

  res.json({ color });
});
```

### Safe Array Handling

Because the type changes depending on how many values the client sends, always normalize to an array when you expect multiple values.

```js
app.get("/filter", (req, res) => {
  const { color } = req.query;

  // Normalize: ensure color is always an array
  const colors = Array.isArray(color) ? color : color ? [color] : [];

  // Alternative using [].concat()
  // const colors = color ? [].concat(color) : [];

  console.log(colors); // Always an array, even if empty

  res.json({ colors });
});

// GET /filter                        => { colors: [] }
// GET /filter?color=red              => { colors: ["red"] }
// GET /filter?color=red&color=blue   => { colors: ["red", "blue"] }
```

### When to Use `req.query`

- **Filtering**: `/products?category=electronics&brand=apple`
- **Sorting**: `/products?sort=price&order=desc`
- **Pagination**: `/products?page=2&limit=20`
- **Searching**: `/search?q=nodejs+tutorial`
- Any data that is **optional** and does not identify a specific resource.

---

## req.body - Request Body

`req.body` contains data sent in the body of the request. This is used with POST, PUT, and PATCH requests to send structured data (usually JSON) from the client to the server.

### Requires Middleware

**`req.body` is `undefined` by default.** You must use the built-in `express.json()` middleware to parse incoming JSON payloads.

```js
import express from "express";
const app = express();

// This middleware parses JSON request bodies
// Without this line, req.body is undefined
app.use(express.json());
```

### Basic Usage

```js
app.use(express.json());

app.post("/users", (req, res) => {
  console.log(req.body);
  // { name: "Alice", email: "alice@example.com", age: 25 }

  const { name, email, age } = req.body;

  // Use the data to create a user, save to DB, etc.
  res.status(201).json({
    message: "User created",
    user: { name, email, age },
  });
});
```

### Destructuring with Aliasing

Sometimes the client sends field names that differ from what you want to use internally. Destructuring with aliases solves this cleanly.

```js
app.post("/register", (req, res) => {
  // Rename fields during destructuring
  const {
    first_name: firstName,
    last_name: lastName,
    email_address: email,
  } = req.body;

  // Now use the renamed variables
  console.log(firstName); // Value from req.body.first_name
  console.log(lastName); // Value from req.body.last_name
  console.log(email); // Value from req.body.email_address

  res.status(201).json({ firstName, lastName, email });
});
```

### Nested Body Data

```js
app.post("/orders", (req, res) => {
  const { customer, items, shippingAddress } = req.body;

  // Nested destructuring
  const { street, city, zip } = shippingAddress;

  console.log(customer); // { name: "Bob", email: "bob@example.com" }
  console.log(items); // [{ product: "Laptop", qty: 1 }]
  console.log(street, city, zip);

  res.status(201).json({ message: "Order placed" });
});
```

### When to Use `req.body`

- **Creating** a new resource (POST).
- **Updating** an existing resource (PUT / PATCH).
- Sending complex or sensitive data that should not appear in the URL.
- Sending large payloads (JSON objects, arrays, nested data).

---

## req.headers - Request Headers

Headers carry metadata about the request: authentication tokens, content types, accepted formats, custom values, and more.

### Accessing Headers

```js
app.get("/profile", (req, res) => {
  // req.headers is a plain object with all headers (lowercase keys)
  console.log(req.headers);
  // {
  //   "host": "localhost:3000",
  //   "authorization": "Bearer eyJhbGci...",
  //   "content-type": "application/json",
  //   "user-agent": "Mozilla/5.0 ..."
  // }

  // Access a specific header directly
  const authHeader = req.headers["authorization"];
  // OR use the req.get() helper (case-insensitive)
  const authHeader2 = req.get("Authorization");

  console.log(authHeader); // "Bearer eyJhbGci..."
  console.log(authHeader2); // "Bearer eyJhbGci..."

  res.json({ authHeader });
});
```

### Authorization Header Pattern

The Authorization header is the most commonly accessed header. It typically carries a Bearer token.

```js
app.get("/dashboard", (req, res) => {
  const authHeader = req.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Extract the token (remove "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  console.log(token); // "eyJhbGci..."

  // Verify the token, then respond
  res.json({ message: "Authenticated", token });
});
```

### Custom Headers

Custom headers traditionally use an `X-` prefix, though this convention is now considered optional.

```js
app.get("/data", (req, res) => {
  const requestId = req.get("X-Request-Id");
  const clientVersion = req.get("X-Client-Version");

  console.log(requestId); // "abc-123"
  console.log(clientVersion); // "2.1.0"

  res.json({ requestId, clientVersion });
});
```

### When to Use `req.headers`

- **Authentication**: Bearer tokens, API keys.
- **Content negotiation**: `Accept`, `Content-Type`.
- **Client metadata**: `User-Agent`, `X-Client-Version`.
- **Custom application data**: request IDs, correlation IDs, feature flags.

---

## Comparison Table

| Property       | Source              | Required? | Typical Use Case                     | Example URL / Data                        |
| -------------- | ------------------- | --------- | ------------------------------------ | ----------------------------------------- |
| `req.params`   | URL path segments   | Yes       | Identify a specific resource         | `/users/:id` -> `/users/42`               |
| `req.query`    | URL query string    | No        | Filter, sort, paginate, search       | `/products?page=2&sort=price`             |
| `req.body`     | Request body (JSON) | No        | Create/update data (POST, PUT, PATCH)| `{ "name": "Alice", "email": "a@b.com" }`|
| `req.headers`  | HTTP headers        | No        | Auth tokens, metadata, content type  | `Authorization: Bearer eyJ...`            |

### Quick Decision Guide

1. **Need to identify a specific resource?** Use `req.params`.
2. **Need optional filtering / pagination?** Use `req.query`.
3. **Need to send structured data to create or update?** Use `req.body`.
4. **Need metadata like auth tokens?** Use `req.headers`.

---

## Important Note: String Parsing

Everything that comes from the URL (`req.params` and `req.query`) is a **string**. This is one of the most common sources of bugs in Express applications.

```js
app.get("/items/:id", (req, res) => {
  const { id } = req.params;
  const { page, limit } = req.query;

  // All of these are strings
  console.log(typeof id);    // "string"
  console.log(typeof page);  // "string" (or "undefined" if not provided)
  console.log(typeof limit); // "string" (or "undefined" if not provided)

  // WRONG: string comparison can produce unexpected results
  // "10" > "9" is false because string comparison is character-by-character

  // CORRECT: always parse to the expected type
  const numericId = Number(id);
  const currentPage = parseInt(page, 10) || 1;
  const itemsPerPage = parseInt(limit, 10) || 10;

  // Validate after parsing
  if (isNaN(numericId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  res.json({ id: numericId, currentPage, itemsPerPage });
});
```

### Boolean Query Parameters

A common trap: query parameters like `?active=true` give you the **string** `"true"`, not the boolean `true`.

```js
app.get("/users", (req, res) => {
  const { active } = req.query;

  console.log(active);         // "true" (a string)
  console.log(typeof active);  // "string"
  console.log(active === true); // false -- this comparison fails

  // Correct: compare against the string "true"
  const isActive = active === "true";

  res.json({ isActive }); // { isActive: true }
});
```

### Summary of Parsing Best Practices

| Type Expected | Parse Method                   | Fallback Example            |
| ------------- | ------------------------------ | --------------------------- |
| Number        | `Number(val)` or `parseInt(val, 10)` | `Number(page) \|\| 1`    |
| Boolean       | `val === "true"`               | `active === "true"`         |
| Array          | `Array.isArray(val) ? val : [val]` | See safe array handling above |

Always validate after parsing and provide meaningful error responses when values are not in the expected format.
