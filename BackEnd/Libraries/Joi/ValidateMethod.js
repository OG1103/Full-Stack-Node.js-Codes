// Import Joi
const Joi = require("joi");

// Define a sample schema for validating user data
const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.base": "Username should be a type of text",
    "string.empty": "Username cannot be empty",
    "string.min": "Username should have at least 3 characters",
    "any.required": "Username is a required field",
  }),
  age: Joi.number().integer().min(18).required().messages({
    "number.base": "Age must be a number",
    "number.min": "Age must be at least 18",
    "any.required": "Age is required",
  }),
});

// Sample data to validate
const validData = { username: "john_doe", age: 25 };
const invalidData = { username: "", age: 16 };

// Validate valid data
const result1 = schema.validate(validData);

// Notes on `validate()` method:
// - `validate()` returns an object containing:
//   1. `value`: The validated object. It contains all the properties that passed validation, and defaults are applied if any were defined in the schema. This field is returned regardless of validation success or failure.
//   2. `error`: The error object. It exists only if the validation failed and contains detailed information about the validation errors. If validation succeeds, this field is `undefined`.

// Logging the result for valid data
console.log("Validation Result for validData:", result1);
/* 
  Output for valid data:
  {
    value: { username: 'john_doe', age: 25 },
    error: undefined  // No error since validation passed
  }

  Explanation of fields:
  - `value`: Contains the valid data `{ username: 'john_doe', age: 25 }`.
  - `error`: Since the validation passed, it is `undefined`. If there were errors, `error` would contain detailed information.
*/

// Validate invalid data
const result2 = schema.validate(invalidData);

// Error Handling:
// If validation fails, the `error` object will contain a `ValidationError`.
// This object includes:
// - `message`: A human-readable description of what went wrong.
// - `details`: An array of errors, where each error contains:
//   - `message`: A detailed message specific to that error.
//   - `path`: The path of the invalid field (e.g., `['username']`).
//   - `type`: The type of validation error (e.g., 'string.empty' for an empty string).
//   - `context`: Additional information, like the invalid value, the rule that failed, etc.

console.log("Validation Result for invalidData:", result2);
/*
  Output for invalid data:
  {
    value: { username: '', age: 16 },
    error: [Error [ValidationError]: "username" cannot be empty. "age" must be at least 18] {
      _original: { username: '', age: 16 },  // The original object that was validated
      details: [  // Array of validation errors
        {
          message: '"username" cannot be empty',
          path: [ 'username' ],
          type: 'string.empty',
          context: { label: 'username', key: 'username', value: '' }
        },
        {
          message: '"age" must be at least 18',
          path: [ 'age' ],
          type: 'number.min',
          context: { limit: 18, value: 16, label: 'age', key: 'age' }
        }
      ]
    }
  }

  Detailed explanation:
  - `value`: Contains the original validated data `{ username: '', age: 16 }`. 
    - Even though the data is invalid, the `value` field still contains the object for reference.
  - `error`: This is where the validation errors are described.
    - `message`: A summary error message combining all validation issues: `"username" cannot be empty. "age" must be at least 18`.
    - `details`: An array containing details of individual validation errors:
      - First error: 
        - The `username` field failed the validation because it is empty (`string.empty`).
        - The error message: `"username" cannot be empty`.
        - The path indicates the exact field (`path: ['username']`).
      - Second error: 
        - The `age` field is less than the minimum allowed value (`number.min`).
        - The error message: `"age" must be at least 18`.
        - The path shows the error relates to the `age` field (`path: ['age']`).
*/

// The `validate` method can also be customized with options like allowing unknown fields or stripping unwanted properties.
const result3 = schema.validate({ username: "jane_doe", age: 22, extraField: "notAllowed" }, { stripUnknown: true });

// Notes on Options:
// - `{ stripUnknown: true }`: This option removes any keys in the object that are not specified in the schema.
//   In this case, the `extraField` will be removed from the result.

console.log("Validation Result with stripUnknown:", result3);
/*
  Output:
  {
    value: { username: 'jane_doe', age: 22 },
    error: undefined

    Explanation:
    - `value`: The `extraField` was removed because of the `stripUnknown: true` option.
    - `error`: Since the validation passed, there is no error.
*/

// Using abortEarly option to control validation error reporting
const result4 = schema.validate({ username: "", age: 16 }, { abortEarly: false });

// Explanation of abortEarly:
// - `abortEarly`: A boolean option that determines whether to stop validating after the first error.
//   - If set to `true` (default), Joi will stop at the first validation error. Therefore, only including the first error it encounters
//   - If set to `false`, Joi will continue validating all fields and return all validation errors found.

// Logging the result for invalid data with abortEarly set to false
console.log("Validation Result for invalidData with abortEarly:false:", result4);
/*
  Output for invalid data with abortEarly set to false:
  {
    value: { username: '', age: 16 },
    error: [Error [ValidationError]: "username" cannot be empty. "age" must be at least 18] {
      _original: { username: '', age: 16 },
      details: [
        {
          message: '"username" cannot be empty',
          path: ['username'],
          type: 'string.empty',
          context: { label: 'username', key: 'username', value: '' }
        },
        {
          message: '"age" must be at least 18',
          path: ['age'],
          type: 'number.min',
          context: { limit: 18, value: 16, label: 'age', key: 'age' }
        }
      ]
    }
  }

  Detailed explanation:
  - `value`: The original object that was validated, `{ username: '', age: 16 }`.
  - `error`: Describes all validation errors.
    - `message`: Summary of all issues: `"username" cannot be empty. "age" must be at least 18`.
    - `details`: An array with detailed errors for each invalid field:
      - First error for `username`: Indicates it is empty.
      - Second error for `age`: Indicates it is below the minimum required value.
*/

// Validate invalid data using abortEarly set to true
const result5 = schema.validate({ username: "", age: 16 }, { abortEarly: true });

// Logging the result for invalid data with abortEarly set to true
console.log("Validation Result for invalidData with abortEarly:true:", result5);
/*
  Output for invalid data with abortEarly set to true:
  {
    value: { username: '', age: 16 },
    error: [Error [ValidationError]: "username" cannot be empty] {
      _original: { username: '', age: 16 },
      details: [
        {
          message: '"username" cannot be empty',
          path: ['username'],
          type: 'string.empty',
          context: { label: 'username', key: 'username', value: '' }
        }
      ]
    }
  }

  Explanation:
  - `value`: The original validated data, `{ username: '', age: 16 }`.
  - `error`: Contains the first encountered validation error:
    - Only the error for `username` is shown because validation stopped after the first failure (due to `abortEarly: true`).
*/
