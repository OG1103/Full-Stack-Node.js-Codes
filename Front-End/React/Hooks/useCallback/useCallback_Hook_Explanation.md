
# Understanding the `useCallback` Hook in React

The `useCallback` hook in React is used to memoize functions, preventing their recreation on every render. This is particularly useful in optimizing performance, as it reduces unnecessary re-renders by ensuring that the function reference remains the same across renders unless its dependencies change.

## When to Use `useCallback`
- **Passing functions to child components**: When passing a function as a prop to a child component, `useCallback` can prevent the child from re-rendering every time the parent renders.
- **Event handlers**: Memoizing event handler functions can be beneficial if they trigger expensive calculations.
- **Performance optimization**: It’s best used in scenarios where avoiding re-renders makes a significant impact on performance.

## Syntax
```javascript
const memoizedCallback = useCallback(() => {
    // function logic
}, [dependencies]);
```

- **Function to memoize**: The first argument is the function that we want to keep the same across renders.
- **Dependency array**: The second argument is an array of dependencies. The function only changes if any dependency in this array changes.

If the dependency array is empty (`[]`), the function will only be created once and will not change across renders.

## Example: Basic Usage of `useCallback`

In the following example, we have a parent component that passes an increment function to the child. Without `useCallback`, the child component would re-render on each parent render, even if the function logic doesn’t change.

Refer to the `.jsx` file for this example implementation.
