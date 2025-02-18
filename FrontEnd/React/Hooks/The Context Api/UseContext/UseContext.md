# Using Context in React

## Introduction
Once a context is **created** and **provided**, components can access the context's values using the `useContext` hook. This removes the need for **prop drilling** and allows any nested component to access shared data.

## What is `useContext`?
- `useContext` is a **hook** that allows components to consume the context values.
- It accepts a context object (created with `createContext`) and returns the current context value.
- The value is determined by the closest `Provider` above the component in the component tree.

## How to Use Context in Components
To demonstrate `useContext`, we will use previously created contexts and show how to **consume** them.

### 1️⃣ Consuming a Primitive Value from Context
```jsx
import React, { createContext, useContext } from 'react';

const CountContext = createContext(0); // Create context

const App = () => {
  return (
    <CountContext.Provider value={5}> {/* Providing a value */}
      <ChildComponent />
    </CountContext.Provider>
  );
};

const ChildComponent = () => {
  const count = useContext(CountContext);
  return <p>Count value: {count}</p>;
};

export default App;
```
- `useContext(CountContext)` allows `ChildComponent` to access the count value (`5`).
- No props are passed manually from `App` to `ChildComponent`.

### 2️⃣ Consuming an Object from Context
```jsx
const UserContext = createContext({});

const App = () => {
  const user = { name: "John Doe", age: 30, isLoggedIn: true };

  return (
    <UserContext.Provider value={user}>
      <Profile />
    </UserContext.Provider>
  );
};

const Profile = () => {
  const user = useContext(UserContext);
  return <p>User: {user.name}, Age: {user.age}</p>;
};
```
- `Profile` component consumes the `UserContext` to display user details.

### 3️⃣ Consuming an Array from Context
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
  const cart = useContext(CartContext);
  return <p>Cart Items: {cart.join(", ")}</p>;
};
```
- The `Cart` component retrieves an array of items using `useContext(CartContext)`.

### 4️⃣ Consuming a Function from Context
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
  const toggleModal = useContext(ModalContext);
  return <button onClick={toggleModal}>Toggle Modal</button>;
};
```
- The `ModalButton` component retrieves the `toggleModal` function from context and uses it as an event handler.

## 5️⃣ Separating Concerns – Example: Auth Context
In real-world applications, contexts are typically **split into separate files** for better organization.

### **authContext.js** – Creating and Providing Context
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

### **App.js** – Wrapping the App with the Provider
```jsx
import React from "react";
import { AuthProvider } from "./authContext";
import Home from "./Home";

const App = () => {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
};

export default App;
```

### **Home.js** – Consuming the Auth Context
```jsx
import React, { useContext } from "react";
import { AuthContext } from "./authContext";

const Home = () => {
  const { user, login, logout } = useContext(AuthContext);

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login({ name: "John Doe" })}>Login</button>
      )}
    </div>
  );
};

export default Home;
```

- The **authContext.js** file manages context creation and provides `user`, `login`, and `logout` functions.
- The **App.js** file wraps the application with `AuthProvider`, making context available to all components.
- The **Home.js** file consumes the `AuthContext` to handle user authentication.

## Summary
- The `useContext` hook allows components to access context values provided by the nearest `Provider`.
- It simplifies state management by eliminating the need for prop drilling.
- Context can be used with **primitive values, objects, arrays, and functions**.
- Separating concerns (storing context in separate files) improves code organization and maintainability.
- The **Auth Context example** demonstrates how to manage authentication using the Context API.

The next step involves **optimizing and structuring context for large-scale applications** (covered in later files).

