
# **Optimal JWT Flow Between Backend and Frontend**

This guide explains the best practices for using **JSON Web Tokens (JWT)** for authentication and authorization between a backend server and a frontend application, covering token creation, storage, transmission, and security tips.
---
## **1. JWT Authentication Flow**

### **Step 1: User Login (Backend)**
- The user submits their **username** and **password** via a login form.
- The backend verifies the credentials:
  - If valid, it creates a **JWT** (short-lived) and a **refresh token** (long-lived).
  - The JWT is signed with a secret key and includes user information (e.g., `userId`, `role`).
  - The refresh token is also signed but has a longer expiration time.

#### Example JWT Creation:
```javascript
const jwt = require('jsonwebtoken');
const payload = { userId: '12345', role: 'admin' };
const jwtSecret = process.env.JWT_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

// Create a JWT (expires in 15 minutes)
const token = jwt.sign(payload, jwtSecret, { expiresIn: '15m' });

// Create a refresh token (expires in 7 days)
const refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: '7d' });

res.status(200).json({ token, refreshToken });
```

---

### **Step 2: Storing the Tokens (Frontend)**

#### **Where to Store the Tokens?**
1. **JWT**: Store the JWT **in memory** or **session storage**.
   - Avoid storing JWT in `localStorage` or `sessionStorage` if possible, as they are vulnerable to **Cross-Site Scripting (XSS)** attacks.
2. **Refresh Token**: Store the refresh token in a secure **HTTP-only cookie**.
   - HTTP-only cookies are not accessible via JavaScript, reducing the risk of **XSS** attacks.

---

### **Step 3: Sending the Tokens (Frontend to Backend)**

1. **For Protected Routes**:
   - The frontend sends the JWT in the **Authorization header** as a Bearer token.

#### Example using Axios for Protected Routes:
```javascript
// Axios request with Bearer token for protected route
axios.get('/api/protected', {
  headers: {
    Authorization: `Bearer ${token}` // Replace token with your JWT
  }
})
  .then(response => {
    console.log('Protected Data:', response.data);
  })
  .catch(error => {
    console.error('Error fetching protected data:', error);
  });
```

2. **For Token Refresh**:
   - The frontend sends the refresh token automatically via the **HTTP-only cookie** to a `/refresh` endpoint when the JWT expires.

#### Example using Axios for Token Refresh:
```javascript
// Axios request to refresh token endpoint
axios.post('/api/refresh', {}, { withCredentials: true }) // 'withCredentials' ensures cookies are sent
  .then(response => {
    const newToken = response.data.token;
    console.log('New Token:', newToken);
    // Store the new token and use it for subsequent requests
  })
  .catch(error => {
    console.error('Error refreshing token:', error);
  });
```

---

### **Step 4: Verifying the JWT (Backend)**

- The backend verifies the JWT using the secret key.
- If the JWT is valid, it allows access to the protected route.
- If the JWT is expired, it responds with a `401 Unauthorized` status, prompting the frontend to request a new token using the refresh token.

#### Example JWT Verification Middleware:
```javascript
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
```

---

### **Step 5: Refreshing the Token (Backend)**

- If the JWT is expired, the frontend sends a request to the `/refresh` endpoint with the refresh token (automatically via cookie).
- The backend verifies the refresh token and issues a new JWT.

#### Example Refresh Token Endpoint:
```javascript
app.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newToken = jwt.sign({ userId: decoded.userId, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.status(200).json({ token: newToken });
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
});
```

---

## **2. Best Practices for JWT Authentication**

1. **Use Strong Secrets**:
   - Always use strong, random secrets for signing JWTs (`JWT_SECRET` and `REFRESH_TOKEN_SECRET`).
   - Store secrets in environment variables.

2. **Set Short Expiration for JWTs**:
   - Use a short expiration time for JWTs (e.g., 15 minutes) to reduce the impact of a compromised token.

3. **Use Refresh Tokens for Long Sessions**:
   - Use refresh tokens with a longer expiration time (e.g., 7 days or 30 days) to maintain user sessions.

4. **Secure Token Storage**:
   - Store JWTs in memory or session storage to reduce XSS risks.
   - Store refresh tokens in HTTP-only cookies to prevent JavaScript access.

5. **Use HTTPS**:
   - Always use HTTPS to encrypt token transmission and prevent **Man-In-The-Middle (MITM)** attacks.

6. **Implement Token Blacklisting**:
   - Maintain a blacklist of revoked refresh tokens to prevent reuse after logout.

7. **Handle Errors Gracefully**:
   - Inform users when their session has expired and prompt them to log in again.
   - Handle token-related errors (e.g., invalid or expired tokens) with appropriate status codes and messages.

---

## **3. Summary of the Optimal JWT Flow**

1. **Login**: User logs in and receives a JWT and a refresh token.
2. **Token Storage**: JWT is stored in memory/session storage, and the refresh token is stored in an HTTP-only cookie.
3. **Request**: The frontend sends the JWT in the Authorization header for protected routes.
4. **Token Verification**: The backend verifies the JWT for each request.
5. **Token Expiry**: If the JWT is expired, the frontend requests a new token using the refresh token.
6. **Refresh Token Verification**: The backend verifies the refresh token and issues a new JWT.
7. **Logout**: On logout, invalidate the refresh token by removing it from the client and the server.

---

## **4. References**

- [JWT.io](https://jwt.io/)
- [jsonwebtoken on npm](https://www.npmjs.com/package/jsonwebtoken)
- [Express.js Documentation](https://expressjs.com/)
