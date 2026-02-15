# Node.js Built-in Module — `fs` (File System)

The `fs` module provides an API for interacting with the **file system**. It allows you to read, write, update, delete, and manage files and directories. It is one of the most commonly used built-in modules in Node.js.

---

## 1. Importing the `fs` Module

```javascript
// CommonJS
const fs = require('fs');

// ES Modules
import fs from 'fs';

// Promise-based API (recommended for async/await)
import fs from 'fs/promises';
// or
const fs = require('fs').promises;
```

### Three API Styles

| Style | Description | Error Handling |
|-------|-------------|----------------|
| **Callback** (`fs.readFile`) | Async — passes result to a callback | Error-first callback `(err, data)` |
| **Synchronous** (`fs.readFileSync`) | Blocks the event loop until done | `try/catch` |
| **Promise** (`fs.promises.readFile`) | Async — returns a Promise | `try/catch` with `await` or `.catch()` |

**Recommendation:** Use the **Promise-based API** (`fs/promises`) with `async/await` for clean, modern code. Use **synchronous** methods only for startup scripts or CLI tools.

---

## 2. Reading Files

### Async (Callback)

```javascript
const fs = require('fs');

fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err.message);
    return;
  }
  console.log('File content:', data);
});
```

- First argument: file path
- Second argument: encoding (`'utf8'` returns a string; omit it to get a raw `Buffer`)
- Third argument: error-first callback `(err, data)`

### Synchronous

```javascript
const fs = require('fs');

try {
  const data = fs.readFileSync('example.txt', 'utf8');
  console.log('File content:', data);
} catch (err) {
  console.error('Error reading file:', err.message);
}
```

**Warning:** Synchronous methods block the event loop. Do not use them in server request handlers.

### Promise-based (Recommended)

```javascript
import fs from 'fs/promises';

async function readExample() {
  try {
    const data = await fs.readFile('example.txt', 'utf8');
    console.log('File content:', data);
  } catch (err) {
    console.error('Error reading file:', err.message);
  }
}

readExample();
```

---

## 3. Writing Files

`writeFile` creates a new file or **overwrites** an existing file entirely.

### Async (Callback)

```javascript
fs.writeFile('output.txt', 'Hello, World!', 'utf8', (err) => {
  if (err) {
    console.error('Error writing file:', err.message);
    return;
  }
  console.log('File written successfully!');
});
```

### Synchronous

```javascript
try {
  fs.writeFileSync('output.txt', 'Hello, World!', 'utf8');
  console.log('File written successfully!');
} catch (err) {
  console.error('Error writing file:', err.message);
}
```

### Promise-based

```javascript
import fs from 'fs/promises';

await fs.writeFile('output.txt', 'Hello, World!', 'utf8');
console.log('File written successfully!');
```

### Write Options

```javascript
fs.writeFile('output.txt', 'Hello', {
  encoding: 'utf8',   // Character encoding
  flag: 'w',          // 'w' = write (default), 'a' = append, 'wx' = write but fail if exists
  mode: 0o666,        // File permissions (Unix)
}, callback);
```

---

## 4. Appending to Files

`appendFile` adds content to the **end** of a file without overwriting existing content. Creates the file if it doesn't exist.

### Async (Callback)

```javascript
fs.appendFile('output.txt', '\nAppended text!', 'utf8', (err) => {
  if (err) {
    console.error('Error appending:', err.message);
    return;
  }
  console.log('Content appended successfully!');
});
```

### Synchronous

```javascript
try {
  fs.appendFileSync('output.txt', '\nAppended text!', 'utf8');
  console.log('Content appended successfully!');
} catch (err) {
  console.error('Error appending:', err.message);
}
```

### Promise-based

```javascript
await fs.appendFile('output.txt', '\nAppended text!', 'utf8');
```

---

## 5. Deleting Files

`unlink` removes a file from the file system.

### Async (Callback)

```javascript
fs.unlink('output.txt', (err) => {
  if (err) {
    console.error('Error deleting file:', err.message);
    return;
  }
  console.log('File deleted successfully!');
});
```

### Synchronous

```javascript
try {
  fs.unlinkSync('output.txt');
  console.log('File deleted successfully!');
} catch (err) {
  console.error('Error deleting file:', err.message);
}
```

### Promise-based

```javascript
await fs.unlink('output.txt');
```

---

## 6. Renaming / Moving Files

`rename` changes a file's name or moves it to a different directory.

### Async (Callback)

```javascript
fs.rename('old-name.txt', 'new-name.txt', (err) => {
  if (err) {
    console.error('Error renaming file:', err.message);
    return;
  }
  console.log('File renamed successfully!');
});
```

### Moving a File

