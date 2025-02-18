# MUI FormGroup Component

## Overview

The MUI `FormGroup` component is used to group multiple form controls such as `Checkbox`, `Radio`, or `Switch` components. It helps organize these elements in a vertical or horizontal layout, providing a clean and accessible structure for grouped form inputs. Can also apply global styles in the sx prop of the FormGroup to all FormControlLabels

```jsx
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function BasicFormGroup() {
  return (
    <FormGroup>
      <FormControlLabel control={<Checkbox />} label="Option 1" />
      <FormControlLabel control={<Checkbox />} label="Option 2" />
    </FormGroup>
  );
}
```

## Props Table

| Prop               | Description                                                        | Type                   | Default |
|--------------------|--------------------------------------------------------------------|------------------------|---------|
| `children`         | The content of the `FormGroup`, typically `FormControlLabel` components. | `node`                 | `-`     |
| `row`              | Displays the form controls in a horizontal row if `true`.          | `bool`                 | `false` |
| `sx`               | The system prop for custom styles.                                 | `object`               | `{}`    |
| `className`        | Applies custom CSS classes to the root element.                    | `string`               | `-`     |
| `component`        | The component used for the root node.                              | `elementType`          | `div`   |
| `style`            | Applies inline styles directly to the root element.                | `object`               | `{}`    |
| `id`               | The ID of the root element for accessibility purposes.             | `string`               | `-`     |
| `ref`              | Reference to the root element.                                     | `ref`                  | `-`     |
| `role`             | Defines the ARIA role of the element.                              | `string`               | `-`     |
| `aria-labelledby`  | ARIA attribute to define a label for accessibility.               | `string`               | `-`     |
| `aria-describedby` | ARIA attribute to provide additional descriptive information.      | `string`               | `-`     |

## Detailed Explanation of Each Prop

### 1. `children`

```jsx
<FormGroup>
  <FormControlLabel control={<Checkbox />} label="Option A" />
  <FormControlLabel control={<Checkbox />} label="Option B" />
</FormGroup>
```
- **Explanation:** Wraps multiple form controls, commonly `Checkbox` or `Radio` components.

### 2. `row`

```jsx
<FormGroup row>
  <FormControlLabel control={<Checkbox />} label="Option 1" />
  <FormControlLabel control={<Checkbox />} label="Option 2" />
</FormGroup>
```
- **Explanation:** Displays the form controls horizontally when `row` is set to `true`.

### 3. `sx`

```jsx
<FormGroup sx={{ border: '1px solid gray', padding: 2, borderRadius: 1 }}>
  <FormControlLabel control={<Checkbox />} label="Styled Option" />
</FormGroup>
```
- **Explanation:** Applies custom styles using the `sx` prop.

### 4. `className`

```jsx
<FormGroup className="custom-form-group">
  <FormControlLabel control={<Checkbox />} label="Custom Class Option" />
</FormGroup>
```
- **Explanation:** Adds a custom CSS class to the `FormGroup` for additional styling.

### 5. `component`

```jsx
<FormGroup component="fieldset">
  <FormControlLabel control={<Checkbox />} label="Fieldset Option" />
</FormGroup>
```
- **Explanation:** Changes the root element to a semantic `fieldset`.

### 6. `style`

```jsx
<FormGroup style={{ backgroundColor: 'lightgray', padding: '10px' }}>
  <FormControlLabel control={<Checkbox />} label="Inline Styled Option" />
</FormGroup>
```
- **Explanation:** Adds inline CSS styles directly to the `FormGroup`.

### 7. `id`

```jsx
<FormGroup id="form-group-1">
  <FormControlLabel control={<Checkbox />} label="Labeled Option" />
</FormGroup>
```
- **Explanation:** Assigns an `id` for referencing in accessibility tools.

### 8. `ref`

```jsx
import { useRef, useEffect } from 'react';

export default function RefExample() {
  const formGroupRef = useRef(null);

  useEffect(() => {
    console.log(formGroupRef.current); // Logs the DOM node
  }, []);

  return (
    <FormGroup ref={formGroupRef}>
      <FormControlLabel control={<Checkbox />} label="Ref Option" />
    </FormGroup>
  );
}
```
- **Explanation:** Provides a reference to the `FormGroup` DOM node.

### 9. `role`

```jsx
<FormGroup role="group">
  <FormControlLabel control={<Checkbox />} label="ARIA Group Option" />
</FormGroup>
```
- **Explanation:** Defines an ARIA role for accessibility.

### 10. `aria-labelledby`

```jsx
<FormGroup aria-labelledby="form-group-label">
  <label id="form-group-label">Options Group</label>
  <FormControlLabel control={<Checkbox />} label="Option 1" />
</FormGroup>
```
- **Explanation:** Links the `FormGroup` to a label for screen readers.

### 11. `aria-describedby`

```jsx
<FormGroup aria-describedby="form-group-description">
  <FormControlLabel control={<Checkbox />} label="Option with Description" />
  <p id="form-group-description">This group contains checkboxes.</p>
</FormGroup>
```
- **Explanation:** Provides additional descriptive text for accessibility.

## Explanation of `event.target` in FormGroup

While `FormGroup` itself does not handle events directly, it passes event handlers to its child components. When handling events (like `onChange`), the `event.target` refers to the specific input inside the `FormGroup`.

### Example:

```jsx
const handleChange = (event) => {
  console.log('Checked:', event.target.checked);
  console.log('Value:', event.target.value);
  console.log('Name:', event.target.name);
};

<FormGroup>
  <FormControlLabel
    control={<Checkbox name="optionA" value="A" onChange={handleChange} />}
    label="Option A"
  />
  <FormControlLabel
    control={<Checkbox name="optionB" value="B" onChange={handleChange} />}
    label="Option B"
  />
</FormGroup>
```

- **Output when toggled:**
```
Checked: true
Value: A
Name: optionA
```

### Key Properties:
- **`event.target.checked`**: Indicates if the checkbox is checked (`true` or `false`).
- **`event.target.value`**: Holds the value of the form control.
- **`event.target.name`**: Identifies the specific input field.

## Conclusion

The MUI `FormGroup` component is essential for grouping related form controls, offering flexible layouts and easy state management through its child components. Mastering its props ensures clean, accessible form structures in your UI.

