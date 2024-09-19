/**
 * ==========================
 * Event Listeners with the DOM
 * ==========================
 *
 * Event listeners are functions that wait for an event to occur on a specific
 * element (like a click, keypress, mouse movement) and then execute a function
 * when that event occurs.
 *
 * JavaScript provides the `addEventListener()` method to attach events to elements.
 */

// 1. Basic Event Listener Syntax

// Syntax: `element.addEventListener('event', callbackFunction)`
// The `event` is the type of event to listen for (e.g., 'click', 'keydown').
// The `callbackFunction` is the function that will run when the event occurs.

// Example: Adding a click event listener to a button
const button = document.querySelector("button"); // Selects the button element

// Define a function that will run when the button is clicked
function handleClick() {
  alert("Button was clicked!");
}

// Add the event listener to the button
button.addEventListener("click", handleClick);
// Now, when the button is clicked, the `handleClick` function runs

//---------------------------------------------------------------------------------------

// 2. Event Object

// The `callbackFunction` can take an `event` object as an argument.
// This object contains information about the event (e.g., which key was pressed,
// the mouse position, etc.).

// Example: Using the event object in a click event
button.addEventListener("click", function (event) {
  console.log(event); // Logs the event object to the console
  console.log("Button clicked at position:", event.clientX, event.clientY);
  // Logs the X and Y position of the mouse click
});

//---------------------------------------------------------------------------------------

// 3. Common DOM Events

// Some common events you can listen for include:
// - `click`: When an element is clicked
// - `keydown`: When a key is pressed down
// - `keyup`: When a key is released
// - `mouseover`: When the mouse hovers over an element
// - `mouseout`: When the mouse leaves an element
// - `scroll`: When the user scrolls the page
// - `submit`: When a form is submitted

// Example: Listening for keydown events
document.addEventListener("keydown", function (event) {
  console.log(`Key pressed: ${event.key}`); // Logs the key that was pressed
});

// Example: Listening for mouseover events
const image = document.querySelector("img");
image.addEventListener("mouseover", function () {
  image.style.border = "2px solid red"; // Adds a red border when the mouse is over the image
});
image.addEventListener("mouseout", function () {
  image.style.border = ""; // Removes the border when the mouse leaves the image
});

//---------------------------------------------------------------------------------------

// 4. Removing Event Listeners

// You can remove an event listener using `removeEventListener()`.
// The function reference used in `addEventListener` must be the same as the one used in `removeEventListener`.

// Example: Removing a click event listener
function removeClickListener() {
  button.removeEventListener("click", handleClick);
  alert("Click event listener removed");
}

button.addEventListener("dblclick", removeClickListener);
// Removes the click event when the button is double-clicked

//---------------------------------------------------------------------------------------

// 5. Event Delegation

// Event delegation allows you to add a single event listener to a parent element
// that handles events for all of its children. This is more efficient for managing
// many similar event listeners on multiple elements.

// Example: Event delegation for a list of items
const list = document.querySelector("ul"); // Selects a list element

list.addEventListener("click", function (event) {
  // Check if the clicked target is a list item
  if (event.target.tagName === "LI") {
    console.log(`List item clicked: ${event.target.textContent}`);
  }
});
// Instead of adding a `click` event listener to each <li> item, we attach one
// listener to the parent <ul>. This will capture clicks on all its children.

//---------------------------------------------------------------------------------------

// 6. Preventing Default Behavior

// Some elements have default behavior (e.g., links, form submissions).
// You can prevent the default action with `event.preventDefault()`.

// Example: Preventing a form submission
const form = document.querySelector("form"); // Selects a form element

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevents the form from submitting
  alert("Form submission prevented");
});

// Example: Preventing a link from navigating
const link = document.querySelector("a"); // Selects an anchor (link) element

link.addEventListener("click", function (event) {
  //passing the event as a parameter provides useful information about the event that occured and allows you to control certin behaviors
  event.preventDefault(); // Prevents the link from navigating to its href
  alert("Link navigation prevented");
});

//---------------------------------------------------------------------------------------

// 7. Event Propagation (Bubbling and Capturing)

// Events in the DOM have a flow: they "bubble" up from the target element to the root (bubbling phase)
// or "capture" from the root down to the target (capturing phase). By default, most events use bubbling.
// You can control the phase in which the event is captured using the third argument of `addEventListener`.

// Example: Event bubbling and capturing
const outerDiv = document.querySelector(".outer");
const innerDiv = document.querySelector(".inner");

// Bubbling (default): The event is handled first by the target and then its parents.
outerDiv.addEventListener("click", function () {
  alert("Outer DIV clicked (Bubbling)");
});

innerDiv.addEventListener("click", function () {
  alert("Inner DIV clicked (Bubbling)");
});

// Capturing: The event is handled by parents first before reaching the target.
outerDiv.addEventListener(
  "click",
  function () {
    alert("Outer DIV clicked (Capturing)");
  },
  true
); // `true` means capturing phase

//---------------------------------------------------------------------------------------

// 8. Once Option for Event Listeners

// The `once` option can be passed as the third argument to `addEventListener`.
// This ensures that the event listener is only triggered once, and then it gets automatically removed.

// Example: Event listener that triggers only once
button.addEventListener(
  "click",
  function () {
    alert("This will only alert once!");
  },
  { once: true }
);

// After the first click, this event listener will be removed automatically.

//---------------------------------------------------------------------------------------

// 9. Passive Event Listeners

// When adding listeners for scroll, touch, or other performance-heavy events,
// you can use `passive: true` to indicate that the event listener won't call `preventDefault()`.
// This can improve performance, especially for scrolling events on mobile devices.

// Example: Adding a passive event listener
window.addEventListener(
  "scroll",
  function () {
    console.log("User is scrolling");
  },
  { passive: true }
);

// 10. Best Practices

// - Use `addEventListener` instead of inline event handlers (like `onclick`) to keep your HTML and JavaScript separate.
// - Clean up event listeners with `removeEventListener` when no longer needed to avoid memory leaks.
// - Use event delegation for better performance when working with many child elements.
// - Use `once` for events that should only trigger a single time.
// - Use `passive: true` for performance optimization on scroll, touch, or other related events.
