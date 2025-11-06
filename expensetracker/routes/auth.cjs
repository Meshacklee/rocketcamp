// routes/auth.cjs
const express = require('express');
const { 
  register, 
  confirmEmail, 
  login, 
  forgotPassword,     
  resetPassword 
} = require('../controllers/authController.cjs'); // 👈 Ensure the file is renamed to .cjs and update the path

const router = express.Router();

router.post('/register', register);
router.get('/confirm/:token', confirmEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);      
router.patch('/reset-password/:token', resetPassword); 

module.exports = router;