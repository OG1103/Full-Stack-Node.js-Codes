
import express, { Request, Response, NextFunction } from "express";

const app = express();

// 1. Higher-Order Function That Takes a Function as an Argument
function higherOrder(func: (x: number) => number, value: number): number {
    return func(value) + 10;
}

const double = (x: number): number => x * 2;

console.log(higherOrder(double, 5)); // Output: 20 (double(5) + 10)

// 2. Higher-Order Function That Returns a Function
function createMultiplier(multiplier: number): (x: number) => number {
    return (x: number): number => x * multiplier;
}

const triple = createMultiplier(3);
console.log(triple(4)); // Output: 12

// 3. Middleware Example with Higher-Order Function
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

// 4. Higher-Order Function with Promises
async function withErrorHandling(
    controller: (req: Request, res: Response) => Promise<any>
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller(req, res);
        } catch (error) {
            next(error);
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

// 5. Middleware Chaining Example
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

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

// Simulated Database Call
async function fetchUserFromDB(userId: string) {
    return { id: userId, name: "John Doe" }; // Mocked user data
}
