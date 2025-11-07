// src/components/ExpenseList.js
import React from 'react';

const ExpenseList = ({ expenses, loading, onEdit, onDelete }) => {
  console.log("ExpenseList received expenses:", expenses, "loading:", loading);

  if (loading) {
    return <p className="loading-message">Loading expenses...</p>;
  }

  if (!expenses || expenses.length === 0) {
    return <p className="empty-message">No expenses found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount (Currency)</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
              <td>{expense.description || expense.title || 'N/A'}</td>
              <td>
                <span className={`category-tag category-${expense.category}`}>
                  {expense.category}
                </span>
              </td>
              <td>{expense.amount.toFixed(2)} {expense.currency}</td>
              <td>{expense.tags && expense.tags.length > 0 ? expense.tags.join(', ') : 'N/A'}</td>
              <td>
                <button
                  onClick={() => onEdit(expense)}
                  className="btn btn-primary btn-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(expense._id)}
                  className="btn btn-danger btn-sm ml-2" // Add ml-2 class if you define it in App.css for margin-left
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
