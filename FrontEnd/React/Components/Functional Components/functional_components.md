# Functional Components in React

## 1. What is a Functional Component?
A **functional component** is a simple JavaScript function that **returns JSX**.

### ✅ **Key Features**
- **Stateless by default** (but can use state with Hooks)
- **Easier to read and test**
- **Recommended over class components**

## 2. Basic Example
```tsx
function Welcome() {
    return <h1>Welcome to React!</h1>;
}

export default function App() {
    return <Welcome />;
}
```
🔹 **Output:** `"Welcome to React!"`

---

## 3. Functional Component with Props
```tsx
function Greeting(props) {
    return <h1>Hello, {props.name}!</h1>;
}

export default function App() {
    return <Greeting name="Alice" />;
}
```
🔹 **Output:** `"Hello, Alice!"`

---

## 4. Functional Component with State (Using Hooks)
```tsx
import { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}

export default function App() {
    return <Counter />;
}
```
🔹 **State updates when clicking the button.**

🔹 **Next: Understanding Class Components!**
