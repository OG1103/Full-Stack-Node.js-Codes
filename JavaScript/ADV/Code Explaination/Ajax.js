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

//----------------------------------------------------------------------
//FETCH & AXIOS  both return promises WHEN MAKING api calls
//----------------------------------------------------------------------
//1. Generalized Syntax for fetch():
//options (optional): An object that configures the request, such as method, headers, and body.
//  - method: HTTP method (e.g., 'GET', 'POST', etc.).
//  - headers: Additional headers, such as content type.
//  - body: For methods like POST, you include data in the body.

fetch(url, options)
  .then((response) => {
    if (!response.ok) {
      // Check if the response was successful
      throw new Error("HTTP error! status: " + response.status);
    }
    return response.json(); // Parse the response data (JSON)
  })
  .then((data) => {
    console.log("Data:", data); // Handle the data
  })
  .catch((error) => {
    console.error("Error:", error); // Handle the error
  });

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

//Axios
// Import Axios
//1. General Syntax for Axios GET Request:
axios
  .get(url, {
    params: {
      // (Optional) Query parameters
      param1: "value1",
      param2: "value2",
    },
    headers: {
      // (Optional) Custom headers
      Authorization: "Bearer token",
    },
  })
  .then((response) => {
    console.log("Response Data:", response.data); // Handle the response data
  })
  .catch((error) => {
    console.error("Error:", error); // Handle the error
  });

//EXAMPLE
axios
  .get("https://jsonplaceholder.typicode.com/posts/1") // API endpoint
  .then((response) => {
    // Handle success
    console.log("Data:", response.data); // The response data (already parsed as JSON)
    console.log("Status:", response.status); // HTTP status code (e.g., 200)
    console.log("Headers:", response.headers); // Response headers
  })
  .catch((error) => {
    // Handle error
    if (error.response) {
      // The request was made and the server responded with a status code outside the 2xx range
      console.log("Error Data:", error.response.data);
      console.log("Error Status:", error.response.status); // 404, 500, etc.
      console.log("Error Headers:", error.response.headers);
    } else if (error.request) {
      // The request was made, but no response was received
      console.log("Error Request:", error.request);
    } else {
      // Something else caused an error
      console.log("Error Message:", error.message);
    }
  });

axios
  .post(url, data, {
    headers: {
      // (Optional) Custom headers
      "Content-Type": "application/json",
      Authorization: "Bearer token",
    },
  })
  .then((response) => {
    console.log("Response Data:", response.data); // Handle the response data
  })
  .catch((error) => {
    console.error("Error:", error); // Handle the error
  });

//2. General Syntax for Axios POST Request:
// A POST request is used to send data to the server. This data is usually included in the body of the request.

axios
  .post(url, data, {
    headers: {
      // (Optional) Custom headers
      "Content-Type": "application/json",
      Authorization: "Bearer token",
    },
  })
  .then((response) => {
    console.log("Response Data:", response.data); // Handle the response data
  })
  .catch((error) => {
    console.error("Error:", error); // Handle the error
  });

//Example
axios
  .post(
    "https://jsonplaceholder.typicode.com/posts",
    {
      title: "New Post",
      body: "This is the content of the post.",
      userId: 1,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer myToken",
      },
    }
  )
  .then((response) => {
    console.log(response.data); // Logs the newly created resource
  })
  .catch((error) => console.error("Error:", error));
