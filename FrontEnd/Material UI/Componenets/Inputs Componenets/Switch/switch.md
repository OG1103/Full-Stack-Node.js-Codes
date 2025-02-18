# Switch Component in React (MUI)

A **Switch** component in Material-UI (MUI) is a UI element that allows users to toggle between two states, typically on and off. We use a switch when we only have one option either selected or not selected. 

## Props Table

| Prop             | Type        | Default | Description |
|-----------------|------------|---------|-------------|
| `checked`      | `boolean`   | `false` | Controls whether the switch is on (`true`) or off (`false`). |
| `defaultChecked` | `boolean` | `false` | Sets the initial checked state if uncontrolled. |
| `onChange`     | `function`  | `null`  | Callback function fired when the switch state changes. |
| `disabled`     | `boolean`   | `false` | Disables user interaction with the switch. |
| `color`        | `string`    | `'primary'` | Defines the color of the switch. Options: `'primary'`, `'secondary'`, `'default'`. |
| `size`         | `string`    | `'medium'` | Defines the size of the switch. Options: `'small'`, `'medium'`. |
| `edge`         | `string`    | `false` | Places the switch at the start or end of a container. Options: `'start'`, `'end'`. |

---

## Use Cases and Example for Each Prop

### `checked` Example
```jsx
import React, { useState } from 'react';
import Switch from '@mui/material/Switch';

const ControlledSwitch = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Switch checked={checked} onChange={(e) => setChecked(e.target.checked)} />
  );
};

export default ControlledSwitch;
```
This ensures that the switch is controlled by state.

### `defaultChecked` Example
```jsx
<Switch defaultChecked />
```
The switch starts in the 'on' state but is uncontrolled.

### `onChange` Example
```jsx
const handleChange = (event) => {
  console.log("Switch State: ", event.target.checked);
};
<Switch onChange={handleChange} />
```
Logs the switch state when changed.

### `disabled` Example
```jsx
<Switch disabled />
```
The switch is disabled and cannot be interacted with.

### `color` Example
```jsx
<Switch color="secondary" />
```
Changes the switch color to the secondary theme color.

### `size` Example
```jsx
<Switch size="small" />
```
Renders a smaller switch.

### `edge` Example
```jsx
<Switch edge="end" />
```
Positions the switch at the end of a container.

---

## Complex Use Case: Themed Switch with Custom Behavior
```jsx
import React, { useState } from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

const CustomSwitch = () => {
  const [checked, setChecked] = useState(false);

  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={(e) => setChecked(e.target.checked)} color="primary" size="medium" />}
      label={checked ? "Enabled" : "Disabled"}
    />
  );
};

export default CustomSwitch;
```
This example wraps the switch with a label that dynamically updates based on the switch state.

