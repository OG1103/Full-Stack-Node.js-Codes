
/*
  This file explains how to rename files in Node.js using the `fs.rename` and `fs.renameSync` methods.
*/

const fs = require('fs');

// Asynchronous file renaming
fs.rename('output.txt', 'renamed-output.txt', (err) => {
  if (err) {
    console.error("Error renaming the file:", err);
    return;
  }
  console.log("File renamed successfully!");
});

// Synchronous file renaming
try {
  fs.renameSync('output-sync.txt', 'renamed-output-sync.txt');
  console.log("File renamed successfully (sync)!");
} catch (err) {
  console.error("Error renaming the file:", err);
}
