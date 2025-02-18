// Import Express and Joi
const express = require('express');
const Joi = require('joi');

const app = express();
app.use(express.json()); // To parse JSON bodies

// ✅ Middleware: Joi Validation Function
const validateSchema = (schema, property) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      // Extract error messages
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({ errors: errorMessages });
    }

    // Update the request with validated data
    // When you set { stripUnknown: true } in Joi’s validation options, Joi automatically removes any fields that are not defined in the schema. 
    // By assigning the validated value back to req[property], you ensure that:
    // Only the allowed fields remain in the request object (e.g., req.body).
    // Any fields priopr to validation that are not in req.body or req... and in the schema they have a default value, they are mounted to the req.body / req[property]
    // Unwanted or malicious fields are stripped out, improving security and data integrity.

    req[property] = value;
    next(); // Move to the next middleware or route handler
  };
};
