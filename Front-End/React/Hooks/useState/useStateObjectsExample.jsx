
/**
 * File: useStateObjectsExample.jsx
 * Description: This file explains how to use the `useState` hook in React
 * to manage state with datatype objects. Includes examples and comments.
 */

import React, { useState } from 'react';

const UseStateWithObjects = () => {
  // Example 1: Using useState to manage a simple object
  const [user, setUser] = useState({
    name: 'John Doe',
    age: 25,
    email: 'john.doe@example.com',
  });

  const updateUserName = () => {
    // Updating a specific property in the object
    setUser((prevUser) => ({
      ...prevUser, // Spread operator to retain other properties
      name: 'Jane Doe', // Updating the 'name' property
    }));
  };

  // Example 2: Nested object state
  const [product, setProduct] = useState({
    id: 1,
    details: {
      name: 'Smartphone',
      price: 699.99,
    },
    stock: 100,
  });

  const updateProductPrice = () => {
    // Updating a nested property
    setProduct((prevProduct) => ({
      ...prevProduct,
      details: {
        ...prevProduct.details, // Spread operator for nested object
        price: 649.99, // Updating the 'price' property
      },
    }));
  };

  return (
    <div>
      <h1>useState with Objects</h1>

      {/* Example 1 Output */}
      <h2>User Information</h2>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <p>Email: {user.email}</p>
      <button onClick={updateUserName}>Update Name</button>

      {/* Example 2 Output */}
      <h2>Product Information</h2>
      <p>Product Name: {product.details.name}</p>
      <p>Price: ${product.details.price}</p>
      <p>Stock: {product.stock}</p>
      <button onClick={updateProductPrice}>Update Price</button>
    </div>
  );
};

export default UseStateWithObjects;

/**
 * Notes:
 * 1. Always use the spread operator to retain existing properties in the object.
 * 2. For deeply nested objects, consider using state management libraries like Redux
 *    or tools like `useReducer` for better maintainability.
 * 3. Avoid directly mutating the state object as React expects state updates to
 *    create a new object reference for detecting changes.
 */
