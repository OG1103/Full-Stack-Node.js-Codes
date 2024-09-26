# React Frontend Setup

# Project Structure

├── /client # Frontend folder for React app
│ ├── /public # Static files for the React app
│ ├── /src
│ │ ├── /components # Reusable React components
│ │ │ └── Header.js # Example component
│ │ ├── /pages # React pages (views)
│ │ │ ├── HomePage.js # Example page
│ │ │ └── ProductPage.js
│ │ ├── /services # Frontend API calls (to the backend)
│ │ │ └── api.js
│ │ ├── /utils # Store any helper files for frontend
│ │ │ └── helpers.js # Example helper file
│ │ ├── App.js # Main React file
│ │ └── index.js # Entry point for the React app
│ ├── .env # Frontend environment variables
│ ├── package.json # Frontend package manifest
│ ├── package-lock.json
│ └── ReadMe.md

# Explanation of Project Structure:

    - public/index.html: Contains the base HTML structure and a div where the React app will be mounted.
    - src/index.js: Entry point of the React app, which renders the main App component.
    - src/App.js: Main component responsible for rendering different pages using routing.
    - components: Contains reusable components like Header, which is used across different pages.
    - pages: Contains views or "pages" of the application like HomePage and ProductPage.
    - services/api.js: Contains API functions for making requests to the backend.
    - utils/helpers.js: Contains helper functions to simplify code (e.g., formatting data).
    - .env: Stores environment variables for the frontend.

# 1 Install dependencies

npm init -y
npm install react react-dom react-router-dom axios react-scripts

# 2 INITILIAZE Index.html, App.js, Index.js , pages/Homepage, componenets/Headers.js, services/api.js

## 1. index.html (in /public):

- This is the entry point for your app in the browser. It includes the <div id="root"></div> where the React app will be injected.
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>React App</title>
  </head>
  <body>
      <div id="root"></div> <!-- React app mounts here -->
  </body>
  </html>

    - You can an index.css file in the public folder as well its optional incase you want to add global styling
    - Then in the index.js you can import it using: import "../Public/index.css";

## 2. index.js (in /src):

    - This is the entry point of the React application. It renders the <App /> component inside the #root div in index.html.

    ```javascript
    import React from 'react';
    import ReactDOM from 'react-dom';
    import App from './App';

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    );
    ```

## 3. App.js (in /src):

    -  This is the main React component that holds the application’s structure. Here, you can define routes and manage global state.
    - EX:

    ```javascript
    import React from "react";
    import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
    import HomePage from "./pages/HomePage.js";
    import Header from "./components/Header.js"; {/* initialize a header componenet in /componenets */}

    const App = () => {
    return (
        <Router> {/* This sets up the routing system */}
        <Header /> {/* The Header component will appear on all pages  and typically at the top */}
        <Routes>  {/* This wraps all the routes for different pages */}
            <Route path="/" element={<HomePage />} />  {/* Defines a route for the home page */}
            {/* Defines a route for any other page, However import it first*/}
        </Routes>
        </Router>
    );
    };

export default App;

```
## 4. /components/Header.js:
    -  Reusable components like Header.js can be placed here.
    - ex:

    ```javascript
    import React from 'react';
    import { Link } from 'react-router-dom';

    function Header() {
        return (
            <header>
                <nav>
                    <Link to="/">Home</Link>
                </nav>
            </header>
        );
    }

    export default Header;
    ```

## 5. /pages/HomePage.js:
   - This file contains the code for the homepage.
   - Example:

    ```javascript
    import React from 'react';

    function HomePage() {
        return (
            <div>
                <h1>Welcome to the Home Page</h1>
            </div>
        );
    }

    export default HomePage;
    ```

## 6. /services/api.js:
    - This file contains API calls using Axios to interact with the backend.
    - EX :

    ```javascript
    import axios from 'axios';
    // Set the base URL to point to your backend's address (in this case, localhost:8000)
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    // Function to fetch users from the backend, with optional pagination
    export const fetchUsers = async (page = 1, limit = 10) => {
        try {
            // API request to fetch users with pagination (e.g., ?page=1&limit=10)
            const response = await axios.get(`${API_BASE_URL}/api/users`, {
                params: {
                    page: page,   // Page number for pagination
                    limit: limit  // Number of users to fetch per page
                }
            });
            // Return the users data from the response
            return response.data;
        } catch (error) {
            // Detailed error handling with specific feedback
            if (error.response) {
                // The request was made and the server responded with a status code outside of the 2xx range
                console.error('Error response:', error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error request:', error.request);
            } else {
                // Something happened while setting up the request
                console.error('Error setting up request:', error.message);
            }

            // Throw the error so it can be handled in the calling function
            throw error;
        }
    };
```

## 7. /utils/helpers.js:
    - Utility functions that help simplify your code can be stored here.

## 8. Add the Environment Variable to .env:
    - Note: In react you have to have REACT_APP_ before the variable name.

    - Add to .env : REACT_APP_API_BASE_URL=http://localhost:8000


# 3 Run the Application
    - npm start