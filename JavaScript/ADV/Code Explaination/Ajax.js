// Example of a Basic GET Request with fetch()
fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json(); // Parse JSON response
  })
  .then((data) => {
    console.log(data); // Handle the parsed data
  })
  .catch((error) => {
    console.error("There has been a problem with your fetch operation:", error);
  });

//Example of a POST Request
//When sending data to a server, such as submitting a form or saving data, you use the POST method. You can pass the data in the body field of the options object.
fetch("https://jsonplaceholder.typicode.com/posts", {
  method: "POST", // Specify HTTP method
  headers: {
    "Content-Type": "application/json", // Set the request headers
  },
  body: JSON.stringify({
    title: "New Post",
    body: "This is the body of the new post",
    userId: 1,
  }),
})
  .then((response) => response.json()) // Parse the JSON response
  .then((data) => console.log(data)) // Handle the response data
  .catch((error) => console.error("Error:", error));

//------------------------------------------------------------------------

// XMLHttpRequest
// Create a new XMLHttpRequest object
const xhr = new XMLHttpRequest();

// Open a GET request
xhr.open("GET", "https://jsonplaceholder.typicode.com/posts/1", true);

// Define what happens on success
xhr.onload = function () {
  if (xhr.status === 200) {
    const response = JSON.parse(xhr.responseText);
    console.log("Post title:", response.title);
  } else {
    console.error("Error:", xhr.statusText);
  }
};

// Define what happens in case of error
xhr.onerror = function () {
  console.error("Request failed");
};

// Send the request
xhr.send();
