# Node.js — Overview & Core Concepts

Node.js is a **JavaScript runtime environment** that lets you run JavaScript code outside the browser. It is built on Google Chrome's **V8 JavaScript engine** and is designed for building fast, scalable server-side and networking applications.

---

## 1. What Is Node.js?

- **Runtime environment** for executing JavaScript on the server (not a language, not a framework)
- Built on Chrome's **V8 engine** (compiles JS directly to machine code)
- **Single-threaded** with an **event-driven, non-blocking I/O** model
- Ideal for **I/O-heavy** applications (APIs, real-time apps, microservices)
- Enables **full-stack JavaScript** — same language on both client and server

### What Node.js Is NOT

| Misconception | Reality |
|---------------|---------|
| A programming language | It's a runtime that executes JavaScript |
| A framework | It's a platform; Express is a framework built on Node |
| Multi-threaded | Single-threaded event loop (uses thread pool internally for some tasks) |
| Only for web servers | Can build CLI tools, desktop apps, IoT, scripts, and more |

---

## 2. Browser vs Node.js

JavaScript behaves differently depending on where it runs:

| Feature | Browser | Node.js |
|---------|---------|---------|
| **Runtime** | Browser engine (V8, SpiderMonkey) | V8 engine via Node |
| **Global object** | `window` | `global` (or `globalThis`) |
| **DOM access** | Yes (`document`, `window`) | No DOM, no `window` |
| **File system** | No direct access | Full access via `fs` module |
| **Networking** | `fetch`, `XMLHttpRequest` | `http`, `net`, `dgram` modules |
| **Module system** | ES Modules (native) | CommonJS + ES Modules |
| **Compatibility** | Varies by browser (fragmentation) | Consistent — based on Node version |
| **Use case** | Interactive UI, client-side apps | Server-side apps, APIs, scripts |
| **Security** | Sandboxed (restricted) | Full OS access (unrestricted) |

### Key Takeaway

- In the **browser**, JS is sandboxed — it can manipulate the DOM but cannot access the file system or OS
- In **Node.js**, JS has full system access — it can read/write files, start servers, and interact with the OS, but has no concept of DOM or browser APIs

---

## 3. Global Objects in Node.js

In the browser, the global object is `window`. In Node.js, there is **no `window`** — the global object is `global` (or the universal `globalThis`).

### Commonly Used Globals

| Global | Description | Example |
|--------|-------------|---------|
| `__dirname` | Absolute path to the directory of the current file | `/Users/john/project/src` |
| `__filename` | Absolute path to the current file | `/Users/john/project/src/app.js` |
| `process` | Info about the current Node.js process (env, args, exit) | `process.env.PORT` |
| `module` | Info about the current module (exports, filename) | `module.exports = {}` |
| `require()` | Function to import CommonJS modules | `const fs = require('fs')` |
| `console` | Logging to stdout/stderr | `console.log()`, `console.error()` |
| `setTimeout` | Schedule a callback after a delay | `setTimeout(fn, 1000)` |
| `setInterval` | Repeat a callback at intervals | `setInterval(fn, 5000)` |
| `setImmediate` | Schedule callback for next iteration of event loop | `setImmediate(fn)` |
| `Buffer` | Handle binary data | `Buffer.from('hello')` |
| `URL` | Parse and construct URLs | `new URL('https://example.com')` |
| `performance` | High-resolution timing API | `performance.now()` |

### `__dirname` and `__filename`

```javascript
// CommonJS — available by default
console.log(__dirname);    // /Users/john/project/src
console.log(__filename);   // /Users/john/project/src/app.js

// ES Modules — not available by default, must construct manually
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

### `process` Object

The `process` object provides information and control over the current Node.js process:

```javascript
// Environment variables
console.log(process.env.NODE_ENV);    // 'development' or 'production'
console.log(process.env.PORT);        // e.g., '3000'

// Command-line arguments
// node app.js --port 5000
console.log(process.argv);
// ['node', '/path/to/app.js', '--port', '5000']

// Current working directory
console.log(process.cwd());           // /Users/john/project

// Platform and architecture
console.log(process.platform);        // 'win32', 'darwin', 'linux'
console.log(process.arch);            // 'x64', 'arm64'

// Node.js version
console.log(process.version);         // 'v20.10.0'

