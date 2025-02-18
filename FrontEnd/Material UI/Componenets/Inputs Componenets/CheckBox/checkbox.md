# MUI Checkbox Component

## Overview

The MUI `Checkbox` component is a versatile form control that allows users to select one or more options from a set. It can be used in standalone mode or integrated with other components like `FormControlLabel` for better accessibility and layout even to add a label to the checkbox.



```jsx
import Checkbox from "@mui/material/Checkbox";

export default function BasicCheckbox() {
  return <Checkbox />;
}
```

## Props Table

| Prop                | Description                                                   | Type                                                   | Default     |
| ------------------- | ------------------------------------------------------------- | ------------------------------------------------------ | ----------- |
| `checked`           | Controls the checked state (controlled component).            | `bool`                                                 | `false`     |
| `defaultChecked`    | Sets the initial checked state (uncontrolled component).      | `bool`                                                 | `false`     |
| `disabled`          | Disables the checkbox if `true`.                              | `bool`                                                 | `false`     |
| `indeterminate`     | Displays the checkbox in an indeterminate state.              | `bool`                                                 | `false`     |
| `color`             | Sets the color of the checkbox.                               | `string` (`'primary'`, `'secondary'`, `'error'`, etc.) | `'primary'` |
| `icon`              | Custom icon for the unchecked state (Instead of the box).     | `node`                                                 | `-`         |
| `checkedIcon`       | Custom icon for the checked state (Instead of the box).       | `node`                                                 | `-`         |
| `indeterminateIcon` | Custom icon when in indeterminate state.                      | `node`                                                 | `-`         |
| `onChange`          | Callback function triggered when the state changes.           | `function`                                             | `-`         |
| `inputProps`        | Props applied to the input element.                           | `object`                                               | `{}`        |
| `required`          | Marks the checkbox as required.                               | `bool`                                                 | `false`     |
| `value`             | The value associated with the checkbox when submitting forms. | `any`                                                  | `on`        |
| `size`              | Adjusts the size of the checkbox (`'small'` or `'medium'`).   | `string`                                               | `'medium'`  |
| `name`              | Name attribute for the checkbox input.                        | `string`                                               | `-`         |
| `id`                | ID for the checkbox, useful for accessibility.                | `string`                                               | `-`         |

## Detailed Explanation of Each Prop

### 1. `checked`

```jsx
import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";

export default function ControlledCheckbox() {
  const [isChecked, setIsChecked] = useState(false);

  return <Checkbox checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />;
}
```

- **Explanation:** Controls the checkbox's state via React state.

### 2. `defaultChecked`

```jsx
<Checkbox defaultChecked />
```

- **Explanation:** Initializes the checkbox as checked without managing state.

### 3. `disabled`

```jsx
<Checkbox disabled />
```

- **Explanation:** Prevents user interaction.

### 4. `indeterminate`

```jsx
<Checkbox indeterminate />
```

- **Explanation:** Shows a dash to indicate a partial selection.

### 5. `color`

```jsx
<Checkbox color="secondary" />
```

- **Explanation:** Changes the color to secondary.

### 6. `icon`, `checkedIcon`, `indeterminateIcon`

```jsx
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";

<Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} />;
```

- **Explanation:** Customizes icons for different states.

### 7. `onChange` (In-Depth)

#### Basic Example

```jsx
const handleChange = (event) => {
  console.log(event.target.checked); // true or false
};

<Checkbox onChange={handleChange} />;
```

- **`event.target.checked`:** Boolean indicating the new state.

#### Complex Example with Multiple Checkboxes

```jsx
import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function MultipleCheckboxes() {
  const [state, setState] = useState({
    optionA: false,
    optionB: false,
    optionC: false,
  });

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setState((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    // We use a Formgroup when wanting multiple checkboxes to control the layout 
    // We wrap all of that in a form control then to apply managmenet of the form componenets to keep everything in sync
    <FormGroup>
      <FormControlLabel
        control={<Checkbox name="optionA" checked={state.optionA} onChange={handleChange} />}
        label="Option A"
      />
      <FormControlLabel
        control={<Checkbox name="optionB" checked={state.optionB} onChange={handleChange} />}
        label="Option B"
      />
      <FormControlLabel
        control={<Checkbox name="optionC" checked={state.optionC} onChange={handleChange} />}
        label="Option C"
        // can also add label placement to determine where the label is 
      />
    </FormGroup>
  );
}
```

- **Explanation:** Manages multiple checkboxes with dynamic state updates.
- **`event.target.name`:** Identifies which checkbox was toggled.
- **`event.target.checked`:** Holds the new boolean state.

### 8. `value`

```jsx
<Checkbox value="agree" />
```

- **Explanation:** The value sent when submitting forms.

### 9. `size`

```jsx
<Checkbox size="small" />
```

- **Explanation:** Adjusts the size of the checkbox.

### 10. `inputProps`

```jsx
<Checkbox inputProps={{ "aria-label": "primary checkbox" }} />
```

- **Explanation:** Adds custom attributes to the underlying input.

### 11. `required`

```jsx
<Checkbox required />
```

- **Explanation:** Marks the checkbox as required in forms.

### 12. `name` and `id`

```jsx
<Checkbox name="acceptTerms" id="terms-checkbox" />
```

- **Explanation:** Useful for form submissions and accessibility.

## Explanation of `event.target` in Checkbox

When handling events like `onChange` in MUI's `Checkbox`, the `event.target` refers to the underlying DOM element (usually an `<input type="checkbox">`). Understanding its properties helps manage form states effectively.

### Key Properties:

- **`event.target.checked`**: Indicates whether the checkbox is checked (`true` or `false`).
- **`event.target.value`**: Holds the `value` of the checkbox (useful in forms).
- **`event.target.name`**: The `name` attribute, which helps identify the checkbox when dealing with multiple inputs.
- **`event.target.id`**: Refers to the checkbox's `id` attribute.

### Example:

```jsx
const handleChange = (event) => {
  console.log("Checked:", event.target.checked);
  console.log("Value:", event.target.value);
  console.log("Name:", event.target.name);
  console.log("ID:", event.target.id);
};

<Checkbox name="subscribe" value="newsletter" id="subscribe-checkbox" onChange={handleChange} />;
```

- **Output when toggled:**

```
Checked: true
Value: newsletter
Name: subscribe
ID: subscribe-checkbox
```

This allows developers to easily track which checkbox was interacted with, its current state, and associated metadata.

## Conclusion

The MUI `Checkbox` is a powerful component with extensive customization options. Mastering its props, especially `onChange`, allows for dynamic, interactive UIs.
