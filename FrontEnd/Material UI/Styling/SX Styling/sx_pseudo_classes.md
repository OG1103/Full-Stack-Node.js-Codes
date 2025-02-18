# **Material UI `sx` Prop: Pseudo-classes, Selectors & Symbols Guide**

Material UI’s `sx` prop provides a powerful way to apply **pseudo-classes** (like `:hover`, `:focus`, `:active`), **CSS selectors** (like `>`, `+`, `:nth-child`), and **special symbols (`&`, `*`, etc.)**. This guide covers **all cases** with detailed explanations and examples.

---

## ✅ **1. Understanding `&` (Self-reference Selector)**
The `&` symbol in `sx` **represents the current component** and is used to apply **pseudo-classes and nested selectors**.

### **🔹 Example: Changing Background on Hover (`&:hover`)**
```tsx
<Button sx={{ bgcolor: "primary.main", "&:hover": { bgcolor: "secondary.main" } }}>
  Hover Me
</Button>
```
✔ **By default**, background color is `primary.main`  
✔ **On hover (`&:hover`)**, background changes to `secondary.main`  

---

## ✅ **2. Common Pseudo-classes (`:hover`, `:focus`, `:active`, `:disabled`)**

| **Pseudo-class** | **Description** |
|-----------------|---------------|
| `&:hover` | Applies styles when the element is hovered |
| `&:focus` | Styles when the element gains keyboard focus |
| `&:active` | Styles when the element is clicked/tapped |
| `&:disabled` | Styles when the element is disabled |

### **🔹 Example: Using Multiple Pseudo-classes**
```tsx
<Button sx={{
  bgcolor: "primary.main",
  "&:hover": { bgcolor: "secondary.main" },
  "&:focus": { outline: "2px solid red" },
  "&:active": { transform: "scale(0.95)" },
  "&:disabled": { bgcolor: "grey.400", color: "white" }
}}>
  Interactive Button
</Button>
```
✔ **`&:hover`** → Changes background on hover  
✔ **`&:focus`** → Adds a red outline when focused  
✔ **`&:active`** → Shrinks the button when clicked  
✔ **`&:disabled`** → Changes the button's color if disabled  

---

## ✅ **3. Using `:nth-child()`, `:first-child`, `:last-child`**

### **🔹 Example: Styling Even and Odd List Items**
```tsx
<List>
  <ListItem sx={{ "&:nth-child(odd)": { bgcolor: "grey.200" } }}>
    Odd Item (Grey Background)
  </ListItem>
  <ListItem sx={{ "&:nth-child(even)": { bgcolor: "grey.300" } }}>
    Even Item (Darker Grey Background)
  </ListItem>
</List>
```
✔ **Alternates row colors for better readability**  

---

## ✅ **4. Parent-Child Selectors (`>`, `+`, `~`)**

| **Selector** | **Description** |
|-------------|---------------|
| `& > child` | Targets **direct children** |
| `& + sibling` | Targets **adjacent sibling** |
| `& ~ sibling` | Targets **all next siblings** |

### **🔹 Example: Styling First-Level Children (`& >`)**
```tsx
<Box sx={{ "& > p": { color: "blue", fontWeight: "bold" } }}>
  <p>Styled Paragraph</p>  {/* This will be blue and bold */}
  <div>
    <p>Not Styled (Nested)</p>  {/* Not affected */}
  </div>
</Box>
```
✔ **Only direct `<p>` children inside `<Box>` are affected**  

### **🔹 Example: Styling Adjacent Sibling (`& + sibling`)**
```tsx
<Box>
  <Typography sx={{ "& + p": { color: "red" } }}>Heading</Typography>
  <p>Styled Adjacent Paragraph</p>  {/* This will be red */}
</Box>
```
✔ **Styles `<p>` only if it is directly after `<Typography>`**  

### **🔹 Example: Styling All Next Siblings (`& ~ sibling`)**
```tsx
<Box>
  <Typography sx={{ "& ~ p": { color: "red" } }}>Heading</Typography>
  <p>Red Paragraph 1</p>  {/* This will be red */}
  <p>Red Paragraph 2</p>  {/* This will also be red */}
</Box>
```
✔ **Styles all `<p>` elements that come after `<Typography>`**  

---

## ✅ **5. Targeting Child Elements (`& *`, `& p`, `& div` etc.)**

### **🔹 Example: Targeting All Children (`& *`)**
```tsx
<Box sx={{ "& *": { color: "blue" } }}>
  <p>Blue Text</p>
  <span>Blue Span</span>
</Box>
```
✔ **All child elements inside `<Box>` get blue text**  

### **🔹 Example: Targeting Specific Child Elements**
```tsx
<Box sx={{ "& p": { color: "blue" }, "& span": { fontWeight: "bold" } }}>
  <p>Blue Text</p>  {/* This will be blue */}
  <span>Bold Text</span>  {/* This will be bold */}
</Box>
```
✔ **Only `<p>` becomes blue, and only `<span>` becomes bold**  

---

## ✅ **6. Combining Multiple Pseudo-classes (`&:hover`, `&:focus`, etc.)**

### **🔹 Example: Styling Hover & Focus Together**
```tsx
<Button sx={{ "&:hover, &:focus": { bgcolor: "secondary.main", color: "white" } }}>
  Hover or Focus Me
</Button>
```
✔ **Applies the same style on both hover and focus**  

### **🔹 Example: Nested Pseudo-classes (`&:hover & > p`)**
```tsx
<Box sx={{ "&:hover > p": { color: "red" } }}>
  <p>Changes to red on hover</p>
</Box>
```
✔ **Changes only `<p>` inside `<Box>` when `<Box>` is hovered**  

---

## 🎯 **Final Summary**

✔ **Use `&` to apply pseudo-classes (`&:hover`, `&:focus`, etc.)**  
✔ **Use `& >` to style direct children**  
✔ **Use `& +` for adjacent siblings, `& ~` for all next siblings**  
✔ **Use `& *` to style all children**  
✔ **Use `&:nth-child()`, `&:first-child`, `&:last-child` for targeting positions**  
✔ **Combine pseudo-classes for complex interactions (`&:hover, &:focus`)**  

🚀 **Mastering these techniques will make your Material UI components more flexible and powerful!**  
