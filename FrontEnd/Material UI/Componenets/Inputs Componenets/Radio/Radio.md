# 📻 MUI Radio Component Guide

The **MUI Radio** component is used to create radio buttons in Material-UI-based applications. It allows users to select a **single option** from a set of choices, making it ideal for forms, surveys, and settings where mutually exclusive options are required.

---

## 📚 **Overview**

- **Purpose:** Allows selection of one option from a group.
- **Common Use Case:** Often used in forms alongside `FormControl`, `FormLabel`, and `RadioGroup` components for structured input.

```jsx
import Radio from '@mui/material/Radio';

export default function BasicRadio() {
  return <Radio />;
}
```

---

## ✅ **Props Table**

| **Prop**                | **Description**                                                                 | **Type**                  | **Default** |
|-------------------------|-------------------------------------------------------------------------------|---------------------------|-------------|
| `checked`               | If `true`, the radio button is selected.                                      | `bool`                    | `false`     |
| `defaultChecked`        | The default selection state when the component mounts.                        | `bool`                    | `false`     |
| `disabled`              | Disables the radio button if `true`.                                          | `bool`                    | `false`     |
| `color`                 | The color of the radio button (`'primary'`, `'secondary'`, `'default'`).     | `string`                  | `'primary'` |
| `name`                  | Groups radio buttons with the same name, allowing mutual exclusivity.        | `string`                  | `-`         |
| `value`                 | The value associated with the radio button.                                  | `string` \| `number`      | `-`         |
| `size`                  | Adjusts the size (`'small'`, `'medium'`, `'large'`).                         | `string`                  | `'medium'`  |
| `onChange`              | Callback fired when the selection state changes.                             | `function(event)`         | `-`         |
| `inputProps`            | Props applied to the input element.                                           | `object`                  | `{}`        |
| `inputRef`              | Ref for accessing the DOM input element.                                     | `ref`                     | `-`         |
| `required`              | Marks the radio button as required in forms.                                 | `bool`                    | `false`     |
| `sx`                    | The system prop for custom styles.                                           | `object`                  | `{}`        |
| `className`             | Adds custom CSS classes.                                                     | `string`                  | `-`         |
| `icon`                  | The icon to display when the radio button is unchecked.                      | `node`                    | `-`         |
| `checkedIcon`           | The icon to display when the radio button is checked.                        | `node`                    | `-`         |

---

## 🔍 **Detailed Explanation of Each Prop**

### 1️⃣ **`checked`**

```jsx
<Radio checked={true} />
```
- **Explanation:** Controls the selection state. Useful in controlled components.

### 2️⃣ **`defaultChecked`**

```jsx
<Radio defaultChecked />
```
- **Explanation:** Sets the initial checked state for uncontrolled components.

### 3️⃣ **`disabled`**

```jsx
<Radio disabled />
```
- **Explanation:** Prevents interaction with the radio button.

### 4️⃣ **`color`**

```jsx
<Radio color="secondary" />
```
- **Explanation:** Changes the radio button color. Options: `'primary'`, `'secondary'`, `'default'`.

### 5️⃣ **`name`**

```jsx
<Radio name="gender" value="male" />
<Radio name="gender" value="female" />
```
- **Explanation:** Groups radio buttons together, allowing only one to be selected at a time.

### 6️⃣ **`value`**

```jsx
<Radio value="option1" />
```
- **Explanation:** Defines the value submitted with the form when selected.

### 7️⃣ **`size`**

```jsx
<Radio size="small" />
```
- **Explanation:** Adjusts the size of the radio button (`'small'`, `'medium'`, `'large'`).

### 8️⃣ **`onChange`**

```jsx
const handleChange = (event) => {
  console.log(event.target.value);
};

<Radio value="option1" onChange={handleChange} />
```
- **Explanation:** Triggers a callback when the radio button is selected or deselected.

### 9️⃣ **`inputProps`**

```jsx
<Radio inputProps={{ 'aria-label': 'A' }} />
```
- **Explanation:** Passes additional props to the underlying `<input>` element.

### 🔟 **`inputRef`**

```jsx
const ref = React.useRef();

<Radio inputRef={ref} />
```
- **Explanation:** Provides a reference to the DOM element for advanced manipulation.

### 11️⃣ **`required`**

```jsx
<Radio required />
```
- **Explanation:** Marks the radio button as required in form validation.

### 12️⃣ **`sx`**

```jsx
<Radio sx={{ color: 'green' }} />
```
- **Explanation:** Customizes styles using MUI's `sx` prop.

### 13️⃣ **`className`**

```jsx
<Radio className="custom-radio" />
```
- **Explanation:** Adds custom CSS classes.

### 14️⃣ **`icon` & `checkedIcon`**

```jsx
import Favorite from '@mui/icons-material/Favorite';

<Radio icon={<Favorite />} checkedIcon={<Favorite style={{ color: 'red' }} />} />
```
- **Explanation:** Customizes icons for the checked and unchecked states.

---

## 🧪 **Working with `event.target`**

The `onChange` event provides an `event` object, allowing you to access properties like `event.target.value`.

### ✅ **Example:** Accessing and Editing Values

```jsx
import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';

export default function RadioExample() {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    console.log('Selected:', event.target.value);
  };

  return (
    <RadioGroup name="options" value={selectedValue} onChange={handleChange}>
      <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
      <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
    </RadioGroup>
  );
}
```

### 🔍 **Explanation:**
- **`event.target.value`:** Retrieves the selected radio button's value.
- **`onChange`:** Updates the state whenever a radio button is selected.
- **Use Case:** Useful in forms where radio selections trigger conditional logic.

---

## 🚀 **Conclusion**

The MUI `Radio` component is versatile and easy to integrate within forms. It provides extensive customization options through props, supports accessibility features, and works seamlessly with `RadioGroup` and `FormControlLabel` for advanced use cases.

