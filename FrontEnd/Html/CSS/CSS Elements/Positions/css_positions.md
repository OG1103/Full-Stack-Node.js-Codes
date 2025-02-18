# CSS Positions (Complete Guide)

The `position` property in CSS **controls how elements are placed on a webpage**. It determines how elements are positioned **relative to their normal document flow** and other elements.

By default, all elements have `position: static;`. Other positioning values **modify** this behavior.

---

## ✅ 1. Direct Positioning Properties

These properties are used alongside **non-static** positioning types (`relative`, `absolute`, `fixed`, `sticky`) to control placement.

| Property | Description |
|----------|------------|
| `top`    | Moves the element **down** from the top of its containing element. |
| `bottom` | Moves the element **up** from the bottom of its containing element. |
| `left`   | Moves the element **right** from the left edge of its containing element. |
| `right`  | Moves the element **left** from the right edge of its containing element. |

```css
.example {
    position: absolute;
    top: 50px;
    left: 100px;
}
```

---

## ✅ 2. Position Values

### 🔹 `static` (Default Behavior)
Elements with `position: static;` **stay in the normal document flow**.  
They **ignore `top`, `bottom`, `left`, and `right` properties**.

```css
.static-box {
    position: static;
    top: 50px; /* No effect */
}
```

---

### 🔹 `relative` (Relative to Its Normal Position)
Elements with `position: relative;` stay in their normal position, **but can be moved** using `top`, `bottom`, `left`, and `right`.

```css
.relative-box {
    position: relative;
    top: 20px; /* Moves down 20px from original position */
    left: 30px; /* Moves right 30px */
}
```

**✅ Key Features:**
- Moves **relative to its normal position**.
- Other elements are **not affected** by this movement.

---

### 🔹 `absolute` (Removed from Normal Flow)
Elements with `position: absolute;` **are removed** from the normal document flow.  
They position themselves relative to the **nearest positioned ancestor** (a parent with `position: relative;`).

```css
.absolute-box {
    position: absolute;
    top: 50px;
    right: 30px;
}
```

**✅ Key Features:**
- **If no positioned ancestor is found**, it positions itself relative to the **document (`<html>`)**.
- It **overlaps** other elements.
- Other elements **do not recognize** its space.

---

### 🔹 `fixed` (Fixed Relative to the Viewport)
Elements with `position: fixed;` are **positioned relative to the browser window (viewport)**.  
They **do not move when scrolling**.

```css
.fixed-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: black;
    color: white;
}
```

**✅ Key Features:**
- Stays **fixed on the screen**, even when scrolling.
- Often used for **sticky navigation bars, sidebars, or floating buttons**.
- **Must set `width: 100%` manually**, otherwise, width is **not full by default**.

---

### 🔹 `sticky` (Hybrid of `relative` and `fixed`)
Elements with `position: sticky;` behave **like `relative` until scrolled**, then they stick like `fixed`.

```css
.sticky-box {
    position: sticky;
    top: 10px;
}
```

**✅ Key Features:**
- Acts **relative** until the scroll reaches the specified position.
- Becomes **fixed** after that.
- Must define a **`top`, `bottom`, `left`, or `right` value**.

---

## ✅ 3. Z-Index (Stacking Order)
The `z-index` property **controls which elements appear in front** when they overlap.  
Higher values appear **in front of** lower values.

```css
.box {
    position: absolute;
    z-index: 10;
}
```

**✅ Key Features:**
- **Works only on positioned elements** (`relative`, `absolute`, `fixed`, `sticky`).
- `z-index: -1;` moves an element **behind** others.

---

## 🎯 Final Example:
```css
.container {
    position: relative;
    width: 300px;
    height: 300px;
    background-color: lightgray;
}

.child {
    position: absolute;
    top: 50px;
    left: 50px;
    background-color: blue;
    width: 100px;
    height: 100px;
}
```

This places the `.child` **inside** `.container`, **50px from the top and left**.

---

## 🎉 Conclusion:
CSS `position` allows **precise element placement**, helping design layouts, sticky headers, overlays, tooltips, and more.