```javascript
// Moving is just renaming to a different path
fs.rename('old-name.txt', './archive/old-name.txt', (err) => {
  if (err) throw err;
  console.log('File moved to archive!');
});
```

### Promise-based

```javascript
await fs.rename('old-name.txt', 'new-name.txt');
```

---

## 7. Checking if a File Exists

```javascript
import fs from 'fs';

// Synchronous
if (fs.existsSync('config.json')) {
  console.log('File exists');
}

// Promise-based — use access()
import fsPromises from 'fs/promises';

try {
  await fsPromises.access('config.json');
  console.log('File exists');
} catch {
  console.log('File does not exist');
}
```

---

## 8. Getting File Information

`stat` returns metadata about a file (size, timestamps, type).

```javascript
import fs from 'fs/promises';

const stats = await fs.stat('example.txt');

console.log(stats.isFile());        // true
console.log(stats.isDirectory());   // false
console.log(stats.size);            // Size in bytes
console.log(stats.birthtime);       // Creation time
console.log(stats.mtime);           // Last modified time
```

---

## 9. Directory Operations

### Create a Directory

```javascript
// Single directory
await fs.mkdir('new-folder');

// Nested directories (recursive)
await fs.mkdir('path/to/nested/folder', { recursive: true });
```

### Read Directory Contents

```javascript
const files = await fs.readdir('./src');
console.log(files);   // ['app.js', 'utils.js', 'models']

// With file types
const entries = await fs.readdir('./src', { withFileTypes: true });
entries.forEach(entry => {
  console.log(`${entry.name} — ${entry.isDirectory() ? 'directory' : 'file'}`);
});
```

### Remove a Directory

```javascript
// Empty directory
await fs.rmdir('empty-folder');

// Directory with contents (recursive)
await fs.rm('folder-with-files', { recursive: true, force: true });
```

### Copy a File

```javascript
await fs.copyFile('source.txt', 'destination.txt');
```

---

## 10. Watching for File Changes

```javascript
// Watch a file for changes
fs.watch('config.json', (eventType, filename) => {
  console.log(`${filename} was ${eventType}`);  // 'change' or 'rename'
});

// Watch a directory
fs.watch('./src', { recursive: true }, (eventType, filename) => {
  console.log(`${filename} — ${eventType}`);
});
```

---

## 11. All Common Methods Reference

| Method | Description | Sync Version |
|--------|-------------|-------------|
| `readFile(path, encoding, cb)` | Read entire file | `readFileSync` |
| `writeFile(path, data, cb)` | Write file (overwrites) | `writeFileSync` |
| `appendFile(path, data, cb)` | Append to file | `appendFileSync` |
| `unlink(path, cb)` | Delete a file | `unlinkSync` |
| `rename(oldPath, newPath, cb)` | Rename/move file | `renameSync` |
| `copyFile(src, dest, cb)` | Copy a file | `copyFileSync` |
| `stat(path, cb)` | Get file metadata | `statSync` |
| `access(path, cb)` | Check file accessibility | `accessSync` |
| `mkdir(path, opts, cb)` | Create directory | `mkdirSync` |
| `readdir(path, cb)` | List directory contents | `readdirSync` |
| `rmdir(path, cb)` | Remove empty directory | `rmdirSync` |
| `rm(path, opts, cb)` | Remove file or directory | `rmSync` |
| `watch(path, cb)` | Watch for changes | — |
| `createReadStream(path)` | Readable stream (for large files) | — |
| `createWriteStream(path)` | Writable stream (for large files) | — |

---

## 12. Summary

| Operation | Method | Behavior |
|-----------|--------|----------|
| Read | `readFile` | Returns file contents |
| Write | `writeFile` | Creates or overwrites file |
| Append | `appendFile` | Adds to end of file |
| Delete | `unlink` | Removes a file |
| Rename/Move | `rename` | Changes name or location |
| Copy | `copyFile` | Duplicates a file |
| Check exists | `existsSync` / `access` | Checks if file is accessible |
| File info | `stat` | Returns size, dates, type |
| List directory | `readdir` | Returns array of filenames |
| Create directory | `mkdir` | Creates a folder |
| Remove directory | `rm` / `rmdir` | Removes a folder |

### Key Points

1. **Always use the Promise API** (`fs/promises`) with `async/await` in production code
2. **Never use synchronous methods** in server request handlers — they block the event loop
3. Always pass **encoding** (`'utf8'`) when reading text files, otherwise you get a raw `Buffer`
4. `writeFile` **overwrites** the entire file — use `appendFile` to add to the end
5. Use `{ recursive: true }` with `mkdir` to create nested directories
6. For **large files**, use Streams (`createReadStream` / `createWriteStream`) instead of `readFile` / `writeFile`
