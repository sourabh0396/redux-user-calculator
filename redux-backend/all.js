
// Required modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const math = require('mathjs');
const winston = require('winston');
require('winston-mongodb');
const path = require('path');
const fs = require('fs');

// Create logger instance
const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const logFileName = `${getFormattedDate()}.logs`;
const logsDir = path.join(__dirname, 'logs');
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
        winston.format.printf((info) => `${info.level}: ${info.timestamp}: ${info.message}`)
      ),
      maxsize: 1024 * 1024 * 10, // 10MB
      maxFiles: 5,
    }),
    new winston.transports.MongoDB({
      level: 'error',
      db: process.env.MONGODB_URI,
      options: { useUnifiedTopology: true },
      collection: 'server_logs',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    logger.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

// Define schemas and models
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 3, maxlength: 15 },
  lastName: { type: String, minlength: 3, maxlength: 15 },
  email: { type: String, required: true, minlength: 5, maxlength: 50, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true, min: 10, max: 115 },
  homeAddress: { type: String, required: true, minlength: 10, maxlength: 100 },
  primaryColor: { type: String, required: true, minlength: 3, maxlength: 10 },
  secondaryColor: { type: String, required: true, minlength: 3, maxlength: 10 },
  logo: { type: String, required: true, match: /^https:\/\/.*$/, minlength: 10, maxlength: 500 }
});

const User = mongoose.model('User', userSchema);

const calculatorLogSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  expression: { type: String, required: true },
  isValid: { type: Boolean, required: true },
  output: { type: Number, required: true },
  createdOn: { type: Date, default: Date.now }
});

const CalculatorLog = mongoose.model('CalculatorLog', calculatorLogSchema);

const counterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: Number
});

const Counter = mongoose.model('Counter', counterSchema);

// Initialize counters
const initCounters = async () => {
  const existingCounter = await Counter.findById('calculatorLogId');
  if (!existingCounter) {
    await Counter.create({ _id: 'calculatorLogId', sequence_value: 0 });
  }
};
initCounters();

