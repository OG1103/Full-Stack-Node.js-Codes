# Express Backend Security

A comprehensive guide to securing an Express.js application. Security is layered — no single measure is enough, so apply all relevant ones together.

---

## Table of Contents

1. [Helmet.js – HTTP Security Headers](#1-helmetjs--http-security-headers)
2. [Rate Limiting](#2-rate-limiting)
3. [CORS – Cross-Origin Resource Sharing](#3-cors--cross-origin-resource-sharing)
4. [Input Validation & Sanitization](#4-input-validation--sanitization)
5. [SQL / NoSQL Injection Prevention](#5-sql--nosql-injection-prevention)
6. [Authentication – JWT](#6-authentication--jwt)
7. [Authentication – Sessions (Alternative)](#7-authentication--sessions-alternative)
8. [Password Hashing with bcrypt](#8-password-hashing-with-bcrypt)
9. [CSRF Protection](#9-csrf-protection)
10. [Environment Variables & Secrets](#10-environment-variables--secrets)
11. [HTTPS / TLS](#11-https--tls)
12. [Preventing Parameter Pollution](#12-preventing-parameter-pollution)
13. [Limiting Request Body Size](#13-limiting-request-body-size)
14. [Logging & Monitoring](#14-logging--monitoring)
15. [Dependency Security](#15-dependency-security)
16. [Security Checklist Summary](#16-security-checklist-summary)

---

## 1. Helmet.js – HTTP Security Headers

### What it does
Helmet sets several HTTP response headers that protect against common browser-based attacks by instructing the browser how to behave.

### Install
```bash
npm install helmet
```

### Usage
```js
const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(helmet()); // applies all defaults at once
```

### What each header does

| Header | What it prevents |
|---|---|
| `Content-Security-Policy` | XSS – restricts where scripts/styles/images can load from |
| `X-Frame-Options` | Clickjacking – blocks the page from being embedded in an iframe |
| `X-Content-Type-Options` | MIME sniffing – forces browser to use the declared content type |
| `Strict-Transport-Security` | Forces HTTPS for future requests (HSTS) |
| `Referrer-Policy` | Controls how much referrer info is sent |
| `X-XSS-Protection` | Enables legacy browser XSS filters |
| `Permissions-Policy` | Restricts access to browser features (camera, mic, etc.) |

### Custom configuration example
```js
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],          // only load resources from same origin
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"], // allow a CDN
        imgSrc: ["'self'", "data:"],
      },
    },
    frameguard: { action: 'deny' },      // block all iframes
  })
);
```

---

## 2. Rate Limiting

### What it does
Limits how many requests a single IP can make in a time window. Protects against:
- Brute-force login attacks
- DDoS / abuse
- Credential stuffing

### Install
```bash
npm install express-rate-limit
```

### Usage – global limiter
```js
const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 100,                  // max 100 requests per window per IP
  standardHeaders: true,     // send RateLimit-* headers
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use(globalLimiter);
```

### Usage – strict limiter for login/auth routes
```js
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,                   // only 10 login attempts per window
  message: { error: 'Too many login attempts.' },
});

app.post('/api/auth/login', authLimiter, loginController);
```

---

## 3. CORS – Cross-Origin Resource Sharing

### What it does
Controls which external origins (domains) are allowed to make requests to your API. Without CORS configuration, browsers block cross-origin requests by default — but misconfiguring it can open your API to any website.

### Install
```bash
npm install cors
```

### Bad practice – allow everything (do NOT use in production)
```js
app.use(cors()); // allows ALL origins — dangerous
```

### Correct usage – whitelist specific origins
```js
const cors = require('cors');

const allowedOrigins = [
  'https://yourfrontend.com',
  'https://www.yourfrontend.com',
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // allow cookies / auth headers cross-origin
};

app.use(cors(corsOptions));
```

---

## 4. Input Validation & Sanitization

### What it does
- **Validation** – ensures data is the right type/format (e.g. email is actually an email)
- **Sanitization** – strips dangerous characters (e.g. HTML tags that could cause XSS)

Never trust user input. Always validate on the server side, even if you validate on the client too.

### Install
```bash
npm install express-validator
```

### Usage
```js
const { body, validationResult } = require('express-validator');

app.post(
  '/api/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).trim(),
    body('username')
      .isAlphanumeric()
      .trim()
      .escape(), // escapes < > & etc. to prevent XSS
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // safe to use req.body here
  }
);
```

### Key validators
| Method | What it checks |
|---|---|
| `.isEmail()` | Valid email format |
| `.isLength({ min, max })` | String length |
| `.isAlphanumeric()` | Only letters and numbers |
| `.isNumeric()` | Numeric value |
| `.trim()` | Remove surrounding whitespace |
| `.escape()` | Encode HTML special characters |
| `.normalizeEmail()` | Lowercase, remove dots/plus tricks |

---

## 5. SQL / NoSQL Injection Prevention

### What it is
Injection attacks occur when untrusted user input is directly inserted into a database query, allowing attackers to manipulate the query logic.

### SQL Injection — use parameterized queries
```js
// DANGEROUS — never do this
const query = `SELECT * FROM users WHERE email = '${req.body.email}'`;

// SAFE — parameterized query (works with pg, mysql2, etc.)
const { rows } = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [req.body.email]
);
```

### NoSQL Injection (MongoDB) — sanitize query operators
Attackers can send `{ "$gt": "" }` as a field value to bypass checks.

#### Install
```bash
npm install express-mongo-sanitize
```

#### Usage
```js
const mongoSanitize = require('express-mongo-sanitize');

// strips $ and . from req.body, req.params, req.query
app.use(mongoSanitize());
```

#### Also use Mongoose schema validation
```js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});
```
Schemas act as a second layer — Mongoose will reject data that doesn't match the defined types.

---

## 6. Authentication – JWT

### What it does
JSON Web Tokens (JWT) allow stateless authentication. The server signs a token and sends it to the client; the client sends it back on every request. The server verifies the signature — no session store needed.

### Install
```bash
npm install jsonwebtoken
```

### Signing a token (on login)
```js
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: user._id, role: user.role }, // payload (do NOT put password here)
  process.env.JWT_SECRET,                // secret key — keep in .env
  { expiresIn: '1h' }                    // expiry
);

res.json({ token });
```

### Verifying a token (middleware)
```js
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded payload to request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// protect a route
app.get('/api/profile', authenticate, (req, res) => {
  res.json({ userId: req.user.userId });
});
```

### Best practices
- Store `JWT_SECRET` in `.env`, never in code
- Keep expiry short (15min–1h) and use refresh tokens for longer sessions
- Never store JWTs in `localStorage` — use `httpOnly` cookies to prevent XSS theft
- Always use HTTPS so tokens can't be intercepted

---

## 7. Authentication – Sessions (Alternative)

### What it does
Server-side sessions store user state on the server (in memory or a store like Redis). The client only holds a session ID in a cookie. More secure than JWT in some scenarios because sessions can be revoked instantly.

### Install
```bash
npm install express-session connect-mongo
```

### Usage
```js
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(
  session({
    secret: process.env.SESSION_SECRET, // strong random string
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      httpOnly: true,    // JS cannot access the cookie — prevents XSS theft
      secure: true,      // only sent over HTTPS
      sameSite: 'strict',// prevents CSRF
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);
```

---

## 8. Password Hashing with bcrypt

### What it does
Passwords must never be stored as plain text. bcrypt hashes passwords with a salt (random data) so that even identical passwords produce different hashes, and it's designed to be slow to make brute-force attacks impractical.

### Install
```bash
npm install bcrypt
```

### Hashing on registration
```js
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12; // higher = slower hash, more secure (10-14 is typical)

const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);

await User.create({ email: req.body.email, password: hashedPassword });
```

### Comparing on login
```js
const user = await User.findOne({ email: req.body.email });
if (!user) return res.status(401).json({ error: 'Invalid credentials' });

const isMatch = await bcrypt.compare(req.body.password, user.password);
if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

// passwords match — generate token or session
```

> Note: Return the same generic error message for both "user not found" and "wrong password" to prevent user enumeration.

---

## 9. CSRF Protection

### What it is
Cross-Site Request Forgery (CSRF) tricks a logged-in user's browser into making an unwanted request to your server (e.g. transferring money). It exploits the fact that browsers automatically send cookies with requests.

### When it applies
CSRF is a concern when using **cookie-based authentication** (sessions). JWT in `Authorization` headers is not vulnerable to CSRF.

### Install
```bash
npm install csurf
```

### Usage
```js
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

const csrfProtection = csrf({ cookie: true });

// Send token to frontend
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Protect state-changing routes
app.post('/api/transfer', csrfProtection, (req, res) => {
  // request is valid only if it includes the correct CSRF token
  res.json({ success: true });
});
```

### Frontend — include token in requests
```js
// get token first
const { csrfToken } = await fetch('/api/csrf-token').then(r => r.json());

// include it in state-changing requests
await fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'CSRF-Token': csrfToken,
  },
  body: JSON.stringify({ amount: 100 }),
  credentials: 'include',
});
```

---

## 10. Environment Variables & Secrets

### What it does
Keeps secrets (database URIs, API keys, JWT secrets) out of source code so they aren't accidentally committed to git or exposed in logs.

### Install
```bash
npm install dotenv
```

### Setup
```
# .env
PORT=3000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mydb
JWT_SECRET=a_very_long_random_string_at_least_32_chars
SESSION_SECRET=another_long_random_string
```

```js
// index.js — load as early as possible
require('dotenv').config();

console.log(process.env.JWT_SECRET); // available anywhere after this
```

### .gitignore — critical
```
# .gitignore
.env
.env.*
node_modules/
```

Never commit `.env`. Add it to `.gitignore` before the first commit.

### Validating env vars on startup
```js
const required = ['MONGO_URI', 'JWT_SECRET', 'SESSION_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1); // crash early rather than run with broken config
  }
}
```

---

## 11. HTTPS / TLS

### What it does
Encrypts all data in transit between client and server. Without HTTPS, everything (including tokens and passwords) is sent in plaintext and can be intercepted.

### In production
Use a reverse proxy (Nginx, Caddy, AWS ALB) to handle TLS termination. Your Node app runs on HTTP internally; the proxy adds HTTPS externally.

**Caddy** (automatic HTTPS with Let's Encrypt):
```
# Caddyfile
yourdomain.com {
  reverse_proxy localhost:3000
}
```

### Force HTTPS redirect in Express
```js
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});
```

### HSTS — tell browsers to always use HTTPS
```js
// via Helmet (already included in helmet() defaults)
app.use(
  helmet.hsts({
    maxAge: 31536000,        // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  })
);
```

---

## 12. Preventing Parameter Pollution

### What it is
Attackers can send duplicate query parameters (`?sort=name&sort=DROP TABLE users`) to confuse query parsers or cause unexpected behaviour.

### Install
```bash
npm install hpp
```

### Usage
```js
const hpp = require('hpp');

app.use(hpp({
  whitelist: ['filter'], // allow ?filter=a&filter=b (intentional arrays)
}));
```

HPP keeps the last value of duplicate parameters by default and moves duplicates to `req.query.filter` as an array only for whitelisted keys.

---

## 13. Limiting Request Body Size

### What it does
Prevents attackers from sending enormous request bodies to exhaust memory or crash the server (a form of DoS).

### Built into Express — set limits on body parsers
```js
app.use(express.json({ limit: '10kb' }));      // reject JSON bodies > 10KB
app.use(express.urlencoded({ limit: '10kb', extended: true }));
```

### For file uploads — multer limits
```js
const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per file
    files: 3,                   // max 3 files per request
  },
});
```

---

## 14. Logging & Monitoring

### What it does
Logging allows you to detect attacks, audit access, and debug incidents. Without logs you are blind to what is happening in your app.

### Install
```bash
npm install morgan winston
```

### HTTP request logging with Morgan
```js
const morgan = require('morgan');

// 'combined' logs IP, method, URL, status, response time, user-agent
app.use(morgan('combined'));
```

### Application logging with Winston
```js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// log a security event
logger.warn('Failed login attempt', { ip: req.ip, email: req.body.email });
```

### What to log
- Failed login attempts (IP + username, not password)
- Requests that fail authentication or authorization
- Unexpected errors
- Sensitive admin operations (user deletion, role changes)

### What NOT to log
- Passwords (even failed ones)
- Full JWT tokens or session IDs
- Credit card numbers or PII

---

## 15. Dependency Security

### What it does
Third-party packages can contain vulnerabilities. Regularly auditing and updating them reduces your attack surface.

### Audit for known vulnerabilities
```bash
npm audit
```

### Fix automatically where possible
```bash
npm audit fix
```

### Check for outdated packages
```bash
npm outdated
```

### Use `npm ci` in CI/CD instead of `npm install`
```bash
npm ci # installs exactly what is in package-lock.json — no surprise updates
```

### Lock your Node version
Use `.nvmrc` or `engines` in `package.json`:
```json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

---

## 16. Security Checklist Summary

Use this as a quick reference before deploying.

| # | Measure | Package / Method |
|---|---|---|
| 1 | HTTP security headers | `helmet` |
| 2 | Rate limiting | `express-rate-limit` |
| 3 | CORS whitelist | `cors` |
| 4 | Input validation & sanitization | `express-validator` |
| 5 | NoSQL injection prevention | `express-mongo-sanitize` |
| 6 | Parameterized queries (SQL) | Native driver params |
| 7 | Passwords hashed | `bcrypt` (salt rounds ≥ 10) |
| 8 | JWT stored in httpOnly cookie | `jsonwebtoken` |
| 9 | CSRF tokens (cookie auth) | `csurf` |
| 10 | Secrets in `.env`, not in code | `dotenv` + `.gitignore` |
| 11 | HTTPS enforced | Nginx / Caddy + HSTS |
| 12 | Parameter pollution blocked | `hpp` |
| 13 | Request body size limited | `express.json({ limit })` |
| 14 | Access logs + error logging | `morgan` + `winston` |
| 15 | Dependencies audited | `npm audit` |

---

> Security is not a one-time task — revisit this checklist when adding new features, updating dependencies, or before every production deployment.
