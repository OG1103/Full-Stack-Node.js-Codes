// Props Children Example

import React from "react";

function Card({ children }) {
    return <div className="card">{children}</div>;
}

export default function App() {
    return (
        <Card>
            <h2>Title</h2>
            <p>This is some content inside the card.</p>
        </Card>
    );
}
