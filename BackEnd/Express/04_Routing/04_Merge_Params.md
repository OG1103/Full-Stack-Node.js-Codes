# mergeParams in Express

## 1. What is mergeParams?

`mergeParams` is a router option that allows a **child router** to access route parameters defined in its **parent router**. By default, parent parameters are **not available** in child routers.

```javascript
const router = express.Router({ mergeParams: true });
```

---

## 2. The Problem: Without mergeParams

When you nest routers, the child router cannot access the parent's route parameters:

```javascript
import express from 'express';
const app = express();
const userRouter = express.Router();
const postRouter = express.Router(); // No mergeParams

// Parent router defines :userId
userRouter.use('/:userId/posts', postRouter);

// Child router tries to access :userId
postRouter.get('/', (req, res) => {
  res.json({ userId: req.params.userId }); // undefined!
});

app.use('/users', userRouter);
app.listen(3000);
```

**Request**: `GET /users/123/posts`
**Response**: `{ "userId": undefined }`

The `userId` parameter is defined in the parent router's mount path, but it is not passed down to the child router.

---

## 3. The Solution: With mergeParams

Enable `mergeParams: true` when creating the child router:

```javascript
import express from 'express';
const app = express();
const userRouter = express.Router();
const postRouter = express.Router({ mergeParams: true }); // Enable mergeParams

userRouter.use('/:userId/posts', postRouter);

postRouter.get('/', (req, res) => {
  res.json({ userId: req.params.userId }); // "123" - accessible now
});

postRouter.get('/:postId', (req, res) => {
  const { userId, postId } = req.params; // Both available
  res.json({ userId, postId });
});

app.use('/users', userRouter);
app.listen(3000);
```

**Request**: `GET /users/123/posts`
**Response**: `{ "userId": "123" }`

**Request**: `GET /users/123/posts/456`
**Response**: `{ "userId": "123", "postId": "456" }`

---

## 4. Real-World Example

A nested REST API for users and their reviews:

```javascript
// routes/reviews.js
import express from 'express';
const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.get('/', async (req, res) => {
  const { userId } = req.params;
  const reviews = await Review.find({ user: userId });
  res.json({ reviews });
});

reviewRouter.post('/', async (req, res) => {
  const { userId } = req.params;
  const review = await Review.create({ user: userId, ...req.body });
  res.status(201).json({ review });
});

export default reviewRouter;

// routes/users.js
import express from 'express';
import reviewRouter from './reviews.js';
const userRouter = express.Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:userId', getUser);

// Mount review routes under /:userId/reviews
userRouter.use('/:userId/reviews', reviewRouter);

export default userRouter;

// app.js
app.use('/api/users', userRouter);
// GET /api/users/42/reviews     -> reviewRouter has access to userId = "42"
// POST /api/users/42/reviews    -> reviewRouter has access to userId = "42"
```

---

## 5. When to Use mergeParams

### Use When:
- You have **nested routers** that need parent route parameters
- You are building a **modular route structure** with related resources
- You want clear **separation of concerns** while maintaining parameter access

### Don't Use When:
- The child router does **not need** parent parameters
- You are working with **independent routers** that don't share parameters

---

## 6. Summary

| Feature | Without `mergeParams` | With `mergeParams: true` |
|---------|----------------------|--------------------------|
| Parent params in child | `undefined` | Available in `req.params` |
| Nested router support | Params are isolated | Params are merged |
| Use case | Independent routers | Related nested resources |
