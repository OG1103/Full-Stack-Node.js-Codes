# HTTP Status Codes

## 1. Overview

HTTP status codes are three-digit numbers returned by the server in the response status line. They indicate the outcome of the client's request. Status codes are grouped into five categories based on their first digit.

```
HTTP/1.1 200 OK
         ^^^
         Status Code
```

---

## 2. Status Code Categories

| Range | Category | Description |
|-------|----------|-------------|
| 1xx | Informational | Request received, processing continues |
| 2xx | Success | Request was successfully received, understood, and accepted |
| 3xx | Redirection | Further action needed to complete the request |
| 4xx | Client Error | The request contains an error from the client side |
| 5xx | Server Error | The server failed to fulfill a valid request |

---

## 3. Success Codes (2xx)

### 200 OK

The request succeeded. The meaning depends on the HTTP method used.

```javascript
app.get('/api/users', (req, res) => {
  const users = [{ id: 1, name: 'Alice' }];
  res.status(200).json(users);
});
```

### 201 Created

A new resource was successfully created. Typically returned for POST requests.

```javascript
app.post('/api/users', (req, res) => {
  const newUser = { id: 1, ...req.body };
  res.status(201).json(newUser);
});
```

### 204 No Content

The request succeeded but there is no content to return. Often used for DELETE requests.

```javascript
app.delete('/api/users/:id', (req, res) => {
  // Resource deleted successfully
  res.status(204).send();
});
```

---

## 4. Redirection Codes (3xx)

### 301 Moved Permanently

The resource has been permanently moved to a new URL.

```javascript
app.get('/old-page', (req, res) => {
  res.redirect(301, '/new-page');
});
```

### 302 Found (Temporary Redirect)

The resource is temporarily at a different URL.

```javascript
app.get('/temp', (req, res) => {
  res.redirect(302, '/temporary-location');
});
```

### 304 Not Modified

The resource has not changed since the last request. The client can use its cached version.

---

## 5. Client Error Codes (4xx)

### 400 Bad Request

The server cannot process the request due to malformed syntax or invalid data.

```javascript
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Name and email are required',
    });
  }

  res.status(201).json({ id: 1, name, email });
});
```

### 401 Unauthorized

The client must authenticate itself to get the requested response. The request lacks valid authentication credentials.

```javascript
app.get('/api/profile', (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token is required',
    });
  }

  res.json({ user: 'Alice' });
});
```

### 403 Forbidden

The client is authenticated but does not have permission to access the resource.

```javascript
app.delete('/api/users/:id', (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required',
    });
  }

  res.status(204).send();
});
```

### 404 Not Found

The server cannot find the requested resource.

```javascript
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({
      error: 'Not Found',
      message: `User with id ${req.params.id} not found`,
    });
  }

  res.json(user);
});
```

### 409 Conflict

The request conflicts with the current state of the server (e.g., duplicate resource).

```javascript
app.post('/api/users', (req, res) => {
  const existingUser = users.find(u => u.email === req.body.email);

  if (existingUser) {
    return res.status(409).json({
      error: 'Conflict',
      message: 'A user with this email already exists',
    });
  }

  res.status(201).json({ id: 2, ...req.body });
});
```

### 422 Unprocessable Entity

The server understands the request but cannot process it due to semantic errors (e.g., validation failures).

```javascript
app.post('/api/users', (req, res) => {
  const errors = validateUser(req.body);

  if (errors.length > 0) {
    return res.status(422).json({
      error: 'Unprocessable Entity',
      details: errors,
    });
  }

  res.status(201).json({ id: 1, ...req.body });
});
```

### 429 Too Many Requests

The client has sent too many requests in a given time period (rate limiting).

---

## 6. Server Error Codes (5xx)

### 500 Internal Server Error

A generic error when the server encounters an unexpected condition.

```javascript
app.get('/api/data', async (req, res) => {
  try {
    const data = await fetchFromDatabase();
    res.json(data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong on the server',
    });
  }
});
```

### 502 Bad Gateway

The server received an invalid response from an upstream server.

### 503 Service Unavailable

The server is temporarily unable to handle the request (overloaded or under maintenance).

---

## 7. Using the `http-status-codes` Package

Instead of hardcoding numeric status codes, use the `http-status-codes` package for readable, self-documenting code.

### Installation

```bash
npm install http-status-codes
```

### Usage

```javascript
import express from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

const app = express();
app.use(express.json());

app.get('/api/users', (req, res) => {
  res.status(StatusCodes.OK).json({ users: [] });
  // StatusCodes.OK === 200
});

app.post('/api/users', (req, res) => {
  if (!req.body.name) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: getReasonPhrase(StatusCodes.BAD_REQUEST), // "Bad Request"
      message: 'Name is required',
    });
  }

  res.status(StatusCodes.CREATED).json({ id: 1, ...req.body });
  // StatusCodes.CREATED === 201
});

app.get('/api/users/:id', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    error: 'Resource not found',
  });
  // StatusCodes.NOT_FOUND === 404
});
```

### Commonly Used Constants

| Constant | Value | Reason Phrase |
|----------|-------|---------------|
| `StatusCodes.OK` | 200 | OK |
| `StatusCodes.CREATED` | 201 | Created |
| `StatusCodes.NO_CONTENT` | 204 | No Content |
| `StatusCodes.BAD_REQUEST` | 400 | Bad Request |
| `StatusCodes.UNAUTHORIZED` | 401 | Unauthorized |
| `StatusCodes.FORBIDDEN` | 403 | Forbidden |
| `StatusCodes.NOT_FOUND` | 404 | Not Found |
| `StatusCodes.CONFLICT` | 409 | Conflict |
| `StatusCodes.UNPROCESSABLE_ENTITY` | 422 | Unprocessable Entity |
| `StatusCodes.INTERNAL_SERVER_ERROR` | 500 | Internal Server Error |

---

## 8. Best Practices

1. **Use specific status codes**: Return `201` for creation, `204` for deletion, not just `200` for everything.
2. **Include error details**: Always return a meaningful error message in the response body.
3. **Use constants**: Prefer `StatusCodes.NOT_FOUND` over `404` for readability.
4. **Distinguish 401 vs 403**: Use `401` when the user is not authenticated, `403` when they are authenticated but lack permission.
5. **Distinguish 400 vs 422**: Use `400` for malformed requests, `422` for syntactically valid but semantically invalid data.

---

## 9. Summary

| Status Code | Name | When to Use |
|-------------|------|-------------|
| 200 | OK | Successful GET, PUT, PATCH requests |
| 201 | Created | Successful POST that created a resource |
| 204 | No Content | Successful DELETE with no response body |
| 400 | Bad Request | Missing or malformed request data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Duplicate resource or conflicting state |
| 422 | Unprocessable Entity | Validation errors on semantically invalid data |
| 500 | Internal Server Error | Unexpected server-side failure |
