# Embedded Expressions in JSX

JSX allows embedding JavaScript expressions inside curly braces `{}`. This feature is one of the core benefits of JSX, as it seamlessly blends JavaScript and UI logic.

## Embedding Expressions in JSX

### Basic Syntax

You can embed any valid JavaScript expression inside JSX by using curly braces `{}`. These expressions are evaluated at runtime and the result is displayed.

```jsx
const name = "John";
const element = <h1>Hello, {name}!</h1>;
```

In this example, the value of the `name` variable is embedded inside the JSX element and rendered as part of the output.

---

## Using Embedded Expressions with Components

When using components, you can also pass expressions as props.
props in React are basically key-value pairs you pass to a component, allowing it to use those values inside its nested JSX.
For example:

```jsx
//The componenet
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

//Calling of the componenet
const element = <Greeting name="Sarah" />;
```

Here, the `name` prop is passed to the `Greeting` component as an expression, and it renders the result accordingly.

---

## Embedding Functions or Function Logic in JSX

You can also embed function calls inside JSX. This can be useful for dynamic rendering based on logic:
When Embedding functions i dont need to specifiy () unless the function takes parameters and im defining them.

```jsx
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {user.name}!</h1>;
  }
  return <h1>Hello, Stranger!</h1>;
}

const user = { name: "Mark" };
const element = <div>{getGreeting(user)}</div>;
```

In this example, the `getGreeting` function is called within the JSX expression to return dynamic content based on the `user` object.

---

## Handling State in JSX

When working with React components, handling state is an essential part of dynamic UI updates. State variables can also be embedded in JSX expressions:

```jsx
import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

In this example, the `count` state variable is embedded inside the JSX to dynamically display the number of clicks, and the `onClick` event updates the state.

---

## Conclusion

Embedded expressions in JSX allow you to combine JavaScript and UI elements seamlessly. Whether it's displaying variables, calling functions, or handling state, JSX provides the flexibility to integrate JavaScript logic directly into your UI components.

---

## Handling Defined Functions in JSX

In addition to handling state, you can also define functions separately and embed them in JSX for better organization and reusability.

### Example

```jsx
import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0); // State variable for count

  // Defined function to increment the count
  function incrementCount() {
    setCount(count + 1); // Updates the state
  }

  // Defined function to reset the count
  function resetCount() {
    setCount(0); // Resets the state to 0
  }

  return (
    <div>
      <p>You clicked {count} times</p> {/* Embedded state variable in JSX */}
      {/* Using the defined functions in event handlers */}
      <button onClick={incrementCount}>Click me to increment</button>
      <button onClick={resetCount}>Reset Count</button>
    </div>
  );
}

export default Counter;
```

### Explanation

In this example:

- **State Management**: We manage the `count` state using the `useState` hook.
- **Function Definitions**: The functions `incrementCount` and `resetCount` are defined separately from the JSX to keep the logic organized and reusable. These functions are embedded in JSX through event handlers.

---
