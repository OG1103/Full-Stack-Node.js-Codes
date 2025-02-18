# CSS Media Queries (Complete Guide)

**Media queries** are a fundamental part of **responsive web design**. They allow you to apply different styles to different devices or screen sizes, ensuring your website looks great on all devices, from desktops to smartphones.

---

## ✅ 1. What are Media Queries?

A **media query** is a CSS technique that **applies styles conditionally**, based on certain characteristics of the user's device.

Media queries can check for:
- **Viewport width and height** (`max-width`, `min-width`)
- **Device width and height**
- **Screen orientation** (`landscape`, `portrait`)
- **Resolution** (retina displays, high-DPI screens)
- **Aspect ratio and color schemes**

### 🔹 Basic Syntax:
```css
@media (condition) {
    /* CSS rules */
}
```

---

## ✅ 2. Common Use Cases of Media Queries

### 🔹 1. Targeting Different Screen Sizes

This ensures that layouts adapt to **different screen sizes**, like **mobile, tablet, and desktop**.

```css
/* Styles for small screens (Mobile) */
@media (max-width: 600px) {
    body {
        background-color: lightblue;
    }
}

/* Styles for medium screens (Tablets) */
@media (min-width: 601px) and (max-width: 768px) {
    body {
        background-color: lightgreen;
    }
}

/* Styles for large screens (Desktops) */
@media (min-width: 769px) {
    body {
        background-color: lightgray;
    }
}
```

✅ **Use Case:** Create a **responsive layout** that looks good on all devices.

---

### 🔹 2. Changing Layout Based on Device Orientation

```css
/* Styles for devices in landscape orientation */
@media (orientation: landscape) {
    .image {
        width: 50%;
    }
}

/* Styles for devices in portrait orientation */
@media (orientation: portrait) {
    .image {
        width: 100%;
    }
}
```

✅ **Use Case:** Adjust layouts when the user **rotates their device**.

---

### 🔹 3. Hiding or Adjusting Elements at Specific Viewports

```css
/* Hide sidebar on medium screens */
@media (min-width: 600px) and (max-width: 1200px) {
    .sidebar {
        display: none;
    }
}
```

✅ **Use Case:** Hide non-essential content **on smaller screens**.

---

## ✅ 3. Combining Multiple Conditions

You can combine multiple conditions using `and`, `or`, and `not`.

```css
/* Apply styles only when the screen is between 600px and 1200px and in landscape mode */
@media (min-width: 600px) and (max-width: 1200px) and (orientation: landscape) {
    .content {
        font-size: 20px;
    }
}
```

✅ **Use Case:** Apply styles **only under specific screen sizes and orientations**.

---

## ✅ 4. Using Media Queries for High-Resolution Screens

```css
/* Apply styles only for Retina (high-DPI) displays */
@media only screen and (min-resolution: 2dppx) {
    .logo {
        background-image: url('logo-retina.png');
    }
}
```

✅ **Use Case:** Use **higher-quality images** for **retina screens**.

---

## ✅ 5. Best Practices for Using Media Queries

1. **Use `min-width` for mobile-first design**:
   ```css
   @media (min-width: 600px) { ... }
   ```
   This ensures styles **scale up** as the screen size increases.

2. **Combine media queries for better efficiency**:
   ```css
   @media (max-width: 600px), (orientation: portrait) { ... }
   ```

3. **Avoid too many breakpoints**:
   Use **3–5 breakpoints** for a balanced, flexible design.

---

## 🎯 Final Example: Responsive Layout

```css
@media (max-width: 600px) {
    .container {
        width: 100%;
        padding: 10px;
    }
}

@media (min-width: 601px) and (max-width: 768px) {
    .container {
        width: 80%;
        padding: 20px;
    }
}

@media (min-width: 769px) {
    .container {
        width: 60%;
        padding: 30px;
    }
}
```

This ensures the `.container` **adapts dynamically** to different screen sizes.

---

## 🎉 Conclusion:
Media queries are **essential for responsive design**. They **adjust layouts dynamically**, ensuring **great user experience on all devices**.

