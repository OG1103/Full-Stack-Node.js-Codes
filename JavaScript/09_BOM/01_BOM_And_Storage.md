# Browser Object Model (BOM) and Web Storage

The BOM provides JavaScript access to the browser itself - its window, location, history, screen, and more. Unlike the DOM (which interacts with the HTML document), the BOM interacts with the browser as a whole.

---

## 1. The Window Object

The `window` object is the **global object** in the browser. All global variables and functions are properties/methods of `window`.

```javascript
// These are equivalent
var myVar = "hello";
window.myVar;           // "hello"

// Window properties
window.innerWidth;      // Viewport width in pixels
window.innerHeight;     // Viewport height in pixels
window.outerWidth;      // Browser window width (including scrollbar, toolbar)
window.outerHeight;     // Browser window height
window.scrollX;         // Horizontal scroll position
window.scrollY;         // Vertical scroll position

// Window methods
window.open("https://example.com");      // Open new window/tab
window.close();                           // Close current window
window.moveTo(100, 100);                 // Move window (limited by browsers)
window.resizeTo(800, 600);               // Resize window (limited by browsers)
window.scrollTo(0, 500);                 // Scroll to position
window.scrollBy(0, 100);                 // Scroll by amount
window.print();                           // Open print dialog
```

### The `document` Object Is Part of `window`

```javascript
window.document === document; // true
// The DOM is a property of the BOM
```

---

## 2. Window Location

`window.location` provides information about the current URL and methods to navigate.

```javascript
// Properties (for URL: https://example.com:8080/path/page?q=hello#section)
location.href;       // "https://example.com:8080/path/page?q=hello#section" (full URL)
location.protocol;   // "https:"
location.hostname;   // "example.com"
location.port;       // "8080"
location.host;       // "example.com:8080" (hostname + port)
location.pathname;   // "/path/page"
location.search;     // "?q=hello"
location.hash;       // "#section"
location.origin;     // "https://example.com:8080"

// Navigation methods
location.assign("https://google.com");  // Navigate to URL (adds to history)
location.replace("https://google.com"); // Navigate to URL (replaces in history)
location.reload();                       // Reload current page

// Shorthand navigation
location.href = "https://google.com";    // Same as assign()
```

---

## 3. Window Navigator

`window.navigator` provides information about the browser and device.

```javascript
navigator.userAgent;   // Browser identification string
navigator.language;    // Browser language ("en-US", "fr", etc.)
navigator.languages;   // Array of preferred languages
navigator.onLine;      // true if connected to internet
navigator.platform;    // OS platform ("Win32", "MacIntel", etc.)
navigator.cookieEnabled; // true if cookies are enabled

// Geolocation
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log("Lat:", position.coords.latitude);
    console.log("Lng:", position.coords.longitude);
  },
  (error) => {
    console.error("Geolocation error:", error.message);
  }
);

// Clipboard
await navigator.clipboard.writeText("Copied text!");
const text = await navigator.clipboard.readText();
```

---

## 4. Window History

`window.history` allows navigation through the browser's session history.

```javascript
history.back();       // Go back one page (same as browser back button)
history.forward();    // Go forward one page
history.go(-2);       // Go back 2 pages
history.go(1);        // Go forward 1 page
history.length;       // Number of entries in history

// pushState - add to history without page reload (used in SPAs)
history.pushState({ page: "about" }, "About", "/about");
// Parameters: (stateObject, title, url)

// replaceState - replace current history entry
history.replaceState({ page: "home" }, "Home", "/");

// Listen for back/forward navigation
window.addEventListener("popstate", (event) => {
  console.log("Navigated to:", event.state);
});
```

---

## 5. Window Screen

`window.screen` provides information about the user's screen.

```javascript
screen.width;        // Total screen width in pixels
screen.height;       // Total screen height in pixels
screen.availWidth;   // Screen width minus OS taskbar
screen.availHeight;  // Screen height minus OS taskbar
screen.colorDepth;   // Color depth in bits
screen.pixelDepth;   // Pixel depth
screen.orientation;  // Screen orientation object
```

