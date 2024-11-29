
# Understanding `React.memo` in React

`React.memo` is a **higher-order component** (HOC) that optimizes functional components by **preventing unnecessary re-renders**. It helps React to only re-render the component if its **props have changed**.

## How `React.memo` Works
When a component wrapped in `React.memo` receives the same props on subsequent renders, React skips rendering that component and reuses the last rendered output. This optimization can improve performance when:
- The component receives **stable props** that don’t change frequently.
- **Rendering the component is costly** or involves complex operations.

## Syntax
```javascript
const MemoizedComponent = React.memo(Component);
```
- `Component` is the functional component you want to memoize.
- `MemoizedComponent` is the optimized version, which React will only re-render when its props change.

## Basic Example of `React.memo`
Here’s a simple example that demonstrates how `React.memo` prevents re-renders when props haven’t changed:

```javascript
import React, { useState } from 'react';

const ChildComponent = React.memo(({ value }) => {
    console.log("Child rendered");
    return <p>Value: {value}</p>;
});

function ParentComponent() {
    const [count, setCount] = useState(0);
    const [text, setText] = useState("");

    return (
        <div>
            <button onClick={() => setCount(count + 1)}>Increase Count</button>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <ChildComponent value={count} />
        </div>
    );
}

export default ParentComponent;
```
In this example:
- `ChildComponent` is wrapped in `React.memo`, so it only re-renders when its `value` prop changes.
- When `ParentComponent` re-renders (e.g., when `text` changes), `ChildComponent` won’t re-render unless `value` has changed.

## Custom Comparison Function
By default, `React.memo` performs a **shallow comparison** of props. This checks if the references of the props have changed. For complex props (like objects or arrays), you might need a custom comparison function.

```javascript
const MemoizedComponent = React.memo(Component, (prevProps, nextProps) => {
    // Return true if props are equal (no re-render needed)
    // Return false if props are different (trigger re-render)
});
```

### Example with Custom Comparison
If `ChildComponent` takes an object as a prop, a custom comparison function can be useful:

```javascript
const ChildComponent = React.memo(({ data }) => {
    console.log("Child rendered");
    return <p>Data: {data.text}</p>;
}, (prevProps, nextProps) => prevProps.data.text === nextProps.data.text);
```

In this case, `ChildComponent` only re-renders if `data.text` changes, even if `data` is an object.

## When to Use `React.memo`
- **Pure components**: Components that render the same output for the same props.
- **Non-changing props**: Use `React.memo` for components that don’t need to update on every render of the parent.
- **Expensive renders**: If a component has complex calculations or many child elements, `React.memo` can improve performance by preventing unnecessary work.

## Limitations of `React.memo`
- **State changes** within the component still trigger re-renders.
- **Deep prop comparisons** may still cause re-renders unless a custom comparison function is used.
- **Function props** can cause re-renders if they’re recreated on each render. Using `useCallback` with `React.memo` is often helpful here.

## Summary
- **`React.memo`** optimizes functional components by avoiding re-renders when props haven’t changed.
- It’s ideal for **stable, non-changing props** and **pure components**.
- Combining `React.memo` with `useCallback` for functions or custom comparison functions for deep props can further improve performance.
