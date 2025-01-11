
import express from 'express';
import exampleRouter from './exampleRouter.js'; // Import the router

// Function to initialize routes and attach them to the app
const initializeRoutes = (app) => {
    app.use('/api/example', exampleRouter); // Attach the router under '/api/example' path
};

export default initializeRoutes;
