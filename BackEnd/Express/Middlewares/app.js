// Import required modules using ES6 syntax
import express from 'express';
import registerMiddlewares from './middlewares/index.js'; // Import the middleware loader

// Initialize Express app
const app = express();

app.use(express.json());// Middleware to parse json 

// Register all middlewares by passing the app instance
// These will be our global middlewares which will serve all routes
registerMiddlewares(app);

// Define a sample route
app.get('/', (req, res) => {
    res.send('Hello, authenticated world!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
