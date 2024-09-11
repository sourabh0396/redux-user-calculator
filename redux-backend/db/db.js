const mongoose = require('mongoose');
const winston = require('winston');

// Database connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    winston.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
