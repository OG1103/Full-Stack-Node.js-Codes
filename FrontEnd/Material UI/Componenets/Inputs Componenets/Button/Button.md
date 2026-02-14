# Material UI Button Component (Complete Guide)

The **Button** component in Material UI (MUI) is a **highly customizable, responsive, and interactive** component used to trigger user actions.

Material UI buttons follow **Material Design principles** and support **variants, colors, sizes, icons, custom styles, and more**.

---

## ✅ 1. Installing Material UI Buttons

To use the **Button** component, install Material UI:

```bash
npm install @mui/material @emotion/react @emotion/styled
```

Import the Button component into your React file:

```jsx
import Button from '@mui/material/Button';
```

---

## ✅ 2. Basic Button Usage

```jsx
<Button variant="contained" color="primary">
  Click Me
</Button>
```

This creates a **primary button with a solid background**.

---

## ✅ 3. Button Variants

| Variant     | Description |
|------------|------------|
| `contained` | Filled button with a solid background. |
| `outlined`  | Transparent button with a border. |
| `text`      | A button with no background or border. |

if no variant is used it defaults to text

### 🔹 Example:

```jsx
<Button variant="contained">Contained</Button>
<Button variant="outlined">Outlined</Button>
<Button variant="text">Text</Button>
```

🔹 **Use `contained` for primary actions, `outlined` for secondary actions, and `text` for subtle interactions.**

---

## ✅ 4. Button Colors

Material UI provides **built-in color options**.

| Color       | Description |
|------------|------------|
| `primary`   | Uses the theme’s primary color. |
| `secondary` | Uses the theme’s secondary color. |
| `success`   | Green-themed button. |
| `error`     | Red-themed button (for errors/warnings). |
| `warning`   | Orange-themed button. |
| `info`      | Blue-themed button. |

### 🔹 Example:

```jsx
<Button color="primary">Primary</Button>
<Button color="secondary">Secondary</Button>
<Button color="success">Success</Button>
<Button color="error">Error</Button>
<Button color="warning">Warning</Button>
<Button color="info">Info</Button>
```

🔹 **You can override these colors using the `sx` prop.**

---

## ✅ 5. Button Sizes

| Size       | Description |
|------------|------------|
| `small`    | Small-sized button. |
| `medium` (default) | Normal-sized button. |
| `large`    | Large-sized button. |

### 🔹 Example:

```jsx
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>
```

🔹 **Use `large` for emphasis and `small` for compact designs.**

---

## ✅ 6. Full-Width Buttons

Make a button stretch **100% of its container**.

```jsx
<Button fullWidth>Full Width Button</Button>
```

---

## ✅ 7. Disabling Buttons

Use `disabled` to **prevent interaction**.

```jsx
<Button disabled>Disabled Button</Button>
```

🔹 **Useful for inactive states or loading indicators.**

---

## ✅ 8. Buttons with Icons

Material UI allows **icons inside buttons**.

```jsx
import DeleteIcon from '@mui/icons-material/Delete';

<Button startIcon={<DeleteIcon />}>Delete</Button>
<Button endIcon={<DeleteIcon />}>Delete</Button>
```

🔹 **Use `startIcon` or `endIcon` to place an icon inside the button.**

---

## ✅ 9. Button Click Events

Buttons support `onClick` handlers.

```jsx
<Button onClick={() => alert("Button clicked!")}>
  Click Me
</Button>
```

🔹 **Useful for handling user interactions.**

---

## ✅ 10. Styling Buttons with `sx`

You can customize button styles using the `sx` prop.

```jsx
<Button sx={{ bgcolor: "purple", color: "white", "&:hover": { bgcolor: "darkpurple" } }}>
  Custom Button
</Button>
```

🔹 **This applies a custom background and hover effect.**

---

## ✅ 11. Button Props

Here’s a complete list of props that the MUI `Button` component supports:

| Prop Name | Type | Description |
|-----------|------|-------------|
| `variant` | `"text"`, `"contained"`, `"outlined"` | Defines the button style. |
| `color` | `"primary"`, `"secondary"`, `"success"`, `"error"`, `"warning"`, `"info"` | Sets the button color. |
| `size` | `"small"`, `"medium"`, `"large"` | Controls button size. |
| `fullWidth` | `boolean` | Expands button to full width of container. |
| `disabled` | `boolean` | Disables button interaction. |
| `onClick` | `function` | Handles click events. |
| `startIcon` | `ReactNode` | Places an icon before the button text. |
| `endIcon` | `ReactNode` | Places an icon after the button text. |
| `disableElevation` | `boolean` | `false` | Removes the shadow effect on buttons. |
| `disableRipple` | `boolean` | `false` | Disables the ripple effect on buttons. |
| `sx` | `object` | Allows custom styling using the theme system. |
| `href` | `string` | Converts the button into a link. |
| `component` | `React.ElementType` | Allows rendering a different component (e.g., `Link`). |

- We can set componenet to a tag and add a link in the href or in react apply link tag in componenet (component={Link} to="/dashboard")
---

## 🎯 Final Example: Fully Responsive & Themed Buttons

```jsx
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    <Button variant="contained" color="primary" fullWidth>
      Primary Button
    </Button>
  </Grid>

  <Grid item xs={12} sm={6} md={4}>
    <Button variant="outlined" color="secondary" startIcon={<DeleteIcon />}>
      Delete
    </Button>
  </Grid>
</Grid>
```

🔹 **This example combines responsiveness, icons, and variants.**

---

## 🎉 Conclusion

Material UI **buttons** are **highly customizable** and support:

✔ **Variants** (`contained`, `outlined`, `text`).  
✔ **Colors** (`primary`, `secondary`, `success`, etc.).  
✔ **Sizes** (`small`, `medium`, `large`).  
✔ **Full-width, disabled, and loading states**.  
✔ **Icons, event handlers, and grouping**.  
✔ **Fully responsive styling with `sx` and breakpoints**.  

🚀 **Start using Material UI Buttons to build beautiful, functional interfaces!**
