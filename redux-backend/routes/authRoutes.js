const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Function to generate JWT token with all user parameters
const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    homeAddress: user.homeAddress,
    primaryColor: user.primaryColor,
    secondaryColor: user.secondaryColor,
    logo: user.logo,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

// POST /register - Register a new user
router.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    age,
    homeAddress,
    primaryColor,
    secondaryColor,
    logo,
  } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      homeAddress,
      primaryColor,
      secondaryColor,
      logo,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /signin - Sign in a user
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
