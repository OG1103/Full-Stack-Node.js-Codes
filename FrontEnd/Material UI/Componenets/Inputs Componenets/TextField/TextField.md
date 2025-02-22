# MUI TextField Component

## Overview

The `TextField` component in Material-UI (MUI) is a fundamental input component used to capture user input in forms and other UI interactions. It is built on top of the `InputBase` component and provides several built-in functionalities such as validation, error handling, theming, and more. The `TextField` component supports customization through various props and can be used for single-line or multi-line input fields.

---

## Props Table

The following table provides a comprehensive list of all props available in the `TextField` component and their explanations:

| Prop                       | Type                                                                      | Default      | Description                                                      |
| -------------------------- | ------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------- |
| `autoComplete`             | `string`                                                                  | `off`        | Enables or disables browser autocomplete behavior.               |
| `autoFocus`                | `boolean`                                                                 | `false`      | Automatically focuses the input field when the component mounts. |
| `color`                    | `'primary'`, `'secondary'`, `'error'`, `'info'`, `'success'`, `'warning'` | `'primary'`  | Changes the color of the text field border and label.            |
| `defaultValue`             | `any`                                                                     | `undefined`  | The default value for uncontrolled components.                   |
| `disabled`                 | `boolean`                                                                 | `false`      | Disables the input field.                                        |
| `error`                    | `boolean`                                                                 | `false`      | Displays the input in an error state with a red border.          |
| `fullWidth`                | `boolean`                                                                 | `false`      | Expands the input field to the full width of its container.      |
| `helperText`               | `string`                                                                  | `''`         | Displays additional information or instructions below the input. |
| `id`                       | `string`                                                                  | `undefined`  | Defines a unique identifier for the input field.                 |
| `inputProps`               | `object`                                                                  | `{}`         | Provides additional attributes to the underlying input element.  |
| `inputRef`                 | `ref`                                                                     | `undefined`  | Ref to access the underlying input element.                      |
| `label`                    | `string`                                                                  | `''`         | Displays a label for the input field.                            |
| `margin`                   | `'none'`, `'dense'`, `'normal'`                                           | `'none'`     | Adjusts the vertical spacing of the field.                       |
| `multiline`                | `boolean`                                                                 | `false`      | Enables multi-line input.                                        |
| `name`                     | `string`                                                                  | `undefined`  | Specifies the name attribute for form submission.                |
| `onChange`                 | `function`                                                                | `undefined`  | Callback function triggered when the input value changes.        |
| `placeholder`              | `string`                                                                  | `''`         | Placeholder text displayed when the input is empty.              |
| `required`                 | `boolean`                                                                 | `false`      | Marks the field as required.                                     |
| `rows / minRows / maxRows` | `number`                                                                  | `undefined`  | Specifies the number of rows for multi-line input.               |
| `size`                     | `'small'`, `'medium'`                                                     | `'medium'`   | Controls the size of the input field.                            |
| `sx`                       | `object`                                                                  | `{}`         | Accepts custom styling using the MUI `sx` prop.                  |
| `type`                     | `string`                                                                  | `'text'`     | Defines the type of input (`text`, `password`, `email`, etc.).   |
| `value`                    | `any`                                                                     | `undefined`  | Controls the current value of the input.                         |
| `variant`                  | `'filled'`, `'outlined'`, `'standard'`                                    | `'outlined'` | Specifies the visual style of the input.                         |

---

## Use Cases for Each Prop

Each prop in the `TextField` component serves a specific purpose in enhancing user experience and functionality. Below are examples for each prop.

### `autoComplete` Example

```jsx
<TextField autoComplete="username" label="Username" variant="outlined" />
```

**Use Case:** Enables autocomplete to suggest previously entered usernames.

### `color` Example

```jsx
<TextField color="secondary" label="Email" variant="outlined" />
```

**Use Case:** Changes the color theme of the input field.

### `defaultValue` Example

```jsx
<TextField defaultValue="John Doe" label="Name" variant="outlined" />
```

**Use Case:** Prefills an input field in an uncontrolled component.

### `disabled` Example

```jsx
<TextField disabled label="Disabled Input" variant="outlined" />
```

**Use Case:** Prevents user input, making the field non-editable.

### `onChange` Example

```jsx
<TextField onChange={(e) => console.log(e.target.value)} label="Dynamic Input" variant="outlined" />
```

**Use Case:** Captures user input dynamically as they type.

### `placeholder` Example

```jsx
<TextField placeholder="Enter your name" label="Name" variant="outlined" />
```

**Use Case:** Provides guidance on what the user should input.

### `required` Example

```jsx
<TextField required label="Required Field" variant="outlined" />
```

**Use Case:** Ensures the field must be filled before form submission.

### `variant` Example

```jsx
<TextField variant="filled" label="Filled Style" />
```

**Use Case:** Changes the visual style of the text field.

---

## Complex Example: Combining Multiple Props

```jsx
<TextField
  label="Username"
  variant="outlined"
  fullWidth
  required
  autoFocus
  error={true}
  helperText="Username is required"
  inputProps={{ maxLength: 20 }} // if i set readOnly: true , makes it uneditable
/>

//  Password Field with Show/Hide Icon
import React, { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function PasswordField() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField
      label="Password"
      variant="outlined"
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={togglePasswordVisibility} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default PasswordField;

```



**Explanation:**

- Uses `label` and `variant` for styling.
- Sets `fullWidth` to expand.
- Marks the field as `required`.
- Automatically focuses (`autoFocus`).
- Displays an error state (`error={true}`).
- Provides helper text (`helperText`).
- Restricts maximum input length to 20 characters (`inputProps`).
