const express = require('express');
// const User = require('../../../models/User');

const router = express.Router();

// Get user profile
router.get('/', async (req, res) => {
    console.log('Getting data')
    try {
        const user = await User.findOne({ email: req.query.email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return user profile details
        const { firstName, lastName, password, email, age, homeAddress, primaryColor, secondaryColor, logo } = user;
        res.json({ firstName, lastName, password, email, age, homeAddress, primaryColor, secondaryColor, logo });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user profile
router.put('/', async (req, res) => {
    try {
        const { firstName, lastName, age, homeAddress, primaryColor, secondaryColor, logo } = req.body;
        const { email } = req.query; // Assuming email is passed as a query parameter

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { firstName, lastName, age, homeAddress, primaryColor, secondaryColor, logo },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return updated profile details
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

// const User = require('../models/User');

// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.query.email_address }).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.updateProfile = async (req, res) => {
//   const { email_address } = req.query;

//   try {
//     let user = await User.findOne({ email: email_address });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     Object.assign(user, req.body);
//     await user.save();

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };
