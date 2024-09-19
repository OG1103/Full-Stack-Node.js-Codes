/**
 * ==========================
 * DOM Traversal in JavaScript
 * ==========================
 *
 * DOM traversal refers to navigating between elements in the DOM (Document Object Model)
 * tree. This is useful for accessing specific elements in relation to others (e.g.,
 * parent, child, or sibling elements) and manipulating them.
 *
 * Traversing the DOM can be done using a variety of properties and methods, including:
 *  - Moving between parent and child elements
 *  - Accessing sibling elements
 *  - Navigating the entire DOM tree
 *
 * Let's go through the most common ways to traverse the DOM.
 */

/**
 * 1. Accessing Parent Elements
 * ----------------------------
 * You can traverse upwards in the DOM tree to access parent elements.
 */

// a) `parentNode`
// The `parentNode` property gives you access to the direct parent of an element.
const childElement = document.getElementById("child");
const parentElement = childElement.parentNode;
console.log(parentElement); // Logs the parent of the #child element

// b) `parentElement`
// Similar to `parentNode`, but `parentElement` only returns element nodes, skipping text nodes or comments.
const parentEl = childElement.parentElement;
console.log(parentEl); // Logs the parent element of #child (same as parentNode, but more specific)

/**
 * 2. Accessing Child Elements
 * ---------------------------
 * You can traverse downwards in the DOM tree to access child elements.
 */

// a) `childNodes`
// Returns a NodeList of all child nodes, including text nodes (whitespace, comments, etc.).
const parent = document.getElementById("parent");
const childNodes = parent.childNodes;
console.log(childNodes); // Logs all child nodes of #parent (including text nodes and comments)

// b) `children`
// The `children` property returns an HTMLCollection of only the child elements (excluding text nodes).
const children = parent.children;
console.log(children); // Logs only the child elements (no text nodes or comments)

// c) `firstChild` and `lastChild`
// Returns the first and last child of an element, including text nodes.
const firstChild = parent.firstChild;
console.log(firstChild); // Logs the first child of #parent (could be a text node)

const lastChild = parent.lastChild;
console.log(lastChild); // Logs the last child of #parent

// d) `firstElementChild` and `lastElementChild`
// Returns the first and last child elements, excluding text nodes and comments.
const firstElementChild = parent.firstElementChild;
console.log(firstElementChild); // Logs the first child element of #parent

const lastElementChild = parent.lastElementChild;
console.log(lastElementChild); // Logs the last child element of #parent

/**
 * 3. Accessing Sibling Elements
 * -----------------------------
 * You can traverse horizontally in the DOM tree to access sibling elements.
 */

// a) `nextSibling` and `previousSibling`
// Returns the next and previous siblings of an element, including text nodes and comments.
const nextSibling = childElement.nextSibling;
console.log(nextSibling); // Logs the next sibling of #child (could be a text node)

const previousSibling = childElement.previousSibling;
console.log(previousSibling); // Logs the previous sibling of #child (could be a text node)

// b) `nextElementSibling` and `previousElementSibling`
// Returns the next and previous sibling elements, excluding text nodes and comments.
const nextElementSibling = childElement.nextElementSibling;
console.log(nextElementSibling); // Logs the next sibling element of #child

const previousElementSibling = childElement.previousElementSibling;
console.log(previousElementSibling); // Logs the previous sibling element of #child

/**
 * 4. Traversing the Entire DOM Tree
 * ---------------------------------
 * You can traverse the entire DOM tree and access all elements within it using recursive functions.
 */

// a) Recursively traversing the DOM and logging all element nodes
function traverseDOM(element) {
  console.log(element); // Logs the current element
  element = element.firstElementChild;
  while (element) {
    traverseDOM(element); // Recursively call the function on the next element
    element = element.nextElementSibling;
  }
}

// Start traversing from the document body
traverseDOM(document.body); // Logs all element nodes within the body

/**
 * 5. Finding Specific Elements Using Traversal
 * --------------------------------------------
 * While traversing, you can find specific elements or perform actions based on conditions.
 */

