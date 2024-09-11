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
// // routes/authRoutes.js
// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user'); // Ensure correct path to User model
// const router = express.Router();

// // Register route
// router.post('/register', async (req, res) => {
//     try {
//         const { firstName, lastName, email, password, age, homeAddress, primaryColor, secondaryColor, logo } = req.body;
//         if (!email || !password) {
//             return res.status(400).json({ error: 'Missing required fields' });
//         }

//         // Check if the user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: 'Email already in use' });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create user
//         const newUser = new User({
//             firstName,
//             lastName,
//             email,
//             password: hashedPassword,
//             age,
//             homeAddress,
//             primaryColor,
//             secondaryColor,
//             logo
//         });

//         await newUser.save();

//         // Create token
//         const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         res.status(201).json({
//             token,
//             user: {
//                 firstName: newUser.firstName,
//                 lastName: newUser.lastName,
//                 email: newUser.email
//             }
//         });
//     } catch (error) {
//         console.error('Error during registration:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// // Login route
// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).json({ error: 'Missing required fields' });
//         }

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ error: 'Invalid email or password' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ error: 'Invalid email or password' });
//         }

//         // Create JWT token
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         res.status(200).json({
//             token,
//             user: {
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 email: user.email
//             }
//         });
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// module.exports = router;

// // const express = require('express');
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');
// // const User = require('../models/User');
// // const router = express.Router();

// // // Register route
// // router.post('/register', async (req, res) => {
// //   try {
// //     const { firstName, lastName, email, password, age, homeAddress, primaryColor, secondaryColor, logo } = req.body;
// //     if (!firstName || !email || !password || !homeAddress || !primaryColor || !secondaryColor || !logo) {
// //       return res.status(400).json({ error: 'Missing required fields' });
// //     }

// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return res.status(400).json({ error: 'Email already in use' });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 10);
// //     const newUser = new User({
// //       firstName,
// //       lastName,
// //       email,
// //       password: hashedPassword,
// //       age,
// //       homeAddress,
// //       primaryColor,
// //       secondaryColor,
// //       logo,
// //     });

// //     await newUser.save();
// //     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

// //     res.status(201).json({ token, user: { firstName, lastName, email } });
// //   } catch (error) {
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // });

// // // Login route
// // router.post('/login', async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     const user = await User.findOne({ email });

// //     if (!user || !(await bcrypt.compare(password, user.password))) {
// //       return res.status(400).json({ error: 'Invalid email or password' });
// //     }

// //     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
// //     res.status(200).json({ token, user: { firstName: user.firstName, lastName: user.lastName, email: user.email } });
// //   } catch (error) {
// //     res.status(500).json({ error: 'Server error' });
// //   }
// // });

// // module.exports = router;

// // // const express = require('express');
// // // const bcrypt = require('bcryptjs');
// // // const jwt = require('jsonwebtoken');
// // // // const User = require('../models/User');
// // // const user =require ('../routes')

// // // const router = express.Router();

// // // // Register new user
// // // router.post('/register', async (req, res) => {
// // //     try {
// // //         const {
// // //             firstName,
// // //             lastName,
// // //             email,
// // //             password,
// // //             age,
// // //             homeAddress,
// // //             primaryColor,
// // //             secondaryColor,
// // //             logo
// // //         } = req.body;

// // //         // Validate input
// // //         if (!firstName || !email || !password || !homeAddress || !primaryColor || !secondaryColor || !logo) {
// // //             return res.status(400).json({ error: 'Missing required fields' });
// // //         }

// // //         // Check for existing user
// // //         const existingUser = await User.findOne({ email });
// // //         if (existingUser) {
// // //             return res.status(400).json({ error: 'Email already in use' });
// // //         }

// // //         // Hash the password
// // //         const hashedPassword = await bcrypt.hash(password, 10);

// // //         // Create a new user
// // //         const user = new User({
// // //             firstName,
// // //             lastName,
// // //             email,
// // //             password: hashedPassword,
// // //             age,
// // //             homeAddress,
// // //             primaryColor,
// // //             secondaryColor,
// // //             logo
// // //         });

// // //         await user.save();

// // //         // Generate JWT token
// // //         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

// // //         res.status(201).json({ token, user: { firstName, lastName, email } });
// // //     } catch (error) {
// // //         console.error('Error during registration:', error);
// // //         res.status(500).json({ error: 'Server error' });
// // //     }
// // // });

// // // module.exports = router;
// // // // // const express = require('express');
// // // // // const { register, login } = require('../controllers/authController');

// // // // // const router = express.Router();

// // // // // router.post('/register', register);
// // // // // router.post('/login', login);

// // // // // module.exports = router;
// // // // const express = require('express');
// // // // const authController = require('../controllers/authController');

// // // // const router = express.Router();

// // // // router.post('/register', authController.registerUser);
// // // // // router.post('/login', login);

// // // // module.exports = router;
