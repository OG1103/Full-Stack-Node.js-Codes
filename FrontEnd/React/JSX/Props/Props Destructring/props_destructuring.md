# Props Destructuring

## 1. Introduction
Instead of using `props.property`, **destructuring** allows extracting values directly, making the code **cleaner and more readable**.

## 2. Destructuring Normal Props

### 📌 **Example Without Destructuring**
```tsx
function UserProfile(props) {
    return (
        <div>
            <h2>Name: {props.name}</h2>
            <p>Age: {props.age}</p>
        </div>
    );
}

export default function App() {
    return <UserProfile name="Emma" age={25} />;
}
```

### 📌 **Example With Destructuring**
```tsx
function UserProfile({ name, age }) {
    return (
        <div>
            <h2>Name: {name}</h2>
            <p>Age: {age}</p>
        </div>
    );
}

export default function App() {
    return <UserProfile name="Emma" age={25} />;
}
```
🔹 **Destructuring avoids writing `props.name` and `props.age`.**

---

## 3. Destructuring `props.children`

### 📌 **Example Without Destructuring**
```tsx
function Card(props) {
    return <div className="card">{props.children}</div>;
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

### 📌 **Example With Destructuring**
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

🔹 **Both examples work the same, but destructuring makes it cleaner.**

---

## 4. Setting Default Values While Destructuring
You can **set default values** when destructuring:

```tsx
function User({ name = "Guest", age = 18 }) {
    return <h2>{name} is {age} years old.</h2>;
}

export default function App() {
    return <User />;  // No props passed, will use default values
}
```

🔹 **Output:** `"Guest is 18 years old."`
