# Understanding `res.cookie` in Express

This document explains the `res.cookie` method in Express, its configuration options, and practical examples.

---

## 1. What is `res.cookie`?

The `res.cookie` method is used in Express to set cookies in the client's browser. These cookies can store data such as tokens, user preferences, or session identifiers.

### **Syntax**

```javascript
res.cookie(name, value, [options]);
```

- **`name`**: The name of the cookie (string).
- **`value`**: The value of the cookie (string or object).
- **`options`**: An optional configuration object.

---

## 2. Configuration Options for `res.cookie`

### **Common Options**

1. **`httpOnly`**: Prevents client-side JavaScript from accessing the cookie.
   - Example: `httpOnly: true`
2. **`secure`**: Ensures the cookie is sent only over HTTPS.
   - Example: `secure: true`
3. **`sameSite`**: Restricts cross-site sharing of cookies.
   - Values: `"strict"`, `"lax"`, `"none"`
4. **`maxAge`**: Defines the cookie's lifespan in milliseconds.
   - Example: `maxAge: 3600000` (1 hour)
5. **`expires`**: Sets a specific expiration date for the cookie.
   - Example: `expires: new Date(Date.now() + 3600000)`
6. **`path`**: Specifies the path where the cookie is accessible.

   - Example: `path: "/api"`

     ### **Path Explanation**

   - **What It Means**:
     The `path` option determines the URL path for which the cookie is sent. If the `path` is set to `/api`, the browser will only include the cookie in requests to URLs starting with `/api`. If you set the path option to `/api/auth`, the cookie will only be sent to routes that match `/api/auth` and its subroutes (e.g., `/api/auth/login` or `/api/auth/logout`). When sending a request from the frontend with `credentials: true`, the cookie will only be included in requests to backend routes that match the cookie's path setting (e.g., `/api/auth`). If the cookie's path is `/api/auth`, it will not be included in requests to other backend routes like `/api/user` or `/api/home`.
   - **Practical Implications**:
     - If you set `path: "/api"`, the cookie will not be sent with requests to `/user` or `/home`, ensuring the cookie is limited to specific routes.
   - **Setting a Cookie**:
     ```javascript
     res.cookie("apiToken", "abcdef", {
       httpOnly: true,
       path: "/api", // Cookie sent only to /api and its subroutes
       maxAge: 3600000, // 1 hour
     });
     ```
   - **Clearing a Cookie**:
     You need to specify the same path to clear the cookie:
     ```javascript
     res.clearCookie("apiToken", { path: "/api" });
     ```
   - **Use Case**:
     - Restricting sensitive cookies to specific API routes.
     - Preventing cookies from being included in unnecessary requests.

---

## 3. Examples of Using `res.cookie`

### Setting a Cookie

```javascript
res.cookie("userToken", "abc123", {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 86400000, // 1 day
});
```

### Clearing a Cookie

- It instructs the browser to remove the cookie.

```javascript
app.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).send("Logged out successfully");
});
```

### Dynamic Cookies

```javascript
app.post("/set-cookie", (req, res) => {
  const { name, value } = req.body;
  res.cookie(name, value, {
    httpOnly: true,
    secure: true,
    maxAge: 3600000, // 1 hour
  });
  res.send("Cookie set successfully");
});
```

---

## 4. What Happens When You Use `req.cookies`?

When you use `req.cookies`, the following occurs:

### **How Cookies Are Processed**

1. **Incoming Request Handling**:

   - On every HTTP request sent by the client, the browser includes all cookies associated with the request's domain and path in the `Cookie` header.
   - Express middleware (e.g., `cookie-parser`) parses this header and mounts the cookies as an object on `req.cookies`.

2. **Accessing Cookies in Express**:

   - If a cookie named `userToken` was set, you can access it as:
     ```javascript
     console.log(req.cookies.userToken);
     ```

