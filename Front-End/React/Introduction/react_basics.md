# Introduction to React

## What is React?
- React is an **open-source JavaScript library** for building user interfaces.
- It is **not a framework** and focuses solely on UI.
- React uses **JSX (JavaScript XML)**, an HTML-like syntax inside JavaScript.
- JSX allows embedding HTML-like elements directly within JavaScript code, and React transforms them into actual HTML when rendering components in the browser.

---

## Why React?
### ✅ **Component-Based Architecture**
- React lets you break down your application into **small, reusable components**.
- Each component is an **encapsulated unit of code**, such as buttons, forms, and sections.

### ✅ **Declarative UI**
- In React, you **tell** it what the UI should look like, and React handles the rendering.
- This follows the **declarative programming paradigm**.

💡 **Example Analogy:**  
Telling an artist to draw a picture—you specify what you want, but not how to draw it.

---

## Starting a React Project

1. Navigate to the directory where you want to create the project.
2. Create a new React project:
   ```sh
   npx create-react-app my-app
   ```
3. Install React Router:
   ```sh
   npm install react-router-dom
   ```
4. Edit the `src/App.js` file to build your UI.

---

## **React Folder Structure**

### 📂 `public/` – Static Assets
#### **1. `favicon.ico`**
- The small icon displayed on the browser tab.
- Must be named `favicon.ico` for recognition.

#### **2. `index.html`**
- The **main HTML file** that React mounts onto.
- Contains:
  - **Head:** Metadata, links to the favicon.
  - **Body:** Contains an empty `<div id="root"></div>` where React components will render.

#### **3. `manifest.json`**
- Defines metadata for **Progressive Web Apps (PWAs)**.
- Specifies:
  - **App information** (name, description, icons).
  - **Theme and background colors**.
  - **Display mode** (fullscreen, standalone, browser).
  - **Start URL** when installed as a web app.
  - **Screen orientation** settings.
  - **Related applications** (links to native apps).

#### **4. `robots.txt`**
- Controls how **search engines** crawl and index the site.

---

### 📂 `src/` – React Application Code

#### **1. `App.js`** – Main Component
- The **entry component** of the React application.
- Usually contains:
  - **Nested components** (buttons, forms, sections).
  - **Routes** (if using React Router).
  - **Layout elements** (header, footer, navigation).

#### **2. `App.css`** – Global Styles
- Contains styles **shared across components**.
- Defines:
  - Themes and colors.
  - Base styles like resets or layouts.
  - Styling rules for `App.js` and global elements.

#### **3. `App.test.js`** – Testing File
- Contains unit tests using **Jest** or **React Testing Library**.
- Ensures the `App` component **renders correctly**.

#### **4. `index.js`** – React Entry Point
- Initializes the React app.
- Mounts the **App component** inside `#root` in `index.html`.
- Calls `ReactDOM.render()` or `ReactDOM.createRoot()`.

#### **5. `index.css`** – Global Stylesheet
- Defines **base styles** applied across the app.
- Can include:
  - Body styles (fonts, background, margins).
  - Resets and global styles.

#### **6. `reportWebVitals.js`** – Performance Monitoring
- Measures app performance using the **web-vitals** library.
- Tracks metrics like:
  - **Largest Contentful Paint (LCP)** – Loading speed.
  - **First Input Delay (FID)** – Responsiveness.
  - **Cumulative Layout Shift (CLS)** – Visual stability.

💡 **Note:** We often use external **CSS libraries** instead of `index.css`, but it is helpful for global styling.

---

## **React Snippets (Speed Up Development)**
💡 Install **ES7+ React/Redux/React-Native snippets** extension in VS Code.

🚀 **Shortcut for a Functional Component:**
1. Type `rafce`
2. Press `Tab`
3. It generates a **React functional component**:

```tsx
const Component = () => {
  return <div>Hello World</div>;
};

export default Component;
```

This extension provides **quick snippets** for components, hooks, and more!

---

## Conclusion
- React is a **component-based, declarative UI library**.
- The `public/` folder contains **static assets**.
- The `src/` folder contains **components, styles, and logic**.
- Using **JSX, components, and React Router**, we build modern, interactive applications.

🚀 **Ready to start your React journey? Let's build!** 🎉
