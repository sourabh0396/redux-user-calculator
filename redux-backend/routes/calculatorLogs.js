// const express = require('express');
// const math = require('mathjs');
// const Counter = require('../models/counter')
// const calculatorLog = require ('../models/calculatorLog')
// // const Counter = require('../models/Counter');
// // const CalculatorLog = require('../models/CalculatorLog');
// const logger = require('../config/logger');

// const router = express.Router();

// // Function to get next sequence value
// const getNextSequenceValue = async (sequenceName) => {
//   const sequenceDocument = await Counter.findByIdAndUpdate(
//     sequenceName,
//     { $inc: { sequence_value: 1 } },
//     { new: true, upsert: true }
//   );
//   return sequenceDocument.sequence_value;
// };

// // Initialize counters
// const initCounters = async () => {
//   const existingCounter = await Counter.findById('calculatorLogId');
//   if (!existingCounter) {
//     await Counter.create({ _id: 'calculatorLogId', sequence_value: 0 });
//   }
// };

// initCounters();

// // Middleware for database operations
// const handleDbOperation = (operation) => async (req, res, next) => {
//   try {
//     await operation(req, res);
//   } catch (error) {
//     logger.error(`Database operation error: ${error.message}`);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// // Routes
// router.post('/logs', handleDbOperation(async (req, res) => {
//   const { expression } = req.body;
//   if (!expression) {
//     logger.info('Received an empty expression');
//     return res.status(400).json({ message: 'Expression is empty' });
//   }

//   let output = null;
//   let isValid = true;
//   try {
//     output = math.evaluate(expression);
//     output = parseFloat(output.toFixed(2)); // Format to 2 decimal places
//     isValid = true;
//   } catch (err) {
//     logger.warn(`Invalid expression attempted: ${expression}`);
//     isValid = false;
//   }

//   // Get the next sequence value for the id
//   const nextId = await getNextSequenceValue('calculatorLogId');

//   const calculatorLog = new CalculatorLog({ id: nextId, expression, isValid, output });
//   await calculatorLog.save();
//   logger.info(`Expression logged: ${expression} | Valid: ${isValid}`);

//   return res.json({
//     message: isValid ? `Expression evaluated to ${output}` : 'Invalid expression',
//     output: isValid ? output : null,
//     isValid
//   });
// }));

// router.get('/logs', async (req, res) => {
//   const page = parseInt(req.query.page, 10) || 1;
//   const limit = parseInt(req.query.limit, 10) || 1000;
//   const search = req.query.search;

//   try {
//     const query = search
//       ? {
//           $or: [
//             { expression: new RegExp(search, 'i') }, // Search in the `expression` field
//             { output: new RegExp(search, 'i') },      // Search in the `output` field
//           ],
//         }
//       : {};

//     const logs = await CalculatorLog.find(query)
//       .sort({ createdOn: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const totalLogs = await CalculatorLog.countDocuments(query);

//     res.json({
//       logs,
//       totalPages: Math.ceil(totalLogs / limit),
//       currentPage: page,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch logs' });
//   }
// });

// router.delete('/logs', handleDbOperation(async (req, res) => {
//   const { ids } = req.body; // Expecting an array of ids
//   if (!Array.isArray(ids) || ids.length === 0) {
//     logger.warn('No IDs provided for deletion');
//     return res.status(400).json({ message: 'No IDs provided' });
//   }

//   const result = await CalculatorLog.deleteMany({ id: { $in: ids } });
//   logger.info(`Deleted ${result.deletedCount} log(s) with IDs: ${ids}`);

//   return res.json({ message: `Deleted ${result.deletedCount} log(s)` });
// }));

// module.exports = router;
