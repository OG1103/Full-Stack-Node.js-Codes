# Sequelize — Associations (Relationships)

Associations define **relationships between tables** using foreign keys. Sequelize provides methods to define, query, and manage these relationships without writing raw SQL JOINs.

---

## 1. Association Types

| Type | SQL Relationship | Example |
|------|-----------------|---------|
| `hasOne` | One-to-One | User has one Profile |
| `belongsTo` | One-to-One (reverse) | Profile belongs to User |
| `hasMany` | One-to-Many | User has many Posts |
| `belongsToMany` | Many-to-Many | User belongs to many Groups |

### The Rule: Define Both Sides

Always define **both sides** of a relationship. This enables Sequelize to generate proper JOINs and navigation methods:

```javascript
// One side alone is not enough
User.hasMany(Post);              // User → Posts (partial)
Post.belongsTo(User);           // Post → User (completes the pair)
```

---

## 2. One-to-One — `hasOne` + `belongsTo`

A single record in one table relates to a single record in another table.

### Setup

```javascript
// models/User.js
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false },
});

// models/Profile.js
const Profile = sequelize.define('Profile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  bio: DataTypes.TEXT,
  avatarUrl: DataTypes.STRING,
  userId: { type: DataTypes.INTEGER, allowNull: false },  // Foreign key
});
```

### Define Associations

```javascript
// User has one Profile — FK is on the Profile table
User.hasOne(Profile, {
  foreignKey: 'userId',    // Column in the Profile table
  as: 'profile',           // Alias for include/query
  onDelete: 'CASCADE',     // Delete profile when user is deleted
});

// Profile belongs to User — reverse navigation
Profile.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});
```

### How It Works

- `hasOne` — "The other table has a FK pointing to me"
- `belongsTo` — "I have a FK pointing to the other table"
- The **foreign key lives on the target** of `hasOne` (Profile table)

### Creating Related Data

```javascript
const user = await User.create({ username: 'john_doe' });

// Option 1: Provide the FK manually
await Profile.create({ bio: 'Software Engineer', userId: user.id });

// Option 2: Use the auto-generated method
const profile = await user.createProfile({ bio: 'Software Engineer' });
```

### Querying with Include (JOIN)

```javascript
// Get user with their profile
const user = await User.findOne({
  where: { username: 'john_doe' },
  include: {
    model: Profile,
    as: 'profile',              // Must match the alias in the association
    attributes: ['bio', 'avatarUrl'],
  },
});

// Result:
// {
//   id: 1,
//   username: 'john_doe',
//   profile: {
//     bio: 'Software Engineer',
//     avatarUrl: 'https://...'
//   }
// }
```

### Auto-Generated Methods

After defining `User.hasOne(Profile)`, Sequelize adds these methods to User instances:

| Method | Description |
|--------|-------------|
| `user.getProfile()` | Get the associated profile |
| `user.setProfile(profile)` | Set the association |
| `user.createProfile({})` | Create a profile for this user |

---

## 3. One-to-Many — `hasMany` + `belongsTo`

A single record in one table relates to multiple records in another table.

### Setup

```javascript
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false },
});

const Post = sequelize.define('Post', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: DataTypes.TEXT,
  authorId: { type: DataTypes.INTEGER, allowNull: false },  // Foreign key
});
```

### Define Associations

```javascript
// User has many Posts
User.hasMany(Post, {
  foreignKey: 'authorId',
  as: 'posts',
  onDelete: 'CASCADE',     // Delete all posts when user is deleted
});

// Post belongs to User
Post.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
});
```

### Creating Related Data

```javascript
const user = await User.create({ username: 'john_doe' });

// Option 1: Provide FK
await Post.create({ title: 'First Post', content: 'Hello!', authorId: user.id });

// Option 2: Auto-generated method
await user.createPost({ title: 'Second Post', content: 'World!' });

// Create multiple
await Post.bulkCreate([
  { title: 'Post 1', content: '...', authorId: user.id },
  { title: 'Post 2', content: '...', authorId: user.id },
]);
```

### Querying

```javascript
// User with all their posts
const user = await User.findOne({
  where: { username: 'john_doe' },
  include: {
    model: Post,
    as: 'posts',
    attributes: ['id', 'title', 'createdAt'],
  },
});
// user.posts = [{ id: 1, title: 'First Post', ... }, ...]

// Post with its author
const post = await Post.findByPk(1, {
  include: {
    model: User,
    as: 'author',
    attributes: ['username', 'email'],
  },
});
// post.author = { username: 'john_doe', email: '...' }

// Count user's posts
const postCount = await user.countPosts();

// Check if user has a specific post
const hasPost = await user.hasPost(somePost);
```

### Auto-Generated Methods

After `User.hasMany(Post)`:

| Method | Description |
|--------|-------------|
| `user.getPosts()` | Get all posts |
| `user.countPosts()` | Count posts |
| `user.hasPosts(posts)` | Check if association exists |
| `user.setPosts(posts)` | Replace all posts |
| `user.addPost(post)` | Add a post |
| `user.addPosts([posts])` | Add multiple posts |
| `user.removePost(post)` | Remove a post |
| `user.removePosts([posts])` | Remove multiple posts |
| `user.createPost({})` | Create and associate a post |

---

## 4. Many-to-Many — `belongsToMany`

Multiple records in one table relate to multiple records in another table, through a **junction (join) table**.

