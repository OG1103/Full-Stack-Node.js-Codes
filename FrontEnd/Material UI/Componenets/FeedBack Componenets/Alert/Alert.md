# Material UI Alert (Complete Guide)

The **Alert** component in Material UI (MUI) is used to **display feedback messages** in response to user actions. It is useful for **warnings, errors, success messages, and informational notifications**.

---

## ✅ 1. Introduction: What is `Alert`?

The `Alert` component provides an easy way to display important messages to users. It supports different **severity levels**, **actions**, and **customization options**.
It Takes a 100% of it's container by default

### 🔹 **Common Use Cases**

- **Error messages** (e.g., "Invalid credentials")
- **Success messages** (e.g., "Form submitted successfully")
- **Warning messages** (e.g., "This action is irreversible")
- **Information messages** (e.g., "New updates available")

```jsx
import Alert from "@mui/material/Alert";

<Alert severity="error">This is an error alert!</Alert>
<Alert severity="success">Success! Your action was completed.</Alert>
```

🔹 **Alerts are essential for guiding users and improving UX.**

---

## ✅ 2. Alert Props Overview

The `Alert` component has several props that control its behavior:

| Prop Name  | Type                                                                      | Default      | Description                                                                 |
| ---------- | ------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------- |
| `severity` | `"error"`, `"warning"`, `"info"`, `"success"`                             | `"success"`  | Defines the alert type.                                                     |
| `variant`  | `"filled"`, `"outlined"`, `"standard"`                                    | `"standard"` | Controls the appearance of the alert.                                       |
| `color`    | `"primary"`, `"secondary"`, `"success"`, `"error"`, `"warning"`, `"info"` | `undefined`  | Sets the alert's color independently of severity.                           |
| `icon`     | `ReactNode` or `false`                                                    | `undefined`  | Adds a custom icon to the alert. Set to `false` to remove the default icon. |
| `onClose`  | `function`                                                                | `undefined`  | Adds a close button that triggers an action.                                |
| `action`   | `ReactNode`                                                               | `undefined`  | Allows adding custom action buttons inside the alert.                       |
| `sx`       | `object`                                                                  | `undefined`  | Allows custom styling.                                                      |

---

## ✅ 3. Detailed Explanation of Props with Examples

### 🔹 **1. `severity` (Alert Type)**

Defines the type of alert message.

```jsx
<Alert severity="error">This is an error alert.</Alert>
<Alert severity="warning">This is a warning alert.</Alert>
<Alert severity="info">This is an info alert.</Alert>
<Alert severity="success">This is a success alert.</Alert>
```

✔ **Use Cases**:

- `error`: Display critical errors (e.g., "Payment failed")
- `warning`: Warn users about potential issues (e.g., "Password is weak")
- `info`: Provide general updates (e.g., "New version available")
- `success`: Indicate completed actions (e.g., "Item added to cart")

---

### 🔹 **2. `variant` (Alert Style)**

Controls the appearance of the alert.

```jsx
<Alert variant="standard" severity="info">Standard Alert</Alert>
<Alert variant="outlined" severity="warning">Outlined Alert</Alert>
<Alert variant="filled" severity="success">Filled Alert</Alert>
```

✔ **Use Cases**:

- `standard`: Default look, useful for most cases.
- `outlined`: Highlights the message while keeping a minimal look.
- `filled`: Makes the alert more prominent with a strong background.

---

### 🔹 **3. `color` (Custom Alert Color)**

Allows overriding the default color for any alert.

```jsx
<Alert color="primary">Primary Color Alert</Alert>
<Alert color="secondary">Secondary Color Alert</Alert>
<Alert color="success">Success Color Alert</Alert>
<Alert color="error">Error Color Alert</Alert>
<Alert color="warning">Warning Color Alert</Alert>
<Alert color="info">Info Color Alert</Alert>
```

✔ **Use Cases**:

- Helps match the alert with the application's theme.
- Can be used independently of `severity`.

---

### 🔹 **4. `icon` (Custom or No Icon)**

Allows adding a custom icon or disabling the default icon.

```jsx
import InfoIcon from "@mui/icons-material/Info";

<Alert severity="info" icon={<InfoIcon />}>
  This is an alert with a custom icon!
</Alert>

<Alert severity="warning" icon={false}>
  Warning alert without an icon.
</Alert>
```

✔ **Use Cases**:

- Custom icons for branding or design consistency.
- Remove the default icon for a simpler look.

---

### 🔹 **5. `onClose` (Dismissible Alert)**

Allows users to close the alert.

```jsx
<Alert severity="error" onClose={() => alert("Alert dismissed!")}>
  Close this alert
</Alert>
```

✔ **Use Cases**:

- Helps users dismiss non-critical messages.
- Useful when users need to take action before closing.

---

### 🔹 **6. `action` (Custom Actions)**

Adds buttons or links inside the alert.

```jsx
import Button from "@mui/material/Button";

<Alert severity="info" action={<Button color="inherit">UNDO</Button>}>
  Message Sent
</Alert>;
```

✔ **Use Cases**:

- Adding "Retry", "Dismiss", or "Undo" actions inside alerts.

---

### 🔹 **7. `sx` (Custom Styling)**

Allows styling customization.

```jsx
<Alert severity="warning" sx={{ bgcolor: "purple", color: "white", fontWeight: "bold" }}>
  Custom Styled Alert
</Alert>
```

✔ **Use Cases**:

- Matching the alert with the application’s color scheme.

---

## ✅ 4. Advanced Use Cases & Combinations

### **1️⃣ Closable Alert with Custom Actions**

```jsx
<Alert severity="error" onClose={() => console.log("Alert closed!")} action={<Button color="inherit">Retry</Button>}>
  Network error occurred!
</Alert>
```

✔ **Why use this?**

- Shows an error message with a "Retry" action.
- Dismisses the alert when closed.

---

### **2️⃣ Persistent Alert with `filled` Variant**

```jsx
<Alert severity="success" variant="filled">
  Data saved successfully!
</Alert>
```

✔ **Why use this?**

- Ensures important messages are highly visible.

---

### **3️⃣ Multiple Alerts in a Stack**

```jsx
import Stack from "@mui/material/Stack";

<Stack spacing={2}>
  <Alert severity="success">Success message</Alert>
  <Alert severity="info">Information message</Alert>
  <Alert severity="warning">Warning message</Alert>
  <Alert severity="error">Error message</Alert>
</Stack>;
```

✔ **Why use this?**

- Displays multiple messages together neatly.

---

## 🎉 Conclusion

Material UI `Alert` **improves user experience** by providing clear feedback on user actions.  
It is **customizable, responsive, and supports various alert types**.

✔ **Use `severity` to define message importance.**  
✔ **Customize the look with `variant`.**  
✔ **Enable dismissible alerts with `onClose`.**  
✔ **Add actions for user interaction.**  
✔ **Use `sx` for full styling control.**

🚀 **Start using Alert to enhance your app’s messaging system!**
