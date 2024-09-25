// Select the form and the submit button by their ID
const form = document.getElementById("signup-form");
const submitBtn = document.getElementById("submit-btn");

// Add an event listener for form submission
form.addEventListener("submit", function (event) {
  // Prevent the form from submitting and refreshing the page
  event.preventDefault();

  // Get the values from the form inputs
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  // Display the values in the console (or process them as needed)
  console.log("Username:", username.value);
  console.log("Email:", email.value);
  console.log("Password:", password.value);

  // You can store these values or send them to a server via an API call.

  // Example: Display a confirmation message on successful sign-up
  alert(`Welcome, ${username.value}! Your sign-up was successful.`);
});
