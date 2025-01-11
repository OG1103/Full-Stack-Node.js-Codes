// Example of using EventEmitter in Node.js

import { EventEmitter } from "events";
const myEmitter = new EventEmitter();

// Registering a listener
myEmitter.on("data", (info) => {
  console.log(`Received data: ${info}`);
});

// Emitting an event
myEmitter.emit("data", "Hello World");

// Using once to register a one-time listener
myEmitter.once("greet", (name) => {
  console.log(`Hello for the first time, ${name}!`);
});

myEmitter.emit("greet", "Alice"); // Listener is called
myEmitter.emit("greet", "Alice"); // Listener is not called

// Handling errors
myEmitter.on("error", (err) => {
  console.error(`Error: ${err.message}`);
});

myEmitter.emit("error", new Error("Something went wrong"));
