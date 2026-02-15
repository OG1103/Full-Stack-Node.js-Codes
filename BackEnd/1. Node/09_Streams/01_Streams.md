# Node.js — Streams

Streams are a way to handle **reading and writing data in chunks** (piece by piece) rather than loading everything into memory at once. They are essential for processing large files, real-time data, and network communication efficiently.

Streams are instances of **EventEmitter**, meaning they emit events like `'data'`, `'end'`, `'error'`, and `'finish'`.

---

## 1. Why Streams?

| Without Streams | With Streams |
|----------------|--------------|
| Load entire file into memory | Process in small chunks |
| Memory usage = file size | Memory usage = chunk size (typically 64KB) |
| Must wait for entire file to load | Start processing immediately |
| Can crash on large files (out of memory) | Handles files of any size |

### Example: Reading a 2GB File

```javascript
// BAD — loads entire 2GB file into memory
const data = await fs.readFile('large-file.txt', 'utf8');

// GOOD — processes in 64KB chunks
const stream = fs.createReadStream('large-file.txt', 'utf8');
stream.on('data', (chunk) => {
  // Process each chunk (64KB at a time)
});
```

---

## 2. Types of Streams

| Type | Description | Example |
|------|-------------|---------|
| **Readable** | Read data from a source | `fs.createReadStream()`, HTTP response |
| **Writable** | Write data to a destination | `fs.createWriteStream()`, HTTP request |
| **Duplex** | Both readable and writable | TCP socket, WebSocket |
| **Transform** | Modify data as it passes through | Compression (`zlib`), encryption |

---

## 3. Readable Streams

Readable streams let you **read data from a source** in chunks.

### Creating a Readable Stream

```javascript
import fs from 'fs';

const readStream = fs.createReadStream('example.txt', {
  encoding: 'utf8',     // Return strings instead of Buffers
  highWaterMark: 64 * 1024,  // Chunk size in bytes (default: 64KB)
});
```

### Events

```javascript
// 'data' — Emitted for each chunk of data
readStream.on('data', (chunk) => {
  console.log(`Received ${chunk.length} characters`);
  console.log(chunk);
});

// 'end' — Emitted when there is no more data to read
readStream.on('end', () => {
  console.log('Finished reading');
});

// 'error' — Emitted on error
readStream.on('error', (err) => {
  console.error('Error:', err.message);
});

// 'open' — Emitted when the file is opened
readStream.on('open', () => {
  console.log('File opened');
});

// 'close' — Emitted when the stream and underlying resource are closed
readStream.on('close', () => {
  console.log('Stream closed');
});
```

### Flow Control

```javascript
// Pause reading
readStream.pause();

// Resume reading
readStream.resume();

// Check if still readable
console.log(readStream.readable);  // true/false
```

---

## 4. Writable Streams

Writable streams let you **write data to a destination** in chunks.

### Creating a Writable Stream

```javascript
import fs from 'fs';

const writeStream = fs.createWriteStream('output.txt', {
  encoding: 'utf8',
  flags: 'w',  // 'w' = write (default), 'a' = append
});
```

### Writing Data

```javascript
// Write chunks of data
writeStream.write('First chunk of data.\n');
writeStream.write('Second chunk of data.\n');
writeStream.write('Third chunk of data.\n');

// Signal that no more data will be written
writeStream.end('Final chunk.\n');
// You can optionally pass one last piece of data to end()
```

### Events

```javascript
// 'finish' — Emitted when all data has been flushed (after end() is called)
writeStream.on('finish', () => {
  console.log('All data written to file');
});

// 'error' — Emitted on error
writeStream.on('error', (err) => {
  console.error('Write error:', err.message);
});

// 'drain' — Emitted when it's safe to write again after backpressure
writeStream.on('drain', () => {
  console.log('Ready for more data');
});
```

### Backpressure

`write()` returns `false` when the internal buffer is full. You should wait for the `'drain'` event before writing more:

```javascript
function writeData(stream, data) {
  const canContinue = stream.write(data);
  if (!canContinue) {
    // Buffer is full — wait for drain
    stream.once('drain', () => {
      console.log('Buffer drained, can write more');
    });
  }
}
```

---

## 5. Pipe — Connecting Streams

The `pipe()` method connects a **readable stream** to a **writable stream**, automatically handling data flow and backpressure:

```javascript
import fs from 'fs';

const readStream = fs.createReadStream('source.txt', 'utf8');
const writeStream = fs.createWriteStream('destination.txt', 'utf8');

// Pipe: read from source → write to destination
readStream.pipe(writeStream);

writeStream.on('finish', () => {
  console.log('File copied successfully');
});
```

### How Pipe Works

1. Reads a chunk from the readable stream
2. Writes it to the writable stream
3. Handles backpressure automatically (pauses reading when writing is slow)
4. Calls `end()` on the writable stream when reading is done

### Pipe Chaining

