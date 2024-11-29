
# Differences between HTML and JSX

When coding in JSX, there are some differences from standard HTML. These differences are mostly due to the fact that JSX is a syntax extension of JavaScript, and not HTML itself.

### 1. **`class` becomes `className`**
In HTML, the attribute used for applying CSS classes is `class`. However, since `class` is a reserved keyword in JavaScript, JSX uses `className` instead.

**HTML Example:**

```html
<div class="container"></div>
```

**JSX Example:**

```jsx
<div className="container"></div>
```

### 2. **`for` becomes `htmlFor`**
In HTML, the `for` attribute is used with `<label>` elements to associate them with form elements. In JSX, since `for` is a reserved keyword, the attribute is renamed to `htmlFor`.

**HTML Example:**

```html
<label for="inputId">Name</label>
```

**JSX Example:**

```jsx
<label htmlFor="inputId">Name</label>
```

### 3. **`onclick` becomes `onClick`**
In HTML, event handlers such as `onclick` are written in lowercase. In JSX, event handlers follow the camelCase convention, so `onclick` becomes `onClick`.

**HTML Example:**

```html
<button onclick="handleClick()">Click Me</button>
```

**JSX Example:**

```jsx
<button onClick={handleClick}>Click Me</button>

```

### 4. **Self-closing Tags**
In JSX, elements that don’t have children (e.g., `<img>`, `<input>`) must be self-closed by adding a `/` at the end.

**HTML Example:**

```html
<img src="image.jpg">
```

**JSX Example:**

```jsx
<img src="image.jpg" />
```

### 5. **`style` attribute**
In JSX, the `style` attribute must be written as an object, with property names written in camelCase instead of the standard hyphenated syntax used in CSS.

**HTML Example:**

```html
<div style="background-color: red; color: white;"></div>
```

**JSX Example:**

```jsx
<div style={{ backgroundColor: 'red', color: 'white' }}></div>
```

### 6. **Boolean Attributes**
In HTML, you can simply write a boolean attribute like `disabled`, but in JSX, you must explicitly set it to `true` or `false`.

**HTML Example:**

```html
<button disabled>Submit</button>
```

**JSX Example:**

```jsx
<button disabled={true}>Submit</button>
```

### 7. **Comments in JSX**
In HTML, comments are written with `<!-- -->`. In JSX, comments are written using curly braces inside the JSX element.

**HTML Example:**

```html
<!-- This is a comment -->
```

**JSX Example:**

```jsx
{/* This is a comment */}
```

---

## Conclusion

JSX has several differences compared to standard HTML due to its integration with JavaScript. Understanding these differences is important when working with React components. The changes such as using `className` instead of `class`, camelCase event handlers, and self-closing tags are some of the key distinctions to keep in mind.
