# DOM Traversal and Form Handling

---

## Part 1: DOM Traversal

DOM traversal is navigating between elements in the DOM tree - moving to parents, children, and siblings relative to a given element.

---

### 1.1 Parent Navigation

```javascript
const child = document.getElementById("child");

// parentNode - returns parent (could be any node type)
child.parentNode;

// parentElement - returns parent element only (skips text/comment nodes)
child.parentElement;

// closest() - finds nearest ancestor matching a CSS selector (including self)
child.closest(".container");    // Nearest ancestor with class "container"
child.closest("div");           // Nearest ancestor <div>
child.closest("#wrapper");      // Nearest ancestor with id "wrapper"
// Returns null if no match found
```

### Example: Closest

```javascript
// HTML: <div class="card"><div class="body"><button>Click</button></div></div>
const button = document.querySelector("button");
const card = button.closest(".card"); // Finds the .card ancestor
```

---

### 1.2 Child Navigation

```javascript
const parent = document.getElementById("parent");

// childNodes - ALL child nodes (elements, text, comments)
parent.childNodes;          // NodeList (includes whitespace text nodes)

// children - only child ELEMENTS (HTMLCollection)
parent.children;            // HTMLCollection (no text/comment nodes)
parent.children.length;     // Number of child elements
parent.children[0];         // First child element

// First and last children
parent.firstChild;          // First child node (may be text/whitespace)
parent.firstElementChild;   // First child ELEMENT
parent.lastChild;           // Last child node
parent.lastElementChild;    // Last child ELEMENT
```

> **Tip**: Always prefer `children`, `firstElementChild`, `lastElementChild` over `childNodes`, `firstChild`, `lastChild` unless you specifically need text/comment nodes.

---

### 1.3 Sibling Navigation

```javascript
const element = document.getElementById("middle");

// Next sibling
element.nextSibling;            // Next node (may be text)
element.nextElementSibling;     // Next ELEMENT sibling

// Previous sibling
element.previousSibling;        // Previous node (may be text)
element.previousElementSibling; // Previous ELEMENT sibling
```

### Example: Navigating Siblings

```javascript
// HTML: <ul><li>A</li><li id="b">B</li><li>C</li></ul>
const b = document.getElementById("b");

b.previousElementSibling.textContent; // "A"
b.nextElementSibling.textContent;     // "C"
```

---

### 1.4 Querying Descendants

`querySelector` and `querySelectorAll` can be called on **any element**, not just `document`.

```javascript
const container = document.getElementById("container");

// Find first matching descendant
const firstButton = container.querySelector("button");
const activeItem = container.querySelector(".active");

// Find all matching descendants
const allLinks = container.querySelectorAll("a");
const allItems = container.querySelectorAll(".list-item");

// Chaining
const nestedItem = container.querySelector(".section").querySelector(".item");
```

---

### 1.5 Live vs Static Collections

| Collection Type | Example | Auto-Updates? |
|----------------|---------|---------------|
| **Live** (HTMLCollection) | `element.children`, `getElementsByClassName()` | Yes |
| **Static** (NodeList) | `querySelectorAll()` | No |

```javascript
const parent = document.getElementById("list");

// Live collection - updates automatically
const liveItems = parent.children;
console.log(liveItems.length); // 3

parent.appendChild(document.createElement("li"));
console.log(liveItems.length); // 4 (automatically updated!)

// Static collection - snapshot, doesn't update
const staticItems = parent.querySelectorAll("li");
console.log(staticItems.length); // 4

parent.appendChild(document.createElement("li"));
console.log(staticItems.length); // Still 4 (not updated)
```

---

### 1.6 Recursive DOM Traversal

```javascript
function traverseDOM(element, callback) {
  callback(element);
  let child = element.firstElementChild;
  while (child) {
    traverseDOM(child, callback);
    child = child.nextElementSibling;
  }
}

// Log all element tag names in the body
traverseDOM(document.body, el => {
  console.log(el.tagName);
});
```

---

### 1.7 Adding, Removing, Replacing Elements

```javascript
const parent = document.getElementById("list");

// Add elements
const newItem = document.createElement("li");
newItem.textContent = "New Item";
parent.appendChild(newItem);          // Add at end
parent.prepend(newItem);              // Add at beginning
parent.insertBefore(newItem, parent.children[1]); // Before 2nd child

// insertAdjacentHTML - insert HTML string at specific position
parent.insertAdjacentHTML("beforeend", "<li>Another Item</li>");
// Positions: "beforebegin" | "afterbegin" | "beforeend" | "afterend"

// Remove elements
parent.removeChild(newItem);  // Remove specific child
newItem.remove();             // Remove element directly

// Replace elements
const replacement = document.createElement("li");
replacement.textContent = "Replacement";
parent.replaceChild(replacement, parent.firstElementChild);

// Clone elements
const clone = newItem.cloneNode(true);  // true = deep clone (includes children)
const shallowClone = newItem.cloneNode(false); // false = element only, no children
```

---

### 1.8 Traversal Summary Table

| Property/Method | Returns | Includes Text Nodes? |
|----------------|---------|---------------------|
| `parentNode` | Parent node | N/A |
| `parentElement` | Parent element | N/A |
| `closest(selector)` | Nearest matching ancestor | N/A |
| `childNodes` | All child nodes | Yes |
| `children` | Child elements only | No |
| `firstChild` | First child node | Yes |
| `firstElementChild` | First child element | No |
| `lastChild` | Last child node | Yes |
| `lastElementChild` | Last child element | No |
| `nextSibling` | Next sibling node | Yes |
| `nextElementSibling` | Next sibling element | No |
| `previousSibling` | Previous sibling node | Yes |
| `previousElementSibling` | Previous sibling element | No |

