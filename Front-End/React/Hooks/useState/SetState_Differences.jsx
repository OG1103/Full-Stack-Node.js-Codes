/*
  This file explains the difference between using `setState(newState)` and `setState((previousState) => newState)` in React.
  It includes examples and explanations on why you should use `previousState` when the new state depends on the current state.
*/

import React, { useState } from "react";

function CounterExample() {
  const [count, setCount] = useState(0);

  /*
    Example of incorrect logic: updating state based on the current state (without using the callback function).
    
    Explanation:
    - Here, we directly reference `count` when updating the state. 
    - The problem is that React batches state updates for performance optimization, so the updates may not occur immediately.
    - As a result, each `setCount(count + 1)` references the initial value of `count` (in this case, 0), 
      which means that even though we call `setCount` three times, the state will only be updated by 1, not 3.
  */
  const incrementIncorrect = () => {
    setCount(count + 1); // Increment based on the initial value of `count`, which might be stale.
    setCount(count + 1); // Same as above, references the initial value.
    setCount(count + 1); // Again, based on the initial value.
    // After all three calls, `count` will be 1 instead of 3, because React does not immediately update the state after each call.
  };

  /*
    Example of correct logic: using the callback function with `previousState` to ensure the correct value is updated.
    
    Explanation:
    - The callback function form of `setState` allows us to access the most recent state value as `previousState`.
    - Each time `setState` is called, the `previousState` parameter is passed the current, up-to-date value of `count`.
    - This ensures that each `setCount` call increments `count` based on the most recent value, rather than a potentially stale value.
    - By doing this, we can avoid issues related to React batching state updates.
  */
  const incrementCorrect = () => {
    setCount((previousCount) => previousCount + 1); // First update based on the current value of `count`.
    setCount((previousCount) => previousCount + 1); // Second update based on the updated value.
    setCount((previousCount) => previousCount + 1); // Third update, ensuring that the count is incremented properly.
    // After all three calls, `count` will be incremented by 3, as each update uses the most recent value.

    /** If using Explicit return
     * setCount((previousCount) => {
        return previousCount + 1;
      });
     */
  };

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={incrementIncorrect}>Increment Incorrectly</button>
      <button onClick={incrementCorrect}>Increment Correctly</button>
    </div>
  );
}

export default CounterExample;

/*
  Key Takeaways:
  1. Direct state usage (e.g., setCount(count + 1)) might lead to incorrect results when updating the state multiple times,
     because React batches updates and may not immediately apply each change. This can cause unexpected behavior when
     the new state depends on the previous state.

  2. Using the callback form of `setState((previousState) => newState)` allows you to access the most recent state value,
     ensuring that the state is updated correctly, even when multiple updates are batched together. The `previousState` 
     parameter in the callback represents the current value of the state at the time the update is applied.
  
  3. Always use `previousState` in `setState` when the next state depends on the current state, such as in cases where 
     you're incrementing, decrementing, or toggling state values. You can name the parameter in the call back func any name but its good prectice to call it previous<state_name>
  
  When to use which:
  - Use `setState(newState)` (direct state update) when the new state doesn't depend on the previous one.
    Example: Updating state with input values or setting a state with data from an API response.
  
  - Use `setState((previousState) => newState)` when the next state relies on the current one.
    Example: Incrementing a counter, toggling a boolean, or working with any logic where the new state depends on the previous state.

*/
