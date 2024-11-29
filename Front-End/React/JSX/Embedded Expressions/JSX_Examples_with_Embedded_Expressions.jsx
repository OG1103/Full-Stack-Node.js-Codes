
import React, { useState } from 'react';

// Example of embedding expressions in JSX
function Welcome() {
  const name = 'John';  // Variable to be embedded in JSX
  return <h1>Hello, {name}!</h1>;  // Embedding the 'name' variable
}

// Example of embedding expressions with components
function Greeting(props) {
  // 'name' is passed as a prop and embedded in the JSX
  return <h1>Hello, {props.name}!</h1>;
}

const App = () => {
  const user = { name: 'Sarah' }; // Object to pass to the Greeting component

  return (
    <div>
      <Welcome /> {/* Renders the Welcome component */}
      <Greeting name={user.name} /> {/* Embedding 'user.name' in the Greeting component */}
    </div>
  );
};

// Example of embedding function logic
function getGreeting(user) {
  // Function logic to return different JSX based on the user object
  if (user) {
    return <h1>Hello, {user.name}!</h1>;
  }
  return <h1>Hello, Stranger!</h1>;
}

const UserGreeting = () => {
  const user = { name: 'Mark' }; // User object to test the function
  return (
    <div>
      {getGreeting(user)} {/* Embedding function result in JSX */}
    </div>
  );
};

// Example of handling state in JSX
function Counter() {
  const [count, setCount] = useState(0); // Defining state variable 'count'

  return (
    <div>
      <p>You clicked {count} times</p> {/* Embedding state variable in JSX */}
      <button onClick={() => setCount(count + 1)}>Click me</button> {/* Updating state on click */}
    </div>
  );
}

export { App, UserGreeting, Counter }; // Exporting the components for use
