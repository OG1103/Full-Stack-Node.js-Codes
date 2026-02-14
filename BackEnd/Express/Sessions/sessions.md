# Sessions for Guest Users - Simple Guide

## What Are Sessions?

**Sessions** are a way to remember guest users across multiple requests without requiring them to log in.

Think of it like a **shopping basket in a physical store**:
- You grab a basket when you enter (session created)
- You put items in it as you shop (session data stored)
- The store remembers it's YOUR basket (session ID in cookie)
- When you leave or after closing time, the basket is emptied (session expires/destroyed)

---

## How Sessions Work - The Basics

### First Visit (Session Creation with `saveUninitialized: false`)

```
1. User visits your website
   → Browser: "GET /api/cart" (no cookie yet)

2. Express creates session object in memory
   → req.session = {} (empty object, not saved yet)
   → Session object ALWAYS exists for every request
   → But NOT saved to MongoDB yet ❌
   → NO cookie sent yet ❌

3. User adds item to cart (writes data to session)
   → req.session.cart = []
   → req.session.cart.push({ productId, quantity })

4. Express detects session was modified
   → NOW generates unique ID: "abc123xyz..."
   → NOW saves to MongoDB: { _id: "abc123xyz...", session: { cart: [...] } }
   → NOW sends cookie to browser: Set-Cookie: guest.sid=abc123xyz...

5. Browser saves cookie
   → User now has a session stored in MongoDB + cookie in browser!
```

**Key Point with `saveUninitialized: false`:**
- Session object (`req.session`) is **ALWAYS initialized** for every request
- But **NOT saved to MongoDB** until you write data to it
- Cookie is **NOT sent** until session is saved

**If you want sessions saved immediately (even empty), use:**
```javascript
app.use(session({
  saveUninitialized: true,  // ← Creates session + sends cookie on FIRST request
  ...
}));
```

With `saveUninitialized: true`:
- Session saved to MongoDB on first request (even if empty)
- Cookie sent immediately
- Not recommended (wastes database space for browsing users)

### Second Visit (Session Retrieval)

```
1. User visits again
   → Browser: "GET /api/cart"
   → Cookie: guest.sid=abc123xyz...

2. Express reads the cookie
   → Sees Session ID: "abc123xyz..."
   → Looks up in MongoDB: db.sessions.findOne({ _id: "abc123xyz..." })
   → Finds: { cart: [{ productId: "prod_123", quantity: 2 }] }

3. Express loads the data
   → req.session.cart = [{ productId: "prod_123", quantity: 2 }]

4. User's cart is back!
```

**Simple Rule:**
- **No cookie?** → Create new session
- **Has cookie?** → Load existing session from MongoDB

---

## Session Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│ DAY 0: User visits website                              │
│ → Session created in MongoDB                            │
│ → Cookie sent to browser (expires in 7 days)            │
└─────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│ DAY 1-6: User comes back                                │
│ → Browser sends cookie                                  │
│ → Express loads session from MongoDB                    │
│ → User sees their cart                                  │
└─────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│ DAY 7: Session expires                                  │
│ → MongoDB automatically deletes the session             │
│ → Cookie in browser is now invalid                      │
└─────────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────────┐
│ DAY 8: User visits again                                │
│ → Browser sends old cookie                              │
│ → Express checks MongoDB → NOT FOUND                    │
│ → Creates NEW session with NEW ID                       │
│ → User starts with empty cart                           │
└─────────────────────────────────────────────────────────┘
```

**Time Limit:**
- Default: 7 days (configurable)
- After 7 days of inactivity → session deleted
- User returns after 7 days → new session created (fresh start)

---

## When Do Sessions Terminate?

Sessions end in 3 ways:

### 1. Expiration (Automatic)
```javascript
// After 7 days of no activity
// MongoDB automatically deletes the session
// Next visit = new session created
```

### 2. Manual Destruction (User logs in/out)
```javascript
// When guest creates account or logs in
req.session.destroy((err) => {
  // Session deleted from MongoDB immediately
});
```

### 3. User Clears Cookies
```javascript
// User clears browser cookies manually
// Cookie is gone, but session still exists in MongoDB
// Will expire after 7 days automatically
```

---

## Where Are Sessions Stored in MongoDB?

### Your Database Structure

```
mystore (your database)
  ├── users          ← Your JWT authenticated users
  ├── products       ← Your products
  ├── orders         ← All orders (guest + authenticated)
  └── sessions       ← Guest sessions ONLY (auto-created)
