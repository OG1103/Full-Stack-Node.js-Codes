// Props Destructuring Example (Normal Props & Children)

import React from "react";

// Destructuring normal props
function UserProfile({ name, age }) {
    return (
        <div>
            <h2>Name: {name}</h2>
            <p>Age: {age}</p>
        </div>
    );
}

// Destructuring props.children
function Card({ children }) {
    return <div className="card">{children}</div>;
}

export default function App() {
    return (
        <>
            <UserProfile name="Emma" age={25} />
            <Card>
                <h2>Title</h2>
                <p>This is some content inside the card.</p>
            </Card>
        </>
    );
}
