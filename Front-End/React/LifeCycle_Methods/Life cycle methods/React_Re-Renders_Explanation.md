
# React Re-Renders: Understanding Parent and Child Components with Props

In React, re-renders are crucial for updating the UI when data changes. However, unnecessary re-renders can lead to performance issues, especially in complex applications. Here’s an in-depth look at how re-renders occur in React, focusing on parent and child components and the impact of props.

## What Causes Re-Renders?

A component re-renders in React when:
- Its **state** changes.
- Its **props** change.
- Its **parent component** re-renders (which may or may not affect the child’s props).

Knowing this, we can understand the relationship between parent and child components in re-rendering.

## Re-Renders in Parent and Child Components

When a **parent component** re-renders, all of its child components will re-render by default, even if the child component’s props haven't changed. This is because React re-evaluates the component hierarchy when a component updates.

### Example Scenario
Consider the following example:

```jsx
function ParentComponent() {
    const [count, setCount] = React.useState(0);
    
    return (
        <div>
            <button onClick={() => setCount(count + 1)}>Increase Count</button>
            <ChildComponent />
        </div>
    );
}

function ChildComponent() {
    console.log("Child re-rendered");
    return <p>I am the child component</p>;
}
```

In this case, whenever the `count` in `ParentComponent` updates, `ParentComponent` re-renders, which also causes `ChildComponent` to re-render, even though it does not depend on `count`.

## Props and Re-Renders

Props are the primary way to pass data from a parent to a child component in React. A child component re-renders if its props change.

### Example: Prop Changes and Re-Renders
```jsx
function ParentComponent() {
    const [count, setCount] = React.useState(0);
    
    return (
        <div>
            <button onClick={() => setCount(count + 1)}>Increase Count</button>
            <ChildComponent count={count} />
        </div>
    );
}

function ChildComponent({ count }) {
    console.log("Child re-rendered with count:", count);
    return <p>Count from parent: {count}</p>;
}
```

Here, the `ChildComponent` receives `count` as a prop. Every time the parent updates `count`, `ChildComponent` re-renders because its props have changed.

## Preventing Unnecessary Re-Renders

React provides several methods to optimize re-renders and prevent unnecessary child updates.

### `React.memo`
`React.memo` is a higher-order component that memoizes the child component. If the parent re-renders but the props passed to the child component haven’t changed, `React.memo` will prevent the child from re-rendering.

```jsx
const ChildComponent = React.memo(function ChildComponent({ count }) {
    console.log("Child re-rendered with count:", count);
    return <p>Count from parent: {count}</p>;
});
```

In this example, if the `count` prop doesn’t change, `ChildComponent` will not re-render when the parent component re-renders.

### `useCallback` and `useMemo`

These hooks help to prevent re-renders by caching function and computed values.

- **`useCallback`**: Memoizes a function so it doesn’t get recreated on every render.
- **`useMemo`**: Memoizes a computed value.

Example:
```jsx
function ParentComponent() {
    const [count, setCount] = React.useState(0);
    
    // Memoize the function so it’s not recreated on every render
    const increment = React.useCallback(() => setCount(count + 1), [count]);

    return (
        <div>
            <button onClick={increment}>Increase Count</button>
            <ChildComponent count={count} />
        </div>
    );
}
```

## Summary
- A component re-renders when its state or props change or its parent re-renders.
- `React.memo` and hooks like `useCallback` and `useMemo` can optimize performance by reducing unnecessary re-renders.
- Understanding and managing re-renders can significantly improve React app performance.

**Tip**: Always profile your components and test the impact of re-rendering on performance.
