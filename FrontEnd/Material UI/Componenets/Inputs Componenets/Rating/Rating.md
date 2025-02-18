# ⭐ MUI Rating Component Guide

The **MUI Rating** component is a versatile UI element used to capture and display ratings, typically represented as stars. It enables users to provide feedback by selecting a rating value, making it highly useful for applications like product reviews, satisfaction surveys, and rating systems.

---

## 📚 **Overview**

- **Purpose:** Allows users to provide feedback in the form of ratings.
- **Common Use Case:** Product reviews, app ratings, satisfaction surveys, etc.
- **Integration:** Works seamlessly with forms and can be controlled or uncontrolled based on the requirement.

```jsx
import Rating from '@mui/material/Rating';

export default function BasicRating() {
  return <Rating name="simple-rating" defaultValue={3} />;
}
```

---

## ✅ **Props Table**

| **Prop**                | **Description**                                                                 | **Type**                  | **Default** |
|-------------------------|-------------------------------------------------------------------------------|---------------------------|-------------|
| `name`                  | Name attribute for the rating input (useful in forms).                        | `string`                  | `-`         |
| `value`                 | The current rating value (controlled component).                              | `number`                  | `null`      |
| `defaultValue`          | The initial rating value (uncontrolled component).                            | `number`                  | `0`         |
| `max`                   | The maximum number of rating items (e.g., stars).                            | `number`                  | `5`         |
| `precision`             | Defines the decimal precision for ratings (e.g., `0.5` for half-stars).      | `number`                  | `1`         |
| `readOnly`              | If `true`, the rating is read-only and cannot be changed.                    | `bool`                    | `false`     |
| `disabled`              | Disables the rating if `true`.                                               | `bool`                    | `false`     |
| `onChange`              | Callback fired when the rating value changes.                                | `function(event, value)`  | `-`         |
| `onChangeActive`        | Callback fired when the hover state changes.                                 | `function(event, value)`  | `-`         |
| `size`                  | Adjusts the size (`'small'`, `'medium'`, `'large'`).                         | `string`                  | `'medium'`  |
| `icon`                  | Custom icon for the filled state.                                            | `node`                    | ⭐           |
| `emptyIcon`             | Custom icon for the empty state.                                             | `node`                    | ☆           |
| `highlightSelectedOnly` | Highlights only the selected rating item instead of all previous ones.       | `bool`                    | `false`     |
| `sx`                    | The system prop for custom styles.                                           | `object`                  | `{}`        |
| `className`             | Adds custom CSS classes.                                                     | `string`                  | `-`         |

---

## 🔍 **Detailed Explanation of Each Prop**

### 1️⃣ **`name`**

```jsx
<Rating name="product-rating" />
```
- **Explanation:** Useful when submitting rating values in forms.

### 2️⃣ **`value`** (Controlled Component)

```jsx
const [value, setValue] = React.useState(2);

<Rating name="controlled-rating" value={value} onChange={(event, newValue) => setValue(newValue)} />
```
- **Explanation:** Controls the rating value programmatically.

### 3️⃣ **`defaultValue`** (Uncontrolled Component)

```jsx
<Rating name="default-rating" defaultValue={4} />
```
- **Explanation:** Sets the initial rating without managing it via state.

### 4️⃣ **`max`**

```jsx
<Rating name="custom-max" max={10} />
```
- **Explanation:** Defines the maximum number of rating items (e.g., 10 stars).

### 5️⃣ **`precision`**

```jsx
<Rating name="half-rating" precision={0.5} />
```
- **Explanation:** Allows for fractional ratings, like half-stars.

### 6️⃣ **`readOnly`**

```jsx
<Rating name="read-only" value={3} readOnly />
```
- **Explanation:** Displays the rating without allowing user interaction.

### 7️⃣ **`disabled`**

```jsx
<Rating name="disabled-rating" disabled />
```
- **Explanation:** Disables the rating input entirely.

### 8️⃣ **`onChange`**

```jsx
const handleChange = (event, newValue) => {
  console.log('Selected Rating:', newValue);
};

<Rating name="interactive-rating" onChange={handleChange} />
```
- **Explanation:** Fires when the user selects a new rating.

### 9️⃣ **`onChangeActive`** (Hover Interaction)

```jsx
const handleHover = (event, newHover) => {
  console.log('Hovered Rating:', newHover);
};

<Rating name="hover-rating" onChangeActive={handleHover} />
```
- **Explanation:** Detects when the user hovers over a rating item.

### 🔟 **`size`**

```jsx
<Rating name="small-rating" size="small" />
```
- **Explanation:** Adjusts the size of the rating icons.

### 11️⃣ **`icon` & `emptyIcon`**

```jsx
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

<Rating
  name="custom-icons"
  icon={<FavoriteIcon />} 
  emptyIcon={<FavoriteBorderIcon />} 
/>
```
- **Explanation:** Customizes the icons for filled and empty states.

### 12️⃣ **`highlightSelectedOnly`**

```jsx
<Rating name="highlight-selected" highlightSelectedOnly />
```
- **Explanation:** Highlights only the selected rating item instead of all preceding items.

### 13️⃣ **`sx`**

```jsx
<Rating name="styled-rating" sx={{ color: 'purple' }} />
```
- **Explanation:** Applies custom styles using MUI's `sx` prop.

### 14️⃣ **`className`**

```jsx
<Rating name="custom-class" className="custom-rating" />
```
- **Explanation:** Adds custom CSS classes for additional styling.

---

## 🧪 **Working with `event.target`**

While `Rating` doesn't expose `event.target.value` directly like `Radio`, the `onChange` event provides the **selected rating value** as the second argument.

### ✅ **Example: Capturing Rating Changes**

```jsx
import React, { useState } from 'react';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

export default function RatingExample() {
  const [value, setValue] = useState(3);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log('Selected Rating:', newValue);
  };

  return (
    <div>
      <Rating name="rating-example" value={value} onChange={handleChange} />
      <Typography>Selected Rating: {value}</Typography>
    </div>
  );
}
```

### 🔍 **Explanation:**
- **`event`**: Refers to the DOM event triggered by the rating change.
- **`newValue`**: The selected rating value (e.g., `1`, `2.5`, `4`).
- **Dynamic Updates:** The rating is controlled via `useState` to reflect real-time changes.

---

## 🔧 **Basic Usage with State Management**

Here's a practical example demonstrating how to **store**, **access**, and **manipulate** the rating value using React state.

```jsx
import React, { useState } from 'react';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

export default function RatingWithState() {
  const [rating, setRating] = useState(null);

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
    console.log('Event Target Name:', event.target.name);
    console.log('Selected Value:', newValue);
  };

  return (
    <div>
      <Typography variant="h6">Rate this Product:</Typography>
      <Rating
        name="product-feedback"
        value={rating}
        onChange={handleRatingChange}
      />
      <Typography>Your Rating: {rating !== null ? rating : 'No rating yet'}</Typography>
    </div>
  );
}
```

### 🔍 **Explanation:**
- **`rating` (State):** Manages the current rating value.
- **`handleRatingChange` (Event Handler):** Updates the state and logs the event details.
  - **`event.target.name`**: Returns the name of the rating component (`"product-feedback"`).
  - **`newValue`**: The new rating selected by the user.
- **Conditional Rendering:** Displays "No rating yet" if the user hasn't selected any rating.

---

## 🚀 **Conclusion**

The MUI `Rating` component is flexible, customizable, and user-friendly. Whether you need simple star ratings, custom icons, or advanced hover interactions, the `Rating` component integrates seamlessly with MUI's design system while providing excellent state management capabilities.

