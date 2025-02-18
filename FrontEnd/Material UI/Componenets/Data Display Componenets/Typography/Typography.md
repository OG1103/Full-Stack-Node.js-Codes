# Material UI Typography (Complete Guide)

**Typography** in Material UI (MUI) provides a way to control text styling in a **consistent, responsive, and scalable** manner. It follows Google's **Material Design** principles and offers pre-defined typography variants.

---

## ✅ 1. Typography Props Overview

Here’s a complete list of props that the MUI `Typography` component supports:

| Prop Name | Type | Description |
|-----------|------|-------------|
| `variant` | `"h1"`, `"h2"`, `"h3"`, `"body1"`, `"caption"`, etc. | Defines the text style. |
| `component` | `React.ElementType` | Renders as a different HTML element (`p`, `span`, `h1`, etc.). |
| `color` | `"primary"`, `"secondary"`, `"textPrimary"`, `"textSecondary"`, `"error"` | Sets text color. |
| `align` | `"left"`, `"center"`, `"right"`, `"justify"` | Controls text alignment. |
| `gutterBottom` | `boolean` | Adds bottom margin for spacing. |
| `paragraph` | `boolean` | Makes the text behave as a paragraph (`<p>`). |
| `noWrap` | `boolean` | Prevents text from wrapping to a new line. |
| `fontWeight` | `"light"`, `"regular"`, `"medium"`, `"bold"` | Adjusts text weight. |
| `fontSize` | `string` or `number` | Customizes font size. |
| `lineHeight` | `string` or `number` | Adjusts spacing between lines. |
| `sx` | `object` | Allows custom styling using the theme system. |

---

## ✅ 2. What is Typography in Material UI?

- It controls **font styles, sizes, weights, alignments, and spacing**.
- It uses **predefined variants** like `"h1"`, `"h2"`, `"body1"`, `"caption"`, etc.
- It supports **custom theming and responsive scaling**.

```jsx
import Typography from '@mui/material/Typography';

<Typography variant="h1">Hello, World!</Typography>
```

🔹 **MUI Typography ensures consistency across the application**.

---

## ✅ 3. Installing Material UI Typography

If you haven't installed Material UI yet, install it using:

```bash
npm install @mui/material @emotion/react @emotion/styled
```

---

## ✅ 4. Typography Variants

Material UI provides **predefined typography variants** for different text styles.

### 🔹 Default Variants

| Variant  | Font Size | Weight | Example |
|----------|-----------|--------|---------|
| `h1`     | 96px      | Light  | Largest heading |
| `h2`     | 60px      | Light  | Large heading |
| `h3`     | 48px      | Regular | Medium heading |
| `h4`     | 34px      | Regular | Small heading |
| `h5`     | 24px      | Regular | Subtitle heading |
| `h6`     | 20px      | Medium | Small subtitle |
| `subtitle1` | 16px | Regular | Subtitle text |
| `subtitle2` | 14px | Medium | Smaller subtitle |
| `body1`  | 16px      | Regular | Default paragraph text |
| `body2`  | 14px      | Regular | Smaller paragraph text |
| `button` | 14px      | Medium | Button text |
| `caption` | 12px | Regular | Small text |
| `overline` | 10px | Regular | Uppercase label text |

```jsx
<Typography variant="h1">This is Heading 1</Typography>
<Typography variant="body1">This is body text</Typography>
```

🔹 **Use predefined variants instead of manually setting font styles**.

---

## ✅ 5. Customizing Typography

You can **override default styles**:

```jsx
<Typography variant="h4" color="primary" fontWeight="bold">
  Custom Styled Text
</Typography>
```

### 🔹 Customizing Font Size and Weight
```jsx
<Typography fontSize={24} fontWeight="bold">
  Custom Font Size and Bold Text
</Typography>
```

### 🔹 Changing Text Alignment
```jsx
<Typography align="center">Centered Text</Typography>
<Typography align="right">Right Aligned</Typography>
```

🔹 **Alignment values**: `"left"`, `"center"`, `"right"`, `"justify"`.

---

## ✅ 6. Responsive Typography

Typography can be **responsive** by using `variantMapping`.

```jsx
<Typography variant="h2" sx={{ fontSize: { xs: "24px", md: "48px" } }}>
  Responsive Heading
</Typography>
```

🔹 **Font size changes dynamically** based on screen size (`xs`, `md`, etc.).

---

## ✅ 7. Custom Typography Theming

Modify typography globally using **MUI Theme**.

```jsx
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h1: {
      fontSize: "3rem",
      fontWeight: "bold",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
  },
});

const MyApp = () => (
  <ThemeProvider theme={theme}>
    <Typography variant="h1">Custom Themed Typography</Typography>
  </ThemeProvider>
);
```

🔹 **This sets global typography styles for the app**.

---

## ✅ 8. Styling Text with `sx` Prop

Material UI allows **inline styling** using the `sx` prop.

```jsx
<Typography sx={{ fontSize: "20px", color: "blue", fontWeight: "bold" }}>
  Styled Text
</Typography>
```

🔹 **The `sx` prop makes customization easier**.

---

## 🎯 Final Example

```jsx
<Typography variant="h3" color="primary" align="center" fontWeight="bold">
  Styled Typography
</Typography>

<Typography variant="body1" sx={{ fontSize: "18px", lineHeight: 1.5 }}>
  This is a paragraph with custom line height.
</Typography>
```

---

## 🎉 Conclusion

Material UI Typography **simplifies text styling** in React apps.  
It provides **predefined variants**, **responsive scaling**, **global theming**, and **easy customization**.

✔ **Use predefined typography variants** (`h1`, `body1`, `caption`, etc.).  
✔ **Apply text alignment, transformations, and custom styles**.  
✔ **Use `sx` for quick inline styling**.  
✔ **Leverage `ThemeProvider` for global font customization**.  

**🚀 Start using Material UI Typography to improve your UI!**
