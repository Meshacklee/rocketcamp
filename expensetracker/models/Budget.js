// models/Budget.cjs (or .js)
const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  category: { // Optional: If null/undefined, it's an overall budget
    type: String,
    enum: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Other', null] // Include null
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, 'Amount must be positive']
  },
  currency: { // Use the same currency list as Expense
    type: String,
    required: [true, 'Currency is required'],
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'NGN', 'KES', 'GHS', 'ZAR', 'CAD', 'AUD', 'JPY', 'CNY', 'INR', 'BRL', 'MXN', 'SGD']
  },
  period: { // e.g., monthly, yearly, custom date range
    type: String,
    required: true,
    enum: ['monthly', 'yearly', 'custom'],
    default: 'monthly'
  },
  startDate: { // Required if period is 'custom'
    type: Date,
  },
  endDate: { // Required if period is 'custom'
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for performance (user + category + period might be useful for reports)
BudgetSchema.index({ user: 1, category: 1, period: 1 });

module.exports = mongoose.model('Budget', BudgetSchema);