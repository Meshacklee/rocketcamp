// src/pages/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import ExpenseList from '../components/ExpenseList';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user, logout, defaultCurrency } = useAuth(); // Get defaultCurrency from context
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalSpent: 0, breakdown: [] });
  const [filter, setFilter] = useState({ category: '', startDate: '', endDate: '' });
  const navigate = useNavigate();
  const location = useLocation();

  const fetchExpensesAndSummary = useCallback(async () => {
    console.log("Fetching expenses and summary...");
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      if (filter.startDate) params.append('startDate', filter.startDate);
      if (filter.endDate) params.append('endDate', filter.endDate);

      const expensesRes = await API.get(`/expenses?${params.toString()}`);
      console.log("Fetched Expenses Data:", expensesRes.data);

      let fetchedExpenses = [];
      if (expensesRes.data && Array.isArray(expensesRes.data)) {
          fetchedExpenses = expensesRes.data;
      } else if (expensesRes.data && Array.isArray(expensesRes.data.data)) {
          fetchedExpenses = expensesRes.data.data;
      } else if (expensesRes.data && Array.isArray(expensesRes.data.expenses)) {
          fetchedExpenses = expensesRes.data.expenses;
      }

      console.log("Expenses Array (from correct path):", fetchedExpenses);
      setExpenses(fetchedExpenses);

      // --- CALCULATE SUMMARY BASED ON DEFAULT CURRENCY ---
      const allExpenses = fetchedExpenses;
      const expensesInDefaultCurrency = allExpenses.filter(e => e.currency === defaultCurrency);

      const categoryTotals = expensesInDefaultCurrency.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {});
      const breakdown = Object.entries(categoryTotals).map(([name, total]) => ({ name, total }));
      const totalSpent = expensesInDefaultCurrency.reduce((sum, exp) => sum + exp.amount, 0);

      console.log(`Calculated Summary for ${defaultCurrency}:`, { totalSpent, breakdown });
      setSummary({ totalSpent, breakdown, details: { allExpenses, expensesInDefaultCurrency } });
      // --- END CALCULATION ---
    } catch (err) {
      console.error('Error fetching data:', err);
      setExpenses([]); // Clear expenses on error
      setSummary({ totalSpent: 0, breakdown: [] }); // Clear summary on error
    } finally {
      setLoading(false);
    }
  }, [API, filter, defaultCurrency]); // Add defaultCurrency to dependencies

  // Log state changes for debugging
  useEffect(() => {
    console.log("Dashboard Expenses State Updated:", expenses);
  }, [expenses]);

  // Fetch data on initial load and when user/filter changes
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchExpensesAndSummary(); // Initial fetch
  }, [user, navigate, fetchExpensesAndSummary]);

  // Fetch data when the location changes to this component (e.g., after adding/editing)
  useEffect(() => {
      if (user && location.pathname === '/dashboard') {
          console.log("Location changed to /dashboard, refetching data...");
          fetchExpensesAndSummary();
      }
  }, [location, user, fetchExpensesAndSummary]);


  const handleEdit = (expense) => {
    navigate('/expenses/edit', { state: { expense } });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await API.delete(`/expenses/${id}`);
        alert('Expense deleted successfully!');
        // Refetch after deletion to update list and summary
        fetchExpensesAndSummary();
      } catch (error) {
        console.error('Error deleting expense:', error);
        const errorMessage = error.response?.data?.error || error.response?.data?.message || 'An error occurred while deleting the expense.';
        alert(`Failed to delete expense: ${errorMessage}`);
      }
    }
  };

  // Define handleExpenseSaved inside Dashboard component
  const handleExpenseSaved = () => {
      console.log("handleExpenseSaved called in Dashboard, refetching...");
      fetchExpensesAndSummary();
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

  if (!user) return <div className="loading-message">Loading...</div>;

  return (
    <div>
      {/* Summary Cards - Show default currency and amount without hardcoded $ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-medium">Total Spent ({defaultCurrency})</h3>
          {/* Display amount without hardcoded currency symbol */}
          <p className="mt-2 text-2xl font-semibold">{summary.totalSpent.toFixed(2)} {defaultCurrency}</p>
        </div>
        {/* Add more summary cards if needed */}
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <h3 className="text-lg font-medium mb-4">Filter Expenses</h3>
        <div className="filter-grid">
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              value={filter.category}
              onChange={(e) => setFilter({...filter, category: e.target.value})}
              className="input"
            >
              <option value="">All Categories</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Start Date</label>
            <input
              type="date"
              value={filter.startDate}
              onChange={(e) => setFilter({...filter, startDate: e.target.value})}
              className="input"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">End Date</label>
            <input
              type="date"
              value={filter.endDate}
              onChange={(e) => setFilter({...filter, endDate: e.target.value})}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-medium mb-4">Spending by Category (Pie Chart)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={summary.breakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {summary.breakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {/* Use defaultCurrency in tooltip */}
              <Tooltip formatter={(value) => [`${value.toFixed(2)} ${defaultCurrency}`, 'Amount']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="text-lg font-medium mb-4">Spending by Category (Bar Chart)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={summary.breakdown}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              {/* Use defaultCurrency in tooltip */}
              <Tooltip formatter={(value) => [`${value.toFixed(2)} ${defaultCurrency}`, 'Amount']} />
              <Legend />
              <Bar dataKey="total" name={`Amount (${defaultCurrency})`} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Expense Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/expenses/new')}
          className="btn btn-primary"
        >
          + Add Expense
        </button>
      </div>

      {/* Expense List */}
      <div className="card">
        <h3 className="text-lg font-medium mb-4">Recent Expenses</h3>
        <div className="table-container">
            <ExpenseList
              expenses={expenses}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
