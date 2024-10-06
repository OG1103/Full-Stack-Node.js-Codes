/**
 * ==========================
 * Form Handling and Validation in the DOM
 * ==========================
 *
 * Handling forms is a common task in web development. It involves:
 *  - Capturing input from users
 *  - Validating the input data
 *  - Providing feedback or sending the data to the server
 *
 * Let's walk through the basic and advanced techniques for handling forms and validating input in JavaScript.
 */

/**
 * 1. Accessing Form Elements
 * --------------------------
 * Every input field in a form can be accessed using JavaScript through the DOM.
 * We can use methods like `getElementById`, `querySelector`, or access the form as an object.
 */

// Accessing the form element by its ID
const form = document.getElementById("signup-form");

// Accessing specific inputs by their ID
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

/**
 * 2. Listening for Form Submission
 * --------------------------------
 * Forms are usually submitted when a user clicks a submit button. We can capture this event
 * using an `event listener`. By default, form submission reloads the page, but we often want
 * to prevent this and handle the data ourselves.
 */

// Add an event listener to the form
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevents the form from submitting and refreshing the page

  // Access the input values using the `.value` property
  const username = usernameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  // Log the input values to the console (for debugging)
  console.log("Username:", username);
  console.log("Email:", email);
  console.log("Password:", password);

  // Call the validation function
  validateForm(username, email, password);
});

/**
 * 3. Basic Form Validation
 * ------------------------
 * Validating form data means checking whether the input is correct before submitting it.
 * We can validate different aspects, such as:
 *  - Ensuring required fields are not empty
 *  - Checking email formats
 *  - Validating password length
 *
 * Validation provides better user experience and prevents bad data from being sent to the server.
 */

// Basic validation function
function validateForm(username, email, password) {
  // Initialize an empty error message
  let errorMessage = "";

  // Check if the username is empty
  if (username.trim() === "") {
    errorMessage += "Username is required.\n";
  }

  // Check if the email is valid using a simple regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation pattern
  if (!emailRegex.test(email)) {
    errorMessage += "Please enter a valid email address.\n";
  }

  // Check if the password meets minimum length requirements
  if (password.length < 6) {
    errorMessage += "Password must be at least 6 characters long.\n";
  }

  // If there are any errors, display them to the user
  if (errorMessage !== "") {
    alert(errorMessage); // Show an alert with the errors
    return false; // Stop the form from being submitted
  } else {
    alert("Form submitted successfully!");
    return true; // Form is valid and can be submitted
  }
}

/**
 * 4. Custom Validation
 * --------------------
 * You can create custom validation rules beyond the basic ones.
 * Here’s an example where we add custom rules for the password:
 *  - Must contain at least one number
 *  - Must contain at least one uppercase letter
 */

// More advanced validation for the password
function validatePassword(password) {
  let errorMessage = "";

  // Check for at least one number
  const hasNumber = /\d/;
  if (!hasNumber.test(password)) {
    errorMessage += "Password must contain at least one number.\n";
  }

  // Check for at least one uppercase letter
  const hasUpperCase = /[A-Z]/;
  if (!hasUpperCase.test(password)) {
    errorMessage += "Password must contain at least one uppercase letter.\n";
  }

  return errorMessage; // Return any password errors
}

// Modify the form validation function to use the advanced password validation
function validateFormWithPassword(username, email, password) {
  let errorMessage = "";

  if (username.trim() === "") {
    errorMessage += "Username is required.\n";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorMessage += "Please enter a valid email address.\n";
  }

  const passwordErrors = validatePassword(password);
  if (passwordErrors !== "") {
    errorMessage += passwordErrors;
  }

  if (errorMessage !== "") {
    alert(errorMessage);
    return false;
  } else {
    alert("Form submitted successfully!");
    return true;
  }
}

/**
 * 5. Real-Time Validation
 * -----------------------
 * Instead of waiting until the form is submitted, you can provide immediate feedback as users fill in
 * the form. This is called **real-time validation**.
 *
 * To do this, you can listen to events like `input` or `change` on individual input fields.
 */

// Example: Real-time email validation
emailInput.addEventListener("input", function () {
  const email = emailInput.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    emailInput.style.borderColor = "red"; // Indicate an error with red border
  } else {
    emailInput.style.borderColor = "green"; // Valid email will have green border
  }
});

/**
 * 6. Using Built-in HTML5 Form Validation
 * ---------------------------------------
 * HTML5 introduces several built-in validation features. You can set attributes on form elements
 * like `required`, `minlength`, `pattern`, etc., and the browser will automatically handle
 * some validation.
 */

// Example of HTML5 attributes for validation (used in the HTML):
// <input type="email" id="email" required>
// <input type="password" id="password" minlength="6">

// You can still manually check validity using JavaScript:
if (!emailInput.checkValidity()) {
  console.log("Email is invalid:", emailInput.validationMessage);
}

/**
 * 7. Styling Validation Errors
 * ----------------------------
 * It's common to highlight fields with errors, using CSS to provide better feedback to users.
 * You can add or remove classes based on the validation result.
 */

// Add CSS class for error and success
function setValidationState(inputElement, isValid) {
  if (isValid) {
    inputElement.classList.remove("error");
    inputElement.classList.add("success");
  } else {
    inputElement.classList.add("error");
    inputElement.classList.remove("success");
  }
}

// Apply validation styles to the username input
usernameInput.addEventListener("input", function () {
  const username = usernameInput.value;
  setValidationState(usernameInput, username.trim() !== "");
});

/**
 * 9. Best Practices
 * -----------------
 * - **Keep validation feedback clear and user-friendly**: Users should know exactly what's wrong.
 * - **Use both client-side and server-side validation**: Client-side validation improves UX, but server-side validation is crucial for security.
 * - **Avoid blocking users unnecessarily**: Provide real-time feedback without stopping them from progressing.
 * - **Remember accessibility**: Ensure that form elements are accessible and provide meaningful feedback to users with disabilities.
 */
