
# Node.js Built-in Module: `path`

The `path` module provides utilities for working with file and directory paths. It helps in creating, resolving, and normalizing paths across different operating systems.

### Common Methods:

- `path.join()`: Joins multiple path segments into one path.
- `path.basename()`: Returns the last portion of a path.
- `path.extname()`: Returns the file extension of a path.
- `path.resolve()`: Resolves a sequence of paths into an absolute path.

### Example:
```javascript
const path = require('path');

const filePath = path.join(__dirname, 'example', 'file.txt'); 
console.log('Joined Path:', filePath);// directory/example/file.txt

console.log('Base Name:', path.basename(filePath)); // Output: 'file.txt'
console.log('Extension:', path.extname(filePath)); // Output: '.txt'
console.log('Absolute Path:', path.resolve('example', 'file.txt')); // directory/example/file.txt gets absolute path of current directory and creates a combined absolute path 
```
