// const mongoose = require('mongoose');
// const logger = require('./logger');

// // const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
// const MONGODB_URI = process.env.MONGODB_URI ;

// // mongodb+srv://sourabhpatil0369:E03jEzYLpOiI30z2@cluster0.uscvgdc.mongodb.net/
// // PORT=5000
// const connectDB = async () => {
//   try {
//     await mongoose.connect(MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     console.log('Connected to MongoDB');
//   } catch (err) {
//     logger.error(`Error connecting to MongoDB: ${err.message}`);
//     console.error('Error connecting to MongoDB:', err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
