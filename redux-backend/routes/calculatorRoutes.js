const express = require('express');
const CalculatorLog = require('../models/calculatorLog');
const mongoose = require('mongoose');
const router = express.Router();

// Get calculations with pagination for the logged-in user
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = 10;  // You can change this value as needed
        const skip = (page - 1) * limit;
        const userId = req.user.id;  // Ensure req.user.id is set correctly in the JWT middleware

        // Get total number of calculations for pagination
        const totalCalculations = await CalculatorLog.countDocuments({ userId });
        const totalPages = Math.ceil(totalCalculations / limit);

        // Fetch the calculations for the user, with pagination
        const calculations = await CalculatorLog.find({ userId })
            .skip(skip)
            .limit(limit);

        res.status(200).json({ logs: calculations, totalPages });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create a new calculation for the logged-in user
router.post('/', async (req, res) => {
    const { expression, isValid, output } = req.body;
    const userId = req.user.id;  // Consistent user ID from JWT middleware

    // Validate the input data
    if (!expression || typeof isValid !== 'boolean' || output === undefined) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
        // Create a new calculator log for the user
        const newCalculation = new CalculatorLog({ expression, isValid, output, userId });
        await newCalculation.save();

        res.status(201).json(newCalculation);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete calculations by IDs for the logged-in user
router.delete('/', async (req, res) => {
    try {
        const { ids } = req.body;
        const userId = req.user.id;  // Consistent user ID from JWT middleware

        // Check if the IDs array is valid
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Invalid IDs provided' });
        }

        // Validate that each provided ID is a valid MongoDB ObjectId
        if (!ids.every(id => mongoose.Types.ObjectId.isValid(id))) {
            return res.status(400).json({ message: 'Some IDs are not valid ObjectId' });
        }

        // Delete the user's logs based on the provided IDs
        await CalculatorLog.deleteMany({ _id: { $in: ids }, userId });
        
        res.status(200).json({ message: 'Logs deleted successfully' });
        
        
        const deleteSelectedLogs = async () => {
            if (selectedIds.length > 0) {
              try {
                await dispatch(deleteLogs(selectedIds)).unwrap();
              } catch (err) {
                console.error('Failed to delete logs:', err);
              }
            }
          };
          
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

