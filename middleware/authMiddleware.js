const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // Get token from headers
    const token = req.header("Authorization");

    // Check if token is missing
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = authMiddleware;

