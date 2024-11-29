
/*
  This file explains how to create and use readable streams in Node.js using the `fs.createReadStream` method.

  A readable stream allows you to read large files in chunks, which is more memory-efficient than reading the entire file at once.
*/

const fs = require('fs');

// Create a readable stream from a file
const readStream = fs.createReadStream('example.txt', 'utf8');

// Handle the 'data' event to receive chunks of data
readStream.on('data', (chunk) => {
  console.log('Received chunk:', chunk);
});

// Handle the 'end' event to know when the stream has finished
readStream.on('end', () => {
  console.log('No more data to read.');
});

// Handle errors
readStream.on('error', (err) => {
  console.error('Error reading the file:', err);
});
