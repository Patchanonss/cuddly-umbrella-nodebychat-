const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get token from headers
  const token = req.header("Authorization");

  // Check if token is missing
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    ); // Verify token
    req.user = decoded; // Attach user data to request object
    next(); // Proceed to the next middleware/route
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = authMiddleware;
