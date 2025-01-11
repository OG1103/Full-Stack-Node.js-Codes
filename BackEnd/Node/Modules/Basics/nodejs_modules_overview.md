
# Node.js Modules Overview

## What Are Modules? 
- Modules in Node.js are reusable blocks of code that help in organizing an application into smaller, manageable parts. Node.js follows the CommonJS module system but also supports ES Modules. 

- MODULES ARE ENCAPSULATED CODE. 

- Each file is considered a module. To access something from another module we use imports and exports. This allows different modules to have access to specific function or variable that are present somewhere in another module. When importing such a function or variable from a seperate module it's encapsulated to the module importing it. 

## CommonJS vs ES Modules

- **CommonJS Modules**: Use `require` to import and `module.exports` to export.
  Example:
  ```javascript
  const moduleA = require('./moduleA');
  ```

- **ES Modules**: Use `import` and `export` syntax.
  Example:
  ```javascript
  import { add } from './math.js';
  ```
  To use ES Modules, add `"type": "module"` in the `package.json` file or use a `.mjs` extension.

## Types of Modules

1. **Built-in Modules**
   Node.js provides several built-in modules that cover various core functionalities such as file system operations, networking, and HTTP servers.
   
   Examples of commonly used built-in modules:
   - `fs` (File System)
   - `path` (Path utilities)
   - `http` (HTTP server and client)
   - `os` (Operating system utilities)

   Example using the `fs` module:
   ```javascript
   const fs = require('fs');
   fs.readFile('example.txt', 'utf8', (err, data) => {
     if (err) throw err;
     console.log(data);
   });
   ```

2. **User-defined Modules**
   These are modules created by the developer to encapsulate specific logic or functionality.

   Example of a user-defined module:
   **math.js**:
   ```javascript
   exports.add = (a, b) => a + b;
   ```
   **app.js**:
   ```javascript
   const math = require('./math');
   console.log(math.add(2, 3)); // Output: 5
   ```

3. **Third-party Modules**
   Node.js has a vast ecosystem of third-party modules available via npm (Node Package Manager). These modules help in extending the functionality of an application.

   Example of installing and using a third-party module:
   ```bash
   npm install lodash
   ```
   ```javascript
   const _ = require('lodash');
   console.log(_.capitalize('hello')); // Output: Hello
   ```



## Summary

Node.js modules provide a modular approach to developing applications, making it easier to maintain and scale projects. Whether using built-in, user-defined, or third-party modules, understanding how to work with modules is a key part of Node.js development.
