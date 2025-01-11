// Event Loop Example in Node.js

console.log('Start');

setTimeout(() => {
  console.log('Timeout callback');
}, 0);

setImmediate(() => {
  console.log('Immediate callback');
});

Promise.resolve().then(() => {
  console.log('Promise callback');
});

console.log('End');
