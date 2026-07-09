## NoSQL Injection (MongoDB)

### What is it

Injection attacks happen when **user-supplied input is treated as a query operator** instead of plain data. In MongoDB, this is called NoSQL injection.

In SQL databases, attackers inject SQL strings. In MongoDB, attackers inject **query objects** — they send a JSON body with MongoDB operators like `$gt`, `$ne`, or `$where` to manipulate your query logic.

**Classic example — login bypass:**

If your login code passes `req.body.email` directly into a Mongoose query and the attacker sends `{ "$ne": null }` as the email, MongoDB interprets this as "find a user where email is not null" — matching the first user in the collection. The attacker is now logged in as that user without knowing any credentials.

```
Normal request body:
  { "email": "alice@example.com", "password": "secret" }

Injection attack body:
  { "email": { "$ne": null }, "password": { "$ne": null } }

Your query becomes:
  User.findOne({ email: { $ne: null }, password: { $ne: null } })
  → matches the first user in the collection → attacker is logged in
```

### Example

```js
// ❌ BROKEN — passes user input directly into the query
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // If email = { "$ne": null }, this becomes:
  // User.findOne({ email: { $ne: null }, password: ... })
  const user = await User.findOne({ email, password });

  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({ token: generateToken(user) });
});


// ❌ BROKEN — $where with user input (extremely dangerous)
app.get('/users/search', async (req, res) => {
  const users = await User.find({
    $where: `this.username == "${req.query.q}"` // ← executes JS on the DB server
  });
  res.json(users);
});
```

### Solution

**Fix 1 — Validate and enforce data types:**

The simplest defense: if you expect a string, ensure it is a string before it touches your query. An object like `{ $ne: null }` is not a string — reject it early.

```js
// ✅ FIXED — type check before using in query
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Reject if not a plain string
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({ token: generateToken(user) });
});
```

**Fix 2 — Use a validation library (express-validator or Joi):**

```bash
npm install express-validator
```

```js
const { body, validationResult } = require('express-validator');

// ✅ FIXED — validate schema before route handler runs
app.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),           // must be a valid email string
    body('password').isString().isLength({ min: 8 }),   // must be a string, min 8 chars
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    // At this point, email and password are guaranteed to be valid strings
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ token: generateToken(user) });
  }
);
```

**Fix 3 — Use `mongo-sanitize` to strip operator keys from input:**

```bash
npm install mongo-sanitize
```

```js
const sanitize = require('mongo-sanitize');

// ✅ FIXED — strip any keys starting with $ from user input
app.post('/login', async (req, res) => {
  // sanitize removes keys like $ne, $gt, $where from the input object
  const { email, password } = sanitize(req.body);

  const user = await User.findOne({ email });
  // ...
});

// Apply globally as middleware for all routes
app.use((req, res, next) => {
  req.body   = sanitize(req.body);
  req.query  = sanitize(req.query);
  req.params = sanitize(req.params);
  next();
});
```

**Fix 4 — Never use `$where` with user input:**

```js
// ❌ Never do this
User.find({ $where: `this.username == "${req.query.q}"` });

// ✅ Use a normal query operator instead
User.find({ username: req.query.q }); // with type validation applied first
```

### When to use each solution

| Solution | When to use it |
|---|---|
| **Type checking** | Always, as a first line of defense. Fast, zero dependencies, catches the most common injection vectors. |
| **Validation library (Joi / express-validator)** | For any endpoint that accepts user input. Validates shape, type, and format before any query runs. |
| **`mongo-sanitize`** | Use as a global middleware layer in addition to validation. Provides a safety net that strips operators from any input that slips through. |
| **Avoid `$where`** | Always. Never pass user input into `$where` or any operator that evaluates JavaScript. Use standard query operators instead. |
