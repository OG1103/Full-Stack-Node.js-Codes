# Nodemon

Nodemon is a development utility that automatically restarts your Node.js application when file changes are detected. It eliminates the need to manually stop and restart the server during development.

---

## 1. Installation

```bash
# Install as a dev dependency (recommended)
npm install --save-dev nodemon

# Or install globally
npm install -g nodemon
```

---

## 2. Basic Usage

### Running Your App

```bash
# Instead of: node app.js
nodemon app.js

# With npx (no global install needed)
npx nodemon app.js
```

### Using npm Scripts

```json
// package.json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

```bash
npm run dev
```

---

## 3. How It Works

```
1. Nodemon starts your application
2. It watches the project directory for file changes
3. When a file is saved → Nodemon restarts the process
4. Your app runs with the latest code
```

By default, Nodemon watches for changes in files with these extensions: `.js`, `.mjs`, `.cjs`, `.json`.

---

## 4. Configuration

### Option A: CLI Flags

```bash
# Watch specific directory
nodemon --watch src app.js

# Watch specific extensions
nodemon --ext js,json,hbs app.js

# Ignore files/directories
nodemon --ignore tests/ app.js

# Set delay before restart (ms)
nodemon --delay 2000 app.js

# Combine options
nodemon --watch src --ext js,json --ignore tests/ --delay 1000 app.js
```

### Option B: nodemon.json (Recommended)

Create a `nodemon.json` file in the project root:

```json
{
  "watch": ["src"],
  "ext": "js,json,hbs",
  "ignore": ["node_modules", "tests", "logs"],
  "delay": 1000,
  "env": {
    "NODE_ENV": "development",
    "PORT": 3000
  },
  "exec": "node --inspect app.js"
}
```

### Option C: package.json

```json
{
  "nodemonConfig": {
    "watch": ["src"],
    "ext": "js,json",
    "ignore": ["tests"]
  }
}
```

**Priority:** CLI flags > `nodemon.json` > `package.json`

---

## 5. Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `watch` | Array | Directories/files to watch |
| `ext` | String | File extensions to watch (comma-separated) |
| `ignore` | Array | Paths to ignore |
| `delay` | Number | Delay before restart (ms) |
| `env` | Object | Environment variables |
| `exec` | String | Custom execution command |
| `verbose` | Boolean | Show detailed restart info |

---

## 6. Using with ES Modules

If your project uses ES modules (`import`/`export`):

```json
// package.json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon app.js"
  }
}
```

Nodemon works the same way — it just restarts the Node.js process.

---

## 7. Debugging with Nodemon

```bash
# Enable Node.js inspector
nodemon --inspect app.js

# Or in nodemon.json
{
  "exec": "node --inspect app.js"
}
```

Then connect a debugger (Chrome DevTools or VS Code) to `localhost:9229`.

---

## 8. Manual Restart

While Nodemon is running, type `rs` and press Enter to manually trigger a restart:

```
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
rs
[nodemon] starting `node app.js`
```

---

## 9. Summary

| Feature | Detail |
|---------|--------|
| Purpose | Auto-restart on file changes |
| Install | `npm install --save-dev nodemon` |
| Run | `nodemon app.js` or `npx nodemon app.js` |
| Config | CLI flags, `nodemon.json`, or `package.json` |
| Watch | Customizable directories and extensions |
| Manual restart | Type `rs` in the terminal |
