const winston = require('winston');
require('winston-mongodb');
const path = require('path');
const fs = require('fs');

// Function to format date as YYYY-MM-DD
const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const logFileName = `${getFormattedDate()}.logs`;

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, logFileName),
      format: winston.format.combine(
        winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        winston.format.align(),
        winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`)
      ),
      maxsize: 1024 * 1024 * 10, // Rotate file when it reaches 10MB
      maxFiles: 5, // Keep up to 5 log files
    }),
    new winston.transports.MongoDB({
      level: 'error',
      db: process.env.MONGODB_URI,
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

module.exports = logger;
