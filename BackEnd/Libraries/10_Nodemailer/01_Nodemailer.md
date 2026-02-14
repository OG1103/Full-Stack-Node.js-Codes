# Nodemailer

Nodemailer is the standard library for sending emails from Node.js applications. It supports SMTP, Gmail, Outlook, and other email services, with support for HTML content and templates.

---

## 1. Installation

```bash
npm install nodemailer nodemailer-express-handlebars
```

- `nodemailer` — Core email sending library
- `nodemailer-express-handlebars` — Template engine for email content (optional)

---

## 2. Creating a Transporter

The transporter is the connection to your email service:

### Gmail Setup

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     // your-email@gmail.com
    pass: process.env.EMAIL_PASS,     // App Password (not your regular password)
  },
});
```

### Gmail App Password

Gmail requires an **App Password** instead of your regular password:

1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account → Security → App Passwords
3. Generate an app password for "Mail"
4. Use this 16-character password in `EMAIL_PASS`

### SMTP Setup (Any Provider)

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,      // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

### Environment Variables

```
# .env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## 3. Sending a Basic Email

```javascript
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,  // Plain text body
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.messageId);
  return info;
};

// Usage
await sendEmail('user@example.com', 'Hello', 'Welcome to our app!');
```

---

## 4. Sending HTML Emails

```javascript
const sendHTMLEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,  // HTML body
  };

  return transporter.sendMail(mailOptions);
};

// Usage
await sendHTMLEmail(
  'user@example.com',
  'Welcome!',
  `
    <h1>Welcome to Our App</h1>
    <p>Thank you for signing up, <strong>John</strong>!</p>
    <a href="https://myapp.com/verify?token=abc123">Verify your email</a>
  `
);
```

---

## 5. Email with Handlebars Templates

For complex emails, use templates instead of inline HTML:

### Configure the Template Engine

```javascript
// config/email.js
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Configure Handlebars
transporter.use('compile', hbs({
  viewEngine: {
    extName: '.hbs',
    partialsDir: path.resolve('./views/emails/'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./views/emails/'),
  extName: '.hbs',
}));

export default transporter;
```

### Create a Template

```handlebars
<!-- views/emails/welcome.hbs -->
<html>
<body>
  <h1>Welcome, {{name}}!</h1>
  <p>Thank you for joining {{appName}}.</p>
  <p>Click below to verify your email:</p>
  <a href="{{verifyLink}}" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
    Verify Email
  </a>
</body>
</html>
```

```handlebars
<!-- views/emails/resetPassword.hbs -->
<html>
<body>
  <h1>Password Reset</h1>
  <p>Hi {{name}}, you requested a password reset.</p>
  <p>Click below to reset your password (expires in {{expiry}}):</p>
  <a href="{{resetLink}}" style="padding: 10px 20px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px;">
    Reset Password
  </a>
  <p>If you didn't request this, please ignore this email.</p>
</body>
</html>
```

### Send Templated Email

```javascript
import transporter from '../config/email.js';

export const sendWelcomeEmail = async (user, verifyToken) => {
  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Welcome to My App!',
    template: 'welcome',            // Template filename (without .hbs)
    context: {                       // Variables passed to the template
      name: user.name,
      appName: 'My App',
      verifyLink: `https://myapp.com/verify?token=${verifyToken}`,
    },
  });
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Password Reset Request',
    template: 'resetPassword',
    context: {
      name: user.name,
      resetLink: `https://myapp.com/reset-password?token=${resetToken}`,
      expiry: '10 minutes',
    },
  });
};
```

---

## 6. Using in Controllers

### Registration with Welcome Email

```javascript
import { sendWelcomeEmail } from '../utils/email.js';
import crypto from 'crypto';

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });

  // Generate verification token
  const verifyToken = crypto.randomBytes(32).toString('hex');
  user.verifyToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
  await user.save();

  // Send welcome email
  await sendWelcomeEmail(user, verifyToken);

  res.status(201).json({ message: 'Registration successful. Check your email.' });
};
```

### Forgot Password

```javascript
import { sendPasswordResetEmail } from '../utils/email.js';

const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ error: 'No user with that email' });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  // Send reset email
  await sendPasswordResetEmail(user, resetToken);

  res.json({ message: 'Password reset email sent' });
};
```

---

## 7. Mail Options Reference

```javascript
const mailOptions = {
  from: '"Sender Name" <sender@example.com>',  // Sender
  to: 'recipient@example.com',                   // Recipient(s)
  cc: 'cc@example.com',                          // CC
  bcc: 'bcc@example.com',                        // BCC
  subject: 'Email Subject',                       // Subject line
  text: 'Plain text body',                        // Plain text
  html: '<h1>HTML body</h1>',                    // HTML (takes priority over text)
  template: 'templateName',                       // Handlebars template
  context: { key: 'value' },                      // Template variables
  attachments: [                                   // File attachments
    {
      filename: 'report.pdf',
      path: './files/report.pdf',
    },
  ],
};
```

---

## 8. Project Structure

```
project/
├── config/
│   └── email.js              // Transporter + Handlebars config
├── utils/
│   └── email.js              // Email functions (welcome, reset, etc.)
├── views/
│   └── emails/
│       ├── welcome.hbs       // Welcome email template
│       ├── resetPassword.hbs // Reset password template
│       └── promotional.hbs   // Marketing email template
├── controllers/
│   └── auth.controller.js    // Uses email functions
└── .env                      // EMAIL_USER, EMAIL_PASS
```

---

## 9. Summary

| Feature | Detail |
|---------|--------|
| Install | `npm install nodemailer nodemailer-express-handlebars` |
| Transporter | `nodemailer.createTransport({ service, auth })` |
| Send email | `transporter.sendMail(mailOptions)` |
| HTML email | Set `html` in mail options |
| Templates | Use `template` + `context` with Handlebars |
| Gmail | Use App Password with 2FA enabled |

### Common Email Types

| Email | When | Template Variables |
|-------|------|-------------------|
| Welcome | After registration | `name`, `verifyLink` |
| Password reset | Forgot password | `name`, `resetLink`, `expiry` |
| Order confirmation | After purchase | `name`, `orderId`, `items`, `total` |
| Notification | Activity update | `name`, `message`, `actionLink` |
