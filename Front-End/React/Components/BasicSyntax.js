// MyComponent.js

// Import React to use JSX
import React from "react";

// Define a functional component called MyComponent
const MyComponent = () => {
  // The component returns JSX, which is similar to HTML
  return (
    <div>
      <h1>Hello, React!</h1>
      <p>This is my first React component.</p>
    </div>
  );
};

// Export the component to use it in other parts of the app
//export default MyComponent;

//--------------------------------------------------------------------------

// Nesting it in the App.js componenet

import React from "react";
//import MyComponent from './MyComponent'; // Importing the component

function App() {
  return (
    <div>
      <MyComponent /> {/* Rendering MyComponent */}
    </div>
  );
}

export default App;

//-------------------------------------------------------------------------------

// If im assigning it to a route in the App.js

// // App.js
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import MyComponent from './MyComponent'; // Importing the component

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Define a route for MyComponent */}
//         <Route path="/my-component" element={<MyComponent />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
