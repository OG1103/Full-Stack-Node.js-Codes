
// ------------------------------------
// Express-validator - Example with Comments and Explanations
// ------------------------------------

const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const app = express();

app.use(express.json());  // Middleware to parse JSON requests

// 1. Example of body() validation in POST request
app.post('/register', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.send('Registration successful');
});

/*
Explanation:
- `body()` validates fields in the body of the request.
- `isEmail()` ensures that the email is in a valid format.
- `isLength()` ensures the password is at least 5 characters long.
- If validation fails, errors are collected using `validationResult()` and returned to the client.
*/

// 2. Example of param() validation in GET request
app.get('/user/:id', [
  param('id').isInt().withMessage('User ID must be an integer')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.send(`User ID is valid: ${req.params.id}`);
});

/*
Explanation:
- `param()` validates route parameters (e.g., `/user/:id`).
- `isInt()` ensures that the `id` parameter is a valid integer.
*/

// 3. Example of query() validation in GET request with query parameters
app.get('/search', [
  query('term').notEmpty().withMessage('Search term is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.send(`Searching for term: ${req.query.term}, Page: ${req.query.page || 1}`);
});

/*
Explanation:
- `query()` validates query string parameters (e.g., `/search?term=keyword&page=2`).
- `notEmpty()` ensures the search term is provided.
- `optional().isInt()` validates the page number only if it's provided.
*/

// 4. Example of custom() validation for comparing fields in POST request
app.post('/change-password', [
  body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;  // Indicates successful validation
  })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.send('Password change successful');
});

/*
Explanation:
- `custom()` allows you to define custom validation logic.
- In this case, `custom()` compares `password` and `confirmPassword` fields to ensure they match.
*/

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
