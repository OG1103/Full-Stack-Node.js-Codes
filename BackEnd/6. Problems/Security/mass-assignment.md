## Mass Assignment

### What is it

Mass assignment happens when you take the **entire request body and pass it directly to a database update** without specifying which fields are allowed to be changed.

If a user can send any field they want and your code blindly applies all of them, they can modify fields they should never be able to touch — like `isAdmin`, `role`, `balance`, `verified`, or `passwordHash`.

```
Normal user update request:
  { "name": "Alice", "bio": "I love coding" }

Attack — user adds fields they should not control:
  { "name": "Alice", "bio": "I love coding", "isAdmin": true, "balance": 999999 }

If you do: User.findByIdAndUpdate(id, req.body) → ALL fields are applied, including isAdmin
```

No error is thrown. The attacker is now an admin.

### Example

```js
// ❌ BROKEN — passes entire req.body to update
app.put('/users/:id/profile', async (req, res) => {
  // req.body might contain: { name: "Alice", isAdmin: true, role: "admin", balance: 99999 }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});


// ❌ BROKEN — spread of req.body has the same problem
app.post('/users/register', async (req, res) => {
  const user = await User.create({ ...req.body }); // attacker can set isAdmin: true at registration
  res.json(user);
});
```

### Solution

**Fix 1 — Explicitly pick allowed fields (whitelist):**

Only ever pass the specific fields you want to allow. Ignore everything else in the request body.

```js
// ✅ FIXED — destructure only the fields users are allowed to update
app.put('/users/:id/profile', async (req, res) => {
  // Whitelist: only these fields can be changed by the user
  const { name, bio, avatarUrl } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, bio, avatarUrl }, // only whitelisted fields — isAdmin, role, etc. are ignored
    { new: true, runValidators: true }
  );

  res.json(user);
});


// ✅ FIXED — same for registration
app.post('/users/register', async (req, res) => {
  const { name, email, password } = req.body; // only pick what you need

  const user = await User.create({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 12),
    // isAdmin is NOT here — cannot be set at registration
    // role defaults to 'user' as set in the schema
  });

  res.json({ id: user._id, name: user.name, email: user.email });
});
```

**Fix 2 — Use a validation library to define the allowed shape:**

```bash
npm install joi
```

```js
const Joi = require('joi');

// Define exactly what shape the update body must have
const updateProfileSchema = Joi.object({
  name:      Joi.string().min(2).max(50),
  bio:       Joi.string().max(500).allow(''),
  avatarUrl: Joi.string().uri(),
  // Any key NOT listed here is rejected by Joi
});

// ✅ FIXED — validation middleware
app.put('/users/:id/profile', async (req, res) => {
  const { error, value } = updateProfileSchema.validate(req.body, {
    stripUnknown: true, // removes any keys not in the schema (isAdmin, role, etc.)
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ errors: error.details.map((d) => d.message) });
  }

  // 'value' only contains keys that were in the schema
  const user = await User.findByIdAndUpdate(req.params.id, value, { new: true });
  res.json(user);
});
```

**Fix 3 — Block sensitive fields at the schema level:**

Add a second layer of protection in Mongoose by marking fields that should never be set from user input.

```js
const userSchema = new mongoose.Schema({
  name:         String,
  email:        String,
  passwordHash: String,
  bio:          String,
  // Sensitive fields — always set programmatically, never from user input
  isAdmin:  { type: Boolean, default: false },
  role:     { type: String,  default: 'user', enum: ['user', 'moderator', 'admin'] },
  balance:  { type: Number,  default: 0 },
  verified: { type: Boolean, default: false },
});

// ✅ Strip sensitive fields before save in a pre-save hook (defense in depth)
userSchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate();
  // Remove sensitive fields from any update operation
  delete update.isAdmin;
  delete update.role;
  delete update.balance;
  delete update.verified;
});
```

**Fix 4 — Never return sensitive fields in responses:**

Even if a field cannot be written by users, do not send it back in the response. Use `.select()` to exclude sensitive fields.

```js
// ✅ Exclude sensitive fields from the response
const user = await User.findById(id)
  .select('-passwordHash -isAdmin -__v'); // - means exclude

res.json(user); // passwordHash and isAdmin never leave the server
```

### When to use each solution

| Solution | When to use it |
|---|---|
| **Explicit field destructuring** | Always, as a baseline. Never pass `req.body` directly to `.create()` or `.findByIdAndUpdate()`. This is the simplest and most readable fix. |
| **Joi / express-validator** | Use for any endpoint with structured input. Validates format AND strips unknown keys. Gives you clear error messages. |
| **Pre-save middleware (schema hook)** | Use as a defense-in-depth layer. Protects you even if a developer accidentally passes `req.body` somewhere — the hook strips dangerous fields before they reach the database. |
| **Response field exclusion (`.select()`)** | Always. Sensitive fields should never appear in API responses, even if they cannot be written. |
