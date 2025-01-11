# Understanding the `XMLHttpRequest` Object in JavaScript

## Introduction
The **`XMLHttpRequest`** (often abbreviated as **XHR**) object is used to interact with servers in an asynchronous manner. It allows you to send **HTTP requests** (GET, POST, etc.) from the browser to the server, retrieve data, and update the page without reloading it.

Although modern web development often uses the **`fetch()` API**, `XMLHttpRequest` is still commonly used and forms the foundational technology behind **AJAX**.

---

## Creating an `XMLHttpRequest` Object
```javascript
const xhr = new XMLHttpRequest();
```
Once created, the `xhr` object can be used to configure and send HTTP requests.

---

## Key Properties of the `XMLHttpRequest` Object

### 1. `xhr.readyState`
- Represents the state of the request.
- Possible values:
  | Value | State               | Description                                       |
  |-------|---------------------|---------------------------------------------------|
  | **0** | UNSENT              | The request has been created but not opened.     |
  | **1** | OPENED              | The request has been opened with `.open()` but not sent yet. |
  | **2** | HEADERS_RECEIVED    | The request has been sent, and the server’s response headers are available. |
  | **3** | LOADING             | The response body is being received.             |
  | **4** | DONE                | The request is complete, and the response is fully received. |

### 2. `xhr.status`
- The **HTTP status code** of the response.
- Common status codes:
  | Code | Description                        |
  |------|------------------------------------|
  | **200** | OK: The request was successful.     |
  | **404** | Not Found: The resource was not found. |
  | **500** | Internal Server Error: A server-side error occurred. |

### 3. `xhr.responseType`
- Specifies the format of the response.
- Possible values:
  | Value   | Description                       |
  |---------|-----------------------------------|
  | `'text'`  | The response is returned as a string. |
  | `'json'`  | The response is parsed as a JSON object. |
  | `'blob'`  | The response is returned as binary data. |

Example:
```javascript
xhr.responseType = 'json';
console.log(xhr.response);  // Output will be a JavaScript object
```

### 4. `xhr.timeout`
- The time (in milliseconds) that a request can take before being automatically terminated.
- If the request takes longer than the timeout value, the request is aborted, and the `ontimeout` event handler is triggered.

---

## Methods of the `XMLHttpRequest` Object

### 1. `xhr.open(method, url, async)`
- Initializes a new request.
- Parameters:
  - **`method`**: The HTTP request method (e.g., "GET", "POST").
  - **`url`**: The URL to send the request to.
  - **`async`**: A Boolean indicating whether the request should be asynchronous (`true`, which is the default) or synchronous (`false`).

Example:
```javascript
xhr.open("GET", "https://api.example.com/data", true);  // Asynchronous GET request
```

### 2. `xhr.send(body)`
- Sends the request to the server.
- The **`body`** parameter is optional and is used only for methods like POST where data needs to be sent to the server.

Examples:
```javascript
xhr.send();  // For GET requests (no body)

xhr.open("POST", "/submit", true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.send(JSON.stringify({ name: "John", age: 30 }));
```

### 3. `xhr.setRequestHeader(header, value)`
- Sets the value of an HTTP request header (e.g., `Content-Type`, `Authorization`).

Example:
```javascript
xhr.setRequestHeader("Content-Type", "application/json");
```

### 4. `xhr.abort()`
- Cancels the current request.

Example:
```javascript
xhr.abort();  // Aborts the request
```

---

## Events of the `XMLHttpRequest` Object
The `XMLHttpRequest` object supports several events that allow you to handle different stages of the request.

### 1. `xhr.onreadystatechange`
- A function that is called whenever the `readyState` property changes.
- This is the most commonly used event handler for handling XHR responses.

Example:
```javascript
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log("Response received:", xhr.responseText);
    }
};
```

### 2. `xhr.onload`
- Triggered when the request completes successfully.

Example:
```javascript
xhr.onload = function() {
    if (xhr.status === 200) {
        console.log("Success:", xhr.responseText);
    }
};
```

### 3. `xhr.onerror`
- Triggered when the request fails.

Example:
```javascript
xhr.onerror = function() {
    console.error("Request failed");
};
```

### 4. `xhr.ontimeout`
- Triggered when the request times out (if a timeout was set).

Example:
```javascript
xhr.ontimeout = function() {
    console.error("Request timed out");
};
```

---

## Making Multiple Requests Simultaneously (Best Practice)
To make multiple requests at the same time, it’s better to create a new `XMLHttpRequest` object for each request. This ensures that each request has its own state and they won’t interfere with each other.

### Example:
```javascript
const makeRequest = (url) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log("Post title:", response.title);
        } else {
            console.error("Error:", xhr.statusText);
        }
    };

    xhr.onerror = function() {
        console.error("Request failed");
    };

    xhr.send();
};

// Making multiple requests simultaneously with different objects
makeRequest("https://jsonplaceholder.typicode.com/posts/1");
makeRequest("https://jsonplaceholder.typicode.com/posts/2");
```

---

## Summary
- The `XMLHttpRequest` object is a core component of AJAX and is used to send asynchronous HTTP requests.
- It provides various properties, methods, and events for handling requests and responses.
- While `fetch()` and Axios are more commonly used in modern JavaScript development, understanding `XMLHttpRequest` is essential for working with legacy code and understanding the fundamentals of AJAX.

---

## References
- [MDN Web Docs - XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
- [MDN Web Docs - AJAX](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX)
