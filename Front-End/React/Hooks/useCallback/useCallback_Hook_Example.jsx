
import React, { useState, useCallback } from 'react';

// Child component that receives a memoized function
const ChildComponent = React.memo(({ increment }) => {
    console.log("Child component rendered");

    return (
        <button onClick={increment}>Increment</button>
    );
});

function ParentComponent() {
    const [count, setCount] = useState(0);

    // Memoize the increment function to prevent re-creation on every render. The call back returns a function itself rather than a value. 
    const increment = useCallback(() => {
        setCount(prevCount => prevCount + 1);
    }, []); 
    // Therefore, whenever passed to the child component it does not cause it to re-render as it's not a "new" prop and the child componenet is wrapped under react.memo meaning it will only re-render whenever its prop changes
   // If the chilod componenet was not wrapped under react.memo, the child componenet will re-render however the function incremenet will not be re-created
    console.log("Parent component rendered");

    return (
        <div>
            <h1>Count: {count}</h1>
            <ChildComponent increment={increment} />
        </div>
    );
}

export default ParentComponent;
