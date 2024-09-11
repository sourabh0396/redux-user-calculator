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


// const express = require('express');
// const CalculatorLog = require('../model/CalculatorLog');
// const mongoose = require('mongoose');
// const router = express.Router();

// // Get calculations with pagination for the logged-in user
// router.get('/', async (req, res) => {
//     try {
//         const page = parseInt(req.query.page, 10) || 1;
//         const limit = 10;  // You can change this value as needed
//         const skip = (page - 1) * limit;
//         const userId = req.user.id;  // Ensure req.user.id is set correctly in the JWT middleware

//         // Get total number of calculations for pagination
//         const totalCalculations = await CalculatorLog.countDocuments({ userId });
//         const totalPages = Math.ceil(totalCalculations / limit);

//         // Fetch the calculations for the user, with pagination
//         const calculations = await CalculatorLog.find({ userId })
//             .skip(skip)
//             .limit(limit);

//         res.status(200).json({ logs: calculations, totalPages });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });

// // Create a new calculation for the logged-in user
// router.post('/', async (req, res) => {
//     const { expression, is_valid, output } = req.body;
//     const userId = req.user.id;  // Consistent user ID from JWT middleware

//     // Validate the input data
//     if (!expression || typeof is_valid !== 'boolean' || output === undefined) {
//         return res.status(400).json({ message: 'Invalid input data' });
//     }

//     try {
//         // Create a new calculator log for the user
//         const newCalculation = new CalculatorLog({ expression, is_valid, output, userId });
//         await newCalculation.save();

//         res.status(201).json(newCalculation);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });

// // Delete calculations by IDs for the logged-in user
// router.delete('/', async (req, res) => {
//     try {
//         const { ids } = req.body;
//         const userId = req.user.id;  // Consistent user ID from JWT middleware

//         // Check if the IDs array is valid
//         if (!Array.isArray(ids) || ids.length === 0) {
//             return res.status(400).json({ message: 'Invalid IDs provided' });
//         }

//         // Validate that each provided ID is a valid MongoDB ObjectId
//         if (!ids.every(id => mongoose.Types.ObjectId.isValid(id))) {
//             return res.status(400).json({ message: 'Some IDs are not valid ObjectId' });
//         }

//         // Delete the user's logs based on the provided IDs
//         await CalculatorLog.deleteMany({ _id: { $in: ids }, userId });
        
//         res.status(200).json({ message: 'Logs deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });

// module.exports = router;

// // const express = require('express');
// // const CalculatorLog = require('../models/calculatorLog');
// // const mongoose = require('mongoose');
// // const router = express.Router();

// // // Get calculations with pagination for the logged-in user
// // router.get('/', async (req, res) => {
// //     try {
// //         const page = parseInt(req.query.page, 10) || 1;
// //         const limit = 10;  // You can change this value as needed
// //         const skip = (page - 1) * limit;
// //         const userId = req.user.id;  // Ensure req.user.id is set correctly in the JWT middleware

// //         // Get total number of calculations for pagination
// //         const totalCalculations = await CalculatorLog.countDocuments({ userId });
// //         const totalPages = Math.ceil(totalCalculations / limit);

// //         // Fetch the calculations for the user, with pagination
// //         const calculations = await CalculatorLog.find({ userId })
// //             .skip(skip)
// //             .limit(limit);

// //         res.status(200).json({ logs: calculations, totalPages });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Server error', error: error.message });
// //     }
// // });

// // // Create a new calculation for the logged-in user
// // router.post('/', async (req, res) => {
// //     const { expression, is_valid, output } = req.body;
// //     const userId = req.user.id;  // Consistent user ID from JWT middleware

// //     // Validate the input data
// //     if (!expression || typeof is_valid !== 'boolean' || output === undefined) {
// //         return res.status(400).json({ message: 'Invalid input data' });
// //     }

// //     try {
// //         // Create a new calculator log for the user
// //         const newCalculation = new CalculatorLog({ expression, is_valid, output, userId });
// //         await newCalculation.save();

// //         res.status(201).json(newCalculation);
// //     } catch (error) {
// //         res.status(500).json({ message: 'Server error', error: error.message });
// //     }
// // });

// // // Delete calculations by IDs for the logged-in user
// // router.delete('/', async (req, res) => {
// //     try {
// //         const { ids } = req.body;
// //         const userId = req.user.id;  // Consistent user ID from JWT middleware

