# Node.js — Module System

Modules are **encapsulated blocks of code** that can be imported and exported between files. Every file in Node.js is treated as a separate module. The module system is what allows you to organize code into manageable, reusable pieces instead of putting everything in one file.

---

## 1. Why Modules?

| Problem Without Modules | Solution With Modules |
|--------------------------|----------------------|
| All code in one file | Split into focused files |
| Global variable conflicts | Each module has its own scope |
| Code duplication | Import shared utilities |
| Hard to maintain | Clear separation of concerns |
| Difficult to test | Test modules independently |

---

## 2. Module Types in Node.js

| Type | Description | Example |
|------|-------------|---------|
| **Built-in modules** | Included with Node.js — no installation needed | `fs`, `path`, `http`, `os` |
| **User-defined modules** | Files you create in your project | `./utils.js`, `./models/User.js` |
| **Third-party modules** | Installed from npm registry | `express`, `lodash`, `axios` |

---

## 3. CommonJS Modules (CJS)

CommonJS is the **original** module system in Node.js. It uses `require()` to import and `module.exports` to export.

### Exporting

```javascript
// math.js

// Named exports using module.exports object
module.exports.add = (a, b) => a + b;
module.exports.subtract = (a, b) => a - b;

// OR — export everything at once
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
};

// OR — using the shorthand `exports`
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;
// WARNING: Do NOT reassign `exports` directly:
// exports = { add };  ← This breaks the reference! Use module.exports instead.
```

### Importing

```javascript
// app.js

// Import the entire module
const math = require('./math');
console.log(math.add(2, 3));        // 5
console.log(math.subtract(10, 5));  // 5

// Destructured import
const { add, subtract } = require('./math');
console.log(add(2, 3));             // 5
```

### Default Export

```javascript
// logger.js
class Logger {
  log(msg) { console.log(`[LOG] ${msg}`); }
}

module.exports = Logger;  // Export the class itself

// app.js
const Logger = require('./logger');
const logger = new Logger();
logger.log('Hello');   // [LOG] Hello
```

### How `require()` Works

1. **Resolves** the file path (relative `./`, built-in, or `node_modules`)
2. **Loads** and wraps the file in a function (creating a private scope)
3. **Executes** the code
4. **Caches** the result — subsequent `require()` calls return the cached export

```javascript
// Node.js wraps every module in this function:
(function(exports, require, module, __filename, __dirname) {
  // Your module code lives here
});
```

This is why each file has its own scope and why `__dirname`, `__filename`, `module`, `exports`, and `require` are available in every file.

---

## 4. ES Modules (ESM)

ES Modules are the **modern JavaScript standard** for modules. They use `import` and `export` syntax and are the preferred choice for new projects.

### Enabling ES Modules

**Option 1:** Add `"type": "module"` in `package.json`:
```json
{
  "type": "module"
}
```

**Option 2:** Use the `.mjs` file extension:
```
utils.mjs
```

### Named Exports

```javascript
// utils.js
export const PI = 3.14159;
export const E = 2.718;

export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// Or export at the end of the file
const square = (x) => x * x;
export { square };
```

### Named Imports

```javascript
// app.js
import { PI, E, add, subtract, square } from './utils.js';

console.log(PI);             // 3.14159
console.log(add(10, 5));     // 15
console.log(square(4));      // 16
```

### Default Export

Each module can have **one** default export. The importer can name it anything:

```javascript
// utils.js
const processNumbers = (numbers) => numbers.map(num => num * 2);
export default processNumbers;

// app.js
import doubleAll from './utils.js';   // Can use ANY name for default imports
const result = doubleAll([1, 2, 3]);
console.log(result);                  // [2, 4, 6]
```

### Combining Default + Named Exports

```javascript
// utils.js
export const PI = 3.14159;
export const add = (a, b) => a + b;

export default (numbers) => numbers.map(num => num * 2);

// app.js — import default and named together
import processNumbers, { PI, add } from './utils.js';

console.log(processNumbers([1, 2, 3]));  // [2, 4, 6]
console.log(PI);                          // 3.14159
console.log(add(2, 3));                   // 5
```

### Namespace Import (`import *`)

Import all named exports as a single object:

```javascript
// app.js
import * as utils from './utils.js';

console.log(utils.PI);          // 3.14159
console.log(utils.add(10, 5));  // 15
console.log(utils.default);     // The default export function (if any)
```

### Renaming Imports

```javascript
import { add as sum, subtract as minus } from './utils.js';

console.log(sum(2, 3));    // 5
console.log(minus(10, 5)); // 5
```

### Re-exporting (Barrel Pattern)

Combine exports from multiple modules into one entry point:

```javascript
// models/User.js
export class User { /* ... */ }

// models/Post.js
export class Post { /* ... */ }

// models/index.js — barrel file
export { User } from './User.js';
export { Post } from './Post.js';

// app.js — import from the barrel
import { User, Post } from './models/index.js';
```

