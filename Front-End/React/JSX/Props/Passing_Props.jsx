// This is a simple React file that demonstrates how to pass props to a component.
// We will explore passing string values and JavaScript expressions using quotes and curly braces.

import React from "react";

// The Greeting component receives props (name and age) and displays them.
function Greeting(props) {
  return (
    <div>
      {/* Displaying the name and age passed as props */}
      <h1>Hello, {props.name}!</h1>
      <p>You are {props.age} years old.</p>
    </div>
  );
}

// The App component demonstrates how to pass props in different ways.
export default function App() {
  // Declaring variables to pass as props using curly braces
  const personName = "John";
  const personAge = 25;

  return (
    <div>
      {/* Passing props using string values (quotes) */}
      <Greeting name="Alice" age="30" />

      {/* Passing props using JavaScript expressions (curly braces) */}
      <Greeting name={personName} age={personAge} />

      {/* Directly passing a number with curly braces (without quotes) */}
      <Greeting name="Bob" age={40} />
    </div>
  );
}

/**Key points:
 * 1)Pass string values directly using quotes (""):
 * 2)Pass variables or expressions using curly braces ({}):

Variables: Any variable that holds a value.
    Example: <Greeting name={personName} />

Numbers: Pass numeric values directly.
    Example: <Greeting age={30} />

Booleans: Pass true or false values directly.
    Example: <Greeting isMember={true} />

Objects: You can pass an entire object.
    Example: <Greeting user={{ firstName: "John", lastName: "Doe" }} />

Arrays: Pass an array to a prop.
    Example: <Greeting friends={["Alice", "Bob", "Charlie"]} />

Functions: You can pass a function as a prop.
    Example: <Button onClick={handleClick} />

Expressions: You can pass any valid JavaScript expression.
    Example: <Greeting age={20 + 5} />
    
Null/Undefined: You can pass null or undefined if you want the prop to be intentionally missing or empty.
    Example: <Greeting name={null} />
 */
