
/*
  This file explains how to create a transform stream in Node.js, which allows you to modify the data as it is being piped through.

  Transform streams are a type of duplex stream where the output is computed from the input.
*/

const { Transform } = require('stream');

// Create a transform stream that converts data to uppercase
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    // Convert the chunk to uppercase and pass it to the next step
    const upperCaseChunk = chunk.toString().toUpperCase();
    callback(null, upperCaseChunk);
  }
});

// Use the transform stream with a readable and writable stream
const fs = require('fs');
const readStream = fs.createReadStream('example.txt', 'utf8');
const writeStream = fs.createWriteStream('output.txt', 'utf8');

// Pipe the read stream through the transform stream and into the write stream
readStream.pipe(upperCaseTransform).pipe(writeStream);

writeStream.on('finish', () => {
  console.log('Data transformed and written successfully.');
});
