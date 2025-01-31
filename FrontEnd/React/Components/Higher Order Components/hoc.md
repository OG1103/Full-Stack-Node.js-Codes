# Higher Order Components (HOC) in React

## 1. What is a Higher Order Component (HOC)?
A **Higher Order Component (HOC)** is a function that **takes a component as an argument and returns a new enhanced component**.

### ✅ **Key Features of HOC**
- **Code Reusability**: Extracts common logic from multiple components.
- **Enhancing Components**: Adds additional functionality to existing components.
- **Encapsulation**: Wraps components without modifying their implementation.

---

## 2. Basic Example of a HOC
```tsx
import React from "react";

// Higher Order Component (HOC)
function withLogging(WrappedComponent) {
    return function EnhancedComponent(props) {
        console.log("Rendering component:", WrappedComponent.name);
        return <WrappedComponent {...props} />;
    };
}

// Normal Component
function HelloWorld() {
    return <h1>Hello, World!</h1>;
}

// Enhanced Component
const EnhancedHelloWorld = withLogging(HelloWorld);

export default function App() {
    return <EnhancedHelloWorld />;
}
```

🔹 **Output:**  
- Console: `"Rendering component: HelloWorld"`  
- Screen: `"Hello, World!"`

---

## 3. HOC with Props Manipulation
```tsx
function withExtraProp(WrappedComponent) {
    return function EnhancedComponent(props) {
        return <WrappedComponent {...props} extra="I am extra!" />;
    };
}

function DisplayText(props) {
    return <h2>{props.text} - {props.extra}</h2>;
}

const EnhancedDisplay = withExtraProp(DisplayText);

export default function App() {
    return <EnhancedDisplay text="Hello, React!" />;
}
```

🔹 **Output:** `"Hello, React! - I am extra!"`

---

## 4. When to Use HOCs?
✅ **Logging & Analytics**  
✅ **Authorization & Authentication**  
✅ **Data Fetching & Caching**  
✅ **Theming & Styling Enhancements**  

---

🚀 **Next: Controlled vs Uncontrolled Components!**
