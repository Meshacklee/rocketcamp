// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Built-in Node.js module for generating tokens
const User = require('../models/User');
const Joi = require('joi');
const { sendVerificationEmail } = require('../utils/email'); // Import the email utility

const router = express.Router();

// Validation Schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// REGISTER Route
router.post('/register', async (req, res) => {
  try {
    await registerSchema.validateAsync(req.body);

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate a unique verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({ name, email, password, verificationToken });
    await user.save();

    // Send verification email
    try {
        await sendVerificationEmail(user.email, user.verificationToken);
        res.status(201).json({ message: 'User registered successfully! Please check your email to verify your account.' });
    } catch (emailError) {
        // If email fails, you might want to delete the user or mark them for manual verification
        // For now, let's just log the error and return a message
        console.error('Failed to send verification email:', emailError);
        // It's important not to leak this error to the client
        res.status(201).json({ message: 'User registered successfully! (Note: Verification email failed to send, please contact support if you do not receive it.)' });
    }

  } catch (err) {
    if (err.isJoi) {
      return res.status(400).json({ error: err.details[0].message });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// LOGIN Route
// ... (Keep your existing login route logic)
// Make sure to check if user.isVerified before issuing a token
router.post('/login', async (req, res) => {
  try {
    await loginSchema.validateAsync(req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // --- Add check for verification ---
    if (!user.isVerified) {
      return res.status(400).json({ error: 'Please verify your email address before logging in.' });
    }
    // ---

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      userId: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    if (err.isJoi) {
      return res.status(400).json({ error: err.details[0].message });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// VERIFY Email Route (NEW)
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token.' });
    }

    // Update user: mark as verified, remove token
    user.isVerified = true;
    user.verificationToken = undefined; // Remove the token
    await user.save();

    // Optionally, redirect to a frontend page or return a success message
    // For now, a simple JSON response
    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during verification' });
  }
});


// routes/auth.js
// ... (existing code)

// Add this route *after* your other routes but before the module.exports
router.put('/change-password', require('../middleware/auth'), async (req, res) => {
  try {
    // Validate the new password (you can add more complex rules)
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    // req.user.userId comes from the auth middleware
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: 'Password changed successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while changing password' });
  }
});


// routes/auth.js

// ... (existing code for register, login, verify, change-password)

// GET Profile Route (Protected)
router.get('/profile', require('../middleware/auth'), async (req, res) => {
  try {
    // req.user.userId is set by the auth middleware
    const user = await User.findById(req.user.userId).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error in profile route:', err); // Add this for debugging
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
});

module.exports = router;