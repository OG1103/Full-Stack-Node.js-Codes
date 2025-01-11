import { EventEmitter } from 'events';

const myEmitter = new EventEmitter();

// Register event listeners
myEmitter.on('greet', (name) => {
    console.log(`Hello, ${name}!`);
});

myEmitter.on('farewell', (name) => {
    console.log(`Goodbye, ${name}!`);
});

export default myEmitter;
