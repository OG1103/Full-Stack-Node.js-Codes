# HTTP Headers in Node.js

## Overview

HTTP headers are key-value pairs sent by both clients (browsers or applications) and servers as part of the HTTP request-response cycle. Headers provide additional information about the request or response, such as the content type, caching policies, user agent, and authentication details.

In Node.js, HTTP headers can be accessed and manipulated using the built-in **`http`** module or frameworks like **Express.js**.

---

## Types of HTTP Headers

### 1. **Request Headers**

Request headers are sent by the client to provide information about the request, such as who is making the request, what type of content it can handle, and authorization details.

**Common Request Headers**:

- **`Host`**: Specifies the domain name of the server to which the request is being sent.

  - Example:
    ```http
    Host: example.com
    ```

- **`User-Agent`**: Identifies the client (browser, app, or device) making the request.

  - Example:
    ```http
    User-Agent: Mozilla/5.0
    ```

- **`Accept`**: Indicates the content types that the client can process.

  - Example:
    ```http
    Accept: text/html, application/json
    ```

- **`Authorization`**: Contains credentials for authenticating the client with the server.
  - Example:
    ```http
    Authorization: Bearer <token>
    ```

---

### 2. **Response Headers**

Response headers are sent by the server to provide information about the response, such as the type of content being sent and how the client should handle it.

**Common Response Headers**:

- **`Content-Type`**: Specifies the media type of the response body.

  - Example:
    ```http
    Content-Type: text/html
    ```

- **`Content-Length`**: Indicates the size of the response body in bytes.

  - Example:
    ```http
    Content-Length: 512
    ```

- **`Set-Cookie`**: Sends cookies from the server to the client.

  - Example:
    ```http
    Set-Cookie: sessionId=abc123; HttpOnly
    ```

- **`Cache-Control`**: Specifies caching policies.

  - Example:
    ```http
    Cache-Control: no-cache, no-store, must-revalidate
    ```

- **`Location`**: Used in redirection responses to specify the new URL.
  - Example:
    ```http
    Location: https://example.com/new-page
    ```

---

### 3. **Entity Headers**

Entity headers provide information about the body of the request or response, such as its content type and encoding.

**Common Entity Headers**:

- **`Content-Type`**: Specifies the media type of the request or response body.

  - Example:
    ```http
    Content-Type: application/json
    ```

- **`Content-Encoding`**: Indicates the encoding used on the data to enable proper decoding by the client.

  - Example:
    ```http
    Content-Encoding: gzip
    ```

- **`Content-Length`**: Specifies the length of the request or response body in bytes.
  - Example:
    ```http
    Content-Length: 2048
    ```

---

### 4. **General Headers**

General headers can be sent in both requests and responses but do not directly relate to the body of the message. They provide information about the connection or the context of the request/response.

**Common General Headers**:

- **`Date`**: Indicates the date and time at which the message was sent.

  - Example:
    ```http
    Date: Wed, 21 Oct 2023 07:28:00 GMT
    ```

- **`Connection`**: Controls whether the network connection stays open after the current transaction.

  - Example:
    ```http
    Connection: keep-alive
    ```

- **`Transfer-Encoding`**: Specifies the form of encoding used to safely transfer the payload body.
  - Example:
    ```http
    Transfer-Encoding: chunked
    ```

---

## Working with HTTP Headers in Node.js

### 1. **Accessing Request Headers**

In Node.js, you can access incoming request headers using the `req.headers` object. The headers are stored as key-value pairs, where the keys are case-insensitive.

#### Example:

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  console.log("Request Headers:", req.headers);
  res.end("Headers received");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

#### Sample Output:

```
Request Headers: {
  host: 'localhost:3000',
  user-agent: 'Mozilla/5.0',
  accept: '*/*'
}
```

---

### 2. **Setting Response Headers**

To set response headers in Node.js, you can use the `res.setHeader()` method. This method takes two arguments: the header name and its value.

#### Example:

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello, World!");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

In this example, the `Content-Type` header is set to `text/plain`, indicating that the response body is plain text.

---

### 3. **Getting Response Headers**

You can retrieve a specific response header using the `res.getHeader()` method.

#### Example:

```javascript
res.setHeader("Content-Type", "application/json");
console.log(res.getHeader("Content-Type")); // Output: application/json
```

---

### 4. **Removing Headers**

If you need to remove a header, you can use the `res.removeHeader()` method.

#### Example:

```javascript
res.setHeader("X-Custom-Header", "MyValue");
res.removeHeader("X-Custom-Header");
```

---

## Commonly Used HTTP Headers

### **Request Headers**

1. **`Host`**: Specifies the domain name of the server.

   Example: `Host: example.com`

2. **`User-Agent`**: Identifies the client making the request (e.g., browser or app).

   Example: `User-Agent: Mozilla/5.0`

3. **`Accept`**: Specifies the content types the client can handle.

   Example: `Accept: text/html, application/json`

4. **`Authorization`**: Contains credentials for authenticating the client.

   Example: `Authorization: Bearer <token>`

5. **`Content-Type`**: Specifies the media type of the request body.

   Example: `Content-Type: application/json`

---

### **Response Headers**

1. **`Content-Type`**: Specifies the media type of the response body.

   Example: `Content-Type: text/html`

2. **`Content-Length`**: Specifies the size of the response body in bytes.

   Example: `Content-Length: 512`

3. **`Set-Cookie`**: Sends cookies from the server to the client.

   Example: `Set-Cookie: sessionId=abc123; HttpOnly`

4. **`Cache-Control`**: Specifies caching policies.

   Example: `Cache-Control: no-cache, no-store, must-revalidate`

5. **`Location`**: Used in redirection responses to specify the new URL.

   Example: `Location: https://example.com/new-page`

---

## Using Headers in Express.js

Express.js simplifies working with headers by providing methods like `req.get()` for reading headers and `res.set()` for setting headers.

### **Reading Request Headers**

```javascript
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  const userAgent = req.get("User-Agent");
  res.send(`Your user agent is: ${userAgent}`);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### **Setting Response Headers**

```javascript
app.get("/json", (req, res) => {
  res.set("Content-Type", "application/json");
  res.json({ message: "Hello, World!" });
});
```

---

## Summary

- HTTP headers are key-value pairs that provide metadata about the request or response.
- In Node.js, headers can be accessed using `req.headers` and set using `res.setHeader()`.
- Common request headers include `Host`, `User-Agent`, and `Authorization`.
- Common response headers include `Content-Type`, `Set-Cookie`, and `Cache-Control`.
- Express.js provides convenient methods like `req.get()` and `res.set()` to handle headers more easily.
- Different types of headers (request, response, entity, and general) serve different purposes in the HTTP request-response cycle.

Understanding HTTP headers is essential for building web applications, as they play a crucial role in defining how data is exchanged between clients and servers.
