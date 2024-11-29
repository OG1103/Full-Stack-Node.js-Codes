
# Accessing and Sending Query Parameters in React with Dynamic Routing

Query parameters are a powerful feature of dynamic routing that allow you to pass additional data in the URL after the `?` symbol. This guide explains how to send and access query parameters in React using **React Router DOM**, complete with detailed examples and explanations.

---

## Table of Contents
1. [What Are Query Parameters?](#what-are-query-parameters)
2. [Setting Up React Router](#setting-up-react-router)
3. [Sending Query Parameters in React](#sending-query-parameters-in-react)
   - [Using `Link` Component](#using-link-component)
   - [Using `useNavigate` Hook](#using-usenavigate-hook)
4. [Accessing Query Parameters in React](#accessing-query-parameters-in-react)
   - [Using `useLocation` Hook](#using-uselocation-hook)
   - [Using `URLSearchParams` API](#using-urlsearchparams-api)
5. [Complete Example](#complete-example)

---

### What Are Query Parameters?

Query parameters are key-value pairs appended to the URL after a `?`. They provide additional information to the server or client without modifying the route itself.

**Example:**
```
/search?category=books&sort=asc
```
- `category` is the key, and `books` is the value.
- `sort` is another key, and `asc` is its value.

---

### Setting Up React Router

First, ensure you have **React Router DOM** installed:
```bash
npm install react-router-dom
```

Wrap your application in `BrowserRouter`:
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

### Sending Query Parameters in React

#### Using `Link` Component
The `Link` component allows you to navigate to a new route while including query parameters in the URL.

**Example:**
```jsx
import React from 'react';
import { Link } from 'react-router-dom';

function ProductList() {
  return (
    <div>
      <h1>Product List</h1>
      <ul>
        <li><Link to="/search?category=books">Books</Link></li>
        <li><Link to="/search?category=electronics">Electronics</Link></li>
      </ul>
    </div>
  );
}

export default ProductList;
```

Here:
- Clicking the "Books" link will navigate to `/search?category=books`.
- Clicking the "Electronics" link will navigate to `/search?category=electronics`.

---

#### Using `useNavigate` Hook
The `useNavigate` hook allows you to programmatically navigate while appending query parameters.

**Example:**
```jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function SearchButton() {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/search?category=clothing&sort=asc');
  };

  return <button onClick={handleSearch}>Search for Clothing</button>;
}

export default SearchButton;
```

Here:
- Clicking the button will navigate to `/search?category=clothing&sort=asc`.

---

### Accessing Query Parameters in React

#### Using `useLocation` Hook
The `useLocation` hook provides access to the `location` object, which includes the query string in the `search` property.

**Example:**
```jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

function SearchResults() {
  const location = useLocation();

  return (
    <div>
      <h1>Search Results</h1>
      <p>Query String: {location.search}</p>
    </div>
  );
}

export default SearchResults;
```

Here:
- If the URL is `/search?category=books`, `location.search` will return `?category=books`.

---

#### Using `URLSearchParams` API
The `URLSearchParams` API allows you to parse and retrieve individual query parameters from the query string.

**Example:**
```jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const sort = queryParams.get('sort');

  return (
    <div>
      <h1>Search Results</h1>
      <p>Category: {category}</p>
      <p>Sort Order: {sort}</p>
    </div>
  );
}

export default SearchResults;
```

Here:
- If the URL is `/search?category=books&sort=asc`, the output will be:
  ```
  Category: books
  Sort Order: asc
  ```

---

### Complete Example

This example demonstrates sending and accessing query parameters in a full application:

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

// Component to send query parameters
function ProductList() {
  return (
    <div>
      <h1>Product List</h1>
      <ul>
        <li><Link to="/search?category=books">Books</Link></li>
        <li><Link to="/search?category=electronics">Electronics</Link></li>
      </ul>
    </div>
  );
}

// Component to send query parameters programmatically
function SearchButton() {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/search?category=clothing&sort=asc');
  };

  return <button onClick={handleSearch}>Search for Clothing</button>;
}

// Component to access query parameters
function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const sort = queryParams.get('sort');

  return (
    <div>
      <h1>Search Results</h1>
      <p>Category: {category}</p>
      <p>Sort Order: {sort}</p>
    </div>
  );
}

// Main App component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
      <SearchButton />
    </BrowserRouter>
  );
}

export default App;
```

---

### Key Takeaways
- **Sending Query Parameters**:
  - Use the `Link` component for static query parameters.
  - Use the `useNavigate` hook for dynamic or programmatic navigation.
- **Accessing Query Parameters**:
  - Use `useLocation` to get the query string.
  - Use `URLSearchParams` to parse and retrieve key-value pairs.

With these tools, you can effectively manage query parameters in your React application for dynamic routing.
