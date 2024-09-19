/**
 * ==========================
 * Custom Events in the DOM
 * ==========================
 *
 * The DOM provides a way to create and dispatch custom events using JavaScript. Custom events
 * are useful when you need to trigger and handle events that are not natively available in the browser,
 * or when components of your application need to communicate in a decoupled way.
 *
 * Custom events allow you to:
 *  - Define your own events.
 *  - Attach event handlers to those events.
 *  - Dispatch (trigger) those events programmatically.
 *
 * Let's go through the process of creating, dispatching, and handling custom events.
 */

/**
 * 1. Creating a Custom Event
 * --------------------------
 * You can create a custom event using the `CustomEvent` constructor.
 *
 * Syntax:
 * `new CustomEvent(eventName, options)`
 *  - `eventName`: A string that specifies the event name.
 *  - `options`: An optional object that allows you to define extra properties like `detail` and `bubbles`.
 *
 * The `detail` property in the `options` object allows you to pass custom data with the event.
 * The `bubbles` and `cancelable` options specify how the event behaves in the DOM.
 */

// Example: Creating a custom event called 'userLogin'
const loginEvent = new CustomEvent("userLogin", {
  detail: { username: "JohnDoe" }, // Custom data to pass with the event
  bubbles: true, // Allows the event to bubble up through the DOM
  cancelable: true, // Specifies if the event can be canceled
});

/**
 * 2. Dispatching a Custom Event
 * -----------------------------
 * Once you create a custom event, you can dispatch (trigger) it using the `dispatchEvent()` method.
 *
 * Syntax:
 * `element.dispatchEvent(event)`
 *
 * - `element`: The DOM element that will dispatch the event.
 * - `event`: The custom event you want to dispatch.
 */

// Example: Dispatching the 'userLogin' event from a button element
const loginButton = document.getElementById("login-btn"); // Assuming there's a button with id 'login-btn'

loginButton.addEventListener("click", () => {
  // Dispatch the custom 'userLogin' event when the button is clicked
  document.dispatchEvent(loginEvent);
});

/**
 * 3. Handling Custom Events
 * -------------------------
 * You can listen for custom events just like native DOM events (e.g., 'click', 'keydown') using
 * `addEventListener()`. You can also retrieve any custom data passed with the event using `event.detail`.
 */

// Example: Handling the 'userLogin' event
document.addEventListener("userLogin", function (event) {
  console.log("Custom userLogin event triggered!");
  console.log("Logged in user:", event.detail.username); // Access custom data passed with the event
});

/**
 * 4. Event Bubbling and Propagation
 * ---------------------------------
 * By default, custom events do not bubble. If you want your custom event to bubble up
 * the DOM tree, you need to set the `bubbles` option to `true` when creating the event.
 *
 * Bubbling means the event can propagate up from the element it was dispatched from to its parent elements.
 */

// Example: Creating a bubbling custom event
const bubblingEvent = new CustomEvent("bubblingEvent", {
  bubbles: true, // Enables event bubbling
  detail: { message: "This event bubbles up the DOM!" },
});

// Dispatch the event from a specific element
const childElement = document.getElementById("child-element");
childElement.dispatchEvent(bubblingEvent);

// Listen for the bubbling event on a parent element
const parentElement = document.getElementById("parent-element");
parentElement.addEventListener("bubblingEvent", function (event) {
  console.log(event.detail.message); // Output: This event bubbles up the DOM!
});

/**
 * 5. Canceling Custom Events
 * --------------------------
 * Custom events can be made cancelable using the `cancelable` option. This allows event handlers
 * to cancel the event using `event.preventDefault()`. This is useful when you want to give event handlers
 * the ability to stop a specific action.
 *
 * Use the `event.defaultPrevented` property to check if the event has been canceled.
 */

// Example: Creating a cancelable custom event
const cancelableEvent = new CustomEvent("cancelableAction", {
  cancelable: true,
  detail: { action: "save" },
});

