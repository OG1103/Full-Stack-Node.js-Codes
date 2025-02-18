/**
 * Auth Middleware Example using JWT in Express
 * ---------------------------------------------
 * This middleware verifies the Bearer token in the Authorization header
 * and attaches the decoded user information to the request object.
 */

import jwt from "jsonwebtoken";

// Secret key (ensure to use environment variables in real applications)
const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

// Auth middleware function
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // Should be in the format=> Authorization: Bearer <token>

  // Check if the Authorization header is present and starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  // if we provide it as : Authorization: <token> we don't need to splet our token will be authHeader straight away

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Pass control to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

export default authMiddleware;
