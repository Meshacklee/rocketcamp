// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // Import useNavigate
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import EditExpense from './pages/EditExpense';
import ConfirmEmail from './pages/ConfirmEmail';
import './App.css';

// Loading component (simple example)
const Loading = () => <div className="loading-message">Loading...</div>;

// Protected Route Component (example)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return user ? children : <Navigate to="/login" replace />;
};

// Header Component (Updated)
const Header = ({ toggleDarkMode, darkMode }) => { // Removed handleLogout prop
  const { user, logout, defaultCurrency, setDefaultCurrency, getDefaultCurrency } = useAuth(); // Get logout function from context
  const navigate = useNavigate(); // Use navigate hook inside Header

  const availableCurrencies = ['USD', 'EUR', 'GBP', 'NGN', 'KES', 'GHS', 'ZAR', 'CAD', 'AUD', 'JPY', 'CNY', 'INR', 'BRL', 'MXN', 'SGD'];

  const handleCurrencyChange = (e) => {
    setDefaultCurrency(e.target.value);
  };

  // Define the logout handler inside the component
  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/login'); // Navigate to login page after logout
  };

  // Define the home handler inside the component
  const handleHome = () => {
    navigate('/dashboard'); // Navigate to dashboard
  };

  if (!user) {
    // Optionally, return a minimal header or null when not logged in
    return (
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title" onClick={handleHome} style={{ cursor: 'pointer' }}>
            Expense Tracker
          </h1>
          <div className="header-actions">
            <button onClick={toggleDarkMode} className="theme-toggle-btn">
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="app-header">
      <div className="header-content">
        {/* Make the title a link to the dashboard */}
        <h1 className="app-title" onClick={handleHome} style={{ cursor: 'pointer' }}>
          Expense Tracker
        </h1>
        <div className="header-actions">
          {user && (
            <div className="flex items-center gap-4">
              <div className="currency-selector">
                <label htmlFor="defaultCurrency" className="mr-2 text-sm font-medium">Default Currency:</label>
                <select
                  id="defaultCurrency"
                  value={defaultCurrency}
                  onChange={handleCurrencyChange}
                  className="input input-sm"
                >
                  {availableCurrencies.map(code => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>
              {/* Home Button */}
              <button onClick={handleHome} className="btn btn-primary btn-sm">
                Home
              </button>
              {/* Logout Button */}
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          )}
          <button onClick={toggleDarkMode} className="theme-toggle-btn">
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>
    </header>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);

    if (savedMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    if (newMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Removed handleLogout from App component state

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          {/* Pass props to Header, remove handleLogout */}
          <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
          <main className="main-content">
            <div className="main-content-inner">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/confirm/:token" element={<ConfirmEmail />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/expenses/new" element={
                  <ProtectedRoute>
                    <AddExpense />
                  </ProtectedRoute>
                } />
                <Route path="/expenses/edit" element={
                  <ProtectedRoute>
                    <EditExpense />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
