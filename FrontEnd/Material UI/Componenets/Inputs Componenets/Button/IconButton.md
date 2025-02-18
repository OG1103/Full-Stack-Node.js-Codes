# **Material UI IconButton (Complete Guide)**

The **IconButton** component in Material UI provides a way to render **clickable icons** that act as buttons. It is widely used for **UI controls**, **navigation**, and **action triggers**.

---

## ✅ 1. What is an IconButton?

- **Wraps an icon inside a button** for interaction.
- Provides **ripple effect**, **accessibility**, and **clickable icon functionality**.
- Supports **colors, sizes, and event handling**.

```jsx
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

<IconButton>
  <DeleteIcon />
</IconButton>
```

🔹 **It works like a button but only contains an icon.**

---

## ✅ 2. Installing Material UI Icons

To use icons in Material UI, install the MUI Icons package:

```bash
npm install @mui/icons-material
```

Then, **import icons** as needed:

```jsx
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
```

---

## ✅ 3. Basic Usage of IconButton

```jsx
<IconButton>
  <HomeIcon />
</IconButton>
```

🔹 This renders a **clickable home icon**.

---

## ✅ 4. IconButton Props

The `<IconButton>` component supports various props for customization.

| **Prop**        | **Description** |
|----------------|---------------|
| `color` | Changes the button color (`primary`, `secondary`, `error`, `inherit`). |
| `size` | Controls button size (`small`, `medium`, `large`). |
| `onClick` | Handles click events. |
| `disabled` | Disables the button. |
| `edge` | Adjusts spacing for placement (`start`, `end`). |
| `sx` | Allows custom styling. |

### 🔹 Example: Using Props

```jsx
<IconButton color="primary" size="large" onClick={() => alert("Clicked!")}>
  <DeleteIcon />
</IconButton>
```

---

## ✅ 5. Color Variants

```jsx
<IconButton color="primary"><HomeIcon /></IconButton>
<IconButton color="secondary"><HomeIcon /></IconButton>
<IconButton color="error"><HomeIcon /></IconButton>
<IconButton color="success"><HomeIcon /></IconButton>
<IconButton color="inherit"><HomeIcon /></IconButton>
```

🔹 Colors match **MUI theme primary and secondary colors**.

---

## ✅ 6. Changing IconButton Size

```jsx
<IconButton size="small"><HomeIcon /></IconButton>
<IconButton size="medium"><HomeIcon /></IconButton>
<IconButton size="large"><HomeIcon /></IconButton>
```

🔹 Default size is `"medium"`.

---

## ✅ 7. Disabling an IconButton

```jsx
<IconButton disabled>
  <DeleteIcon />
</IconButton>
```

🔹 This prevents user interaction.

---

## ✅ 8. Adding Tooltips to IconButtons

Use `Tooltip` to provide **extra context**:

```jsx
import Tooltip from '@mui/material/Tooltip';

<Tooltip title="Delete Item">
  <IconButton>
    <DeleteIcon />
  </IconButton>
</Tooltip>
```

🔹 **Tooltips help improve UX by showing extra information on hover.**

---

## ✅ 9. Handling Click Events

```jsx
<IconButton onClick={() => console.log("Icon clicked!")}>
  <HomeIcon />
</IconButton>
```

🔹 Click events allow executing **custom logic**.

---

## ✅ 10. Using `edge` Prop for Alignment

Used in **AppBar**, **Toolbar**, or **Navigation**:

```jsx
<IconButton edge="start">
  <HomeIcon />
</IconButton>
```

🔹 **Moves button to the start or end of a container.**

---

## ✅ 11. Styling IconButton with `sx`

Use the `sx` prop to add **custom styles**:

```jsx
<IconButton sx={{ color: "blue", backgroundColor: "lightgray", padding: "10px" }}>
  <HomeIcon />
</IconButton>
```

🔹 **Allows inline styles for quick customization.**

---

## 🎯 Final Example

```jsx
<Tooltip title="Home">
  <IconButton color="primary" size="large" onClick={() => alert("Home Clicked!")}>
    <HomeIcon />
  </IconButton>
</Tooltip>
```

---

## 🎉 Conclusion

Material UI's **IconButton** provides an elegant way to create **interactive icons**.

✔ **Use IconButton to wrap Material UI icons**.  
✔ **Apply colors, sizes, and event handlers for dynamic interactions**.  
✔ **Use Tooltips to improve usability**.  
✔ **Style with `sx` for customization**.  

🚀 **Enhance your UI by implementing IconButtons effectively!**
