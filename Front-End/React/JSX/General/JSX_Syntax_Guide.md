# JSX Syntax Guide

JSX (JavaScript XML) is a syntax extension for JavaScript commonly used with React. It allows you to write HTML-like code within JavaScript, which is then transformed into React elements.

---

## 1. Basic JSX Syntax

### Embedding Expressions

JSX allows embedding JavaScript expressions within curly braces `{}`. You can use this for variables, functions, and expressions.

```jsx
const name = "John";
const greeting = <h1>Hello, {name}!</h1>; // Output: Hello, John!
```

### Attributes in JSX

Attributes in JSX follow camelCase naming conventions. For instance, `class` is written as `className`, and `for` as `htmlFor`.

```jsx
const link = <a href="https://example.com" target="_blank">Visit Example</a>;
```

---

## 2. Conditional Rendering

You can conditionally render elements in JSX using JavaScript expressions and the ternary operator.

```jsx
const isLoggedIn = true;
const message = (
  <div>
    {isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in.</h1>}
  </div>
);
```

---

## 3. Rendering Lists

To render lists, use JavaScript's `map` function to iterate over an array and return a list of elements. Each element should have a unique `key` attribute.

```jsx
const items = ["Apple", "Banana", "Cherry"];
const itemList = (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);
```

- **`key`**: A unique key helps React identify each element, which optimizes rendering.

---

## 4. Forms in JSX

Forms in JSX are similar to HTML but with controlled and uncontrolled components. Controlled components have their values managed by React state.

### Controlled Input

```jsx
import React, { useState } from "react";

function ControlledForm() {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => setInputValue(event.target.value);

  return (
    <form>
      <label>
        Input:
        <input type="text" value={inputValue} onChange={handleChange} />
      </label>
    </form>
  );
}
```

### Select and Textarea

```jsx
function SelectAndTextarea() {
  const [text, setText] = useState("");
  const [option, setOption] = useState("option1");

  return (
    <form>
      <label>
        Textarea:
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
      </label>

      <label>
        Select:
        <select value={option} onChange={(e) => setOption(e.target.value)}>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
      </label>
    </form>
  );
}
```
