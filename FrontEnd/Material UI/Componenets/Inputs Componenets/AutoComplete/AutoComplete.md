# Understanding the `Autocomplete` Component in Material-UI

The `Autocomplete` component in Material-UI is a powerful and flexible component that allows users to select options from a dropdown list, either by typing or by browsing. It's commonly used for search bars, dropdown selectors, and dynamic filtering inputs.

---

## 📌 **What is the `Autocomplete` Component?**

- **Dynamic Suggestions:** Displays suggestions as the user types.
- **Flexible Input:** Supports single or multiple selections.
- **Customizable:** Can render custom options, handle async data, and integrate with other components.

By default, Autocomplete behaves like a combo box, meaning the user must select a value from the provided options unless the freeSolo prop is enabled.
---

## 📊 **All Props for `Autocomplete`**

| **Prop**               | **Description**                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| `options`              | Array of items to display in the dropdown.                                                          |
| `renderInput`          | Function to render the input field, usually with a `TextField` component.                           |
| `value`                | Controls the selected value(s).                                                                     |
| `onChange`             | Callback fired when the value changes.                                                              |
| `multiple`             | Allows multiple selections if set to `true`.                                                        |
| `freeSolo`             | Allows users to enter values not present in the options.                                            |
| `disableClearable`     | Hides the clear button when set to `true`.                                                          |
| `groupBy`              | Function to group options under specific categories.                                                |
| `getOptionLabel`       | Defines how to display the label for each option.                                                   |
| `getOptionDisabled`    | Defines which options are disabled aka can't choose them. This is provided by callback in that prop |
| `loading`              | Shows a loading indicator when set to `true`.                                                       |
| `loadingText`          | Custom text displayed during loading.                                                               |
| `filterOptions`        | Custom function to control how options are filtered.                                                |
| `disableCloseOnSelect` | Prevents the dropdown from closing after selecting an option (useful for multi-select).             |
| `autoHighlight`        | Automatically highlights the first option when the dropdown opens.                                  |
| `autoSelect`           | Automatically selects an option if it matches the input.                                            |
| `clearOnEscape`        | Clears the selected value when the `Escape` key is pressed.                                         |
| `includeInputInList`   | Ensures the input value is always visible in the dropdown.                                          |
| `noOptionsText`        | Custom text displayed when no options match the input.                                              |
| `openOnFocus`          | Opens the dropdown when the input gains focus.                                                      |
| `blurOnSelect`         | Determines if the input should lose focus after selection.                                          |
| `size`                 | Adjusts the size of the input field (`small`, `medium`).                                            |
| `fullWidth`            | Makes the input take up the full width of its container.                                            |
| `disablePortal`        | Renders the dropdown in place instead of using a portal.                                            |
| `clearIcon`            | Custom icon for the clear button.                                                                   |
| `popupIcon`            | Custom icon for the dropdown arrow.                                                                 |
| `disabled`             | Determines of the componenet is disabled aka can't choose from nor access it                        |
| `limitTags`            | Used along side multiple to determine how maany selected options to display                         |

---

## 🚀 **Basic Usage Example**

```jsx
import * as React from "react";
import { Autocomplete, TextField } from "@mui/material";

const options = ["Apple", "Banana", "Cherry", "Date", "Grapes"];

export default function BasicAutocomplete() {
  return (
    <Autocomplete
      options={options}
      renderInput={(params) => <TextField {...params} label="Fruits" variant="outlined" />}
    />
  );
}
```

**Explanation:**

- `options`: The list of values displayed.
- `renderInput`: Defines how the input field is rendered.

---


## 🗂️ **Key Props and Use Cases**

### 1️⃣ **`options`**

- **Purpose:** Provides the list of selectable items.
- **Example:**
  ```jsx
  <Autocomplete options={["Red", "Green", "Blue"]} />
  ```
- **Use Case:** Static lists like color pickers, country selectors.

### 2️⃣ **`renderInput`**

- **Purpose:** Customizes the input field.
- **Example:**
  ```jsx
  <Autocomplete
    options={["Option 1", "Option 2"]}
    renderInput={(params) => <TextField {...params} label="Choose an option" />}
  />
  ```
