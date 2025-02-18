# CSS Backgrounds

CSS provides various properties to control the background of elements, including colors, images, gradients, and positioning. This guide covers all cases of background styling.

---

## 1. Background Color
The `background-color` property sets a solid color as the background.
```css
div {
    background-color: lightblue;
}
```
Example:
```html
<div>This div has a light blue background.</div>
```

---

## 2. Background Image
The `background-image` property sets an image as the background.
```css
body {
    background-image: url('background.jpg');
}
```
Example:
```html
<body>This body has an image background.</body>
```

---

## 3. Background Size
Defines how a background image is scaled.
```css
div {
    background-image: url('image.jpg');
    background-size: cover; /* Covers entire element */
}
```
- `cover`: Resizes the image to cover the entire element.
- `contain`: Ensures the image is fully visible without being cropped.

---

## 4. Background Position
Positions the background image within an element.
```css
div {
    background-position: center center;
}
```
Values:
- `left top`, `right bottom`, `center center`

---

## 5. Background Repeat
Controls how a background image repeats.
```css
div {
    background-repeat: no-repeat;
}
```
Options:
- `repeat` (default) → Image repeats.
- `no-repeat` → Image does not repeat.
- `repeat-x` / `repeat-y` → Repeats horizontally or vertically.

---

## 6. Background Attachment
Determines if the background image scrolls with the page.
```css
body {
    background-attachment: fixed;
}
```
Values:
- `scroll` (default) → Moves with the page.
- `fixed` → Stays in place.

---

## 7. Background Gradient
CSS allows for gradients as backgrounds.
```css
div {
    background: linear-gradient(to right, red, blue);
}
```
Options:
- `linear-gradient(direction, color1, color2)` → Creates a smooth blend.
- `radial-gradient(circle, color1, color2)` → Creates a circular gradient.

---

## 8. Background Shorthand Property
The `background` shorthand allows setting multiple properties at once.
```css
div {
    background: url('image.jpg') no-repeat center center / cover;
}
```
This combines:
- `background-image`
- `background-repeat`
- `background-position`
- `background-size`

---

This guide covers all background-related properties to enhance web design.
