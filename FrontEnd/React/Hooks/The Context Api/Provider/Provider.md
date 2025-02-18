# Providing Context in React

## Introduction
After creating a context in React, the next step is to **provide** values to components using the `Provider` component. The `Provider` allows data from the context to be shared with components that need access to it, eliminating the need for prop drilling.

## What is the Provider Component?
- Every context created using `createContext()` comes with a `Provider`.
- The `Provider` wraps components that need access to the context's data.
- If a component is not wrapped inside the context provider, it will not have access to the context value. 
- It accepts a `value` prop, which determines what data is passed to consuming components.

## How to Use the Provider
To demonstrate how the `Provider` works, we will create a simple context and provide values using the `Provider`.

### 1️⃣ Providing a Primitive Value
```jsx
import React from 'react';
import { createContext } from 'react';

const CountContext = createContext(0); // Create context

const App = () => {
  return (
    <CountContext.Provider value={5}> {/* Providing a value */}
      <ChildComponent />
    </CountContext.Provider>
  );
};

const ChildComponent = () => {
  return <p>Child component can now access CountContext</p>;
};

export default App;
```
- The `Provider` wraps the `ChildComponent`, passing `5` as the context value.
- Any component inside the `Provider` can now access this value.

### 2️⃣ Providing an Object as Context
```jsx
const UserContext = createContext({}); // Create context

const App = () => {
  const user = { name: "John Doe", age: 30, isLoggedIn: true };

  return (
    <UserContext.Provider value={user}>
      <Profile />
    </UserContext.Provider>
  );
};

const Profile = () => {
  return <p>Profile component has access to UserContext</p>;
};
```
- The `Provider` supplies an object (`user`) as context data.
- Any component inside `UserContext.Provider` can access this user data.

### 3️⃣ Providing an Array as Context
```jsx
const CartContext = createContext([]);

const App = () => {
  const cartItems = ["Apple", "Banana", "Orange"];

  return (
    <CartContext.Provider value={cartItems}>
      <Cart />
    </CartContext.Provider>
  );
};

const Cart = () => {
  return <p>Cart component can access CartContext</p>;
};
```
- The `Provider` supplies an **array** of cart items.
- Components inside `CartContext.Provider` can access the cart data.

### 4️⃣ Providing Functions as Context
```jsx
const ModalContext = createContext(() => {});

const App = () => {
  const toggleModal = () => {
    console.log("Modal toggled");
  };

  return (
    <ModalContext.Provider value={toggleModal}>
      <ModalButton />
    </ModalContext.Provider>
  );
};

const ModalButton = () => {
  return <p>ModalButton component can access ModalContext</p>;
};
```
- The `Provider` supplies a function as context data.
- Useful for event handlers like toggling modals.

## 5️⃣ Providing Context to Children – Example: Auth Context
In real-world applications, context is often used to manage authentication state.

```jsx
import React, { createContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
```

- The `AuthProvider` component manages authentication state.
- It provides `user`, `login`, and `logout` functions to any child components.
- Wrapping the application with `AuthProvider` allows any component to access authentication data.

## Summary
- The `Provider` component allows context data to be shared with child components.
- It accepts a `value` prop, which contains the data to be accessed by consumers.
- The `Provider` can supply **primitive values, objects, arrays, or functions**.
- The `AuthProvider` example demonstrates how to provide authentication data across an application.
- The next step involves **consuming** the provided context within components (covered in later files).

