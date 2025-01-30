// EventHandlersExample.jsx
// This file demonstrates various React event handlers with examples, including proper usage of the event object 'e'.
// It covers mouse, keyboard, form, input, drag, clipboard, media, focus, and more.

import React, { useState } from "react";

export default function EventHandlersExample() {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [keyPressed, setKeyPressed] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [dropZoneText, setDropZoneText] = useState("Drop files here");

  // 'e' is the event object, passed as a parameter to this function. 
  // You don't need to explicitly pass it when the function is called; 
  // React automatically provides the event object whenever the event is triggered.

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Form submitted with input:", inputValue);
  };

  // Input change handler
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Focus and blur handlers
  const handleFocus = (e) => setIsFocused(true);
  const handleBlur = (e) => setIsFocused(false);

  // Key down and key up handlers
  const handleKeyDown = (e) => setKeyPressed(`Key Down: ${e.key}`);
  const handleKeyUp = (e) => setKeyPressed(`Key Up: ${e.key}`);

  // Mouse enter, leave, and mouse over handlers
  const handleMouseEnter = (e) => setIsHovered(true); 
  const handleMouseLeave = (e) => setIsHovered(false);
  const handleMouseOver = (e) => console.log("Mouse over element!");

  // Handle form reset
  const handleReset = (e) => {
    e.preventDefault(); // Prevent actual reset
    setInputValue("");
    console.log("Form reset");
  };

  // Handle drag and drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setDropZoneText("Dragging over...");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDropZoneText("File dropped!");
  };

  // Clipboard event for copying
  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div>
      <h1>React Event Handlers Example</h1>

      {/* onClick Example */}
      <h2>onClick Event</h2>
      <button onClick={() => console.log("Button clicked!")}>Click Me</button>

      {/* onDoubleClick Example */}
      <h2>onDoubleClick Event</h2>
      <button onDoubleClick={() => console.log("Button double-clicked!")}>Double Click Me</button>

      {/* onMouseEnter, onMouseLeave, and onMouseOver Example */}
      <h2>onMouseEnter, onMouseLeave, and onMouseOver Events</h2>
      <div
        style={{
          width: "200px",
          height: "100px",
          backgroundColor: isHovered ? "lightblue" : "lightgray",
        }}
        onMouseEnter={handleMouseEnter} 
        // No need to pass 'e' as a parameter when assigning the event handler.
        // React automatically passes the event object when the event is triggered.
        //Same applies to all event handlers that have e as a parameter in the function definition. 
        onMouseLeave={handleMouseLeave}
        onMouseOver={handleMouseOver}
      >
        Hover or Mouse Over Me
      </div>

      {/* onKeyDown and onKeyUp Example */}
      <h2>onKeyDown and onKeyUp Events</h2>
      <input
        type="text"
        placeholder="Press a key"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
      <p>{keyPressed}</p>

      {/* onFocus and onBlur Example */}
      <h2>onFocus and onBlur Events</h2>
      <input
        type="text"
        placeholder="Focus me"
        value={inputValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleInputChange}
      />
      <p>{isFocused ? "Input is focused" : "Input is not focused"}</p>

      {/* onChange Example */}
      <h2>onChange Event</h2>
      <input
        type="text"
        placeholder="Type something"
        value={inputValue}
        onChange={handleInputChange}
      />
      <p>Input Value: {inputValue}</p>

      {/* onSubmit Example */}
      <h2>onSubmit Event</h2>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <input
          type="text"
          placeholder="Submit form"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>

      {/* Clipboard Copy Event */}
      <h2>onCopy Event</h2>
      <textarea onCopy={handleCopy} placeholder="Copy some text"></textarea>
      {isCopied && <p>Text copied to clipboard!</p>}

      {/* Drag and Drop Events */}
      <h2>onDragOver and onDrop Events</h2>
      <div
        style={{
          width: "200px",
          height: "100px",
          border: "2px dashed gray",
          textAlign: "center",
          lineHeight: "100px",
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {dropZoneText}
      </div>
    </div>
  );
}