```

### Inside the `sessions` Collection

```javascript
// MongoDB document for ONE guest user
{
  _id: "abc123xyz...",                    // ← Session ID (from cookie)
  expires: ISODate("2025-10-12"),         // ← When it expires
  session: {                              // ← Actual guest data
    cookie: {
      originalMaxAge: 604800000,          // 7 days in milliseconds
      expires: "2025-10-12T10:30:00.000Z",
      httpOnly: true
    },
    cart: [                               // ← Your guest cart data
      { productId: "prod_123", quantity: 2 },
      { productId: "prod_456", quantity: 1 }
    ]
  }
}
```

**Key Points:**
- Each guest = 1 document in `sessions` collection
- `_id` field = Session ID (matches cookie value)
- Your data is inside `session.cart`
- MongoDB auto-deletes expired sessions

---

## Setup

```bash
npm install express-session connect-mongo
```

```javascript
// app.js
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,        // Secret key for signing cookies
  resave: false,                             // Don't save if unchanged
  saveUninitialized: false,                  // Don't create session until needed, aka untill it has data in it
  
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,       // Your MongoDB connection
    ttl: 7 * 24 * 60 * 60                    // 7 days in seconds
  }),
  
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,         // 7 days in milliseconds
    httpOnly: true,                           // Security: can't access via JS
    secure: process.env.NODE_ENV === 'production'  // HTTPS only in production
  }
}));

app.listen(3000);
```

**Configuration Explained:**
- `mongoUrl`: Your database (same as your other collections)
- `ttl: 7 * 24 * 60 * 60`: Session expires after 7 days
- `maxAge: 7 * 24 * 60 * 60 * 1000`: Cookie expires after 7 days (must match TTL)

---


## Complete Example: E-commerce Cart & Checkout

### Setup

```javascript
// app.js
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
app.use(express.json());

// Session setup for guests
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 7 * 24 * 60 * 60  // 7 days
  }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));
```

### Optional Auth Middleware

```javascript
// middleware/optionalAuth.js
const jwt = require('jsonwebtoken');

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

module.exports = optionalAuth;
```

---

## Cart Controller

```javascript
// controllers/cartController.js

