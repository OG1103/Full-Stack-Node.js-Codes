# Frontend Notes: Automatic Login Detection Using Cookies

## How Cookies Enable Automatic Login Detection

1. **Browser Storage of Cookies**:

   - Cookies are stored in the browser and associated with the domain they were set for.
   - If the cookie has a `maxAge` or `expires` property, it persists in the browser even if all tabs are closed. Once the browser is reopened, the cookie is still available unless it has expired.
   - For session cookies (cookies without `maxAge` or `expires`), they are cleared when the browser is closed (session cookies will still exist if you close all tabs of the website but keep the browser open.).

2. **Automatic Inclusion of Cookies**:
   - When a user opens a new tab or revisits the site, the browser automatically includes valid cookies (that match the domain and path) with every request to the server.
   - This behavior enables seamless authentication across tabs, as long as the cookie is valid.

---

## Frontend Logic: Detecting Login State and Redirecting

You can use cookies to detect whether the user is logged in and handle automatic redirects to the appropriate page (e.g., `/profile` or `/login`).

### Workflow:

1. **Check the Authentication State**:
   - When the page loads, check the user's login status by verifying the cookie on the backend using an API.
2. **Redirect Based on the Authentication State**:
   - If the user is logged in (cookie is valid), display the profile page.
   - If the user is not logged in (cookie is missing or invalid), redirect to the login page.

---

## Example Frontend Code in React

Below is an example implementation in a React application:

### **Main Component: HomePage**

```javascript
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Example API call to check authentication
    fetch("/api/auth/check", {
      credentials: "include", // Ensures cookies are included
    })
      .then((response) => {
        if (response.status === 200) {
          // User is authenticated, stay on the profile page
          console.log("User is authenticated");
        } else {
          // User is not authenticated, redirect to login
          navigate("/login");
        }
      })
      .catch(() => {
        // On error, assume user is not authenticated
        navigate("/login");
      });
  }, [navigate]);

  return <h1>Welcome to the Home Page</h1>;
};

export default HomePage;
```
