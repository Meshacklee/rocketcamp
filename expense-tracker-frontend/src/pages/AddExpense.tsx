// src/pages/AddExpense.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Other'];

const AddExpense: React.FC = () => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    tags: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
      await API.post('/expenses', { ...formData, amount: parseFloat(formData.amount), tags });
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add expense');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Amount ($)</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            className="w-full p-2 border rounded"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <input
            type="text"
            name="description"
            className="w-full p-2 border rounded"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-1">Category</label>
          <select
            name="category"
            className="w-full p-2 border rounded"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            name="date"
            className="w-full p-2 border rounded"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            className="w-full p-2 border rounded"
            value={formData.tags}
            onChange={handleChange}
            placeholder="work, urgent"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Expense
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;