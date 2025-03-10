# Understanding `mergeParams` in Express.js

## Introduction
In **Express.js**, `mergeParams` is an option that allows child routers to access route parameters from their parent routers. By default, parameters defined in a parent router are **not available** in child routers. Enabling `mergeParams` ensures that parameters from the parent router are **merged** into the child router’s `req.params` object.

## Syntax
To enable `mergeParams`, you must set it to `true` when creating a new router:

```javascript
const router = express.Router({ mergeParams: true });
```

## Why is `mergeParams` Needed?
By default, route parameters from a parent router **do not** propagate to child routers. This can cause issues when structuring routes in a modular way.

### **Example Without `mergeParams` (Fails)**
```javascript
const express = require('express');
const app = express();
const userRouter = express.Router();
const postRouter = express.Router(); // No mergeParams

// Parent Route
userRouter.use('/:userId/posts', postRouter);

// Child Route
postRouter.get('/', (req, res) => {
    res.send(`User ID: ${req.params.userId}`); // ❌ Undefined
});

app.use('/users', userRouter);
app.listen(3000, () => console.log('Server running on port 3000'));
```

### **Expected Request & Response:**
#### **Request:**
```sh
GET /users/123/posts
```

#### **Response:**
```sh
User ID: undefined
```
🔴 The `userId` parameter is **not available** inside `postRouter` because `mergeParams` is **not enabled**.

---

## **Example With `mergeParams` (Works)**
To fix this, we pass `{ mergeParams: true }` when creating `postRouter`.

```javascript
const express = require('express');
const app = express();
const userRouter = express.Router();
const postRouter = express.Router({ mergeParams: true }); // ✅ Enable mergeParams

// Parent Route
userRouter.use('/:userId/posts', postRouter);

// Child Route
postRouter.get('/', (req, res) => {
    res.send(`User ID: ${req.params.userId}`); // ✅ Now accessible
});

app.use('/users', userRouter);
app.listen(3000, () => console.log('Server running on port 3000'));
```

### **Expected Request & Response:**
#### **Request:**
```sh
GET /users/123/posts
```

#### **Response:**
```sh
User ID: 123
```
✅ Now, `req.params.userId` is available inside `postRouter`.

---

## **When to Use `mergeParams`**
### ✅ Use `mergeParams` when:
- You have **nested routers** that need access to **parent route parameters**.
- You are designing a **modular Express route structure**.
- You want **clear separation** of route responsibilities but still need **access to parent parameters**.

### ❌ Don't use `mergeParams` when:
- The child route does **not require parameters** from the parent.
- You are working with **independent routers** that don’t share route parameters.

---

## **Summary**
| Feature            | Without `mergeParams` | With `mergeParams: true` |
|--------------------|----------------------|--------------------------|
| Child router access to parent params | ❌ `undefined` | ✅ `Available` |
| Used for nested routers? | ❌ `No` | ✅ `Yes` |
| Route parameter inheritance | ❌ `No` | ✅ `Yes` |

`mergeParams: true` is a crucial setting when working with **nested routes in Express**. It ensures that child routers can access parameters defined in parent routes, making **modular route structures more effective and maintainable**.

---

## **Final Thoughts**
Using `mergeParams` correctly helps in designing scalable Express applications where routers are logically divided while still retaining access to important route parameters. Understanding this concept is essential for **REST API development** in Express.js.

Happy coding! 🚀

