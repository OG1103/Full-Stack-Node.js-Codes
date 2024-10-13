
# Built-in Validation Methods in Express-validator

Express-validator provides several built-in validation methods that allow you to perform various checks on incoming data.

## Commonly Used Built-in Validation Methods

1. **isEmail()**
   - Checks if the field is a valid email address.
   - Example:
     ```js
     body('email').isEmail().withMessage('Enter a valid email')
     ```

2. **isLength({ min, max })**
   - Checks if the length of the input is between a specified range.
   - Example:
     ```js
     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
     ```

3. **isInt()**
   - Checks if the input is an integer.
   - Example:
     ```js
     param('id').isInt().withMessage('ID must be an integer')
     ```

4. **isAlphanumeric()**
   - Checks if the input contains only letters and numbers.
   - Example:
     ```js
     body('username').isAlphanumeric().withMessage('Username must be alphanumeric')
     ```

5. **isBoolean()**
   - Checks if the input is a boolean value (`true` or `false`).
   - Example:
     ```js
     body('isActive').isBoolean().withMessage('Active status must be true or false')
     ```

6. **isDate()**
   - Checks if the input is a valid date.
   - Example:
     ```js
     body('birthdate').isDate().withMessage('Enter a valid date')
     ```

7. **notEmpty()**
   - Ensures that the field is not empty.
   - Example:
     ```js
     body('name').notEmpty().withMessage('Name cannot be empty')
     ```

8. **optional()**
   - Skips validation if the field is not present in the request.
   - Example:
     ```js
     body('middleName').optional().isString()
     ```

9. **isNumeric()**
   - Ensures that the input contains only numeric characters.
   - Example:
     ```js
     body('age').isNumeric().withMessage('Age must be a numeric value')
     ```

## Custom Error Messages

You can chain `.withMessage()` to any built-in method to provide a custom error message:
```js
body('email').isEmail().withMessage('Invalid email format');
```

