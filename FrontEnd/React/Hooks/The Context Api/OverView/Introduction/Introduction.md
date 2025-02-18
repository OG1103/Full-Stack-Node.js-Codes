# What is the Context API in React?

The Context API in React is a built-in feature that allows developers to manage and share state across multiple components without passing props manually at every level. It provides a more efficient way to handle global data such as themes, authentication, or user settings.

## Why Use the Context API?

In a standard React application, data is passed from parent to child components using props. However, when multiple components need access to the same data, this process—known as "prop drilling"—can become cumbersome. The Context API eliminates this issue by allowing components to consume shared data directly without intermediate props.

## Key Benefits

- **Avoids Prop Drilling**: Eliminates the need to pass props through multiple layers.
- **Improves Code Readability**: Centralizes state management, making the code more maintainable.
- **Built-in Solution**: No need for external libraries like Redux for simple state management.

## How It Works

The Context API works in three main steps:

1. **Creating Context** – A context is created using `React.createContext()`.
2. **Providing Context** – The `Provider` component makes the context data available  to all child components that need it..
3. **Consuming Context** – Components that need the data can access it using the `useContext` hook or the `Consumer` component.

This file introduces what the Context API is, and later files will cover how to **create, use, and provide** context in detail.
