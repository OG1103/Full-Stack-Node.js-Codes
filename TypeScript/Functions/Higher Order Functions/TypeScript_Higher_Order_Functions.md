
# Higher-Order Functions in TypeScript

A **higher-order function** is a function that either:
1. Takes another function as an argument, or
2. Returns a function as its result.

Higher-order functions are widely used in TypeScript for both frontend and backend programming, particularly for handling reusable logic, middleware, and asynchronous workflows.

---

## **1. Higher-Order Functions That Take a Function as an Argument**

### Basic Example
```typescript
function higherOrder(func: (x: number) => number, value: number): number {
    return func(value) + 10;
}

const double = (x: number): number => x * 2;

console.log(higherOrder(double, 5)); // Output: 20 (double(5) + 10)
```

### Backend Example: Middleware in Express
Middleware functions in frameworks like Express are great examples of higher-order functions that take other functions as arguments.

```typescript
import express, { Request, Response, NextFunction } from "express";

const app = express();

function logger(req: Request, res: Response, next: NextFunction) {
    console.log(`Request to: ${req.url}`);
    next(); // Calls the next middleware function
}

app.use(logger);

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
```

---

## **2. Higher-Order Functions That Return a Function**

### Basic Example
```typescript
function createMultiplier(multiplier: number): (x: number) => number {
    return (x: number): number => x * multiplier;
}

const triple = createMultiplier(3);
console.log(triple(4)); // Output: 12
```

### Backend Example: Middleware Generator
You can use higher-order functions to generate middleware with custom behavior.

```typescript
function requireRole(role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.headers["role"] === role) {
            next();
        } else {
            res.status(403).send("Forbidden");
        }
    };
}

app.get("/admin", requireRole("admin"), (req, res) => {
    res.send("Welcome, Admin!");
});
```

---

## **3. Higher-Order Functions and Promises**

Higher-order functions are frequently used in backend programming to handle asynchronous workflows, such as database queries or API calls.

### Backend Controller Example with Promises
```typescript
async function withErrorHandling(
    controller: (req: Request, res: Response) => Promise<any>
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller(req, res);
        } catch (error) {
            next(error); // Pass the error to Express's error handler
        }
    };
}

// Example Controller
const getUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    const user = await fetchUserFromDB(userId); // Simulated DB call
    res.json(user);
};

app.get("/user/:id", withErrorHandling(getUser));
```

---

## **4. Combining Higher-Order Functions**

Higher-order functions can be combined to create reusable and composable logic.

### Example: Middleware Chaining
```typescript
function logRequest(req: Request, res: Response, next: NextFunction) {
    console.log(`Request URL: ${req.url}`);
    next();
}

function validateAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers["authorization"]) {
        res.status(401).send("Unauthorized");
    } else {
        next();
    }
}

app.get("/secure", logRequest, validateAuth, (req, res) => {
    res.send("Secure Data");
});
```

---

## **Summary**

Higher-order functions in TypeScript are versatile tools that can simplify complex logic and improve reusability. They are particularly useful in backend development for tasks like middleware, error handling, and composing functions. By understanding higher-order functions, you can write more modular and expressive code.
