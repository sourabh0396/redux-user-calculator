require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const jwt = require('jsonwebtoken');

// const loggingRoutes = require('../redux-backend/routes/loggingRoutes'); // Adjust the path as needed



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to database
connectDB();

// JWT Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Routes
app.use('/auth', authRoutes);
app.use('/profile', authenticate, profileRoutes);
app.use('/calculations', authenticate, calculatorRoutes);

// app.use('/api', loggingRoutes);
// 404 Route
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// require('dotenv').config(); // Load environment variables from .env file

// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const logRoutes = require('./routes/logs');
// const logger = require('./config/logger');



// const authRoutes = require('./controllers/authController.js');
// const profileRoutes = require('./controllers/profileController.js');
// // Initialize Express app
// const app = express();
// app.use(cors());
// app.use(express.json());


// // Connect to MongoDB
// connectDB();

// // Use routes
// app.use('/', logRoutes);
// app.use('/api', logRoutes);

// app.use('/api/auth', authRoutes);
// app.use('/api/profile', profileRoutes);

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   logger.info(`Server started on port ${PORT}`);
// });