---

## 6. Pop-Up Boxes

### `alert()` - Display Message

```javascript
alert("Hello, World!");
// Displays a message box with OK button
// Blocks execution until dismissed
```

### `confirm()` - OK/Cancel Dialog

```javascript
const result = confirm("Are you sure you want to delete this?");

if (result) {
  console.log("User clicked OK");
  // Proceed with deletion
} else {
  console.log("User clicked Cancel");
  // Abort
}
```

### `prompt()` - User Input Dialog

```javascript
const name = prompt("What is your name?", "Guest");
// Second argument is the default value

if (name !== null && name !== "") {
  console.log(`Hello, ${name}!`);
} else {
  console.log("User cancelled or entered nothing");
}
```

> **Note**: All three pop-up boxes **block** the main thread. Use them sparingly - prefer custom modal dialogs for better UX.

---

## 7. Timing Events

### `setTimeout()` - Execute Once After Delay

```javascript
// Execute after 3 seconds (3000ms)
const timeoutId = setTimeout(() => {
  console.log("This runs after 3 seconds");
}, 3000);

// Cancel before it executes
clearTimeout(timeoutId);
```

### `setInterval()` - Execute Repeatedly

```javascript
// Execute every 2 seconds
const intervalId = setInterval(() => {
  console.log("This runs every 2 seconds");
}, 2000);

// Stop the interval
clearInterval(intervalId);
```

### Practical Example: Progress Bar

```javascript
function startProgressBar() {
  const bar = document.getElementById("progress");
  let width = 0;

  const intervalId = setInterval(() => {
    if (width >= 100) {
      clearInterval(intervalId);
      console.log("Progress complete!");
    } else {
      width++;
      bar.style.width = width + "%";
      bar.textContent = width + "%";
    }
  }, 50);
}
```

### Practical Example: Countdown Timer

```javascript
function countdown(seconds) {
  let remaining = seconds;
  const display = document.getElementById("timer");

  const intervalId = setInterval(() => {
    display.textContent = remaining;
    remaining--;

    if (remaining < 0) {
      clearInterval(intervalId);
      display.textContent = "Time's up!";
    }
  }, 1000);
}

countdown(10);
```

### `requestAnimationFrame()` - Smooth Animations

```javascript
// Better than setInterval for animations - syncs with display refresh rate
function animate() {
  // Update animation state
  element.style.left = position + "px";
  position += 2;

  if (position < 500) {
    requestAnimationFrame(animate); // Schedule next frame
  }
}

const animationId = requestAnimationFrame(animate);

// Cancel animation
cancelAnimationFrame(animationId);
```

---

## 8. localStorage

Stores data persistently with **no expiration**. Data survives browser close, restart, and even device restart.

```javascript
// Store data (value must be a string)
localStorage.setItem("username", "Alice");
localStorage.setItem("theme", "dark");

// Store objects/arrays (must stringify)
const user = { name: "Alice", age: 30 };
localStorage.setItem("user", JSON.stringify(user));

// Retrieve data
const username = localStorage.getItem("username"); // "Alice"
const storedUser = JSON.parse(localStorage.getItem("user")); // { name: "Alice", age: 30 }

// Check if key exists
if (localStorage.getItem("theme") !== null) {
  // Key exists
}

// Remove specific item
localStorage.removeItem("username");

// Clear ALL stored data
localStorage.clear();

// Get number of stored items
console.log(localStorage.length);

// Get key by index
console.log(localStorage.key(0)); // First key name
```

---

## 9. sessionStorage

Same API as localStorage, but data is only available for the **duration of the page session** (cleared when tab/window is closed).

```javascript
// Same API as localStorage
sessionStorage.setItem("tempData", "value");
sessionStorage.getItem("tempData");
sessionStorage.removeItem("tempData");
sessionStorage.clear();

// Use case: temporary form data that shouldn't persist
sessionStorage.setItem("formStep", "2");
sessionStorage.setItem("draftEmail", JSON.stringify({
  to: "bob@test.com",
  subject: "Draft",
  body: "..."
}));
```

