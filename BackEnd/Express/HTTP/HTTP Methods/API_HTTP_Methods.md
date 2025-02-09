# HTTP Methods API Documentation

## 1. GET
The **GET** method is used to retrieve data from a server. It does not modify any data. Data to filter responses is usually sent via query parameters or path parameters in the URL.

### Request (REQ):
- **URL Parameters (`req.params`)**: The identifier for the resource to be **FETCHED**.
  - **Example**: `/api/items/:id` → `req.params.id` would capture the `id` of the resource.

### Response (RES):
- Typically returns the requested resource data with a **200 OK** status.
- `res.json({})`: Sends the retrieved data as a JSON response.

### Example:
```javascript
app.get('/EndPoint_URL/:id', validations, Function);
```

---

## 2. POST
The **POST** method is used to create a new resource on the server. It typically sends data in the body of the request.

### Request (REQ):
- **Body Parameters (`req.body`)**: The data to be sent to create the new resource.
  - **Example**: `req.body = { "name": "New Item", "category": "books" }`

### Response (RES):
- Typically returns a **201 Created** status and the created resource.
- `res.json({})`: Sends the created resource data as a JSON response.

### Example:
```javascript
app.post('/EndPoint_URL', validations, Function);
```

---

## 3. PUT
The **PUT** method is used to completely replace an existing resource on the server. The client sends the entire updated resource in the body of the request.

### Request (REQ):
- **URL Parameters (`req.params`)**: The identifier for the resource to be updated.
  - **Example**: `/api/items/:id` → `req.params.id` would capture the `id` of the resource.
- **Body Parameters (`req.body`)**: The updated resource data.
  - **Example**: `req.body = { "name": "Updated Item", "category": "books" }`

### Response (RES):
- Typically returns a **200 OK** status and the updated resource.
- `res.json({})`: Sends the updated resource data as a JSON response.

### Example:
```javascript
app.put('/EndPoint_URL', validations, Function);
```

---

## 4. PATCH
The **PATCH** method is used to partially update an existing resource on the server. It only modifies the fields provided in the request body.

### Request (REQ):
- **URL Parameters (`req.params`)**: The identifier for the resource to be updated.
  - **Example**: `/api/items/:id` → `req.params.id` captures the `id` of the resource.
- **Body Parameters (`req.body`)**: The fields to be updated.
  - **Example**: `req.body = { "name": "Partially Updated Item" }`

### Response (RES):
- Typically returns a **200 OK** status and the partially updated resource.
- `res.json({})`: Sends the partially updated resource data as a JSON response.

### Example:
```javascript
app.patch('/EndPoint_URL', validations, Function);
```

---

### PUT vs PATCH
- The **PUT** method is used to **completely replace** an existing resource or create a new one if it doesn’t exist, where the entire resource is provided in the request body, and missing parts are replaced with default or null values.
- The **PATCH** method, on the other hand, is used to **partially update** an existing resource by only providing the fields you want to update, making it more efficient for partial updates.

---

## 5. DELETE
The **DELETE** method is used to delete an existing resource from the server.

### Request (REQ):
- **URL Parameters (`req.params`)**: The identifier for the resource to be deleted.
  - **Example**: `/api/items/:id` → `req.params.id` captures the `id` of the resource.

### Response (RES):
- Typically returns a **200 OK** status or **204 No Content** if the resource was successfully deleted.
- `res.json({})`: Sends a success message or a confirmation of deletion.

### Example:
```javascript
app.delete('/EndPoint_URL/:id', validations, Function);