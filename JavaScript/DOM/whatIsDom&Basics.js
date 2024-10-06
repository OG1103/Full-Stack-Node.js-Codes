/**
 * ==========================
 * DOM (Document Object Model)
 * ==========================
 *
 * The DOM is a programming interface for web documents. It represents the page
 * so that programs can change the document structure, style, and content.
 *
 * Every HTML element in the webpage is an object that can be manipulated using
 * JavaScript. The DOM connects web pages to scripts or programming languages
 * like JavaScript.
 */

// 1. Accessing DOM Elements

// The `document` object represents the entire HTML document.
// You can use methods like `getElementById`, `getElementsByClassName`, or `querySelector`
// to access elements within the DOM.

// Example: Accessing an element by its ID
const title = document.getElementById("main-title");
// `title` now refers to the element with the ID "main-title"

// Example: Accessing elements by their class name
const listItems = document.getElementsByClassName("list-item");
// `listItems` is an HTMLCollection of all elements with the class "list-item"

// Example: Accessing elements with CSS-like selectors using querySelector
const firstParagraph = document.querySelector("p");
// `firstParagraph` selects the first <p> element in the document

const allParagraphs = document.querySelectorAll("p");
// `allParagraphs` is a NodeList containing all <p> elements in the document

//---------------------------------------------------------------------------------------

// 2. Modifying DOM Elements

// Once an element is accessed, its content and properties can be modified.

// Example: Changing text content
title.textContent = "New Title!";
// Changes the text inside the element with ID "main-title"

// Example: Changing the HTML content inside an element
title.innerHTML = "<span>New Title with a span!</span>";
// Replaces the content of the element with the new HTML

// Example: Changing the style of an element
title.style.color = "blue";
// Changes the text color of the title to blue

// Example: Adding and removing classes
title.classList.add("highlighted"); // Adds the "highlighted" class
title.classList.remove("highlighted"); // Removes the "highlighted" class

//------------------------------------------------------------------------------

// 3. Creating and Adding New DOM Elements

// You can create new elements using `document.createElement` and add them to the DOM.

// Example: Creating a new element
const newListItem = document.createElement("li"); // Creates a new <li> element

// Example: Setting content and attributes to the new element
newListItem.textContent = "New list item";
newListItem.className = "list-item"; // Assigns a class to the new element

// Example: Appending the new element to an existing parent element
const list = document.querySelector("ul"); // Selects the <ul> element
list.appendChild(newListItem); // Adds the new <li> to the <ul>

//-------------------------------------------------------------------------------

// 4. Removing DOM Elements

// Example: Removing an element from the DOM
list.removeChild(newListItem); // Removes the new <li> we just added

// Example: Directly removing an element
title.remove(); // Removes the title element from the DOM

//----------------------------------------------------------------------------------

// 5. Event Listeners

// Events in the DOM (e.g., clicks, keypresses) can be listened to and handled with
// JavaScript using event listeners.

// Example: Adding a click event listener to a button
const button = document.querySelector("button"); // Selects a button element

// Function to run when the button is clicked
function handleClick() {
  alert("Button clicked!");
}

// Adding the event listener
button.addEventListener("click", handleClick);
// When the button is clicked, the `handleClick` function is triggered

//----------------------------------------------------------------------------------------

// 6. Traversing the DOM

// You can navigate between elements using properties like `parentElement`,
// `children`, `nextElementSibling`, etc.

// Example: Accessing parent and child elements
const parent = title.parentElement; // Gets the parent of the title element
const children = list.children; // Gets all children of the list

// Example: Accessing sibling elements
const nextItem = newListItem.nextElementSibling; // Gets the next sibling of the new list item
const previousItem = newListItem.previousElementSibling; // Gets the previous sibling

//---------------------------------------------------------------------------------------------

// 7. Form Interactions

// You can also interact with form elements using the DOM, such as getting values,
// setting values, or handling form submissions.

// Example: Accessing input field values
const inputField = document.querySelector('input[name="username"]'); // Selects an input element with the name attribute "username"
const inputValue = inputField.value; // Gets the value entered in the input field

// Example: Handling form submissions
const form = document.querySelector("form");
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevents the default form submission behavior
  const username = inputField.value;
  alert(`Submitted username: ${username}`);
});

//----------------------------------------------------------------------------------------------------

// 8. DOMContentLoaded Event

// The `DOMContentLoaded` event is fired when the initial HTML document has been
// completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.

// Example: Listening for the DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");
});

// 9. Best Practices

// - Minimize direct DOM manipulation where possible to improve performance.
// - Avoid excessive use of `innerHTML` as it can lead to security risks like XSS (Cross-Site Scripting).
// - Use event delegation for handling multiple similar events (e.g., clicks on list items).
// - Always clean up event listeners when no longer needed to prevent memory leaks.
