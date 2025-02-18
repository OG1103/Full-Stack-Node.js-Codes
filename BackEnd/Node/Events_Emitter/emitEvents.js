import myEmitter from "./eventEmitterListener";

// I imported my emitter and since the listeners are also in the same file so it's valid.
// If the listeners regarding the emitted events are in a separate file, I will have to import them before emitting.

// Emit events
myEmitter.emit('greet', 'Alice');
myEmitter.emit('farewell', 'Bob');
