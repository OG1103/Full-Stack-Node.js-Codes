# **Material UI `sx` Prop: Conditional Styling Guide**

Material UI's `sx` prop allows for **conditional styling**, enabling dynamic styles based on state, props, theme mode, or breakpoints. This guide covers all possible ways to apply **conditional styles** in `sx`, including using **ternary operators, logical operators (`&&`), objects, and arrays**.

---

## ✅ **1. Conditional Styling Using Ternary (`? :`)**
The **most common** approach is using the **ternary operator** to conditionally apply styles.

### **🔹 Example: Changing Background Color Based on Prop**
```tsx
<Box sx={{ bgcolor: isActive ? "primary.main" : "grey.300" }}>
  Conditional Box
</Box>
```
✔ **Applies `primary.main` if `isActive` is `true`, otherwise `grey.300`.**  

### **🔹 Example: Conditional Font Size**
```tsx
<Box sx={{ fontSize: isSmall ? "12px" : "16px" }}>
  Conditional Font Size
</Box>
```
✔ **Dynamically sets font size based on `isSmall`.**  

---

## ✅ **2. Conditional Styling Using Logical `&&` Operator**

The `&&` operator allows applying styles **only when a condition is true**.

### **🔹 Example: Apply Border Only If `isActive` is `true`**
```tsx
<Box sx={{ border: isActive && "2px solid red" }}>
  Border Applied Conditionally
</Box>
```
✔ **If `isActive` is `true`, applies a `2px solid red` border.**  
✔ **If `isActive` is `false`, no border is applied.**  

---

## ✅ **3. Conditional Styling Using Object Spread (`...`)**

Instead of writing long ternary conditions, you can use **object spread syntax (`...`)**.

### **🔹 Example: Conditionally Apply Extra Styles**
```tsx
<Box sx={{
  bgcolor: "grey.100",
  ...(isActive && { bgcolor: "primary.main", color: "white" }),
}}>
  Spread Conditional Styling
</Box>
```
✔ **If `isActive` is `true`, overrides the background to `primary.main` and text color to `white`.**  
✔ **If `isActive` is `false`, keeps `grey.100` as the background.**  

---

## ✅ **4. Conditional Styling Using Array of Objects (`[{}, {}]`)**

You can **stack styles conditionally** by using an **array of style objects**.

### **🔹 Example: Multiple Conditions Using an Array**
```tsx
<Box sx={[
  { fontSize: "16px", padding: 2 },
  isActive && { bgcolor: "primary.main", color: "white" },
  isDisabled && { opacity: 0.5, pointerEvents: "none" },
]}>
  Array-Based Conditional Styling
</Box>
```
✔ **Base styles (`fontSize`, `padding`) are always applied.**  
✔ **If `isActive`, background becomes `primary.main` and text `white`. while base styles of the first object still applied**  
✔ **If `isDisabled`, opacity is reduced, and pointer events are disabled.**  
-  Later objects in the array override previous ones if they share the same property.

---

## ✅ **5. Conditional Styling Based on Theme Mode (`light` / `dark`)**

You can dynamically change styles **based on theme mode**.

### **🔹 Example: Dark Mode Styling**
```tsx
import { useTheme } from "@mui/material/styles";

const theme = useTheme();

<Box sx={{ bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.100" }}>
  Theme-Based Conditional Styling
</Box>
```
✔ **Changes background color based on the theme mode.**  

---

## ✅ **6. Conditional Styling Using Functions in `sx`**

If styles are complex, use **a function inside `sx`**.

### **🔹 Example: Applying Styles Dynamically**
```tsx
<Box sx={(theme) => ({
  fontSize: theme.breakpoints.up("md") ? "24px" : "16px",
  bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.100",
})}>
  Function-Based Conditional Styling
</Box>
```
✔ **Larger font size on `md` screens and up.**  
✔ **Changes background color dynamically based on theme mode.**  

---

## 🎯 **Final Summary**

✔ **Ternary (`? :`) for inline conditions**  
✔ **Logical `&&` for applying styles when `true`**  
✔ **Object spread (`...`) for adding/removing styles**  
✔ **Array of objects (`[{}, {}]`) for stacking multiple conditions**  
✔ **Function in `sx` for complex dynamic styles**  
✔ **Theme-based conditional styling for light/dark mode**  

🚀 **Mastering conditional styling in `sx` makes Material UI components more dynamic and reusable!**  
