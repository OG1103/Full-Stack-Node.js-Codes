# Mongoose — Instance Methods & Statics

Instance methods operate on **individual documents** (instances of a model). Static methods operate on the **model itself** (the collection). Both allow you to encapsulate reusable logic within your schema.

---

## 1. Instance Methods

Defined on `schema.methods`. Available on every document instance.

### Defining Instance Methods

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: { type: String, select: false },
  loginAttempts: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false },
});

// Simple instance method
userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
  };
};

// Async instance method
userSchema.methods.comparePassword = async function (candidatePassword) {
  // 'this' refers to the document
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method that modifies and saves the document
userSchema.methods.incrementLoginAttempts = async function () {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.isLocked = true;
  }
  return await this.save();
};

const User = mongoose.model('User', userSchema);
```

### Using Instance Methods

```javascript
// Find a user (include password since it's select: false)
const user = await User.findOne({ email: 'john@example.com' }).select('+password');

// Use instance methods
const profile = user.getPublicProfile();
// { id: '...', name: 'John', email: 'john@example.com' }

const isMatch = await user.comparePassword('mypassword123');
// true or false

await user.incrementLoginAttempts();
// loginAttempts incremented and saved
```

### `this` in Instance Methods

`this` refers to the **document** the method is called on:

```javascript
userSchema.methods.greet = function () {
  return `Hello, I'm ${this.name}`;  // this.name = document's name field
};
```

**Important:** Do NOT use arrow functions for instance methods — they don't bind `this`:

```javascript
// WRONG — arrow function loses 'this'
userSchema.methods.greet = () => {
  return `Hello, I'm ${this.name}`;  // 'this' is NOT the document
};

// CORRECT — regular function
userSchema.methods.greet = function () {
  return `Hello, I'm ${this.name}`;
};
```

---

## 2. Static Methods

Defined on `schema.statics`. Called on the **Model** (not on document instances).

### Defining Static Methods

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, enum: ['admin', 'user', 'moderator'] },
  isActive: { type: Boolean, default: true },
});

// Find by email (common pattern)
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });  // 'this' = the Model
};

// Find all users with a specific role
userSchema.statics.findByRole = function (role) {
  return this.find({ role });
};

// Get active user count
userSchema.statics.getActiveCount = async function () {
  return await this.countDocuments({ isActive: true });
};

// Complex static with aggregation
userSchema.statics.getUserStats = async function () {
  return await this.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

const User = mongoose.model('User', userSchema);
```

### Using Static Methods

```javascript
// Called on the Model, not on a document
const user = await User.findByEmail('john@example.com');

const admins = await User.findByRole('admin');

const activeCount = await User.getActiveCount();

const stats = await User.getUserStats();
// [{ _id: 'user', count: 150 }, { _id: 'admin', count: 5 }]
```

### `this` in Static Methods

`this` refers to the **Model** (not a document):

```javascript
userSchema.statics.search = function (query) {
  return this.find({                // this = User model
    name: { $regex: query, $options: 'i' },
  });
};

// Usage: User.search('john')
```

---

## 3. Instance vs Static Methods

| Feature | Instance Methods | Static Methods |
|---------|-----------------|----------------|
| Defined on | `schema.methods` | `schema.statics` |
| Called on | Document instance | Model |
| `this` refers to | The document | The Model |
| Use case | Operations on one doc | Collection-level queries |
| Example | `user.comparePassword()` | `User.findByEmail()` |

---

## 4. Practical Patterns

### Authentication Helper

```javascript
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: 'user' },
});

// Instance: Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance: Generate JWT
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Static: Login method
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Invalid credentials');

  return user;
};

// Usage:
const user = await User.login('john@example.com', 'password123');
const token = user.generateAuthToken();
```

### Soft Delete Pattern

```javascript
const documentSchema = new mongoose.Schema({
  title: String,
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
});

// Instance: Soft delete
documentSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return await this.save();
};

// Instance: Restore
documentSchema.methods.restore = async function () {
  this.isDeleted = false;
  this.deletedAt = undefined;
  return await this.save();
};

// Static: Find only active documents
documentSchema.statics.findActive = function (filter = {}) {
  return this.find({ ...filter, isDeleted: false });
};
```

---

## 5. Query Helpers

Query helpers extend Mongoose's chainable query builder. They're like instance methods but for queries:

```javascript
userSchema.query.byRole = function (role) {
  return this.where({ role });
};

userSchema.query.active = function () {
  return this.where({ isActive: true });
};

// Usage — chainable:
const activeAdmins = await User.find().byRole('admin').active().sort({ name: 1 });
```

---

## 6. Summary

| Type | Definition | `this` | Called On |
|------|-----------|--------|----------|
| Instance method | `schema.methods.fn` | Document | `doc.fn()` |
| Static method | `schema.statics.fn` | Model | `Model.fn()` |
| Query helper | `schema.query.fn` | Query | `Model.find().fn()` |

### Key Points

1. **Never use arrow functions** — they break `this` binding
2. Instance methods are perfect for **document-level operations** (compare password, generate token)
3. Static methods are perfect for **collection-level queries** (find by email, get stats)
4. Query helpers enable **chainable query methods**
5. Both instance and static methods can be async
