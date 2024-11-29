
/*
  This file explains how to create a duplex stream in Node.js, which is both readable and writable.

  A duplex stream is a stream that can be used for both reading and writing data.
*/

const { Duplex } = require('stream');

// Create a simple duplex stream
const duplexStream = new Duplex({
  read(size) {
    this.push('This is some readable data.');
    this.push(null); // Indicate the end of readable data
  },
  write(chunk, encoding, callback) {
    console.log('Received writable data:', chunk.toString());
    callback();
  }
});

// Write data to the duplex stream
duplexStream.write('Writing some data to the duplex stream.');
duplexStream.end();

// Read data from the duplex stream
duplexStream.on('data', (chunk) => {
  console.log('Read from the duplex stream:', chunk.toString());
});
