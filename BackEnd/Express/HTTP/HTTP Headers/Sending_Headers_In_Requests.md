
# Sending Headers as Part of a Request using Axios (with async/await)

## Overview
Axios is a popular HTTP client for Node.js and browsers, allowing you to easily send HTTP requests. With `async/await`, working with Axios becomes even more convenient by making asynchronous code look and behave like synchronous code.

---

## Sending Headers in a GET Request using async/await

To send headers in a `GET` request with `async/await`, use the `headers` option in the Axios configuration object.

### Example: Sending Authorization and Accept Headers
```javascript
const axios = require('axios');

async function fetchPosts() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
            headers: {
                'Authorization': 'Bearer my-token',
                'Accept': 'application/json'
            }
        });
        console.log('Response data:', response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchPosts();
```

**Explanation**:
- **`Authorization`**: Sends a bearer token for authentication.
- **`Accept`**: Specifies that the client expects a JSON response.

---

## Sending Headers in a POST Request using async/await

To send headers in a `POST` request with `async/await`, include them in the Axios configuration object alongside the request body.

### Example: Sending Content-Type Header
```javascript
async function createPost() {
    try {
        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
            title: 'foo',
            body: 'bar',
            userId: 1
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

createPost();
```

**Explanation**:
- **`Content-Type`**: Indicates that the request body contains JSON data.

---

## Using Headers with an Axios Instance and async/await

If you need to send the same headers with multiple requests, you can create an Axios instance with default headers and use it with `async/await`.

### Example:
```javascript
const axiosInstance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    headers: {
        'Authorization': 'Bearer my-token',
        'Accept': 'application/json'
    }
});

async function fetchUsers() {
    try {
        const response = await axiosInstance.get('/users');
        console.log('Users:', response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchUsers();
```

**Explanation**:
- The `axios.create()` method creates a new Axios instance with pre-configured headers and a base URL.
- The `fetchUsers()` function uses `await` to wait for the response before logging the data.

---


## Response Object in Axios
When making a request with Axios, the `response` object contains useful information:
```javascript
async function getResponseDetails() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
        console.log(response.data);       // The actual data from the server
        console.log(response.status);     // HTTP response status code (e.g., 200)
        console.log(response.statusText); // Status message (e.g., "OK")
        console.log(response.headers);    // Object containing response headers
        console.log(response.config);     // The config used for the request
        console.log(response.request);    // The original request object
    } catch (error) {
        console.error('Error:', error);
    }
}
getResponseDetails();
```
---

## Summary

- Axios allows you to send custom headers using the `headers` option in the configuration object.
- Using `async/await` with Axios simplifies handling asynchronous requests.
- Common use cases for sending headers include authentication (e.g., `Authorization` header) and specifying content types (e.g., `Content-Type` header).
- Creating an Axios instance with default headers makes it easier to reuse configurations for multiple requests.

By combining Axios with `async/await`, you can write clean and readable asynchronous code for interacting with APIs.
