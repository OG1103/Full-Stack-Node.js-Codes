# 🌟 Understanding `createTheme` and Applying It Globally in React & Next.js

## 📌 What is `createTheme`?
`createTheme` is a function from **Material-UI (MUI)** that allows you to define a **custom theme** for your React or Next.js application. It lets you modify:
- Colors (Primary, Secondary, Background, Text)
- Typography (Fonts, Font Sizes, Letter Spacing)
- Component Styles (Buttons, Inputs, etc.)
- Spacing & Breakpoints
- When you create a custom theme using createTheme, it only overrides the fields you explicitly define.
- Any fields not declared in your custom theme retain their default values from Material UI’s original theme.
- These undeclared fields still exist and can be accessed when needed. ex: theme.palette.grey[500]; can still be accessed without defined the grey scale field as its part of the default theme. 

Once a theme is created, it needs to be applied **globally** using the `ThemeProvider`.

---

## 🚀 **How to Use `createTheme` in a React App**

### ✅ **Step 1: Install Material-UI**
If you haven't installed MUI, run:
```sh
npm install @mui/material @emotion/react @emotion/styled
```

### ✅ **Step 2: Create a Custom Theme**
In your project, create a file: `theme.js` or `theme.ts`

```tsx
// src/theme.js (or theme.ts)
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007bff",
    },
    secondary: {
      main: "#ff5722",
    },
  },
  typography: {
    fontFamily: "Arial",
  },
});

export default theme;
```

### ✅ **Step 3: Apply `ThemeProvider` in `index.js` or `App.js`**
To make sure the theme is **available globally**, wrap your **entire application** with `ThemeProvider`.

```tsx
// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import theme from "./theme";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
```

Now, all components in your React app will use this theme.

---

## 🚀 **How to Use `createTheme` in Next.js**

### ✅ **Step 1: Install Material-UI**
```sh
npm install @mui/material @emotion/react @emotion/styled
```

### ✅ **Step 2: Create a Custom Theme**
Create a file inside your project (e.g., `app/theme.ts`):

```tsx
// app/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#6200ea" },
    secondary: { main: "#03dac6" },
  },
  typography: {
    fontFamily: "Roboto",
  },
});

export default theme;
```

### ✅ **Step 3: Apply Theme Globally in `_app.tsx`**
Next.js uses `_app.tsx` to wrap all pages with global providers.

```tsx
// pages/_app.tsx
import { ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import theme from "@/app/theme";

// If using jsx remove the AppProps

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
```

---

## 🔥 **What Does It Mean to Wrap with `ThemeProvider`?**

When we **wrap the app with `ThemeProvider`**, it means:
- The **custom theme is accessible** to all components in the app.
- Components using MUI will automatically **inherit the theme's styles**.
- We can **use `useTheme()`** to access the theme inside a component.

Example:

```tsx
import { useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";

const CustomComponent = () => {
  const theme = useTheme(); // Get the global theme

  return (
    <Typography color={theme.palette.primary.main}>
      This text uses the primary theme color!
    </Typography>
  );
};

export default CustomComponent;
```

Here, `useTheme()` allows us to **access theme properties dynamically**.

---

## 🛠 **Flow of How `createTheme` Works**

1️⃣ **Create a theme** using `createTheme()`.  
2️⃣ **Wrap the entire application** with `ThemeProvider`.  
3️⃣ **All components inside `ThemeProvider`** can now use the theme.  
4️⃣ **Use `useTheme()`** to access the theme inside a component.  

---

## 🎯 **Key Takeaways**
✔ `createTheme` customizes MUI styles (colors, typography, components).  
✔ `ThemeProvider` **must wrap the entire app** to apply the theme globally.  
✔ `useTheme()` allows you to access the theme inside components.  
✔ Works **the same way in both React and Next.js**, but in Next.js, you wrap `_app.tsx` instead of `index.js`.

🚀 Now you're ready to **apply custom themes globally** in your React and Next.js apps!  

---

## 🔗 **Further Reading**
- [Material-UI Theming Docs](https://mui.com/customization/theming/)
