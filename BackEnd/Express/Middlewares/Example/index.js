
// Import all middleware functions using ES6 syntax
import logger from './logger.js';
import auth from './auth.js';


// Default function to register all middlewares
export default (app) => {
    app.use(logger); // Register logger middleware
    app.use(auth);   // Register auth middleware
    console.log('Middlewares registered successfully');
};


