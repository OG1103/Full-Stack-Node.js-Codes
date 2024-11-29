
# React Component Lifecycle with Hooks

In React, functional components manage lifecycle events using **hooks**. Here’s a breakdown of component lifecycle phases—**mounting, updating, and unmounting**—and the corresponding hooks that manage these phases:

## 1. Mounting Phase
The mounting phase is when a component is **first created and added to the DOM**. During this phase, you can set up initial states, fetch data, and prepare the component.

- **`useEffect` (for initial rendering)**: This hook can mimic `componentDidMount` from class components.
    ```javascript
    useEffect(() => {
        // Code here runs once when the component mounts
        console.log("Component mounted");

        // Optional cleanup function
        return () => {
            console.log("Cleanup on unmount");
        };
    }, []); // Empty dependency array means this runs only once
    ```
    - This runs only once on the initial render, making it ideal for fetching initial data, setting up subscriptions, or starting animations.
    - Adding an **empty dependency array** (`[]`) ensures the effect only runs once.

- **`useState`**: Used to define initial states.
    ```javascript
    const [count, setCount] = useState(0);
    ```

## 2. Updating Phase
The updating phase is triggered when **props or state changes**, leading to a re-render. `useEffect` is the primary hook for handling this phase, as it can re-run based on specified dependencies.

- **`useEffect` (with dependencies)**: Re-run effects only when certain values change.
    ```javascript
    useEffect(() => {
        console.log("Count updated:", count);
    }, [count]); // Runs only when `count` changes
    ```
    - By including `count` in the dependency array, this effect only runs when `count` changes, ideal for responding to specific updates.

- **`useMemo`** and **`useCallback`**: Memoize values and functions to avoid recalculations on every render.
    ```javascript
    const memoizedValue = useMemo(() => computeExpensiveValue(count), [count]);
    const memoizedCallback = useCallback(() => setCount(c => c + 1), []);
    ```
    - **`useMemo`** caches the result of a function, useful for expensive computations that depend on specific state or props.
    - **`useCallback`** caches the function itself, helpful when passing functions to child components to avoid triggering unnecessary re-renders.

- **`useReducer`**: Alternative to `useState` for managing more complex state logic.
    ```javascript
    const [state, dispatch] = useReducer(reducerFunction, initialState);
    ```
    - Good for handling state changes with complex logic, particularly when multiple states are interdependent.

## 3. Unmounting Phase
This phase occurs just before the component is removed from the DOM, where you might need to **clean up** resources, remove event listeners, or cancel network requests.

- **`useEffect` (with a cleanup function)**: Return a cleanup function to handle unmounting tasks.
    ```javascript
    useEffect(() => {
        console.log("Component mounted");

        return () => {
            console.log("Cleanup on unmount");
            // Clean up tasks here, like canceling network requests or unsubscribing from events
        };
    }, []); // Runs only on mount and unmount
    ```
    - Returning a function inside `useEffect` is React’s way of handling cleanup, ensuring resources are freed when the component unmounts.

## Summary Table

| Lifecycle Phase | Equivalent Class Method | Functional Hook                    | Description                                            |
|-----------------|-------------------------|------------------------------------|--------------------------------------------------------|
| Mounting        | `componentDidMount`     | `useEffect` with `[]` dependencies | Runs once on mount for initialization tasks            |
| Updating        | `componentDidUpdate`    | `useEffect` with dependencies      | Runs on specified updates, re-runs only on dependency change |
| Unmounting      | `componentWillUnmount`  | `useEffect` with cleanup function  | Runs when the component is removed to clean up resources |

By using these hooks effectively, you can handle lifecycle events in functional components similarly to how lifecycle methods are used in class components.
