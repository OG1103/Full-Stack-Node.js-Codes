// useRefExample.jsx

import React, { useRef, useState, useEffect } from 'react';

function useRefExample() {
  const [naem,setName] = useState(0);
  const renderCount = useRef(0);

  useEffect(()=>{
    renderCount.current = renderCount.current+1;
  }) // Whenever my componenet re-renders execute this. This is better than having a state as if i made render count as a state i will enter an infintie loop of renders. 

  return (
    <div>
      <input value = {name} onChange = {e=> setName(e.target.value)}/>
      <div>My name is {name}</div>
      <div>I rendered {renderCount.current} times</div>
    </div>
  );
}

export default useRefExample;
