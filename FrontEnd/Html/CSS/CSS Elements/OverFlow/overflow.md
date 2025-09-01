Here is a complete `.md` file explaining **CSS Overflow**, including all options and usage examples:

---

# 📘 CSS Overflow Explained

In CSS, the `overflow` property controls what happens to content that is too large to fit into an element's box.

## 🔹 Syntax

```css
overflow: visible | hidden | scroll | auto | clip;
```

## 🧠 When to Use

Use `overflow` when:

* The content of an element exceeds its container dimensions.
* You want to control scrollbars or hide overflowing content.

---

## 🔹 Values and Their Behavior

### 1. `visible` (default)

* **Content overflows and is visible outside the box.**
* No clipping or scrollbars.

```css
.box {
  width: 200px;
  height: 100px;
  overflow: visible;
}
```

### 2. `hidden`

* **Extra content is clipped and not visible.**
* No scrollbars provided.

```css
.box {
  width: 200px;
  height: 100px;
  overflow: hidden;
}
```

### 3. `scroll`

* **Content is clipped, and scrollbars are always visible** (even if not needed).

```css
.box {
  width: 200px;
  height: 100px;
  overflow: scroll;
}
```

### 4. `auto`

* **Scrollbars appear only if needed.**

```css
.box {
  width: 200px;
  height: 100px;
  overflow: auto;
}
```

### 5. `clip` (rarely used)

* **Content is clipped without scrollbars.**
* Similar to `hidden`, but doesn’t allow scrolling even programmatically.

```css
.box {
  width: 200px;
  height: 100px;
  overflow: clip;
}
```

---

## 🔹 Overflow on Axes

You can control overflow **separately** for horizontal and vertical directions:

### `overflow-x`

Controls overflow **horizontally**.

```css
overflow-x: auto;
```

### `overflow-y`

Controls overflow **vertically**.

```css
overflow-y: scroll;
```

---

## 🔹 Practical Example

```html
<div class="container">
  <p>Lots of overflowing content goes here...</p>
</div>
```

```css
.container {
  width: 250px;
  height: 100px;
  border: 1px solid #ccc;
  overflow: auto; /* Scroll only if needed */
}
```

---

## 💡 Tips

* Use `overflow: hidden` to create image or text crop effects.
* Combine with `white-space: nowrap` to create horizontal scrolling.
* Use `overflow: auto` or `scroll` on modals or fixed containers to allow user scrolling.

---

Would you like a visual HTML demo with scrollable content?
