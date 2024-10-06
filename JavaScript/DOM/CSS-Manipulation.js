/**
 * ==========================
 * Manipulating CSS with the DOM
 * ==========================
 *
 * You can dynamically change the style of HTML elements using JavaScript.
 * The DOM allows you to access and modify the CSS properties of elements,
 * enabling dynamic styling based on user actions, events, or conditions.
 */

// 1. Accessing and Modifying Inline Styles

// Every DOM element has a `style` property that allows you to directly modify
// its inline styles (styles defined inside the HTML element).

// Example: Changing the background color of an element
const header = document.getElementById("header"); // Access the header element
header.style.backgroundColor = "lightblue"; // Changes the background color

// Example: Changing the font size of an element
header.style.fontSize = "24px"; // Sets the font size to 24px

// Note: The `style` property only accesses or modifies inline styles.
// It won’t work with styles defined in an external CSS file or `<style>` block.

//---------------------------------------------------------------------------------------

// 2. Adding and Removing CSS Classes

// A more efficient way to modify styles is by adding or removing CSS classes.
// CSS classes are defined in stylesheets, and you can toggle them dynamically using JavaScript.

// Example: Adding a CSS class to an element
header.classList.add("highlighted");
// Adds the class "highlighted" to the header element, applying any styles associated with it in the CSS

// Example: Removing a CSS class
header.classList.remove("highlighted");
// Removes the class, and the styles applied by it are removed as well

// Example: Toggling a class
header.classList.toggle("highlighted");
// Adds the class if it’s not present, removes it if it is (toggling it on and off)

//---------------------------------------------------------------------------------------

// 3. Accessing CSS Values from Stylesheets

// You can retrieve computed CSS values from stylesheets, even if they are not set as inline styles.
// This is done using `window.getComputedStyle()`.

// Example: Getting the computed background color of an element
const computedStyle = window.getComputedStyle(header);
console.log(computedStyle.backgroundColor);
// Logs the actual background color, whether it’s from inline styles or a CSS file

// Example: Checking if an element is visible using computed styles
const isVisible = computedStyle.display !== "none";
console.log(isVisible);
// Logs `true` if the element is visible, `false` if it's hidden with `display: none`

//---------------------------------------------------------------------------------------

// 4. Creating and Inserting CSS Rules Dynamically

// You can create new styles and insert them into the DOM dynamically.
// This can be done by creating a new `<style>` tag and appending it to the document.

// Example: Creating a new CSS rule and applying it to an element
const styleSheet = document.createElement("style"); // Create a <style> tag
styleSheet.textContent = `
  .dynamic-style {
    color: red;
    font-weight: bold;
  }
`;
document.head.appendChild(styleSheet); // Append the style to the document head

// Now, the CSS rule is applied by adding the class
header.classList.add("dynamic-style"); // The header text will now be red and bold

//---------------------------------------------------------------------------------------

// 5. Modifying CSS Stylesheets

// You can also modify existing stylesheets directly using JavaScript.
// The document’s `styleSheets` property gives access to all linked or embedded stylesheets.

// Example: Modifying an existing stylesheet rule
const sheet = document.styleSheets[0]; // Access the first stylesheet
const rule = sheet.cssRules[0]; // Access the first rule in the stylesheet
rule.style.color = "green"; // Change the color of the rule

// Example: Inserting a new rule in an existing stylesheet
sheet.insertRule(
  ".new-rule { color: blue; font-size: 20px; }",
  sheet.cssRules.length
);
// Adds a new CSS rule at the end of the stylesheet

//---------------------------------------------------------------------------------------

// 6. Transitioning and Animating CSS with JavaScript

// You can trigger CSS transitions and animations via JavaScript by modifying properties
// that have been defined in the CSS with `transition` or `animation`.

// Example: CSS Transition
// CSS (assumed to be in an external stylesheet):
// .box { width: 100px; height: 100px; background-color: lightcoral; transition: width 0.5s; }
// .box.expanded { width: 200px; }

const box = document.querySelector(".box"); // Selects the .box element
box.classList.add("expanded"); // Triggers the transition defined in CSS, smoothly expanding the box

// Example: CSS Animation
// CSS (assumed to be in an external stylesheet):
// @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
// .rotating { animation: rotate 2s infinite; }

box.classList.add("rotating"); // Starts the rotation animation defined in the CSS

//---------------------------------------------------------------------------------------

// 7. Responsive Design with JavaScript

// You can modify styles based on window size or user interactions, making your page
// more responsive and dynamic.

// Example: Changing styles on window resize
window.addEventListener("resize", function () {
  if (window.innerWidth < 600) {
    box.style.backgroundColor = "lightgreen"; // Changes background color if the window is less than 600px wide
  } else {
    box.style.backgroundColor = "lightcoral"; // Reverts back to original color if the window is larger
  }
});

//---------------------------------------------------------------------------------------

// 8. Removing Inline Styles

// To remove an inline style that was added using `element.style`, simply set it to an empty string.

// Example: Removing an inline style
box.style.backgroundColor = ""; // This removes the inline background-color style

//---------------------------------------------------------------------------------------

// 9. Using CSS Variables (Custom Properties) with JavaScript

// CSS variables (custom properties) can be dynamically manipulated using JavaScript.
// This allows for more flexibility and modularity in theming and design.

// Example: Setting a CSS variable
document.documentElement.style.setProperty("--main-color", "purple");
// Changes the value of the `--main-color` variable for the entire document

// Example: Retrieving the value of a CSS variable
const mainColor = getComputedStyle(document.documentElement).getPropertyValue(
  "--main-color"
);
console.log(mainColor); // Logs the current value of `--main-color`

// 10. Best Practices

// - Use class-based styling instead of inline styles for cleaner, maintainable code.
// - Avoid manipulating CSS rules directly unless necessary. Prefer adding/removing classes.
// - Use `getComputedStyle` to safely access the applied styles, especially when styles come from CSS files.
// - Combine CSS transitions and animations with JavaScript for smooth, performant interactions.
