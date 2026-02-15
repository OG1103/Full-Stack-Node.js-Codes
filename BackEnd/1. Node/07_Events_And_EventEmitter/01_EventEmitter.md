# Node.js — Events & EventEmitter

The **event-driven architecture** is at the heart of Node.js. The `EventEmitter` class (from the `events` module) allows objects to **emit named events** and **register listener functions** that execute when those events are triggered. Many built-in Node.js modules (Streams, HTTP, etc.) are built on top of EventEmitter.

---

## 1. Core Concept

Instead of calling functions directly, the event-driven pattern works by:
1. **Registering listeners** — "When event X happens, run this function"
2. **Emitting events** — "Event X just happened" → all registered listeners execute

This decouples the code that triggers an action from the code that responds to it.

```javascript
import { EventEmitter } from 'events';

const emitter = new EventEmitter();

// Step 1: Register a listener for the 'greet' event
emitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

// Step 2: Emit the 'greet' event (triggers the listener)
emitter.emit('greet', 'Omar');
// Output: Hello, Omar!
```

**Important order:** You must **register the listener first**, then **emit the event**. If you emit before registering, nothing happens.

---

## 2. Creating an EventEmitter

```javascript
import { EventEmitter } from 'events';

// Option 1: Create an instance directly
const emitter = new EventEmitter();

// Option 2: Extend EventEmitter in your own class
class OrderService extends EventEmitter {
  placeOrder(order) {
    // ... process the order
    this.emit('orderPlaced', order);  // Emit event when order is placed
  }
}

const orderService = new OrderService();
orderService.on('orderPlaced', (order) => {
  console.log(`Order received: ${order.id}`);
});
orderService.placeOrder({ id: 1, item: 'Laptop' });
```

---

## 3. EventEmitter Methods

### `on(event, listener)` — Register a Listener

Adds a listener that runs every time the event is emitted:

```javascript
emitter.on('data', (info) => {
  console.log(`Received: ${info}`);
});

emitter.emit('data', 'Hello');   // Received: Hello
emitter.emit('data', 'World');   // Received: World
```

`addListener()` is an alias for `on()` — they do the same thing.

### `once(event, listener)` — One-Time Listener

The listener runs **only the first time** the event is emitted, then it's automatically removed:

```javascript
emitter.once('connect', () => {
  console.log('Connected for the first time!');
});

emitter.emit('connect');   // Connected for the first time!
emitter.emit('connect');   // (nothing happens — listener was removed)
```

### `emit(event, ...args)` — Trigger an Event

Emits an event, causing all registered listeners for that event to execute. Returns `true` if there were listeners, `false` otherwise.

```javascript
// Pass multiple arguments
emitter.on('userCreated', (id, name, email) => {
  console.log(`User: ${id}, ${name}, ${email}`);
});

emitter.emit('userCreated', 1, 'John', 'john@example.com');
// User: 1, John, john@example.com

// Pass an object
emitter.on('orderPlaced', (order) => {
  console.log(`Order ${order.id}: ${order.item}`);
});

emitter.emit('orderPlaced', { id: 1, item: 'Laptop', price: 999 });
```

### `removeListener(event, listener)` — Remove a Specific Listener

```javascript
function onData(data) {
  console.log(`Data: ${data}`);
}

emitter.on('data', onData);
emitter.emit('data', 'test');         // Data: test

emitter.removeListener('data', onData);
emitter.emit('data', 'test');         // (nothing — listener removed)
```

`off()` is an alias for `removeListener()`.

**Note:** You must pass the **same function reference** — anonymous functions cannot be removed this way.

### `removeAllListeners([event])` — Remove All Listeners

```javascript
// Remove all listeners for a specific event
emitter.removeAllListeners('data');

// Remove ALL listeners for ALL events
emitter.removeAllListeners();
```

### `listenerCount(event)` — Count Listeners

```javascript
emitter.on('data', () => {});
emitter.on('data', () => {});
console.log(emitter.listenerCount('data'));  // 2
```

### `eventNames()` — List Registered Events

```javascript
emitter.on('data', () => {});
emitter.on('error', () => {});
console.log(emitter.eventNames());  // ['data', 'error']
```

### `prependListener(event, listener)` — Add Listener to the Front

By default, listeners run in the order they were added. `prependListener` adds to the beginning:

```javascript
emitter.on('data', () => console.log('Second'));
emitter.prependListener('data', () => console.log('First'));

emitter.emit('data');
// First
// Second
```

---

## 4. All Methods Reference

