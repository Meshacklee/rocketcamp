// src/pages/EditExpense.js
import React from 'react'; // Import React
import { useLocation, useNavigate } from 'react-router-dom'; // Import hooks
import ExpenseForm from '../components/ExpenseForm'; // Import the ExpenseForm component

const EditExpense = ({ onExpenseSaved }) => { // Accept prop
  const location = useLocation(); // Use the hook
  const navigate = useNavigate(); // Use the hook
  const expenseToEdit = location.state?.expense; // Use the hook

  if (!expenseToEdit) {
    return <div>Expense not found.</div>;
  }

  const handleSave = () => {
    console.log("EditExpense: onSave called, triggering parent refetch");
    if (onExpenseSaved) onExpenseSaved(); // Call parent's refetch function if passed
    // navigate('/dashboard'); // Already handled in ExpenseForm
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto">
        <ExpenseForm expenseToEdit={expenseToEdit} onSave={handleSave} /> {/* Pass the function */}
      </div>
    </div>
  );
};

export default EditExpense;
