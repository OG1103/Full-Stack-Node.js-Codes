# Creating Context in React

## Introduction
The Context API in React allows you to create and manage global state efficiently. The first step in using the Context API is **creating context**, which serves as a central store for shared data. This file explores different ways to create context using various data types, including objects, arrays, and primitive values.

## How to Create Context
React provides the `createContext` function to create a new context object.

### Syntax
```jsx
import { createContext } from 'react';

const MyContext = createContext();
```

- The `createContext()` function returns a context object that consists of:
  - `Provider` – Used to supply data to components and provide values to the context created (covered later).
  - `Consumer` (or `useContext` hook) – Used to access the provided data (covered later).

## Creating Context with Different Data Types

### 1️⃣ Creating Context with a Primitive Value
```jsx
const CountContext = createContext(0); // Default value is 0
```
- Here, the context is created with a **default primitive value** (`0`).
- If no `Provider` supplies a value, components using this context will get `0`.

### 2️⃣ Creating Context with an Object
```jsx
const UserContext = createContext({
  name: "Guest",
  age: null,
  isLoggedIn: false,
});
```
- This context stores **user data** in an object.
- It provides default values: `"Guest"`, `null`, and `false`.

### 3️⃣ Creating Context with an Array
```jsx
const CartContext = createContext([]);
```
- Here, an **empty array** is used as the default value.
- Useful for managing **lists**, such as shopping carts or selected items.

### 4️⃣ Creating Context Without a Default Value
```jsx
const AuthContext = createContext();
```
- The context is created **without** a default value.
- This means components consuming it must always be wrapped in a `Provider`.

### 5️⃣ Creating Multiple Contexts
```jsx
const LanguageContext = createContext("en"); // Default: English
const SettingsContext = createContext({ darkMode: false, notifications: true });
```
- You can create **multiple contexts** to manage different aspects of state.

### 6️⃣ Creating Context for Functions
```jsx
const ModalContext = createContext(() => {});
```
- This context provides a function as its default value.
- Useful when a context needs to supply event handlers like opening or closing modals.

## Summary
- The `createContext` function initializes a new context object.
- The context object contains a `Provider` and `Consumer` (or can be used with `useContext`).
- Contexts can store **primitive values, objects, arrays, or functions**.
- A default value can be set when creating the context.
- The next steps involve **providing** and **using** this context in components (covered in later files).

