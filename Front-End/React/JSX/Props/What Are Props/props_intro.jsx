// What are Props in React? Example

import React from "react";

function Greeting(props) {
    return <h1>Hello, {props.name}!</h1>;
}

export default function App() {
    return <Greeting name="Alice" />;
}
