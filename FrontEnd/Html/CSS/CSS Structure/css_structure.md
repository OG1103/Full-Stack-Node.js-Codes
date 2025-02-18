# CSS Structure Explanation

In this guide, we discuss the basic structure of CSS and how it is used in HTML.

## 1. Linking CSS to HTML
To link an external CSS file to an HTML file, use the `<link>` tag inside the `<head>` section:
```html
<head>
    <link rel="stylesheet" href="styles.css">
</head>
```

## 2. Creating Classes
Classes are used to apply styles to multiple elements:
```css
.my-class {
    color: blue;
    font-size: 16px;
}
```
In HTML:
```html
<p class="my-class">This is a styled paragraph.</p>
```

## 3. Applying CSS to an Element by ID
To target a specific element using an `id`, use the `#` symbol:
```css
#unique-element {
    background-color: yellow;
    padding: 10px;
}
```
In HTML:
```html
<div id="unique-element">This is a unique styled div.</div>
```

## 4. Applying CSS to a Global Element
To apply styles globally to all instances of an element, just use the element name:
```css
body {
    background-color: #f5f5f5;
    font-family: Arial, sans-serif;
}
```

## 5. CSS Descendant Selector
A descendant selector applies styles to elements that are inside another element:
```css
.container p {
    color: green;
    font-weight: bold;
}
```
In HTML:
```html
<div class="container">
    <p>This paragraph is inside a container and will be styled.</p>
</div>
```

---

This guide provides a foundation for understanding how CSS is structured and applied in web development.
