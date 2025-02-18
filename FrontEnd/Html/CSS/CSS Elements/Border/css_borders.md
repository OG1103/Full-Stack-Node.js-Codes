# CSS Borders (Complete Guide)

The `border` property in CSS allows you to add visual borders around elements. Borders can be used to define the edges of an element and separate sections of content.

---

## ✅ 1. Border Property Basics

The `border` shorthand property combines the following three properties:
- `border-width` (sets the width of the border)
- `border-style` (defines the style of the border)
- `border-color` (sets the color of the border)

### Syntax:
```css
.element {
    border: 5px solid black;
}
```

This sets a **5px solid black border** around the element.

### Shorthand Property
```css
/* Border Shorthand */
.element {
    border: <border-width> <border-style> <border-color>;
}
```

---

## ✅ 2. Border Width

The `border-width` property defines the **thickness** of the border.

```css
.element {
    border-width: 2px; /* Single value applies to all sides */
}
```

### 🔸 **Possible Values:**
- `thin` → `1px`
- `medium` → `3px` (default)
- `thick` → `5px`
- Specific lengths in px, em, rem, etc.

---

## ✅ 3. Border Style

The `border-style` property sets the **style** of the border.

```css
.element {
    border-style: solid; /* Solid border */
}
```

### 🔸 **Possible Values:**
| Value            | Description |
|------------------|-------------|
| `solid`          | A **solid line** border. |
| `dashed`         | A **dashed line** border. |
| `dotted`         | A **dotted line** border. |
| `double`         | **Two solid lines**. |
| `groove`         | **3D groove effect**. |
| `ridge`          | **3D ridge effect**. |
| `inset`          | **Inset effect**. |
| `outset`         | **Outset effect**. |
| `none`           | **No border**. |
| `hidden`         | **Invisible border** (used for table borders). |

### Example of Different Styles:
```css
.dotted-box {
    border: 3px dotted black;
}

.dashed-box {
    border: 3px dashed blue;
}

.double-box {
    border: 5px double red;
}
```

---

## ✅ 4. Border Color

The `border-color` property defines the **color** of the border.

```css
.element {
    border-color: red;
}
```

### 🔸 **Possible Values:**
- Named colors: `red`, `blue`, `green`, etc.
- Hex values: `#ff5733`
- RGB: `rgb(255, 87, 51)`
- RGBA (with transparency): `rgba(255, 87, 51, 0.5)`

---

## ✅ 5. Border Radius (Rounded Corners)

The `border-radius` property allows you to create **rounded corners** for the border.

```css
.element {
    border-radius: 10px; /* Rounded corners */
}
```

You can also round specific corners:

```css
.element {
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
}
```

### 🔸 **Values:**
- Percentage (e.g., `50%` for circles or ellipses).
- Lengths (e.g., `10px`, `1rem` for rounded edges).

### Example:
```css
.rounded-box {
    border: 5px solid black;
    border-radius: 20px;
}
```

---

## ✅ 6. Border Shorthand for Each Side

You can define individual borders for each side of an element:

```css
/* Borders on specific sides */
.element {
    border-top: 2px solid black;
    border-right: 2px solid blue;
    border-bottom: 2px solid green;
    border-left: 2px solid red;
}
```

Alternatively, use `border-[side]`:

```css
/* Border-side specific shorthand */
.element {
    border-top: 3px dotted green;
    border-left: 3px dashed yellow;
}
```

### 🔸 **Border-specific Properties:**
| Property    | Description |
|-------------|-------------|
| `border-top` | Adds border to the **top** of the element. |
| `border-right` | Adds border to the **right** of the element. |
| `border-bottom` | Adds border to the **bottom** of the element. |
| `border-left` | Adds border to the **left** of the element. |

---

### 🎯 Final Example:
```css
.box {
    width: 300px;
    height: 150px;
    border: 3px solid #3498db;
    border-radius: 15px;
    margin: 20px;
    padding: 10px;
    background-color: lightgray;
}
```

---

## 🎉 Conclusion:
Borders are essential for creating visually separated areas on your webpage. You can customize the width, style, color, and even round the corners. Combining **border properties** and **border-radius** can create **unique and visually interesting effects**.
