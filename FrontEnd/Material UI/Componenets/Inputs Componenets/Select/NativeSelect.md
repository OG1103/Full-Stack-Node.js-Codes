# Native Select Component in React

## Overview
The `NativeSelect` component is a variation of the `Select` component that leverages the native HTML `<select>` element instead of a fully styled Material-UI dropdown. It is designed for better performance, accessibility, and integration with standard HTML form behaviors. Uses operating system native drop down. 

## Differences from Standard Select
When using `NativeSelect`, some key differences compared to `Select` include:

- `NativeSelect` uses the native `<select>` element, making it more lightweight and performant.
- It does not require `MenuItem`; instead, it uses standard `<option>` elements.
- Works better with native form submissions and browser default behaviors.
- Styling options are more limited compared to `Select`.

### InputLabel Association
- For `InputLabel`, use `htmlFor` instead of `labelId`.
- For `NativeSelect`, instead of using `id` directly, pass it inside `inputProps`.

### Example
```jsx
import React, { useState } from 'react';
import { FormControl, InputLabel, NativeSelect } from '@mui/material';

const NativeSelectExample = () => {
  const [value, setValue] = useState('');

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor="native-select">Select an option</InputLabel>
      <NativeSelect
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputProps={{ id: "native-select" }}
      >
        <option value="">Select an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </NativeSelect>
    </FormControl>
  );
};

export default NativeSelectExample;
```

### Key Takeaways
- `InputLabel` should have `htmlFor="native-select"`.
- `NativeSelect` should use `inputProps={{ id: "native-select" }}` to correctly associate it with the label.
- This setup ensures proper accessibility and label functionality.