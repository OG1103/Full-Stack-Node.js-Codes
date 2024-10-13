// ------------------------------------
// Custom Validations with Joi - JavaScript Notes
// ------------------------------------

// 1. Setting up Joi
// First, install Joi by running:
// npm install joi

// 2. Using the `.custom()` Method for Custom Validation
// The `.custom()` method allows us to define custom validation logic for specific fields.
// It accepts two main parameters: value and helpers.

// - `value`: The value of the field that is being validated.
// - `helpers`: An object that provides helper methods like `helpers.message()`
//   which allows you to throw custom error messages.

const schema = Joi.object({
  // A username field that must be a string and required
  username: Joi.string().required(),

  // A password field that must follow custom validation rules
  password: Joi.string().custom((value, helpers) => {
    // Check if the password contains at least one uppercase letter
    if (!/[A-Z]/.test(value)) {
      // Use helpers.message() to return a custom error message
      return helpers.message('Password must contain at least one uppercase letter');
    }

    // Check if the password contains at least one lowercase letter
    if (!/[a-z]/.test(value)) {
      return helpers.message('Password must contain at least one lowercase letter');
    }

    // Check if the password contains at least one digit
    if (!/\d/.test(value)) {
      return helpers.message('Password must contain at least one digit');
    }

    // If validation passes, return the value
    return value;
  }).required() // Mark the field as required
});

// 3. Validating Input Data with Custom Validation
const data = {
  username: 'JohnDoe',
  password: 'Password1'
};

const result = schema.validate(data);

if (result.error) {
  // Print validation errors (if any)
  console.log(result.error.details);
} else {
  // Print success message if validation passes
  console.log('Validation passed');
}

/*
Explanation:
- `.custom(value, helpers)` takes two parameters:
  - `value`: The field value being validated (e.g., the password).
  - `helpers`: An object that provides utility methods like `helpers.message()` for custom error messages.
- We use regular expressions (`/[A-Z]/`, `/[a-z]/`, `/\d/`) to check for uppercase letters, lowercase letters, and digits.
- `helpers.message()` is used to return a custom error message if validation fails.
*/


// 4. Using Joi Extensions for Custom Validation
// Joi extensions allow you to extend Joi with custom validation rules that can be reused.

const customJoi = Joi.extend((joi) => ({
  type: 'string',  // Extend the string type
  base: joi.string(),  // Base this extension on Joi's string type
  messages: {
    // Define a custom error message for our custom rule
    'string.noSpecialChars': '{{#label}} must not contain special characters'
  },
  rules: {
    // Define the custom validation rule
    noSpecialChars: {
      validate(value, helpers) {
        // Check if the string contains any special characters
        if (/[^a-zA-Z0-9]/.test(value)) {
          // Return a custom error using the error message defined above
          return helpers.error('string.noSpecialChars');
        }
        // Return the value if it passes validation
        return value;
      }
    }
  }
}));

// 5. Defining a Schema with the Custom Rule
const customSchema = customJoi.object({
  // Validate username with the custom rule to disallow special characters
  username: customJoi.string().noSpecialChars().required(),
  email: Joi.string().email().required()  // Validate email using standard Joi methods
});

// 6. Validating Data with the Custom Joi Extension
const userData = {
  username: 'JohnDoe!',
  email: 'john@example.com'
};

const customResult = customSchema.validate(userData);

if (customResult.error) {
  // Print validation errors (if any)
  console.log(customResult.error.details);
} else {
  // Print success message if validation passes
  console.log('Validation passed');
}

/*
Explanation:
- We use `Joi.extend()` to add a custom validation rule called `noSpecialChars` that checks if the string contains special characters.
- Inside the custom rule, we define the validation logic (using regex) and provide a custom error message if the rule is violated.
- The custom rule can be reused across multiple schemas.
*/


// 7. Key Points to Remember
/*
- The `.custom()` method takes two parameters:
  - `value`: The value of the field being validated.
  - `helpers`: A helper object providing methods like `helpers.message()` to return custom error messages.
- `Joi.extend()` allows you to create reusable validation logic as custom rules.
- Always return the `value` if validation passes, and use `helpers.error()` or `helpers.message()` to throw custom errors when validation fails.
*/
