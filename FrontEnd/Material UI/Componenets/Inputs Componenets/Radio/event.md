# 🎯 Radio Button Event in MUI

The **MUI Radio Button** component provides an `onChange` event that allows handling user selections dynamically. Understanding the event parameter is essential for managing form state, selecting options, and implementing custom logic when a radio button is selected.

---

## 📌 **Understanding the `event` Parameter**

When a user selects a radio button, the `onChange` event fires and passes an `event` object. This event object contains important information, such as:

- **`event.target.value`** → The selected radio button's value.
- **`event.target.name`** → The `name` prop of the `Radio` component (useful for form grouping).
- **`event.target`** → The actual DOM element that triggered the event.

---

## 🔍 **Basic Example of Using `event` in `onChange`**

```jsx
import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function BasicRadioEvent() {
  const [selectedValue, setSelectedValue] = useState('option1');

  const handleChange = (event) => {
    console.log("Selected Value:", event.target.value);
    console.log("Event Target Name:", event.target.name);
    setSelectedValue(event.target.value);
  };

  return (
    <RadioGroup name="exampleGroup" value={selectedValue} onChange={handleChange}>
      <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
      <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
    </RadioGroup>
  );
}
```

### 📝 **Example Output:**
If the user selects "Option 2," the console logs:
```
Selected Value: option2
Event Target Name: exampleGroup
```

### **Explanation:**
- `event.target.value` retrieves the selected value (`option2`).
- `event.target.name` identifies the radio button group (`exampleGroup`).
- `setSelectedValue(event.target.value)` updates the state with the new selection.

---

## 🔄 **Handling Multiple Radio Groups with `event.target.name`**

When using multiple radio groups, `event.target.name` helps differentiate between them.

```jsx
const [formData, setFormData] = useState({ gender: '', preference: '' });

const handleRadioChange = (event) => {
  setFormData({
    ...formData,
    [event.target.name]: event.target.value,
  });
};

<>
  <RadioGroup name="gender" value={formData.gender} onChange={handleRadioChange}>
    <FormControlLabel value="male" control={<Radio />} label="Male" />
    <FormControlLabel value="female" control={<Radio />} label="Female" />
  </RadioGroup>

  <RadioGroup name="preference" value={formData.preference} onChange={handleRadioChange}>
    <FormControlLabel value="vegan" control={<Radio />} label="Vegan" />
    <FormControlLabel value="non-vegan" control={<Radio />} label="Non-Vegan" />
  </RadioGroup>
</>;
```

### 📝 **Example Output:**
If the user selects "Female" and "Vegan," the console logs:
```
Updated Form Data: { gender: 'female', preference: 'vegan' }
```

### **Explanation:**
- `event.target.name` dynamically updates the correct state property.
- `event.target.value` provides the selected radio option.

---

## 🎯 **Advanced: Using `event` in Form Handling**

When using the `Radio` component inside a form, dynamically managing multiple fields improves efficiency.

```jsx
const [formData, setFormData] = useState({ paymentMethod: '', shipping: '' });

const handleChange = (event) => {
  setFormData({
    ...formData,
    [event.target.name]: event.target.value,
  });
};

<>
  <RadioGroup name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
    <FormControlLabel value="credit" control={<Radio />} label="Credit Card" />
    <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
  </RadioGroup>

  <RadioGroup name="shipping" value={formData.shipping} onChange={handleChange}>
    <FormControlLabel value="standard" control={<Radio />} label="Standard" />
    <FormControlLabel value="express" control={<Radio />} label="Express" />
  </RadioGroup>
</>;
```

### 📝 **Example Output:**
If the user selects "PayPal" and "Express Shipping," the console logs:
```
Updated Form Data: { paymentMethod: 'paypal', shipping: 'express' }
```

### **Explanation:**
- The function dynamically updates form state using `event.target.name`.
- Useful for managing grouped form fields efficiently.

---

## 🚀 **Conclusion**

Understanding the `event` parameter in the `onChange` event of the `Radio` component enables efficient handling of user interactions. Whether updating state, selecting options, or managing grouped inputs, leveraging `event.target.value` and `event.target.name` ensures seamless integration in React applications.