// Memory usage
console.log(process.memoryUsage());
// { rss: 30000000, heapTotal: 6000000, heapUsed: 4000000, external: 800000 }

// Exit the process
process.exit(0);   // 0 = success
process.exit(1);   // 1 = error (non-zero = failure)
```

### `process.env`

`process.env` is an object containing all environment variables. It is how you access configuration values set outside your code:

```javascript
// Access variables from the operating system or .env files
const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
const nodeEnv = process.env.NODE_ENV;   // 'development', 'production', 'test'
```

---

## 4. How Node.js Works Internally

### The V8 Engine

1. **Parses** JavaScript source code
2. **Compiles** it to optimized machine code (JIT compilation)
3. **Executes** the machine code

Node.js wraps V8 and adds APIs that V8 doesn't provide (file system, networking, etc.) through **C++ bindings** and **libuv**.

### libuv — The Async Engine

**libuv** is a C library that provides Node.js with:
- The **event loop** (handles async callbacks)
- A **thread pool** (for CPU-intensive tasks like file I/O and DNS lookups)
- Cross-platform support for async I/O

### Architecture Overview

```
Your JavaScript Code
       ↓
    Node.js APIs (fs, http, path, etc.)
       ↓
    C++ Bindings
       ↓
  ┌─────────────────────┐
  │       libuv          │
  │  ┌───────────────┐   │
  │  │  Event Loop    │   │
  │  │  Thread Pool   │   │
  │  └───────────────┘   │
  └─────────────────────┘
       ↓
  Operating System (I/O, Network, File System)
```

---

## 5. Node.js Use Cases

### Best For (I/O-Bound)

| Use Case | Example |
|----------|---------|
| REST APIs | Express, Fastify |
| Real-time apps | Chat apps, live dashboards (Socket.IO) |
| Microservices | Lightweight, fast-starting services |
| Streaming | Video/audio streaming, file processing |
| Server-side rendering | Next.js, Nuxt.js |
| CLI tools | npm, Webpack, ESLint |
| Scripting | Build scripts, automation, data processing |

### Not Ideal For (CPU-Bound)

| Task | Why | Alternative |
|------|-----|-------------|
| Heavy computation | Blocks the single thread | Use Worker Threads or a different language |
| Image/video processing | CPU-intensive | Offload to a separate service |
| Machine learning | Computationally expensive | Python, Go |

---

## 6. Installing and Running Node.js

### Installation

Download from [nodejs.org](https://nodejs.org/):
- **LTS (Long-Term Support)** — recommended for production
- **Current** — latest features, may be less stable

### Verify Installation

```bash
node --version        # v20.10.0
npm --version         # 10.2.3
```

### Running JavaScript Files

```bash
# Run a file
node app.js

# Run with environment variables
PORT=5000 node app.js

# Node REPL (interactive shell)
node
> 2 + 2
4
> .exit
```

### Useful Node CLI Flags

| Flag | Description |
|------|-------------|
| `node app.js` | Run a script |
| `node --watch app.js` | Watch mode — restart on file changes (Node 18+) |
| `node -e "console.log('hi')"` | Evaluate inline code |
| `node --inspect app.js` | Enable debugger (Chrome DevTools) |
| `node --env-file=.env app.js` | Load .env file natively (Node 20.6+) |

---

## 7. Summary

| Concept | Detail |
|---------|--------|
| What is Node.js | JavaScript runtime built on V8 engine |
| Architecture | Single-threaded, event-driven, non-blocking I/O |
| Global object | `global` (not `window`) |
| Key globals | `__dirname`, `__filename`, `process`, `module`, `require` |
| Engine | V8 (compiles JS to machine code) |
| Async engine | libuv (event loop + thread pool) |
| Best for | I/O-bound tasks (APIs, real-time, streaming) |
| Not ideal for | CPU-bound tasks (heavy computation) |

### Key Points

1. Node.js is a **runtime**, not a language or framework
2. There is **no DOM** and **no `window`** in Node.js
3. Node.js uses a **single thread** with an **event loop** for concurrency
4. `process.env` is how you access environment variables
5. `__dirname` and `__filename` give you the current file's location (CommonJS only; in ES Modules, construct them from `import.meta.url`)
6. Always use the **LTS version** in production
