
# Components in React

## Overview

Components are the building blocks of any React application. They allow you to split the UI into independent, reusable pieces that can be managed separately. React components can be thought of as JavaScript functions or classes that return UI elements. There are two main types of components: **functional components** and **class components**.

- All componenets get rendered under a root componenet (App).
- All Componenets come together to make up an entire application.
- Componenets can consists of nested componenets. 
- A single componenet serves a specific purpose in the user interface. 
- We can write componenets in a .js file or a .jsx file 
- Stateless Components: Functional components that only render UI based on props, without managing state.
- Stateful Components: Components (using class or hooks) that manage internal state and handle dynamic data or user interactions.
- if you are using class components in React, you must include the render() method and inside that u return the jsx content or the elements. The render() method is a required part of every class component, and it defines what the component will display

## Types of Components

### 1. Functional Components

Functional components are simple JavaScript functions that return JSX (JavaScript XML) representing the UI. They do not have internal state or lifecycle methods (until React Hooks introduced the ability to manage state in functional components).
- If you type rcfe and press enter it already creates the basic layout of a functionComponenet for you 

#### Example of a Functional Component:

```js
function Greeting() {
  return <h1>Hello, World!</h1>;
}
```

Since the introduction of React Hooks, functional components can manage state and side effects using `useState` and `useEffect`. 

#### Example of a Functional Component with State:

```js
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

### 2. Class Components

Before React Hooks were introduced, class components were the only way to manage state and lifecycle methods in a component. Class components extend the `React.Component` class and include methods like `render()`, `componentDidMount()`, and `componentWillUnmount()` to manage different stages of the component's lifecycle.

#### Example of a Class Component:

```js
import React, { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Class components can hold state by defining a `state` object in the constructor:

#### Example of a Class Component with State:

```js
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={this.handleClick}>Click me</button>
      </div>
    );
  }
}
```

### 3. Props in Components

Props (short for "properties") are used to pass data from parent components to child components. Props are read-only, meaning a child component cannot modify the props it receives.

#### Example of Passing Props:

```js
function Greeting(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Using the Greeting component
<Greeting name="Alice" />
```

In this example, the `name` prop is passed from the parent component to the `Greeting` component.

### 4. State in Components

State is a built-in object that stores data that can change over time in a component. Unlike props, state is managed within the component and can be updated with `setState` (in class components) or `useState` (in functional components).

#### Example of Managing State:

```js
import React, { useState } from 'react';

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

### 5. Lifecycle Methods (Class Components)

Lifecycle methods are available only in class components and allow developers to hook into different stages of a component's lifecycle, such as when the component is first rendered, updated, or removed from the DOM.

- **componentDidMount()**: Called after the component is mounted (inserted into the DOM).
- **componentDidUpdate()**: Called after the component is updated.
- **componentWillUnmount()**: Called right before the component is unmounted (removed from the DOM).

#### Example of a Lifecycle Method:

```js
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    this.setState((state) => ({
      seconds: state.seconds + 1
    }));
  }

  render() {
    return <div>Seconds: {this.state.seconds}</div>;
  }
}
```

## Key Differences between Functional and Class Components

| Feature              | Functional Components            | Class Components                    |
|----------------------|----------------------------------|-------------------------------------|
| Syntax               | Functions                        | Classes                             |
| State                | `useState` hook                  | `this.state` and `setState`         |
| Lifecycle Methods    | `useEffect` hook                 | Dedicated lifecycle methods         |
| Simplicity           | Generally simpler and shorter    | More boilerplate                    |
| Performance          | Slightly better performance      | More overhead due to class syntax   |

## Conclusion

React components allow developers to build reusable and maintainable pieces of UI. With functional components now supporting state and lifecycle via hooks, they have become the preferred approach for most new React code. Class components, though still used, are less common in modern React applications.
