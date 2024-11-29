# React Router DOM

React Router DOM is a library used for routing in React applications. It enables navigation between different components, rendering specific components based on the URL path, and handling browser history.

---

## 1. Installing React Router DOM

To get started with React Router DOM, install it using npm or yarn:

```bash
npm install react-router-dom
# or
yarn add react-router-dom
```

---

## 2. Basic Setup

To use React Router, you need to wrap your application in a `BrowserRouter` component, which provides routing capabilities.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
```

---

## 3. Defining Routes

Inside your main component (e.g., `App.js`), use the `Route` component to define paths and the components to render.

```jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;
```

- **`path`**: Specifies the URL path.
- **`element`**: Specifies the component to render when the path matches.

### Nested Routes

You can create nested routes by placing a `Route` component inside another component.

```jsx
<Route path="/about" element={<About />}>
  <Route path="team" element={<Team />} />
</Route>
```
- For rendering need to be nested within the componenet as well. So here we display the team componenet and inside this componenet we render the team componenet using outlet. 
---

## 4. Navigating Between Routes

To navigate between different routes, use the `Link` or `NavLink` component instead of anchor tags. This ensures the app doesn't reload on navigation.
-  When you use <NavLink>, it automatically adds an active class to the link that matches the current route, allowing you to highlight the link for the page you're currently on. You can define the active-link class in your CSS to customize how the active link (where you are currently on) looks

```jsx
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <NavLink to="/about" activeClassName="active">About</NavLink>
      <Link to="/contact">Contact</Link>
    </nav>
  );
}
```

- **`to`**: Specifies the destination path.
- **`activeClassName`**: Adds a class to the active route link (only for `NavLink`).

- **`navlink using tailwind css`**:
- className={({ isActive }) => ... }: The className prop accepts a function that provides the isActive boolean. When isActive is true, Tailwind classes for the active state are applied.
```jsx
<nav className = ''>
 <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive
            ? "text-blue-500 font-bold border-b-2 border-blue-500"
            : "text-gray-500 hover:text-blue-500"
        }
      >
        About
  </NavLink>
</nav>
```
---

## 5. Programmatic Navigation

You can also navigate programmatically using the `useNavigate` hook.

```jsx
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return <button onClick={goToHome}>Go to Home</button>;
}
```

- **`navigate`**: A function that accepts a path and navigates to it.
- **`navigate(-1)`**: command in React Router is used to navigate back to the previous page in the browser's history, similar to hitting the "back" button in a browser
---

## 6. Redirects and Not Found Pages

### Redirect

You can redirect users to a different route using the `Navigate` component.

```jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated }) {
  return isAuthenticated ? <Dashboard /> : <Navigate to="/login" />;
}
```

### 404 Not Found

You can create a catch-all route by using `*` to match any route that wasn’t defined.

```jsx
<Route path="*" element={<NotFound />} />
```

---

## Example Summary

Here’s an example combining all concepts:

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import NotFound from './components/NotFound';

function App() {
  const isAuthenticated = false; // example authentication check

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

This guide covers the basics of React Router DOM, including installing the library, setting up routes, navigating between pages, programmatic navigation, and handling redirects and 404 pages.
