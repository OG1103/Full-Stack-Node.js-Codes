# Controlled vs Uncontrolled Components in React

## 1. What is a Controlled Component?
A **controlled component** is a form element (input, textarea, select) whose value **is controlled by React state**.

### ✅ **Key Features of Controlled Components**
- The value is stored in **React state**.
- The component **re-renders** whenever the value changes.
- Allows **full control** over user input.

### 📌 **Example of a Controlled Input**
```tsx
import React, { useState } from "react";

function ControlledInput() {
    const [value, setValue] = useState("");

    return (
        <div>
            <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
            <p>Typed: {value}</p>
        </div>
    );
}

export default function App() {
    return <ControlledInput />;
}
```
🔹 **Changes are instantly reflected in the UI**.

---

## 2. What is an Uncontrolled Component?
An **uncontrolled component** is a form element whose value **is not controlled by React state** but is instead accessed via a **ref**.

### ✅ **Key Features of Uncontrolled Components**
- Value is **stored in the DOM** instead of React state.
- React **does not re-render** when the value changes.
- Useful for **interacting with non-React code**.

### 📌 **Example of an Uncontrolled Input**
```tsx
import React, { useRef } from "react";

function UncontrolledInput() {
    const inputRef = useRef(null);

    const handleSubmit = () => {
        alert(`Input value: ${inputRef.current.value}`);
    };

    return (
        <div>
            <input type="text" ref={inputRef} />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default function App() {
    return <UncontrolledInput />;
}
```
🔹 **React does not control the input’s value.** The `useRef` hook allows access to the current value.

---

## 3. When to Use Controlled vs Uncontrolled Components?
| **Feature**               | **Controlled** ✅ | **Uncontrolled** ❌ |
|---------------------------|------------------|-------------------|
| Stores value in **React state** | ✅ Yes | ❌ No |
| React **re-renders** on change | ✅ Yes | ❌ No |
| Directly manipulates **DOM elements** | ❌ No | ✅ Yes |
| Useful for **form validation** | ✅ Yes | ❌ No |
| Works well with **external JavaScript libraries** | ❌ No | ✅ Yes |

### ✅ **Use Controlled Components When:**
- You need **real-time validation** (e.g., login forms, search bars).
- You want to maintain **React's predictable state flow**.

### ✅ **Use Uncontrolled Components When:**
- You need **performance optimization** (e.g., large forms with minimal state updates).
- You are **integrating with third-party libraries**.

---

🚀 **Next: Higher Order Components (HOCs)!**