---

## 10. Cookies (Client-Side)

Cookies are small text files stored in name-value pairs. They are sent with every HTTP request to the server.

### Creating Cookies

```javascript
// Basic cookie (deleted when browser closes)
document.cookie = "username=Alice";

// Cookie with expiration
document.cookie = "username=Alice; expires=Fri, 31 Dec 2025 23:59:59 GMT";

// Cookie with path
document.cookie = "username=Alice; expires=Fri, 31 Dec 2025 23:59:59 GMT; path=/";

// Cookie with max-age (seconds)
document.cookie = "theme=dark; max-age=86400"; // 24 hours

// Multiple cookies (each document.cookie assignment adds a new cookie)
document.cookie = "username=Alice; path=/";
document.cookie = "theme=dark; path=/";
document.cookie = "lang=en; path=/";
```

### Reading Cookies

```javascript
console.log(document.cookie);
// "username=Alice; theme=dark; lang=en"
// Returns ALL accessible cookies as one string
// Does NOT include expires, path, or other attributes
```

### Deleting Cookies

```javascript
// Set expiration to a past date
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
```

### Cookie Helper Functions

```javascript
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [key, val] = cookie.trim().split("=");
    if (key === name) {
      return decodeURIComponent(val);
    }
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Usage
setCookie("user", "Alice", 30);           // Expires in 30 days
console.log(getCookie("user"));           // "Alice"
deleteCookie("user");                     // Delete the cookie
```

### Cookie Path Behavior

```javascript
// Cookie available on entire site
document.cookie = "globalCookie=value; path=/";

// Cookie only available on /admin pages
document.cookie = "adminCookie=value; path=/admin";

// On /admin page: both cookies visible
// On /home page: only globalCookie visible
```

---

## 11. Storage Comparison

| Feature | localStorage | sessionStorage | Cookies |
|---------|-------------|---------------|---------|
| **Persistence** | Until manually cleared | Until tab/window closes | Until expiration date |
| **Capacity** | ~5-10 MB | ~5 MB | ~4 KB per cookie |
| **Sent to server** | No | No | Yes, with every HTTP request |
| **Scope** | Same origin (all tabs) | Same origin (same tab only) | Same origin + path |
| **API** | `setItem/getItem` | `setItem/getItem` | `document.cookie` (string) |
| **Data format** | Strings only | Strings only | Strings (name=value pairs) |
| **Accessible from** | Client-side only | Client-side only | Client and server |
| **Use case** | User preferences, cached data | Temporary form data, session state | Auth tokens, tracking, server-needed data |

---

## 12. Storage Events

Listen for storage changes across tabs (only fires in **other** tabs, not the one making the change).

```javascript
window.addEventListener("storage", (event) => {
  console.log("Key:", event.key);
  console.log("Old value:", event.oldValue);
  console.log("New value:", event.newValue);
  console.log("URL:", event.url);

  // Use case: sync theme across tabs
  if (event.key === "theme") {
    applyTheme(event.newValue);
  }
});
```

---

## 13. Summary

### BOM Objects

| Object | Purpose |
|--------|---------|
| `window` | Global object, viewport size, scroll, open/close windows |
| `window.location` | Current URL, navigation, redirect |
| `window.navigator` | Browser info, online status, geolocation, clipboard |
| `window.history` | Session history, back/forward, pushState for SPAs |
| `window.screen` | Physical screen dimensions and properties |

### Timing

| Method | Purpose |
|--------|---------|
| `setTimeout(fn, ms)` | Run once after delay |
| `setInterval(fn, ms)` | Run repeatedly at interval |
| `requestAnimationFrame(fn)` | Run on next display refresh (smooth animations) |

### Storage

| Storage | Best For |
|---------|----------|
| localStorage | Persistent user preferences, cached data |
| sessionStorage | Temporary per-tab data, form drafts |
| Cookies | Auth tokens, server-needed data, cross-request state |
