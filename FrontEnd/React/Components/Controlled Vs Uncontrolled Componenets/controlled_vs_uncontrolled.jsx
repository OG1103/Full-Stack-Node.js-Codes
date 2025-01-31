// Controlled vs Uncontrolled Components Example

import React, { useState, useRef } from "react";

function ControlledInput() {
    const [value, setValue] = useState("");

    return (
        <div>
            <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
            <p>Typed: {value}</p>
        </div>
    );
}

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
    return (
        <>
            <h2>Controlled Component</h2>
            <ControlledInput />
            <h2>Uncontrolled Component</h2>
            <UncontrolledInput />
        </>
    );
}
