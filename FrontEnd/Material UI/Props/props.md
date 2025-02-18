# Material UI Component Props (Complete Guide)

Material UI (MUI) provides **various props** that can be **nested within components** to customize their behavior, appearance, and responsiveness.

These props **simplify component customization** and **enhance flexibility**.

---

## ✅ 1. What are MUI Props?

MUI components accept **multiple props** that control their **styling, behavior, and responsiveness**.

For example:
```jsx
<Button variant="contained" color="primary" size="large">
  Click Me
</Button>
```
🔹 **`variant`**, **`color`**, and **`size`** are props that modify the button.

---

## ✅ 2. Common MUI Props

### 🔹 **1. `sx` (Style Prop)**
The **`sx` prop** is a powerful way to apply inline styles **with full theme support**.

```jsx
<Button sx={{ bgcolor: "primary.main", color: "white", p: 2 }}>
  Styled Button
</Button>
```

🔸 **Why Use `sx` Instead of `style`?**  
✔ Supports **responsive values** (breakpoints).  
✔ Uses **theme-aware properties** (e.g., `"primary.main"`).  
✔ Supports **shorthand values** (e.g., `p: 2` instead of `padding: 8px`).  

#### 🔹 **2. `variant` (Defines UI Style)**
Controls the **style** of the component.

| Value        | Description |
|-------------|------------|
| `"text"`     | No background, just text. |
| `"contained"` | Solid background. |
| `"outlined"`  | Transparent background with a border. |

Example:
```jsx
<Button variant="contained">Contained Button</Button>
<Button variant="outlined">Outlined Button</Button>
<Button variant="text">Text Button</Button>
```

---

## ✅ 3. Button Props

### 🔹 **Common Button Props**
| Prop       | Description |
|------------|------------|
| `variant`  | Defines the button style (`contained`, `outlined`, `text`). |
| `color`    | Changes the button color (`primary`, `secondary`, etc.). |
| `size`     | Adjusts button size (`small`, `medium`, `large`). |
| `disabled` | Disables the button (`true` / `false`). |
| `fullWidth` | Makes the button take full width. |

Example:
```jsx
<Button color="secondary" size="large" fullWidth disabled>
  Disabled Button
</Button>
```

---

## ✅ 4. Typography Props

| Prop        | Description |
|-------------|------------|
| `variant`   | Defines the text style (`h1`, `h2`, `body1`, etc.). |
| `align`     | Aligns text (`left`, `center`, `right`, `justify`). |
| `gutterBottom` | Adds margin below the text (`true` / `false`). |
| `noWrap`    | Prevents text from wrapping (`true` / `false`). |

Example:
```jsx
<Typography variant="h3" align="center" gutterBottom>
  Centered Heading
</Typography>
```

---

## ✅ 5. Grid Props

Material UI uses a **flexbox-based grid system**.

| Prop      | Description |
|-----------|------------|
| `container` | Defines a grid container. |
| `item`     | Defines a grid item. |
| `xs`, `sm`, `md`, `lg`, `xl` | Specifies column width for each breakpoint. |
| `spacing`  | Controls the gap between grid items. |

Example:
```jsx
<Grid container spacing={2}>
  <Grid item xs={12} sm={6}>
    <Paper>Half width on small screens</Paper>
  </Grid>
</Grid>
```

---

## ✅ 6. Box Component Props

The **Box** component is a **flexible container** for styling and layout.

| Prop        | Description |
|-------------|------------|
| `component` | Defines the HTML tag (`"div"`, `"span"`, `"section"`). |
| `display`   | Controls display (`"flex"`, `"block"`, `"none"`). |
| `padding` (`p`) | Sets padding (`p: 2` → `padding: 16px`). |
| `margin` (`m`) | Sets margin (`m: 2` → `margin: 16px`). |

Example:
```jsx
<Box component="section" display="flex" p={3} m={2}>
  Styled Box
</Box>
```

---

## ✅ 7. AppBar & Toolbar Props

| Prop        | Description |
|-------------|------------|
| `position`  | Sets position (`static`, `fixed`, `sticky`). |
| `color`     | Changes AppBar color (`primary`, `secondary`, `transparent`). |
| `elevation` | Adds shadow depth. |

Example:
```jsx
<AppBar position="sticky">
  <Toolbar>
    <Typography variant="h6">App Bar</Typography>
  </Toolbar>
</AppBar>
```

---

## ✅ 8. Responsive Props

Many MUI components support **responsive props**.

```jsx
<Typography fontSize={{ xs: "14px", sm: "18px", md: "24px" }}>
  Responsive Typography
</Typography>
```

🔹 **This automatically adjusts font size based on screen width**.

---

## ✅ 9. Using `sx` with Components

The `sx` prop allows **custom styles** with **theme integration**.

```jsx
<Button sx={{ bgcolor: "primary.main", "&:hover": { bgcolor: "secondary.main" } }}>
  Custom Styled Button
</Button>
```

🔹 **Supports hover effects & theme-aware colors**.

---

## 🎯 Final Example: Using Multiple Props

```jsx
<Grid container spacing={2}>
  <Grid item xs={12} sm={6}>
    <Typography variant="h4" align="center" gutterBottom>
      Responsive Typography
    </Typography>
  </Grid>
  
  <Grid item xs={12} sm={6}>
    <Button variant="contained" color="primary" fullWidth>
      Primary Button
    </Button>
  </Grid>
</Grid>
```

---

## 🎉 Conclusion

Material UI **component props** make it easy to **customize behavior, layout, and styles**.

✔ **`sx` for advanced styling**.  
✔ **Breakpoints for responsiveness**.  
✔ **Variant, color, and size for buttons**.  
✔ **Typography alignment and text control**.  
✔ **Grid layout for flexible positioning**.  

🚀 **Master these props to fully utilize Material UI!**

