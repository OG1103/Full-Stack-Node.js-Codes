# Node.js — Environment Variables & `.env` Configuration

Environment variables are **key-value pairs** stored outside your source code that configure how your application behaves. They are the standard way to manage sensitive data (API keys, database credentials) and environment-specific settings (development vs production).

---

## 1. Why Environment Variables?

| Problem | Solution |
|---------|----------|
| Hardcoded API keys in source code | Store in `.env`, access via `process.env` |
| Different configs for dev/staging/prod | Use separate `.env` files per environment |
| Secrets accidentally committed to Git | `.env` in `.gitignore`, secrets stay local |
| Changing config requires code changes | Change the env variable, no code changes needed |

---

## 2. `process.env`

In Node.js, all environment variables are available on the `process.env` object:

```javascript
// Access environment variables
const port = process.env.PORT;
const dbUrl = process.env.DATABASE_URL;
const nodeEnv = process.env.NODE_ENV;

console.log(port);      // '3000' (always a string!)
console.log(nodeEnv);   // 'development', 'production', or 'test'
```

**Important:** All values in `process.env` are **strings**. If you need a number or boolean, parse it:

```javascript
const port = parseInt(process.env.PORT, 10) || 3000;
const debug = process.env.DEBUG === 'true';
```

### Setting Variables from the Command Line

```bash
# Unix/macOS
PORT=5000 NODE_ENV=production node app.js

# Windows (cmd)
set PORT=5000 && node app.js

# Windows (PowerShell)
$env:PORT=5000; node app.js

# Cross-platform (using cross-env package)
npx cross-env PORT=5000 NODE_ENV=production node app.js
```

---

## 3. The `.env` File

A `.env` file stores environment variables in a simple `KEY=value` format. It lives in your project root:

```bash
# .env

# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/myapp
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=mysecretpassword
DB_NAME=myapp

# Authentication
JWT_SECRET=my-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# External APIs
STRIPE_API_KEY=sk_test_abc123
SENDGRID_API_KEY=SG.xyz789
```

### Syntax Rules

| Rule | Correct | Incorrect |
|------|---------|-----------|
| No spaces around `=` | `PORT=3000` | `PORT = 3000` |
| Comments with `#` | `# This is a comment` | |
| Strings don't need quotes | `NAME=John` | |
| Use quotes for special chars | `PASSWORD="my$ecure#pass"` | `PASSWORD=my$ecure#pass` |
| Multi-line values | `KEY="line1\nline2"` | |
| Empty values are valid | `EMPTY_VAR=` | |

---

## 4. The `dotenv` Package

The `dotenv` package reads your `.env` file and loads the variables into `process.env`.

### Installation

```bash
npm install dotenv
```

### Usage

```javascript
// Load at the very top of your entry file (before any other imports that use env vars)

// ES Modules
import dotenv from 'dotenv';
dotenv.config();

// CommonJS
require('dotenv').config();

// Now access variables
const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;
```

### Configuration Options

```javascript
import dotenv from 'dotenv';

dotenv.config({
  path: '.env.production',      // Custom file path (default: '.env')
  encoding: 'utf8',             // File encoding
  debug: true,                  // Log debug info
  override: false,              // Don't override existing env vars (default)
});
```

### Node.js 20.6+ — Native `.env` Support

Starting with Node.js 20.6, you can load `.env` files **without** the `dotenv` package:

```bash
node --env-file=.env app.js
node --env-file=.env --env-file=.env.local app.js
```

---

## 5. Environment-Specific Configuration

### Multiple `.env` Files

```
project/
├── .env                  ← Default/shared variables
├── .env.development      ← Development overrides
├── .env.production       ← Production overrides
├── .env.test             ← Test overrides
├── .env.example          ← Template (committed to Git)
└── .gitignore            ← Excludes all .env files except .env.example
```

### Loading Based on Environment

```javascript
import dotenv from 'dotenv';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

// Optionally, load .env as a base
dotenv.config();  // Won't override vars already set
```

### The `.env.example` File

Create a `.env.example` file that lists all required variables **without actual values**. This file **is** committed to Git so other developers know which variables they need:

```bash
# .env.example — Copy this to .env and fill in values

PORT=
NODE_ENV=
DATABASE_URL=
JWT_SECRET=
STRIPE_API_KEY=
```

---

## 6. Best Practices

### Security

1. **Always add `.env` to `.gitignore`** — never commit secrets to version control
   ```bash
   # .gitignore
   .env
   .env.local
   .env.production
   ```

2. **Never hardcode secrets** — always use environment variables
   ```javascript
   // BAD
   const apiKey = 'sk_test_abc123';

   // GOOD
   const apiKey = process.env.STRIPE_API_KEY;
   ```

3. **Commit `.env.example`** — document required variables without values

### Validation

Validate required environment variables at startup — fail fast if something is missing:

```javascript
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
```

### Default Values

Provide sensible defaults for non-critical variables:

```javascript
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';
const logLevel = process.env.LOG_LEVEL || 'info';
```

### Configuration Module

Centralize all environment variable access in a single config file:

```javascript
// config/index.js
import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
};

export default config;

// Usage in other files
import config from './config/index.js';
app.listen(config.port);
```

---

## 7. Summary

| Concept | Detail |
|---------|--------|
| `process.env` | Object containing all environment variables |
| `.env` file | Key-value pairs for local configuration |
| `dotenv` package | Loads `.env` into `process.env` |
| `.env.example` | Template file committed to Git |
| Node 20.6+ | `node --env-file=.env app.js` (no package needed) |

### Key Points

1. **Always add `.env` to `.gitignore`** — protect secrets from version control
2. Load `dotenv` at the **very top** of your entry file, before other imports
3. All `process.env` values are **strings** — parse numbers and booleans explicitly
4. **Provide default values** for non-critical variables (`process.env.PORT || 3000`)
5. **Validate required variables** at startup — fail fast if something is missing
6. Use a **config module** to centralize all environment variable access
7. Create a **`.env.example`** file so other developers know which variables to set
