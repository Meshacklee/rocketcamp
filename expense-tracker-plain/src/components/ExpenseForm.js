// src/components/ExpenseForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

// Add 'onSave' prop to the component
const ExpenseForm = ({ expenseToEdit = null, onSave }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    tags: '',
    currency: 'USD', // Default currency
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        amount: expenseToEdit.amount,
        description: expenseToEdit.description || expenseToEdit.title || '',
        category: expenseToEdit.category,
        date: new Date(expenseToEdit.date).toISOString().split('T')[0],
        tags: expenseToEdit.tags?.join(', ') || '',
        currency: expenseToEdit.currency || 'USD',
      });
    }
  }, [expenseToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        tags: tagsArray,
        description: formData.description,
      };

      let response;
      if (expenseToEdit) {
        response = await API.put(`/expenses/${expenseToEdit._id}`, expenseData);
        alert('Expense updated successfully!');
      } else {
        response = await API.post('/expenses', expenseData);
        alert('Expense added successfully!');
      }

      if (onSave) onSave();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving expense:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'An error occurred while saving the expense.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Other'];
  const currencies = ['USD', 'EUR', 'GBP', 'NGN', 'KES', 'GHS', 'ZAR', 'CAD', 'AUD', 'JPY', 'CNY', 'INR', 'BRL', 'MXN', 'SGD'];

  return (
    <div className="form-container expense-form-container"> {/* Apply container and expense-specific class */}
      <h2 className="form-title">{expenseToEdit ? 'Edit Expense' : 'Add New Expense'}</h2> {/* Apply title class */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"> {/* Use grid for amount/currency on larger screens */}
          <div className="form-group"> {/* Apply group class */}
            <label className="block mb-1 font-medium">Amount</label>
            <input
              type="number"
              name="amount"
              step="0.01"
              className="input" // Apply input class
              value={formData.amount}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group"> {/* Apply group class */}
            <label className="block mb-1 font-medium">Currency</label>
            <select
              name="currency"
              className="select" // Apply select class
              value={formData.currency}
              onChange={handleChange}
              required
              disabled={loading}
            >
              {currencies.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group"> {/* Apply group class */}
          <label className="block mb-1 font-medium">Description</label>
          <input
            type="text"
            name="description"
            className="input" // Apply input class
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group"> {/* Apply group class */}
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category"
            className="select" // Apply select class
            value={formData.category}
            onChange={handleChange}
            required
            disabled={loading}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="form-group"> {/* Apply group class */}
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            name="date"
            className="input" // Apply input class
            value={formData.date}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group"> {/* Apply group class */}
          <label className="block mb-1 font-medium">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            className="input" // Apply input class
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., work, urgent"
            disabled={loading}
          />
        </div>
        <div className="form-actions"> {/* Apply action container class */}
          <button
            type="submit"
            className="btn btn-primary" // Apply button classes
            disabled={loading}
          >
            {loading ? (expenseToEdit ? 'Updating...' : 'Saving...') : (expenseToEdit ? 'Update Expense' : 'Save Expense')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn btn-danger" // Use danger button for cancel
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
