// Higher Order Component (HOC) Example

import React from "react";

function withLogging(WrappedComponent) {
    return function EnhancedComponent(props) {
        console.log("Rendering component:", WrappedComponent.name);
        return <WrappedComponent {...props} />;
    };
}

function HelloWorld() {
    return <h1>Hello, World!</h1>;
}

const EnhancedHelloWorld = withLogging(HelloWorld);

export default function App() {
    return <EnhancedHelloWorld />;
}
