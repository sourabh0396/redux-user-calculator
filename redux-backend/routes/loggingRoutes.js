// routes/loggingRoutes.js
const express = require('express');
const math = require('mathjs');
const mongoose = require('mongoose');
const winston = require('winston');
const { MongoDB } = require('winston-mongodb');

// Define schemas and models
const counterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: Number
});
const Counter = mongoose.model('Counter', counterSchema);

const calculatorLogSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  expression: { type: String, required: true },
  isValid: { type: Boolean, required: true },
  output: { type: Number, required: true },
  createdOn: { type: Date, default: Date.now }
});
const CalculatorLog = mongoose.model('CalculatorLog', calculatorLogSchema);

// Configure Winston logger
const logFileName = `${getFormattedDate()}.logs`;
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({
      filename: `logs/${logFileName}`,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        winston.format.align(),
        winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`)
      ),
      maxsize: 1024 * 1024 * 10,
      maxFiles: 5,
    }),
    new winston.transports.MongoDB({
      level: 'error',
      db: 'mongodb+srv://sourabhpatil0369:E03jEzYLpOiI30z2@cluster0.uscvgdc.mongodb.net/',
      options: {
        useUnifiedTopology: true
      },
      collection: 'server_logs',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value;
};

const router = express.Router();

// Route to log calculator expressions
router.post('/api/logs', async (req, res) => {
  const { expression } = req.body;
  if (!expression) {
    logger.info('Received an empty expression');
    return res.status(400).json({ message: 'Expression is empty' });
  }

  let output = null;
  let isValid = true;
  try {
    output = math.evaluate(expression);
    output = parseFloat(output.toFixed(2));
  } catch (err) {
    logger.warn(`Invalid expression attempted: ${expression}`);
    isValid = false;
  }

  const nextId = await getNextSequenceValue('calculatorLogId');

  const calculatorLog = new CalculatorLog({ id: nextId, expression, isValid, output });
  await calculatorLog.save();
  logger.info(`Expression logged: ${expression} | Valid: ${isValid}`);

  return res.json({
    message: isValid ? `Expression evaluated to ${output}` : 'Invalid expression',
    output: isValid ? output : null,
    isValid
  });
});

// Route to fetch calculator logs with pagination and filtering
router.get('/api/logs', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1000;
  const search = req.query.search;

  try {
    const query = search
      ? {
          $or: [
            { expression: new RegExp(search, 'i') },
            { output: new RegExp(search, 'i') },
          ],
        }
      : {};

    const logs = await CalculatorLog.find(query)
      .sort({ createdOn: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalLogs = await CalculatorLog.countDocuments(query);

    res.json({
      logs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
});

// Route to delete selected logs
router.delete('/api/logs', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    logger.warn('No IDs provided for deletion');
    return res.status(400).json({ message: 'No IDs provided' });
  }

  const result = await CalculatorLog.deleteMany({ id: { $in: ids } });
  logger.info(`Deleted ${result.deletedCount} log(s) with IDs: ${ids}`);

  return res.json({ message: `Deleted ${result.deletedCount} log(s)` });
});

module.exports = router;
