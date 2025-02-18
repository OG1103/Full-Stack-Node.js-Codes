# **Material UI `sx` Prop: Styling Using Theme Values**

Material UI's `sx` prop provides a **powerful way to style components** while leveraging the **theme's values**. Instead of hardcoding styles, you can **use theme properties dynamically** for consistency, responsiveness, and better maintainability.

---

## ✅ **1. Basic Usage of `sx` with Theme Values**
Instead of hardcoding pixel values (`px`), we can use **theme-based values** for better scalability.

### **🔹 Example: Basic Theme-Based Styling**
```tsx
<Box sx={{ bgcolor: "primary.main", color: "white", p: 2, borderRadius: 2 }}>
  Themed Box
</Box>
```
✔ **Uses `theme.palette.primary.main` for background color**  
✔ **Uses `theme.spacing(2)` for padding (`2 * 8px = 16px`)**  
✔ **Uses `theme.shape.borderRadius * 2` for rounded corners**  

---

## ✅ **2. `width` and `height`: Using Theme-Based Values**

### **🔹 Different Ways to Set Width and Height**
```tsx
<Box sx={{ width: [0, 1] }}> {/* Interpreted as 0% → 100% */} </Box>
<Box sx={{ width: 50 }}> {/* Interpreted as 50px */} </Box>
<Box sx={{ width: "25rem" }}> {/* 25rem (relative to root font size) */} </Box>
<Box sx={{ maxWidth: "md" }}> {/* Uses `theme.breakpoints.values.md` */} </Box>
```

✔ **`[0, 1]` → Interpreted as `0% → 100%`**  
✔ **Numeric values (`width: 50`) → Interpreted as pixels (`50px`)**  
✔ **String values (`"25rem"`) → Directly applied**  
✔ **Breakpoints (`maxWidth: "md"`) → Uses `theme.breakpoints.values.md`**  

---

## ✅ **3. Colors: Using Theme Palette**

Instead of hardcoding colors, **use `theme.palette` dynamically**.

### **🔹 Example: Themed Colors**
```tsx
<Box sx={{ color: "primary.main", bgcolor: "secondary.light" }}>Themed Colors</Box>
```

| **Shorthand** | **Expands to** |
|--------------|----------------|
| `"primary.main"` | `theme.palette.primary.main` |
| `"secondary.light"` | `theme.palette.secondary.light` |
| `"text.primary"` | `theme.palette.text.primary` |
| `"background.default"` | `theme.palette.background.default` |

✔ Keeps color styles **consistent** across the app.  

---

## ✅ **4. Typography: Using Theme Typography Styles**

Material UI allows **directly referencing theme typography styles**.

### **🔹 Example: Using Theme Typography**

```tsx
<Typography sx={{ typography: "h1" }}>
  This text uses theme's `h1` styles
</Typography>
```

✔ **`typography: "h1"` applies `theme.typography.h1` (fontSize, fontWeight, etc.)**  
✔ Works for `h1`, `h2`, `body1`, `button`, `caption`, etc.

| **Shorthand** | **Expands to** |
|--------------|----------------|
| `"h1"` | `theme.typography.h1` (includes fontSize, fontWeight, lineHeight, etc.) |
| `"h2.fontSize"` | `theme.typography.h2.fontSize` |
| `"body1"` | `theme.typography.body1` |
| `"button"` | `theme.typography.button` |

---

## ✅ **5. Border Radius: Using Theme Values**

Instead of hardcoding `border-radius`, use **theme-based values**.

### **🔹 Example: Themed Border Radius**
```tsx
<Box sx={{ borderRadius: 1 }}> {/* Uses `theme.shape.borderRadius * 1` */} </Box>
<Box sx={{ borderRadius: 2 }}> {/* Uses `theme.shape.borderRadius * 2` */} </Box>
```

✔ **Keeps border-radius consistent across UI elements**  
✔ **Scales dynamically based on theme settings**  

---

## ✅ **6. Box Shadows: Using Theme Shadows**

Material UI provides **default shadow values** in `theme.shadows`, which can be referenced by numbers.

### **🔹 Example: Using Box Shadows**
```tsx
<Box sx={{ boxShadow: 1 }}> {/* Uses `theme.shadows[1]` */} </Box>
<Box sx={{ boxShadow: 10 }}> {/* Uses `theme.shadows[10]` */} </Box>
```

✔ **Uses Material UI’s predefined shadow system (`1 - 24`)**  
✔ **Provides a consistent shadow effect across components**  

---

## ✅ **7. zIndex: Using Theme Z-Index Values**

Material UI provides predefined `z-index` values for **layers like modals, tooltips, and drawers**.

### **🔹 Example: Using Theme-Based `zIndex`**
```tsx
<Box sx={{ zIndex: "modal" }}> {/* Uses `theme.zIndex.modal` */} </Box>
<Box sx={{ zIndex: "tooltip" }}> {/* Uses `theme.zIndex.tooltip` */} </Box>
```

| **Shorthand** | **Expands to** |
|--------------|----------------|
| `"modal"` | `theme.zIndex.modal` |
| `"tooltip"` | `theme.zIndex.tooltip` |
| `"drawer"` | `theme.zIndex.drawer` |

✔ **Ensures consistent stacking order for UI elements**  

---

## ✅ **8. Spacing: Using Theme-Based Values**

Spacing in Material UI follows an **8px scale** (`theme.spacing(n) = n * 8px`).

### **🔹 Example: Themed Spacing**
```tsx
<Box sx={{ p: 2 }}> {/* padding = 2 * 8px = 16px */} </Box>
<Box sx={{ m: 3 }}> {/* margin = 3 * 8px = 24px */} </Box>
```

✔ **Keeps spacing consistent**  
✔ **Easier to adjust across the app**  

---

## ✅ **9. Breakpoints: Responsive Design with Theme Values**

Instead of hardcoding breakpoints, use **theme breakpoints dynamically by adding an object and define bvreakpoint and assign a value** .

### **🔹 Example: Responsive Styles**
```tsx
<Box sx={{ fontSize: { xs: "16px", md: "24px" } }}>Responsive Font</Box>
```

✔ **`xs` applies when screen width <600px**  
✔ **`md` applies when screen width is ≥960px**  

| **Breakpoint** | **Applies When Width Is**  |
| -------------- | -------------------------- |
| `xs`           | `<600px` (Mobile)          |
| `sm`           | `600px-960px` (Tablets)    |
| `md`           | `960px-1280px` (Laptops)   |
| `lg`           | `1280px-1920px` (Desktops) |
| `xl`           | `>1920px` (Large Screens)  |

---

## 🎯 **Final Summary**

✔ **Use theme values for consistent, scalable styles**  
✔ **Palette colors:** `"primary.main"`, `"text.primary"`  
✔ **Typography:** `"h1"`, `"body1"`  
✔ **Spacing:** `p: 2`, `m: 3` (multiplied by 8px)  
✔ **Border Radius:** `borderRadius: 2` (`theme.shape.borderRadius * 2`)  
✔ **Box Shadows:** `boxShadow: 1-24` (`theme.shadows[1]`)  
✔ **Breakpoints:** `{ xs: "16px", md: "24px" }` for responsive design  

🚀 **Mastering theme-based styling will make your Material UI app more efficient and consistent!**  