| Method | Description |
|--------|-------------|
| `on(event, fn)` | Register a persistent listener |
| `once(event, fn)` | Register a one-time listener |
| `emit(event, ...args)` | Trigger an event with arguments |
| `off(event, fn)` | Remove a specific listener |
| `removeListener(event, fn)` | Same as `off()` |
| `removeAllListeners([event])` | Remove all listeners (or for one event) |
| `listenerCount(event)` | Number of listeners for an event |
| `listeners(event)` | Array of listener functions |
| `eventNames()` | Array of registered event names |
| `prependListener(event, fn)` | Add listener to the front of the queue |
| `prependOnceListener(event, fn)` | One-time listener at the front |
| `setMaxListeners(n)` | Set max listeners per event (default: 10) |

---

## 5. Error Handling

The `'error'` event is special in Node.js. If an `'error'` event is emitted and there is **no listener** for it, Node.js will **throw an exception and crash**.

```javascript
// BAD — no error listener → crash!
emitter.emit('error', new Error('Something failed'));
// Throws: Error: Something failed

// GOOD — always handle errors
emitter.on('error', (err) => {
  console.error(`Error occurred: ${err.message}`);
});

emitter.emit('error', new Error('Something failed'));
// Error occurred: Something failed
```

**Rule:** Always register an `'error'` listener on any EventEmitter that might emit errors.

---

## 6. Splitting Emitter and Listeners Across Files

In real applications, you often define the emitter in one file, listeners in another, and emit events in a third.

### Define the Emitter

```javascript
// events/emitter.js
import { EventEmitter } from 'events';

const appEmitter = new EventEmitter();
export default appEmitter;
```

### Register Listeners

```javascript
// events/listeners.js
import appEmitter from './emitter.js';

appEmitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

appEmitter.on('farewell', (name) => {
  console.log(`Goodbye, ${name}!`);
});
```

### Emit Events

```javascript
// app.js
import appEmitter from './events/emitter.js';
import './events/listeners.js';    // Importing runs the file → registers listeners

// Now we can safely emit events
appEmitter.emit('greet', 'Alice');     // Hello, Alice!
appEmitter.emit('farewell', 'Bob');    // Goodbye, Bob!
```

**Important:** Import the **listeners file** before emitting events. The import executes the file, which registers the listeners. If you emit before importing listeners, nothing happens.

---

## 7. Practical Use Cases

### Logging System

```javascript
class Logger extends EventEmitter {
  log(message) {
    console.log(message);
    this.emit('logged', { message, timestamp: new Date() });
  }
}

const logger = new Logger();
logger.on('logged', ({ message, timestamp }) => {
  // Save to file, send to monitoring service, etc.
  fs.appendFileSync('app.log', `[${timestamp}] ${message}\n`);
});

logger.log('Server started');
```

### Order Processing Pipeline

```javascript
class OrderService extends EventEmitter {
  async placeOrder(order) {
    // Process payment...
    this.emit('orderPlaced', order);
  }
}

const orders = new OrderService();

// Each listener handles a different concern
orders.on('orderPlaced', (order) => sendConfirmationEmail(order));
orders.on('orderPlaced', (order) => updateInventory(order));
orders.on('orderPlaced', (order) => notifyWarehouse(order));

await orders.placeOrder({ id: 1, item: 'Laptop' });
```

---

## 8. Built-in Modules That Use EventEmitter

Many core Node.js modules extend EventEmitter:

| Module | Events |
|--------|--------|
| `http.Server` | `'request'`, `'connection'`, `'close'` |
| `fs.ReadStream` | `'data'`, `'end'`, `'error'`, `'close'` |
| `fs.WriteStream` | `'finish'`, `'error'`, `'close'` |
| `net.Socket` | `'data'`, `'connect'`, `'close'`, `'error'` |
| `process` | `'exit'`, `'uncaughtException'`, `'SIGINT'` |

```javascript
// HTTP server uses EventEmitter under the hood
const server = http.createServer();

server.on('request', (req, res) => {
  res.end('Hello');
});

server.on('close', () => {
  console.log('Server shut down');
});

server.listen(3000);
```

---

## 9. Summary

| Concept | Detail |
|---------|--------|
| EventEmitter | Class for emitting and listening to named events |
| `on(event, fn)` | Register a persistent listener |
| `once(event, fn)` | Register a one-time listener |
| `emit(event, ...args)` | Trigger an event with data |
| `off(event, fn)` | Remove a listener |
| `'error'` event | Must have a listener — otherwise crashes Node |

### Key Points

1. **Register listeners before emitting** — order matters
2. **Always handle the `'error'` event** — unhandled errors crash Node.js
3. `once()` automatically removes the listener after the first call
4. To remove a listener, you need the **same function reference** (can't remove anonymous functions)
5. When splitting across files, **import the listener file** before emitting events
6. Many Node.js built-in modules (HTTP, Streams, etc.) are built on EventEmitter
7. Use events to **decouple** code — the emitter doesn't need to know who's listening
