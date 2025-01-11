
import express from 'express';

const router = express.Router();

// Define a sample GET route using the router
router.get('/', (req, res) => {
    res.send('Hello from the example router!');
});

export default router;
