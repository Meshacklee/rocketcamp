// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit'); // Import rate limiter
const path = require('path'); // Import path module

const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing form data if needed

// --- Add Rate Limiting ---
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: 'Too many login attempts from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth/login', loginLimiter); // Apply limit only to login
app.use('/api/auth', authRoutes);

// Example Protected Route (you can keep this)
app.get('/api/profile', require('./middleware/auth'), (req, res) => {
  res.json({ message: 'Protected route accessed!', userId: req.user.userId });
});

// --- Serve Static Files from 'public' folder ---
app.use(express.static(path.join(__dirname, 'public')));

// Default route (this can be removed if index.html is your default, which it will be)
// app.get('/', (req, res) => {
//   res.json({ message: 'Welcome to the Auth API! Use /api/auth/register or /api/auth/login' });
// });
// Instead, let the static file server handle the root route by serving index.html

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));