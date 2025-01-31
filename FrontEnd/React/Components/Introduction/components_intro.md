# Introduction to Components in React

## 1. What is a Component?
A **component** in React is a **reusable, self-contained piece of UI**. It is like a **JavaScript function** that returns **JSX (HTML-like syntax inside JavaScript)**.

### ✅ **Key Features of Components**
- Components allow **reusability** and **modularity**.
- Components can be **functional** or **class-based**.
- Components can **accept props** and **manage state**.

## 2. Basic Example of a React Component

```tsx
function Greeting() {
    return <h1>Hello, World!</h1>;
}

export default function App() {
    return <Greeting />;
}
```

🔹 **Output:** `"Hello, World!"`

---

## 3. Types of Components
1. **Functional Components** (Modern React, preferred)
2. **Class Components** (Older React, still used in legacy code)
3. **Higher Order Components (HOC)** (Advanced pattern)
4. **Controlled vs Uncontrolled Components** (Used in forms)

🔹 **Next: Understanding Functional Components!**
