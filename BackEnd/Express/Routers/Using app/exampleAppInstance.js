
// Function to declare routes directly using the app instance
const declareRoutes = (app) => {
    app.get('/api/example', (req, res) => {
        res.send('Hello from the example route using app instance!');
    });

    app.put('/api/example', (req, res) => {
        res.send('This is a PUT route using direct app instance!');
    });
};

export default declareRoutes;