// Middleware for database operations
const handleDbOperation = (operation) => async (req, res, next) => {
  try {
    await operation(req, res);
  } catch (error) {
    logger.error(`Database operation error: ${error.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Express app setup
const app = express();
app.use(cors());
app.use(express.json());

// Route handlers
// Register new user
app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, homeAddress, primaryColor, secondaryColor, logo } = req.body;
    if (!firstName || !email || !password || !homeAddress || !primaryColor || !secondaryColor || !logo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashedPassword, age, homeAddress, primaryColor, secondaryColor, logo });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { firstName, lastName, email } });
  } catch (error) {
    logger.error('Error during registration:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// User login route
app.post('/api/signIn', async (req, res) => {
  try {
      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).json({ error: 'Missing email or password' });
      }

      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ token, user: { firstName: user.firstName, lastName: user.lastName, email: user.email } });
  } catch (error) {
      console.error('Error during sign in:', error);
      res.status(500).json({ error: 'Server error' });
  }
});
// app.post('/api/signin', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: 'User not found' });
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ error: 'Invalid password' });
//     }
//     // Create JWT token
//     const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
//       expiresIn: '1h', // Token expires in 1 hour
//     });
//     res.status(200).json({ token, user: { firstName: user.firstName, lastName: user.lastName, email: user.email } });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });
// const authenticateJWT = (req, res, next) => {
//   const token = req.headers['authorization'];
  
//   if (token) {
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//       if (err) {
//         return res.sendStatus(403);
//       }
//       req.user = user;
//       next();
//     });
//   } else {
//     res.sendStatus(401); // Unauthorized
//   }
// };

// // Example protected route
// app.get('/api/protected', authenticateJWT, (req, res) => {
//   res.json({ message: 'This is a protected route' });
// });

// Route to get a specific user profile by email
app.get('/api/profile', async (req, res) => {
    try {
      const email = req.query.email;  
      if (!email) {
        return res.status(400).json({ error: 'Email query parameter is required' });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { firstName, lastName, password, age, homeAddress, primaryColor, secondaryColor, logo } = user;
      res.json({ firstName, lastName, email,password, age, homeAddress, primaryColor, secondaryColor, logo });
    } catch (error) {
      logger.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // for edit profile
  app.put('/api/profile', async (req, res) => {
    try {
      const { firstName, lastName, age, homeAddress, primaryColor, secondaryColor, logo } = req.body;
      const { email } = req.query;

      // Check if email is provided in the query parameter
      if (!email) {
        return res.status(400).json({ error: 'Email is required for updating profile' });
      }
  
      // Validate that the required fields are provided in the body
      if (!firstName || !lastName || !age || !homeAddress || !primaryColor || !secondaryColor || !logo) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Update the user's profile
      const updatedUser = await User.findOneAndUpdate(
        { email }, // Find the user by email
        { firstName, lastName, age, homeAddress, primaryColor, secondaryColor, logo }, // Update fields
        { new: true, runValidators: true } // Return the updated document and run schema validations
      );
  
      // If no user is found, return 404
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Return the updated user data
      res.json(updatedUser);
    } catch (error) {
      logger.error('Error updating profile:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  
// Unified profile route handler (GET & PUT)
app.route('/api/profile')
  .get(async (req, res) => {
    try {
      const email = req.query.email;

      if (!email) {
        return res.status(400).json({ error: 'Email query parameter is required' });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { firstName, lastName, age, homeAddress, primaryColor, secondaryColor, logo } = user;
      res.json({ firstName, lastName, email, age, homeAddress, primaryColor, secondaryColor, logo });
    } catch (error) {
      logger.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Server error' });
    }
  })
  .put(async (req, res) => {
    try {
      const { firstName, lastName, age, homeAddress, primaryColor, secondaryColor, logo } = req.body;
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({ error: 'Email is required for updating profile' });
      }

      const updatedUser = await User.findOneAndUpdate(
        { email },
        { firstName, lastName, age, homeAddress, primaryColor, secondaryColor, logo },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(updatedUser);
    } catch (error) {
      logger.error('Error updating profile:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
////


// Calculator logs
app.post('/api/logs', handleDbOperation(async (req, res) => {
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

  const nextId = await Counter.findByIdAndUpdate(
    'calculatorLogId',
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  ).then(doc => doc.sequence_value);

  const calculatorLog = new CalculatorLog({ id: nextId, expression, isValid, output });
  await calculatorLog.save();
  logger.info(`Expression logged: ${expression} | Valid: ${isValid}`);

  return res.json({
    message: isValid ? `Expression evaluated to ${output}` : 'Invalid expression',
    output: isValid ? output : null,
    isValid
  });
}));

// Get calculator logs with pagination and search functionality
app.get('/api/logs', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = req.query.search || '';

  const query = search ? { expression: { $regex: search, $options: 'i' } } : {};
  const totalLogs = await CalculatorLog.countDocuments(query);
  const totalPages = Math.ceil(totalLogs / limit);

  const logs = await CalculatorLog.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdOn: -1 });

  res.json({
    totalLogs,
    totalPages,
    currentPage: page,
    logs
  });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  logger.error(`Internal server error: ${err.message}`);
  res.status(500).json({ message: 'An error occurred on the server' });
});

// Start the server
const port = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
// // server.js


// // Required modules
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const math = require('mathjs');
// const winston = require('winston');
// require('winston-mongodb');
// const path = require('path');
// const fs = require('fs');

// // Create a logger instance
// const getFormattedDate = () => {
//   const date = new Date();
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// const logFileName = `${getFormattedDate()}.logs`;
// const logsDir = path.join(__dirname, 'logs');
// if (!fs.existsSync(logsDir)) {
//   fs.mkdirSync(logsDir);
// }

// const logger = winston.createLogger({
//   level: 'info',
//   transports: [
//     new winston.transports.File({
//       filename: path.join(logsDir, logFileName),
//       format: winston.format.combine(
//         winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
//         winston.format.align(),
//         winston.format.printf(info => `${info.level}: ${info.timestamp}: ${info.message}`)
//       ),
//       maxsize: 1024 * 1024 * 10, // 10MB
//       maxFiles: 5,
//     }),
//     new winston.transports.MongoDB({
//       level: 'error',
//       db: process.env.MONGODB_URI,
//       options: { useUnifiedTopology: true },
//       collection: 'server_logs',
//       format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json()
//       )
//     })
//   ]
// });

// // Database connection
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
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

// // Define schemas and models
// const userSchema = new mongoose.Schema({
//   firstName: { type: String, required: true, minlength: 3, maxlength: 15 },
//   lastName: { type: String, minlength: 3, maxlength: 15 },
//   email: { type: String, required: true, minlength: 5, maxlength: 50, unique: true },
//   password: { type: String, required: true },
//   age: { type: Number, required: true, min: 10, max: 115 },
//   homeAddress: { type: String, required: true, minlength: 10, maxlength: 100 },
//   primaryColor: { type: String, required: true, minlength: 3, maxlength: 10 },
//   secondaryColor: { type: String, required: true, minlength: 3, maxlength: 10 },
//   logo: { type: String, required: true, match: /^https:\/\/.*$/, minlength: 10, maxlength: 500 }
// });

// const User = mongoose.model('User', userSchema);

// const calculatorLogSchema = new mongoose.Schema({
//   id: { type: Number, required: true },
//   expression: { type: String, required: true },
//   isValid: { type: Boolean, required: true },
//   output: { type: Number, required: true },
//   createdOn: { type: Date, default: Date.now }
// });

// const CalculatorLog = mongoose.model('CalculatorLog', calculatorLogSchema);

// const counterSchema = new mongoose.Schema({
//   _id: String,
//   sequence_value: Number
// });

// const Counter = mongoose.model('Counter', counterSchema);

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

// // Express app setup
// const app = express();
// app.use(cors());
// app.use(express.json());

// // Route handlers
// app.post('/api/register', async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, age, homeAddress, primaryColor, secondaryColor, logo } = req.body;

//     if (!firstName || !email || !password || !homeAddress || !primaryColor || !secondaryColor || !logo) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already in use' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({ firstName, lastName, email, password: hashedPassword, age, homeAddress, primaryColor, secondaryColor, logo });
//     await user.save();

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(201).json({ token, user: { firstName, lastName, email } });
//   } catch (error) {
//     logger.error('Error during registration:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Unified profile route handler
// app.route('/api/profile')
//   .get(async (req, res) => {
//     try {
//       const email = req.query.email;
  
//       if (!email) {
//         return res.status(400).json({ error: 'Email query parameter is required' });
//       }
  
//       const user = await User.findOne({ email });
  
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
  
//       const { firstName, lastName, age, homeAddress, primaryColor, secondaryColor, logo } = user;
//       res.json({ firstName, lastName, email, age, homeAddress, primaryColor, secondaryColor, logo });
//     } catch (error) {
//       logger.error('Error fetching profile:', error);
//       res.status(500).json({ error: 'Server error' });
//     }
//   })
//   .put(async (req, res) => {
//     try {
//       const { firstName, lastName, age, homeAddress, primaryColor, secondaryColor, logo } = req.body;
//       const { email } = req.query;
  
//       const updatedUser = await User.findOneAndUpdate(
//         { email },
//         { firstName, lastName, age, homeAddress, primaryColor, secondaryColor, logo },
//         { new: true }
//       );
  
//       if (!updatedUser) {
//         return res.status(404).json({ error: 'User not found' });
//       }
  
//       res.json(updatedUser);
//     } catch (error) {
//       res.status(500).json({ error: 'Server error' });
//     }
//   });

// /// Calculator routes

// app.post('/api/logs', handleDbOperation(async (req, res) => {
//   const { expression } = req.body;
//   if (!expression) {
//     logger.info('Received an empty expression');
//     return res.status(400).json({ message: 'Expression is empty' });
//   }

//   let output = null;
//   let isValid = true;
//   try {
//     output = math.evaluate(expression);
//     output = parseFloat(output.toFixed(2));
//     isValid = true;
//   } catch (err) {
//     logger.warn(`Invalid expression attempted: ${expression}`);
//     isValid = false;
//   }

//   const nextId = await Counter.findByIdAndUpdate(
//     'calculatorLogId',
//     { $inc: { sequence_value: 1 } },
//     { new: true, upsert: true }
//   ).then(doc => doc.sequence_value);

//   const calculatorLog = new CalculatorLog({ id: nextId, expression, isValid, output });
//   await calculatorLog.save();
//   logger.info(`Expression logged: ${expression} | Valid: ${isValid}`);

//   return res.json({
//     message: isValid ? `Expression evaluated to ${output}` : 'Invalid expression',
//     output: isValid ? output : null,
//     isValid
//   });
// }));

// app.get('/api/logs', async (req, res) => {
//   const page = parseInt(req.query.page, 10) || 1;
//   const limit = parseInt(req.query.limit, 10) || 1000;
//   const search = req.query.search;

//   try {
//     const query = search
//       ? {
//           $or: [
//             { expression: new RegExp(search, 'i') },
//             { output: new RegExp(search, 'i') }
//           ]
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
//     logger.error('Error fetching logs:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   connectDB();
// });

// // server.js

// // Required modules
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const math = require('mathjs');
// const winston = require('winston');
// require('winston-mongodb');
// const path = require('path');
// const fs = require('fs');

// // Create a logger instance
// const getFormattedDate = () => {
//   const date = new Date();
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// const logFileName = `${getFormattedDate()}.logs`;
// const logsDir = path.join(__dirname, 'logs');
// if (!fs.existsSync(logsDir)) {
//   fs.mkdirSync(logsDir);
// }

// const logger = winston.createLogger({
//   level: 'info',
//   transports: [
//     new winston.transports.File({
//       filename: path.join(logsDir, logFileName),
//       format: winston.format.combine(
//         winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
//         winston.format.align(),
//         winston.format.printf(info => `${info.level}: ${info.timestamp}: ${info.message}`)
//       ),
//       maxsize: 1024 * 1024 * 10, // 10MB
//       maxFiles: 5,
//     }),
//     new winston.transports.MongoDB({
//       level: 'error',
//       db: process.env.MONGODB_URI,
//       options: { useUnifiedTopology: true },
//       collection: 'server_logs',
//       format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json()
//       )
//     })
//   ]
// });

// // Database connection
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
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

// // Define schemas and models
// const userSchema = new mongoose.Schema({
//   firstName: { type: String, required: true, minlength: 3, maxlength: 15 },
//   lastName: { type: String, minlength: 3, maxlength: 15 },
//   email: { type: String, required: true, minlength: 5, maxlength: 50, unique: true },
//   password: { type: String, required: true },
//   age: { type: Number, required: true, min: 10, max: 115 },
//   homeAddress: { type: String, required: true, minlength: 10, maxlength: 100 },
//   primaryColor: { type: String, required: true, minlength: 3, maxlength: 10 },
//   secondaryColor: { type: String, required: true, minlength: 3, maxlength: 10 },
//   logo: { type: String, required: true, match: /^https:\/\/.*$/, minlength: 10, maxlength: 500 }
// });

// const User = mongoose.model('User', userSchema);

// const calculatorLogSchema = new mongoose.Schema({
//   id: { type: Number, required: true },
//   expression: { type: String, required: true },
//   isValid: { type: Boolean, required: true },
//   output: { type: Number, required: true },
//   createdOn: { type: Date, default: Date.now }
// });

// const CalculatorLog = mongoose.model('CalculatorLog', calculatorLogSchema);

// const counterSchema = new mongoose.Schema({
//   _id: String,
//   sequence_value: Number
// });

// const Counter = mongoose.model('Counter', counterSchema);

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

// // Express app setup
// const app = express();
// app.use(cors());
// app.use(express.json());

// // Route handlers
// app.post('/api/register', async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, age, homeAddress, primaryColor, secondaryColor, logo } = req.body;

//     if (!firstName || !email || !password || !homeAddress || !primaryColor || !secondaryColor || !logo) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already in use' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({ firstName, lastName, email, password: hashedPassword, age, homeAddress, primaryColor, secondaryColor, logo });
//     await user.save();

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(201).json({ token, user: { firstName, lastName, email } });
//   } catch (error) {
//     logger.error('Error during registration:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.get('/api/profile', async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.query.email });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const { firstName, lastName, password, email, age, homeAddress, primaryColor, secondaryColor, logo } = user;
//     res.json({ firstName, lastName, password, email, age, homeAddress, primaryColor, secondaryColor, logo });
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.put('/api/profile', async (req, res) => {
//   try {
//     const { firstName, lastName, age, homeAddress, primaryColor, secondaryColor, logo } = req.body;
//     const { email } = req.query;

//     const updatedUser = await User.findOneAndUpdate(
//       { email },
//       { firstName, lastName, age, homeAddress, primaryColor, secondaryColor, logo },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.json(updatedUser);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.get('/api/profile', async (req, res) => {
//     try {
//       const email = req.query.email;
  
//       if (!email) {
//         return res.status(400).json({ error: 'Email query parameter is required' });
//       }
  
//       const user = await User.findOne({ email });
  
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
  
//       const { firstName, lastName, age, homeAddress, primaryColor, secondaryColor, logo } = user;
//       res.json({ firstName, lastName, email, age, homeAddress, primaryColor, secondaryColor, logo });
//     } catch (error) {
//       logger.error('Error fetching profile:', error);
//       res.status(500).json({ error: 'Server error' });
//     }
//   });
  

// /// all for calculator

// app.post('/api/logs', handleDbOperation(async (req, res) => {
//   const { expression } = req.body;
//   if (!expression) {
//     logger.info('Received an empty expression');
//     return res.status(400).json({ message: 'Expression is empty' });
//   }

//   let output = null;
//   let isValid = true;
//   try {
//     output = math.evaluate(expression);
//     output = parseFloat(output.toFixed(2));
//     isValid = true;
//   } catch (err) {
//     logger.warn(`Invalid expression attempted: ${expression}`);
//     isValid = false;
//   }

//   const nextId = await Counter.findByIdAndUpdate(
//     'calculatorLogId',
//     { $inc: { sequence_value: 1 } },
//     { new: true, upsert: true }
//   ).then(doc => doc.sequence_value);

//   const calculatorLog = new CalculatorLog({ id: nextId, expression, isValid, output });
//   await calculatorLog.save();
//   logger.info(`Expression logged: ${expression} | Valid: ${isValid}`);

//   return res.json({
//     message: isValid ? `Expression evaluated to ${output}` : 'Invalid expression',
//     output: isValid ? output : null,
//     isValid
//   });
// }));

// app.get('/api/logs', async (req, res) => {
//   const page = parseInt(req.query.page, 10) || 1;
//   const limit = parseInt(req.query.limit, 10) || 1000;
//   const search = req.query.search;

//   try {
//     const query = search
//       ? {
//           $or: [
//             { expression: new RegExp(search, 'i') },
//             { output: new RegExp(search, 'i') }
//           ]
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
//     logger.error('Error fetching logs:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   connectDB();
// });
