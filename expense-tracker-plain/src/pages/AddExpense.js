// src/pages/AddExpense.js
import React from 'react'; // Import React
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ExpenseForm from '../components/ExpenseForm'; // Import the ExpenseForm component

const AddExpense = ({ onExpenseSaved }) => { // Accept prop
  const navigate = useNavigate(); // Use the hook

  const handleSave = () => {
    console.log("AddExpense: onSave called, triggering parent refetch");
    if (onExpenseSaved) onExpenseSaved(); // Call parent's refetch function if passed
    // navigate('/dashboard'); // Already handled in ExpenseForm
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto">
        <ExpenseForm onSave={handleSave} /> {/* Pass the handleSave function as onSave prop */}
      </div>
    </div>
  );
};

export default AddExpense;
