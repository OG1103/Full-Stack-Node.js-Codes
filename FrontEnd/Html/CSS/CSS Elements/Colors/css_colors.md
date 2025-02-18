# CSS Colors Explanation

The `color` property in CSS is used to define the color of text and other elements. This guide explains how to use colors in CSS.

## 1. Using Named Colors
CSS provides predefined color names that can be used directly:
```css
h1 {
    color: red;
}
```
Example:
```html
<h1>This text is red</h1>
```

## 2. Using Hexadecimal Colors
Hex values represent colors using a six-digit code:
```css
p {
    color: #3498db; /* Light blue */
}
```
Example:
```html
<p>This text is light blue</p>
```

## 3. Using RGB Colors
RGB (Red, Green, Blue) values define colors using the intensity of each component:
```css
div {
    color: rgb(255, 0, 0); /* Red */
}
```
Example:
```html
<div>This text is red using RGB</div>
```

## 4. Using RGBA Colors (With Transparency)
RGBA adds an alpha channel for transparency (0 is fully transparent, 1 is fully opaque):
```css
span {
    color: rgba(0, 255, 0, 0.5); /* Semi-transparent green */
}
```
Example:
```html
<span>This text is semi-transparent green</span>
```

## 5. Using HSL Colors
HSL (Hue, Saturation, Lightness) represents colors more intuitively:
```css
button {
    color: hsl(200, 100%, 50%); /* Bright blue */
}
```
Example:
```html
<button>Click Me</button>
```

## 6. Using HSLA Colors (With Transparency)
HSLA adds transparency support to HSL:
```css
strong {
    color: hsla(340, 100%, 50%, 0.7); /* Semi-transparent pink */
}
```
Example:
```html
<strong>This text is semi-transparent pink</strong>
```

---

This guide explains different ways to define colors in CSS and how they are applied to HTML elements.
