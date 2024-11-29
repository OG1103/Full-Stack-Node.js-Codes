
# Accessing and Sending Query Parameters Dynamically in React with Dynamic Routing

Query parameters allow passing data dynamically in the URL after the `?` symbol. This guide explains how to send and access query parameters dynamically in React using **React Router DOM**, complete with detailed examples and explanations.

---

## Table of Contents
1. [What Are Query Parameters?](#what-are-query-parameters)
2. [Setting Up React Router](#setting-up-react-router)
3. [Sending Query Parameters Dynamically in React](#sending-query-parameters-dynamically-in-react)
   - [Using `Link` Component Dynamically](#using-link-component-dynamically)
   - [Using `useNavigate` Hook Dynamically](#using-usenavigate-hook-dynamically)
4. [Accessing Query Parameters Dynamically in React](#accessing-query-parameters-dynamically-in-react)
   - [Using `useLocation` Hook](#using-uselocation-hook)
   - [Using `URLSearchParams` API Dynamically](#using-urlsearchparams-api-dynamically)
5. [Complete Example](#complete-example)

---

### What Are Query Parameters?

Query parameters are key-value pairs appended to the URL after a `?`. They provide additional information to the server or client without modifying the route itself.

The query string is always accessed using location.search, regardless of the pathname (e.g., /search? or /test?). 

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

### Sending Query Parameters Dynamically in React

#### Using `Link` Component Dynamically
The `Link` component can dynamically construct URLs with query parameters based on user input or state.

**Example:**
```jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function DynamicLink() {
  const [category, setCategory] = useState('books');

  return (
    <div>
      <h1>Dynamic Link</h1>
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Enter category"
      />
      <Link to={`/search?category=${category}`}>Search for {category}</Link>
    </div>
  );
}

export default DynamicLink;
```

Here:
- The `category` value is updated dynamically based on user input.
- The `Link` updates the query string dynamically to `/search?category=<category>`.

---

#### Using `useNavigate` Hook Dynamically
The `useNavigate` hook can programmatically navigate while appending query parameters dynamically.

**Example:**
```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DynamicSearchButton() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      <h1>Dynamic Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter search query"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default DynamicSearchButton;
```

Here:
- The user can input a query, which is dynamically appended to the URL.

---

### Accessing Query Parameters Dynamically in React

#### Using `useLocation` Hook
The `useLocation` hook provides access to the `location` object, which includes the query string in the `search` property.

**Example:**
```jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

function DynamicSearchResults() {
  const location = useLocation();

  return (
    <div>
      <h1>Dynamic Search Results</h1>
      <p>Query String: {location.search}</p>
    </div>
  );
}

export default DynamicSearchResults;
```

---

#### Using `URLSearchParams` API Dynamically
The `URLSearchParams` API allows you to parse and retrieve individual query parameters from the query string.

**Example:**
```jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

function DynamicSearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');

  return (
    <div>
      <h1>Dynamic Search Results</h1>
      <p>Query: {query}</p>
    </div>
  );
}

export default DynamicSearchResults;
```

---

### Complete Example

This example demonstrates dynamically sending and accessing query parameters in a full application:

```jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';

function DynamicLink() {
  const [category, setCategory] = useState('books');

  return (
    <div>
      <h1>Dynamic Link</h1>
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Enter category"
      />
      <Link to={`/search?category=${category}`}>Search for {category}</Link>
    </div>
  );
}

function DynamicSearchButton() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      <h1>Dynamic Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter search query"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

function DynamicSearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  // Here, you can fetch each value of the query parameters by their key
  const category = queryParams.get('category');
  const query = queryParams.get('query');

  return (
    <div>
      <h1>Search Results</h1>
      <p>Category: {category}</p>
      <p>Query: {query}</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DynamicLink />} />
        <Route path="/search" element={<DynamicSearchResults />} />
      </Routes>
      <DynamicSearchButton />
    </BrowserRouter>
  );
}

export default App;
```

---

### Key Takeaways
- **Dynamic Sending**:
  - Use state or user input to dynamically construct URLs.
  - Use `Link` for static dynamic navigation or `useNavigate` for programmatic navigation.
- **Dynamic Accessing**:
  - Use `useLocation` to get the query string dynamically.
  - Use `URLSearchParams` to parse and retrieve values.

With these tools, you can effectively manage dynamic query parameters in your React application.
