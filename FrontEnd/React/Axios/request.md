# 📦 Axios Request Guide

Axios is a popular JavaScript library used to make HTTP requests from the browser or Node.js. It supports all major HTTP methods including GET, POST, PUT, PATCH, and DELETE.

---

## ✅ Importing Axios

```js
import axios from "axios";
```

---

## 📥 GET Request

### 🔹 Use Case: Retrieve data

#### 🔧 Basic Syntax

```js
axios.get(url);
```

- Sends a request with no body and no query parameters.

#### 🔧 With Query Parameters

```js
axios.get(url, { params: { key: value } });
```

- Sends key-value pairs as query parameters (e.g., `?key=value`).

#### ✅ Example

```js
axios.get("https://api.example.com/courses", {
  params: {
    category: "tech", // category is a query parameter
    tags: ["a", "b"], // array passed as repeated query keys: ?tags=a&tags=b just like post-man.
  },
});
```

- Axios automatically converts arrays into repeated query parameters (similar to Postman). In Express, when the same query key appears multiple times, req.query["property"] is parsed as an array containing all the values.

---

## 📤 POST Request

### 🔹 Use Case: Create new data

#### 🔧 Basic Syntax

```js
axios.post(url);
```

- Sends a POST request with no body or params.

#### 🔧 With Body Only

```js
axios.post(url, bodyObject);
```

- Sends data in the request body.

#### 🔧 With Query Parameters Only

```js
axios.post(url, null, { params: { key: value } });
```

- Sends data only as query parameters, no body.

#### 🔧 With Both Body and Params

```js
axios.post(url, bodyObject, { params: { key: value } });
```

- Sends data in both the body and the query string.

#### ✅ Example

```js
axios.post(
  "https://api.example.com/courses",
  {
    title: "JavaScript Basics", // this is body data
    category: "tech",
    tags: ["a", "b"], // passed in body
  },
  {
    params: {
      admin: true, // passed in query string: ?admin=true
    },
  }
);
```

---

## 🛠️ PATCH Request

### 🔹 Use Case: Partially update existing data

#### 🔧 Basic Syntax

```js
axios.patch(url);
```

- Sends a PATCH request with no body or params.

#### 🔧 With Body Only

```js
axios.patch(url, bodyObject);
```

- Sends partial data to update in the body.

#### 🔧 With Query Parameters Only

```js
axios.patch(url, null, { params: { key: value } });
```

- Sends query string data only.

#### 🔧 With Both Body and Params

```js
axios.patch(url, bodyObject, { params: { key: value } });
```

#### ✅ Example

```js
axios.patch(
  "https://api.example.com/courses/123",
  {
    title: "Updated Title", // update title in the body
  },
  {
    params: { notify: true }, // ?notify=true in query string
  }
);
```

---

## 🧱 PUT Request

### 🔹 Use Case: Replace entire resource

#### 🔧 Basic Syntax

```js
axios.put(url);
```

- PUT request with no body or parameters.

#### 🔧 With Body Only

```js
axios.put(url, bodyObject);
```

- Replace the whole resource with the provided body.

#### 🔧 With Query Parameters Only

```js
axios.put(url, null, { params: { key: value } });
```

- Replace via query string instructions only.

#### 🔧 With Both Body and Params

```js
axios.put(url, bodyObject, { params: { key: value } });
```

#### ✅ Example

```js
axios.put(
  "https://api.example.com/courses/123",
  {
    title: "New Title", // full object sent in body to replace existing one
    category: "tech",
  },
  {
    params: { admin: true }, // optional query param
  }
);
```

---

## ❌ DELETE Request

### 🔹 Use Case: Delete a resource

#### 🔧 Basic Syntax

```js
axios.delete(url);
```

- Sends a basic DELETE request, no body or params.

#### 🔧 With Query Parameters Only

```js
axios.delete(url, { params: { key: value } });
```

- Use when the item to delete is identified via query string.

#### 🔧 With Body Only (if backend allows it)

```js
axios.delete(url, { data: { key: value } });
```

- Include a body to explain the delete reason or filters.

#### ✅ Examples

```js
// With query parameters
axios.delete("https://api.example.com/courses", {
  params: { id: "123" }, // ?id=123 in the query string
});

// With body (only if backend expects it)
axios.delete("https://api.example.com/courses/123", {
  data: { reason: "Outdated course" }, // included as request body
});
```

---

## 🧠 Summary Table

| Method | Purpose         | Body Supported | Params Supported | Example Format                         |
| ------ | --------------- | -------------- | ---------------- | -------------------------------------- |
| GET    | Fetch data      | ❌             | ✅               | `axios.get(url, { params })`           |
| POST   | Create data     | ✅             | ✅               | `axios.post(url, body, { params })`    |
| PUT    | Replace data    | ✅             | ✅               | `axios.put(url, body, { params })`     |
| PATCH  | Update data     | ✅             | ✅               | `axios.patch(url, body, { params })`   |
| DELETE | Delete resource | ✅ (optional)  | ✅               | `axios.delete(url, { data / params })` |

Let me know if you want to add headers, authentication tokens, or interceptors!
