
/*
  This file explains how to read files in Node.js using the `fs.readFile` method.
  The `fs` module provides an asynchronous and synchronous method to read files.
*/

const fs = require('fs');

// Asynchronous file reading
// Provide the callback function were we pass err,result (first argument represents the error and second argument represents result)
// we check if there is an error and we do something
// alternatively can wrap it around async/await
fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }
  console.log("Asynchronous file content:", data);
});

// Synchronous file reading
try {
  const data = fs.readFileSync('example.txt', 'utf8');
  console.log("Synchronous file content:", data);
} catch (err) {
  console.error("Error reading the file:", err);
}

// we gotta pass the encoding utf8