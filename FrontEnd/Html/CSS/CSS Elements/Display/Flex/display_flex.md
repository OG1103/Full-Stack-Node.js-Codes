# CSS Display: Flex (Complete Guide)

The `display: flex;` property makes an element a **flex container**, allowing its child elements (**flex items**) to be easily arranged, aligned, and resized. It is highly useful for creating **responsive layouts**.

## 🔹 1. Understanding the Flexbox Model
A **flex container** consists of:
- **Main Axis** → Defined by `flex-direction` (default: horizontal row).
- **Cross Axis** → Perpendicular to the main axis.
- **Flex Items** → Child elements inside the flex container.

Flexbox is **one-dimensional**, meaning it either arranges elements in **rows** or **columns**, but not both simultaneously.

---

## 🔹 2. Flex Container Properties (Apply to Parent)
These properties control how child elements are arranged inside a flex container.

### ✅ `display: flex;`
Turns the element into a **flex container**, making its children **flex items**.
```css
.container {
    display: flex;
}
```

### ✅ `flex-direction` (Defines the main axis direction)
Controls the **direction** in which flex items are arranged.

```css
.container {
    flex-direction: row; /* Default */
}
```
🔸 **Possible Values:**
| Value             | Description |
|------------------|------------|
| `row` (default)  | Items align **left to right** (main axis = horizontal). |
| `row-reverse`    | Items align **right to left**. |
| `column`         | Items align **top to bottom** (main axis = vertical). |
| `column-reverse` | Items align **bottom to top**. |

### ✅ `flex-wrap` (Controls wrapping behavior)
Determines whether items should **wrap** or remain in a single line.

```css
.container {
    flex-wrap: wrap;
}
```

🔸 **Possible Values:**
| Value         | Description |
|--------------|------------|
| `nowrap` (default) | All items fit in a **single line**, even if they overflow. |
| `wrap` | Items **wrap** onto the next line when needed. |
| `wrap-reverse` | Items wrap onto the **previous** line instead of the next. |

### ✅ `justify-content` (Aligns items on the main axis)
Controls **horizontal alignment** in `row` and **vertical alignment** in `column`.

```css
.container {
    justify-content: center;
}
```

🔸 **Possible Values:**
| Value             | Description |
|------------------|------------|
| `flex-start` (default) | Items align at the **start** of the main axis. |
| `flex-end` | Items align at the **end** of the main axis. |
| `center` | Items are **centered** on the main axis. |
| `space-between` | Items have **equal space** between them (no space at edges). |
| `space-around` | Items have **equal space around** them. |
| `space-evenly` | Items have **perfectly equal** space between and at edges. |

### ✅ `align-items` (Aligns items on the cross axis)
Controls **vertical alignment** in `row` and **horizontal alignment** in `column`.

```css
.container {
    align-items: stretch; /* Default */
}
```

🔸 **Possible Values:**
| Value           | Description |
|----------------|------------|
| `stretch` (default) | Items **stretch** to fill the container (if no height is set). |
| `flex-start` | Items align at the **start** of the cross axis. |
| `flex-end` | Items align at the **end** of the cross axis. |
| `center` | Items are **centered** along the cross axis. |
| `baseline` | Items align based on their **text baseline**. |

### ✅ `align-content` (Controls multiple row alignment)
Only applies when **items wrap onto multiple lines**.

```css
.container {
    align-content: space-between;
}
```

🔸 **Possible Values:**
| Value           | Description |
|----------------|------------|
| `stretch` (default) | Items **stretch** to fit the container. |
| `flex-start` | Rows align at the **start** of the cross axis. |
| `flex-end` | Rows align at the **end** of the cross axis. |
| `center` | Rows are **centered** on the cross axis. |
| `space-between` | Rows have **equal space** between them. |
| `space-around` | Rows have **equal space around** them. |

### ✅ `gap`, `row-gap`, `column-gap` (Spacing between items)
Controls spacing **between** flex items.

```css
.container {
    gap: 20px; /* Adds space between flex items */
}
```

---

## 🔹 3. Flex Item Properties (Apply to Children)
These properties apply to **individual flex items**, controlling their behavior inside a flex container.

### ✅ `order` (Controls item order)
Changes the order of elements **without modifying HTML**.

```css
.item1 {
    order: 2; /* Higher numbers appear later */
}
```

🔸 **Default Value:** `0` (lower values appear first).

### ✅ `flex-grow` (Expands items to fill space)
Defines how much an item **grows** relative to other items.

```css
.item {
    flex-grow: 1; /* Default is 0 */
}
```

🔸 **Default Value:** `0` (items do not grow).  
🔸 **Higher Values:** Item takes **more space** than others.

### ✅ `flex-shrink` (Controls shrinking behavior)
Defines how much an item **shrinks** when space is limited.

```css
.item {
    flex-shrink: 1; /* Default */
}
```

🔸 **Default Value:** `1` (items shrink if needed).  
🔸 **Higher Values:** Item shrinks **more than others**.

### ✅ `flex-basis` (Sets initial size of items)
Defines the **starting size** of an item **before it grows or shrinks**.

```css
.item {
    flex-basis: 200px; /* Sets initial width/height */
}
```

🔸 **Default Value:** `auto` (uses item’s natural size).

### ✅ `align-self` (Overrides `align-items` for one item)
Aligns an individual item differently than the rest.

```css
.item {
    align-self: flex-start;
}
```

🔸 **Possible Values:** Same as `align-items`.

---

## 🔹 4. Shorthand Property: `flex`
The `flex` property combines `flex-grow`, `flex-shrink`, and `flex-basis`.

```css
.item {
    flex: 1 1 100px; /* grow, shrink, basis */
}
```

- **flex: auto** → `flex: 1 1 auto;`  
- **flex: none** → `flex: 0 0 auto;`  

---

### 🎯 **Final Example: Full Flexbox Layout**
```css
.container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}

.item {
    flex: 1;
    background-color: lightblue;
    padding: 20px;
}
```

---

## 🎉 **Conclusion**
Flexbox is **powerful for layouts**, making **alignment and spacing easy**. Learning `display: flex;` helps in creating **modern, responsive designs**.

