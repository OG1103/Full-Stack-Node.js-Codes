
# Node.js Built-in Module: `fs`

The `fs` module provides an API to interact with the file system. It allows reading, writing, deleting, and managing files and directories.

### Common Methods:

- `fs.readFile()`: Asynchronously reads the contents of a file.
- `fs.writeFile()`: Asynchronously writes data to a file.
- `fs.appendFile()`: Asynchronously appends data to a file.
- `fs.unlink()`: Asynchronously deletes a file.

### Example: Reading a file
```javascript
const fs = require('fs');

fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File Content:', data);
});
```

### Example: Writing to a file
```javascript
fs.writeFile('output.txt', 'Hello, Node.js!', (err) => {
  if (err) {
    console.error('Error writing file:', err);
    return;
  }
  console.log('File written successfully');
});
```
