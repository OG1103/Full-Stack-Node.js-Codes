# HTTP Methods

## 1. Overview

HTTP methods (also called **verbs**) define the action to be performed on a resource. Each method has a specific purpose in the context of RESTful APIs. Express provides a corresponding method on the `app` object for each HTTP verb.

```javascript
app.get(path, handler);     // Retrieve
app.post(path, handler);    // Create
app.put(path, handler);     // Replace
app.patch(path, handler);   // Partial update
app.delete(path, handler);  // Delete
```

---

## 2. GET

The **GET** method retrieves data from the server. It does not modify any data and is considered a **safe** and **idempotent** method.

- Data is sent via URL parameters (`req.params`) or query strings (`req.query`), never in the request body.
- Returns the requested resource with a **200 OK** status.

```javascript
// Get all users
app.get('/api/users', (req, res) => {
  // Query parameters: GET /api/users?page=2&limit=10
  const { page = 1, limit = 10 } = req.query;
  res.status(200).json({ users: [], page, limit });
});

// Get a single user by ID
app.get('/api/users/:id', (req, res) => {
  // URL parameter: GET /api/users/42
  const { id } = req.params;
  res.status(200).json({ userId: id, name: 'Alice' });
});
```

---

## 3. POST

The **POST** method creates a new resource on the server. Data is sent in the request body (`req.body`).

- Not idempotent: sending the same POST request multiple times may create multiple resources.
- Returns a **201 Created** status and typically the created resource.

```javascript
app.post('/api/users', (req, res) => {
  // Request body: { "name": "Alice", "email": "alice@example.com" }
  const { name, email } = req.body;

  // Create the resource (e.g., save to database)
  const newUser = { id: 1, name, email };

  res.status(201).json(newUser);
});
```

---

## 4. PUT

The **PUT** method **completely replaces** an existing resource with the data provided in the request body. If the resource does not exist, some APIs create it.

- Idempotent: sending the same PUT request multiple times produces the same result.
- The entire resource must be provided in the body; missing fields are set to default or null values.
- Returns a **200 OK** status and the updated resource.

```javascript
app.put('/api/users/:id', (req, res) => {
  // URL parameter: identifies which resource to replace
  const { id } = req.params;

  // Request body: the complete updated resource
  // { "name": "Alice Updated", "email": "alice.new@example.com" }
  const { name, email } = req.body;

  const updatedUser = { id, name, email };
  res.status(200).json(updatedUser);
});
```

---

## 5. PATCH

The **PATCH** method **partially updates** an existing resource. Only the fields provided in the request body are modified; all other fields remain unchanged.

- More efficient than PUT when only a few fields need updating.
- Returns a **200 OK** status and the updated resource.

```javascript
app.patch('/api/users/:id', (req, res) => {
  // URL parameter: identifies which resource to update
  const { id } = req.params;

  // Request body: only the fields to update
  // { "name": "Alice Updated" }
  const updates = req.body;

  // Merge updates with existing resource
  const updatedUser = { id, ...existingUser, ...updates };
  res.status(200).json(updatedUser);
});
```

### PUT vs PATCH

| Aspect | PUT | PATCH |
|--------|-----|-------|
| Update scope | Replaces the **entire** resource | Updates **only** the provided fields |
| Request body | Must contain **all** fields | Contains only the fields to change |
| Missing fields | Set to default/null | Left unchanged |
| Idempotent | Yes | Not necessarily |
| Use case | Full resource replacement | Partial field updates |

---

## 6. DELETE

The **DELETE** method removes a resource from the server.

- The resource to delete is identified by URL parameters (`req.params`).
- Returns a **200 OK** with a confirmation message or **204 No Content** with no body.

```javascript
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  // Delete the resource (e.g., remove from database)

  // Option 1: 200 with confirmation message
  res.status(200).json({ message: `User ${id} deleted` });

  // Option 2: 204 with no body
  // res.status(204).send();
});
```

---

## 7. Additional Methods

### app.all() - Match All Methods

Matches **any** HTTP method for a given path. Useful for middleware that should run regardless of the method.

```javascript
app.all('/api/admin/*', (req, res, next) => {
  // Runs for GET, POST, PUT, PATCH, DELETE, etc.
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

### HEAD

Similar to GET but returns only headers (no body). Used to check if a resource exists or to read metadata.

### OPTIONS

Returns the allowed HTTP methods for a URL. Used in CORS preflight requests.

---

## 8. Method Properties

| Method | Safe | Idempotent | Has Body |
|--------|------|------------|----------|
| GET | Yes | Yes | No |
| POST | No | No | Yes |
| PUT | No | Yes | Yes |
| PATCH | No | No | Yes |
| DELETE | No | Yes | No |
| HEAD | Yes | Yes | No |
| OPTIONS | Yes | Yes | No |

- **Safe**: Does not modify the resource on the server.
- **Idempotent**: Multiple identical requests produce the same result as a single request.
- **Has Body**: Whether the request typically includes a body.

---

## 9. Summary

| Method | Purpose | Request Data | Typical Status |
|--------|---------|-------------|----------------|
| `GET` | Retrieve a resource | `req.params`, `req.query` | 200 OK |
| `POST` | Create a new resource | `req.body` | 201 Created |
| `PUT` | Replace an entire resource | `req.params`, `req.body` | 200 OK |
| `PATCH` | Partially update a resource | `req.params`, `req.body` | 200 OK |
| `DELETE` | Delete a resource | `req.params` | 200 OK / 204 No Content |
