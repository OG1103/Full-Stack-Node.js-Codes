# Nodemailer Guide with Examples and File Overview

Nodemailer is a Node.js library for sending emails. It simplifies the process of email delivery by integrating with popular email services or custom SMTP servers. This guide includes detailed explanations, field descriptions, and examples.

Best practice for emails like resetpassword and verficationemail is to include tokens and include them in the redirection. Ex, in verfication email, tokenize the email before sending and upon recieving decode the token and find the corresponding email. 

## Installation

To use Nodemailer, install it using npm:

```bash
npm install nodemailer nodemailer-express-handlebars
```

### Required Libraries
- **nodemailer**: Core library for sending emails.
- **nodemailer-express-handlebars**: Template engine for embedding dynamic content.
- **path**: Built-in Node.js module for handling file paths.

## File Overview

### `config.js`

This file configures the email transporter and the Handlebars template engine.

#### Code Explanation
```javascript
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize my transporter 
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        // This is the sender email authentication / details 
        user: 'your-email@gmail.com',
        // Use password alias instead of actual password of the gmail however, this alias can not be used to login your actual gmail account
        // To create the alias : 1.go to manage account in your gmail, 2. go to security & enable 2 step verfication 3. In search type app-password 4. Create an app and it will generate your password alias and remove spacing
        pass: 'your-email-password-alias',
    },
});

//  The viewEngine is typically required when you need advanced rendering features, like layouts or partials.
transporter.use(
    'compile',
    hbs({
        viewEngine: {
            extname: '.hbs',
            layoutsDir: path.join(__dirname, 'views/layouts'),
            defaultLayout: null,
        },
        viewPath: path.join(__dirname, 'views'), // Points to the folder where your .hbs files are stored.
        extName: '.hbs', // Tells Nodemailer to process .hbs files.
    })
);

const defaultMailOptions = {
    from: '"name" "<your-email@gmail.com>"',
};

export { transporter, defaultMailOptions };
```

#### Key Fields
- `service`: Specifies the email service (e.g., Gmail).
- `auth`: Contains credentials for authentication.
- `viewEngine`: Configures the Handlebars template engine.
  - `layoutsDir`: Directory for layout files.
  - `viewPath`: Directory for template files.
    1. No need to specify .hbs in the template field because extName tells Nodemailer to look for files with the .hbs extension.
    2. No need to manually import templates in your code because nodemailer-express-handlebars automatically locates and compiles the specified template from the viewPath.

### `functions.js`

This file defines reusable email functions for different scenarios.

#### Code Explanation
```javascript
import { transporter, defaultMailOptions } from './config.js';

export const sendWelcomeEmail = async (recipientEmail, data) => {
    const mailOptions = {
        ...defaultMailOptions,
        to: recipientEmail,
        subject: 'Welcome to Our Service',
        template: 'welcome',
        context: {
            name: data.name,
            product: data.product,
        },
    };
    return transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (recipientEmail, data) => {
    const mailOptions = {
        ...defaultMailOptions,
        to: recipientEmail,
        subject: 'Password Reset Request',
        template: 'password-reset',
        context: {
            name: data.name,
            resetLink: data.resetLink,
        },
    };
    return transporter.sendMail(mailOptions);
};
```

#### Key Fields
- `to`: Recipient's email address.
- `subject`: Subject of the email.
- `template`: Specifies the template file (e.g., `welcome.hbs`).
- `context`: Contains dynamic data to embed in the email.

### `views/email.hbs`

This is the Handlebars template file for emails. It allows embedding dynamic content.

#### Example Template
```hbs
<!DOCTYPE html>
<html>
  <body>
    <h1>Hello, {{name}}!</h1>
    <p>Thank you for using {{product}}.</p>
    <a href="{{resetLink}}">Reset your password</a>
  </body>
</html>
```

#### Explanation
- `{{name}}`: Placeholder for the recipient's name.
- `{{product}}`: Placeholder for the product name.
- `{{resetLink}}`: Placeholder for a password reset link.

### `main.js`

This file demonstrates how to use the email functions.

#### Code Explanation
```javascript
import { sendWelcomeEmail, sendPasswordResetEmail, sendPromotionalEmail } from './functions.js';

(async () => {
    try {
        await sendWelcomeEmail('recipient@example.com', { name: 'John Doe', product: 'Our App' });
        await sendPasswordResetEmail('recipient@example.com', { name: 'John Doe', resetLink: 'http://example.com/reset' });
    } catch (error) {
        console.error('Error sending email:', error);
    }
})();
```

#### Key Notes
- **Async/Await**: Ensures proper handling of asynchronous operations.
- **Error Handling**: Catches and logs errors to avoid unhandled exceptions.

## Field Descriptions

### Transporter Configuration
- **service**: Email provider (e.g., Gmail, Yahoo).
- **auth**: Authentication credentials.
  - `user`: Email address.
  - `pass`: Password or application-specific password.

### Mail Options
- **from**: Sender's email address.
- **to**: Recipient's email address.
- **subject**: Subject of the email.
- **template**: Template file name.
- **context**: Data embedded in the template.

### Template Placeholders
- `{{key}}`: Replaced with corresponding `context` values.

## Best Practices
1. **Use Environment Variables**: Store sensitive information like credentials in `.env` files.
2. **Async/Await**: Always use `async` for sending emails to handle asynchronous behavior effectively.
3. **Template Organization**: Separate template files for better maintainability.
4. **Error Handling**: Log errors for debugging and ensure application stability.

---

With this guide and examples, you can send emails with Nodemailer, integrate dynamic templates, and structure your code for reusability. Let me know if further clarification is needed!