---

## Part 2: Form Handling and Validation

---

### 2.1 Accessing Form Elements

```javascript
// By ID
const form = document.getElementById("signup-form");
const emailInput = document.getElementById("email");

// By querySelector
const passwordInput = document.querySelector('input[name="password"]');
const submitBtn = document.querySelector('button[type="submit"]');

// Access input values
const emailValue = emailInput.value;       // Current text in the input
const isChecked = checkbox.checked;        // Boolean for checkboxes
const selectedValue = selectElement.value; // Selected option value
```

---

### 2.2 Handling Form Submission

```javascript
const form = document.getElementById("signup-form");

form.addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent default page reload

  // Collect form data
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Validate
  if (validateForm(username, email, password)) {
    console.log("Form is valid, submitting...");
    // Send to server with fetch/axios
  }
});
```

### Using FormData

```javascript
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  // Access individual fields
  const email = formData.get("email");

  // Convert to plain object
  const data = Object.fromEntries(formData);
  console.log(data); // { username: "alice", email: "a@b.com", ... }

  // Send to server
  fetch("/api/signup", {
    method: "POST",
    body: formData // or JSON.stringify(data)
  });
});
```

---

### 2.3 Basic Form Validation

```javascript
function validateForm(username, email, password) {
  const errors = [];

  // Required field check
  if (username.trim() === "") {
    errors.push("Username is required");
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push("Please enter a valid email");
  }

  // Password length check
  if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (errors.length > 0) {
    displayErrors(errors);
    return false;
  }

  return true;
}
```

---

### 2.4 Advanced Password Validation

```javascript
function validatePassword(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push("At least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("At least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("At least one lowercase letter");
  }
  if (!/\d/.test(password)) {
    errors.push("At least one number");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("At least one special character (!@#$%^&*)");
  }

  return errors;
}
```

---

### 2.5 Real-Time Validation

Provide immediate feedback as the user types, using `input` or `change` events.

```javascript
const emailInput = document.getElementById("email");
const emailError = document.getElementById("email-error");

emailInput.addEventListener("input", function() {
  const email = emailInput.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email === "") {
    emailInput.classList.remove("error", "success");
    emailError.textContent = "";
  } else if (!emailRegex.test(email)) {
    emailInput.classList.add("error");
    emailInput.classList.remove("success");
    emailError.textContent = "Invalid email format";
  } else {
    emailInput.classList.add("success");
    emailInput.classList.remove("error");
    emailError.textContent = "";
  }
});

// Validate on blur (when user leaves the field)
emailInput.addEventListener("blur", function() {
  if (emailInput.value.trim() === "") {
    emailInput.classList.add("error");
    emailError.textContent = "Email is required";
  }
});
```

---

### 2.6 HTML5 Built-In Validation

HTML5 provides validation attributes that browsers enforce automatically.

```html
<form id="myForm">
  <input type="email" required>                    <!-- Must be valid email -->
  <input type="text" minlength="3" maxlength="20"> <!-- Length constraints -->
  <input type="number" min="1" max="100">          <!-- Range constraints -->
  <input type="text" pattern="[A-Za-z]{3,}">       <!-- Custom regex pattern -->
  <input type="url" required>                      <!-- Must be valid URL -->
  <button type="submit">Submit</button>
</form>
```

### Checking Validity with JavaScript

```javascript
const input = document.getElementById("email");

// Check single input validity
if (!input.checkValidity()) {
  console.log(input.validationMessage);
  // e.g., "Please include an '@' in the email address."
}

// Check entire form validity
if (!form.checkValidity()) {
  form.reportValidity(); // Shows browser's built-in error messages
}

// Custom validity message
input.setCustomValidity("Please use your company email");
// Clear custom validity (required to allow submission)
input.setCustomValidity("");
```

---

### 2.7 Styling Validation Feedback

```javascript
function setValidationState(input, isValid, message = "") {
  const errorSpan = input.nextElementSibling; // Assumes error span follows input

  if (isValid) {
    input.classList.remove("error");
    input.classList.add("success");
    if (errorSpan) errorSpan.textContent = "";
  } else {
    input.classList.add("error");
    input.classList.remove("success");
    if (errorSpan) errorSpan.textContent = message;
  }
}

// Usage
usernameInput.addEventListener("input", () => {
  const value = usernameInput.value.trim();
  if (value.length < 3) {
    setValidationState(usernameInput, false, "Username must be at least 3 characters");
  } else {
    setValidationState(usernameInput, true);
  }
});
```

---

### 2.8 Best Practices

- **Always validate on the server side** - client-side validation improves UX but can be bypassed
- **Provide real-time feedback** - validate on `input` or `blur` events, not just on submit
- **Use clear error messages** - tell users exactly what's wrong and how to fix it
- **Combine HTML5 and JS validation** - use HTML5 attributes for basic validation, JS for complex rules
- **Consider accessibility** - use `aria-invalid`, `aria-describedby`, and meaningful error messages
- **Don't block users unnecessarily** - let them continue filling the form while showing errors inline
- **Use `preventDefault()`** - prevent form submission until validation passes

---

### 2.9 Summary

| Task | Method/Property |
|------|----------------|
| Get input value | `input.value` |
| Get checkbox state | `input.checked` |
| Get select value | `select.value` |
| Listen for submit | `form.addEventListener("submit", handler)` |
| Prevent page reload | `event.preventDefault()` |
| Collect all form data | `new FormData(form)` |
| Real-time validation | `input.addEventListener("input", handler)` |
| Check validity | `input.checkValidity()` |
| Show browser errors | `form.reportValidity()` |
| Custom error message | `input.setCustomValidity(msg)` |
