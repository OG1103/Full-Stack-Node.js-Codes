
/*
  This file explains how to append content to files in Node.js using the `fs.appendFile` and `fs.appendFileSync` methods.
*/

const fs = require('fs');

// Asynchronous file appending
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
