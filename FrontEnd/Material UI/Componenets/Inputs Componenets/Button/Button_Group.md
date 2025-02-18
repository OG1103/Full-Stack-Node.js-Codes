# Material UI ButtonGroup (Complete Guide)

The **ButtonGroup** component in Material UI (MUI) is used to group multiple buttons together in a **horizontal or vertical layout**. It helps in maintaining **consistent styling, alignment, and spacing** between buttons.

---

## ✅ 1. Introduction: What is `ButtonGroup`?

The `ButtonGroup` component is used when you need multiple buttons that share a **common purpose or action**.
Applying styles to the button group applies all styles to underlying buttons. 

### 🔹 **Common Use Cases**

- **Toolbar buttons** (e.g., formatting options in a text editor).
- **Pagination controls** (e.g., Previous, Next buttons).
- **Grouped filters** (e.g., All, Completed, Pending in a task manager).
- **Grouped actions** (e.g., Edit, Delete, Share in a card).

```jsx
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

<ButtonGroup variant="contained">
  <Button>Left</Button>
  <Button>Center</Button>
  <Button>Right</Button>
</ButtonGroup>;
```

🔹 **This creates a group of buttons that behave as a unit.**

---

## ✅ 2. ButtonGroup Props Overview

The `ButtonGroup` component comes with several props to customize its behavior.

| Prop Name          | Type                                                                      | Default        | Description                                                  |
| ------------------ | ------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------ |
| `variant`          | `"text"`, `"contained"`, `"outlined"`                                     | `"outlined"`   | Defines the style of the button group.                       |
| `color`            | `"primary"`, `"secondary"`, `"success"`, `"error"`, `"warning"`, `"info"` | `"primary"`    | Sets the button group color.                                 |
| `size`             | `"small"`, `"medium"`, `"large"`                                          | `"medium"`     | Adjusts the button size.                                     |
| `orientation`      | `"horizontal"`, `"vertical"`                                              | `"horizontal"` | Defines the direction of the button group.                   |
| `fullWidth`        | `boolean`                                                                 | `false`        | Makes the button group take the full width of the container. |
| `disabled`         | `boolean`                                                                 | `false`        | Disables all buttons in the group.                           |
| `disableElevation` | `boolean`                                                                 | `false`        | Removes the shadow effect on buttons.                        |
| `disableRipple`    | `boolean`                                                                 | `false`        | Disables the ripple effect on buttons.                       |
| `sx`               | `object`                                                                  | -              | Allows custom styling.                                       |

---

## ✅ 3. Detailed Explanation of Props with Examples

### 🔹 **1. `variant` (Button Style)**

The `variant` prop defines the style of buttons inside the group.

```jsx
<ButtonGroup variant="contained">
  <Button>Contained</Button>
  <Button>Contained</Button>
</ButtonGroup>

<ButtonGroup variant="outlined">
  <Button>Outlined</Button>
  <Button>Outlined</Button>
</ButtonGroup>

<ButtonGroup variant="text">
  <Button>Text</Button>
  <Button>Text</Button>
</ButtonGroup>
```

✔ **Use Cases**:

- `contained`: Primary actions that need emphasis.
- `outlined`: Secondary actions or less prominent buttons.
- `text`: Minimal styling for subtle actions.

---

### 🔹 **2. `color` (Button Colors)**

Defines the color of all buttons in the group.

```jsx
<ButtonGroup color="primary">
  <Button>Primary</Button>
  <Button>Primary</Button>
</ButtonGroup>

<ButtonGroup color="secondary">
  <Button>Secondary</Button>
  <Button>Secondary</Button>
</ButtonGroup>

<ButtonGroup color="success">
  <Button>Success</Button>
  <Button>Success</Button>
</ButtonGroup>
```

✔ **Use Cases**:

- `primary`: Main actions.
- `secondary`: Less important buttons.
- `success`, `error`, `warning`, `info`: Used based on context (e.g., Save, Delete, Alerts).

---

### 🔹 **3. `size` (Button Size)**

Sets the size of the buttons.

```jsx
<ButtonGroup size="small">
  <Button>Small</Button>
  <Button>Small</Button>
</ButtonGroup>

<ButtonGroup size="medium">
  <Button>Medium</Button>
  <Button>Medium</Button>
</ButtonGroup>

<ButtonGroup size="large">
  <Button>Large</Button>
  <Button>Large</Button>
</ButtonGroup>
```

✔ **Use Cases**:

- `small`: Compact UIs or mobile screens.
- `medium`: Default size.
- `large`: Important actions that need visibility.

---

### 🔹 **4. `orientation` (Horizontal or Vertical)**

Defines the direction of the button group.

```jsx
<ButtonGroup orientation="horizontal">
  <Button>One</Button>
  <Button>Two</Button>
  <Button>Three</Button>
</ButtonGroup>

<ButtonGroup orientation="vertical">
  <Button>One</Button>
  <Button>Two</Button>
  <Button>Three</Button>
</ButtonGroup>
```

✔ **Use Cases**:

- `horizontal`: Default layout for most cases.
- `vertical`: When grouping buttons in sidebars or menus.

---

### 🔹 **5. `fullWidth` (Expanding Button Group)**

Expands the button group to fit the container.

```jsx
<ButtonGroup fullWidth>
  <Button>Left</Button>
  <Button>Center</Button>
  <Button>Right</Button>
</ButtonGroup>
```

✔ **Use Cases**:

- Use `fullWidth` for navigation bars, toolbars, or mobile designs.

---

### 🔹 **6. `disabled` (Disabling All Buttons)**

Disables interaction for all buttons inside the group.

```jsx
<ButtonGroup disabled>
  <Button>Disabled</Button>
  <Button>Disabled</Button>
</ButtonGroup>
```

✔ **Use Cases**:

- When an action is unavailable until the user completes a task.

---

### 🔹 **7. `disableElevation` (Removing Shadows)**

Removes the shadow effect from buttons.

```jsx
<ButtonGroup disableElevation>
  <Button>Flat</Button>
  <Button>Flat</Button>
</ButtonGroup>
```

✔ **Use Cases**:

- For a modern, flat UI look.

---

### 🔹 **8. `disableRipple` (Removing Click Effect)**

Prevents the ripple animation when buttons are clicked.

```jsx
<ButtonGroup disableRipple>
  <Button>No Ripple</Button>
  <Button>No Ripple</Button>
</ButtonGroup>
```

✔ **Use Cases**:

- When a smooth interaction is preferred over Material UI’s default ripple effect.

---

## 🎯 Final Example: Fully Styled ButtonGroup

```jsx
<ButtonGroup variant="contained" color="secondary" size="large" orientation="horizontal" fullWidth>
  <Button>Option 1</Button>
  <Button>Option 2</Button>
  <Button>Option 3</Button>
</ButtonGroup>
```

✔ **This example:**

- Uses `contained` buttons.
- Has `secondary` color.
- Is `large` in size.
- Is `horizontal` and `fullWidth`.

---

## 🎉 Conclusion

Material UI `ButtonGroup` **helps organize multiple buttons** into a structured layout.  
It allows easy **customization of styles, colors, sizes, and orientation**.

✔ **Use `variant` to define button styles.**  
✔ **Change `color` based on importance.**  
✔ **Adjust `size` for responsiveness.**  
✔ **Use `orientation` for horizontal or vertical alignment.**  
✔ **Enable `fullWidth` for expanded layouts.**  
✔ **Disable buttons when actions are unavailable.**

🚀 **Start using ButtonGroup to create better UI experiences!**
