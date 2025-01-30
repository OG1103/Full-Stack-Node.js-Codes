// Passing Props to Components Example

import React from "react";

function DisplayProps({ name, age, isAdmin, items, user, onClick }) {
    return (
        <div>
            <h2>Name: {name}</h2>
            <p>Age: {age}</p>
            <p>Admin: {isAdmin ? "Yes" : "No"}</p>
            <p>Items: {items.join(", ")}</p>
            <p>User: {user.name} (Age: {user.age})</p>
            <button onClick={onClick}>Click Me</button>
        </div>
    );
}

export default function App() {
    return (
        <DisplayProps 
            name="Alice" 
            age={28} 
            isAdmin={true} 
            items={[1, 2, 3]} 
            user={{ name: "John", age: 30 }} 
            onClick={() => alert("Button clicked!")}
        />
    );
}
