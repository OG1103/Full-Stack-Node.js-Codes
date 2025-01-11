# Understanding the Request (`req`) Object in Express

## Introduction
The `req` (request) object in Express contains data that the client sends to the server. This data can include **URL parameters**, **query parameters**, **body data**, and **headers**. Understanding how to work with `req` is essential for handling incoming requests effectively.

---

## Key Components of the Request (`req`) Object

### 1. URL Parameters (`req.params`)
- **URL parameters** are variables extracted from the URL.
- These parameters are defined in the route path using a colon (`:`) and are accessible via `req.params`.

#### Example:
```javascript
app.get('/api/items/:id', (req, res) => {
    const itemId = req.params.id; // Captures the id from the URL as a string
    res.send(`Item ID: ${itemId}`);
});
```
- If the URL is `/api/items/123`, `req.params.id` will be `"123"`.

- You can define multiple parameters in the URL:
```javascript
app.get('/api_name/:param1/:param2', (req, res) => {
    const { param1, param2 } = req.params;
    res.send(`Param1: ${param1}, Param2: ${param2}`);
});
```

---

### 2. Query Parameters (`req.query`)
- **Query parameters** are optional parameters sent via the query string in the URL.
- They are appended to the URL after a `?` and are accessible via `req.query`.

#### Example:
```javascript
app.get('/api/items', (req, res) => {
    const category = req.query.category; // Captures the category from the query string
    res.send(`Category: ${category}`);
});
```
- If the URL is `/api/items?category=books`, `req.query.category` will be `"books"`.

---

### 3. Body Parameters (`req.body`)
- **Body parameters** are data sent in the request body, often used in **POST**, **PUT**, or **PATCH** requests.
- Typically, body data is sent in **JSON** or **form-data** format and is accessible via `req.body`.

#### Example:
```javascript
app.post('/api/users', (req, res) => {
    const { name, age } = req.body; // Destructuring req.body to extract name and age
    res.send(`User Name: ${name}, Age: ${age}`);
});
```
- If the request body is:
  ```json
  {
    "name": "John",
    "age": 30
  }
  ```
  then `name` will be `"John"` and `age` will be `30`.

#### Object Destructuring with `req.body`
- You can destructure multiple values from `req.body` in one step:
  ```javascript
  const { name, age } = req.body;
  ```
  - This approach simplifies the process of accessing multiple values at once.
  - **Note**: The variable names must match the key names in `req.body` exactly.

- **Aliasing Destructured Variables**:
  If you want to use different variable names, you can alias them using a colon (`:`):
  ```javascript
  const { name: userName, age: userAge } = req.body;
  ```
  - `userName` will contain the value of `req.body.name`.
  - `userAge` will contain the value of `req.body.age`.

---

### 4. Headers (`req.headers`)
- **Headers** contain metadata sent with the request, such as authentication tokens or API keys.
- They are accessible via `req.headers`.

#### Example:
```javascript
app.get('/api/auth', (req, res) => {
    const authToken = req.headers.authorization; // Captures the authorization header
    res.send(`Authorization Token: ${authToken}`);
});
```
- If the request includes a header like:
  ```
  Authorization: Bearer token123
  ```
  then `req.headers.authorization` will be `"Bearer token123"`.

---

## Structure of `req.body`, `req.params`, and `req.query`

| Component    | Description                                                  | Example                                                                 |
|--------------|--------------------------------------------------------------|------------------------------------------------------------------------|
| `req.body`   | Returns an object where keys are the names of the fields sent by the client and values are the corresponding data. | `{ "name": "John", "age": 30 }`                                      |
| `req.params` | Returns an object where keys are the parameter names defined in the route and values are the actual values passed in the URL. | `{ "id": "123" }` (if URL is `/api/items/123`)                         |
| `req.query`  | Returns an object where keys are the query parameter names and values are the corresponding values. | `{ "category": "books" }` (if URL is `/api/items?category=books`)      |

Since they all return objects, you can access specific values using dot notation:
```javascript
req.body.name // Accesses the name field in the request body
req.params.id // Accesses the id parameter in the URL
req.query.category // Accesses the category query parameter
```

---

## When to Use `req.body`, `req.params`, and `req.query`

### When to Use `req.body`
- Typically used in **POST**, **PUT**, and **PATCH** methods.
- Use `req.body` when you want to **create** or **update** a resource on the server.
- **Example Use Cases**:
  - Creating a new user.
  - Updating user profile data.
  - Submitting form data.
- **Note**: Data in `req.body` is sent as part of the request body and is **not visible in the URL**.

### When to Use `req.params`
- Often used in **GET**, **DELETE**, and **PUT** requests.
- Use `req.params` when you want to pass **dynamic segments** in the URL to specify which resource is being accessed or modified.
- **Example Use Cases**:
  - Fetching a specific user by ID (`/users/:userId`).
  - Deleting a specific product by ID (`/products/:productId`).
- **Note**: Params are part of the **URL path** and are always **required**.

### When to Use `req.query`
- Commonly used in **GET** methods.
- Use `req.query` when you need to pass **optional data** for filtering, sorting, or searching results.
- **Example Use Cases**:
  - Searching for users (`/search?q=keyword`).
  - Filtering products (`/products?category=electronics`).
  - Sorting results (`/users?sortBy=name`).
- **Note**: Query parameters are **appended to the URL** after a `?` and are **optional**.

---

## Summary of Method Usage
- **`req.body`**: Used in **POST**, **PUT**, and **PATCH** methods to send data for resource creation or updates.
- **`req.params`**: Used in **GET**, **DELETE**, and **PUT** methods for dynamic segments in the URL to specify which resource is being accessed or modified.
- **`req.query`**: Used in **GET** methods to pass optional data for filtering, sorting, or searching results in a request.
- If we need to access the returned value from params or query or body, we need to parse it as it will always be returned as a string. 

## Important Note
- The values retrieved from `req.body`, `req.params`, and `req.query` are always returned as strings. Therefore, if you need to work with numbers or other data types, ensure proper parsing (e.g., using parseInt() for integers or parseFloat() for  floating-point (decimal) numbers or Number() for numbers or JSON.parse() for JSON strings).

---

## References
- [Express.js Documentation - Request](https://expressjs.com/en/api.html#req)
- [Node.js Documentation](https://nodejs.org/en/docs/)
