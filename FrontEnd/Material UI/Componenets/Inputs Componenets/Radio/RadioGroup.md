# 📻 MUI RadioGroup Component Guide

The **MUI RadioGroup** component is used to group multiple `Radio` components together, allowing the user to select **only one option** at a time. It's commonly used in forms where you need to present multiple mutually exclusive options.

---

## 📚 **Overview**

- **Purpose:** Manages the state and behavior of a group of radio buttons.
- **Common Use Case:** Often used with `FormControl`, `FormLabel`, and `FormControlLabel` to create accessible and well-structured form inputs.

```jsx
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function BasicRadioGroup() {
  return (
    <RadioGroup name="options" defaultValue="option1">
      <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
      <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
    </RadioGroup>
  );
}
```

---

## ✅ **Props Table**

| **Prop**                | **Description**                                                                 | **Type**                  | **Default** |
|-------------------------|-------------------------------------------------------------------------------|---------------------------|-------------|
| `name`                  | Assigns a common name to all radio buttons in the group.                       | `string`                  | `-`         |
| `value`                 | The selected value of the `RadioGroup`.                                        | `string` \| `number`      | `-`         |
| `defaultValue`          | The initial selected value when the component mounts.                         | `string` \| `number`      | `-`         |
| `onChange`              | Callback fired when the selected value changes.                               | `function(event)`         | `-`         |
| `row`                   | Displays radio buttons horizontally when set to `true`.                       | `bool`                    | `false`     |
| `children`              | The `Radio` components to be rendered inside the group.                       | `node`                    | `-`         |
| `sx`                    | The system prop for custom styles.                                           | `object`                  | `{}`        |
| `className`             | Adds custom CSS classes.                                                     | `string`                  | `-`         |
| `aria-labelledby`       | Improves accessibility by linking the group to a label.                       | `string`                  | `-`         |
| `ref`                   | Provides a reference to the root DOM node.                                   | `ref`                     | `-`         |

---

## 🔍 **Detailed Explanation of Each Prop**

### 1️⃣ **`name`**

```jsx
<RadioGroup name="gender">
  <FormControlLabel value="male" control={<Radio />} label="Male" />
  <FormControlLabel value="female" control={<Radio />} label="Female" />
</RadioGroup>
```
- **Explanation:** Groups radio buttons together under the same name, ensuring only one can be selected.

### 2️⃣ **`value`** (Controlled Component)

```jsx
const [selectedValue, setSelectedValue] = React.useState('male');

<RadioGroup name="gender" value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
  <FormControlLabel value="male" control={<Radio />} label="Male" />
  <FormControlLabel value="female" control={<Radio />} label="Female" />
</RadioGroup>
```
- **Explanation:** Controls the selected value programmatically. Ideal for forms managed with React state.

### 3️⃣ **`defaultValue`** (Uncontrolled Component)

```jsx
<RadioGroup name="gender" defaultValue="female">
  <FormControlLabel value="male" control={<Radio />} label="Male" />
  <FormControlLabel value="female" control={<Radio />} label="Female" />
</RadioGroup>
```
- **Explanation:** Sets the default selected value when the component first mounts.

### 4️⃣ **`onChange`**

```jsx
const handleChange = (event) => {
  console.log('Selected:', event.target.value);
};

<RadioGroup name="options" onChange={handleChange}>
  <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
  <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
</RadioGroup>
```
- **Explanation:** Triggers a callback when the selected radio button changes.

### 5️⃣ **`row`**

```jsx
<RadioGroup row>
  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
  <FormControlLabel value="no" control={<Radio />} label="No" />
</RadioGroup>
```
- **Explanation:** Displays radio buttons horizontally instead of vertically.

### 6️⃣ **`children`**

- **Explanation:** Wraps `Radio` components within the `RadioGroup`.
- **Example:**
  ```jsx
  <RadioGroup>
    <FormControlLabel value="apple" control={<Radio />} label="Apple" />
    <FormControlLabel value="banana" control={<Radio />} label="Banana" />
  </RadioGroup>
  ```

### 7️⃣ **`sx`**

```jsx
<RadioGroup sx={{ backgroundColor: 'lightgray', padding: '10px' }}>
  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
  <FormControlLabel value="no" control={<Radio />} label="No" />
</RadioGroup>
```
- **Explanation:** Applies custom styles using MUI's `sx` prop.

### 8️⃣ **`className`**

```jsx
<RadioGroup className="custom-radio-group">
  <FormControlLabel value="one" control={<Radio />} label="One" />
  <FormControlLabel value="two" control={<Radio />} label="Two" />
</RadioGroup>
```
- **Explanation:** Adds custom CSS classes for additional styling.

### 9️⃣ **`aria-labelledby`**

```jsx
<FormLabel id="group-label">Select an Option</FormLabel>
<RadioGroup aria-labelledby="group-label" name="options">
  <FormControlLabel value="a" control={<Radio />} label="A" />
  <FormControlLabel value="b" control={<Radio />} label="B" />
</RadioGroup>
```
- **Explanation:** Enhances accessibility by linking the group to a label.

### 🔟 **`ref`**

```jsx
const groupRef = React.useRef();

<RadioGroup ref={groupRef} name="choices">
  <FormControlLabel value="x" control={<Radio />} label="X" />
  <FormControlLabel value="y" control={<Radio />} label="Y" />
</RadioGroup>
```
- **Explanation:** Provides a reference to the DOM node for advanced manipulations.

---

## 🧪 **Working with `event.target`**

The `onChange` event provides an `event` object, allowing you to access properties like `event.target.value`.

### ✅ **Example:** Accessing and Updating Selected Values

```jsx
import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

export default function RadioGroupExample() {
  const [selectedValue, setSelectedValue] = useState('option1');

  const handleChange = (event) => {
    setSelectedValue(event.target.value); // refers to the formcontrollabel's value
    console.log('Selected:', event.target.value);
  };

  return (
    <div>
      <RadioGroup name="options" value={selectedValue} onChange={handleChange}>
        <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
        <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
      </RadioGroup>
      <Typography>Selected Option: {selectedValue}</Typography>
    </div>
  );
}
```

### 🔍 **Explanation:**
- **`event.target.value`:** Retrieves the value of the selected radio button.
- **`onChange`:** Updates the React state when a new option is selected.
- **Display:** The selected option is shown below the radio group.

---

## 🚀 **Conclusion**

The MUI `RadioGroup` component simplifies the management of grouped radio buttons, ensuring accessibility, consistency, and ease of use. With powerful props like `onChange`, `value`, and `row`, it provides flexibility for both simple and complex form scenarios.