// //         // Check if the IDs array is valid
// //         if (!Array.isArray(ids) || ids.length === 0) {
// //             return res.status(400).json({ message: 'Invalid IDs provided' });
// //         }

// //         // Validate that each provided ID is a valid MongoDB ObjectId
// //         if (!ids.every(id => mongoose.Types.ObjectId.isValid(id))) {
// //             return res.status(400).json({ message: 'Some IDs are not valid ObjectId' });
// //         }

// //         // Delete the user's logs based on the provided IDs
// //         await CalculatorLog.deleteMany({ _id: { $in: ids }, userId });
        
// //         res.status(200).json({ message: 'Logs deleted successfully' });
// //     } catch (error) {
// //         res.status(500).json({ message: 'Server error', error: error.message });
// //     }
// // });

// // module.exports = router;


// // // // routes/calculatorRoutes.js
// // // const express = require('express');
// // // const math = require('mathjs');
// // // const CalculatorLog = require('../models/CalculatorLog');
// // // const logger = require('../a/config/logger');
// // // const Sequence = require('../models/counter');
// // // const authenticateJWT = require('../middleware/authenticate');

// // // const router = express.Router();

// // // // Middleware to handle database operations with error handling
// // // const handleDbOperation = (operation) => async (req, res, next) => {
// // //   try {
// // //     await operation(req, res);
// // //   } catch (error) {
// // //     logger.error(`Database operation error: ${error.message}`);
// // //     res.status(500).json({ message: 'Internal Server Error' });
// // //   }
// // // };

// // // const getNextSequenceValue = async (sequenceName) => {
// // //   const sequence = await Sequence.findByIdAndUpdate(
// // //     sequenceName,
// // //     { $inc: { sequence_value: 1 } },
// // //     { new: true, upsert: true }
// // //   );
// // //   return sequence.sequence_value;
// // // };

// // // // Route to log a new calculator expression
// // // router.post(
// // //   '/logs',
// // //   authenticateJWT,
// // //   handleDbOperation(async (req, res) => {
// // //     const { expression } = req.body;
// // //     const userId = req.user.id;

// // //     if (!expression) {
// // //       logger.info('Received an empty expression');
// // //       return res.status(400).json({ message: 'Expression is empty' });
// // //     }

// // //     let output = null;
// // //     let isValid = true;

// // //     try {
// // //       output = math.evaluate(expression);
// // //       output = parseFloat(output.toFixed(2));
// // //     } catch (err) {
// // //       isValid = false;
// // //       logger.warn(`Invalid expression attempted: ${expression}`);
// // //     }

// // //     const nextId = await getNextSequenceValue('logId');
// // //     const sequenceNumber = await getNextSequenceValue('sequenceNumber');

// // //     const calculatorLog = new CalculatorLog({
// // //       _id: nextId,
// // //       expression,
// // //       isValid,
// // //       output,
// // //       sequenceNumber,
// // //       userId,
// // //     });
// // //     await calculatorLog.save();
// // //     logger.info(`Expression logged: ${expression} | Valid: ${isValid}`);

// // //     return res.json({
// // //       message: isValid
// // //         ? `Expression evaluated to ${output}`
// // //         : 'Invalid expression',
// // //       output: isValid ? output : null,
// // //       isValid,
// // //     });
// // //   })
// // // );

// // // // Route to fetch calculator logs with pagination
// // // router.get(
// // //   '/logs',
// // //   authenticateJWT,
// // //   handleDbOperation(async (req, res) => {
// // //     const userId = req.user.id;
// // //     const page = parseInt(req.query.page) || 1;
// // //     const limit = parseInt(req.query.limit) || 10;

// // //     const logs = await CalculatorLog.find({ userId })
// // //       .sort({ createdOn: -1 })
// // //       .skip((page - 1) * limit)
// // //       .limit(limit)
// // //       .exec();

// // //     const totalLogs = await CalculatorLog.countDocuments({ userId }).exec();

// // //     logger.info('Successfully retrieved logs');
// // //     res.json({
// // //       logs,
// // //       total: totalLogs,
// // //       page,
// // //       pages: Math.ceil(totalLogs / limit),
// // //     });
// // //   })
// // // );

// // // // Route to delete calculator logs by an array of IDs
// // // router.delete(
// // //   '/logs',
// // //   authenticateJWT,
// // //   handleDbOperation(async (req, res) => {
// // //     const { ids } = req.body;
// // //     const userId = req.user.id;

