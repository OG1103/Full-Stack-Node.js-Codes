// FormExamples.jsx

import React, { useState } from "react";

function FormExamples() {
  // State variables for controlled components
  const [textInput, setTextInput] = useState("");
  const [numberInput, setNumberInput] = useState(0);
  const [textareaInput, setTextareaInput] = useState("");
  const [selectInput, setSelectInput] = useState("option1");
  const [checkboxInput, setCheckboxInput] = useState(false);

  // Handler functions for controlled inputs
  const handleTextChange = (e) => setTextInput(e.target.value);
  const handleNumberChange = (e) => setNumberInput(e.target.value);
  const handleTextareaChange = (e) => setTextareaInput(e.target.value);
  const handleSelectChange = (e) => setSelectInput(e.target.value);
  const handleCheckboxChange = (e) => setCheckboxInput(e.target.checked);

  return (
    <form>
      {/* Text Input */}
      <label>
        Text Input:
        <input
          type="text" // Defines the input type as text
          name="textInput" // Name attribute identifies the input in form data
          value={textInput} // Controlled input value bound to state
          onChange={handleTextChange} // onChange updates state with input changes
          placeholder="Enter text here" // Placeholder shown when input is empty
        />
      </label>

      {/* Number Input */}
      <label>
        Number Input:
        <input
          type="number" // Sets input type to number
          name="numberInput"
          value={numberInput}
          onChange={handleNumberChange}
          placeholder="Enter a number" // Placeholder for number input
          min="0" // Minimum value for number input
          max="100" // Maximum value for number input
        />
      </label>

      {/* Textarea Input */}
      <label>
        Textarea Input:
        <textarea
          name="textareaInput"
          value={textareaInput} // Controlled value for textarea
          onChange={handleTextareaChange}
          placeholder="Enter detailed text here"
          rows="4" // Defines number of visible rows
          cols="50" // Defines number of visible columns
        />
      </label>

      {/* Select Input */}
      <label>
        Select Input:
        <select
          name="selectInput"
          value={selectInput} // Controlled value for select input
          onChange={handleSelectChange} // when an option is selected the value of the select changes to the value of the option
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </label>

      {/* Checkbox Input */}
      <label>
        Checkbox Input:
        <input
          type="checkbox" // Sets input type to checkbox
          name="checkboxInput"
          checked={checkboxInput} // Checked attribute for controlled checkbox
          onChange={handleCheckboxChange}
        />
      </label>

      {/* Radio Button Input */}
      <label>
        Radio Button Input:
        <input
          type="radio" // Sets input type to radio
          name="radioGroup" // Same name groups radio buttons
          value="option1"
          onChange={() => alert("Selected option 1")}
        />
        Option 1
        <input
          type="radio"
          name="radioGroup"
          value="option2"
          onChange={() => alert("Selected option 2")}
        />
        Option 2
      </label>

      {/* File Input */}
      <label>
        File Input:
        <input
          type="file" // Sets input type to file for uploading
          name="fileInput"
          onChange={(e) => console.log(e.target.files[0])} // Handles file selection
          accept=".png, .jpg" // Specifies accepted file types
        />
      </label>

      {/* Submit Button */}
      <button type="submit">Submit Form</button>
    </form>
  );
}

export default FormExamples;
