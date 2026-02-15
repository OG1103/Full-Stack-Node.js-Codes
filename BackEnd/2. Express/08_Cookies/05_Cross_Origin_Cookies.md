# Cross-Origin Cookies

When your backend and frontend are on **different origins** (e.g., `api.example.com` and `app.example.com`, or `localhost:5000` and `localhost:3000`), cookies require special configuration to work across origins.

---

## 1. Why Cross-Origin Cookies Need Configuration

Browsers block cookies in cross-origin requests by default for security. To send and receive cookies across origins, you need to configure:

1. **Backend**: CORS with credentials + proper cookie attributes
2. **Frontend**: Include credentials in requests

---

## 2. Backend Configuration

### Step 1: Install and Configure CORS

```bash
npm install cors
```

```javascript
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',  // Frontend URL (NOT '*')
  credentials: true,                 // Allow cookies
}));

app.use(express.json());
```

**Critical:** When `credentials: true`, you **cannot** use `origin: '*'`. You must specify the exact frontend origin.

### Step 2: Set Cookie Attributes

```javascript
app.post('/api/login', (req, res) => {
  // ... validate credentials ...

  res.cookie('token', 'jwt-value-here', {
    httpOnly: true,           // Prevent JavaScript access
    secure: true,             // HTTPS only (set false for localhost HTTP)
    sameSite: 'none',         // Required for cross-origin cookies
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.json({ message: 'Logged in' });
});
```

### Cookie Attributes Explained

| Attribute | Value | Why |
|-----------|-------|-----|
| `httpOnly` | `true` | Prevents client-side JS from reading the cookie |
| `secure` | `true` | Cookie only sent over HTTPS (required when `sameSite: 'none'`) |
| `sameSite` | `'none'` | Allows the cookie to be sent in cross-origin requests |

**Note:** `sameSite: 'none'` **requires** `secure: true`. This means cross-origin cookies only work over HTTPS in production.

---

## 3. Frontend Configuration

The frontend must explicitly include credentials in every request.

### Using Fetch API

```javascript
// Login
const response = await fetch('http://localhost:5000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',  // Include cookies
  body: JSON.stringify({ email, password }),
});

// Subsequent requests
const data = await fetch('http://localhost:5000/api/profile', {
  credentials: 'include',  // Send cookies with request
});
```

### Using Axios

```javascript
import axios from 'axios';

// Option 1: Per-request
const response = await axios.post('http://localhost:5000/api/login',
  { email, password },
  { withCredentials: true }
);

// Option 2: Global default (recommended)
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,  // Always include cookies
});

await api.post('/api/login', { email, password });
await api.get('/api/profile');
```

---

## 4. Multiple Frontend Origins

If you have multiple frontend URLs (development, staging, production):

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://staging.myapp.com',
  'https://myapp.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```

---

## 5. Complete Example

### Backend (Express)

```javascript
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  // ... validate credentials ...

  res.cookie('session_id', '12345', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ message: 'Logged in' });
});

app.get('/api/profile', (req, res) => {
  const sessionId = req.cookies.session_id;

  if (!sessionId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({ sessionId });
});

app.listen(5000);
```

### Frontend (React)

```javascript
import { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

function App() {
  const [profile, setProfile] = useState(null);

  const login = async () => {
    await api.post('/api/login', {
      email: 'user@example.com',
      password: 'password',
    });
    // Cookie is automatically set by the browser
  };

  const fetchProfile = async () => {
    const { data } = await api.get('/api/profile');
    // Cookie is automatically sent by the browser
    setProfile(data);
  };

  return (
    <div>
      <button onClick={login}>Login</button>
      <button onClick={fetchProfile}>Get Profile</button>
      {profile && <pre>{JSON.stringify(profile)}</pre>}
    </div>
  );
}
```

---

## 6. Troubleshooting

| Problem | Solution |
|---------|----------|
| Cookie not set in browser | Check `credentials: 'include'` on frontend and `credentials: true` on CORS |
| Cookie not sent on requests | Ensure `withCredentials: true` (Axios) or `credentials: 'include'` (fetch) |
| `SameSite` warning | Set `sameSite: 'none'` and `secure: true` for cross-origin |
| Works on HTTP but not HTTPS | `secure: true` cookies require HTTPS |
| CORS error with credentials | Cannot use `origin: '*'` with credentials — specify exact origin |
| Third-party cookie blocked | Some browsers block third-party cookies — check browser privacy settings |

---

## 7. Checklist

### Backend
- [ ] CORS configured with specific `origin` (not `*`)
- [ ] `credentials: true` in CORS config
- [ ] Cookies set with `httpOnly: true`
- [ ] Cookies set with `sameSite: 'none'` for cross-origin
- [ ] Cookies set with `secure: true` for production

### Frontend
- [ ] `credentials: 'include'` in fetch requests
- [ ] `withCredentials: true` in Axios requests
- [ ] API calls point to correct backend URL
