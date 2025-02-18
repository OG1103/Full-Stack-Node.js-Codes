# Slider Component (MUI)

A **Slider** component in Material-UI (MUI) is a UI element used to allow users to select a value from a defined range by dragging a handle along a track.

## Props Table

| Prop             | Type        | Default | Description |
|-----------------|------------|---------|-------------|
| `min`          | `number`    | `0`     | The minimum value of the slider. |
| `max`          | `number`    | `100`   | The maximum value of the slider. |
| `step`         | `number`    | `1`     | The step value between each selectable number. |
| `value`        | `number`    | `0`     | The current value of the slider. |
| `onChange`     | `function`  | `null`  | A function called when the slider value changes. |
| `disabled`     | `boolean`   | `false` | Disables user interaction with the slider. |
| `marks`        | `array`     | `[]`    | Displays marks along the slider track as an array of objects with `{ value, label }`. |
| `tooltip`      | `boolean`   | `true`  | Shows tooltip with the current value. |
| `orientation`  | `string`    | `'horizontal'` | Determines the slider's orientation, either `'horizontal'` or `'vertical'`. |
| `color` | `"primary"`, `"secondary"`, `"success"`, `"error"`, `"warning"`, `"info"` | Sets the slider color. |
| `valueLabelDisplay` | `string` | `'auto'` | Controls the display of the value label. Options: `'auto'`, `'on'`, `'off'`. |

---

## Use Cases and Example for Each Prop

### `marks` Example
```jsx
import Slider from '@mui/material/Slider';

const marks = [
  { value: 0, label: 'Low' },
  { value: 50, label: 'Medium' },
  { value: 100, label: 'High' }
];

<Slider min={0} max={100} step={10} marks={marks} />
```
Displays marks along the slider at specified values with labels.

### `valueLabelDisplay` Explanation
The `valueLabelDisplay` prop controls how the value label is shown:

- `'auto'` (default): The value label is displayed only when the user interacts with the slider.
- `'on'`: The value label is always visible.
- `'off'`: The value label is never displayed.

### `valueLabelDisplay` Example
```jsx
<Slider min={0} max={100} valueLabelDisplay="on" />
```
Ensures the value label is always shown.

### Basic Slider
```jsx
import React, { useState } from 'react';
import Slider from '@mui/material/Slider';

const BasicSlider = () => {
  const [value, setValue] = useState(50);
  return (
    <Slider
      min={0}
      max={100}
      step={1}
      value={value}
      onChange={(e, newValue) => setValue(newValue)}
    />
  );
};

export default BasicSlider;
```

### `min` and `max` Example
```jsx
<Slider min={10} max={200} />
```
This sets the slider range from 10 to 200.

### `step` Example
```jsx
<Slider min={0} max={100} step={10} />
```
The slider moves in steps of 10 instead of 1.
Setting ths step to {null} makes it only move to the values marked at the marks. if mark option is enabled.

### `disabled` Example
```jsx
<Slider min={0} max={100} disabled />
```
The slider is disabled and cannot be interacted with.

### `onChange` Example
```jsx
const handleChange = (event, newValue) => {
  console.log("Slider Value: ", newValue);
};
<Slider min={0} max={100} onChange={handleChange} />
```
Logs the slider value when changed.

### `orientation` Example
```jsx
<Slider min={0} max={100} orientation="vertical" />
```
Creates a vertical slider. However, we need to ensure their is enough height for our compoenent so we can wrap it inside a box and give it a height

---

## Complex Use Case: Custom Styled Slider
```jsx
import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import './Slider.css';

const CustomSlider = () => {
    // if i set the value as an array of 2 numbers it gives me the choise to have 2 options in the slider. add (disableswap) so the 2 points don't overlap aka min is always before max
    // Upon updates the newValue is represented as an array of the 2 numbers as well where the first element can be the min and the second is the max. 
    // useful for filter maybe
  const [value, setValue] = useState(50);
  const marks = [
    { value: 0, label: 'Start' },
    { value: 50, label: 'Mid' },
    { value: 100, label: 'End' }
  ];

  return (
    <div className="slider-container">
      <Slider
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(e, newValue) => setValue(newValue)}
        valueLabelDisplay="auto"
        marks={marks}
        color="primary"
      />
      <span className="slider-value">{value}</span>
    </div>
  );
};

export default CustomSlider;
```

### Custom CSS (`Slider.css`)
```css
.slider-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slider-value {
  margin-top: 10px;
  font-weight: bold;
}
```

This example implements an MUI slider with custom styling, dynamic color updates, a visible value display, and labeled marks.

