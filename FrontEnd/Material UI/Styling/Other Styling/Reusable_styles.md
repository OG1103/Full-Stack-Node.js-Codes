# **Material UI: Reusable Styles (Complete Guide)**

Material UI (MUI) provides multiple ways to create **reusable styles**, ensuring **consistency, scalability, and maintainability** in a React project. This guide covers **all approaches**, including `sx`, `styled` API, `makeStyles`, and exporting reusable styles as components.

---

## ✅ **1. Using `sx` for Reusable Styles**
The `sx` prop allows inline styling with **theme awareness**, but for reusability, we can extract styles into an object and reuse them.

### **🔹 Example: Reusable `sx` Styles in an Object**
```tsx
const boxStyles = {
  bgcolor: "primary.main",
  color: "white",
  padding: 2,
  borderRadius: 2,
};

<Box sx={boxStyles}>Reusable Styled Box</Box>
```

✔ **Extracts styles into an object for reuse**  
✔ **Can be used across multiple components**  

### **🔹 Example: Passing Props to `sx` Styles**
```tsx
const getButtonStyles = (isActive) => ({
  bgcolor: isActive ? "success.main" : "error.main",
  color: "white",
  padding: "10px 20px",
  borderRadius: 2,
});

const MyComponent = () => {
  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <Button
      sx={[
        getButtonStyles(isActive),
        { fontSize: "16px", textTransform: "none" },
        isDisabled && { opacity: 0.5, pointerEvents: "none" }
      ]}
      onClick={() => setIsActive(!isActive)}
      disabled={isDisabled}
    >
      {isActive ? "Active" : "Inactive"}
    </Button>
  );
};
```

✔ **Dynamic styles using functions**  
✔ **Reusable across different buttons**  

---

## ✅ **2. Using `styled()` API for Reusable Components**
MUI provides the `styled()` API to create **fully reusable styled components**.
Doesn't take shortcuts as shortcuts only apply to the sx properity. 

### **🔹 Example: Creating a Styled Button**
```tsx
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const CustomButton = styled(Button)({
  backgroundColor: "primary.main",
  color: "white",
  padding: "10px 20px",
  borderRadius: "8px",
  "&:hover": { backgroundColor: "secondary.main" },
});

export default CustomButton;
```

### **🔹 Usage in Components**
```tsx
<CustomButton>Styled Reusable Button</CustomButton>
```

✔ **Creates a fully reusable component**  
✔ **Can be used like any other component (`<CustomButton />`)**  
✔ **Includes pseudo-classes (`&:hover`) for better styling**  

---

## ✅ **3. Using `styled()` with Dynamic Props**
`styled()` also supports **props-based dynamic styles**.

### **🔹 Example: Passing Props to `styled()` Component**
```tsx
const CustomBox = styled(Box)(({ theme, isActive }) => ({
  backgroundColor: isActive ? theme.palette.success.main : theme.palette.error.main,
  color: "white",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
}));

<CustomBox isActive={true}>Active State</CustomBox>
<CustomBox isActive={false}>Inactive State</CustomBox>
```

✔ **Uses `theme` dynamically**  
✔ **Conditional styles based on `isActive` prop**  

---

## ✅ **4. Using `makeStyles` (Legacy, But Still Useful)**
While `makeStyles` is part of MUI's **legacy styling system**, some projects still use it.

### **🔹 Example: Creating Reusable Styles with `makeStyles`**
```tsx
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
  },
}));

const StyledCard = () => {
  const classes = useStyles();
  return <div className={classes.card}>Reusable Card</div>;
};
```

✔ **Uses a `useStyles` hook for styling**  
✔ **Can be applied via `className`**  

**⚠️ `makeStyles` is deprecated in MUI v5. Prefer `styled()` or `sx`.**  

---

## ✅ **5. Exporting Reusable Styles in a Separate File**
For better maintainability, **styles can be stored in a separate file**.

### **🔹 Example: Creating a `styles.js` File**
```tsx
// styles.js
export const cardStyles = {
  padding: 2,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 3,
};
```

### **🔹 Usage in a Component**
```tsx
import { cardStyles } from "./styles";

<Box sx={cardStyles}>Styled Card</Box>
```

✔ **Keeps styles separate from component logic**  
✔ **Encourages reusability across multiple files**  

---

## ✅ **6. Using Theme for Global Styles**
MUI allows defining **global reusable styles** inside the **theme configuration**.

### **🔹 Example: Adding Global Styles in `theme.js`**
```tsx
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Disable uppercase text for all buttons
          borderRadius: 8, // Apply rounded corners to all buttons
        },
      },
    },
  },
});
```

### **🔹 Applying Theme Globally**
```tsx
<ThemeProvider theme={theme}>
  <Button>Styled by Theme</Button>
</ThemeProvider>
```

✔ **Applies styles globally without inline styles**  
✔ **Great for enforcing design consistency**  

---

## **🎯 Summary**
✔ **Use `sx` for quick reusable styles**  
✔ **Use `styled()` to create fully reusable styled components**  
✔ **Use `makeStyles` only for legacy projects**  
✔ **Store styles in a separate file (`styles.js`) for modularity**  
✔ **Use MUI’s `ThemeProvider` for global styles**  

🚀 **Following these patterns will make your Material UI styling reusable, scalable, and maintainable!**  
