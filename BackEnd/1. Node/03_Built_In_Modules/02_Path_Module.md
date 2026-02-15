# Node.js Built-in Module — `path`

The `path` module provides utilities for working with **file and directory paths**. It handles differences between operating systems (Windows uses `\`, Unix uses `/`) so your code works cross-platform.

---

## 1. Importing

```javascript
// CommonJS
const path = require('path');

// ES Modules
import path from 'path';
```

---

## 2. Core Methods

### `path.join()` — Combine Path Segments

Joins multiple path segments into one normalized path. It handles extra slashes, `..`, and platform-specific separators automatically.

```javascript
const filePath = path.join('/users', 'john', 'documents', 'file.txt');
console.log(filePath);
// Unix:    /users/john/documents/file.txt
// Windows: \users\john\documents\file.txt

// With __dirname — resolve relative to current file
const configPath = path.join(__dirname, 'config', 'database.json');
// /Users/john/project/config/database.json

// Handles .. (parent directory)
const parentFile = path.join('/users/john/documents', '..', 'file.txt');
// /users/john/file.txt
```

### `path.resolve()` — Get Absolute Path

Resolves a sequence of paths into an **absolute path**. Works from right to left — if it encounters an absolute path, it stops.

```javascript
// Resolve relative to current working directory
console.log(path.resolve('src', 'app.js'));
// /Users/john/project/src/app.js

// If first arg is absolute, it's used as base
console.log(path.resolve('/users/john', 'documents', 'file.txt'));
// /users/john/documents/file.txt

// Absolute path in middle resets
console.log(path.resolve('src', '/users', 'file.txt'));
// /users/file.txt
```

### `join()` vs `resolve()`

| Feature | `path.join()` | `path.resolve()` |
|---------|---------------|-------------------|
| Returns | Relative or absolute (based on input) | Always absolute |
| Behavior | Simply concatenates segments | Resolves from right to left |
| Starting point | None — just joins | Current working directory (if no absolute path given) |

```javascript
path.join('src', 'app.js');      // 'src/app.js' (relative)
path.resolve('src', 'app.js');   // '/Users/john/project/src/app.js' (absolute)
```

### `path.basename()` — Get File Name

Returns the last portion of a path (the file name).

```javascript
console.log(path.basename('/users/john/app.js'));
// 'app.js'

// Without extension
console.log(path.basename('/users/john/app.js', '.js'));
// 'app'
```

### `path.extname()` — Get File Extension

Returns the file extension (including the dot).

```javascript
console.log(path.extname('app.js'));           // '.js'
console.log(path.extname('styles.min.css'));   // '.css'
console.log(path.extname('README'));           // '' (no extension)
console.log(path.extname('.gitignore'));       // '' (dot file, no extension)
```

### `path.dirname()` — Get Directory Name

Returns the directory portion of a path (everything except the file name).

```javascript
console.log(path.dirname('/users/john/project/app.js'));
// '/users/john/project'

console.log(path.dirname('/users/john/'));
// '/users/john'
```

### `path.parse()` — Decompose a Path

Breaks a path into an object with `root`, `dir`, `base`, `name`, and `ext`.

```javascript
const parsed = path.parse('/users/john/project/app.js');
console.log(parsed);
// {
//   root: '/',
//   dir: '/users/john/project',
//   base: 'app.js',
//   ext: '.js',
//   name: 'app'
// }
```

### `path.format()` — Compose a Path

The inverse of `parse()` — builds a path string from an object.

```javascript
const pathString = path.format({
  dir: '/users/john/project',
  name: 'app',
  ext: '.js',
});
console.log(pathString);  // '/users/john/project/app.js'
```

### `path.normalize()` — Clean Up a Path

Resolves `.`, `..`, and removes duplicate slashes.

```javascript
console.log(path.normalize('/users//john/../john/./project'));
// '/users/john/project'
```

### `path.isAbsolute()` — Check if Path is Absolute

```javascript
console.log(path.isAbsolute('/users/john'));   // true
console.log(path.isAbsolute('./src/app.js'));  // false
console.log(path.isAbsolute('app.js'));        // false
```

### `path.relative()` — Get Relative Path Between Two Paths

```javascript
console.log(path.relative('/users/john/project', '/users/john/project/src/app.js'));
// 'src/app.js'

console.log(path.relative('/users/john/project', '/users/jane/project'));
// '../../jane/project'
```

---

## 3. Platform-Specific Properties

| Property | Description | Value |
|----------|-------------|-------|
| `path.sep` | Path separator | `'/'` (Unix) or `'\\'` (Windows) |
| `path.delimiter` | PATH environment delimiter | `':'` (Unix) or `';'` (Windows) |

```javascript
console.log(path.sep);        // '/' on Unix, '\\' on Windows
console.log(path.delimiter);  // ':' on Unix, ';' on Windows

// Split the system PATH
const paths = process.env.PATH.split(path.delimiter);
console.log(paths);
```

---

## 4. Common Use Cases

### Serving Static Files

```javascript
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
```

### Building Config Paths

```javascript
const configPath = path.join(__dirname, 'config', `${process.env.NODE_ENV}.json`);
const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
```

### Working with File Extensions

```javascript
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
}
```

---

## 5. All Methods Reference

| Method | Description | Example Output |
|--------|-------------|----------------|
| `join(...segments)` | Join path segments | `'src/app.js'` |
| `resolve(...segments)` | Resolve to absolute path | `'/home/user/src/app.js'` |
| `basename(path, ext?)` | Get file name | `'app.js'` or `'app'` |
| `extname(path)` | Get file extension | `'.js'` |
| `dirname(path)` | Get directory name | `'/home/user/src'` |
| `parse(path)` | Decompose path to object | `{ root, dir, base, ext, name }` |
| `format(obj)` | Compose path from object | `'/home/user/app.js'` |
| `normalize(path)` | Clean up messy paths | `'/users/john/project'` |
| `isAbsolute(path)` | Check if absolute | `true` or `false` |
| `relative(from, to)` | Get relative path | `'../../other/file.js'` |

### Key Points

1. Always use `path.join()` or `path.resolve()` instead of string concatenation — handles cross-platform separators
2. Use `path.join(__dirname, ...)` for paths relative to the **current file**
3. Use `path.resolve(...)` when you need a guaranteed **absolute path**
4. In ES Modules, construct `__dirname` from `import.meta.url`
5. `extname` includes the dot (`.js`, not `js`)
