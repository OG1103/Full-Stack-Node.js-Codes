
# Conditional Rendering in React

In React, **conditional rendering** allows components to render different outputs based on specific conditions, such as user actions, data states, or other variables. Conditional rendering is essential for creating dynamic and interactive UIs.

## Common Methods for Conditional Rendering

### 1. Using `if` Statements
You can use `if` statements to render different components or elements based on conditions.

Example:
```javascript
function Greeting({ isLoggedIn }) {
    if (isLoggedIn) {
        return <h1>Welcome back!</h1>;
    }
    return <h1>Please sign in.</h1>;
}
```

### 2. Using the Ternary Operator
The ternary operator (`condition ? exprIfTrue : exprIfFalse`) is a concise way to render elements conditionally.

Example:
```javascript
function Greeting({ isLoggedIn }) {
    return (
        <h1>{isLoggedIn ? "Welcome back!" : "Please sign in."}</h1>
    );
}
```

### 3. Logical AND (`&&`) Operator
You can use the `&&` operator for conditional rendering when you only want to render an element if a condition is `true`.

Example:
```javascript
function Notification({ showNotification }) {
    return (
        <div>
            {showNotification && <p>You have a new message!</p>}
        </div>
    );
}
```

In this example, the message will only display if `showNotification` is `true`.

### 4. Using `switch` Statements
For multiple conditions, `switch` statements can help simplify conditional rendering.

Example:
```javascript
function StatusMessage({ status }) {
    switch (status) {
        case "loading":
            return <p>Loading...</p>;
        case "success":
            return <p>Data loaded successfully!</p>;
        case "error":
            return <p>There was an error loading data.</p>;
        default:
            return <p>Idle</p>;
    }
}
```

### 5. Conditional Rendering with Inline Functions
Inline functions can sometimes provide a clean way to handle multiple conditions, especially when combining them with other React logic.

Example:
```javascript
function Profile({ isPremiumUser }) {
    return (
        <div>
            {isPremiumUser ? <PremiumContent /> : <RegularContent />}
        </div>
    );
}
```

### Summary
- Conditional rendering in React is versatile, allowing you to control the output of components dynamically.
- Using `if` statements, ternary operators, logical `&&`, `switch` statements, and inline functions provides flexibility for different conditions.
