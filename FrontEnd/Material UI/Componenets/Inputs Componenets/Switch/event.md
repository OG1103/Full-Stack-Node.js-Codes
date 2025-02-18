# 🔘 Switch Event in MUI

The **MUI Switch** component provides an `onChange` event that allows handling user interactions dynamically. Understanding the event parameter is essential for toggling states, managing settings, and implementing custom logic when the switch value changes.

---

## 📌 **Understanding the `event` Parameter**

When a user toggles the switch, the `onChange` event fires and passes an `event` object. This event object contains important information, such as:

- **`event.target.checked`** → Boolean value indicating whether the switch is ON (`true`) or OFF (`false`).
- **`event.target.name`** → The `name` prop of the `Switch` component (useful for form integration).
- **`event.target`** → The actual DOM element that triggered the event.

---

## 🔍 **Basic Example of Using `event` in `onChange`**

```jsx
import React, { useState } from 'react';
import Switch from '@mui/material/Switch';

export default function BasicSwitchEvent() {
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    console.log("Switch Checked:", event.target.checked);
    console.log("Event Target Name:", event.target.name);
    setChecked(event.target.checked);
  };

  return (
    <Switch name="notifications" checked={checked} onChange={handleChange} />
  );
}
```

### 📝 **Example Output:**
If the user toggles the switch ON, the console logs:
```
Switch Checked: true
Event Target Name: notifications
```
If the user toggles the switch OFF, the console logs:
```
Switch Checked: false
Event Target Name: notifications
```

### **Explanation:**
- `event.target.checked` retrieves the boolean value (`true` when ON, `false` when OFF).
- `event.target.name` identifies the switch (`notifications`).
- `setChecked(event.target.checked)` updates the state dynamically.

---

## 🔄 **Handling Multiple Switches with `event.target.name`**

When using multiple switches, `event.target.name` helps differentiate between them.

```jsx
const [settings, setSettings] = useState({ darkMode: false, sound: true });

const handleSwitchChange = (event) => {
  setSettings({
    ...settings,
    [event.target.name]: event.target.checked,
  });
};

<>
  <Switch name="darkMode" checked={settings.darkMode} onChange={handleSwitchChange} /> Dark Mode
  <Switch name="sound" checked={settings.sound} onChange={handleSwitchChange} /> Sound
</>;
```

### 📝 **Example Output:**
If the user toggles "Dark Mode" ON, the console logs:
```
Updated Settings: { darkMode: true, sound: true }
```

### **Explanation:**
- `event.target.name` dynamically updates the correct state property.
- `event.target.checked` provides the updated boolean value.

---

## 🎯 **Advanced: Using `event` in Form Handling**

When using the `Switch` component inside a form, dynamically managing switch states improves efficiency.

```jsx
const [formData, setFormData] = useState({ emailNotifications: false, autoUpdates: true });

const handleChange = (event) => {
  setFormData({
    ...formData,
    [event.target.name]: event.target.checked,
  });
};

<>
  <Switch name="emailNotifications" checked={formData.emailNotifications} onChange={handleChange} /> Email Notifications
  <Switch name="autoUpdates" checked={formData.autoUpdates} onChange={handleChange} /> Auto Updates
</>;
```

### 📝 **Example Output:**
If the user toggles "Email Notifications" ON, the console logs:
```
Updated Form Data: { emailNotifications: true, autoUpdates: true }
```

### **Explanation:**
- The function dynamically updates form state using `event.target.name`.
- Useful when managing multiple switches in a structured form.

---

## 🚀 **Conclusion**

Understanding the `event` parameter in the `onChange` event of the `Switch` component enables efficient handling of user interactions. Whether toggling preferences, managing settings, or handling multiple switches, leveraging `event.target.checked` ensures seamless integration in React applications.

