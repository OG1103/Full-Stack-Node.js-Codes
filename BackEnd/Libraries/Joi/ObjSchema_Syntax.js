// const Joi = require('joi');

// Define a basic schema for an object (Basic Syntax)
// const schema = Joi.object({
//   fieldName: Joi.<dataType>().<validationMethod>().<validationMethod>(), // Field validation
//   fieldName2: Joi.<dataType>().<validationMethod>(),                     // Another field validation
// });

const userSchema = Joi.object({
  username: Joi.string() // Field must be a string
    .alphanum() // Only alphanumeric characters
    .min(3) // Minimum of 3 characters
    .max(30) // Maximum of 30 characters
    .required(), // Field is required

  password: Joi.string() // Field must be a string
    .min(8) // Minimum of 8 characters
    .required(), // Field is required

  repassword: Joi.string() // Field must be a string
    .valid(Joi.ref("password")) // Must match the password field
    .required() // Field is required
    .messages({
      // Custom error messages
      "any.only": "Repassword must match the password", // Message if it doesn't match
      "string.empty": "Repassword cannot be empty", // Message for empty input
    }),

  age: Joi.number() // Field must be a number
    .integer() // Must be an integer
    .min(18) // Minimum value is 18
    .required(), // Field is required
});

//Schema with Nested Objects
//Nested Objects: Joi supports nested object validation by defining a schema within a schema.
const userSchemaWithAddress = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().integer().min(18).required(),

  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string()
      .pattern(/^[0-9]{5}$/)
      .required(), // 5-digit postal code
  }).required(), // The address object itself is required
});