// Dispatch the cancelable event
document.dispatchEvent(cancelableEvent);

// Listen for the event and cancel it under certain conditions
document.addEventListener("cancelableAction", function (event) {
  if (event.detail.action === "save") {
    event.preventDefault(); // Cancel the event
    console.log("Action canceled");
  }
});

// Check if the event was canceled
if (cancelableEvent.defaultPrevented) {
  console.log("The custom event was canceled");
}

/**
 * 6. Using the `Event()` Constructor
 * ----------------------------------
 * You can also create basic custom events using the `Event()` constructor. However, unlike `CustomEvent`,
 * the `Event` constructor does not allow passing custom data through the `detail` property.
 *
 * Syntax:
 * `new Event(eventName, options)`
 */

// Example: Creating and dispatching a basic custom event
const simpleEvent = new Event("simpleEvent", {
  bubbles: true,
  cancelable: false,
});

// Dispatch the event
document.dispatchEvent(simpleEvent);

// Handle the event
document.addEventListener("simpleEvent", function () {
  console.log("Simple custom event triggered!");
});

/**
 * 7. Passing Complex Data with Custom Events
 * ------------------------------------------
 * The `detail` property in `CustomEvent` can hold any type of data, allowing you to pass
 * complex objects, arrays, or even functions.
 */

// Example: Passing a complex object in the custom event's `detail` property
const complexEvent = new CustomEvent("complexDataEvent", {
  detail: {
    user: {
      username: "JaneDoe",
      email: "jane@example.com",
      permissions: ["read", "write", "admin"],
    },
  },
});

// Dispatch the event
document.dispatchEvent(complexEvent);

// Handle the event and access the complex data
document.addEventListener("complexDataEvent", function (event) {
  const userData = event.detail.user;
  console.log("User data:", userData);
  console.log("User permissions:", userData.permissions); // Output: ['read', 'write', 'admin']
});

/**
 * 8. Real-world Use Cases of Custom Events
 * ----------------------------------------
 * Custom events can be useful in many real-world scenarios, such as:
 *
 * - **Component Communication**: In modern web applications, custom events can be used for communication
 *   between independent components. For example, if you have a button component that triggers an action
 *   in another component, a custom event can be used to signal the action.
 *
 * - **Decoupling**: Custom events help decouple your code by allowing modules or components to emit events
 *   and let other parts of the application respond, without requiring direct references between them.
 *
 * - **User-Defined Behavior**: Custom events enable user-defined behavior that isn't covered by native events,
 *   like signaling when a specific process is complete (e.g., when data has been successfully fetched from
 *   an API).
 */

// Example: A button that triggers a custom event for another component to handle
const fetchDataButton = document.getElementById("fetch-data-btn");

fetchDataButton.addEventListener("click", function () {
  const dataFetchedEvent = new CustomEvent("dataFetched", {
    detail: { data: [1, 2, 3, 4, 5] },
  });

  // Dispatch the custom event
  document.dispatchEvent(dataFetchedEvent);
});

// Listen for the custom 'dataFetched' event and handle it
document.addEventListener("dataFetched", function (event) {
  const fetchedData = event.detail.data;
  console.log("Data fetched:", fetchedData); // Output: [1, 2, 3, 4, 5]
});

/**
 * Conclusion:
 * -----------
 * Custom events in the DOM are a powerful way to create user-defined events that can be dispatched
 * and handled across different parts of your application. By using the `CustomEvent()` constructor,
 * you can attach custom data to events, enable event bubbling, and allow cancellation of events.
 *
 * Key Takeaways:
 * - Create custom events using `CustomEvent`.
 * - Pass custom data through the `detail` property.
 * - Dispatch events using `dispatchEvent()`.
 * - Handle custom events with `addEventListener()`.
 * - Enable event bubbling and cancellation through options.
 * - Use custom events to decouple components and handle user-defined behaviors.
 */
