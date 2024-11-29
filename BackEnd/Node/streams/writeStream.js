
/*
  This file explains how to create and use writable streams in Node.js using the `fs.createWriteStream` method.

  A writable stream allows you to write large amounts of data in chunks to a file.
*/

const fs = require('fs');

// Create a writable stream to write to a file
const writeStream = fs.createWriteStream('output.txt', 'utf8');

// Write chunks of data to the stream
writeStream.write('This is the first chunk of data.\n');
writeStream.write('This is the second chunk of data.\n');

// Mark the end of the file
writeStream.end('This is the last chunk of data.');

// Handle the 'finish' event to know when all data has been written
writeStream.on('finish', () => {
  console.log('All data written to the file.');
});

// Handle errors
writeStream.on('error', (err) => {
  console.error('Error writing to the file:', err);
});