You can chain multiple pipes for a processing pipeline:

```javascript
import { createGzip } from 'zlib';

const readStream = fs.createReadStream('input.txt');
const gzip = createGzip();
const writeStream = fs.createWriteStream('input.txt.gz');

// Read → Compress → Write
readStream.pipe(gzip).pipe(writeStream);

writeStream.on('finish', () => {
  console.log('File compressed successfully');
});
```

### Error Handling with Pipe

`pipe()` does **not** forward errors. You must handle errors on each stream:

```javascript
readStream.on('error', (err) => console.error('Read error:', err.message));
writeStream.on('error', (err) => console.error('Write error:', err.message));
```

### `pipeline()` — Better Than `pipe()`

The `stream.pipeline()` function handles errors and cleanup automatically:

```javascript
import { pipeline } from 'stream/promises';
import { createGzip } from 'zlib';

await pipeline(
  fs.createReadStream('input.txt'),
  createGzip(),
  fs.createWriteStream('input.txt.gz'),
);
console.log('Pipeline complete');
```

If any stream errors, `pipeline()` will properly clean up all streams and throw the error.

---

## 6. Duplex Streams

A duplex stream is **both readable and writable**. The read and write sides are independent — data written to the stream does not automatically appear on the read side.

```javascript
import { Duplex } from 'stream';

const duplexStream = new Duplex({
  read(size) {
    // Push data to be read
    this.push('Readable data from the duplex stream');
    this.push(null);  // Signal end of readable data
  },

  write(chunk, encoding, callback) {
    // Handle written data
    console.log('Received:', chunk.toString());
    callback();  // Signal that write is complete
  },
});

// Write to it
duplexStream.write('Hello from the write side');
duplexStream.end();

// Read from it
duplexStream.on('data', (chunk) => {
  console.log('Read:', chunk.toString());
});
```

**Real-world duplex streams:** TCP sockets, WebSockets — you can both send and receive data.

---

## 7. Transform Streams

A transform stream is a special duplex stream where the **output is computed from the input**. Data goes in, gets modified, and comes out the other side.

```javascript
import { Transform } from 'stream';

// Create a transform stream that converts text to uppercase
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    const upperCased = chunk.toString().toUpperCase();
    callback(null, upperCased);  // (error, transformedData)
  },
});

// Use in a pipeline: Read → Transform → Write
const readStream = fs.createReadStream('input.txt', 'utf8');
const writeStream = fs.createWriteStream('output.txt', 'utf8');

readStream.pipe(upperCaseTransform).pipe(writeStream);

writeStream.on('finish', () => {
  console.log('File transformed (uppercased) and written');
});
```

### Practical Transform Examples

```javascript
// CSV line parser
const csvParser = new Transform({
  transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\n');
    const parsed = lines.map(line => line.split(','));
    callback(null, JSON.stringify(parsed));
  },
});

// JSON stringifier
const jsonStringify = new Transform({
  transform(chunk, encoding, callback) {
    try {
      const obj = JSON.parse(chunk.toString());
      callback(null, JSON.stringify(obj, null, 2));
    } catch (err) {
      callback(err);
    }
  },
});
```

---

## 8. Stream Events Reference

### Readable Stream Events

| Event | When |
|-------|------|
| `'data'` | A chunk of data is available |
| `'end'` | No more data to read |
| `'error'` | An error occurred |
| `'close'` | Stream and underlying resource are closed |
| `'readable'` | Data is available to be read (pull mode) |

### Writable Stream Events

| Event | When |
|-------|------|
| `'finish'` | All data has been flushed after `end()` is called |
| `'error'` | An error occurred |
| `'close'` | Stream and underlying resource are closed |
| `'drain'` | Buffer is empty — safe to write more data |
| `'pipe'` | A readable stream pipes into this writable |

---

## 9. Summary

| Stream Type | Purpose | Create With |
|-------------|---------|-------------|
| Readable | Read data in chunks | `fs.createReadStream()` |
| Writable | Write data in chunks | `fs.createWriteStream()` |
| Duplex | Read and write independently | `new Duplex({ read, write })` |
| Transform | Modify data passing through | `new Transform({ transform })` |
| Pipe | Connect readable → writable | `readable.pipe(writable)` |
| Pipeline | Pipe with error handling | `pipeline(r, t, w)` |

### Key Points

1. Streams process data **in chunks** — memory-efficient for large files
2. Streams are **EventEmitters** — use `on('data')`, `on('end')`, `on('error')`
3. Use `pipe()` to connect streams — it handles backpressure automatically
4. Use `pipeline()` from `stream/promises` for proper error handling and cleanup
5. **Always handle the `'error'` event** on every stream — unhandled errors crash the process
6. `write()` returns `false` when the buffer is full — listen for `'drain'` before writing more
7. **Transform streams** are the most powerful — use them to build data processing pipelines
8. Prefer streams over `readFile`/`writeFile` for files larger than a few MB