- **Use Case:** Adding labels, placeholders, or validation to the input.

### 3️⃣ **`value` & `onChange`**

- **Purpose:** Controls the selected value.
- **Example:**

  ```jsx
  const [value, setValue] = React.useState(null);

  <Autocomplete
    value={value}
    onChange={(event, newValue) => setValue(newValue)}
    options={["JavaScript", "Python", "Java"]}
    renderInput={(params) => <TextField {...params} label="Languages" />}
  />;
  ```

- **Use Case:** Controlled components to manage state.

### 4️⃣ **`multiple`**

- **Purpose:** Allows selecting multiple values And then sotres these values as arrays.
- **Example:**
  ```jsx
  <Autocomplete
    multiple
    options={["HTML", "CSS", "JavaScript"]}
    renderInput={(params) => <TextField {...params} label="Select Skills" />}
  />
  ```
- **Use Case:** Tag selectors, multi-category filters.

### 5️⃣ **`freeSolo`**

- **Purpose:** Allows users to input values not present in the list.
- **Example:**
  ```jsx
  <Autocomplete
    freeSolo
    options={["Dog", "Cat", "Bird"]}
    renderInput={(params) => <TextField {...params} label="Pet Name" />}
  />
  ```
- **Use Case:** Search bars with user-defined queries.

### 6️⃣ **`disableClearable`**

- **Purpose:** Prevents the clear button from appearing.
- **Example:**
  ```jsx
  <Autocomplete
    disableClearable
    options={["Yes", "No"]}
    renderInput={(params) => <TextField {...params} label="Confirmation" />}
  />
  ```
- **Use Case:** Required fields where clearing isn’t allowed.

### 7️⃣ **`groupBy`**

- **Purpose:** Groups options under headings.
- **Example:**

  ```jsx
  const options = [
    { title: "Apple", category: "Fruits" },
    { title: "Carrot", category: "Vegetables" },
  ];

  <Autocomplete
    options={options}
    groupBy={(option) => option.category}
    getOptionLabel={(option) => option.title}
    renderInput={(params) => <TextField {...params} label="Grouped Options" />}
  />;
  //Sets headings of category and under it are their corresponding labels / options you can choose from .
  // Whenever we are grouping ourt options it's highly advised to short them based on the parameter we are grouping them by. (in the options prop)
  ```

- **Use Case:** Organizing data, e.g., by categories or types.

### 8️⃣ **`getOptionLabel`**

- **Purpose:** Defines which property to display as the label.
- **Example:**

  ```jsx
  const options = [{ name: "John" }, { name: "Jane" }];

  <Autocomplete
    options={options}
    getOptionLabel={(option) => option.name}
    renderInput={(params) => <TextField {...params} label="Name" />}
  />;
  ```

- **Use Case:** Display custom labels when options are objects.

### 9️⃣ **`loading` & `loadingText`**

- **Purpose:** Indicates loading state for async data.
- **Example:**
  ```jsx
  <Autocomplete
    loading
    loadingText="Loading data..."
    options={[]}
    renderInput={(params) => <TextField {...params} label="Loading Example" />}
  />
  ```
- **Use Case:** Async data fetching with loaders.

### 🔄 **10️⃣ `filterOptions` (Custom Filtering)**

- **Purpose:** Customizes how options are filtered.
- **Example:**
  ```jsx
  <Autocomplete
    options={["Apple", "Banana", "Grapes"]}
    filterOptions={(options, { inputValue }) =>
      options.filter((option) => option.toLowerCase().startsWith(inputValue.toLowerCase()))
    }
    renderInput={(params) => <TextField {...params} label="Custom Filter" />}
  />
  ```
- **Use Case:** Case-insensitive search, custom matching algorithms.

---

## 💡 **Key Takeaways**

- The `Autocomplete` component enhances UX with dynamic suggestions.
- Supports single, multiple, and free-text entries.
- Highly customizable through props like `renderInput`, `groupBy`, and `filterOptions`.

## 🚀 **Conclusion**

The `Autocomplete` component in Material-UI is versatile, easy to integrate, and customizable. Whether you’re building a simple search bar or a complex form with dynamic filters, `Autocomplete` provides the tools you need to deliver an intuitive user experience.
