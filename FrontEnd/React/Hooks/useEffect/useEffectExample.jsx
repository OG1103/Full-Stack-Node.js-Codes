// useEffectExample.jsx

import React, { useState, useEffect } from 'react';

function useEffectExample() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);

  // Effect with cleanup and dependency array
  useEffect(() => {
    document.title = `Count: ${count}`;
    
    const interval = setInterval(() => {
      console.log('Interval running');
    }, 1000);

    return () => {
      clearInterval(interval); // Cleanup on unmount
    };
  }, [count]);

  // Fetch data effect, runs once on mount
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("https://api.example.com/data");
      const result = await response.json();
      setData(result);
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>useEffect Example</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increase Count</button>
      <div>Data: {data ? JSON.stringify(data) : "Loading..."}</div>
    </div>
  );
}

export default useEffectExample;