// // //     if (!Array.isArray(ids) || ids.length === 0) {
// // //       return res.status(400).json({ message: 'No IDs provided for deletion' });
// // //     }

// // //     try {
// // //       await CalculatorLog.deleteMany({ _id: { $in: ids }, userId });
// // //       logger.info(`Deleted logs with IDs: ${ids.join(', ')}`);
// // //       res.json({ message: 'Logs deleted successfully' });
// // //     } catch (error) {
// // //       logger.error(`Error deleting logs: ${error.message}`);
// // //       res.status(500).json({ message: 'Internal Server Error' });
// // //     }
// // //   })
// // // );

// // // module.exports = router;

// // // // const express = require("express");
// // // // const math = require("mathjs");
// // // // const CalculatorLog = require("../models/CalculatorLog");
// // // // const logger = require("../a/config/logger");
// // // // const Sequence = require("../models/counter");
// // // // // const Counter = require('../models/counter')
// // // // const authenticateJWT = require("../middleware/authenticateJWT");

// // // // const router = express.Router();

// // // // // Middleware to handle database operations with error handling
// // // // const handleDbOperation = (operation) => async (req, res, next) => {
// // // //   try {
// // // //     await operation(req, res);
// // // //   } catch (error) {
// // // //     // Log error details and respond with a 500 Internal Server Error status
// // // //     logger.error(`Database operation error: ${error.message}`);
// // // //     res.status(500).json({ message: "Internal Server Error" });
// // // //   }
// // // // };

// // // // const getNextSequenceValue = async (sequenceName) => {
// // // //   const sequence = await Sequence.findByIdAndUpdate(
// // // //     sequenceName,
// // // //     { $inc: { sequence_value: 1 } },
// // // //     { new: true, upsert: true }
// // // //   );
// // // //   return sequence.sequence_value;
// // // // };

// // // // // Route to log a new calculator expression
// // // // router.post(
// // // //   "/logs",
// // // //   authenticateJWT, // Ensure the user is authenticated
// // // //   handleDbOperation(async (req, res) => {
// // // //     const { expression } = req.body;
// // // //     const userId = req.user.id; // Get user ID from JWT token

// // // //     // Check if the expression is provided
// // // //     if (!expression) {
// // // //       logger.info("Received an empty expression");
// // // //       return res.status(400).json({ message: "Expression is empty" });
// // // //     }

// // // //     let output = null;
// // // //     let isValid = true;

// // // //     try {
// // // //       // Evaluate the mathematical expression
// // // //       output = math.evaluate(expression);
// // // //       output = parseFloat(output.toFixed(2)); // Format output to 2 decimal places
// // // //     } catch (err) {
// // // //       // If evaluation fails, mark as invalid
// // // //       isValid = false;
// // // //       logger.warn(`Invalid expression attempted: ${expression}`);
// // // //     }

// // // //     const nextId = await getNextSequenceValue("logId");
// // // //     const sequenceNumber = await getNextSequenceValue("sequenceNumber");

// // // //     // Create a new log entry in the database
// // // //     const calculatorLog = new CalculatorLog({
// // // //       _id: nextId,
// // // //       expression,
// // // //       isValid,
// // // //       output,
// // // //       sequenceNumber,
// // // //       userId, // Associate the log with the user
// // // //     });
// // // //     await calculatorLog.save();
// // // //     logger.info(`Expression logged: ${expression} | Valid: ${isValid}`);

// // // //     // Respond with the result of the expression or an error message
// // // //     return res.json({
// // // //       message: isValid
// // // //         ? `Expression evaluated to ${output}`
// // // //         : "Invalid expression",
// // // //       output: isValid ? output : null,
// // // //       isValid,
// // // //     });
// // // //   })
// // // // );

// // // // // Route to fetch calculator logs with pagination
// // // // router.get(
// // // //   "/logs",
// // // //   authenticateJWT, // Ensure the user is authenticated
// // // //   handleDbOperation(async (req, res) => {
// // // //     const userId = req.user.id; // Get user ID from JWT token
// // // //     const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
// // // //     const limit = parseInt(req.query.limit) || 10; // Default to 10 logs per page if not specified

// // // //     // Retrieve logs from the database with pagination and sorting for the specific user
// // // //     const logs = await CalculatorLog.find({ userId })
// // // //       .sort({ createdOn: -1 }) // Sort by creation date in descending order
// // // //       .skip((page - 1) * limit) // Skip logs for previous pages
// // // //       .limit(limit) // Limit the number of logs returned
// // // //       .exec();

