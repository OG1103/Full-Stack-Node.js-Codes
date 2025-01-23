# Authentication Workflow in Express

This document explains a complete authentication workflow in an Express application, covering:
1. **Registration with Email Verification.**
2. **Login with Token and Cookies.**
3. **Password Reset with Expiring Token.**
4. **Refresh Token for Updating Access Tokens.**
5. **Handling Token Expiry Scenarios.**

---

## 1. **Registration and Email Verification**

### **Workflow Steps:**
1. **User Registration:** A user submits their registration details (e.g., name, email, password).
2. **Generate Verification Token:** Generate a token that expires after a set time (e.g., 1 hour).
3. **Send Verification Email:** Send the token to the user's email with a verification link.
4. **Verify User:** When the user clicks the link, validate the token and mark the email as verified.

### **Implementation:**

#### **Registration Endpoint:**
```javascript
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from './models/User';

// Register User
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Save user to DB
  const user = await User.create({ name, email, password, isVerified: false });

  // Generate verification token
  const token = crypto.randomBytes(32).toString('hex');
  const tokenExpiration = Date.now() + 3600000; // Token expires in 1 hour

  user.verificationToken = token;
  user.tokenExpiration = tokenExpiration;
  await user.save();

  // Send verification email
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: 'your_email@gmail.com', pass: 'your_password' },
  });

  const verificationUrl = `http://yourdomain.com/verify-email?token=${token}`;

  await transporter.sendMail({
    to: email,
    subject: 'Verify Your Email',
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email. This link will expire in 1 hour.</p>`,
  });

  res.status(200).send('Registration successful! Please check your email to verify your account.');
});
```

#### **Email Verification Endpoint:**
```javascript
app.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({ verificationToken: token });

  if (!user || user.tokenExpiration < Date.now()) {
    return res.status(400).send('Invalid or expired token. Please register again.');
  }

  user.isVerified = true;
  user.verificationToken = null;
  user.tokenExpiration = null;
  await user.save();

  res.status(200).send('Email verified successfully! You can now log in.');
});
```

#### **Handling Token Expiry for Email Verification:**
- If the token has expired, inform the user and ask them to re-register.
- Alternatively, provide an endpoint for resending the verification email:
  ```javascript
  app.post('/resend-verification-email', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.isVerified) {
      return res.status(400).send('User does not exist or is already verified.');
    }

    // Generate new token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = Date.now() + 3600000;

    user.verificationToken = token;
    user.tokenExpiration = tokenExpiration;
    await user.save();

    const verificationUrl = `http://yourdomain.com/verify-email?token=${token}`;

    await transporter.sendMail({
      to: email,
      subject: 'Resend Verification Email',
      html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email. This link will expire in 1 hour.</p>`,
    });

    res.status(200).send('Verification email resent. Please check your inbox.');
  });
  ```

---

## 2. **Login with Token and Cookies**

### **Workflow Steps:**
1. **Authenticate User:** Validate email and password.
2. **Generate Access Token:** Create a short-lived access token (e.g., 15 minutes).
3. **Send Access Token as Response and Cookie:** Return the token in both JSON response and a `HttpOnly` cookie.

### **Implementation:**

#### **Login Endpoint:**
```javascript
import jwt from 'jsonwebtoken';

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).send('Invalid email or password.');
  }

  if (!user.isVerified) {
    return res.status(403).send('Please verify your email before logging in.');
  }

  // Generate Access Token
  const accessToken = jwt.sign({ id: user.id }, 'access_secret', { expiresIn: '15m' });

  res.cookie('accessToken', accessToken, { httpOnly: true });
  res.status(200).json({ message: 'Login successful!', accessToken });
});
```

---

## 3. **Password Reset with Expiring Token**

### **Workflow Steps:**
1. **Request Reset Email:** User submits their email to request a password reset.
2. **Generate Reset Token:** Create a token that expires after a short period (e.g., 1 hour).
3. **Send Reset Email:** Email the token with a password reset link.
4. **Reset Password:** Validate the token, then update the password.

### **Implementation:**

#### **Request Reset Email:**
```javascript
app.post('/request-password-reset', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).send('User not found.');

  const resetToken = crypto.randomBytes(32).toString('hex');
  const tokenExpiration = Date.now() + 3600000; // Token expires in 1 hour

  user.resetToken = resetToken;
  user.tokenExpiration = tokenExpiration;
  await user.save();

  const resetUrl = `http://yourdomain.com/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    to: email,
    subject: 'Password Reset Request',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`
  });

  res.status(200).send('Password reset email sent.');
});
```

#### **Reset Password Endpoint:**
```javascript
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({ resetToken: token });

  if (!user || user.tokenExpiration < Date.now()) {
    return res.status(400).send('Invalid or expired token. Please request a new password reset.');
  }

  user.password = newPassword;
  user.resetToken = null;
  user.tokenExpiration = null;
  await user.save();

  res.status(200).send('Password reset successfully.');
});
```

#### **Handling Token Expiry for Password Reset:**
- If the token is expired, prompt the user to request a new reset link.
- Provide clear error messages indicating that the token is invalid or expired.

---

## 4. **Refresh Tokens for Updating Access Tokens**

### **Workflow Steps:**
1. **Generate Refresh Token:** Create a long-lived refresh token (e.g., 7 days) and store it in the database.
2. **Send Refresh Token as Cookie:** Send it as a `HttpOnly` cookie.
3. **Refresh Access Token:** Validate the refresh token and issue a new access token.

### **Implementation:**

#### **Login with Refresh Token:**
```javascript
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).send('Invalid email or password.');
  }

  // Generate Tokens
  const accessToken = jwt.sign({ id: user.id }, 'access_secret', { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id }, 'refresh_secret', { expiresIn: '7d' });

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, { httpOnly: true });
  res.status(200).json({ message: 'Login successful!', accessToken });
});
```

#### **Refresh Token Endpoint:**
```javascript
app.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) return res.status(401).send('Refresh token missing.');

  const user = await User.findOne({ refreshToken });

  if (!user) return res.status(403).send('Invalid refresh token.');

  try {
    jwt.verify(refreshToken, 'refresh_secret');
    const newAccessToken = jwt.sign({ id: user.id }, 'access_secret', { expiresIn: '15m' });
    res.status(200).json({ accessToken: newAccessToken });
  } catch {
    res.status(403).send('Invalid or expired refresh token.');
  }
});
```

---

## **Key Points:**
- Use `HttpOnly` cookies for tokens to protect against XSS attacks.
- Always set an expiration time for tokens and refresh tokens.
- Store refresh tokens securely in the database and rotate them after use.
- Implement proper error handling for expired or invalid tokens.

This workflow provides a secure and scalable way to handle authentication in Express.
