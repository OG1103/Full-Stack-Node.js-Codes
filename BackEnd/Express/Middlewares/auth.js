
// Auth middleware: Simple check for a query parameter 'auth'
export const auth = (req, res, next) => {
    if (req.query.auth === 'secret') {
        console.log('[Auth] Authentication successful');
        next(); // Pass control to the next middleware or route handler
    } else {
        res.status(401).send('Unauthorized');
    }
};