// ADD TO CART - Works for both authenticated & guest
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (req.user) {
      // ✅ AUTHENTICATED USER → Database
      await Cart.findOneAndUpdate(
        { userId: req.user.id },
        { $push: { items: { productId, quantity } } },
        { upsert: true, new: true }
      );
    } else {
      // ✅ GUEST USER → Session
      // Initialize cart if it doesn't exist
      if (!req.session.cart) {
        req.session.cart = []; // ← Writes to MongoDB + sends cookie
      }
      req.session.cart.push({ productId, quantity });
    }

    res.json({ success: true, message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET CART - Works for both authenticated & guest
exports.getCart = async (req, res) => {
  try {
    let cartItems = [];

    if (req.user) {
      // ✅ AUTHENTICATED USER → Query Database
      const cart = await Cart.findOne({ userId: req.user.id })
        .populate('items.productId');
      cartItems = cart?.items || [];
    } else {
      // ✅ GUEST USER → Get from Session
      // Initialize cart if it doesn't exist
      if (!req.session.cart) {
        req.session.cart = [];
      }
      
      if (req.session.cart.length > 0) {
        const productIds = req.session.cart.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });
        
        cartItems = req.session.cart.map(item => ({
          productId: products.find(p => p._id.toString() === item.productId),
          quantity: item.quantity
        }));
      }
    }

    res.json({ cart: cartItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// REMOVE FROM CART - Works for both authenticated & guest
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (req.user) {
      // ✅ AUTHENTICATED USER → Remove from Database
      await Cart.findOneAndUpdate(
        { userId: req.user.id },
        { $pull: { items: { productId } } }
      );
    } else {
      // ✅ GUEST USER → Remove from Session
      if (!req.session.cart) {
        req.session.cart = [];
      }
      req.session.cart = req.session.cart.filter(
        item => item.productId !== productId
      );
    }

    res.json({ success: true, message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## Checkout Controller

```javascript
// controllers/checkoutController.js

exports.processCheckout = async (req, res) => {
  try {
    const { email, shippingAddress, paymentMethod } = req.body;
    
    // Get cart items based on user type
    let cartItems = [];
    
    if (req.user) {
      // ✅ AUTHENTICATED USER → Get from Database
      const cart = await Cart.findOne({ userId: req.user.id })
        .populate('items.productId');
      cartItems = cart?.items || [];
    } else {
      // ✅ GUEST USER → Get from Session
      
      // Validate guest email
      if (!email) {
        return res.status(400).json({ 
          error: 'Email is required for guest checkout' 
        });
      }
      
      if (req.session.cart.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      const productIds = req.session.cart.map(item => item.productId);
      const products = await Product.find({ _id: { $in: productIds } });
      
      cartItems = req.session.cart.map(item => ({
        productId: products.find(p => p._id.toString() === item.productId),
        quantity: item.quantity
      }));
    }

    // Validate cart
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total
    const totalAmount = cartItems.reduce((total, item) => {
      return total + (item.productId.price * item.quantity);
    }, 0);

    // Create order
    const order = await Order.create({
      userId: req.user?.id || null,        // null for guests
      guestEmail: req.user ? null : email,  // only for guests
      items: cartItems.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price
      })),
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: 'pending'
    });

    // Clear cart after successful order
    if (req.user) {
      // ✅ AUTHENTICATED USER → Clear Database Cart
      await Cart.findOneAndUpdate(
        { userId: req.user.id },
        { items: [] }
      );
    } else {
      // ✅ GUEST USER → Clear Session Cart
      req.session.cart = [];
    }

    res.json({ 
      success: true, 
      orderId: order._id,
      message: 'Order placed successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## Auth Controller (Registration with Cart Migration)

```javascript
// controllers/authController.js

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Create user
    const user = await User.create({ email, password });
    
    // ✅ MIGRATE GUEST CART TO USER ACCOUNT
    if (req.session.cart && req.session.cart.length > 0) {
      await Cart.create({
        userId: user._id,
        items: req.session.cart
      });
      
      // Clear session cart
      req.session.cart = [];
    }
    
    // Destroy session (user will use JWT now)
    req.session.destroy();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token, 
      user: { id: user._id, email: user.email },
      message: 'Registration successful'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token, 
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## Routes

```javascript
// routes/cart.js
const express = require('express');
const router = express.Router();
const optionalAuth = require('../middleware/optionalAuth');
const cartController = require('../controllers/cartController');

router.use(optionalAuth);
router.post('/add', cartController.addToCart);
router.get('/', cartController.getCart);
router.delete('/remove/:productId', cartController.removeFromCart);

module.exports = router;
```

```javascript
// routes/checkout.js
const express = require('express');
const router = express.Router();
const optionalAuth = require('../middleware/optionalAuth');
const checkoutController = require('../controllers/checkoutController');

router.use(optionalAuth);
router.post('/', checkoutController.processCheckout);

module.exports = router;
```

```javascript
// routes/auth.js
const express = require('express');
const router = express.Router();
const optionalAuth = require('../middleware/optionalAuth');
const authController = require('../controllers/authController');

router.post('/register', optionalAuth, authController.register);
router.post('/login', authController.login);

module.exports = router;
```

---

## Walkthrough Example

### Scenario 1: Guest User

```javascript
// 1. Guest adds item to cart
POST /api/cart/add
Cookie: guest.sid=abc123...
Body: { "productId": "prod_123", "quantity": 2 }

→ req.user = null
→ if (req.user) → FALSE
→ req.session.cart.push(...)
→ Saved to MongoDB 'sessions' collection

// 2. Guest gets cart
GET /api/cart
Cookie: guest.sid=abc123...

→ req.user = null
→ if (req.user) → FALSE
→ Returns req.session.cart

// 3. Guest checks out
POST /api/checkout
Cookie: guest.sid=abc123...
Body: { 
  "email": "guest@example.com",
  "shippingAddress": {...},
  "paymentMethod": "card"
}

→ req.user = null
→ if (req.user) → FALSE
→ Validates email required
→ Gets cart from req.session.cart
→ Creates order with guestEmail
→ Clears req.session.cart = []
```

### Scenario 2: Authenticated User

```javascript
// 1. User adds item to cart
POST /api/cart/add
Authorization: Bearer eyJhbGci...
Body: { "productId": "prod_456", "quantity": 1 }

→ req.user = { id: "user_123", email: "user@example.com" }
→ if (req.user) → TRUE
→ Cart.findOneAndUpdate({ userId: "user_123" }, ...)
→ Saved to MongoDB 'carts' collection

// 2. User gets cart
GET /api/cart
Authorization: Bearer eyJhbGci...

→ req.user = { id: "user_123" }
→ if (req.user) → TRUE
→ Cart.findOne({ userId: "user_123" })

// 3. User checks out
POST /api/checkout
Authorization: Bearer eyJhbGci...
Body: { 
  "shippingAddress": {...},
  "paymentMethod": "card"
}

→ req.user = { id: "user_123" }
→ if (req.user) → TRUE
→ Email not required (has user account)
→ Gets cart from database
→ Creates order with userId
→ Clears database cart
```

### Scenario 3: Guest Registers (Migration)

```javascript
// 1. Guest has items in cart
req.session.cart = [
  { productId: "prod_789", quantity: 2 }
]

// 2. Guest registers
POST /api/register
Cookie: guest.sid=abc123...
Body: { 
  "email": "newuser@example.com",
  "password": "password123"
}

→ Creates user in database
→ if (req.session.cart.length > 0) → TRUE
→ Cart.create({ userId: user._id, items: req.session.cart })
→ req.session.destroy() (deletes session from MongoDB)
→ Returns JWT token

// 3. Now user is authenticated
→ Future requests use JWT token
→ Cart is in 'carts' collection
→ No more sessions
```

---

## The Pattern

```javascript
// This pattern is used everywhere:

if (req.user) {
  // User is authenticated (has JWT token)
  // → Use DATABASE ('carts' collection)
} else {
  // User is guest (no JWT token)
  // → Use SESSION ('sessions' collection)
}
```

---

## Complete Flow: Guest to Registered User

### Step-by-Step Example

```
1. Guest adds items to cart
   POST /api/cart/add (no JWT token)
   → Saved to req.session.cart
   → MongoDB sessions collection

2. Guest proceeds to checkout
   POST /api/checkout (no JWT token)
   Body: { email: "guest@example.com", shippingAddress: {...} }
   → Order created with guestEmail
   → req.session.cart cleared

3. Guest creates account
   POST /api/register
   Body: { email: "guest@example.com", password: "..." }
   → Migrate session cart to user cart
   → Destroy session
   → Return JWT token

4. User logs in next time
   POST /api/login (with JWT token)
   → No more sessions
   → Everything in database now
```

### Registration with Cart Migration

```javascript
// controllers/authController.js

exports.register = async (req, res) => {
  const { email, password } = req.body;
  
  // Create user account
  const user = await User.create({ email, password });
  
  // Migrate guest cart to user account
  if (req.session.cart && req.session.cart.length > 0) {
    await Cart.create({
      userId: user._id,
      items: req.session.cart
    });
    
    // Clear session cart
    req.session.cart = [];
  }
  
  // Destroy session (user will use JWT now)
  req.session.destroy(); // removes it from mongoDb but you need to manually clear the cookie
  
  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({ token, user });
};
```

---

## Schemas for Guest Support

```javascript
// models/Order.js
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,  // Optional - null for guests
    default: null
  },
  guestEmail: {
    type: String,
    required: false  // Required only for guest orders
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number
  }],
  shippingAddress: Object,
  totalAmount: Number,
  status: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
```

---

## Quick Reference

### Session Lifecycle

| Event | What Happens |
|-------|--------------|
| **First visit** | Session created in MongoDB + cookie sent |
| **Return visit (< 7 days)** | Session loaded from MongoDB |
| **After 7 days** | Session expired, new one created on next visit |
| **User registers** | Session destroyed, JWT used instead |

### Data Storage

| User Type | Cart Storage | Authentication |
|-----------|-------------|----------------|
| **Guest** | `sessions` collection (temporary) | None (cookie only) |
| **JWT User** | `carts` collection (permanent) | JWT token |

### The Pattern

```javascript
if (req.user) {
  // Has JWT token → use database
} else {
  // No JWT token → use session
}
```

---

## Summary

**Sessions for guests:**
1. ✅ Created automatically on first visit
2. ✅ Stored in MongoDB `sessions` collection
3. ✅ Expire after 7 days of inactivity
4. ✅ Perfect for guest carts before registration
5. ✅ Work alongside JWT for authenticated users

**Remember:**
- Sessions = temporary guest data
- JWT = permanent authenticated users
- Same routes handle both with `optionalAuth`