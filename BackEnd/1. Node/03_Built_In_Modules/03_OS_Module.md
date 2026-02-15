# Node.js Built-in Module — `os` (Operating System)

The `os` module provides operating system-related utility methods and properties. It gives you information about the platform, CPU, memory, network interfaces, and user environment.

---

## 1. Importing

```javascript
// CommonJS
const os = require('os');

// ES Modules
import os from 'os';
```

---

## 2. System Information

### Platform and Architecture

```javascript
console.log(os.platform());   // 'win32', 'darwin' (macOS), 'linux'
console.log(os.arch());       // 'x64', 'arm64', 'ia32'
console.log(os.type());       // 'Windows_NT', 'Darwin', 'Linux'
console.log(os.release());    // '10.0.22621' (OS version)
console.log(os.version());    // 'Windows 10 Pro' or kernel version
console.log(os.hostname());   // Computer's hostname
console.log(os.homedir());    // User's home directory: '/Users/john' or 'C:\\Users\\john'
console.log(os.tmpdir());     // Temp directory: '/tmp' or 'C:\\Users\\john\\AppData\\Local\\Temp'
```

### Memory

```javascript
console.log(os.totalmem());   // Total memory in bytes (e.g., 17179869184 = 16 GB)
console.log(os.freemem());    // Free memory in bytes

// Human-readable
const totalGB = (os.totalmem() / 1024 ** 3).toFixed(2);
const freeGB = (os.freemem() / 1024 ** 3).toFixed(2);
console.log(`Memory: ${freeGB} GB free / ${totalGB} GB total`);
```

### CPU Information

```javascript
const cpus = os.cpus();
console.log(`CPU: ${cpus[0].model}`);       // 'Intel(R) Core(TM) i7-9750H'
console.log(`Cores: ${cpus.length}`);        // 12 (logical cores)
console.log(`Speed: ${cpus[0].speed} MHz`);  // 2600
```

### System Uptime

```javascript
console.log(os.uptime());  // Seconds since last boot
const hours = (os.uptime() / 3600).toFixed(1);
console.log(`System uptime: ${hours} hours`);
```

### Network Interfaces

```javascript
const nets = os.networkInterfaces();
for (const [name, interfaces] of Object.entries(nets)) {
  for (const iface of interfaces) {
    if (iface.family === 'IPv4' && !iface.internal) {
      console.log(`${name}: ${iface.address}`);  // 'Wi-Fi: 192.168.1.100'
    }
  }
}
```

### User Information

```javascript
const user = os.userInfo();
console.log(user.username);   // 'john'
console.log(user.homedir);    // '/Users/john'
console.log(user.shell);      // '/bin/zsh' (Unix only, null on Windows)
```

### End-of-Line Character

```javascript
console.log(os.EOL);  // '\n' on Unix, '\r\n' on Windows
// Use for cross-platform file writing
const lines = ['line 1', 'line 2', 'line 3'].join(os.EOL);
```

---

## 3. All Methods Reference

| Method | Returns | Example |
|--------|---------|---------|
| `os.platform()` | OS platform | `'win32'`, `'darwin'`, `'linux'` |
| `os.arch()` | CPU architecture | `'x64'`, `'arm64'` |
| `os.type()` | OS name | `'Windows_NT'`, `'Darwin'` |
| `os.release()` | OS version string | `'10.0.22621'` |
| `os.hostname()` | Machine hostname | `'my-laptop'` |
| `os.homedir()` | User home directory | `'/Users/john'` |
| `os.tmpdir()` | Temp directory | `'/tmp'` |
| `os.totalmem()` | Total RAM (bytes) | `17179869184` |
| `os.freemem()` | Free RAM (bytes) | `8573640704` |
| `os.cpus()` | Array of CPU core info | `[{ model, speed, times }]` |
| `os.uptime()` | System uptime (seconds) | `86400` |
| `os.networkInterfaces()` | Network interface details | `{ eth0: [...], Wi-Fi: [...] }` |
| `os.userInfo()` | Current user info | `{ username, homedir, shell }` |
| `os.EOL` | End-of-line character | `'\n'` or `'\r\n'` |

### Key Points

1. The `os` module requires **no installation** — it's built into Node.js
2. Use `os.platform()` to write **cross-platform** code (different behavior for Windows vs Unix)
3. Memory methods return values in **bytes** — divide by `1024^3` for gigabytes
4. `os.cpus().length` gives the number of **logical CPU cores** — useful for Worker Threads or cluster sizing
5. Use `os.EOL` instead of hardcoding `'\n'` for cross-platform compatibility
