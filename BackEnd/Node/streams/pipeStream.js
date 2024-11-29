
/*
  This file explains how to use the `pipe` method in Node.js streams to read from a readable stream and write to a writable stream.

  `pipe()` allows data to be passed from one stream to another.
*/

const fs = require('fs');

// Create a readable stream from a file
const readStream = fs.createReadStream('example.txt', 'utf8');

// Create a writable stream to write to another file
const writeStream = fs.createWriteStream('output.txt', 'utf8');

// Pipe the read stream into the write stream
readStream.pipe(writeStream);

// Handle the 'finish' event for the write stream
writeStream.on('finish', () => {
  console.log('Data piped and written successfully.');
});

// Handle errors in both streams
readStream.on('error', (err) => {
  console.error('Error reading the file:', err);
});

writeStream.on('error', (err) => {
  console.error('Error writing to the file:', err);
});
