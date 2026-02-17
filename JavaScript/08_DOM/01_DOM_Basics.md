# DOM Basics: Document Object Model

## Table of Contents

- [What is the DOM?](#what-is-the-dom)
- [The Document Object](#the-document-object)
- [Selecting Elements](#selecting-elements)
- [HTMLCollection vs NodeList](#htmlcollection-vs-nodelist)
- [Modifying Elements](#modifying-elements)
- [Modifying Attributes](#modifying-attributes)
- [Modifying Styles](#modifying-styles)
- [Creating Elements](#creating-elements)
- [Adding Elements to the DOM](#adding-elements-to-the-dom)
- [Removing Elements](#removing-elements)
- [Replacing Elements](#replacing-elements)
- [Cloning Elements](#cloning-elements)
- [DOMContentLoaded Event](#domcontentloaded-event)
- [Best Practices](#best-practices)

---

## What is the DOM?

The **Document Object Model (DOM)** is a programming interface for web documents. It represents the structure of an HTML or XML document as a **tree of objects**, where each node in the tree corresponds to a part of the document (elements, attributes, text, comments, etc.).

The DOM is **not** the HTML source code. It is a live, in-memory representation that the browser constructs after parsing the HTML. JavaScript interacts with this representation, not the raw HTML text.

### The DOM Tree Structure

```
document
  └── html
        ├── head
        │     ├── meta
        │     ├── title
        │     │     └── "My Page" (text node)
        │     └── link
        └── body
              ├── header
              │     └── h1
              │           └── "Hello World" (text node)
              ├── main
              │     ├── p
              │     │   └── "Some text" (text node)
              │     └── div
              │           └── ul
              │                 ├── li
              │                 └── li
              └── footer
```

### Node Types

Every item in the DOM tree is a **node**. The most common node types are:

| Node Type         | `nodeType` Value | Description                              |
| ----------------- | ---------------- | ---------------------------------------- |
| `Element`         | 1                | HTML tags like `<div>`, `<p>`, `<span>`  |
| `Text`            | 3                | Text content inside elements             |
| `Comment`         | 8                | HTML comments `<!-- ... -->`             |
| `Document`        | 9                | The root `document` node                 |
| `DocumentFragment`| 11               | Lightweight container (not in the DOM)   |

```js
const el = document.getElementById("app");

console.log(el.nodeType);  // 1 (Element)
console.log(el.nodeName);  // "DIV" (uppercase tag name)
console.log(el.nodeValue); // null (elements have no nodeValue; text nodes do)
```

---

## The Document Object

The `document` object is the entry point to the DOM. It represents the entire HTML document loaded in the browser and provides methods and properties for interacting with the page.

```js
// The document itself
console.log(document);              // The entire document
console.log(document.documentElement); // The <html> element
console.log(document.head);         // The <head> element
console.log(document.body);         // The <body> element
console.log(document.title);        // The page <title> text
console.log(document.URL);          // The full URL of the document
console.log(document.domain);       // The domain of the document
console.log(document.doctype);      // The <!DOCTYPE> declaration

// Count all elements
console.log(document.all.length);   // Total number of elements (deprecated but works)
console.log(document.links);        // All <a> and <area> with href
console.log(document.images);       // All <img> elements
console.log(document.forms);        // All <form> elements
console.log(document.scripts);      // All <script> elements
```

---

## Selecting Elements

Selecting (or querying) elements is the most fundamental DOM operation. JavaScript provides multiple methods, each suited for different scenarios.

### getElementById

Returns a **single element** matching the given `id`, or `null` if not found. IDs must be unique within a document.

```html
<div id="main-content">Hello</div>
```

```js
const el = document.getElementById("main-content");
console.log(el);           // <div id="main-content">Hello</div>
console.log(el.id);        // "main-content"
console.log(el.tagName);   // "DIV"
```

> **Note:** This is the fastest DOM selection method because IDs are indexed internally by the browser.

### getElementsByClassName

Returns a **live HTMLCollection** of all elements matching the class name(s). Multiple classes can be specified, separated by spaces.

```html
<p class="text highlight">One</p>
<p class="text">Two</p>
<p class="text highlight">Three</p>
```

```js
const texts = document.getElementsByClassName("text");
console.log(texts.length); // 3

const highlighted = document.getElementsByClassName("text highlight");
console.log(highlighted.length); // 2 (elements with BOTH classes)

// Access individual elements by index
console.log(texts[0].textContent); // "One"

// Iterate (HTMLCollection is array-like but not an array)
for (let i = 0; i < texts.length; i++) {
  console.log(texts[i].textContent);
}

// Convert to array for array methods
const arr = Array.from(texts);
arr.forEach((el) => console.log(el.textContent));
```

### getElementsByTagName

Returns a **live HTMLCollection** of all elements with the specified tag name.

```js
const paragraphs = document.getElementsByTagName("p");
console.log(paragraphs.length);

// Select ALL elements
const allElements = document.getElementsByTagName("*");
console.log(allElements.length);
```

### querySelector

Returns the **first element** matching a CSS selector, or `null` if none match. Supports any valid CSS selector syntax.

```html
<div class="container">
  <p id="intro" class="text">Hello</p>
  <p class="text" data-type="info">World</p>
  <ul>
    <li class="item active">Item 1</li>
    <li class="item">Item 2</li>
  </ul>
</div>
```

```js
// By ID
const intro = document.querySelector("#intro");

// By class
const text = document.querySelector(".text");

// By tag
const paragraph = document.querySelector("p");

// By attribute
const info = document.querySelector('[data-type="info"]');

// Compound selectors
const activeItem = document.querySelector(".container ul li.active");
const firstItem = document.querySelector(".container > ul > li:first-child");

// Pseudo-selectors
const lastItem = document.querySelector("li:last-child");
const nthItem = document.querySelector("li:nth-child(2)");
```

### querySelectorAll

Returns a **static NodeList** of all elements matching the CSS selector. If nothing matches, returns an empty NodeList.

```js
const allTexts = document.querySelectorAll(".text");
console.log(allTexts.length); // 2

// NodeList supports forEach natively
allTexts.forEach((el) => {
  console.log(el.textContent);
});

// Spread into array for full array methods
const arr = [...allTexts];
const filtered = arr.filter((el) => el.dataset.type === "info");

// Complex selectors
const mixed = document.querySelectorAll("p.text, li.item");
console.log(mixed.length); // 4 (2 paragraphs + 2 list items)
```

### Selection Methods Comparison

| Method                     | Returns            | Live? | Matches   | Speed   |
| -------------------------- | ------------------ | ----- | --------- | ------- |
| `getElementById`           | Element or `null`  | N/A   | First     | Fastest |
| `getElementsByClassName`   | HTMLCollection     | Yes   | All       | Fast    |
| `getElementsByTagName`     | HTMLCollection     | Yes   | All       | Fast    |
| `querySelector`            | Element or `null`  | N/A   | First     | Moderate|
| `querySelectorAll`         | NodeList           | No    | All       | Moderate|

---

## HTMLCollection vs NodeList

Both are array-like objects containing DOM elements, but they have critical differences.

| Feature                | HTMLCollection            | NodeList                                 |
| ---------------------- | ------------------------- | ---------------------------------------- |
| Returned by            | `getElementsBy*` methods  | `querySelectorAll`, `childNodes`         |
| Live / Static          | Always **live**           | Usually **static** (`childNodes` is live)|
| Contains               | Element nodes only        | Can contain any node type                |
| `forEach` support      | No (must convert)         | Yes (built-in)                           |
| Index access `[i]`     | Yes                       | Yes                                      |
| `.item(i)` method      | Yes                       | Yes                                      |
| `.namedItem()` method  | Yes                       | No                                       |
| `.length` property     | Yes                       | Yes                                      |

### Live vs Static: Why It Matters

```html
<ul id="list">
  <li class="item">A</li>
  <li class="item">B</li>
</ul>
```

```js
// Live HTMLCollection - reflects DOM changes automatically
const liveCollection = document.getElementsByClassName("item");
console.log(liveCollection.length); // 2

// Static NodeList - snapshot at query time
const staticList = document.querySelectorAll(".item");
console.log(staticList.length); // 2

// Now add a new element
const newLi = document.createElement("li");
newLi.className = "item";
newLi.textContent = "C";
document.getElementById("list").appendChild(newLi);

// Live collection updated automatically
console.log(liveCollection.length); // 3

// Static list remains unchanged
console.log(staticList.length); // 2
```

### Converting to Arrays

```js
const collection = document.getElementsByTagName("p");

// Method 1: Array.from()
const arr1 = Array.from(collection);

// Method 2: Spread operator
const arr2 = [...collection];

// Method 3: Array.prototype.slice (older approach)
const arr3 = Array.prototype.slice.call(collection);

// Now use full array methods
arr1.filter((p) => p.classList.contains("active"))
    .map((p) => p.textContent);
```

> **Gotcha with live collections in loops:** Modifying the DOM inside a loop over a live collection can cause elements to be skipped or infinite loops. Always convert to an array first if you plan to modify the DOM during iteration.

---

## Modifying Elements

### textContent

Gets or sets the **text content** of an element and all its descendants. It returns the text of every child node concatenated together. Setting it replaces all child nodes with a single text node.

```html
<div id="box">
  <p>Hello <span>World</span></p>
</div>
```

```js
const box = document.getElementById("box");

// Reading - gets ALL nested text, ignoring tags
console.log(box.textContent); // "\n  Hello World\n"

// Setting - replaces ALL children with plain text
box.textContent = "New Content";
// Now: <div id="box">New Content</div>
// The <p> and <span> are gone
```

> **Security:** `textContent` does NOT parse HTML. If you set `textContent = "<b>Bold</b>"`, the literal string `<b>Bold</b>` is displayed. This makes it safe against XSS injection.

### innerHTML

Gets or sets the **HTML markup** inside an element. The browser parses the string as HTML.

```html
<div id="container"><p>Old content</p></div>
```

```js
const container = document.getElementById("container");

// Reading
console.log(container.innerHTML); // "<p>Old content</p>"

// Setting - the string is parsed as HTML
container.innerHTML = "<h2>New Title</h2><p>New paragraph</p>";

// Appending HTML (re-parses the entire inner HTML)
container.innerHTML += "<p>Another paragraph</p>";
```

> **Warning:** Setting `innerHTML` destroys all existing child nodes and their event listeners, then creates new ones from the HTML string. Never use `innerHTML` with unsanitized user input -- it creates XSS vulnerabilities.

### innerText

Similar to `textContent`, but returns the **visually rendered** text (respects CSS `display: none`, line breaks, etc.). It triggers a reflow, making it slower.

```html
<div id="example">
  <p>Visible text</p>
  <p style="display: none;">Hidden text</p>
</div>
```

```js
const el = document.getElementById("example");

// textContent returns ALL text regardless of visibility
console.log(el.textContent); // "Visible text\nHidden text"

// innerText returns only VISIBLE text
console.log(el.innerText); // "Visible text"
```

### Comparison Table

| Property       | Parses HTML? | Includes Hidden? | Triggers Reflow? | XSS Safe? |
| -------------- | ------------ | ---------------- | ----------------- | --------- |
| `textContent`  | No           | Yes              | No                | Yes       |
| `innerHTML`    | Yes          | Yes (in markup)  | Yes               | **No**    |
| `innerText`    | No           | No               | Yes               | Yes       |

---

## Modifying Attributes

### getAttribute and setAttribute

```html
<a id="link" href="https://example.com" target="_blank" class="nav-link">
  Visit Example
</a>
<img id="photo" src="photo.jpg" alt="A photo" width="300">
```

```js
const link = document.getElementById("link");

// Reading attributes
console.log(link.getAttribute("href"));    // "https://example.com"
console.log(link.getAttribute("target"));  // "_blank"
console.log(link.getAttribute("class"));   // "nav-link"

// Setting attributes
link.setAttribute("href", "https://new-url.com");
link.setAttribute("title", "Go to new URL");  // Adds a new attribute
link.setAttribute("rel", "noopener noreferrer");

// Checking if an attribute exists
console.log(link.hasAttribute("target")); // true

// Removing an attribute
link.removeAttribute("target");
console.log(link.hasAttribute("target")); // false

// Direct property access (for standard attributes)
const img = document.getElementById("photo");
console.log(img.src);   // Full URL: "http://localhost/photo.jpg"
console.log(img.alt);   // "A photo"
img.alt = "Updated alt text";
img.width = 500;
```

> **getAttribute vs property access:** `getAttribute` returns the HTML attribute value as a string exactly as written. Property access (e.g., `el.href`) returns the resolved/computed value. For example, `getAttribute("href")` might return `"/page"` while `el.href` returns `"https://example.com/page"`.

### dataset (data-* Attributes)

Custom `data-*` attributes allow you to store arbitrary data on HTML elements. The `dataset` property provides a convenient API to read and write them.

```html
<div
  id="user-card"
  data-user-id="42"
  data-role="admin"
  data-is-active="true"
  data-full-name="John Doe"
>
  John Doe
</div>
```

```js
const card = document.getElementById("user-card");

// Reading data attributes (note: camelCase conversion)
// data-user-id   -> dataset.userId
// data-role      -> dataset.role
// data-is-active -> dataset.isActive
// data-full-name -> dataset.fullName
console.log(card.dataset.userId);    // "42"
console.log(card.dataset.role);      // "admin"
console.log(card.dataset.isActive);  // "true" (always a string)
console.log(card.dataset.fullName);  // "John Doe"

// Setting data attributes
card.dataset.lastLogin = "2025-01-15";
// Creates: data-last-login="2025-01-15" in the HTML

// Deleting data attributes
delete card.dataset.isActive;
// Removes: data-is-active from the element

// Checking existence
console.log("role" in card.dataset); // true

// Iterating over all data attributes
for (const [key, value] of Object.entries(card.dataset)) {
  console.log(`${key}: ${value}`);
}
```

> **Naming convention:** HTML `data-*` attribute names are hyphenated (`data-user-id`). In JavaScript, they become camelCase (`dataset.userId`). The conversion is automatic.

---

## Modifying Styles

### element.style (Inline Styles)

The `style` property gives direct access to an element's inline styles. CSS property names are converted to camelCase in JavaScript.

```js
const box = document.querySelector(".box");

// Setting styles (adds inline style attribute)
box.style.backgroundColor = "blue";      // background-color
box.style.color = "white";
box.style.padding = "20px";
box.style.borderRadius = "8px";          // border-radius
box.style.fontSize = "1.2rem";           // font-size
box.style.marginTop = "10px";            // margin-top
box.style.zIndex = "100";                // z-index

// Reading inline styles (only reads inline, not computed)
console.log(box.style.backgroundColor); // "blue"
console.log(box.style.color);          // "white"

// Removing a specific inline style
box.style.padding = "";  // Removes the padding declaration

// Setting multiple styles at once with cssText
box.style.cssText = "background: red; color: white; padding: 10px;";
// WARNING: This overwrites ALL existing inline styles

// Using setProperty (allows !important)
box.style.setProperty("background-color", "green", "important");
```

### classList

The `classList` property provides methods to manipulate an element's CSS classes. This is the preferred approach for styling because it separates concerns.

```html
<div id="card" class="card shadow">Content</div>
```

```js
const card = document.getElementById("card");

// Reading classes
console.log(card.classList);          // DOMTokenList ["card", "shadow"]
console.log(card.classList.length);   // 2
console.log(card.classList[0]);       // "card"
console.log(card.className);         // "card shadow" (the raw string)

// add() - adds one or more classes
card.classList.add("active");
card.classList.add("rounded", "bordered"); // Multiple at once
// Classes: "card shadow active rounded bordered"

// remove() - removes one or more classes
card.classList.remove("shadow");
card.classList.remove("rounded", "bordered"); // Multiple at once
// Classes: "card active"

// toggle() - adds if absent, removes if present
card.classList.toggle("active"); // Removes "active"
card.classList.toggle("active"); // Adds "active" back

// toggle() with force parameter
card.classList.toggle("active", true);   // Always adds (like add)
card.classList.toggle("active", false);  // Always removes (like remove)

// The force parameter is useful with conditions:
const isLoggedIn = true;
card.classList.toggle("authenticated", isLoggedIn);

// contains() - checks if a class exists
console.log(card.classList.contains("card"));   // true
console.log(card.classList.contains("hidden")); // false

// replace() - replaces one class with another
card.classList.replace("card", "card-large");
// "card" becomes "card-large"

// Iterate over all classes
card.classList.forEach((cls) => console.log(cls));
```

---

## Creating Elements

### createElement

Creates a new HTML element node. The element exists in memory but is **not** part of the DOM until explicitly inserted.

```js
// Create a new <div> element
const div = document.createElement("div");
div.id = "new-section";
div.className = "section highlight";
div.textContent = "This is a new section";

// Create a more complex element
const link = document.createElement("a");
link.href = "https://example.com";
link.target = "_blank";
link.rel = "noopener noreferrer";
link.textContent = "Visit Example";
link.classList.add("nav-link");

// Create a list
const ul = document.createElement("ul");
const items = ["Apple", "Banana", "Cherry"];

items.forEach((fruit) => {
  const li = document.createElement("li");
  li.textContent = fruit;
  li.classList.add("fruit-item");
  ul.appendChild(li);
});
```

### createTextNode

Creates a standalone text node. Useful when you need precise control over text insertion.

```js
const textNode = document.createTextNode("Hello, World!");
const paragraph = document.createElement("p");
paragraph.appendChild(textNode);

// Equivalent shortcut using textContent:
const p2 = document.createElement("p");
p2.textContent = "Hello, World!";
```

### createDocumentFragment

A `DocumentFragment` is a lightweight, "virtual" container that holds nodes in memory. When appended to the DOM, only its children are inserted (the fragment itself disappears). This is useful for batch insertions to minimize reflows.

```js
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i + 1}`;
  fragment.appendChild(li); // Appending to fragment (no reflow)
}

// Single reflow when fragment is appended to the DOM
document.getElementById("list").appendChild(fragment);
```

---

## Adding Elements to the DOM

### appendChild

Adds a node as the **last child** of a parent element. Returns the appended node.

```js
const parent = document.getElementById("container");
const child = document.createElement("p");
child.textContent = "New paragraph";

parent.appendChild(child);
// <div id="container">
//   ... existing children ...
//   <p>New paragraph</p>       <-- appended at the end
// </div>
```

> **Note:** If you `appendChild` a node that already exists in the DOM, it is **moved** (not cloned) to the new position.

### append and prepend

Modern methods that accept multiple arguments and both nodes and strings.

```js
const container = document.getElementById("container");

// append() - adds to the END (can accept strings and multiple nodes)
const p1 = document.createElement("p");
p1.textContent = "First";
container.append(p1, " Some text", document.createElement("hr"));
// Adds <p>First</p>, " Some text" (text node), and <hr> at the end

// prepend() - adds to the BEGINNING
const header = document.createElement("h2");
header.textContent = "Title";
container.prepend(header);
// <div id="container">
//   <h2>Title</h2>             <-- prepended at the start
//   ... existing children ...
//   <p>First</p> Some text<hr> <-- appended at the end
// </div>
```

| Feature         | `appendChild`           | `append`                       |
| --------------- | ----------------------- | ------------------------------ |
| Arguments       | Single node only        | Multiple nodes and strings     |
| Return value    | The appended node       | `undefined`                    |
| Accepts strings | No                      | Yes (converted to text nodes)  |
| Browser support | All browsers            | Modern browsers (IE excluded)  |

### insertBefore

Inserts a node before a specified reference child within a parent.

```html
<ul id="list">
  <li>First</li>
  <li id="third">Third</li>
</ul>
```

```js
const list = document.getElementById("list");
const third = document.getElementById("third");

const second = document.createElement("li");
second.textContent = "Second";

// Insert "Second" before "Third"
list.insertBefore(second, third);
// Result:
// <ul id="list">
//   <li>First</li>
//   <li>Second</li>      <-- inserted here
//   <li id="third">Third</li>
// </ul>

// Insert at the end (pass null as reference)
const fourth = document.createElement("li");
fourth.textContent = "Fourth";
list.insertBefore(fourth, null); // Same as appendChild
```

### insertAdjacentHTML / insertAdjacentElement / insertAdjacentText

These methods offer precise control over where content is inserted relative to an element. They accept a **position** string as the first argument.

```
<!-- beforebegin -->
<div id="target">
  <!-- afterbegin -->
  Existing content
  <!-- beforeend -->
</div>
<!-- afterend -->
```

| Position        | Description                              |
| --------------- | ---------------------------------------- |
| `"beforebegin"` | Before the element itself (as a sibling) |
| `"afterbegin"`  | Inside the element, before first child   |
| `"beforeend"`   | Inside the element, after last child     |
| `"afterend"`    | After the element itself (as a sibling)  |

```js
const target = document.getElementById("target");

// insertAdjacentHTML - inserts raw HTML string
target.insertAdjacentHTML("beforebegin", "<p>Before the div</p>");
target.insertAdjacentHTML("afterbegin", "<p>First inside div</p>");
target.insertAdjacentHTML("beforeend", "<p>Last inside div</p>");
target.insertAdjacentHTML("afterend", "<p>After the div</p>");

// insertAdjacentElement - inserts an element node
const newEl = document.createElement("span");
newEl.textContent = "Inserted span";
target.insertAdjacentElement("afterbegin", newEl);

// insertAdjacentText - inserts a text node (no HTML parsing)
target.insertAdjacentText("beforeend", "Some safe text");
```

> **Advantage:** `insertAdjacentHTML` does NOT re-parse the existing content (unlike `innerHTML +=`), so it preserves existing event listeners and is more performant.

---

## Removing Elements

### removeChild

Removes a child node from its parent. You must have a reference to both the parent and the child. Returns the removed node.

```html
<ul id="list">
  <li id="item-1">Item 1</li>
  <li id="item-2">Item 2</li>
  <li id="item-3">Item 3</li>
</ul>
```

```js
const list = document.getElementById("list");
const item2 = document.getElementById("item-2");

// Remove item-2 from the list
const removed = list.removeChild(item2);
console.log(removed.textContent); // "Item 2"
// The node is removed from DOM but still exists in memory (via `removed`)

// Remove first child
list.removeChild(list.firstElementChild);

// Remove all children
while (list.firstChild) {
  list.removeChild(list.firstChild);
}
```

### remove

A simpler, modern method that removes the element itself. No parent reference needed.

```js
const item3 = document.getElementById("item-3");
item3.remove(); // Gone from the DOM

// Remove all children (alternative approaches)
const container = document.getElementById("container");

// Method 1: Set innerHTML to empty
container.innerHTML = "";

// Method 2: replaceChildren with no arguments (modern)
container.replaceChildren();

// Method 3: Loop removal
while (container.firstChild) {
  container.firstChild.remove();
}
```

---

## Replacing Elements

### replaceChild

Replaces one child node with another within a parent. Returns the replaced (old) node.

```html
<div id="wrapper">
  <p id="old">Old paragraph</p>
</div>
```

```js
const wrapper = document.getElementById("wrapper");
const oldP = document.getElementById("old");

const newH2 = document.createElement("h2");
newH2.textContent = "New heading";

// parent.replaceChild(newNode, oldNode)
const replaced = wrapper.replaceChild(newH2, oldP);
console.log(replaced.textContent); // "Old paragraph"
// Now: <div id="wrapper"><h2>New heading</h2></div>
```

### replaceWith

A modern method called on the element to be replaced. Accepts multiple nodes and strings.

```js
const oldElement = document.getElementById("old");

// Replace with a single element
const newElement = document.createElement("div");
newElement.textContent = "Replacement";
oldElement.replaceWith(newElement);

// Replace with multiple nodes and text
const heading = document.createElement("h3");
heading.textContent = "Title";
oldElement.replaceWith(heading, " - ", document.createElement("hr"));

// replaceChildren() - replaces ALL children of an element
const parent = document.getElementById("container");
const newChild1 = document.createElement("p");
newChild1.textContent = "Only child now";
parent.replaceChildren(newChild1); // Removes all existing, adds newChild1
```

---

## Cloning Elements

### cloneNode

Creates a copy of a node. Accepts a boolean parameter indicating whether to perform a **deep clone** (including all descendants) or a **shallow clone** (only the node itself).

```html
<div id="template" class="card">
  <h3>Card Title</h3>
  <p>Card description goes here.</p>
  <button class="btn">Click Me</button>
</div>
```

```js
const template = document.getElementById("template");

// Shallow clone - only the <div> itself, no children
const shallow = template.cloneNode(false);
console.log(shallow.outerHTML);
// <div id="template" class="card"></div>

// Deep clone - the <div> and ALL descendants
const deep = template.cloneNode(true);
console.log(deep.outerHTML);
// <div id="template" class="card">
//   <h3>Card Title</h3>
//   <p>Card description goes here.</p>
//   <button class="btn">Click Me</button>
// </div>

// IMPORTANT: Change the id to avoid duplicates
deep.id = "card-copy";
deep.querySelector("h3").textContent = "Cloned Card";

document.body.appendChild(deep);
```

> **Important notes about cloneNode:**
> - The cloned node is **not** attached to the DOM until you insert it.
> - `id` attributes are cloned too. You **must** change them to maintain unique IDs.
> - Event listeners added via `addEventListener` are **NOT** cloned. Only inline event handlers (e.g., `onclick="..."` in HTML) are cloned.
> - The `cloneNode` call does not invoke any constructor or lifecycle callback.

### Practical Example: Card Generator

```js
function createCards(data) {
  const template = document.getElementById("card-template");
  const container = document.getElementById("cards-container");
  const fragment = document.createDocumentFragment();

  data.forEach((item, index) => {
    const card = template.cloneNode(true);
    card.id = `card-${index}`;
    card.querySelector("h3").textContent = item.title;
    card.querySelector("p").textContent = item.description;
    card.style.display = "block"; // Template might be hidden
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

createCards([
  { title: "Card 1", description: "First card" },
  { title: "Card 2", description: "Second card" },
  { title: "Card 3", description: "Third card" },
]);
```

---

## DOMContentLoaded Event

The `DOMContentLoaded` event fires when the HTML document has been completely parsed and all deferred scripts have been executed. It does **not** wait for stylesheets, images, or subframes to finish loading.

```js
// Fires when DOM is ready (before images/CSS fully load)
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM is fully parsed and ready!");
  const el = document.getElementById("app"); // Safe to access
  el.textContent = "App initialized";
});

// Comparison: 'load' waits for EVERYTHING (images, CSS, iframes)
window.addEventListener("load", () => {
  console.log("All resources (images, CSS, etc.) are fully loaded!");
});
```

### Why DOMContentLoaded Matters

```html
<!DOCTYPE html>
<html>
<head>
  <script>
    // This runs BEFORE the body is parsed
    // document.getElementById("app") would return null here!

    document.addEventListener("DOMContentLoaded", () => {
      // This runs AFTER the full DOM is parsed
      document.getElementById("app").textContent = "Ready!"; // Works!
    });
  </script>
</head>
<body>
  <div id="app">Loading...</div>
</body>
</html>
```

### Script Placement Alternatives

| Approach                           | When Script Runs            | DOM Available? |
| ---------------------------------- | --------------------------- | -------------- |
| `<script>` in `<head>`            | During HTML parsing (blocks)| No             |
| `<script defer>` in `<head>`      | After DOM parse, before DOMContentLoaded | Yes |
| `<script>` at end of `<body>`     | After body is parsed        | Yes            |
| `DOMContentLoaded` listener       | After full DOM parse        | Yes            |

> **Modern best practice:** Use `<script defer src="...">` in the `<head>`. It downloads in parallel and executes after parsing, making `DOMContentLoaded` listeners unnecessary in most cases.

---

## Best Practices

### 1. Minimize DOM Manipulation

Every DOM modification can trigger layout recalculation (reflow) and repaint. Batch your changes.

```js
// BAD: Multiple reflows
const list = document.getElementById("list");
for (let i = 0; i < 100; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;
  list.appendChild(li); // Reflow on each iteration
}

// GOOD: Single reflow using DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
list.appendChild(fragment); // Single reflow
```

### 2. Avoid innerHTML for User Input (XSS Prevention)

```js
const userInput = '<img src=x onerror="alert(\'Hacked!\')">';

// DANGEROUS: XSS vulnerability
element.innerHTML = userInput; // Executes the onerror script!

// SAFE: textContent escapes HTML
element.textContent = userInput; // Displays the raw string as text
```

### 3. Cache DOM References

```js
// BAD: Queries the DOM repeatedly
for (let i = 0; i < 100; i++) {
  document.getElementById("output").textContent += `Line ${i}\n`;
}

// GOOD: Query once, reuse the reference
const output = document.getElementById("output");
let text = "";
for (let i = 0; i < 100; i++) {
  text += `Line ${i}\n`;
}
output.textContent = text;
```

### 4. Prefer classList Over className

```js
// BAD: Overwrites all classes or requires string manipulation
element.className = "new-class"; // Loses all existing classes
element.className += " new-class"; // Can add duplicates

// GOOD: Precise class manipulation
element.classList.add("new-class");    // Adds without affecting others
element.classList.remove("old-class"); // Removes only the specified class
element.classList.toggle("active");    // Toggles cleanly
```

### 5. Use insertAdjacentHTML Over innerHTML +=

```js
// BAD: Re-parses entire content, destroys event listeners
container.innerHTML += "<p>New content</p>";

// GOOD: Only parses the new content
container.insertAdjacentHTML("beforeend", "<p>New content</p>");
```

### 6. Prefer Modern Methods

```js
// Old way
parent.removeChild(child);
parent.replaceChild(newChild, oldChild);
parent.insertBefore(newChild, referenceChild);

// Modern way (cleaner, more readable)
child.remove();
oldChild.replaceWith(newChild);
referenceChild.before(newChild);    // Insert before
referenceChild.after(newChild);     // Insert after
```
