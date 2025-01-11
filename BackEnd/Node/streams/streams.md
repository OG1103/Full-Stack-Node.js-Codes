# Streams in Node.js

Streams are used in Node.js to handle reading and writing data in chunks (sequentially), which makes them useful for processing large files, network communications, or any situation where you don’t want to load the entire data set into memory at once.

Streams are instances of EventEmitter, meaning they can emit events like 'data', 'end', 'finish', 'error', and 'close'. This makes them highly efficient for handling I/O operations by leveraging Node.js's non-blocking, asynchronous architecture.

## Types of Streams

### 1. **Readable Streams**

Readable streams are used to read data from a source in chunks.

Example: `fs.createReadStream()` reads a file in chunks and allows you to handle the data piece by piece.

### 2. **Writable Streams**

Writable streams are used to write data to a destination in chunks.

Example: `fs.createWriteStream()` allows you to write data to a file incrementally.

### 3. **Duplex Streams**

A duplex stream is both readable and writable, allowing data to be both read from and written to the stream.

### 4. **Transform Streams**

Transform streams are a special type of duplex stream where the data written to the stream is modified or transformed before being read.

## Common Methods

### `pipe()`

`pipe()` is a common method used with streams to pass data from a readable stream directly into a writable stream.

Example:

```js
const readStream = fs.createReadStream("source.txt");
const writeStream = fs.createWriteStream("destination.txt");
readStream.pipe(writeStream);
```

## Error Handling

Streams can encounter errors, and it’s important to handle them using the `error` event.

```js
readStream.on("error", (err) => {
  console.error("An error occurred:", err);
});
```

## Conclusion

Streams are powerful for handling large data efficiently. They allow data to be processed in chunks and help with memory management, especially when dealing with large files or network data.
