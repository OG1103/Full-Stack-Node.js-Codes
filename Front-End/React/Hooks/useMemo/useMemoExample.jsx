// useMemoExample.jsx

import React, { useState, useMemo } from 'react';

// Expensive calculation function
function computeExpensiveValue(num) {
  console.log('Calculating...');
  for (let i = 0; i < 1000000000; i++) {} // Simulating a heavy computation
  return num * 2;
}

function useMemoExample() {
  const [count, setCount] = useState(0);
  const [number, setNumber] = useState(1);

  // Memoizing the expensive computation
  // we only run this function whenever the number changes, this makes the application faster as this function is slaw and isnt called on every re render effect the entire componenet.
  const doubleNumber = useMemo(() => computeExpensiveValue(number), [number]);
  // we put inside the call back function, the thing we want to memorize. the [] is the depenedency. 

  return (
    <div>
      <h1>useMemo Example</h1>
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment Count</button>
      </div>
      <div>
        <p>Number: {number}</p>
        <button onClick={() => setNumber(number + 1)}>Increment Number</button>
      </div>
      <div>
        <p>Computed Double: {doubleNumber}</p>
      </div>
    </div>
  );
}

export default useMemoExample;
