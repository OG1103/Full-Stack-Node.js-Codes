// Import required modules
const express = require("express");
const Joi = require("joi");

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// Define a Joi schema for user validation
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(), // The username is required and must be alphanumeric
  age: Joi.number().integer().min(0).required(), // Age is required and must be a non-negative integer
});

// Middleware function for validating user data
const validateUser = (req, res, next) => {
  // Validate the request body against the userSchema
  // import the schema if implementing it in a seperate file
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    // If validation fails, respond with a 400 status and error message
    return res.status(400).json({ error: error.details[0].message });
  }

  // If validation succeeds, attach the validated value to the request object
  req.validatedUser = value; // Store validated data for later use
  next(); // Proceed to the next middleware/route handler
};

// Use the validateUser middleware in a route
app.post(
  "/users",
  validateUser //, Controller function
);

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
