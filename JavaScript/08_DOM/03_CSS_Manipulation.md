# CSS Manipulation with JavaScript

JavaScript provides multiple ways to dynamically modify the appearance of elements through the DOM, from inline styles to class manipulation to CSS variables.

---

## 1. Inline Styles (`element.style`)

Directly set CSS properties on an element. Property names use **camelCase** instead of kebab-case.

```javascript
const header = document.getElementById("header");

// Set individual properties
header.style.backgroundColor = "lightblue";    // background-color
header.style.fontSize = "24px";                 // font-size
header.style.color = "darkblue";
header.style.padding = "10px 20px";
header.style.border = "2px solid blue";
header.style.borderRadius = "8px";              // border-radius
header.style.display = "flex";
header.style.justifyContent = "center";         // justify-content

// Read inline styles
console.log(header.style.backgroundColor); // "lightblue"
```

### Removing Inline Styles

Set the property to an empty string to remove it.

```javascript
header.style.backgroundColor = ""; // Removes the inline background-color
header.style.cssText = "";         // Removes ALL inline styles
```

### Setting Multiple Styles with `cssText`

```javascript
header.style.cssText = "background-color: blue; color: white; padding: 10px;";
// Warning: This overwrites ALL existing inline styles
```

> **Note**: `element.style` only reads/writes **inline styles**. It cannot read styles from CSS files or `<style>` blocks. Use `getComputedStyle()` for that.

---

## 2. Class Manipulation (`classList`)

The preferred way to manage styles. Keep your styles in CSS files and toggle classes with JavaScript.

### `classList` Methods

```javascript
const element = document.querySelector(".card");

// Add one or more classes
element.classList.add("active");
element.classList.add("highlighted", "visible"); // Multiple at once

// Remove one or more classes
element.classList.remove("active");
element.classList.remove("highlighted", "visible");

// Toggle a class (add if absent, remove if present)
element.classList.toggle("active");

// Toggle with condition (force add/remove)
element.classList.toggle("active", true);  // Always add
element.classList.toggle("active", false); // Always remove

// Check if class exists
element.classList.contains("active"); // true or false

// Replace a class
element.classList.replace("old-class", "new-class");

// Access class list
console.log(element.classList.length);  // Number of classes
console.log(element.classList[0]);      // First class name
console.log(element.className);        // Full class string "card active"
```

### Practical Examples

```javascript
// Dark mode toggle
const body = document.body;
const toggleBtn = document.getElementById("theme-toggle");

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
});

// Accordion expand/collapse
const accordionItems = document.querySelectorAll(".accordion-item");
accordionItems.forEach(item => {
  item.addEventListener("click", () => {
    item.classList.toggle("expanded");
  });
});

// Active navigation
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});
```

---

## 3. Getting Computed Styles

`window.getComputedStyle()` returns the **actual applied styles**, including styles from CSS files, `<style>` blocks, and browser defaults.

```javascript
const element = document.querySelector(".box");
const computed = window.getComputedStyle(element);

console.log(computed.backgroundColor);  // "rgb(255, 0, 0)"
console.log(computed.width);            // "200px"
console.log(computed.display);          // "block"
console.log(computed.fontSize);         // "16px"
console.log(computed.margin);           // "10px"

// Check visibility
const isVisible = computed.display !== "none" && computed.visibility !== "hidden";

// Get pseudo-element styles
const beforeStyles = window.getComputedStyle(element, "::before");
console.log(beforeStyles.content); // Computed content of ::before
```

---

## 4. CSS Custom Properties (Variables)

CSS variables can be read and modified dynamically with JavaScript, making them powerful for theming.

### Setting CSS Variables

```javascript
// Set on the root element (global)
document.documentElement.style.setProperty("--primary-color", "#3498db");
document.documentElement.style.setProperty("--font-size", "16px");
document.documentElement.style.setProperty("--spacing", "8px");

// Set on a specific element (scoped)
const card = document.querySelector(".card");
card.style.setProperty("--card-bg", "#f0f0f0");
```

### Reading CSS Variables

```javascript
const rootStyles = getComputedStyle(document.documentElement);
const primaryColor = rootStyles.getPropertyValue("--primary-color").trim();
console.log(primaryColor); // "#3498db"
```

### Theme Switching Example

