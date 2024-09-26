# NODE & EXPRESS SETUP

## This guide provides instructions to set up the backend using **Express**, **Mongoose**, **Nodemon**, and **ES6 modules**.

# BACKEND STRUCTURE

├── /server # Backend folder for Express and Mongoose
│ ├── /app
│ │ ├── /models # Store all Mongoose models (User, Product, Order)
│ │ │ ├── User.js
│ │ │ ├── Product.js
│ │ │ └── Order.js
│ │ ├── /routes
│ │ │ ├── userRoutes.js # Routes for user-related operations
│ │ │ ├── productRoutes.js
│ │ │ ├── orderRoutes.js
│ │ │ └── routes.js # Centralized route management
│ │ ├── /controllers # Contains all controller functions
│ │ │ ├── userController.js
│ │ │ ├── productController.js
│ │ │ └── orderController.js
│ │ ├── /Enumerations
│ │ │ ├── userEnum.js
│ │ │ ├── productEnum.js
│ │ │ └── orderEnum.js
│ │ ├── /middlewares
│ │ │ └── authMiddleware.js
│ │ └── App.js # Main server file for the backend
│ ├── .env # Backend environment variables
│ ├── package.json # Backend package manifest
│ ├── package-lock.json
└── README.md # Project documentation

---

# Explanation of Backend Structure

- **/models**: Contains Mongoose models that define the structure of the database collections (e.g., User, Product, Order).

  - **User.js**: Defines the user model and schema.
  - **Product.js**: Defines the product model and schema.
  - **Order.js**: Defines the order model and schema.

- **/routes**: Contains route files that handle incoming requests to the API.

  - **userRoutes.js**: Handles routes for user-related operations (e.g., login, signup).
  - **productRoutes.js**: Handles routes for product-related operations.
  - **orderRoutes.js**: Handles routes for order-related operations.
  - **routes.js**: Centralizes the route management by combining all route files and passing them to the Express app.

- **/controllers**: Contains controller functions that define the business logic for each route.

  - **userController.js**: Handles logic for user routes (e.g., user creation, fetching users).
  - **productController.js**: Handles logic for product routes (e.g., adding, updating, deleting products).
  - **orderController.js**: Handles logic for order routes (e.g., placing, updating orders).

- **/Enumerations**: Stores enumerations (constants) used throughout the app.

  - **userEnum.js**: Constants related to users.
  - **productEnum.js**: Constants related to products.
  - **orderEnum.js**: Constants related to orders.

- **/middlewares**: Contains middleware functions.

  - **authMiddleware.js**: Middleware to handle authentication and authorization.

- **App.js**: The main file for the Express server, responsible for initializing the server, connecting to MongoDB, and setting up middleware and routes.

- **.env**: Environment configuration for variables such as the MongoDB URI and server port.

- **package.json**: Contains the dependencies and metadata for the backend project.

- **README.md**: Project documentation and instructions.

---

# BACKEND SETUP

## 1. Initialize package.json

Run the following command to initialize a package.json:

```bash
npm init -y
```

add a script

```json
"scripts": {
  "start": "nodemon app/App.js"
}
```

### 2. Install Dependencies

Run the following command to install required dependencies:

```bash
npm install express mongoose
npm install -g nodemon # Optional for automatic restart
```

## 3. Create the .env File

Create a .env file with the following environment variables:

EX:

```bash
PORT=8000
MONGO_URI=mongodb://localhost:27017/mydatabase
```

### 4. Create the Main Server File

IN App.js under /app folder for your Express server:

```javascript
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import initializeRoutes from "./routes/routes.js"; // Route initialization

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json()); // Middleware to parse JSON

initializeRoutes(app); // Initialize all routes

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
```

## 5. Initialize Routes

In routes.js in /routes folder:

Import all the routes and give them a name
Decalre them in export default (app) => {Routes declaration} by : RouteName(app);

```javascript
EX: import userRoutes from "./userRoutes.js";

export default (app) => {
  // Decalre routes
  userRoutes(app); // Initialize user routes
  // Add other routes as needed, e.g., productRoutes, orderRoutes
};
```

Define route files,
For example, Routes/userRoutes.js:

```javascript
import * as userController from "../controllers/userController.js";

export default (app) => {
  app.get("/users", userController.getAllUsers);
  app.post("/users", userController.createUser);
  app.get("/users/:id", userController.getUserById);
  app.put("/users/:id", userController.updateUser);
  app.delete("/users/:id", userController.deleteUser);
};
```

## 6. Create Controllers

Create controller files and within those files functions for each model.

For example, in Controllers/userController.js:

```javascript
export const getAllUsers = async (req, res) => {
  // Your logic here
};

export const createUser = async (req, res) => {
  // Your logic here
};

// Other controller functions (getUserById, updateUser, deleteUser)
```

## 7. Create Enumerations

Example of an enumeration file, http_codeEnum.js:

```javascript
export default {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};
```

## 8. Create Mongoose Models

Example Mongoose model for User:

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
```

## 9. Run the Server

```bash
npm run start
```
