
/*
  This file explains how to write files in Node.js using the `fs.writeFile` and `fs.writeFileSync` methods.
*/

const fs = require('fs');

// Asynchronous file writing
// Provide the callback function were we pass err,result (first argument represents the error and second argument represents result)
// we check if there is an error and we do something 
// alternatively can wrap it around async/await
fs.writeFile('output.txt', 'Hello, World!', 'utf8', (err,result) => {
  if (err) {
    console.error("Error writing the file:", err);
    return;
  }
  console.log("File written successfully!");
});

// Synchronous file writing
try {
  fs.writeFileSync('output-sync.txt', 'Hello, World!', 'utf8');
  console.log("File written successfully (sync)!");
} catch (err) {
  console.error("Error writing the file:", err);
}
