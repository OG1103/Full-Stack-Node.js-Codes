# Understanding the Event Object (`e`) in React

In React, when you handle events such as clicks, form submissions, or key presses, an event object (`e`) is automatically passed to the event handler function. This event object contains details about the event, such as what triggered it, the element it was associated with, and additional properties depending on the type of event.

## Key Features of the Event Object (`e`)

### 1. `e.preventDefault()`

- **Description**: Prevents the default action that belongs to the event (e.g., prevent a form from submitting and refreshing the page).
- **Example**:
  ```jsx
  <form
    onSubmit={(e) => {
      e.preventDefault(); // Prevents default form submission
      const formData = new FormData(e.target); // Collect form data
      // Process the form data, e.g., send it to the server using fetch or axios
      console.log("Form data collected:", Object.fromEntries(formData));
    }}
  >
    <input type="text" name="username" placeholder="Username" />
    <button type="submit">Submit</button>
  </form>
  //e.preventDefault() stops the browser's default submission and refresh behavior.
  //You need to handle form submission manually if you want to process the form data.
  //The form is not submitted to the server unless you implement the logic to do so.
  ```

### 2. `e.stopPropagation()`

- **Description**: Stops the event from propagating (bubbling) up to parent elements. Useful for nested elements where you don't want the parent to respond to the child's event.
- **Example**:
  ```jsx
  <div onClick={() => console.log("Parent clicked!")}>
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevents the click from propagating to the parent div
        console.log("Button clicked!");
      }}
    >
      Click Me
    </button>
  </div>
  ```

### 3. `e.target`

- **Description**: Refers to the element that triggered the event. Commonly used to access the value of form elements like inputs or buttons.
- The exact element that triggered the event. (Could be a child element inside the listener element)
- When you need to know which specific element was clicked inside a parent container.
- **Example**:
  ```jsx
  <input type="text" onChange={(e) => console.log(e.target.value)} placeholder="Type something" />
  ```

### 4. `e.currentTarget`

- **Description**: Refers to the element on which the event handler is attached, which may be different from `e.target` if the event is bubbling up from a child element.
- 
- When you need to reference the parent element handling the event so in the following example e.target will reference the button element (as it's the one that triggered the event) and e.currentTarget will reference the div element as it has the event listener.
- **Example**:
  ```jsx
  <div onClick={(e) => console.log(e.currentTarget)}>
    <button>Click the button</button>
  </div>
  ```

### 5. `e.key`

- **Description**: Represents the key that was pressed when dealing with keyboard events (e.g., `onKeyDown` or `onKeyUp`).
- **Example**:
  ```jsx
  <input type="text" onKeyDown={(e) => console.log(`Key pressed: ${e.key}`)} placeholder="Press a key" />
  ```

### 6. `e.type`

- **Description**: Provides the type of the event (e.g., "click", "keydown", "submit").
- **Example**:
  ```jsx
  <button onClick={(e) => console.log(`Event type: ${e.type}`)}>Click Me</button>
  ```

## Synthetic Events in React

React uses something called **Synthetic Events** to handle events consistently across all browsers. These synthetic events wrap the browser's native event objects, providing a consistent interface and improving performance. Despite this, the `e` object behaves very similarly to the native DOM event, so the methods and properties you're familiar with in regular DOM events are still available.

## Key Takeaways

- **`e.preventDefault()`**: Stops default browser behavior for the event.
- **`e.stopPropagation()`**: Prevents the event from bubbling up to parent elements.
- **`e.target`**: Refers to the element that triggered the event.
- **`e.currentTarget`**: Refers to the element to which the event handler is attached.
- **`e.key`**: Represents the key pressed during keyboard events.
- **`e.type`**: Returns the type of the event (click, submit, etc.).

React’s synthetic event system simplifies event handling by making sure it works consistently across different browsers.

# Notes

- The event object is automatically passed to the event handler by React.
- You don’t need to explicitly pass the event object when defining the event handler.
- To access the event object, include it as a parameter (e.g., e) in the function that handles the event. There is no need to manually pass it when attaching the handler to the event.
