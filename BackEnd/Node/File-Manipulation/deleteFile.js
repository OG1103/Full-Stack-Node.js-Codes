
/*
  This file explains how to delete files in Node.js using the `fs.unlink` and `fs.unlinkSync` methods.
*/

const fs = require('fs');

// Asynchronous file deletion
fs.unlink('renamed-output.txt', (err) => {
  if (err) {
    console.error("Error deleting the file:", err);
    return;
  }
  console.log("File deleted successfully!");
});

// Synchronous file deletion
try {
  fs.unlinkSync('renamed-output-sync.txt');
  console.log("File deleted successfully (sync)!");
} catch (err) {
  console.error("Error deleting the file:", err);
}