// // // //     // Get the total count of logs for the user
// // // //     const totalLogs = await CalculatorLog.countDocuments({ userId }).exec();

// // // //     logger.info("Successfully retrieved logs");
// // // //     // Respond with the logs, total count, current page, and total number of pages
// // // //     res.json({
// // // //       logs,
// // // //       total: totalLogs,
// // // //       page,
// // // //       pages: Math.ceil(totalLogs / limit), // Calculate total number of pages
// // // //     });
// // // //   })
// // // // );

// // // // // Route to delete calculator logs by an array of IDs
// // // // router.delete(
// // // //   "/logs",
// // // //   authenticateJWT, // Ensure the user is authenticated
// // // //   handleDbOperation(async (req, res) => {
// // // //     const { ids } = req.body;
// // // //     const userId = req.user.id; // Get user ID from JWT token

// // // //     // Check if the array of IDs is provided and not empty
// // // //     if (!Array.isArray(ids) || ids.length === 0) {
// // // //       return res.status(400).json({ message: "No IDs provided for deletion" });
// // // //     }

// // // //     try {
// // // //       // Delete logs from the database where the ID matches any of the provided IDs and belongs to the user
// // // //       await CalculatorLog.deleteMany({ _id: { $in: ids }, userId });
// // // //       logger.info(`Deleted logs with IDs: ${ids.join(", ")}`);
// // // //       res.json({ message: "Logs deleted successfully" });
// // // //     } catch (error) {
// // // //       // Log error details and respond with a 500 Internal Server Error status
// // // //       logger.error(`Error deleting logs: ${error.message}`);
// // // //       res.status(500).json({ message: "Internal Server Error" });
// // // //     }
// // // //   })
// // // // );

// // // // module.exports = router;

// // // // // const express = require('express');
// // // // // const math = require('mathjs');
// // // // // const router = express.Router();
// // // // // const Counter = require('../models/counter');
// // // // // const CalculatorLog = require('../models/calculatorLog');
// // // // // const logger = require('../a/config/logger');  // Assuming you have a logger module

// // // // // // Helper functions
// // // // // const getFormattedDate = () => {
// // // // //   const date = new Date();
// // // // //   const year = date.getFullYear();
// // // // //   const month = String(date.getMonth() + 1).padStart(2, '0');
// // // // //   const day = String(date.getDate()).padStart(2, '0');
// // // // //   return `${year}-${month}-${day}`;
// // // // // };

// // // // // const getNextSequenceValue = async (sequenceName) => {
// // // // //   const sequenceDocument = await Counter.findByIdAndUpdate(
// // // // //     sequenceName,
// // // // //     { $inc: { sequence_value: 1 } },
// // // // //     { new: true, upsert: true }
// // // // //   );
// // // // //   return sequenceDocument.sequence_value;
// // // // // };

// // // // // // Route to log calculator expressions
// // // // // router.post('/api/logs', async (req, res) => {
// // // // //   const { expression } = req.body;

// // // // //   if (!expression) {
// // // // //     logger.info('Received an empty expression');
// // // // //     return res.status(400).json({ message: 'Expression is empty' });
// // // // //   }

// // // // //   let output = null;
// // // // //   let isValid = true;

// // // // //   try {
// // // // //     output = math.evaluate(expression);
// // // // //     output = parseFloat(output.toFixed(2));
// // // // //   } catch (err) {
// // // // //     logger.warn(`Invalid expression attempted: ${expression}`);
// // // // //     isValid = false;
// // // // //   }

// // // // //   const nextId = await getNextSequenceValue('calculatorLogId');

// // // // //   const calculatorLog = new CalculatorLog({
// // // // //     id: nextId,
// // // // //     expression,
// // // // //     isValid,
// // // // //     output,
// // // // //     createdOn: getFormattedDate(),  // Add timestamp
// // // // //   });

// // // // //   await calculatorLog.save();
// // // // //   logger.info(`Expression logged: ${expression} | Valid: ${isValid}`);

// // // // //   return res.json({
// // // // //     message: isValid ? `Expression evaluated to ${output}` : 'Invalid expression',
// // // // //     output: isValid ? output : null,
// // // // //     isValid,
// // // // //   });
// // // // // });

