# MUI FloatingActionButton (FAB) Component

## Overview

The MUI `FloatingActionButton` (FAB) is a circular button that floats above the content, typically used for primary actions within an application. It's often used in mobile and web apps for actions like adding new items, creating content, or performing prominent tasks.

```jsx
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function BasicFab() {
  return (
    <Fab color="primary" aria-label="add">
      <AddIcon />
    </Fab>
  );
}
```

## Props Table

| Prop               | Description                                                        | Type                   | Default |
|--------------------|--------------------------------------------------------------------|------------------------|---------|
| `color`            | The color of the FAB (`'default'`, `'primary'`, `'secondary'`, `'inherit'`, `'error'`, `'info'`, `'success'`, `'warning'`). | `string`               | `'default'` |
| `variant`          | Defines the button style (`'circular'`, `'extended'`).             | `string`               | `'circular'` |
| `size`             | Adjusts the FAB size (`'small'`, `'medium'`, `'large'`).           | `string`               | `'large'` |
| `disabled`         | Disables the button if `true`.                                    | `bool`                 | `false` |
| `onClick`          | Callback function triggered on click.                             | `function`             | `-`     |
| `href`             | Acts as a link if provided.                                        | `string`               | `-`     |
| `sx`               | The system prop for custom styles.                                 | `object`               | `{}`    |
| `className`        | Applies custom CSS classes.                                       | `string`               | `-`     |
| `style`            | Applies inline styles directly to the FAB.                        | `object`               | `{}`    |
| `disableRipple`    | Disables the ripple effect if `true`.                              | `bool`                 | `false` |
| `aria-label`       | Accessibility label for screen readers.                           | `string`               | `-`     |
| `icon`             | Icon component to display inside the FAB.                         | `node`                 | `-`     |
| `component`        | The component used for the root node.                              | `elementType`          | `button` |
| `focusVisibleClassName` | Class name applied when the button is focused.                   | `string`               | `-`     |

## Detailed Explanation of Each Prop

### 1. `color`

```jsx
<Fab color="secondary" aria-label="edit">
  <AddIcon />
</Fab>
```
- **Explanation:** Changes the FAB's background color.

### 2. `variant`

```jsx
<Fab variant="extended" color="primary">
  <AddIcon sx={{ mr: 1 }} />
  Add Item
</Fab>
```
- **Explanation:** Displays an extended FAB with text alongside the icon.

### 3. `size`

```jsx
<Fab size="small" color="primary" aria-label="small">
  <AddIcon />
</Fab>
```
- **Explanation:** Adjusts the FAB size (`small`, `medium`, `large`).

### 4. `disabled`

```jsx
<Fab disabled color="primary" aria-label="disabled">
  <AddIcon />
</Fab>
```
- **Explanation:** Disables the FAB, making it non-interactive.

### 5. `onClick`

```jsx
<Fab color="primary" aria-label="click" onClick={() => alert('FAB clicked!')}>
  <AddIcon />
</Fab>
```
- **Explanation:** Handles click events.

### 6. `href`

```jsx
<Fab color="primary" href="https://www.example.com" target="_blank">
  <AddIcon />
</Fab>
```
- **Explanation:** Turns the FAB into a link.

### 7. `sx`

```jsx
<Fab color="primary" sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}>
  <AddIcon />
</Fab>
```
- **Explanation:** Applies custom styles using the `sx` prop.

### 8. `className`

```jsx
<Fab className="custom-fab" color="primary">
  <AddIcon />
</Fab>
```
- **Explanation:** Adds a custom CSS class.

### 9. `style`

```jsx
<Fab style={{ backgroundColor: 'orange', padding: '20px' }}>
  <AddIcon />
</Fab>
```
- **Explanation:** Applies inline styles.

### 10. `disableRipple`

```jsx
<Fab color="primary" disableRipple>
  <AddIcon />
</Fab>
```
- **Explanation:** Disables the ripple effect on click.

### 11. `aria-label`

```jsx
<Fab color="primary" aria-label="add new item">
  <AddIcon />
</Fab>
```
- **Explanation:** Provides an accessibility label for screen readers.

### 12. `icon`

```jsx
<Fab color="primary" icon={<AddIcon />} aria-label="icon only" />
```
- **Explanation:** Adds an icon inside the FAB.

### 13. `component`

```jsx
<Fab component="a" href="#section">
  <AddIcon />
</Fab>
```
- **Explanation:** Changes the underlying element (e.g., from `button` to `a`).

### 14. `focusVisibleClassName`

```jsx
<Fab color="primary" focusVisibleClassName="focus-visible">
  <AddIcon />
</Fab>
```
- **Explanation:** Adds a class when the FAB gains focus.

## Handling Events with FAB

```jsx
const handleClick = (event) => {
  console.log('FAB clicked:', event);
};

<Fab color="primary" onClick={handleClick} aria-label="event">
  <AddIcon />
</Fab>
```

- **`event.target`**: Refers to the button element.
- **`event.currentTarget`**: The element to which the event handler is attached.

## Accessibility Considerations

- Use **`aria-label`** for meaningful descriptions.
- Ensure proper contrast ratios for visibility.
- Utilize **`tabIndex`** if custom focus management is needed.

## Conclusion

The MUI `FloatingActionButton` is a powerful component for emphasizing primary actions within an app. Its flexible props and styling options make it suitable for a variety of use cases, enhancing both functionality and user experience.

