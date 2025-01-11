
# Node.js Built-in Module: `os`

The `os` module in Node.js provides operating system-related utility methods and properties. It allows interaction with the operating system to get information like platform, architecture, memory usage, and more.

### Common Methods:

- `os.platform()`: Returns the operating system platform.
- `os.arch()`: Returns the CPU architecture.
- `os.totalmem()`: Returns the total system memory in bytes.
- `os.freemem()`: Returns the free system memory in bytes.

### Example:
```javascript
const os = require('os');

console.log('Platform:', os.platform()); // Example: 'win32'
console.log('CPU Architecture:', os.arch()); // Example: 'x64'
console.log('Total Memory:', os.totalmem()); // Example: 17179869184
console.log('Free Memory:', os.freemem()); // Example: 8573640704
```