// // // // // // Route to fetch calculator logs with pagination and filtering
// // // // // router.get('/api/logs', async (req, res) => {
// // // // //   const page = parseInt(req.query.page, 10) || 1;
// // // // //   const limit = parseInt(req.query.limit, 10) || 1000;
// // // // //   const search = req.query.search;

// // // // //   try {
// // // // //     const query = search
// // // // //       ? {
// // // // //           $or: [
// // // // //             { expression: new RegExp(search, 'i') },
// // // // //             { output: new RegExp(search, 'i') },
// // // // //           ],
// // // // //         }
// // // // //       : {};

// // // // //     const logs = await CalculatorLog.find(query)
// // // // //       .sort({ createdOn: -1 })  // Ensure sorting by timestamp
// // // // //       .skip((page - 1) * limit)
// // // // //       .limit(limit);

// // // // //     const totalLogs = await CalculatorLog.countDocuments(query);

// // // // //     res.json({
// // // // //       logs,
// // // // //       totalPages: Math.ceil(totalLogs / limit),
// // // // //       currentPage: page,
// // // // //     });
// // // // //   } catch (error) {
// // // // //     logger.error('Failed to fetch logs:', error);
// // // // //     res.status(500).json({ message: 'Failed to fetch logs' });
// // // // //   }
// // // // // });

// // // // // // Route to delete selected logs
// // // // // router.delete('/api/logs', async (req, res) => {
// // // // //   const { ids } = req.body;

// // // // //   if (!Array.isArray(ids) || ids.length === 0) {
// // // // //     logger.warn('No IDs provided for deletion');
// // // // //     return res.status(400).json({ message: 'No IDs provided' });
// // // // //   }

// // // // //   try {
// // // // //     const result = await CalculatorLog.deleteMany({ id: { $in: ids } });
// // // // //     logger.info(`Deleted ${result.deletedCount} log(s) with IDs: ${ids}`);

// // // // //     return res.json({ message: `Deleted ${result.deletedCount} log(s)` });
// // // // //   } catch (error) {
// // // // //     logger.error('Failed to delete logs:', error);
// // // // //     res.status(500).json({ message: 'Failed to delete logs' });
// // // // //   }
// // // // // });

// // // // // module.exports = router;
// // // // // // const express = require('express');
// // // // // // const math = require('mathjs');
// // // // // // const router = express.Router();
// // // // // // const Counter = require('../models/counter');
// // // // // // const CalculatorLog = require('../models/calculatorLog');

// // // // // // // Log calculator expression
// // // // // // router.post('/log', async (req, res) => {
// // // // // //   const { expression } = req.body;

// // // // // //   if (!expression) {
// // // // // //     return res.status(400).json({ message: 'Expression is required' });
// // // // // //   }

// // // // // //   try {
// // // // // //     // Evaluate the expression
// // // // // //     const output = math.evaluate(expression);

// // // // // //     // Fetch and update the sequence number
// // // // // //     const counter = await Counter.findByIdAndUpdate(
// // // // // //       'calculatorLogId', 
// // // // // //       { $inc: { sequence_value: 1 } }, 
// // // // // //       { new: true, upsert: true }  // `upsert: true` will create the document if it doesn't exist
// // // // // //     );

// // // // // //     if (!counter) {
// // // // // //       return res.status(500).json({ message: 'Counter update failed' });
// // // // // //     }

// // // // // //     // Create a new log entry
// // // // // //     const newLog = new CalculatorLog({
// // // // // //       id: counter.sequence_value,
// // // // // //       expression,
// // // // // //       isValid: true,
// // // // // //       output: parseFloat(output.toFixed(2)),
// // // // // //     });

// // // // // //     await newLog.save();

// // // // // //     res.status(201).json({ message: `Expression evaluated to ${output}`, output });
// // // // // //   } catch (error) {
// // // // // //     console.error('Error:', error);  // Log the error for debugging
// // // // // //     res.status(400).json({ message: 'Invalid expression or server error', error: error.message });
// // // // // //   }
// // // // // // });

// // // // // // // Get logs
// // // // // // router.get('/log', async (req, res) => {
// // // // // //   try {
// // // // // //     const logs = await CalculatorLog.find();
// // // // // //     res.status(200).json(logs);
// // // // // //   } catch (error) {
// // // // // //     console.error('Error:', error);  // Log the error for debugging
// // // // // //     res.status(500).json({ message: 'Server error', error: error.message });
// // // // // //   }
// // // // // // });

// // // // // // module.exports = router;
