# Props Children

## 1. Introduction
`props.children` is used to **pass JSX inside a component**.

## 2. Example of `props.children`
```tsx
function Card({ children }) {
    return <div className="card">{children}</div>;
}

export default function App() {
    return (
        <Card>
            <h2>Title</h2>
            <p>This is some content inside the card.</p>
        </Card>
    );
}
```

🔹 **Output:** A card containing a title and paragraph.

## 3. Using `props.children` with Conditional Rendering

```tsx
function Wrapper({ children }) {
    return children ? <div className="box">{children}</div> : null;
}

export default function App() {
    return (
        <Wrapper>
            <p>This is inside the wrapper.</p>
        </Wrapper>
    );
}
```

🔹 **If `Wrapper` has no children, it won't render anything.**
