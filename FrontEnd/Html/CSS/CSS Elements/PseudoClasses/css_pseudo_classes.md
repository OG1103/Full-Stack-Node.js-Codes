# CSS Pseudo-Classes (Complete Guide)

CSS **pseudo-classes** are special keywords added to selectors that **style elements based on their state or position**.

They allow you to apply styles **dynamically**, such as when an element is hovered, selected, focused, or based on its position within a parent.

---

## ✅ 1. Syntax of Pseudo-Classes
```css
selector:pseudo-class {
    /* CSS styles */
}
```
Example:
```css
button:hover {
    background-color: blue;
}
```
This changes the background color **only when hovered**.

---

## ✅ 2. Interaction-Based Pseudo-Classes

### 🔹 `:hover` (When the user hovers over an element)
Applies styles when **hovering over an element**.
```css
button:hover {
    background-color: yellow;
    color: black;
}
```
✅ **Use Case:** Styling buttons or links on hover.

---

### 🔹 `:active` (When the element is clicked)
Applies styles **only while clicking** (mouse is held down).
```css
button:active {
    background-color: red;
}
```
✅ **Use Case:** Indicating a button press.

---

### 🔹 `:focus` (When the element is focused)
Applies styles **when an element is selected**, such as clicking or tabbing into an input.
```css
input:focus {
    border: 2px solid green;
    outline: none;
}
```
✅ **Use Case:** Highlighting form fields when selected.

---

## ✅ 3. Child & Position-Based Pseudo-Classes

### 🔹 `:first-child` (Selects the first child of a parent)
```css
.container p:first-child {
    font-weight: bold;
}
```
✅ **Use Case:** Styling the first paragraph differently.

---

### 🔹 `:last-child` (Selects the last child of a parent)
```css
ul li:last-child {
    color: red;
}
```
✅ **Use Case:** Styling the last item in a list.

---

### 🔹 `:nth-child(n)` (Selects specific child elements)
```css
table tr:nth-child(even) {
    background-color: lightgray;
}
```
✅ **Use Case:** Styling **every even row** in a table.

🔸 **Other Examples:**
```css
div:nth-child(3) { color: blue; } /* Styles the 3rd child */
div:nth-child(odd) { color: gray; } /* Styles all odd children */
```

---

### 🔹 `:nth-of-type(n)` (Selects specific elements of a type)
```css
.container p:nth-of-type(3) {
    font-style: italic;
}
```
✅ **Use Case:** Styling **only the 3rd paragraph**, ignoring other element types.

---

### 🔹 `:not(selector)` (Excludes elements from selection)
```css
button:not(.special) {
    background-color: gray;
}
```
✅ **Use Case:** Styling **all buttons except** those with `.special` class.

---

## ✅ 4. Form-Based Pseudo-Classes

### 🔹 `:checked` (Styles checked checkboxes or radio buttons)
```css
input[type="checkbox"]:checked {
    background-color: green;
}
```
✅ **Use Case:** Custom checkbox styling.

---

### 🔹 `:disabled` (Styles disabled form inputs)
```css
input:disabled {
    background-color: lightgray;
    color: gray;
}
```
✅ **Use Case:** Indicating an input is disabled.

---

## 🎯 Final Example:
```css
button:hover {
    background-color: yellow;
}

input:focus {
    border: 2px solid blue;
}

li:nth-child(even) {
    color: gray;
}
```

---

## 🎉 Conclusion:
CSS pseudo-classes are **powerful tools** for **dynamic styling**.  
They enable **responsive interactions** and **customized layouts** without extra JavaScript!

