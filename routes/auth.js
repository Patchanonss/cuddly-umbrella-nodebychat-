const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Signup User
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("signup are called");
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    // res.json({ name, email, hashedPassword });

    await user.save();
    console.log("User created");
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in /register route:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Invalid data", details: error.errors });
    }
    // Handle MongoDB duplicate key errors (e.g., duplicate email)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (error.name === "MongoServerError") {
      return res
        .status(500)
        .json({ message: "Database connection error", details: error.message });
    }
    return res
      .status(500)
      .json({ message: "Internal Server Error", details: error.message });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    console.log("login are called");
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password dont match");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    console.log("token created");
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in /login route:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/admin", authMiddleware, async (req, res) => {
  console.log("this path is for authorized user only");
  res.json({ message: "Welcome to your profile", user: req.user });
});

module.exports = router;
