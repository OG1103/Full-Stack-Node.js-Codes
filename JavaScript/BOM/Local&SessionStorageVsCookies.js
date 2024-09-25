// Local Storage
// - Stores data with no expiration time. Data is persisted even after closing the browser or restarting the device.
// - Storage capacity is about 5-10MB (depending on the browser).

// Example of using Local Storage:
localStorage.setItem("key", "value"); // Save data
let value = localStorage.getItem("key"); // Retrieve data
localStorage.removeItem("key"); // Remove data
localStorage.clear(); // Clear all data

// Session Storage
// - Similar to Local Storage, but data is only available for the duration of the page session.
// - Data is cleared when the tab or window is closed.
// - Storage capacity is about 5MB.

// Example of using Session Storage:
sessionStorage.setItem("key", "value"); // Save data
let sessionValue = sessionStorage.getItem("key"); // Retrieve data
sessionStorage.removeItem("key"); // Remove data
sessionStorage.clear(); // Clear all data

// Cookies
// - Cookies are mainly used for tracking and storing small amounts of data that need to be sent with every HTTP request.
// - Cookies have an expiration time and are limited in size (~4KB).

// Example of setting and getting Cookies:
document.cookie =
  "username=JohnDoe; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/"; // Set a cookie
let cookies = document.cookie; // Get all cookies
// Example of getting a specific cookie:
function getCookie(name) {
  let cookieArr = document.cookie.split(";");
  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");
    if (name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}
getCookie("username"); // Retrieve specific cookie

// Summary of Differences:
// - Local Storage: Persistent storage, no expiration, larger capacity. Stored on Browser only
// - Session Storage: Temporary storage, cleared on session end. Stored on Browser only
// - Cookies: Small storage, sent with every HTTP request, can set expiration. Stored on Browser & server
