// useContextExample.jsx

import React, { createContext, useContext } from 'react';

// Create a context with a default value
const ThemeContext = createContext('light');

// A component that uses the context value
function ThemedComponent() {
  const theme = useContext(ThemeContext);
  return (
    <div style={{ background: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}>
      The current theme is {theme}
    </div>
  );
}

// Main App component that provides the context value
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedComponent />
    </ThemeContext.Provider>
  );
}

export default App;
