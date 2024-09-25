// exception-handling.js

/*
 * Exception Handling in JavaScript
 *
 * JavaScript provides a powerful mechanism to handle runtime errors:
 * the `try...catch...finally` structure. This allows you to handle
 * errors gracefully, preventing the program from crashing.
 *
 * This file will cover:
 * 1. try...catch
 * 2. finally
 * 3. Throwing custom errors
 * 4. Creating custom exceptions
 */

// 1. Basic try...catch

/*
 * The `try` block lets you write code that may throw an error.
 * If an error is thrown, control passes to the `catch` block,
 * where you can handle the error.
 */

try {
  // Code that may throw an error
  let x = 10;
  let y = 0;
  if (y === 0) {
    throw new Error("Cannot divide by zero!");
  }
  let result = x / y;
  console.log(result);
} catch (error) {
  // This block is executed if an error is thrown in the try block
  console.error("An error occurred:", error.message);
}

/*
 * Output:
 * An error occurred: Cannot divide by zero!
 */

/*
 * The error object passed into the `catch` block contains:
 * - error.name: The type of error (e.g., 'Error', 'TypeError')
 * - error.message: The message that describes the error
 * - error.stack: The stack trace, showing where the error occurred
 */

// 2. Using the finally block

/*
 * The `finally` block will always be executed after the try and catch blocks,
 * regardless of whether an error occurred or not. It is typically used for
 * cleanup tasks like closing files or network connections.
 */

try {
  let x = 5;
  let y = 1;
  let result = x / y;
  console.log(result);
} catch (error) {
  console.error("An error occurred:", error.message);
} finally {
  // This code will run no matter what happens above
  console.log("The try-catch block has finished execution.");
}

/*
 * Output:
 * 5
 * The try-catch block has finished execution.
 */

// Even when an error occurs, the finally block is still executed:

try {
  let a = 10;
  let b = 0;
  if (b === 0) {
    throw new Error("Cannot divide by zero again!");
  }
  let result = a / b;
  console.log(result);
} catch (error) {
  console.error("An error occurred:", error.message);
} finally {
  console.log(
    "The try-catch block has finished execution, even with an error."
  );
}

/*
 * Output:
 * An error occurred: Cannot divide by zero again!
 * The try-catch block has finished execution, even with an error.
 */

// 3. Throwing Custom Errors

/*
 * You can manually throw errors in JavaScript using the `throw` statement.
 * This is useful for enforcing certain conditions or validating data.
 */

function checkAge(age) {
  if (age < 18) {
    throw new Error("You must be at least 18 years old.");
  }
  return "Access granted!";
}

try {
  console.log(checkAge(16)); // Will throw an error
} catch (error) {
  console.error("Error:", error.message);
} finally {
  console.log("Age verification completed.");
}

/*
 * Output:
 * Error: You must be at least 18 years old.
 * Age verification completed.
 */

/*
 * You can throw any type of value as an error, though it's most common to throw
 * an instance of the `Error` class.
 */

// 4. Creating Custom Exceptions

/*
 * In JavaScript, you can create your own error types by extending the
 * built-in `Error` class. This allows you to throw and catch specific errors,
 * improving the readability and maintainability of your code.
 */

class ValidationError extends Error {
  constructor(message) {
    super(message); // Call the parent class constructor
    this.name = "ValidationError"; // Set the name of the error
  }
}

function validateUsername(username) {
  if (username.length < 5) {
    throw new ValidationError("Username must be at least 5 characters long.");
  }
  return "Username is valid!";
}

try {
  console.log(validateUsername("abc")); // Will throw ValidationError
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle ValidationError specifically
    console.error("Validation Error:", error.message);
  } else {
    // Handle other errors
    console.error("Unknown Error:", error.message);
  }
}

/*
 * Output:
 * Validation Error: Username must be at least 5 characters long.
 */

// Example of catching multiple types of errors:

try {
  let obj = null;
  console.log(obj.property); // Will throw a TypeError (null cannot have properties)
} catch (error) {
  if (error instanceof TypeError) {
    console.error("Type Error occurred:", error.message);
  } else if (error instanceof ReferenceError) {
    console.error("Reference Error occurred:", error.message);
  } else {
    console.error("An unexpected error occurred:", error.message);
  }
}

/*
 * Output:
 * Type Error occurred: Cannot read properties of null (reading 'property')
 */

// Summary

/*
 * - Use `try...catch` to handle runtime errors and prevent your program from crashing.
 * - The `catch` block provides access to the error object, where you can get details about the error.
 * - The `finally` block runs regardless of whether an error occurred, useful for cleanup.
 * - Use `throw` to manually throw errors in situations like input validation.
 * - Create custom error types by extending the built-in `Error` class for specific error handling.
 */
