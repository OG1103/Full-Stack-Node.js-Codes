# Understanding Axios

## Introduction
**Axios** is a JavaScript library that simplifies the process of sending **HTTP requests** from the front end (browser or client-side) to the back end (server-side) and receiving responses. It acts as a bridge between your web app and the server, enabling you to:
- **Send requests**: Submit data to the server (e.g., form submissions, file uploads).
- **Receive responses**: Fetch data from the server (e.g., user data, JSON responses).

In simpler terms, Axios helps you communicate with a server by making HTTP requests such as:
- **GET**: Retrieve data from the server.
- **POST**: Send data to the server.
- **PUT**: Update existing data on the server.
- **DELETE**: Remove data from the server.

---

## What Does Axios Do?
- **Client-Side Tool**: Axios allows you to perform tasks like fetching data, submitting forms, and handling API requests asynchronously (without blocking the web page).
- **Simplifies HTTP Requests**: Provides a cleaner and easier-to-read syntax compared to the traditional `XMLHttpRequest` or even the native `fetch()` API.

### Example:
Here’s a simple example of using Axios with **async/await** to make a **GET** request to retrieve data from a server:
```javascript
async function fetchData() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
        console.log(response.data); // Handle successful response
    } catch (error) {
        console.error('Error:', error); // Handle error
    }
}
fetchData();
```

---

## Features of Axios

### 1. Promise-Based
- Axios is built on **promises**, making it easy to handle asynchronous HTTP requests.
- Using `async/await` further simplifies handling promises.

### 2. Automatic JSON Parsing
- Axios automatically converts JSON data received from the server into a JavaScript object.
- Unlike `fetch()`, you don’t need to manually call `.json()` on the response.
```javascript
async function fetchData() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
        console.log(response.data); // response.data is already a parsed object
    } catch (error) {
        console.error('Error:', error);
    }
}
fetchData();
```

### 3. Error Handling
- Axios automatically throws an error for non-2xx HTTP status codes (like 404 or 500).
- This simplifies error handling since you don’t need to manually check `response.ok`.

### 4. Request Interceptors
- Axios allows you to **intercept requests and responses** before they are handled.
- Useful for tasks like adding **authentication tokens** to every request or logging requests/responses globally.

### 5. Request Cancellation
- Axios provides an easy way to **cancel ongoing requests** using `CancelToken`.
- This is useful when you want to stop a request before it completes, such as when navigating away from a page.

### 6. Timeouts
- Axios has built-in support for **timeouts**. If a request takes too long, it can be automatically canceled.
```javascript
async function fetchData() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1', { timeout: 5000 });
        console.log(response.data);
    } catch (error) {
        console.error('Request timed out:', error);
    }
}
fetchData();
```

### 7. Simplified File Uploads
- Axios supports **FormData**, making it easier to send files (like images, PDFs) to a server.

### 8. Cross-Site Requests
- Axios automatically sends credentials (like cookies) for cross-origin requests, making it easier to handle authentication.

---

## Different Types of Axios Requests (Using `async/await`)

### 1. GET Request
Used to **retrieve data** from the server.
```javascript
async function getData() {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        console.log(response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}
getData();
```

### 2. POST Request
Used to **send data** to the server. In this example, the data to be sent is already defined in an object.
```javascript
const postData = {
    title: 'New Post',
    body: 'This is the content of the post.',
    userId: 1
};

async function createPost() {
    try {
        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', postData);
        console.log('Post created:', response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}
createPost();
```

### 3. PUT Request
Used to **update existing data** on the server.
```javascript
const updateData = {
    title: 'Updated Post',
    body: 'This is the updated content of the post.',
    userId: 1
};

async function updatePost() {
    try {
        const response = await axios.put('https://jsonplaceholder.typicode.com/posts/1', updateData);
        console.log('Post updated:', response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}
updatePost();
```

### 4. DELETE Request
Used to **delete data** from the server.
```javascript
async function deletePost() {
    try {
        const response = await axios.delete('https://jsonplaceholder.typicode.com/posts/1');
        console.log('Post deleted:', response.data);
    } catch (error) {
        console.error('Error:', error);
    }
}
deletePost();
```

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

## Error Object in Axios
When an error occurs, the `error` object contains useful information:
```javascript
async function handleError() {
    try {
        await axios.get('https://jsonplaceholder.typicode.com/invalid-url');
    } catch (error) {
        console.log(error.message);  // A string representing the error message
    }
}
handleError();
```

---

## When to Use Axios
- Use Axios when you need:
  - **Automatic JSON parsing**.
  - **Better error handling** (automatic error throwing for non-2xx status codes).
  - **Interceptors** for adding authentication tokens or logging.
  - **Request cancellation**.
  - **Timeout support**.
  - **Simplified file uploads**.

---

## References
- [Axios GitHub Repository](https://github.com/axios/axios)
- [Axios Documentation](https://axios-http.com/docs/intro)