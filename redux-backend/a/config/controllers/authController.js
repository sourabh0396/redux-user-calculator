
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    // console.log('register connect')
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            age,
            homeAddress,
            primaryColor,
            secondaryColor,
            logo
        } = req.body;

        // Validate input
        if (!firstName || !email || !password || !homeAddress || !primaryColor || !secondaryColor || !logo) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            age,
            homeAddress,
            primaryColor,
            secondaryColor,
            logo
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, user: { firstName, lastName, email } });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const { registerValidation, loginValidation } = require('../config/validation');

// exports.register = async (req, res) => {
//   const { error } = registerValidation.validate(req.body);
//   if (error) return res.status(400).json({ message: error.details[0].message });

//   const { email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: 'User already exists' });

//     user = new User(req.body);
//     await user.save();

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(201).json({ token, user });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.login = async (req, res) => {
//   const { error } = loginValidation.validate(req.body);
//   if (error) return res.status(400).json({ message: error.details[0].message });

//   const { email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(200).json({ token, user });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };
