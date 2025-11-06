// routes/expenses.cjs
const express = require('express');
const { protect } = require('../middleware/auth.cjs'); // Ensure the middleware file is renamed to .cjs and update the path
const { 
  createExpense, 
  getExpenses, 
  getSummary,
  updateExpense,    
  deleteExpense 
} = require('../controllers/expenseController.cjs'); // Also ensure the expense controller is renamed to .cjs and update the path

const router = express.Router();

router.route('/')
  .post(protect, createExpense)
  .get(protect, getExpenses);

router.route('/:id')
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);

router.route('/summary')
  .get(protect, getSummary);

module.exports = router;