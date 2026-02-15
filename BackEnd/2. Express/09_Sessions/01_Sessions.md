# Sessions in Express

Sessions allow your server to remember data about a user across multiple requests. Unlike cookies (which store data on the client), sessions store data **on the server** and only send a session ID to the client via a cookie.

---

## 1. How Sessions Work

```
1. User visits → Server creates a session object in memory
2. Session data written → Server saves session to store (e.g., MongoDB)
3. Server sends a cookie with the session ID to the browser
4. User returns → Browser sends session ID cookie
5. Server looks up session in the store → Loads user data
```

### Session vs Cookie

| Feature | Cookie | Session |
|---------|--------|---------|
| Data location | Client (browser) | Server (database/memory) |
| Size limit | ~4KB | No practical limit |
| Security | Visible to client | Server-side only |
| Use case | Preferences, tokens | Cart, auth state, user data |

---

## 2. Setup

### Installation

```bash
npm install express-session connect-mongo
```

- `express-session`: Session middleware for Express
- `connect-mongo`: Stores sessions in MongoDB (production-ready)

### Configuration

```javascript
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,       // Signs the session cookie
  resave: false,                             // Don't save if session wasn't modified
  saveUninitialized: false,                  // Don't save empty sessions

  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,       // Your MongoDB connection string
    ttl: 7 * 24 * 60 * 60,                  // Session expires after 7 days (seconds)
  }),

  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,        // Cookie expires after 7 days (ms)
    httpOnly: true,                           // Not accessible via JavaScript
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  },
}));
```

### Configuration Options Explained

| Option | Value | Purpose |
|--------|-------|---------|
| `secret` | String | Used to sign the session ID cookie |
| `resave` | `false` | Don't re-save session if nothing changed |
| `saveUninitialized` | `false` | Don't create session until data is written |
| `store` | MongoStore | Where session data is persisted |
| `ttl` | Seconds | Time-to-live for session in the store |
| `cookie.maxAge` | Milliseconds | When the browser cookie expires |

---

## 3. saveUninitialized Explained

This is an important option that controls when sessions are created:

### `saveUninitialized: false` (Recommended)

```javascript
// Session object exists on every request (req.session)
// But NOT saved to MongoDB until you write data to it

app.get('/browse', (req, res) => {
  // req.session exists but is empty
  // Nothing saved to MongoDB, no cookie sent
  res.json({ message: 'Browsing' });
});

app.post('/cart/add', (req, res) => {
  req.session.cart = req.session.cart || [];
  req.session.cart.push(req.body);
  // NOW session is saved to MongoDB and cookie is sent
  res.json({ cart: req.session.cart });
});
```

### `saveUninitialized: true`

- Session saved to MongoDB on **first request** (even if empty)
- Cookie sent immediately
- Not recommended — wastes database space for users who are just browsing

---

## 4. Using Sessions

### Writing Data

```javascript
app.post('/api/cart/add', (req, res) => {
  const { productId, quantity } = req.body;

  if (!req.session.cart) {
    req.session.cart = [];
  }

  req.session.cart.push({ productId, quantity });
  res.json({ message: 'Added to cart', cart: req.session.cart });
});
```

### Reading Data

```javascript
app.get('/api/cart', (req, res) => {
  const cart = req.session.cart || [];
  res.json({ cart });
});
```

### Deleting Data

```javascript
app.delete('/api/cart', (req, res) => {
  req.session.cart = [];
  res.json({ message: 'Cart cleared' });
});
```

### Destroying the Session

```javascript
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.json({ message: 'Logged out' });
  });
});
```

---

## 5. Session Lifecycle

```
Day 0: User adds item to cart
  → Session created in MongoDB
  → Cookie sent to browser (expires in 7 days)

Day 1-6: User returns
  → Browser sends cookie
  → Server loads session from MongoDB
  → User sees their cart

Day 7: Session expires
  → MongoDB auto-deletes the session
  → Cookie is invalid

Day 8: User returns
  → Old cookie sent, session not found
  → New session created (empty cart)
```

### Sessions End In 3 Ways

1. **Expiration** — TTL reached, MongoDB auto-deletes
2. **Manual destruction** — `req.session.destroy()` called
3. **User clears cookies** — Session orphaned in MongoDB, expires later

---

## 6. Where Sessions Are Stored

Sessions live in a `sessions` collection in your MongoDB database:

```javascript
// A single session document in MongoDB
{
  _id: "abc123xyz",                        // Session ID (matches cookie)
  expires: ISODate("2025-10-12"),          // When it expires
  session: {
    cookie: {
      originalMaxAge: 604800000,           // 7 days in ms
      expires: "2025-10-12T10:30:00.000Z",
      httpOnly: true
    },
    cart: [                                // Your session data
      { productId: "prod_123", quantity: 2 },
      { productId: "prod_456", quantity: 1 }
    ]
  }
}
```

---

## 7. Real-World Example: Guest Cart with JWT Auth

A common pattern — sessions for guest users, JWT for authenticated users:

### Optional Auth Middleware

```javascript
// middleware/optionalAuth.js
import jwt from 'jsonwebtoken';

const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};

export default optionalAuth;
```

### Cart Controller (Dual Mode)

```javascript
// controllers/cartController.js
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (req.user) {
    // Authenticated user → Database
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { items: { productId, quantity } } },
      { upsert: true, new: true }
    );
  } else {
    // Guest user → Session
    if (!req.session.cart) {
      req.session.cart = [];
    }
    req.session.cart.push({ productId, quantity });
  }

  res.json({ message: 'Item added to cart' });
};

export const getCart = async (req, res) => {
  let cartItems = [];

  if (req.user) {
    const cart = await Cart.findOne({ userId: req.user.id });
    cartItems = cart?.items || [];
  } else {
    cartItems = req.session.cart || [];
  }

  res.json({ cart: cartItems });
};
```

### Cart Migration on Registration

```javascript
export const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.create({ email, password });

  // Migrate guest cart to user account
  if (req.session.cart && req.session.cart.length > 0) {
    await Cart.create({
      userId: user._id,
      items: req.session.cart,
    });
  }

  // Destroy session (user will use JWT)
  req.session.destroy();

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token, user: { id: user._id, email } });
};
```

### The Pattern

```javascript
if (req.user) {
  // Authenticated → use database
} else {
  // Guest → use session
}
```

---

## 8. Summary

| Feature | Detail |
|---------|--------|
| Storage | Server-side (MongoDB via `connect-mongo`) |
| Client gets | Session ID cookie only |
| Data access | `req.session.propertyName` |
| Destroy | `req.session.destroy()` |
| Expiration | Configurable TTL (auto-deleted by MongoDB) |

### Data Storage by User Type

| User Type | Cart Storage | Authentication |
|-----------|-------------|----------------|
| Guest | `sessions` collection (temporary) | Session cookie |
| Authenticated | `carts` collection (permanent) | JWT token |

### Key Points

1. Use `saveUninitialized: false` to avoid creating sessions for every visitor
2. Session data is stored **server-side** — only the session ID is in the cookie
3. Use `connect-mongo` for production (in-memory sessions are lost on restart)
4. Sessions are great for **guest user data** alongside JWT authentication
5. Always destroy sessions when transitioning from guest to authenticated user
