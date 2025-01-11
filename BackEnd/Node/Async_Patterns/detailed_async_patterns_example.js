// Example of Callback Pattern
const fs = require('fs');

fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File content:', data);
});

// Example of Promise Pattern
const fsPromises = require('fs').promises;

fsPromises.readFile('example.txt', 'utf8')
  .then(data => {
    console.log('File content:', data);
  })
  .catch(err => {
    console.error('Error reading file:', err);
  });

// Example of Async/Await Pattern
async function readFileAsync() {
  try {
    const data = await fsPromises.readFile('example.txt', 'utf8');
    console.log('File content:', data);
  } catch (err) {
    console.error('Error reading file:', err);
  }
}

readFileAsync();

// Example of Event-Driven Asynchronous Pattern
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

myEmitter.on('data', (info) => {
  console.log('Received data:', info);
});

setTimeout(() => {
  myEmitter.emit('data', 'Hello World');
}, 1000);