// Example: Finding a specific element based on a condition
function findElementByTagName(element, tagName) {
  if (element.tagName === tagName.toUpperCase()) {
    return element; // Return the element if it matches the tag name
  }
  let child = element.firstElementChild;
  while (child) {
    const result = findElementByTagName(child, tagName); // Recursively search in child nodes
    if (result) {
      return result;
    }
    child = child.nextElementSibling;
  }
  return null; // Return null if no match is found
}

// Usage
const foundElement = findElementByTagName(document.body, "div");
console.log(foundElement); // Logs the first <div> element found in the document

/**
 * 6. Closest Method for Parent Search
 * -----------------------------------
 * The `closest()` method allows you to search for the closest parent element (including the element itself)
 * that matches a CSS selector.
 */

// Example: Find the closest parent element with the class "container"
const child = document.getElementById("child-element");
const closestParent = child.closest(".container");
console.log(closestParent); // Logs the closest parent element with the class "container"

/**
 * 7. Querying Descendant Elements
 * -------------------------------
 * Use `querySelector()` and `querySelectorAll()` to find specific descendant elements
 * within an element's subtree.
 */

// a) `querySelector()`
// Finds the first matching descendant element based on a CSS selector.
const firstDescendant = parent.querySelector(".some-class");
console.log(firstDescendant); // Logs the first descendant with the class "some-class"

// b) `querySelectorAll()`
// Finds all matching descendant elements and returns them as a NodeList.
const allDescendants = parent.querySelectorAll("div");
console.log(allDescendants); // Logs all <div> descendants within #parent

/**
 * 8. Working with Live vs. Static Collections
 * -------------------------------------------
 * Some methods return live collections, which are automatically updated when the DOM changes,
 * while others return static collections, which do not change unless queried again.
 */

// a) Live collections (e.g., `childNodes`, `children`)
const liveCollection = parent.children;
console.log(liveCollection.length); // Output: e.g., 3

// Adding a new child to #parent
const newChild = document.createElement("div");
parent.appendChild(newChild);
console.log(liveCollection.length); // Output: 4 (live collection automatically updated)

// b) Static collections (e.g., `querySelectorAll`)
const staticCollection = parent.querySelectorAll("div");
console.log(staticCollection.length); // Output: e.g., 3

// Adding a new child to #parent
parent.appendChild(newChild);
console.log(staticCollection.length); // Output: 3 (static collection doesn't update automatically)

/**
 * 9. Removing Elements from the DOM
 * ---------------------------------
 * You can also remove elements from the DOM while traversing or after locating them.
 */

// Example: Removing a child element from its parent
parent.removeChild(childElement); // Removes #child from #parent

// Alternatively, use the `remove()` method on the element itself
childElement.remove(); // Removes the element from the DOM directly

/**
 * 10. Replacing Elements in the DOM
 * ---------------------------------
 * You can replace one element with another using the `replaceChild()` method.
 */

// Example: Replacing an existing element with a new one
const newElement = document.createElement("p");
newElement.textContent = "This is a new paragraph";
parent.replaceChild(newElement, firstElementChild); // Replaces the first child with the new paragraph

/**
 * Conclusion:
 * -----------
 * DOM traversal is essential for navigating through and manipulating elements in the DOM.
 * By understanding how to move between parent, child, and sibling nodes, and using
 * methods like `closest()`, `querySelector()`, and `querySelectorAll()`, you can efficiently
 * access, modify, or remove elements in a document.
 *
 * Key traversal methods and properties include:
 * - Parent navigation (`parentNode`, `parentElement`)
 * - Child navigation (`childNodes`, `children`, `firstChild`, `firstElementChild`)
 * - Sibling navigation (`nextSibling`, `nextElementSibling`)
 * - Querying elements (`querySelector()`, `querySelectorAll()`)
 * - Live vs. static collections (`children` vs. `querySelectorAll`)
 * - Adding, removing, and replacing elements in the DOM
 */
