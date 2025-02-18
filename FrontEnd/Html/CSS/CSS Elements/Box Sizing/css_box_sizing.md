# CSS Box Sizing

The `box-sizing` property in CSS determines how the total width and height of an element are calculated. This guide covers all aspects of box sizing.

---

## 1. The Default `content-box` Model
By default, the `content-box` model is used, meaning:
- **Width and height only include the content**.
- **Padding and border are added on top** of the specified width/height.

```css
.box-content {
    width: 200px;
    height: 100px;
    padding: 20px;
    border: 5px solid black;
    box-sizing: content-box;
}
```
**Calculation:**
- Total width = `200px (content) + 20px (left padding) + 20px (right padding) + 5px (left border) + 5px (right border) = 250px`
- Total height = `100px + padding + border`

---

## 2. The `border-box` Model (Recommended)
With `border-box`:
- **Width and height include content, padding, and border**.
- **The total size remains fixed** even when padding or borders are added.

```css
.box-border {
    width: 200px;
    height: 100px;
    padding: 20px;
    border: 5px solid black;
    box-sizing: border-box;
}
```
**Calculation:**
- The total width remains **200px** (content + padding + border).
- The total height remains **100px**.

---

## 3. Global `border-box` Usage
To apply `border-box` globally, use:
```css
* {
    box-sizing: border-box;
}
```

---

## 4. Comparison: `content-box` vs. `border-box`
| Property        | `content-box` (Default) | `border-box` |
|---------------|----------------------|-------------|
| Width Includes  | Content only         | Content + Padding + Border |
| Height Includes | Content only         | Content + Padding + Border |
| Overflow Risk  | Higher               | Lower |
| Recommended For | Precise content sizing | Responsive layouts |

---

Using `border-box` ensures predictable box dimensions, making layout design easier.