```javascript
function setTheme(theme) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.style.setProperty("--bg-color", "#1a1a1a");
    root.style.setProperty("--text-color", "#ffffff");
    root.style.setProperty("--primary", "#4fc3f7");
  } else {
    root.style.setProperty("--bg-color", "#ffffff");
    root.style.setProperty("--text-color", "#333333");
    root.style.setProperty("--primary", "#1976d2");
  }
}
```

---

## 5. Creating Dynamic Stylesheets

### Creating a `<style>` Element

```javascript
const style = document.createElement("style");
style.textContent = `
  .highlight {
    background-color: yellow;
    font-weight: bold;
    padding: 4px 8px;
  }
  .error-text {
    color: red;
    font-style: italic;
  }
`;
document.head.appendChild(style);

// Now these classes are available
element.classList.add("highlight");
```

### Modifying Existing Stylesheets

```javascript
const sheet = document.styleSheets[0]; // First stylesheet

// Insert a new rule at the end
sheet.insertRule(".new-class { color: blue; font-size: 20px; }", sheet.cssRules.length);

// Delete a rule by index
sheet.deleteRule(0);

// Access and modify existing rules
const rule = sheet.cssRules[0];
console.log(rule.selectorText);  // ".some-class"
rule.style.color = "green";      // Modify the rule
```

---

## 6. Triggering Transitions and Animations

### CSS Transitions via JavaScript

```css
/* CSS */
.box {
  width: 100px;
  height: 100px;
  background: coral;
  transition: width 0.5s ease, background 0.3s ease;
}
.box.expanded {
  width: 300px;
  background: lightgreen;
}
```

```javascript
// JavaScript triggers the transition by adding/removing classes
const box = document.querySelector(".box");
box.classList.toggle("expanded"); // Smooth transition to expanded state
```

### Listening for Transition/Animation End

```javascript
box.addEventListener("transitionend", (event) => {
  console.log(`Transition ended for: ${event.propertyName}`);
  // Runs once for each property that finished transitioning
});

box.addEventListener("animationend", (event) => {
  console.log(`Animation "${event.animationName}" ended`);
  box.classList.remove("animate"); // Clean up animation class
});
```

### Forcing Reflow for Re-triggering Animations

```javascript
// Remove and re-add class won't retrigger - need to force reflow
box.classList.remove("animate");
void box.offsetWidth; // Force reflow (triggers layout recalculation)
box.classList.add("animate"); // Now animation restarts
```

---

## 7. Responsive Styling with JavaScript

```javascript
// Change styles based on window size
window.addEventListener("resize", () => {
  const nav = document.querySelector("nav");

  if (window.innerWidth < 768) {
    nav.classList.add("mobile-nav");
    nav.classList.remove("desktop-nav");
  } else {
    nav.classList.add("desktop-nav");
    nav.classList.remove("mobile-nav");
  }
});

// Using matchMedia (preferred - more efficient)
const mobileQuery = window.matchMedia("(max-width: 768px)");

function handleScreenChange(e) {
  if (e.matches) {
    document.body.classList.add("mobile");
  } else {
    document.body.classList.remove("mobile");
  }
}

mobileQuery.addEventListener("change", handleScreenChange);
handleScreenChange(mobileQuery); // Initial check
```

---

## 8. Best Practices

| Do | Don't |
|----|-------|
| Use `classList` to add/remove CSS classes | Set inline styles for everything |
| Keep styles in CSS files | Use `element.style` for complex styling |
| Use CSS variables for dynamic theming | Hardcode colors in JavaScript |
| Use `getComputedStyle` to read styles | Try to read CSS file styles with `element.style` |
| Use CSS transitions/animations | Manually animate with JavaScript timers |
| Use `matchMedia` for responsive logic | Rely solely on `window.resize` events |

---

## 9. Summary

| Technique | Use Case |
|-----------|----------|
| `element.style.prop` | Quick inline style changes |
| `element.classList` | Toggle predefined CSS classes (preferred) |
| `getComputedStyle()` | Read actual applied styles |
| CSS variables | Dynamic theming, responsive values |
| `document.createElement("style")` | Inject dynamic CSS rules |
| `document.styleSheets` | Modify existing stylesheet rules |
| Transition/animation events | React to CSS animation completion |
