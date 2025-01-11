
/*
  This file explains how to append content to files in Node.js using the `fs.appendFile` and `fs.appendFileSync` methods.
*/

const fs = require('fs');

// Asynchronous file appending
// Provide the callback function were we pass err,result (first argument represents the error and second argument represents result)
// we check if there is an error and we do something
// alternatively can wrap it around async/await
fs.appendFile('output.txt', '\nAppended Text!', 'utf8', (err) => {
  if (err) {
    console.error("Error appending to the file:", err);
    return;
  }
  console.log("Content appended successfully!");
});

// Synchronous file appending
try {
  fs.appendFileSync('output-sync.txt', '\nAppended Text!', 'utf8');
  console.log("Content appended successfully (sync)!");
} catch (err) {
  console.error("Error appending to the file:", err);
}
