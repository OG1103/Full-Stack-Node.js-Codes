//import Joi from 'joi'
/* 
1. Overview of Joi Methods and Properties:
   Joi is a powerful validation library that provides several methods and properties for validating data types such as strings, numbers, objects, arrays, and more.
   Here's a detailed explanation of these methods along with the use of `.messages()` to customize error messages.
*/

////////////////////////////////////////////////////////////////////////////
// 1. Basic Data Types and their Methods:

// 1.1. String Validation
const stringSchema = Joi.string()
  .min(3) // Minimum length
  .max(30) // Maximum length
  .alphanum() // Only alphanumeric characters
  .email() // Email format
  .required() // Required field
  .messages({
    // Custom error messages for the above rules
    "string.base": "The value must be a string",
    "string.empty": "This field cannot be empty",
    "string.min": "This field must have at least {#limit} characters",
    "string.max": "This field cannot exceed {#limit} characters",
    "string.alphanum": "This field can only contain alphanumeric characters",
    "string.email": "This field must be a valid email",
    "any.required": "This field is mandatory",
  });

/* 
  Notes on String Methods:
  - `.min(value)`: Ensures the string has at least `value` characters.
  - `.max(value)`: Ensures the string has no more than `value` characters.
  - `.alphanum()`: Restricts the string to alphanumeric characters.
  - `.email()`: Validates that the string is a valid email address.
  - `.required()`: Ensures the field is present in the input object.
*/

// 1.2. Number Validation
const numberSchema = Joi.number()
  .integer() // Integer validation
  .min(1) // Minimum value
  .max(100) // Maximum value
  .required() // Required field
  .messages({
    "number.base": "The value must be a number",
    "number.integer": "The value must be an integer",
    "number.min": "The number cannot be less than {#limit}",
    "number.max": "The number cannot be greater than {#limit}",
    "any.required": "This field is mandatory",
  });

/* 
  Notes on Number Methods:
  - `.integer()`: Ensures the number is an integer.
  - `.min(value)`: Ensures the number is at least `value`.
  - `.max(value)`: Ensures the number is no more than `value`.
  - `.required()`: Ensures the field is present in the input object.
*/

// 1.3. Boolean Validation
const booleanSchema = Joi.boolean().messages({
  "boolean.base": "The value must be a boolean",
});

/* 
  Notes on Boolean Methods:
  - `.boolean()`: Ensures the value is a boolean (`true` or `false`).
*/

// 1.4. Array Validation
const arraySchema = Joi.array()
  .items(Joi.string()) // Items must be strings
  .min(1) // Minimum array length
  .max(5) // Maximum array length
  .messages({
    "array.base": "The value must be an array",
    "array.min": "The array must contain at least {#limit} items",
    "array.max": "The array cannot contain more than {#limit} items",
  });

/* 
  Notes on Array Methods:
  - `.items(schema)`: Specifies the schema for the items in the array (e.g., string, number).
  - `.min(value)`: Ensures the array contains at least `value` items.
  - `.max(value)`: Ensures the array contains no more than `value` items.
*/

// 1.5. Object Validation
const objectSchema = Joi.object({
  username: Joi.string().required(),
  age: Joi.number().min(18).required(),
}).messages({
  "object.base": "The value must be an object",
  "any.required": "{#label} is required", // Generic message for any required field
});

/* 
  Notes on Object Methods:
  - `.object(schema)`: Defines a schema for an object with specified keys and their validation rules.
*/

////////////////////////////////////////////////////////////////////////////
// 2. Additional Joi Methods and Properties:

// 2.1. Pattern Validation (Regex)
const patternSchema = Joi.string()
  .pattern(/^[a-zA-Z0-9]{3,30}$/)
  .messages({
    "string.pattern.base": "The value must match the pattern: {#regex}",
  });

/* 
  Notes on Pattern Methods:
  - `.pattern(regex)`: Ensures the string matches the given regular expression.
*/

// 2.2. Date Validation
const dateSchema = Joi.date()
  .greater("now") // Must be a future date
  .iso() // ISO 8601 date format
  .messages({
    "date.base": "The value must be a valid date",
    "date.greater": "The date must be in the future",
    "date.format": "The date must be in ISO format",
  });

/* 
  Notes on Date Methods:
  - `.greater(date)`: Ensures the date is after the specified date (e.g., 'now' for the current date).
  - `.iso()`: Ensures the date is in ISO 8601 format.
*/

// 2.3. Default Values
const defaultSchema = Joi.string()
  .default("Guest") // Sets a default value if not provided
  .messages({
    "any.required": "The value is required and defaults to Guest",
  });

/* 
  Notes on Default Values:
  - `.default(value)`: Assigns a default value if the field is missing from the input.
*/

////////////////////////////////////////////////////////////////////////////
// 3. Custom Error Messages with .messages()

/* 
  The `.messages()` method allows you to customize error messages for specific validation rules. 
  You can specify different messages for different validation failures. The messages can contain placeholders 
  like `{#limit}` or `{#regex}` to include dynamic content (e.g., the value of the limit or the regex pattern).

  Common placeholders:
  - `{#limit}`: The value passed to methods like `.min()`, `.max()`.
  - `{#label}`: The label or field name being validated.
  - `{#value}`: The actual value being validated.
  - `{#regex}`: The regular expression being used for pattern matching.
*/

// Example schema with custom error messages for each rule
const customMessageSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Name must be a text value",
    "string.min": "Name should be at least {#limit} characters long",
    "string.max": "Name cannot exceed {#limit} characters",
    "any.required": "Name is a required field",
  }),
  age: Joi.number().min(18).max(65).required().messages({
    "number.base": "Age must be a number",
    "number.min": "Age must be at least {#limit}",
    "number.max": "Age cannot be greater than {#limit}",
    "any.required": "Age is required",
  }),
});

/* 
  In this schema, the `.messages()` method is used to provide custom error messages for each validation method. 
  The dynamic placeholders `{#limit}` and `{#label}` allow you to customize the message for each specific rule.
*/

////////////////////////////////////////////////////////////////////////////
// 4. Default Messages in Joi:

/* 
  Joi provides default error messages if `.messages()` is not used. 
  These messages are automatically included when validation fails. Here are some examples:

  - `string.base`: "must be a string"
  - `string.empty`: "is not allowed to be empty"
  - `number.base`: "must be a number"
  - `number.min`: "must be larger than or equal to {#limit}"
  - `array.min`: "must contain at least {#limit} items"
  - `any.required`: "is required"

  You can override these default messages by passing custom messages with the `.messages()` method.
*/

////////////////////////////////////////////////////////////////////////////
// 5. Error Object Returned by Joi:

/* 
  When validation fails, Joi returns an error object containing:
  - `message`: A description of the validation error.
  - `details`: An array of error objects, each describing one validation failure.
  - `path`: The path to the invalid field.
  - `type`: The type of validation that failed.
  - `context`: Additional context, like the value being validated, the limit, or regex pattern.

  Example of an error object:
  {
    message: '"age" must be larger than or equal to 18',
    details: [
      {
        message: '"age" must be larger than or equal to 18',
        path: ['age'],
        type: 'number.min',
        context: { label: 'age', key: 'age', limit: 18, value: 16 }
      }
    ]
  }
*/
