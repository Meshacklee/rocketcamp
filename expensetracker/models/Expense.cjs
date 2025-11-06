// models/Expense.cjs (or .js)
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  // Keep the amount as a Number for calculations
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be positive']
  },
  // Add a currency field
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'USD', // Default to USD or whatever your primary currency is
    enum: { // Define allowed currencies
      values: ['USD', 'EUR', 'GBP', 'NGN', 'KES', 'GHS', 'ZAR', 'CAD', 'AUD', 'JPY', 'CNY', 'INR', 'BRL', 'MXN', 'SGD'], // Add more as needed
      message: 'Invalid currency code'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description too long']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Other'],
      message: 'Invalid category'
    }
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }]
}, {
  timestamps: true
});

// Index for performance (user + date + currency might be useful for reports)
ExpenseSchema.index({ user: 1, date: -1, currency: 1 });

module.exports = mongoose.model('Expense', ExpenseSchema);
