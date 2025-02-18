# 🔍 Autocomplete Event in MUI

The **MUI Autocomplete** component provides an `onChange` event that allows handling user interactions dynamically. Understanding the event parameter is essential for managing user input, handling suggestions, and implementing custom logic when an option is selected.

---

## 📌 **Understanding the `event` Parameter**

When a user selects an option from the Autocomplete component, the `onChange` event fires and passes an `event` object. This event object contains important information, such as:

- **`event.target.value`** → The selected option (if the input is free-text enabled).
- **`event.target.name`** → The `name` prop of the `Autocomplete` component (useful for form integration).
- **`newValue`** → The selected option (in controlled components).

---

## 🔍 **Basic Example of Using `event` in `onChange`**

```jsx
import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const options = ["Apple", "Banana", "Cherry"];

export default function BasicAutocompleteEvent() {
  const [selectedValue, setSelectedValue] = useState(null);

  const handleChange = (event, newValue) => {
    console.log("Selected Option:", newValue);
    console.log("Event Target Name:", event.target.name);
    setSelectedValue(newValue);
  };

  return (
    <Autocomplete
      name="fruitSelection"
      value={selectedValue}
      onChange={handleChange}
      options={options}
      renderInput={(params) => <TextField {...params} label="Choose a fruit" />}
    />
  );
}
```

### 📝 **Example Output:**
If the user selects "Banana," the console logs:
```
Selected Option: Banana
Event Target Name: fruitSelection
```

### **Explanation:**
- `newValue` represents the selected option.
- `event.target.name` helps identify the Autocomplete component in forms.
- `setSelectedValue(newValue)` updates the state with the new selection.

---

## 🔄 **Handling Multiple Autocompletes with `event.target.name`**

When using multiple Autocomplete components, `event.target.name` helps differentiate between them.

```jsx
const [formData, setFormData] = useState({ fruit: '', country: '' });
const fruitOptions = ["Apple", "Banana", "Cherry"];
const countryOptions = ["USA", "Canada", "UK"];

const handleAutocompleteChange = (event, newValue) => {
  setFormData({
    ...formData,
    [event.target.name]: newValue,
  });
};

<>
  <Autocomplete
    name="fruit"
    value={formData.fruit}
    onChange={handleAutocompleteChange}
    options={fruitOptions}
    renderInput={(params) => <TextField {...params} label="Select Fruit" />}
  />

  <Autocomplete
    name="country"
    value={formData.country}
    onChange={handleAutocompleteChange}
    options={countryOptions}
    renderInput={(params) => <TextField {...params} label="Select Country" />}
  />
</>;
```

### 📝 **Example Output:**
If the user selects "Cherry" and "Canada," the console logs:
```
Updated Form Data: { fruit: 'Cherry', country: 'Canada' }
```

### **Explanation:**
- `event.target.name` dynamically updates the correct state property.
- `newValue` provides the selected option.

---

## 🎯 **Advanced: Using `event` in Free Text Input Mode**

If `freeSolo` is enabled, users can type custom values in the input field.

```jsx
const [customValue, setCustomValue] = useState(null);
const suggestions = ["React", "Vue", "Angular"];

const handleCustomInputChange = (event, newValue) => {
  console.log("User Input:", event.target.value);
  setCustomValue(newValue);
};

<Autocomplete
  freeSolo
  value={customValue}
  onChange={handleCustomInputChange}
  options={suggestions}
  renderInput={(params) => <TextField {...params} label="Enter or Select Framework" />}
/>;
```

### 📝 **Example Output:**
If the user types "Svelte" and presses Enter, the console logs:
```
User Input: Svelte
```

### **Explanation:**
- When `freeSolo` is enabled, users can enter custom text instead of selecting from predefined options.
- `event.target.value` captures the typed input.

---

## 🚀 **Conclusion**

Understanding the `event` parameter in the `onChange` event of the `Autocomplete` component enables efficient handling of user selections. Whether updating state, handling free text inputs, or managing multiple selections, leveraging `event.target.value` and `newValue` ensures seamless integration in React applications.

