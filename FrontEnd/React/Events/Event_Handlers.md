# React Event Handlers

This document explains the most commonly used event handlers in React, including how to handle events and use the event object (`e`).

# When passing a function to an event handler in React, you should not call it with () (parentheses), as that would execute the function immediately upon rendering; we only want it to execute when the event occurs. Instead, pass the function reference without (). If you need to pass parameters to the function, you should wrap the function in an arrow function to delay its execution until the event occurs.```jsx

```jsx
function handleClick() {
  console.log("test");
}
function handleClick1(message) {
  console.log(message);
}
// Correct usage without calling the function immediately
return (
  <div>
    {/* No parameters, pass the function reference */}
    <button onClick={handleClick}>Click Me (No Params)</button>

    {/* Passing parameters, use an arrow function */}
    <button onClick={() => handleClick1("Button clicked with params!")}>Click Me (With Params)</button>
  </div>
);
```

## 1. onClick

- **Description**: Fired when an element (e.g., a button) is clicked.
- **Example**:
  ```jsx
  <button onClick={() => console.log("Button clicked!")}>Click Me</button>
  ```

## 2. onDoubleClick

- **Description**: Fired when an element is double-clicked.
- **Example**:
  ```jsx
  <button onDoubleClick={() => console.log("Button double-clicked!")}>Double Click Me</button>
  ```

## 3. onMouseEnter / onMouseLeave

- **Description**: Fired when the mouse enters or leaves an element.
- **Example**:
  ```jsx
  <div onMouseEnter={() => console.log("Mouse entered!")} onMouseLeave={() => console.log("Mouse left!")}>
    Hover over me
  </div>
  ```

## 4. onMouseOver

- **Description**: Fired when the mouse is moved over an element or one of its child elements.
- **Example**:
  ```jsx
  <div onMouseOver={() => console.log("Mouse over element!")}>Hover over this element</div>
  ```

## 5. onKeyDown / onKeyUp

- **Description**: Fired when a key is pressed (`onKeyDown`) or released (`onKeyUp`).
- **Example**:
  ```jsx
  <input type="text" onKeyDown={(e) => console.log(e.key)} onKeyUp={(e) => console.log(e.key)} />
  ```

## 6. onFocus / onBlur

- **Description**: Fired when an element gains focus (`onFocus`) or loses focus (`onBlur`).
- **Example**:
  ```jsx
  <input type="text" onFocus={() => console.log("Focused")} onBlur={() => console.log("Blurred")} />
  ```

## 7. onChange

- **Description**: Fired when the value of an input element changes.
- **Example**:
  ```jsx
  <input type="text" onChange={(e) => console.log(e.target.value)} />
  ```

## 8. onSubmit

- **Description**: Fired when a form is submitted.
- **Example**:
  ```jsx
  <form
    onSubmit={(e) => {
      e.preventDefault();
      console.log("Form submitted");
    }}
  >
    <button type="submit">Submit</button>
  </form>
  ```

## 9. onReset

- **Description**: Fired when a form is reset.
- **Example**:
  ```jsx
  <form onReset={() => console.log("Form reset")}>
    <button type="reset">Reset</button>
  </form>
  ```

## 10. onCopy

- **Description**: Fired when text is copied to the clipboard.
- **Example**:
  ```jsx
  <textarea onCopy={() => console.log("Text copied")}></textarea>
  ```

## 11. onDragOver / onDrop

- **Description**: Fired during drag and drop events. `onDragOver` triggers when dragging over an element, and `onDrop` triggers when an element is dropped.
- **Example**:
  ```jsx
  <div onDragOver={(e) => e.preventDefault()} onDrop={() => console.log("Dropped!")}>
    Drop files here
  </div>
  ```

## Event Object (`e`)

The event object `e` is automatically passed to event handlers in React. It contains information about the event, such as which key was pressed, the target element, and more. You can access its properties like `e.target`, `e.key`, `e.preventDefault()`, etc.
