// This file demonstrates how to use `useState` and `setState` in functional components
// with various examples such as using arrow functions, direct usage, and more.

import React, { useState } from "react";

// Example 1: Simple Counter using `setState` directly
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1); // Direct usage of `setState` to increment the counter
  };

  return (
    <div>
      <h1>Simple Counter</h1>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

// Example 2: Using `setState` with an Arrow Function (functional form)
function CounterWithArrow() {
  const [count, setCount] = useState(0);

  // The functional form of `setState` provides access to the previous state value
  const incrementWithArrow = () => {
    setCount((prevCount) => prevCount + 1); // Takes a callback function that receives the previous state value and computes the new state value with it.
    //The name you give to the parameter is just a placeholder, so it can be any valid variable name. 
    //The important part is that the first argument of the function represents previous state
  };

  return (
    <div>
      <h1>Counter With Arrow Function</h1>
      <p>Count: {count}</p>
      <button onClick={incrementWithArrow}>Increment with Arrow</button>
    </div>
  );
}

// Example 3: Using `setState` inside an event handler
function ClickTracker() {
  const [clicks, setClicks] = useState(0);

  const handleClick = () => {
    // Update state directly within the event handler
    setClicks(clicks + 1);
  };

  return (
    <div>
      <h1>Click Tracker</h1>
      <p>Clicks: {clicks}</p>
      <button onClick={handleClick}>Track Clicks</button>
    </div>
  );
}

// Example 4: Using `setState` with multiple state variables
function MultipleStatesExample() {
  const [name, setName] = useState("John");
  const [age, setAge] = useState(25);

  const updateInfo = () => {
    setName("Jane"); // Update the name state
    setAge(30); // Update the age state
  };

  return (
    <div>
      <h1>Multiple States Example</h1>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
      <button onClick={updateInfo}>Update Info</button>
    </div>
  );
}

// Example 5: Resetting state values using `setState`
function ResetExample() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    setMessage(`You typed: ${input}`);
    setInput(""); // Reset input field after submission
  };

  return (
    <div>
      <h1>Reset Example</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)} // Update state directly on input change
      />
      <button onClick={handleSubmit}>Submit</button>
      <p>{message}</p>
    </div>
  );
}

// Example 6: Toggle State using `setState`
function ToggleExample() {
  const [isToggled, setIsToggled] = useState(false);

  const toggle = () => {
    setIsToggled((prevValue) => !prevValue); // Toggle the value using functional form
  };

  return (
    <div>
      <h1>Toggle Example</h1>
      <p>{isToggled ? "ON" : "OFF"}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}

// Example 7: Using Inline Arrow Function for `setState` in onClick
function InlineSetStateExample() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Inline setState Example</h1>
      <p>Count: {count}</p>
      {/* Directly using setState inside an arrow function in the onClick */}
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Increment Inline
      </button>
    </div>
  );
}

// Main component to showcase all examples
export default function App() {
  return (
    <div>
      <Counter />
      <CounterWithArrow />
      <ClickTracker />
      <MultipleStatesExample />
      <ResetExample />
      <ToggleExample />
      <InlineSetStateExample />
    </div>
  );
}
