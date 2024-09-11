const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// Middleware to authenticate user
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  
  // jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
    // jwt.verify(token, 'souRabhJp', (err, user) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user; // Store the user information in the request object
    next();
  });
};

// Get profile using token
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, age, homeAddress, primaryColor, secondaryColor, logo } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      { firstName, lastName, age, homeAddress, primaryColor, secondaryColor, logo },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
