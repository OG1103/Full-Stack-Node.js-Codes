# JavaScript Modules — Complete Guide

> Modules allow you to split your code into separate files, each with its own scope. They provide **encapsulation**, **reusability**, and **dependency management**. ES Modules (ESM) are the official standard; CommonJS (CJS) is the legacy Node.js system.

---

## Table of Contents

1. [Why Modules?](#1-why-modules)
2. [Named Exports](#2-named-exports)
3. [Default Exports](#3-default-exports)
4. [Mixed Exports (Named + Default)](#4-mixed-exports-named--default)
5. [Importing](#5-importing)
   - [Named Imports](#51-named-imports)
   - [Default Imports](#52-default-imports)
   - [Namespace Imports](#53-namespace-imports-import--as)
   - [Renaming Imports](#54-renaming-imports)
   - [Side-Effect Imports](#55-side-effect-imports)
6. [Re-exporting](#6-re-exporting)
7. [Dynamic Imports](#7-dynamic-imports-import)
8. [CommonJS vs ES Modules](#8-commonjs-vs-es-modules)
9. [Module Scope vs Global Scope](#9-module-scope-vs-global-scope)
10. [Practical Patterns and Best Practices](#10-practical-patterns-and-best-practices)

---

## 1. Why Modules?

### Problems Without Modules

Before modules, JavaScript relied on `<script>` tags that all shared a single global scope:

```html
<!-- All scripts share the global scope -->
<script src="utils.js"></script>
<script src="api.js"></script>
<script src="app.js"></script>
```

| Problem | Description |
| ------- | ----------- |
| **Name collisions** | Two files defining `function init()` would overwrite each other |
| **Implicit dependencies** | No way to declare that `app.js` depends on `utils.js` |
| **No encapsulation** | Every variable is globally accessible |
| **Load order fragility** | Scripts must be loaded in the exact right order |
| **No lazy loading** | All scripts load upfront, even if features are rarely used |

### What Modules Solve

| Benefit | How |
| ------- | --- |
| **Code organization** | Each file is a self-contained unit with a clear purpose |
| **Reusability** | Import the same module in multiple files |
| **Encapsulation** | Only explicitly exported bindings are accessible outside |
| **Dependency clarity** | `import` statements declare exactly what a file needs |
| **Tree-shaking** | Bundlers can eliminate unused exports for smaller bundles |
| **Lazy loading** | Dynamic `import()` loads code on demand |

---

## 2. Named Exports

Named exports allow you to export **multiple** values from a module. Each export has a specific name that importers must use (or explicitly rename).

### Inline Named Exports

```js
// math.js
export const PI = 3.14159265359;

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}
```

### Aggregated Named Exports (Export List)

You can declare everything normally and then export them all in a single statement at the bottom.

```js
// string-utils.js
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

const truncate = (str, len = 100) =>
  str.length > len ? str.slice(0, len) + "..." : str;

// Single export statement at the bottom
export { capitalize, slugify, truncate };
```

### Renaming During Export

```js
// helpers.js
function internalHelper() {
  return "I'm internal";
}

function doWork() {
  return "Working...";
}

export { internalHelper as helper, doWork as processTask };
// Importers will see `helper` and `processTask`, not the internal names
```

---

## 3. Default Exports

Each module can have **one** default export. It represents the module's "main" value. Importers can assign it any name they choose.

### Function as Default Export

```js
// logger.js
export default function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}
```

### Class as Default Export

```js
// user-service.js
export default class UserService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async getUser(id) {
    const response = await fetch(`${this.apiUrl}/users/${id}`);
    return response.json();
  }

  async getUsers() {
    const response = await fetch(`${this.apiUrl}/users`);
    return response.json();
  }
}
```

### Object/Value as Default Export

```js
// config.js
export default {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
};
```

### Expression as Default Export

```js
// Anonymous function
export default function (x) {
  return x * 2;
}

// Anonymous class
export default class {
  greet() {
    return "Hello!";
  }
}
```

### Exporting a Named Declaration as Default

```js
// parser.js
function parse(input) {
  // ...
}

export default parse;
// or: export { parse as default };
```

---

## 4. Mixed Exports (Named + Default)

A single module can have both a default export and multiple named exports.

```js
// http-client.js

// Default export — the primary thing this module provides
export default class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async get(path) {
    const response = await fetch(`${this.baseURL}${path}`);
    if (!response.ok) throw new HttpError(response.status, response.statusText);
    return response.json();
  }

  async post(path, body) {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new HttpError(response.status, response.statusText);
    return response.json();
  }
}

// Named exports — utilities related to HTTP
export class HttpError extends Error {
  constructor(status, statusText) {
    super(`HTTP ${status}: ${statusText}`);
    this.status = status;
    this.statusText = statusText;
  }
}

export const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export function isSuccess(status) {
  return status >= 200 && status < 300;
}
```

### Importing Mixed Exports

```js
// Import the default AND named exports in one statement
import HttpClient, { HttpError, HTTP_METHODS, isSuccess } from "./http-client.js";

const client = new HttpClient("https://api.example.com");

try {
  const users = await client.get("/users");
  console.log(isSuccess(200)); // true
} catch (error) {
  if (error instanceof HttpError) {
    console.error(`Request failed: ${error.status}`);
  }
}
```

---

## 5. Importing

### 5.1 Named Imports

Use `{ }` to import specific named exports. Names must match (or be aliased).

```js
import { add, subtract, PI } from "./math.js";

console.log(add(2, 3));     // 5
console.log(subtract(5, 2)); // 3
console.log(PI);             // 3.14159265359
```

### 5.2 Default Imports

No braces needed. You choose any name you want.

```js
import Logger from "./logger.js";
// or
import MyLogger from "./logger.js";
// or
import whatever from "./logger.js";

// All refer to the same default export
```

### 5.3 Namespace Imports (`import * as`)

Import everything from a module as a single object. This includes both named exports as properties and the default export as the `.default` property.

```js
import * as MathUtils from "./math.js";

console.log(MathUtils.PI);          // 3.14159265359
console.log(MathUtils.add(1, 2));   // 3
console.log(MathUtils.Vector);      // [class Vector]

// If there's a default export:
// console.log(MathUtils.default);
```

### 5.4 Renaming Imports

Use `as` to rename imports and avoid conflicts.

```js
import { add as mathAdd } from "./math.js";
import { add as stringAdd } from "./string-utils.js";

mathAdd(1, 2);          // 3
stringAdd("a", "b");    // "ab"
```

### Renaming the Default Import (Explicit Syntax)

```js
// These are equivalent
import Logger from "./logger.js";
import { default as Logger } from "./logger.js";
```

### 5.5 Side-Effect Imports

Some modules are imported purely for their side effects (they modify global state, register polyfills, etc.) and export nothing useful.

```js
import "./polyfills.js";       // Runs the module code, no bindings imported
import "./register-globals.js";
import "./styles.css";          // Common in bundlers (Webpack, Vite)
```

---

## 6. Re-exporting

Re-exporting lets you aggregate exports from multiple modules into a single entry point, which is very useful for library or package organization.

### Basic Re-export

```js
// models/user.js
export class User { /* ... */ }

// models/product.js
export class Product { /* ... */ }

// models/order.js
export class Order { /* ... */ }
```

```js
// models/index.js — barrel file (re-exports everything)
export { User } from "./user.js";
export { Product } from "./product.js";
export { Order } from "./order.js";
```

```js
// app.js — clean imports from one location
import { User, Product, Order } from "./models/index.js";
```

### Re-export All

```js
// Re-export everything from a module
export * from "./math.js";

// Re-export all AND add own exports
export * from "./math.js";
export const TAU = 2 * Math.PI; // own export
```

> **Warning:** `export *` does **not** re-export the default export. You must do it explicitly:

```js
export { default } from "./logger.js";
// or
export { default as Logger } from "./logger.js";
```

### Re-export with Renaming

```js
export { add as mathAdd, subtract as mathSubtract } from "./math.js";
export { default as Logger } from "./logger.js";
```

### Full Barrel File Example

```js
// lib/index.js
export { default as HttpClient, HttpError } from "./http-client.js";
export { default as Logger } from "./logger.js";
export * from "./math.js";
export * from "./string-utils.js";
export { default as config } from "./config.js";
```

```js
// Consumer only needs one import path
import { HttpClient, Logger, add, capitalize, config } from "./lib/index.js";
```

---

## 7. Dynamic Imports (`import()`)

The `import()` function returns a **Promise** that resolves to the module's namespace object. This enables:

- **Lazy loading** — load code only when needed
- **Conditional loading** — load modules based on runtime conditions
- **Code splitting** — bundlers split dynamic imports into separate chunks

### Basic Dynamic Import

```js
// Load a module on demand
async function loadChart() {
  const { Chart } = await import("./chart-library.js");
  const chart = new Chart("#canvas");
  chart.render(data);
}

document.getElementById("show-chart").addEventListener("click", loadChart);
```

### Conditional Dynamic Import

```js
async function loadLocale(language) {
  let translations;

  switch (language) {
    case "fr":
      translations = await import("./locales/fr.js");
      break;
    case "de":
      translations = await import("./locales/de.js");
      break;
    default:
      translations = await import("./locales/en.js");
  }

  return translations.default;
}
```

### Accessing Default and Named Exports

```js
const module = await import("./http-client.js");

// Default export
const HttpClient = module.default;

// Named exports
const { HttpError, isSuccess } = module;

// Or destructure everything at once
const { default: Client, HttpError: Err } = await import("./http-client.js");
```

### Dynamic Import with Promise.all

```js
async function initApp() {
  const [
    { default: Router },
    { default: Store },
    { default: Logger },
  ] = await Promise.all([
    import("./router.js"),
    import("./store.js"),
    import("./logger.js"),
  ]);

  const router = new Router();
  const store = new Store();
  const logger = new Logger();
}
```

### Error Handling

```js
try {
  const module = await import("./optional-feature.js");
  module.init();
} catch (error) {
  console.warn("Optional feature not available:", error.message);
  // Graceful fallback
}
```

---

## 8. CommonJS vs ES Modules

### CommonJS (CJS) — Node.js Legacy Standard

```js
// Exporting in CommonJS
// ── math.cjs ──
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;

module.exports = { add, subtract };
// or: exports.add = add;

// ── logger.cjs ──
class Logger {
  log(msg) { console.log(msg); }
}

module.exports = Logger; // Single "default-like" export
```

```js
// Importing in CommonJS
const { add, subtract } = require("./math.cjs");
const Logger = require("./logger.cjs");
```

### ES Modules (ESM) — The Standard

```js
// Exporting in ESM
// ── math.mjs ──
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// ── logger.mjs ──
export default class Logger {
  log(msg) { console.log(msg); }
}
```

```js
// Importing in ESM
import { add, subtract } from "./math.mjs";
import Logger from "./logger.mjs";
```

### Comparison Table

| Feature | CommonJS (`require`) | ES Modules (`import`) |
| ------- | -------------------- | --------------------- |
| **Syntax** | `require()` / `module.exports` | `import` / `export` |
| **Loading** | **Synchronous** | **Asynchronous** (statically analyzable) |
| **When parsed** | At runtime | At parse/compile time (before execution) |
| **Top-level only?** | No — `require()` anywhere | Yes — `import` must be at top level (except `import()`) |
| **Dynamic?** | Yes — path can be a variable | Static paths only (dynamic via `import()`) |
| **Tree-shaking** | Difficult — require is dynamic | Excellent — static analysis enables dead code elimination |
| **Circular deps** | Partially supported (can get incomplete objects) | Supported (live bindings) |
| **`this` at top level** | `module.exports` | `undefined` |
| **File extensions** | `.js` (default in Node), `.cjs` | `.mjs` or `.js` with `"type": "module"` in package.json |
| **Browser support** | Requires bundler | Native via `<script type="module">` |
| **Strict mode** | Not by default | Always strict |

### Enabling ESM in Node.js

```jsonc
// package.json — Method 1: Set type for entire project
{
  "name": "my-project",
  "type": "module"  // All .js files are treated as ESM
}
```

```
// Method 2: Use .mjs extension for individual files
math.mjs   → ES Module
math.cjs   → CommonJS
math.js    → Depends on "type" in package.json (default: CommonJS)
```

### Interoperability

```js
// ESM importing CJS (usually works in Node.js)
import lodash from "lodash"; // CJS module — default import gets module.exports

// CJS importing ESM (requires dynamic import in Node.js)
// Cannot use require() for ESM — must use import()
async function loadESM() {
  const { add } = await import("./math.mjs");
  console.log(add(1, 2));
}
```

---

## 9. Module Scope vs Global Scope

### Script Scope (Non-Module)

In a regular `<script>` tag, top-level declarations are added to the global object (`window` in browsers, `global` in Node.js).

```html
<script>
  var x = 10;     // window.x = 10
  function foo() {} // window.foo = function() {}
  let y = 20;     // NOT on window (let/const), but still accessible globally
</script>

<script>
  console.log(x);   // 10 — accessible from another script
  console.log(foo);  // function foo() {}
</script>
```

### Module Scope

In a module (`<script type="module">` or a `.mjs` file), every top-level declaration is **scoped to the module**. Nothing leaks to the global scope.

```html
<script type="module">
  const secret = "hidden";
  function helper() { return "private"; }
  // Neither `secret` nor `helper` is accessible outside this module
</script>

<script type="module">
  console.log(typeof secret); // "undefined"
  console.log(typeof helper); // "undefined"
</script>
```

### Key Differences

| Behavior | Script | Module |
| -------- | ------ | ------ |
| Top-level `var` | Global (`window.x`) | Module-scoped |
| Top-level `function` | Global | Module-scoped |
| Top-level `let` / `const` | Script-scoped (but accessible globally) | Module-scoped |
| `this` at top level | `window` (browser) / `global` (Node) | `undefined` |
| Strict mode | Not by default | Always strict |
| Runs | Immediately, synchronously | Deferred (like `defer` attribute) |
| Duplicate imports | N/A | Module evaluated only **once** (singleton) |

### Modules Are Singletons

```js
// counter.js
let count = 0;
export function increment() { count++; }
export function getCount() { return count; }
```

```js
// a.js
import { increment, getCount } from "./counter.js";
increment();
console.log(getCount()); // 1

// b.js
import { getCount } from "./counter.js";
console.log(getCount()); // 1 — same module instance, same state!
```

Both `a.js` and `b.js` share the **same** `counter.js` module instance. The module is evaluated only once, and all importers get **live bindings** to the same variables.

---

## 10. Practical Patterns and Best Practices

### 10.1 Barrel Files (Index Exports)

Organize your library or feature folder with an `index.js` that re-exports everything:

```
src/
  components/
    Button.js
    Input.js
    Modal.js
    index.js      ← barrel file
```

```js
// components/index.js
export { default as Button } from "./Button.js";
export { default as Input } from "./Input.js";
export { default as Modal } from "./Modal.js";
```

```js
// Clean imports
import { Button, Input, Modal } from "./components/index.js";
```

> **Caveat:** Barrel files can hurt tree-shaking and increase bundle size if not handled carefully by the bundler. Some bundlers (e.g., Webpack with `sideEffects: false`) handle this well.

### 10.2 Feature-Based Module Organization

```
src/
  features/
    auth/
      auth.service.js
      auth.controller.js
      auth.middleware.js
      index.js
    users/
      user.model.js
      user.service.js
      user.controller.js
      index.js
```

### 10.3 Constants Module

```js
// constants.js
export const API_BASE_URL = "https://api.example.com/v2";
export const MAX_RETRIES = 3;
export const TIMEOUT_MS = 5000;

export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
});
```

### 10.4 Factory Pattern with Default Export

```js
// database.js
export default function createDatabase(config) {
  const { host, port, name } = config;

  async function connect() {
    console.log(`Connecting to ${host}:${port}/${name}`);
    // connection logic
  }

  async function query(sql, params) {
    // query logic
  }

  async function disconnect() {
    // cleanup logic
  }

  return Object.freeze({ connect, query, disconnect });
}
```

```js
import createDatabase from "./database.js";

const db = createDatabase({
  host: "localhost",
  port: 5432,
  name: "myapp",
});

await db.connect();
```

### 10.5 Best Practices Summary

| Practice | Recommendation |
| -------- | -------------- |
| **Default vs Named** | Prefer named exports for utilities/libraries (better auto-import, refactoring). Use default for classes/components that represent the module's single purpose. |
| **File naming** | Match the export: `UserService.js` exports `class UserService` |
| **Circular dependencies** | Avoid them. If needed, restructure or use dynamic imports. |
| **Side effects** | Minimize module-level side effects. Mark `"sideEffects": false` in `package.json` for better tree-shaking. |
| **import type** | Use `import type { X }` (TypeScript) to avoid importing runtime code when only types are needed. |
| **Dynamic imports** | Use for code-splitting, lazy loading, and conditional features. |
| **Barrel files** | Use for public API surfaces, but be aware of tree-shaking implications. |
| **Extension** | Include file extensions in import paths (`.js`, `.mjs`) for maximum compatibility, especially in Node.js ESM. |