3. **Automatic Behavior**:
   - If the cookie has not expired and matches the domain, path, and security rules (e.g., `httpOnly`, `secure`), it is automatically sent with every request.
   - This means you don’t need to manually attach cookies; they are included as long as they exist in the client’s browser and meet the specified conditions.

### **Key Points**:

- **Expiration**:
  - Once a cookie expires (as defined by `maxAge` or `expires`), it is deleted from the client’s browser and will no longer be included in requests.
  - when you use `res.clearCookie` in your backend code, it instructs the client’s browser to remove the cookie. Once the cookie is cleared, Future requests from the client will no longer include this cookie in the Cookie header.
- **Invalid or Missing Cookies**:
  - If the cookie is invalid or missing, `req.cookies` will not contain the corresponding key.
  - Example check:
    ```javascript
    if (!req.cookies.refreshToken) {
      res.status(403).json({ message: "No refresh token found" });
    }
    ```
- **Security Rules**:

  - **When `httpOnly: true`**:

    - Cookies marked as `httpOnly` are not accessible via client-side JavaScript, providing additional security against XSS attacks.
    - These cookies are still included in `req.cookies` when sent to the server, making them suitable for storing sensitive information like tokens.

  - **When `httpOnly: false`**:

    - Cookies are accessible via `document.cookie` in client-side JavaScript, which makes them vulnerable to XSS attacks if not handled securely.
    - Example use case:
      - Storing non-sensitive data such as UI preferences (e.g., dark mode settings).

  - **Example with `httpOnly: false`**:
    ```javascript
    res.cookie("theme", "dark", {
      httpOnly: false, // Accessible via JavaScript
      maxAge: 86400000, // 1 day
    });
    ```
    In this example, the `theme` cookie can be accessed and modified on the client side:
    ```javascript
    console.log(document.cookie); // Outputs: theme=dark
    ```

---

## 5. Cookie Flow Between Backend and Frontend

### **Flow Explanation**

1. **Setting Cookies in the Backend**:

   - The backend uses `res.cookie()` to set cookies in the client’s browser.
   - Example:
     ```javascript
     res.cookie("refreshToken", "tokenValue", {
       httpOnly: true,
       secure: true,
       sameSite: "strict",
       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
     });
     ```

2. **Sending Cookies to the Frontend**:

   - Cookies are automatically sent to the client’s browser in the `Set-Cookie` header of the HTTP response.

3. **Sending Cookies Back to the Server**:

   - The browser includes cookies in the `Cookie` header of subsequent requests, based on domain, path, and security rules.
   - Example frontend request:
     ```javascript
     const response = await axios.get("http://localhost:5000/secure-data", {
       withCredentials: true, // Ensures cookies are included in the request
     });
     console.log(response.data);
     ```

4. **Accessing Cookies in the Backend**:
   - Use `req.cookies` to access cookies sent by the client.
   - Example:
     ```javascript
     app.get("/secure-data", (req, res) => {
       const token = req.cookies.refreshToken;
       if (!token) {
         return res.status(403).send("Access denied");
       }
       res.send("Secure data accessed");
     });
     ```

---

## 6. Where Are Cookies Stored?

- Cookies are stored in the browser’s cookie storage.
- **HTTP-only cookies**:
  - Inaccessible to JavaScript for security reasons.
  - Automatically included in requests based on the domain, path, and security flags.
- **Frontend-accessible cookies**:
  - Stored in the same storage but can be read and modified using `document.cookie`.

---

## 7. Key Points on Frontend vs. Backend Cookies

| Feature           | HTTP-Only (Backend Set)        | Frontend-Set Cookies               |
| ----------------- | ------------------------------ | ---------------------------------- |
| **Accessibility** | Only accessible to the server. | Accessible via JavaScript.         |
| **Security**      | More secure; resistant to XSS. | Vulnerable to XSS.                 |
| **Best Use**      | Sensitive data (e.g., tokens). | Non-sensitive data (e.g., themes). |
| **Expiration**    | Managed by the backend.        | Managed by the frontend.           |

---
