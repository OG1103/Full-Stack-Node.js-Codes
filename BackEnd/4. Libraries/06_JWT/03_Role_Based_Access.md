# Role-Based Access Control with JWT

Restrict access to routes based on user roles (admin, user, moderator, etc.) by encoding the role in the JWT and checking it in middleware.

---

## 1. Include Role in the Token

```javascript
const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  // ... validate password ...

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,          // Include the role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token });
};
```

---

## 2. Auth Middleware (Verify Token)

```javascript
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, email, role }
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
```

---

## 3. Authorization Middleware (Check Role)

```javascript
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};
```

### 401 vs 403

| Status | Meaning | When |
|--------|---------|------|
| 401 | Unauthorized | User is not logged in (no/invalid token) |
| 403 | Forbidden | User is logged in but lacks permission |

---

## 4. Using in Routes

```javascript
// Any authenticated user
app.get('/api/profile', auth, getProfile);

// Only admins
app.delete('/api/users/:id', auth, authorize('admin'), deleteUser);

// Admins and moderators
app.put('/api/posts/:id', auth, authorize('admin', 'moderator'), updatePost);

// Only the user themselves or an admin
app.get('/api/users/:id', auth, authorizeOwnerOrAdmin, getUserById);
```

### Owner-or-Admin Pattern

```javascript
const authorizeOwnerOrAdmin = (req, res, next) => {
  const isOwner = req.user.userId === req.params.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }

  next();
};
```

---

## 5. User Model with Role

```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user',
  },
});

const User = mongoose.model('User', userSchema);
```

---

## 6. Complete Example

```javascript
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Authorization middleware
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Routes
app.get('/api/dashboard', auth, (req, res) => {
  res.json({ message: 'Welcome', user: req.user });
});

app.get('/api/admin', auth, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin panel' });
});

app.delete('/api/users/:id', auth, authorize('admin'), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

app.listen(5000);
```

---

## 7. Summary

| Middleware | Purpose | Checks |
|-----------|---------|--------|
| `auth` | Authentication | Is the token valid? |
| `authorize('admin')` | Authorization | Does the user have the required role? |

### Middleware Chain

```javascript
app.get('/route', auth, authorize('admin'), handler);
//                 ↓          ↓               ↓
//           Verify JWT  Check role     Handle request
```

1. `auth` runs first — verifies the token and sets `req.user`
2. `authorize` runs next — checks if `req.user.role` is allowed
3. Handler runs only if both middleware pass