### Setup

```javascript
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false },
});

const Group = sequelize.define('Group', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
});
```

### Define Associations

```javascript
// Many-to-Many through a junction table
User.belongsToMany(Group, {
  through: 'UserGroups',    // Junction table name (auto-created)
  as: 'groups',
  foreignKey: 'userId',
});

Group.belongsToMany(User, {
  through: 'UserGroups',
  as: 'members',
  foreignKey: 'groupId',
});
```

This creates a `UserGroups` table with columns `userId` and `groupId`.

### With a Custom Junction Model

```javascript
const UserGroup = sequelize.define('UserGroup', {
  role: {
    type: DataTypes.ENUM('member', 'admin', 'owner'),
    defaultValue: 'member',
  },
  joinedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

User.belongsToMany(Group, { through: UserGroup, as: 'groups', foreignKey: 'userId' });
Group.belongsToMany(User, { through: UserGroup, as: 'members', foreignKey: 'groupId' });
```

### Creating Relationships

```javascript
const user = await User.create({ username: 'john_doe' });
const group = await Group.create({ name: 'Admins' });

// Add user to group
await user.addGroup(group);

// With junction table data
await user.addGroup(group, { through: { role: 'admin' } });

// Add multiple groups
const [group1, group2] = await Group.bulkCreate([
  { name: 'Developers' },
  { name: 'Managers' },
]);
await user.addGroups([group1, group2]);
```

### Querying

```javascript
// User with their groups
const user = await User.findOne({
  where: { username: 'john_doe' },
  include: {
    model: Group,
    as: 'groups',
    through: { attributes: ['role'] },    // Include junction table fields
  },
});
// user.groups = [
//   { id: 1, name: 'Admins', UserGroup: { role: 'admin' } },
//   { id: 2, name: 'Developers', UserGroup: { role: 'member' } },
// ]

// Group with its members
const group = await Group.findOne({
  where: { name: 'Admins' },
  include: {
    model: User,
    as: 'members',
    attributes: ['id', 'username'],
    through: { attributes: [] },   // Exclude junction table fields
  },
});
```

### Auto-Generated Methods

After `User.belongsToMany(Group)`:

| Method | Description |
|--------|-------------|
| `user.getGroups()` | Get all groups |
| `user.countGroups()` | Count groups |
| `user.hasGroup(group)` | Check membership |
| `user.setGroups([groups])` | Replace all groups |
| `user.addGroup(group)` | Add to a group |
| `user.removeGroup(group)` | Remove from a group |
| `user.createGroup({})` | Create and add to group |

---

## 5. Nested Includes (Deep JOINs)

```javascript
// Post → Author → Profile, Post → Comments → Commenter
const posts = await Post.findAll({
  include: [
    {
      model: User,
      as: 'author',
      attributes: ['username', 'email'],
      include: {
        model: Profile,
        as: 'profile',
        attributes: ['avatarUrl'],
      },
    },
    {
      model: Comment,
      as: 'comments',
      attributes: ['content', 'createdAt'],
      include: {
        model: User,
        as: 'commenter',
        attributes: ['username'],
      },
    },
  ],
  order: [['createdAt', 'DESC']],
});
```

---

## 6. Eager vs Lazy Loading

### Eager Loading (include) — Load at Query Time

```javascript
// Loads user AND posts in one query
const user = await User.findByPk(1, {
  include: { model: Post, as: 'posts' },
});
```

### Lazy Loading — Load on Demand

```javascript
// Load user first
const user = await User.findByPk(1);

// Load posts separately when needed
const posts = await user.getPosts();
```

**Eager loading** is preferred for API responses (fewer queries). **Lazy loading** is useful when you conditionally need related data.

---

## 7. Where to Define Associations

Define associations in a **central index file** after importing all models, not inside individual model files (avoids circular imports):

```javascript
// models/index.js
import User from './User.js';
import Profile from './Profile.js';
import Post from './Post.js';
import Comment from './Comment.js';
import Group from './Group.js';

// One-to-One
User.hasOne(Profile, { foreignKey: 'userId', as: 'profile', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// One-to-Many
User.hasMany(Post, { foreignKey: 'authorId', as: 'posts', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'commenter' });

// Many-to-Many
User.belongsToMany(Group, { through: 'UserGroups', as: 'groups', foreignKey: 'userId' });
Group.belongsToMany(User, { through: 'UserGroups', as: 'members', foreignKey: 'groupId' });

export { User, Profile, Post, Comment, Group };
```

---

## 8. Summary

| Association | Method | FK Location | Use Case |
|-------------|--------|------------|----------|
| One-to-One | `hasOne` + `belongsTo` | Target table | User ↔ Profile |
| One-to-Many | `hasMany` + `belongsTo` | "Many" table | User → Posts |
| Many-to-Many | `belongsToMany` (both) | Junction table | Users ↔ Groups |

### Key Points

1. **Always define both sides** of a relationship (`hasMany` + `belongsTo`)
2. The `as` alias in the association **must match** the `as` in `include` queries
3. Specify `foreignKey` explicitly for clarity
4. Use `onDelete: 'CASCADE'` to auto-delete children when parent is removed
5. Define all associations in a **central file** to avoid circular imports
6. Use `through: { attributes: [] }` to hide junction table fields
7. Prefer **eager loading** (`include`) over lazy loading for API responses
