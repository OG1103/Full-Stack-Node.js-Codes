
// Import the required modules
import express from 'express';
import morgan from 'morgan';


// Initialize the Express application
const app = express();

// Use Morgan middleware with 'dev' format
// The 'dev' format provides concise colored logs for development
app.use(morgan('dev'));

// Define a sample route
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

/*
Explanation:
1. Morgan is imported and initialized using `morgan('dev')`.
2. The middleware `app.use(morgan('dev'))` is added before defining routes. This ensures that every incoming request is logged.
3. When a request is made to the root URL ('/'), Morgan logs the request details, such as the method (GET), URL (/), status code (200), and response time.
4. The server listens on port 3000 and logs a message when it starts.
5. You can change the log format by replacing 'dev' with other formats like 'combined' or 'tiny'.
*/