---

## 5. CommonJS vs ES Modules — Comparison

| Feature | CommonJS (`require`) | ES Modules (`import`) |
|---------|----------------------|-----------------------|
| Syntax | `require()` / `module.exports` | `import` / `export` |
| Loading | **Synchronous** (blocks execution) | **Asynchronous** (non-blocking) |
| Evaluation | **Dynamic** — `require()` can be inside conditions | **Static** — imports must be top-level |
| Caching | Yes (cached after first load) | Yes (cached after first load) |
| Default in Node | Yes (original system) | Requires `"type": "module"` or `.mjs` |
| Tree shaking | Not supported | Supported (bundlers can remove unused exports) |
| `__dirname` / `__filename` | Available automatically | Must construct from `import.meta.url` |
| Top-level `await` | Not supported | Supported |
| Browser support | No (requires bundler) | Yes (native) |

### When to Use Which

- **New projects**: Use ES Modules — it's the JavaScript standard
- **Existing projects**: Many Node.js projects still use CommonJS
- **Libraries**: Often ship both formats for compatibility

### Dynamic Imports (Both Systems)

```javascript
// ES Modules — dynamic import
const module = await import('./utils.js');
console.log(module.add(2, 3));

// CommonJS — require is already dynamic
if (condition) {
  const utils = require('./utils');
}
```

---

## 6. Module Resolution

When you `require()` or `import` a module, Node.js resolves it in this order:

### 1. Built-in Modules (highest priority)

```javascript
import fs from 'fs';        // Built-in — no path needed
import http from 'http';
```

### 2. Relative Paths (your files)

```javascript
import utils from './utils.js';       // Same directory
import User from '../models/User.js'; // Parent directory
```

Node tries these extensions in order: `.js`, `.json`, `.node`

### 3. `node_modules` (third-party packages)

```javascript
import express from 'express';   // Looks in node_modules/express
```

Node.js searches up the directory tree:
```
./node_modules/express
../node_modules/express
../../node_modules/express
... (up to the root)
```

---

## 7. Third-Party Modules

Third-party modules are packages created by the community, hosted on the **npm registry**, and installed via `npm install`.

### Installing

```bash
npm install express        # Local dependency
npm install -g nodemon     # Global CLI tool
npm install -D jest        # Dev dependency
```

### Popular Third-Party Modules

| Module | Purpose | Category |
|--------|---------|----------|
| `express` | Web framework | Server |
| `axios` | HTTP client | Networking |
| `mongoose` | MongoDB ODM | Database |
| `sequelize` | SQL ORM | Database |
| `dotenv` | Environment variables | Configuration |
| `jsonwebtoken` | JWT authentication | Security |
| `bcrypt` | Password hashing | Security |
| `cors` | Cross-Origin Resource Sharing | Middleware |
| `joi` / `zod` | Validation | Input validation |
| `nodemon` | Auto-restart on changes | Development |
| `jest` / `mocha` | Testing frameworks | Testing |
| `winston` | Logging | Observability |
| `chalk` | Terminal styling | CLI |
| `lodash` | Utility functions | Utilities |
| `socket.io` | Real-time communication | WebSockets |

### Using a Third-Party Module

```javascript
// Install
// npm install lodash

// CommonJS
const _ = require('lodash');
console.log(_.capitalize('hello'));  // Hello

// ES Modules
import _ from 'lodash';
console.log(_.shuffle([1, 2, 3, 4, 5]));
```

### Choosing a Third-Party Module

Before adding a dependency, check:
- **Weekly downloads** — popularity indicator
- **GitHub stars** — community interest
- **Last published** — is it maintained?
- **Open issues** — unresolved problems
- **Bundle size** — impact on your application
- **Documentation** — is it well-documented?

---

## 8. Summary

| Concept | Detail |
|---------|--------|
| What is a module | An encapsulated file with its own scope |
| CommonJS | `require()` / `module.exports` — synchronous, original Node system |
| ES Modules | `import` / `export` — async, modern standard |
| Named export | `export const fn = ...` / `module.exports.fn = ...` |
| Default export | `export default fn` / `module.exports = fn` |
| Module resolution | Built-in → relative path → `node_modules` |
| Third-party | Installed from npm, imported by package name |

### Key Points

1. Every file in Node.js is a **separate module** with its own scope
2. Use **ES Modules** (`import`/`export`) for new projects — add `"type": "module"` to `package.json`
3. Default exports can be imported with **any name**; named exports must use the **exact name** (or rename with `as`)
4. `require()` is **synchronous** and can be conditional; `import` is **static** and must be at the top level (except dynamic `import()`)
5. Node.js wraps every CommonJS module in a function, which is why `__dirname`, `__filename`, and `require` are available
6. Always check a third-party module's **maintenance status** and **documentation** before using it
