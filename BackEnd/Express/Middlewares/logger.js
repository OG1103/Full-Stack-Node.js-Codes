
// Logger middleware: Logs the request method, URL, and timestamp
export const logger = (req, res, next) => {
    console.log(`[Logger] Method: ${req.method}, URL: ${req.url}, Time: ${new Date().toISOString()}`);
    next(); // Pass control to the next middleware
};

