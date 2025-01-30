# What are Props in React?
Props (short for "properties") are a way to pass **data** from a parent component to a child component in React.

## Key Features:
- Props are **read-only** (immutable).
- Props allow **component reusability** by passing different data.
- Props are passed as **attributes** to child components.

### Example:
```tsx
function Greeting(props) {
    return <h1>Hello, {props.name}!</h1>;
}

export default function App() {
    return <Greeting name="Alice" />;
}
```

### Output:
```
Hello, Alice!
```
