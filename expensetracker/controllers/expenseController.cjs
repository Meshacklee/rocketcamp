// controllers/expenseController.js
const Expense = require('../models/Expense.cjs'); // Updated path
const User = require('../models/User.cjs');       // Updated path
const { protect } = require('../middleware/auth.cjs'); // Updated path

// ... rest of your controller functions using these models ...
// @desc    Create an expense
// @route   POST /api/expenses
// @access  Private
exports.createExpense = async (req, res) => {
  try {
    const { amount, description, category, date, tags } = req.body;

    const expense = await Expense.create({
      user: req.user.id,
      amount,
      description,
      category,
      date: date || Date.now(),
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (err) {
    console.error('Create expense error:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(err.errors).map(e => e.message).join(', ') });
    }
    res.status(500).json({ error: 'Failed to create expense' });
  }
};

// @desc    Get all expenses (with filtering)
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 10 } = req.query;

    let query = { user: req.user.id };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Expense.countDocuments(query);

    res.json({
      success: true,
      count: expenses.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: expenses
    });
  } catch (err) {
    console.error('Get expenses error:', err.message);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

// @desc    Get monthly summary by category
// @route   GET /api/expenses/summary
// @access  Private
exports.getSummary = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month required (e.g., ?year=2025&month=10)' });
    }

    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const summary = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    const totalSpent = summary.reduce((sum, item) => sum + item.total, 0);

    res.json({
      success: true,
      month: `${year}-${month.padStart(2, '0')}`,
      totalSpent,
      breakdown: summary
    });
  } catch (err) {
    console.error('Summary error:', err.message);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Only owner can update
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this expense' });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true,  updatedExpense });
  } catch (err) {
    console.error('Update expense error:', err.message);
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id; // Get the ID from the URL parameter
    const userId = req.user.id; // Get the authenticated user's ID from the protect middleware

    // Find the expense by ID and ensure it belongs to the authenticated user
    const expense = await Expense.findOne({ _id: expenseId, user: userId });

    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found or not authorized to delete.' });
    }

    // Delete the expense
    await expense.deleteOne(); // Or await Expense.findByIdAndDelete(expenseId) if you prefer

    res.status(200).json({ success: true, message: 'Expense deleted successfully.' });
  } catch (err) {
    console.error('Delete expense error:', err.message);
    res.status(500).json({ success: false, error: 'Server error during deletion.' });
  }
};

