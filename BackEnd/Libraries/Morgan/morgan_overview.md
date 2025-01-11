
# Morgan: HTTP Request Logger Middleware for Node.js

**Morgan** is an HTTP request logger middleware for **Node.js**. It generates logs of incoming requests in a structured format, which helps in monitoring, debugging, and understanding the flow of requests in an application.

Morgan can log various details about requests, such as the HTTP method, URL, status code, response time, and more. It supports different predefined log formats like `'combined'`, `'common'`, `'dev'`, `'short'`, and `'tiny'`. Additionally, you can create custom log formats as needed.

## Key Features
- **Predefined log formats** for quick setup.
- **Customizable log tokens and formats**.
- **Stream support** to direct logs to different output destinations (e.g., a file).
- Useful in **production** for monitoring traffic and in **development** for debugging purposes.

## Common Log Formats
1. **`combined`**: Standard Apache combined log output.
2. **`common`**: Standard Apache common log output.
3. **`dev`**: Concise colored output for development use.
4. **`short`**: Shorter than `'common'` with minimal output.
5. **`tiny`**: Minimal output with only essential information.

## Usage

Morgan is often used with **Express.js** applications to log incoming HTTP requests. Below is an example of how to set up and use Morgan.

### Example: Basic Setup
```javascript
import express from 'express';
import morgan from 'morgan';

const app = express();

// Use Morgan with the 'dev' format
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

### Explanation:
1. `import morgan from 'morgan'`: Import the Morgan middleware.
2. `app.use(morgan('dev'))`: Set up Morgan to log requests using the `'dev'` format.
3. When a request is made to the server, Morgan will log the HTTP method, URL, status code, and response time in a concise format.

## Custom Log Formats
Morgan allows the creation of custom log formats using tokens.

### Example: Custom Log Format
```javascript
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
```

This custom format logs the following details:
- `:method`: The HTTP method (e.g., GET, POST).
- `:url`: The URL of the request.
- `:status`: The HTTP status code of the response.
- `:res[content-length]`: The length of the response in bytes.
- `:response-time`: The time taken to respond, in milliseconds.

## Directing Logs to a File
Morgan can be configured to write logs to a file using streams.

### Example: Writing Logs to a File
```javascript
import fs from 'fs';
import path from 'path';

const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: logStream }));
```

In this example, Morgan writes logs in the `'combined'` format to `access.log`, appending new logs to the file.

## Summary
Morgan is a powerful and flexible HTTP request logger middleware for Node.js. It simplifies the process of monitoring and debugging web applications by providing structured logs of incoming requests. Whether you're in development or production, Morgan can be a valuable tool for understanding traffic and improving your application's performance.

Would you like more advanced examples or explanations on how to use Morgan?
