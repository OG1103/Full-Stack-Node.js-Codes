# useEffect: A Comprehensive Guide

The `useEffect` hook in React is a powerful tool for managing side effects in functional components. It allows you to perform actions like data fetching, subscriptions, or manually changing the DOM, all within the component lifecycle.

---

## 1. What is useEffect?

`useEffect` is a React hook that enables you to perform side effects in functional components. Side effects include tasks that interact with external systems (e.g., fetching data from an API) or manipulate the DOM outside of React's render cycle.

### Basic Syntax

```javascript
useEffect(() => {
  // Code for the side effect
}, [dependencies]);
```

- **Effect Function**: The first argument is the effect function, which contains the code for the side effect.
- **Dependency Array**: The second argument is an optional array of dependencies that control when the effect runs.

---

## 2. When useEffect Runs

`useEffect` runs by default after the initial render and every update. However, you can control its behavior by providing dependencies.

### No Dependency Array

When no dependency array is provided, `useEffect` runs after every render.

```javascript
useEffect(() => {
  console.log("Runs after every render");
});
```

### Empty Dependency Array

With an empty dependency array (`[]`), `useEffect` runs only once after the initial render.

```javascript
useEffect(() => {
  console.log("Runs only once");
}, []);
```

### Dependency Array with Variables

When dependencies are included, `useEffect` runs only when any of the specified variables change.

```javascript
const [count, setCount] = useState(0);

useEffect(() => {
  console.log(`Count has changed: ${count}`);
}, [count]);
```

---

## 3. Cleanup Function

The cleanup function is returned from the effect function and runs when the component is unmounted or before the effect re-runs.

### Example with Cleanup

```javascript
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Interval running");
  }, 1000);

  return () => { // this return function is called whenever the componenet is unmounted & best practice to always include it as a clean up call back whenever we have a use effect. 
    clearInterval(timer); // Cleanup the interval on unmount
  };
}, []);
```

---

## 4. Common Use Cases

### Fetching Data

```javascript
useEffect(() => {
  async function fetchData() {
    const response = await fetch("https://api.example.com/data");
    const result = await response.json();
    console.log(result);
  }

  fetchData();
}, []);
```

### Event Listeners

```javascript
useEffect(() => {
  const handleResize = () => {
    console.log("Window resized");
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize); // Cleanup
  };
}, []);
```

### Updating the Document Title

```javascript
const [count, setCount] = useState(0);

useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);
```

---

## 5. useEffect Best Practices

- **Always Use Cleanup Functions**: For side effects like intervals, timers, and subscriptions, ensure you clean them up in the cleanup function.
- **Avoid Overusing useEffect**: Relying heavily on `useEffect` can lead to complex logic in functional components.
- **Memoize Callbacks and Dependencies**: If functions or objects are used as dependencies, use `useCallback` and `useMemo` to prevent unnecessary re-renders.

---

## Summary

| Feature              | Description |
|----------------------|-------------|
| No Dependencies      | Runs after every render |
| Empty Dependency     | Runs once after the initial render |
| With Dependencies    | Runs when specified variables change |
| Cleanup Function     | Cleans up effects like intervals or subscriptions |

`useEffect` is essential for handling side effects in React. By managing dependencies, cleanup functions, and various use cases effectively, `useEffect` can keep components efficient and organized.

