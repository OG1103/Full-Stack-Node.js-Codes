# DOM Events

## Table of Contents

- [Event Listeners](#event-listeners)
- [onclick vs addEventListener](#onclick-vs-addeventlistener)
- [The Event Object](#the-event-object)
- [Common DOM Events](#common-dom-events)
- [Preventing Default Behavior](#preventing-default-behavior)
- [Event Propagation](#event-propagation)
- [Stopping Propagation](#stopping-propagation)
- [Event Delegation](#event-delegation)
- [Event Listener Options](#event-listener-options)
- [Custom Events](#custom-events)

---

## Event Listeners

Events are actions or occurrences that happen in the browser -- user clicks, key presses, page loads, form submissions, and more. JavaScript can "listen" for these events and execute code in response.

### addEventListener Syntax

```js
element.addEventListener(eventType, handler, options);
```

| Parameter   | Type                    | Description                                      |
| ----------- | ----------------------- | ------------------------------------------------ |
| `eventType` | `string`                | The event name (e.g., `"click"`, `"keydown"`)    |
| `handler`   | `function` or `object`  | The callback function to execute                 |
| `options`   | `object` or `boolean`   | Optional configuration (capture, once, passive)  |

```js
const button = document.getElementById("myBtn");

// Named function handler
function handleClick(event) {
  console.log("Button clicked!", event.target);
}
button.addEventListener("click", handleClick);

// Anonymous function handler
button.addEventListener("click", function (event) {
  console.log("Anonymous handler");
});

// Arrow function handler
button.addEventListener("click", (event) => {
  console.log("Arrow function handler");
});
```

### Removing Event Listeners with removeEventListener

To remove a listener, you must pass the **exact same function reference** that was used to add it. Anonymous functions and arrow functions cannot be removed because there is no reference to pass.

```js
const button = document.getElementById("myBtn");

// Named function - CAN be removed
function handleClick() {
  console.log("Clicked!");
}
button.addEventListener("click", handleClick);
button.removeEventListener("click", handleClick); // Works

// Anonymous function - CANNOT be removed
button.addEventListener("click", function () {
  console.log("Cannot remove this");
});
// No way to reference the anonymous function for removal

// Arrow function - also CANNOT be removed (if inline)
button.addEventListener("click", () => {
  console.log("Cannot remove this either");
});

// Solution: Store arrow functions in a variable
const handler = () => console.log("Removable arrow function");
button.addEventListener("click", handler);
button.removeEventListener("click", handler); // Works
```

> **Important:** `removeEventListener` must match the same `eventType`, `handler` reference, and `capture` option used in `addEventListener`. If any of these differ, the removal silently fails.

---

## onclick vs addEventListener

There are two ways to attach event handlers: **inline event properties** (e.g., `onclick`) and **addEventListener**. The key difference is that `addEventListener` allows **multiple handlers** for the same event.

### Inline Event Property (onclick)

```js
const button = document.getElementById("myBtn");

// Only ONE handler can be assigned
button.onclick = function () {
  console.log("First handler");
};

// This REPLACES the first handler
button.onclick = function () {
  console.log("Second handler"); // Only this one runs
};

// Remove by setting to null
button.onclick = null;
```

### addEventListener (Preferred)

```js
const button = document.getElementById("myBtn");

// Multiple handlers on the same event
button.addEventListener("click", () => {
  console.log("First handler"); // Runs
});

button.addEventListener("click", () => {
  console.log("Second handler"); // Also runs
});

button.addEventListener("click", () => {
  console.log("Third handler"); // Also runs
});
// All three handlers execute in order of registration
```

### Comparison

| Feature                | `onclick` (property)  | `addEventListener`            |
| ---------------------- | --------------------- | ----------------------------- |
| Multiple handlers      | No (last one wins)    | Yes (all execute in order)    |
| Capture phase support  | No                    | Yes (third parameter)         |
| Event options          | No                    | Yes (`once`, `passive`, etc.) |
| Removable              | Set to `null`         | `removeEventListener`         |
| Works in HTML          | `onclick="..."`       | No                            |
| Recommended            | No                    | **Yes**                       |

---

## The Event Object

When an event fires, the browser automatically passes an **Event object** to the handler function. This object contains detailed information about what happened.

```js
document.addEventListener("click", function (event) {
  // General properties (available on all events)
  console.log(event.type);          // "click"
  console.log(event.target);        // The element that was clicked
  console.log(event.currentTarget); // The element the listener is attached to
  console.log(event.timeStamp);     // Time (ms) since page load
  console.log(event.isTrusted);     // true if user-initiated, false if script-dispatched
  console.log(event.bubbles);       // true if the event bubbles
  console.log(event.cancelable);    // true if preventDefault() can be called
  console.log(event.eventPhase);    // 1=capture, 2=target, 3=bubble
});
```

### target vs currentTarget

This is one of the most important distinctions in event handling.

```html
<div id="parent">
  <button id="child">Click Me</button>
</div>
```

```js
const parent = document.getElementById("parent");

parent.addEventListener("click", function (event) {
  console.log(event.target);        // <button> - the element CLICKED
  console.log(event.currentTarget); // <div>    - the element with the LISTENER
  console.log(this);                // <div>    - same as currentTarget (with regular functions)
});
// When you click the button:
//   target = <button> (origin of the event)
//   currentTarget = <div> (where the listener is attached)
```

> **Note:** With arrow functions, `this` does NOT refer to `currentTarget`. Arrow functions inherit `this` from their enclosing scope.

### Mouse Event Properties

```js
document.addEventListener("click", function (event) {
  // Position relative to the viewport (visible area)
  console.log(event.clientX, event.clientY);

  // Position relative to the full page (including scrolled area)
  console.log(event.pageX, event.pageY);

  // Position relative to the screen (monitor)
  console.log(event.screenX, event.screenY);

  // Position relative to the target element's padding edge
  console.log(event.offsetX, event.offsetY);

  // Mouse button (0=left, 1=middle, 2=right)
  console.log(event.button);

  // Modifier keys held during click
  console.log(event.ctrlKey);   // true if Ctrl was held
  console.log(event.shiftKey);  // true if Shift was held
  console.log(event.altKey);    // true if Alt was held
  console.log(event.metaKey);   // true if Cmd (Mac) / Win key was held
});
```

### Keyboard Event Properties

```js
document.addEventListener("keydown", function (event) {
  console.log(event.key);      // The character: "a", "Enter", "ArrowUp", "Shift"
  console.log(event.code);     // Physical key: "KeyA", "Enter", "ArrowUp", "ShiftLeft"
  console.log(event.keyCode);  // Numeric code (deprecated): 65, 13, 38, 16
  console.log(event.repeat);   // true if key is held down (auto-repeat)

  // Modifier keys
  console.log(event.ctrlKey);
  console.log(event.shiftKey);
  console.log(event.altKey);
  console.log(event.metaKey);

  // Example: Detect Ctrl+S
  if (event.ctrlKey && event.key === "s") {
    event.preventDefault(); // Prevent browser save dialog
    console.log("Custom save action!");
  }
});
```

| Property   | Description                                | Example Values                    |
| ---------- | ------------------------------------------ | --------------------------------- |
| `key`      | The logical key value                      | `"a"`, `"A"`, `"Enter"`, `" "`   |
| `code`     | The physical key on the keyboard           | `"KeyA"`, `"Enter"`, `"Space"`   |
| `keyCode`  | Numeric code (deprecated, avoid)           | `65`, `13`, `32`                 |

> **key vs code:** `event.key` changes based on modifiers (Shift+A gives `"A"`, A alone gives `"a"`). `event.code` always identifies the physical key (`"KeyA"` regardless of Shift). Use `key` for character input, `code` for keyboard shortcuts.

---

## Common DOM Events

### Mouse Events

| Event          | Fires When                                       |
| -------------- | ------------------------------------------------ |
| `click`        | Element is clicked (mousedown + mouseup)         |
| `dblclick`     | Element is double-clicked                        |
| `mousedown`    | Mouse button is pressed down                     |
| `mouseup`      | Mouse button is released                         |
| `mousemove`    | Mouse pointer moves over the element             |
| `mouseover`    | Mouse enters element (bubbles, fires on children)|
| `mouseout`     | Mouse leaves element (bubbles, fires on children)|
| `mouseenter`   | Mouse enters element (does NOT bubble)           |
| `mouseleave`   | Mouse leaves element (does NOT bubble)           |
| `contextmenu`  | Right-click (context menu)                       |

```js
const box = document.getElementById("box");

// mouseover/mouseout vs mouseenter/mouseleave
box.addEventListener("mouseover", () => {
  // Fires when entering the element OR any child element
  console.log("mouseover");
});

box.addEventListener("mouseenter", () => {
  // Fires ONLY when entering the element itself (ignores children)
  console.log("mouseenter");
});

// Tracking mouse position
document.addEventListener("mousemove", (e) => {
  document.getElementById("coords").textContent = `X: ${e.clientX}, Y: ${e.clientY}`;
});

// Disabling right-click context menu
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  console.log("Right-click disabled");
});
```

### Keyboard Events

| Event      | Fires When                               | Note                           |
| ---------- | ---------------------------------------- | ------------------------------ |
| `keydown`  | A key is pressed down                    | Fires for ALL keys             |
| `keyup`    | A key is released                        | Fires for ALL keys             |
| `keypress` | A character key is pressed               | **Deprecated** -- use `keydown`|

```js
const input = document.getElementById("search");

input.addEventListener("keydown", (e) => {
  console.log(`Key pressed: ${e.key}`);

  if (e.key === "Enter") {
    console.log("Submit search:", input.value);
  }

  if (e.key === "Escape") {
    input.value = "";
    input.blur();
  }
});

input.addEventListener("keyup", (e) => {
  console.log(`Key released: ${e.key}`);
});
```

### Form Events

| Event    | Fires When                                         |
| -------- | -------------------------------------------------- |
| `submit` | Form is submitted                                  |
| `input`  | Value changes (fires on every keystroke/change)     |
| `change` | Value changes AND element loses focus (or select)   |
| `focus`  | Element gains focus                                |
| `blur`   | Element loses focus                                |
| `reset`  | Form is reset                                      |

```js
const form = document.getElementById("myForm");
const emailInput = document.getElementById("email");

// Submit event
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  console.log("Email:", formData.get("email"));
});

// Input event - fires on every keystroke
emailInput.addEventListener("input", (e) => {
  console.log("Current value:", e.target.value);
});

// Change event - fires when field loses focus after being modified
emailInput.addEventListener("change", (e) => {
  console.log("Final value:", e.target.value);
});

// Focus and blur
emailInput.addEventListener("focus", () => {
  emailInput.classList.add("focused");
});

emailInput.addEventListener("blur", () => {
  emailInput.classList.remove("focused");
});
```

### Window / Document Events

| Event                  | Fires When                                    |
| ---------------------- | --------------------------------------------- |
| `load`                 | Page and all resources are fully loaded        |
| `DOMContentLoaded`     | HTML is parsed; external resources may not be  |
| `beforeunload`         | User is about to leave the page               |
| `unload`               | Page is being unloaded                        |
| `resize`               | Browser window is resized                     |
| `scroll`               | Page or element is scrolled                   |

```js
// Window resize
window.addEventListener("resize", () => {
  console.log(`Window size: ${window.innerWidth}x${window.innerHeight}`);
});

// Scroll
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  console.log(`Scrolled: ${scrollTop}px`);
});

// Warn before leaving (e.g., unsaved changes)
window.addEventListener("beforeunload", (e) => {
  e.preventDefault();
  // Modern browsers ignore custom messages; they show their own
});
```

---

## Preventing Default Behavior

Many events have default browser behaviors. `event.preventDefault()` cancels that default action without stopping the event from propagating.

```js
// Prevent form submission (page reload)
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Form submitted via JavaScript");
});

// Prevent link navigation
const link = document.querySelector("a");
link.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Link click intercepted, URL:", e.target.href);
});

// Prevent checkbox toggle
const checkbox = document.querySelector('input[type="checkbox"]');
checkbox.addEventListener("click", (e) => {
  if (!confirm("Are you sure?")) {
    e.preventDefault(); // Checkbox state won't change
  }
});

// Prevent specific key input (e.g., numbers only)
const numericInput = document.getElementById("numeric");
numericInput.addEventListener("keydown", (e) => {
  // Allow: backspace, delete, tab, escape, enter, arrows
  const allowedKeys = ["Backspace", "Delete", "Tab", "Escape", "Enter",
                       "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

  if (allowedKeys.includes(e.key)) return;

  // Block non-numeric keys
  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
});
```

> **Checking if default was prevented:** Use `event.defaultPrevented` (returns `boolean`) to check if `preventDefault()` was called by any handler.

---

## Event Propagation

When an event occurs on an element, it does not just fire on that element. It travels through the DOM tree in three phases:

### The Three Phases

```
Phase 1: CAPTURING (top-down)
  document -> html -> body -> div -> button (target)

Phase 2: TARGET
  The event reaches the target element

Phase 3: BUBBLING (bottom-up)
  button (target) -> div -> body -> html -> document
```

```html
<div id="grandparent">
  <div id="parent">
    <button id="child">Click Me</button>
  </div>
</div>
```

### Bubbling Phase (Default)

By default, event listeners fire during the **bubbling** phase (Phase 3). Events bubble up from the target element to the root.

```js
document.getElementById("grandparent").addEventListener("click", () => {
  console.log("Grandparent - Bubble"); // Fires 3rd
});

document.getElementById("parent").addEventListener("click", () => {
  console.log("Parent - Bubble"); // Fires 2nd
});

document.getElementById("child").addEventListener("click", () => {
  console.log("Child - Bubble"); // Fires 1st (target)
});

// Clicking the button outputs:
// "Child - Bubble"
// "Parent - Bubble"
// "Grandparent - Bubble"
```

### Capturing Phase

To listen during the **capturing** phase (Phase 1), pass `true` or `{ capture: true }` as the third argument.

```js
document.getElementById("grandparent").addEventListener("click", () => {
  console.log("Grandparent - Capture"); // Fires 1st
}, true); // or { capture: true }

document.getElementById("parent").addEventListener("click", () => {
  console.log("Parent - Capture"); // Fires 2nd
}, true);

document.getElementById("child").addEventListener("click", () => {
  console.log("Child - Target"); // Fires 3rd (target phase)
});

document.getElementById("parent").addEventListener("click", () => {
  console.log("Parent - Bubble"); // Fires 4th
}); // Default: bubble phase

document.getElementById("grandparent").addEventListener("click", () => {
  console.log("Grandparent - Bubble"); // Fires 5th
});

// Clicking the button outputs:
// "Grandparent - Capture"
// "Parent - Capture"
// "Child - Target"
// "Parent - Bubble"
// "Grandparent - Bubble"
```

### Events That Do NOT Bubble

Some events do not bubble. They only fire on the target element itself.

| Event        | Bubbles? |
| ------------ | -------- |
| `click`      | Yes      |
| `keydown`    | Yes      |
| `submit`     | Yes      |
| `focus`      | **No**   |
| `blur`       | **No**   |
| `mouseenter` | **No**   |
| `mouseleave` | **No**   |
| `load`       | **No**   |
| `scroll`     | **No** (on most elements) |

> **Tip:** `focusin` and `focusout` are the bubbling equivalents of `focus` and `blur`.

---

## Stopping Propagation

### event.stopPropagation()

Prevents the event from continuing to the next element in the propagation chain (both bubbling and capturing). Other handlers on the **same** element still execute.

```js
document.getElementById("parent").addEventListener("click", () => {
  console.log("Parent clicked"); // This will NOT fire
});

document.getElementById("child").addEventListener("click", (e) => {
  e.stopPropagation(); // Stop bubbling here
  console.log("Child clicked - propagation stopped");
});

// Clicking the child button:
// "Child clicked - propagation stopped"
// Parent's handler does NOT fire
```

### event.stopImmediatePropagation()

Prevents **all** remaining handlers on the same element AND stops propagation to ancestors. More aggressive than `stopPropagation()`.

```js
const button = document.getElementById("myBtn");

button.addEventListener("click", (e) => {
  console.log("Handler 1"); // Fires
  e.stopImmediatePropagation();
});

button.addEventListener("click", () => {
  console.log("Handler 2"); // Does NOT fire (same element, but stopped)
});

document.body.addEventListener("click", () => {
  console.log("Body clicked"); // Does NOT fire (propagation also stopped)
});

// Clicking the button outputs only:
// "Handler 1"
```

### Comparison

| Method                        | Same Element's Other Handlers | Ancestor Handlers |
| ----------------------------- | ----------------------------- | ----------------- |
| (no stop)                     | Execute                       | Execute           |
| `stopPropagation()`           | Execute                       | **Blocked**       |
| `stopImmediatePropagation()`  | **Blocked**                   | **Blocked**       |

---

## Event Delegation

Event delegation is a powerful pattern where you attach a **single event listener** to a parent element instead of individual listeners on each child. It leverages event bubbling: when a child is clicked, the event bubbles up to the parent where the listener catches it.

### Why Use Event Delegation?

1. **Performance:** One listener instead of hundreds (e.g., large lists or tables).
2. **Dynamic elements:** Automatically handles elements added after the listener was attached.
3. **Memory efficiency:** Fewer event listener objects in memory.

### Basic Example

```html
<ul id="todo-list">
  <li>Buy groceries</li>
  <li>Walk the dog</li>
  <li>Read a book</li>
</ul>
```

```js
// BAD: Individual listeners on each <li>
// Must re-attach when new items are added
document.querySelectorAll("#todo-list li").forEach((li) => {
  li.addEventListener("click", function () {
    this.classList.toggle("completed");
  });
});

// GOOD: Single delegated listener on the parent <ul>
document.getElementById("todo-list").addEventListener("click", (e) => {
  // Check if the clicked element is an <li>
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("completed");
  }
});

// New items automatically work with the delegated listener
const newItem = document.createElement("li");
newItem.textContent = "New task";
document.getElementById("todo-list").appendChild(newItem);
// Clicking "New task" will toggle "completed" - no extra listener needed!
```

### Handling Nested Elements

When the click target is a nested element (e.g., a `<span>` inside an `<li>`), `event.target` will be the inner element. Use `closest()` to find the intended ancestor.

```html
<ul id="user-list">
  <li data-id="1">
    <span class="name">Alice</span>
    <button class="delete">X</button>
  </li>
  <li data-id="2">
    <span class="name">Bob</span>
    <button class="delete">X</button>
  </li>
</ul>
```

```js
document.getElementById("user-list").addEventListener("click", (e) => {
  // Handle delete button click
  if (e.target.classList.contains("delete")) {
    const li = e.target.closest("li");
    const userId = li.dataset.id;
    console.log(`Deleting user ${userId}`);
    li.remove();
    return;
  }

  // Handle clicking on the list item (or any child within it)
  const li = e.target.closest("li");
  if (li) {
    console.log(`Selected user: ${li.dataset.id}`);
    li.classList.toggle("selected");
  }
});
```

### Advanced Delegation: Multiple Actions

```html
<div id="toolbar">
  <button data-action="bold"><b>B</b></button>
  <button data-action="italic"><i>I</i></button>
  <button data-action="underline"><u>U</u></button>
  <button data-action="save">Save</button>
</div>
```

```js
const actions = {
  bold: () => document.execCommand("bold"),
  italic: () => document.execCommand("italic"),
  underline: () => document.execCommand("underline"),
  save: () => console.log("Document saved!"),
};

document.getElementById("toolbar").addEventListener("click", (e) => {
  const button = e.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  if (actions[action]) {
    actions[action]();
  }
});
```

---

## Event Listener Options

The third argument to `addEventListener` can be a boolean (for capture) or an options object with multiple settings.

### once Option

The handler fires **only once**, then is automatically removed.

```js
const button = document.getElementById("submitBtn");

button.addEventListener("click", () => {
  console.log("This runs only once!");
  // No need to manually removeEventListener
}, { once: true });

// After the first click, the listener is removed automatically
// Subsequent clicks do nothing
```

**Use cases:** One-time initialization, preventing double-submit, showing a tutorial tooltip once.

```js
// Prevent double form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  submitForm(new FormData(form));
}, { once: true });
```

### passive Option

Tells the browser that the handler will **never** call `preventDefault()`. This allows the browser to optimize scrolling and touch performance because it does not need to wait for the handler to complete before scrolling.

```js
// Passive scroll listener - browser scrolls immediately, does not wait for handler
window.addEventListener("scroll", () => {
  // Update scroll position indicator
  const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  document.getElementById("progress").style.width = `${scrollPercent}%`;
}, { passive: true });

// Passive touch listener - smoother touch scrolling on mobile
document.addEventListener("touchstart", (e) => {
  console.log("Touch started");
  // e.preventDefault(); // Would throw an error in passive mode!
}, { passive: true });
```

> **Note:** If you call `preventDefault()` inside a passive listener, the browser logs a console warning and ignores the call. In some browsers, `touchstart` and `touchmove` listeners are passive by default.

### Combining Options

```js
element.addEventListener("click", handler, {
  capture: true,   // Listen during capture phase
  once: true,      // Remove after first invocation
  passive: false,  // Allow preventDefault() (default)
});
```

### signal Option (AbortController)

You can use an `AbortController` to remove listeners programmatically, which is especially useful for removing multiple listeners at once.

```js
const controller = new AbortController();

button.addEventListener("click", handleClick, { signal: controller.signal });
window.addEventListener("resize", handleResize, { signal: controller.signal });
document.addEventListener("keydown", handleKey, { signal: controller.signal });

// Remove ALL listeners at once
controller.abort();
// All three listeners above are removed
```

---

## Custom Events

JavaScript allows you to create and dispatch your own events using the `CustomEvent` constructor. This is powerful for building decoupled, event-driven architectures.

### Creating and Dispatching Custom Events

```js
// Create a custom event
const event = new CustomEvent("userLoggedIn", {
  detail: {
    userId: 42,
    username: "alice",
    timestamp: Date.now(),
  },
  bubbles: true,    // Allow event to bubble up the DOM
  cancelable: true, // Allow preventDefault() to be called
});

// Listen for the custom event
document.addEventListener("userLoggedIn", (e) => {
  console.log("User logged in:", e.detail.username);
  console.log("User ID:", e.detail.userId);
  console.log("Timestamp:", e.detail.timestamp);
});

// Dispatch the event
document.dispatchEvent(event);
// Output:
// "User logged in: alice"
// "User ID: 42"
```

### The detail Property

The `detail` property is how you pass custom data with your event. It can contain any value -- objects, arrays, strings, numbers, etc.

```js
// String detail
const simpleEvent = new CustomEvent("notify", {
  detail: "Hello from custom event!",
});

// Complex object detail
const complexEvent = new CustomEvent("dataLoaded", {
  detail: {
    records: [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ],
    total: 2,
    page: 1,
  },
});

document.addEventListener("dataLoaded", (e) => {
  console.log(`Loaded ${e.detail.total} records on page ${e.detail.page}`);
  e.detail.records.forEach((r) => console.log(r.name));
});

document.dispatchEvent(complexEvent);
```

### Event Bubbling with Custom Events

By default, custom events do **not** bubble. Set `bubbles: true` to enable bubbling through the DOM tree.

```html
<div id="app">
  <div id="sidebar">
    <button id="menuBtn">Menu</button>
  </div>
</div>
```

```js
// Listen on a parent element
document.getElementById("app").addEventListener("menuToggle", (e) => {
  console.log("App caught menuToggle:", e.detail.isOpen);
});

// Dispatch from a child element - with bubbles: true, it reaches #app
document.getElementById("menuBtn").addEventListener("click", () => {
  const event = new CustomEvent("menuToggle", {
    detail: { isOpen: true },
    bubbles: true, // Event will bubble up to #sidebar, then #app, then body, etc.
  });
  document.getElementById("sidebar").dispatchEvent(event);
});
```

```js
// Without bubbles: true
const noBubble = new CustomEvent("test", { bubbles: false });
document.getElementById("sidebar").dispatchEvent(noBubble);
// Only listeners directly on #sidebar will catch this event
```

### Cancelable Custom Events

When `cancelable: true` is set, listeners can call `preventDefault()`. The code that dispatched the event can check `event.defaultPrevented` to decide whether to proceed.

```js
function deleteItem(itemId) {
  const event = new CustomEvent("itemDeleting", {
    detail: { itemId },
    bubbles: true,
    cancelable: true,
  });

  const element = document.getElementById(`item-${itemId}`);

  // dispatchEvent returns false if preventDefault() was called
  const wasAllowed = element.dispatchEvent(event);

  if (wasAllowed) {
    // No listener prevented the event
    element.remove();
    console.log(`Item ${itemId} deleted`);
  } else {
    // A listener called preventDefault()
    console.log(`Deletion of item ${itemId} was cancelled`);
  }
}

// A listener that conditionally cancels the event
document.addEventListener("itemDeleting", (e) => {
  if (e.detail.itemId === 1) {
    e.preventDefault(); // Prevent deletion of item 1
    console.log("Cannot delete the first item!");
  }
});

deleteItem(1); // "Cannot delete the first item!" -- deletion cancelled
deleteItem(2); // "Item 2 deleted" -- deletion proceeds
```

### Practical Example: Component Communication

Custom events are ideal for communication between independent UI components.

```js
// Notification system
class NotificationManager {
  constructor() {
    document.addEventListener("showNotification", (e) => {
      this.show(e.detail);
    });
  }

  show({ message, type = "info", duration = 3000 }) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.getElementById("notification-area").appendChild(notification);

    setTimeout(() => notification.remove(), duration);
  }
}

// Initialize once
const notificationManager = new NotificationManager();

// Any component can now trigger notifications
function saveUserProfile() {
  // ... save logic ...

  document.dispatchEvent(
    new CustomEvent("showNotification", {
      detail: {
        message: "Profile saved successfully!",
        type: "success",
        duration: 5000,
      },
    })
  );
}

function handleError(error) {
  document.dispatchEvent(
    new CustomEvent("showNotification", {
      detail: {
        message: `Error: ${error.message}`,
        type: "error",
        duration: 10000,
      },
    })
  );
}
```

### Custom Event vs Regular Event

```js
// new Event() - basic event without custom data
const basicEvent = new Event("myEvent", { bubbles: true });
// No way to attach custom data

// new CustomEvent() - event with custom data via detail
const customEvent = new CustomEvent("myEvent", {
  detail: { key: "value" },
  bubbles: true,
  cancelable: true,
});
```

| Feature          | `new Event()`       | `new CustomEvent()`     |
| ---------------- | ------------------- | ----------------------- |
| Custom data      | No                  | Yes (via `detail`)      |
| `bubbles` option | Yes                 | Yes                     |
| `cancelable`     | Yes                 | Yes                     |
| Use case         | Simple signals      | Data-carrying events    |
