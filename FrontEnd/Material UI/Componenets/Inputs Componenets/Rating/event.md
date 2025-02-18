# ⭐ Rating Event in MUI

The **MUI Rating** component provides an `onChange` event that allows handling user interactions dynamically. Understanding the event parameter is essential for managing user feedback, capturing rating values, and implementing custom logic when a rating is selected.

---

## 📌 **Understanding the `event` Parameter**

When a user selects a rating, the `onChange` event fires and passes an `event` object. This event object contains important information, such as:

- **`event.target.value (newValue)`** → The selected rating value.
- **`event.target.name`** → The `name` prop of the `Rating` component (useful for form integration).
- **`event.target`** → The actual DOM element that triggered the event.

---

## 🔍 **Basic Example of Using `event` in `onChange`**

```jsx
import React, { useState } from 'react';
import Rating from '@mui/material/Rating';

export default function BasicRatingEvent() {
  const [rating, setRating] = useState(3);
  //Takes new value as a parameter
  const handleChange = (event, newValue) => {
    console.log("Selected Rating:", newValue);
    console.log("Event Target Name:", event.target.name);
    setRating(newValue);
  };

  return (
    <Rating name="userRating" value={rating} onChange={handleChange} />
  );
}
```

### 📝 **Example Output:**
If the user selects a rating of 4, the console logs:
```
Selected Rating: 4
Event Target Name: userRating
```

### **Explanation:**
- `newValue` represents the selected rating.
- `event.target.name` helps identify the rating component in forms.
- `setRating(newValue)` updates the state with the new rating.

---

## 🔄 **Handling Multiple Ratings with `event.target.name`**

When using multiple rating components, `event.target.name` helps differentiate between them.

```jsx
const [ratings, setRatings] = useState({ product: 3, service: 4 });

const handleRatingChange = (event, newValue) => {
  setRatings({
    ...ratings,
    [event.target.name]: newValue,
  });
};

<>
  <Rating name="product" value={ratings.product} onChange={handleRatingChange} /> Product Rating
  <Rating name="service" value={ratings.service} onChange={handleRatingChange} /> Service Rating
</>;
```

### 📝 **Example Output:**
If the user updates the product rating to 5, the console logs:
```
Updated Ratings: { product: 5, service: 4 }
```

### **Explanation:**
- `event.target.name` helps update the correct rating in the state.
- `newValue` provides the selected rating.

---

## 🎯 **Advanced: Using `event` in Form Handling**

When using the `Rating` component inside a form, dynamically managing multiple ratings improves efficiency.

```jsx
const [formData, setFormData] = useState({ quality: 4, experience: 3 });

const handleChange = (event, newValue) => {
  setFormData({
    ...formData,
    [event.target.name]: newValue,
  });
};

<>
  <Rating name="quality" value={formData.quality} onChange={handleChange} /> Quality
  <Rating name="experience" value={formData.experience} onChange={handleChange} /> Experience
</>;
```

### 📝 **Example Output:**
If the user selects 5 for "Experience," the console logs:
```
Updated Form Data: { quality: 4, experience: 5 }
```

### **Explanation:**
- The function dynamically updates form state using `event.target.name`.
- Useful when managing multiple rating inputs in a structured form.

---

## 🚀 **Conclusion**

Understanding the `event` parameter in the `onChange` event of the `Rating` component enables efficient handling of user feedback. Whether updating state, capturing reviews, or managing multiple ratings, leveraging `event.target.value` and `event.target.name` ensures seamless integration in React applications.

