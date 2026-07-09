## Broken Access Control

### What is it

Broken access control happens when your API **does not properly check that the requesting user has permission** to perform an action or access a resource. A user can access, modify, or delete data that belongs to another user — or perform admin actions without admin privileges.

This is the #1 vulnerability on the OWASP Top 10 list.

**Two main types:**

1. **Horizontal privilege escalation** — a regular user accesses another regular user's data.
   - User A views or deletes User B's orders just by changing the ID in the URL.

2. **Vertical privilege escalation** — a regular user performs an admin action.
   - A normal user hits an admin endpoint that does not check for the admin role.

```
Horizontal attack:
  User A is logged in. Their order ID is 111.
  They change the URL to /orders/222 (User B's order).
  Server returns User B's order — no permission check was done.

Vertical attack:
  Normal user hits DELETE /admin/users/999
  Server deletes the user — no admin role check was done.
```

### Example

```js
// ❌ BROKEN — no ownership check (horizontal escalation)
app.get('/orders/:id', authenticate, async (req, res) => {
  const order = await Order.findById(req.params.id);
  // Returns ANY order — attacker can enumerate all order IDs and read everyone's orders
  res.json(order);
});


// ❌ BROKEN — no role check (vertical escalation)
app.delete('/admin/users/:id', authenticate, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  // Any logged-in user can delete anyone — no admin check
  res.json({ success: true });
});


// ❌ BROKEN — user can update any profile, not just their own
app.put('/users/:id', authenticate, async (req, res) => {
  const { name, bio } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { name, bio }, { new: true });
  res.json(user);
});
```

### Solution

**Fix 1 — Ownership check (does this resource belong to the requesting user?):**

Always include the `userId` from the authenticated token in your query. If the resource does not belong to the user, the query returns nothing.

```js
// ✅ FIXED — ownership enforced in the query
app.get('/orders/:id', authenticate, async (req, res) => {
  const order = await Order.findOne({
    _id:    req.params.id,
    userId: req.user.id, // ← only match if this order belongs to the logged-in user
  });

  if (!order) {
    // Return 404 (not 403) — do not reveal that the resource exists
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
});


// ✅ FIXED — user can only update their own profile
app.put('/users/:id', authenticate, async (req, res) => {
  // Ensure the ID in the URL matches the authenticated user's ID
  if (req.params.id !== req.user.id.toString()) {
    return res.status(403).json({ error: 'You can only update your own profile' });
  }

  const { name, bio } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, bio }, { new: true });
  res.json(user);
});
```

**Fix 2 — Role check middleware (is this user an admin?):**

Create a reusable middleware that checks the user's role before allowing access to protected routes.

```js
// ✅ Role-checking middleware
function requireRole(...roles) {
  return (req, res, next) => {
    // req.user is set by the authenticate middleware
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
}

// Usage — chain after authenticate
app.delete(
  '/admin/users/:id',
  authenticate,              // 1. verify the JWT and set req.user
  requireRole('admin'),      // 2. check that req.user.role === 'admin'
  async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  }
);

// Multiple roles allowed
app.get(
  '/reports',
  authenticate,
  requireRole('admin', 'moderator'), // either admin or moderator can access
  async (req, res) => {
    const reports = await Report.find().lean();
    res.json(reports);
  }
);
```

**Full example — combining ownership check + role check:**

```js
// ✅ FIXED — complete access control for a comment system
app.delete('/comments/:id', authenticate, async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  const isOwner = comment.userId.toString() === req.user.id.toString();
  const isAdmin = req.user.role === 'admin';

  // Allow deletion only if user owns the comment OR user is an admin
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }

  await comment.deleteOne();
  res.json({ success: true });
});
```

**Fix 3 — Never expose internal IDs that allow enumeration:**

```js
// ❌ Attacker can try /orders/1, /orders/2, /orders/3 to enumerate all orders
app.get('/orders/:id', authenticate, async (req, res) => { ... });

// ✅ MongoDB ObjectIDs are non-sequential and hard to guess — but still check ownership
// For extra protection, you can use UUIDs or slugs as public identifiers
const orderSchema = new mongoose.Schema({
  publicId: { type: String, default: () => crypto.randomUUID(), index: true, unique: true },
  userId:   mongoose.Schema.Types.ObjectId,
  // ...
});

app.get('/orders/:publicId', authenticate, async (req, res) => {
  const order = await Order.findOne({
    publicId: req.params.publicId,
    userId:   req.user.id, // ownership check still required
  });
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
});
```

### When to use each solution

| Solution | When to use it |
|---|---|
| **Ownership check in query** | On every endpoint that returns or modifies a user-specific resource. Include the user's ID from the token in the query filter — not just as an afterthought check. |
| **Role middleware** | On every admin or privileged endpoint. Create a reusable `requireRole()` middleware and attach it to every sensitive route. |
| **Return 404 instead of 403** | When the resource exists but does not belong to the user. Returning 403 tells the attacker the resource exists. 404 reveals nothing. |
| **Non-sequential public IDs** | When resources are referenced publicly in URLs. MongoDB ObjectIDs are already hard to guess, but UUIDs or slugs add an extra layer. Always combine with ownership checks. |
