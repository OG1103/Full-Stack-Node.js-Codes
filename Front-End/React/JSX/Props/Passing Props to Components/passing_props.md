# Passing Props to Components

## 1. Introduction
Props allow **dynamic values** to be passed into a React component.

## 2. Passing Different Data Types as Props

| Data Type | Example |
|-----------|---------|
| **String** | `<Component name="John" />` |
| **Number** | `<Component age={25} />` |
| **Boolean** | `<Component isAdmin={true} />` |
| **Array** | `<Component items={[1, 2, 3]} />` |
| **Object** | `<Component user={{ name: "John", age: 30 }} />` |
| **Function** | `<Component onClick={handleClick} />` |

### 📌 **Example Using All Data Types**
```tsx
function DisplayProps({ name, age, isAdmin, items, user, onClick }) {
    return (
        <div>
            <h2>Name: {name}</h2>
            <p>Age: {age}</p>
            <p>Admin: {isAdmin ? "Yes" : "No"}</p>
            <p>Items: {items.join(", ")}</p>
            <p>User: {user.name} (Age: {user.age})</p>
            <button onClick={onClick}>Click Me</button>
        </div>
    );
}

export default function App() {
    return (
        <DisplayProps 
            name="Alice" 
            age={28} 
            isAdmin={true} 
            items={[1, 2, 3]} 
            user={{ name: "John", age: 30 }} 
            onClick={() => alert("Button clicked!")}
        />
    );
}
```

### 🔥 **Next: See How to Destructure Props!**
