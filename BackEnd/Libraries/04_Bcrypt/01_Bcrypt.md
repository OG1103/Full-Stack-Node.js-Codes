# Bcrypt

Bcrypt is a password hashing library that securely converts plain-text passwords into irreversible hashes. It uses **salting** (adding random data) and **adaptive hashing** (configurable cost factor) to protect against brute-force and rainbow table attacks.

---

## 1. Installation

```bash
npm install bcryptjs
```

> `bcryptjs` is a pure JavaScript implementation (no native dependencies). You can also use `bcrypt` (native C++ bindings, faster but requires build tools).

---

## 2. Core Concepts

### Hashing vs Encryption

| Feature | Hashing | Encryption |
|---------|---------|------------|
| Direction | One-way (irreversible) | Two-way (reversible) |
| Purpose | Verify data integrity | Protect data confidentiality |
| Use case | Passwords | Sensitive data (credit cards, messages) |
| Can recover original? | No | Yes (with the key) |

### What is a Salt?

A **salt** is a random string added to the password before hashing. It ensures that the same password produces **different hashes** each time.

```
Password: "mypassword"
Salt 1:   "$2b$10$abcdef..."  →  Hash: "$2b$10$abcdef...xyz123"
Salt 2:   "$2b$10$ghijkl..."  →  Hash: "$2b$10$ghijkl...abc456"
```

Without salting, identical passwords would produce identical hashes, making them vulnerable to rainbow table attacks.

### Salt Rounds (Cost Factor)

The **salt rounds** parameter controls how many times the hashing algorithm runs. Higher values = slower hashing = harder to crack.

| Salt Rounds | Approximate Time | Use Case |
|-------------|-----------------|----------|
| 8 | ~40ms | Testing |
| 10 | ~100ms | Standard (recommended) |
| 12 | ~300ms | High security |
| 14 | ~1s | Maximum practical security |

**Recommendation:** Use **10** salt rounds. It balances security and performance.

---

## 3. Hashing a Password (Async)

```javascript
import bcrypt from 'bcryptjs';

const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

// Example
const hashed = await hashPassword('mypassword123');
console.log(hashed);
// "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```

### How `bcrypt.hash()` Works

```javascript
bcrypt.hash(data, saltRounds);
// 1. Generates a random salt using the specified number of rounds
// 2. Combines the salt with the password
// 3. Runs the bcrypt algorithm
// 4. Returns the hash (includes the salt embedded in it)
```

### Two-Step Approach (Manual Salt)

```javascript
const salt = await bcrypt.genSalt(10);       // Generate salt separately
const hash = await bcrypt.hash('password', salt);  // Hash with the salt
```

Both approaches produce the same result. The single-step `bcrypt.hash(data, saltRounds)` is simpler and recommended.

---

## 4. Comparing a Password (Async)

```javascript
const comparePassword = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
};

// Example
const isMatch = await comparePassword('mypassword123', hashedFromDB);
console.log(isMatch); // true or false
```

### How `bcrypt.compare()` Works

```javascript
bcrypt.compare(plainPassword, hashedPassword);
// 1. Extracts the salt from the stored hash
// 2. Hashes the plain password with that same salt
// 3. Compares the result with the stored hash
// 4. Returns true if they match, false otherwise
```

You **never** decrypt a hash. You always hash the input and compare.

---

## 5. Synchronous Methods

Bcrypt also provides synchronous versions (blocks the event loop — avoid in production):

```javascript
// Hash (sync)
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('mypassword123', salt);

// Or one-step
const hash2 = bcrypt.hashSync('mypassword123', 10);

// Compare (sync)
const isMatch = bcrypt.compareSync('mypassword123', hash);
```

**Use async methods** (`hash`, `compare`) in production to avoid blocking the event loop.

---

## 6. Using with Mongoose

### In a Pre-Save Hook

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
```

### Using in Controllers

```javascript
// Registration
const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.create({ email, password });
  // Password is automatically hashed by the pre-save hook

  res.status(201).json({ message: 'User created' });
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ message: 'Login successful' });
};
```

---

## 7. The Hash Format

A bcrypt hash looks like this:

```
$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
 ^^  ^^  ^^^^^^^^^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 |   |   Salt (22 chars)         Hash (31 chars)
 |   Cost factor (10 rounds)
 Algorithm version (2b)
```

The salt is **embedded** in the hash string, which is why `bcrypt.compare()` can extract it for comparison.

---

## 8. Summary

| Method | Purpose | Async? |
|--------|---------|--------|
| `bcrypt.hash(password, saltRounds)` | Hash a password | Yes |
| `bcrypt.compare(password, hash)` | Compare password to hash | Yes |
| `bcrypt.genSalt(saltRounds)` | Generate a salt separately | Yes |
| `bcrypt.hashSync(password, salt)` | Hash (synchronous) | No |
| `bcrypt.compareSync(password, hash)` | Compare (synchronous) | No |

### Key Points

1. **Never store plain-text passwords** — always hash with bcrypt
2. **Use 10 salt rounds** as the default cost factor
3. **Use async methods** in production to avoid blocking
4. **Use `isModified('password')`** in Mongoose pre-save hooks to avoid re-hashing
5. **Never decrypt** — hash the input and compare with `bcrypt.compare()`
